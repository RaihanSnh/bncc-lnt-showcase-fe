import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { User } from '@/pages/ProjectInterfaces';

function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userJSON = localStorage.getItem('user');
    if (userJSON) {
      const user = JSON.parse(userJSON);
      setCurrentUser(user);
      setUsername(user.username);
      setEmail(user.email);
    }
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    const updateData: any = {
      username,
      email,
    };

    if (password) {
      updateData.password = password;
    }
    
    const token = localStorage.getItem('token');

    const promise = () => new Promise(async (resolve, reject) => {
      const response = await fetch('http://localhost:8080/user/profile', { // Assuming this endpoint exists
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        reject(new Error(data.error || 'Failed to update profile.'));
      } else {
        // Update localStorage with new user data
        localStorage.setItem('user', JSON.stringify(data.user));
        setCurrentUser(data.user);
        toast.success('Profile updated successfully!');
        resolve(data);
      }
    });

    toast.promise(promise, {
      loading: 'Updating profile...',
      success: 'Profile updated!',
      error: (err) => err.message,
    });

    setIsLoading(false);
  };

  if (!currentUser) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto text-center py-10">
          <p>Loading user profile...</p>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto py-10 flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your account details below.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <hr />
              <p className="text-sm text-gray-500">Only fill in the password fields if you want to change your password.</p>
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Profile'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProfilePage; 