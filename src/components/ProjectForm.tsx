import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Project } from '@/pages/ProjectInterfaces';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { X } from "lucide-react";

interface ProjectFormProps {
  project?: Project;
  onSubmit: (projectData: FormData) => Promise<void>;
  isLoading: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSubmit, isLoading }) => {
  const [projectName, setProjectName] = useState(project?.project_name || '');
  const [projectDescription, setProjectDescription] = useState(project?.project_description || '');
  const [githubUrl, setGithubUrl] = useState(project?.github_url || '');
  const [websiteUrl, setWebsiteUrl] = useState(project?.website_url || '');
  const [stack, setStack] = useState<string[]>(project?.stack ? JSON.parse(project.stack) : []);
  const [newStack, setNewStack] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(project?.thumbnail_url || '');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(project?.images || []);
  const [contributors, setContributors] = useState<User[]>(project?.contributors ? JSON.parse(project.contributors) : []);
  const [region, setRegion] = useState(project?.region || '');
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedContributor, setSelectedContributor] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsersAndSetInitialContributor = async () => {
      try {
        // Fetch all users
        const response = await fetch('http://localhost:8080/users');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const allUsers = await response.json();
        
        // Filter only users with the 'user' role for selection
        const filteredUsers = allUsers.filter((u: User) => u.role === 'user');
        setAvailableUsers(filteredUsers);

        // Automatically set the current logged-in user as the first contributor
        if (!project) { // Only on new project creation
          const userJSON = localStorage.getItem('user');
          if (userJSON) {
            const currentUser = JSON.parse(userJSON);
            // Ensure current user is not already in contributors list
            if (!contributors.some(c => c.id === currentUser.id)) {
              setContributors([currentUser]);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load available contributors. Please try again later.');
      }
    };

    fetchUsersAndSetInitialContributor();
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!projectName || !projectDescription || !githubUrl || (!thumbnailFile && !thumbnailPreview) || stack.length === 0) {
      setError('Please fill in all required fields (project name, description, GitHub URL, tech stack, and thumbnail).');
      return;
    }

    if (imageFiles.length + imagePreviews.length > 10) {
      setError('Maximum 10 images allowed for the slideshow.');
      return;
    }

    const formData = new FormData();
    
    // Log all form submission values for debugging
    console.log('Submitting form with values:', {
      project_name: projectName,
      project_description: projectDescription,
      github_url: githubUrl,
      website_url: websiteUrl,
      stack: JSON.stringify(stack),
      region: region
    });

    formData.append('project_name', projectName);
    formData.append('project_description', projectDescription);
    formData.append('github_url', githubUrl);
    if (websiteUrl) formData.append('website_url', websiteUrl);
    
    // Add stack as string (will be stored directly in the database)
    formData.append('stack', JSON.stringify(stack));
    
    // Get the current user's region from local storage
    const userJSON = localStorage.getItem('user');
    if (userJSON) {
      const user = JSON.parse(userJSON);
      formData.append('region', user.region);
    } else if (region) {
      formData.append('region', region);
    }
    
    // Add contributors as string
    if (contributors.length > 0) {
      formData.append('contributors', JSON.stringify(contributors.map(c => ({
        id: c.id,
        username: c.username,
        region: c.region
      }))));
    } else {
      // Add empty contributors array to avoid null issues
      formData.append('contributors', JSON.stringify([]));
    }
    
    // Add thumbnail
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    } else if (project?.thumbnail_url) {
      formData.append('thumbnail_url', project.thumbnail_url);
    }
    
    // Add slideshow images
    imageFiles.forEach(file => {
      formData.append('images', file);
    });
    
    // Add existing images to keep
    if (project?.images && project.images.length > 0) {
      formData.append('existingImages', JSON.stringify(imagePreviews));
    }

    // Log form data keys
    console.log('Form data keys:', Array.from(formData.keys()));

    try {
      await onSubmit(formData);
    } catch (err) {
      console.error('Form submission error:', err);
      setError('Failed to submit project. Please try again later.');
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (newFiles.length + imageFiles.length + imagePreviews.length > 10) {
        setError('Maximum 10 images allowed for the slideshow.');
        return;
      }
      
      setImageFiles(prev => [...prev, ...newFiles]);
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    // Check if it's a new file or an existing image
    if (index < imagePreviews.length - imageFiles.length) {
      // It's an existing image
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    } else {
      // It's a new file
      const adjustedIndex = index - (imagePreviews.length - imageFiles.length);
      setImageFiles(prev => prev.filter((_, i) => i !== adjustedIndex));
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const addStack = () => {
    if (newStack && !stack.includes(newStack)) {
      setStack([...stack, newStack]);
      setNewStack('');
    }
  };

  const removeStack = (tech: string) => {
    setStack(stack.filter(item => item !== tech));
  };

  const addContributor = () => {
    if (selectedContributor) {
      const user = availableUsers.find(u => u.id.toString() === selectedContributor);
      if (user && !contributors.some(c => c.id === user.id)) {
        setContributors([...contributors, user]);
        setSelectedContributor('');
      }
    }
  };

  const removeContributor = (userId: any) => {
    // Prevent the original author (first contributor) from being removed
    if (contributors.length > 0 && contributors[0].id === userId) {
      const userJSON = localStorage.getItem('user');
      if (userJSON) {
        const currentUser = JSON.parse(userJSON);
        if (currentUser.id === userId) {
          setError("You cannot remove yourself as a contributor.");
          setTimeout(() => setError(''), 3000); // Clear error after 3 seconds
          return;
        }
      }
    }
    setContributors(contributors.filter(c => c.id !== userId));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Project Name */}
      <div className="space-y-2">
        <Label htmlFor="projectName">Project Name *</Label>
        <Input
          id="projectName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
          required
        />
      </div>
      
      {/* Project Description */}
      <div className="space-y-2">
        <Label htmlFor="projectDescription">Description *</Label>
        <Textarea
          id="projectDescription"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          placeholder="Describe your project"
          rows={5}
          required
        />
      </div>
      
      {/* Thumbnail */}
      <div className="space-y-2">
        <Label htmlFor="thumbnail">Thumbnail Image *</Label>
        <Input
          id="thumbnail"
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
          className="mb-2"
        />
        {thumbnailPreview && (
          <div className="relative w-full max-w-xs">
            <img 
              src={thumbnailPreview} 
              alt="Thumbnail preview" 
              className="w-full h-auto rounded-md object-cover"
            />
          </div>
        )}
      </div>
      
      {/* Tech Stack */}
      <div className="space-y-2">
        <Label>Tech Stack *</Label>
        <div className="flex gap-2">
          <Input
            value={newStack}
            onChange={(e) => setNewStack(e.target.value)}
            placeholder="Add technology"
          />
          <Button type="button" onClick={addStack} variant="outline">Add</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {stack.map((tech, index) => (
            <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
              <span className="text-sm">{tech}</span>
              <button 
                type="button" 
                onClick={() => removeStack(tech)}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* GitHub URL */}
      <div className="space-y-2">
        <Label htmlFor="githubUrl">GitHub URL *</Label>
        <Input
          id="githubUrl"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          placeholder="https://github.com/username/repo"
          required
        />
      </div>
      
      {/* Website URL (optional) */}
      <div className="space-y-2">
        <Label htmlFor="websiteUrl">Website URL (optional)</Label>
        <Input
          id="websiteUrl"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="https://your-project.com"
        />
      </div>
      
      {/* Region */}
      <div className="space-y-2">
        <Label htmlFor="region">Region *</Label>
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="KMG">Kemanggisan (KMG)</SelectItem>
            <SelectItem value="ALS">Alam Sutera (ALS)</SelectItem>
            <SelectItem value="BDG">Bandung (BDG)</SelectItem>
            <SelectItem value="MLG">Malang (MLG)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Contributors */}
      <div className="space-y-2">
        <Label>Contributors</Label>
        <div className="p-2 border rounded-md bg-gray-50 min-h-[40px]">
          {contributors.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {contributors.map(c => (
                <div key={c.id} className="flex items-center gap-2 bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-1 rounded-full">
                  <span>{c.username}</span>
                  <button
                    type="button"
                    onClick={() => removeContributor(c.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">The project creator is automatically added. Add more contributors here.</p>
          )}
        </div>
        <div className="flex gap-2">
          <Select onValueChange={setSelectedContributor} value={selectedContributor}>
            <SelectTrigger>
              <SelectValue placeholder="Select a contributor" />
            </SelectTrigger>
            <SelectContent>
              {availableUsers
                .filter(u => !contributors.some(c => c.id === u.id))
                .map(user => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.username} ({user.region})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button type="button" onClick={addContributor}>Add Contributor</Button>
        </div>
      </div>
      
      {/* Project Images */}
      <div className="space-y-2">
        <Label htmlFor="projectImages">Project Images (max 10)</Label>
        <Input
          id="projectImages"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImagesChange}
          className="mb-2"
        />
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img 
                  src={preview} 
                  alt={`Preview ${index + 1}`} 
                  className="w-full h-24 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Submitting...' : 'Submit Project'}
      </Button>
    </form>
  );
}

export default ProjectForm;