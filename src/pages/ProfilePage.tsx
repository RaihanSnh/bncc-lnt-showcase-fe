import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from "@/components/ui/button";
import { User } from '@/pages/ProjectInterfaces';
import Navbar from '@/components/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from 'sonner';
import Cropper, { type Point, type Area } from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import getCroppedImg from '@/lib/cropImage';

function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Cropper State
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [open, setOpen] = useState(false);

  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [region, setRegion] = useState('');

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      setCurrentUser(user);
      setUsername(user.username);
      setRegion(user.region);
    } else {
      navigate({ to: '/login' });
    }
  }, [navigate]);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImgSrc(reader.result?.toString() || '');
        setOpen(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const showCroppedImage = useCallback(async () => {
    try {
      if (!imgSrc || !croppedAreaPixels) {
        return;
      }
      const croppedImage = await getCroppedImg(
        imgSrc,
        croppedAreaPixels
      );
      
      if (!croppedImage) {
        toast.error('Failed to crop image.');
        return;
      }

      const formData = new FormData();
      formData.append('profile_picture', croppedImage, 'profile.png');
      
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found. Please login again.');
        return;
      }
  
      const promise = () => new Promise(async (resolve, reject) => {
          const response = await fetch('http://localhost:8080/user/profile-picture', {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${token}`,
              },
              body: formData,
          });
  
          if (!response.ok) {
              const errorData = await response.json();
              reject(new Error(errorData.error || 'Failed to upload profile picture.'));
          } else {
              const result = await response.json();
              if (currentUser) {
                  const updatedUser = { ...currentUser, profile_image_url: result.profileImageURL };
                  setCurrentUser(updatedUser);
                  localStorage.setItem('user', JSON.stringify(updatedUser));
              }
              setOpen(false);
              resolve(result);
          }
      });
  
      toast.promise(promise, {
        loading: 'Uploading profile picture...',
        success: 'Profile picture updated successfully!',
        error: (err: Error) => err.message,
      });

    } catch (e: any) {
      toast.error(e.message);
    }
  }, [imgSrc, croppedAreaPixels, currentUser]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication token not found. Please login again.');
      return;
    }

    const payload: { username: string, region: string, password?: string } = {
        username,
        region,
    };

    if (password) {
        payload.password = password;
    }

    const promise = () => new Promise(async (resolve, reject) => {
        const response = await fetch('http://localhost:8080/user/profile', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            reject(new Error(errorData.error || 'Failed to update profile.'));
        } else {
            const result = await response.json();
            setCurrentUser(result.user);
            localStorage.setItem('user', JSON.stringify(result.user));
            setPassword(''); // Clear password field
            resolve(result);
        }
    });

    toast.promise(promise, {
        loading: 'Updating profile...',
        success: 'Profile updated successfully!',
        error: (err: Error) => err.message,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {currentUser && (
          <div className="max-w-2xl mx-auto grid gap-8">
            <div className="p-6 bg-white rounded-lg shadow-sm flex items-center space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={currentUser.profile_image_url} alt={currentUser.username} />
                <AvatarFallback>{currentUser.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{currentUser.username}</h1>
                <p className="text-gray-500">{currentUser.email}</p>
                 <p className="text-gray-500">Region: {currentUser.region}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Profile Picture
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onSelectFile}
                  className="hidden"
                  accept="image/png, image/jpeg"
                />
              </div>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Change password if you want to" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="region">Region</Label>
                            <Select value={region} onValueChange={setRegion}>
                                <SelectTrigger>
                                <SelectValue placeholder="Select region" />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="KMG">KMG (Kemanggisan)</SelectItem>
                                <SelectItem value="ALS">ALS (Alam Sutera)</SelectItem>
                                <SelectItem value="BDG">BDG (Bandung)</SelectItem>
                                <SelectItem value="MLG">MLG (Malang)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit">Save Changes</Button>
                    </form>
                </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crop your new profile picture</DialogTitle>
            <DialogDescription>
              Adjust the image below to select the perfect crop for your new profile picture.
            </DialogDescription>
          </DialogHeader>
          <div className="relative h-64">
            <Cropper
              image={imgSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              cropShape="round"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={showCroppedImage}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProfilePage; 