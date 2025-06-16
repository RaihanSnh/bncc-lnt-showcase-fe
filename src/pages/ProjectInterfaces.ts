export interface User {
  id: string;
  username: string;
  email: string;
  region: string;
  role: 'user' | 'admin';
}

export interface Project {
  id: string;
  user_id: number;
  project_name: string;
  project_description: string;
  thumbnail_url: string;
  contributors: string; // JSON string
  stack: string; // JSON string
  github_url: string;
  website_url?: string;
  images?: string[]; // Not in DB, but used in frontend
  is_verified: boolean;
  region: string;
  created_at: string;
}

export interface Comment {
  id: string;
  content: string;
  user_id: string;
  project_id: string;
  created_at: string;
  user: User;
}