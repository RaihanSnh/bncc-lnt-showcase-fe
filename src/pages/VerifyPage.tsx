import { useState, useEffect } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Project, User } from '@/pages/ProjectInterfaces';
import ImageSlideshow from '@/components/ImageSlideshow';

function VerifyPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [pendingProjects, setPendingProjects] = useState<Project[]>([]);
  const [approvedProjects, setApprovedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and is an admin
    const userJSON = localStorage.getItem('user');
    if (!userJSON) {
      navigate({ to: '/login' });
      return;
    }

    try {
      const user = JSON.parse(userJSON);
      // Check for either 'admin' or 'ADMIN' due to potential data inconsistency
      if (user.role !== 'admin' && user.role !== 'ADMIN') {
        navigate({ to: '/home' });
        return;
      }
      setCurrentUser(user);
    } catch (err) {
      console.error('Error parsing user data:', err);
      navigate({ to: '/login' });
    }
  }, [navigate]);

  // Fetch projects when currentUser is set
  useEffect(() => {
    if (currentUser) {
      fetchProjects();
    }
  }, [currentUser]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);

      // Get all pending projects for verification
      const pendingResponse = await fetch('http://localhost:8080/admin/projects/pending');
      if (!pendingResponse.ok) {
        throw new Error(`HTTP error! status: ${pendingResponse.status}`);
      }
      const pendingData = await pendingResponse.json();
      console.log('Pending data:', pendingData);
      // Make sure we have an array even if the backend returns null/empty
      setPendingProjects(Array.isArray(pendingData) ? pendingData : []);

      // Get all approved projects
      const approvedResponse = await fetch('http://localhost:8080/admin/projects/approved');
      if (!approvedResponse.ok) {
        throw new Error(`HTTP error! status: ${approvedResponse.status}`);
      }
      const approvedData = await approvedResponse.json();
      console.log('Approved data:', approvedData);
      // Make sure we have an array even if the backend returns null/empty
      setApprovedProjects(Array.isArray(approvedData) ? approvedData : []);

      // Combine all projects for reference
      const allProjects = [
        ...(Array.isArray(pendingData) ? pendingData : []), 
        ...(Array.isArray(approvedData) ? approvedData : [])
      ];
      setProjects(allProjects);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError('Failed to load projects. Please try again later.');
      // Initialize with empty arrays to prevent errors
      setPendingProjects([]);
      setApprovedProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (projectId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/admin/projects/${projectId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state
      const updatedProjects = projects.map(p => 
        p.id === projectId ? { ...p, is_verified: true } : p
      );
      setProjects(updatedProjects);

      // Update filtered lists
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setPendingProjects(pendingProjects.filter(p => p.id !== projectId));
        setApprovedProjects([...approvedProjects, { ...project, is_verified: true }]);
      }
      
      // Refresh projects to ensure we have the latest data
      fetchProjects();
    } catch (err) {
      console.error('Failed to approve project:', err);
      setError('Failed to approve project. Please try again.');
    }
  };

  const handleReject = async (projectId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/admin/projects/${projectId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'rejected' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Refresh projects to ensure we have the latest data
      fetchProjects();
    } catch (err) {
      console.error('Failed to reject project:', err);
      setError('Failed to reject project. Please try again.');
    }
  };

  // Handle admin logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate({ to: '/login' });
  };

  // Helper function to parse JSON strings from API
  const parseJsonField = (jsonString: string | null | undefined, defaultValue: any = []) => {
    if (!jsonString) return defaultValue;
    
    try {
      return typeof jsonString === 'string' ? JSON.parse(jsonString) : defaultValue;
    } catch (err) {
      console.error('Error parsing JSON:', err, jsonString);
      return defaultValue;
    }
  };

  // Process image URL to ensure it has the correct server prefix
  const getFullImageUrl = (url: string | null | undefined) => {
    if (!url) return null;
    
    // If URL already has http/https, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Otherwise, prepend the server URL
    return `http://localhost:8080/${url}`;
  };

  const renderProjectCard = (project: Project) => {
    // Make sure we're dealing with a proper project object
    if (!project || !project.id) {
      console.error('Invalid project object:', project);
      return null;
    }
    
    // Parse JSON fields from the API
    const stackArray = parseJsonField(project.stack, []);
    const contributorsArray = parseJsonField(project.contributors, []);
    
    // Get full image URLs
    const thumbnailUrl = getFullImageUrl(project.thumbnail_url);
    
    // Default project images array
    const projectImages = project.images && Array.isArray(project.images) ? 
      project.images.map(img => getFullImageUrl(img)).filter(Boolean) as string[] : 
      [];
    
    // Clearly determine if this is a pending project (undefined is_verified should be treated as pending)
    const isPending = project.is_verified === false;
    // Determine the status
    const status = isPending ? 'pending' : 'approved';
    
    return (
      <Card key={project.id} className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{project.project_name}</CardTitle>
              <Badge variant="secondary" className="mt-1">
                Region: {project.region || 'Unknown'}
              </Badge>
            </div>
            <Badge variant={
              status === 'approved' ? 'default' : 'destructive'
            }>
              {status.toUpperCase()}
            </Badge>
          </div>
          <CardDescription>
            Submitted on {new Date(project.created_at).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left side: Thumbnail and images */}
            <div className="md:col-span-1 space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Thumbnail</h4>
                {thumbnailUrl ? (
                  <img src={thumbnailUrl} alt="Project thumbnail" className="rounded-lg w-full object-cover aspect-video" />
                ) : (
                  <div className="rounded-lg w-full object-cover aspect-video bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">No thumbnail</p>
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-semibold mb-2">Project Images</h4>
                {projectImages.length > 0 ? (
                  <ImageSlideshow images={projectImages} />
                ) : (
                  <div className="rounded-lg w-full object-cover aspect-video bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">No images</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right side: Project details */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <h4 className="font-semibold">Description</h4>
                <p className="text-sm">{project.project_description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Tech Stack</h3>
                  <div className="flex flex-wrap gap-1">
                    {stackArray.length > 0 ? stackArray.map((tech: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    )) : (
                      <p className="text-sm text-gray-500">No tech stack specified</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Contributors</h3>
                  {contributorsArray.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {contributorsArray.map((c: any, idx: number) => (
                        <p key={idx} className="text-sm text-gray-700">
                          {c.username || c.name || 'Unknown'} ({c.region || 'Unknown'})
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No contributors listed</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">GitHub URL</h3>
                  <a 
                    href={project.github_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    {project.github_url || 'Not provided'}
                  </a>
                </div>
                {project.website_url && (
                  <div>
                    <h3 className="text-sm font-medium mb-1">Website URL</h3>
                    <a 
                      href={project.website_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-sm text-blue-600 hover:underline break-all"
                    >
                      {project.website_url}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          {/* Always show action buttons for pending projects, regardless of 'is_verified' value */}
          {status === 'pending' && (
            <>
              <Button 
                variant="destructive" 
                onClick={() => handleReject(project.id)}
                disabled={isLoading}
              >
                Reject
              </Button>
              <Button 
                onClick={() => handleApprove(project.id)}
                disabled={isLoading}
              >
                Approve
              </Button>
            </>
          )}
          
          {/* For already approved projects, allow changing the status */}
          {status === 'approved' && (
            <Button 
              variant="destructive" 
              onClick={() => handleReject(project.id)}
              disabled={isLoading}
            >
              Mark as Rejected
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <header className="bg-slate-900 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">BNCC Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            {currentUser && (
              <span className="text-sm font-medium">
                Logged in as {currentUser.username} ({currentUser.region})
              </span>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Project Verification</h2>
          <p className="text-gray-600">
            Review and verify projects submitted by BNCC participants.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs 
          defaultValue="pending" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mb-8"
        >
          <TabsList className="mb-6">
            <TabsTrigger value="pending">
              Pending 
              {pendingProjects.length > 0 && (
                <Badge variant="outline" className="ml-2">{pendingProjects.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved
              {approvedProjects.length > 0 && (
                <Badge variant="outline" className="ml-2">{approvedProjects.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-6">
            {isLoading ? (
              <div className="text-center p-8">Loading pending projects...</div>
            ) : pendingProjects.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No pending projects to review.</p>
              </div>
            ) : (
              pendingProjects.map(project => renderProjectCard(project))
            )}
          </TabsContent>
          
          <TabsContent value="approved" className="space-y-6">
            {isLoading ? (
              <div className="text-center p-8">Loading approved projects...</div>
            ) : approvedProjects.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No approved projects yet.</p>
              </div>
            ) : (
              approvedProjects.map(project => renderProjectCard(project))
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-4 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} BNCC LnT Showcase Admin. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default VerifyPage;
