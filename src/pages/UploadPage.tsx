import { useState, useEffect } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProjectForm from '@/components/ProjectForm';
import { User } from '@/pages/ProjectInterfaces';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

function UploadPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userJSON = localStorage.getItem('user');
    if (!userJSON) {
      navigate({ to: '/login' });
      return;
    }
    try {
      setCurrentUser(JSON.parse(userJSON));
    } catch (err) {
      console.error('Error parsing user data:', err);
      toast.error("Invalid user data, please log in again.");
      navigate({ to: '/login' });
    }
  }, [navigate]);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Authentication token not found. Please login again.');
      setIsLoading(false);
      return;
    }

    const promise = () => new Promise(async (resolve, reject) => {
      const response = await fetch('http://localhost:8080/user/projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        reject(new Error(errorData.error || 'Failed to submit project.'));
      } else {
        const result = await response.json();
        setTimeout(() => navigate({ to: '/home' }), 2000);
        resolve(result);
      }
    });

    toast.promise(promise, {
      loading: 'Submitting project...',
      success: 'Project submitted successfully! It will be reviewed by an admin.',
      error: (err) => err.message,
    });

    setIsLoading(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button asChild variant="outline" size="sm">
              <Link to="/home">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to Projects
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Upload Your Project</CardTitle>
              <CardDescription>
                Share your final project with the BNCC community. All submissions will be reviewed by an admin before being published.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentUser && (
                <ProjectForm onSubmit={handleSubmit} isLoading={isLoading} />
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} BNCC LnT Showcase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default UploadPage;
