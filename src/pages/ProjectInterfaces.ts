export interface User {
  id: number;
  username: string;
  email: string;
  region: string;
  role: string;
  profile_image_url?: string;
}

export interface Project {
  id: string;
  user_id: number;
  project_name: string;
  project_description: string;
  thumbnail_url: string | null;
  github_url: string;
  website_url?: string;
  stack: string | string[];
  contributors: string | User[];
  created_at: string;
  is_verified: boolean;
  region: string;
  images?: string[];
}

export interface Comment {
  id: number;
  project_id: number;
  user_id: number;
  comment_text: string;
  created_at: string;
  user: User;
}