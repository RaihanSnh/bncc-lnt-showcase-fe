import React, { useEffect, useState } from 'react';

interface Project {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  github_url: string;
  website_url: string;
  stack: string;
  created_at: string;
  updated_at: string;
  status: string;
}

function Home() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:8080/projects'); // Sesuaikan dengan URL backend kamu
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div>
      <h1>LnT Showcase</h1>
      <div className="project-list">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <img src={project.thumbnail_url} alt={project.title} />
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noreferrer">
                GitHub
                </a>
            )}
            {project.website_url && (
              <a href={project.website_url} target="_blank" rel="noreferrer">
                Website
              </a>
            )}
            <p>{project.stack}</p>
            <p>{project.created_at}</p>
            <p>{project.updated_at}</p>
            <p>{project.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;