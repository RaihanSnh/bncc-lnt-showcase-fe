import { useState, useEffect } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Project, User } from '@/pages/ProjectInterfaces';
import ImageSlideshow from '@/components/ImageSlideshow';
import CommentSection from '@/components/CommentSection';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, Globe } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getFullImageUrl } from '@/lib/utils';

// Helper function to parse JSON strings safely
const parseJsonField = (jsonString: string | null | undefined, defaultValue: any = []) => {
  if (!jsonString) return defaultValue;
  try {
    // Check if the string is already an object (for direct JSON from API)
    if (typeof jsonString === 'object') return jsonString;
    return JSON.parse(jsonString);
  } catch (err) {
    console.error('Error parsing JSON:', err, jsonString);
    return defaultValue;
  }
};

// Helper to get full avatar URL
const getFullAvatarUrl = (url: string | null | undefined) => {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `http://localhost:8080/${url}`;
};

// Tech stack icon component
const TechIcon = ({ tech }: { tech: string }) => {
  const iconName = tech.toLowerCase().replace('.', 'dot').replace(' ', '');
  return (
    <motion.div
      whileHover={{ scale: 1.1, y: -5 }}
      className="flex flex-col items-center gap-2 text-center"
    >
      <i className={`devicon-${iconName}-plain text-4xl md:text-5xl`}></i>
      <span className="text-xs font-medium text-gray-600">{tech}</span>
    </motion.div>
  );
};

function ProjectDetailPage() {
  const { projectId } = useParams({ from: '/projects/$projectId' });
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:8080/projects/${projectId}`);
        if (!response.ok) {
          throw new Error('Project not found or failed to load.');
        }
        const data = await response.json();
        setProject(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p className="text-gray-600 mb-6">{error || 'Project data is unavailable.'}</p>
        <Button asChild>
          <Link to="/home"><ArrowLeft className="mr-2 h-4 w-4" />Back to Projects</Link>
        </Button>
      </div>
    );
  }

  const stack = parseJsonField(project.stack, []);
  const contributors = parseJsonField(project.contributors, []);
  const projectImagesRaw = parseJsonField(project.images, []);
  const projectImages = (projectImagesRaw || []).map(getFullImageUrl);
  const thumbnailUrl = getFullImageUrl(project.thumbnail_url);

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Button asChild variant="ghost" size="sm">
            <Link to="/home">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
          <h1 className="text-lg font-semibold text-gray-800 truncate">{project.project_name}</h1>
          <div className="w-24"></div> {/* Spacer */}
        </div>
      </header>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Banner */}
        <motion.div variants={itemVariants} className="relative h-48 md:h-72 w-full rounded-lg overflow-hidden shadow-xl mb-8">
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${thumbnailUrl})` }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-4">
            <motion.h1 
              className="text-3xl md:text-5xl font-bold drop-shadow-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {project.project_name}
            </motion.h1>
            <motion.div 
              className="text-lg md:text-xl mt-2 drop-shadow-md"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Badge variant="secondary">{project.region}</Badge>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column: Images */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Gallery</h2>
            {projectImages.length > 0 ? (
              <ImageSlideshow images={projectImages} />
            ) : (
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No additional images provided.</p>
              </div>
            )}
          </motion.div>

          {/* Right Column: Details & Links */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About this Project</h2>
              <p className="text-gray-600 leading-relaxed">{project.project_description}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Project Links</h3>
              <div className="flex flex-col space-y-3">
                <Button asChild variant="outline">
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                    <Github className="mr-2 h-4 w-4" /> GitHub Repository
                  </a>
                </Button>
                {project.website_url && (
                  <Button asChild>
                    <a href={project.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                      <Globe className="mr-2 h-4 w-4" /> Visit Website
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tech Stack */}
        <motion.div variants={itemVariants} className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Technology Stack</h2>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {stack.length > 0 ? stack.map((tech: string, index: number) => (
              <TechIcon key={index} tech={tech} />
            )) : <p>No tech stack specified.</p>}
          </div>
        </motion.div>

        {/* Contributors */}
        <motion.div variants={itemVariants} className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Contributors</h2>
          <div className="flex flex-wrap gap-4">
            {contributors.length > 0 ? contributors.map((c: User) => (
              <div key={c.id} className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border">
                <Avatar>
                  <AvatarImage src={getFullAvatarUrl(c.profile_image_url)} />
                  <AvatarFallback>{c.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900">{c.username}</p>
                  <p className="text-sm text-gray-500">{c.region}</p>
                </div>
              </div>
            )) : <p>No contributors listed.</p>}
          </div>
        </motion.div>

        {/* Comments */}
        <motion.div variants={itemVariants}>
          <CommentSection projectId={project.id} />
        </motion.div>
      </motion.main>
    </div>
  );
}

export default ProjectDetailPage;
