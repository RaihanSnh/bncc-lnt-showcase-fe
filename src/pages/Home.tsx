import React, { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Project } from '@/pages/ProjectInterfaces';
import ProjectCard from '@/components/ProjectCard';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all_regions');
  const [selectedStack, setSelectedStack] = useState('all_technologies');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 8;
  const [totalPages, setTotalPages] = useState(1);

  // Get unique stacks from all projects
  const uniqueStacks = React.useMemo(() => {
    const stacks = new Set<string>();
    projects.forEach(project => {
      project.stack.forEach(tech => stacks.add(tech));
    });
    return Array.from(stacks).sort();
  }, [projects]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:8080/projects'); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Only show approved projects
        const approvedProjects = data.filter((project: Project) => project.status === 'APPROVED');
        setProjects(approvedProjects);
        setFilteredProjects(approvedProjects);

        // Even if there are no approved projects, we still want to show the section
        if (approvedProjects.length === 0) {
          console.log("No approved projects found, but section will still be visible");
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setError('Failed to load projects. Please try again later.');
        // Set empty projects array to ensure the section is still visible
        setProjects([]);
        setFilteredProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects when search term or filters change
  useEffect(() => {
    let result = [...projects];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(project => 
        project.title.toLowerCase().includes(term) || 
        project.description.toLowerCase().includes(term) ||
        project.contributors.some(c => c.name.toLowerCase().includes(term))
      );
    }

    // Filter by region
    if (selectedRegion && selectedRegion !== 'all_regions') {
      result = result.filter(project => 
        project.contributors.some(c => c.region === selectedRegion)
      );
    }

    // Filter by stack
    if (selectedStack && selectedStack !== 'all_technologies') {
      result = result.filter(project => 
        project.stack.includes(selectedStack)
      );
    }

    setFilteredProjects(result);
    setTotalPages(Math.ceil(result.length / projectsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedRegion, selectedStack, projects]);

  // Get current page projects
  const currentProjects = React.useMemo(() => {
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    return filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  }, [filteredProjects, currentPage, projectsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-blue-600">BNCC Showcase</h1>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
              </li>
              <li>
                <Link to="/home" className="text-gray-700 hover:text-blue-600 font-medium">Projects</Link>
              </li>
              {(() => {
                // Check if user is logged in
                const userJSON = localStorage.getItem('user');
                if (userJSON) {
                  try {
                    const user = JSON.parse(userJSON);
                    return (
                      <>
                        <li>
                          <Link to="/upload" className="text-gray-700 hover:text-blue-600">Upload Project</Link>
                        </li>
                        {user.role === 'ADMIN' && (
                          <li>
                            <Link to="/admin/verify" className="text-gray-700 hover:text-blue-600">Admin Panel</Link>
                          </li>
                        )}
                        <li>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              localStorage.removeItem('user');
                              window.location.reload();
                            }}
                          >
                            Logout
                          </Button>
                        </li>
                      </>
                    );
                  } catch (err) {
                    // Invalid user data, show login/register links
                    return (
                      <>
                        <li>
                          <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                        </li>
                        <li>
                          <Link to="/register" className="text-gray-700 hover:text-blue-600">Register</Link>
                        </li>
                      </>
                    );
                  }
                } else {
                  // Not logged in, show login/register links
                  return (
                    <>
                      <li>
                        <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                      </li>
                      <li>
                        <Link to="/register" className="text-gray-700 hover:text-blue-600">Register</Link>
                      </li>
                    </>
                  );
                }
              })()}
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">Project Showcase</h2>

          {/* Search and filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_regions">All Regions</SelectItem>
                  <SelectItem value="KMG">KMG (Kemanggisan)</SelectItem>
                  <SelectItem value="ALS">ALS (Alam Sutera)</SelectItem>
                  <SelectItem value="BDG">BDG (Bandung)</SelectItem>
                  <SelectItem value="MLG">MLG (Malang)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={selectedStack} onValueChange={setSelectedStack}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by technology" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_technologies">All Technologies</SelectItem>
                  {uniqueStacks.map(tech => (
                    <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results count and clear filters */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
            </p>
            {(searchTerm || selectedRegion !== 'all_regions' || selectedStack !== 'all_technologies') && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRegion('all_regions');
                  setSelectedStack('all_technologies');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Projects grid */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-red-500 mb-4">{error}</p>
              <h3 className="text-xl font-semibold mb-2">No projects found</h3>
              <p className="text-gray-600 mb-4">Please try again later or check your connection.</p>
              <div className="flex justify-center space-x-4">
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedRegion('all_regions');
                    setSelectedStack('all_technologies');
                    setError('');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">No projects found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filters.</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRegion('all_regions');
                  setSelectedStack('all_technologies');
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredProjects.length > 0 && totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} BNCC LnT Showcase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
