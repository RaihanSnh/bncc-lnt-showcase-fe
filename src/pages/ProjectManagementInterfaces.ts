export interface User {
  id: string;
  name: string;
  email: string;
  region: 'KMG' | 'ALS' | 'BDG' | 'MLG';
  role: 'USER' | 'ADMIN';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  contributors: User[];
  stack: string[];
  githubUrl: string;
  websiteUrl?: string;
  images: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  projectId: string;
  createdAt: string;
  user: User;
}