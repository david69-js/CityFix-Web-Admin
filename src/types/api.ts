export interface User {
  id: number;
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  role_id: number;
  role?: Role;
  avatar?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface IssueStatus {
  id: number;
  name: string;
  color: string;
  icon?: string;
}

export interface IssueImage {
  id: number;
  url: string;
}

export interface IssueComment {
  id: number;
  comment: string;
  user_id: number;
  user: User;
  created_at: string;
  updated_at?: string;
}

export interface Issue {
  id: number;
  title: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  image?: string;
  images?: IssueImage[];
  user_id: number;
  user: User;
  status_id: number;
  status: IssueStatus;
  category_id: number;
  category: Category;
  worker_id?: number;
  worker?: User;
  upvotes_count?: number;
  comments_count?: number;
  is_upvoted?: boolean;
  is_hidden?: boolean;
  hidden_reason?: string;
  created_at: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

export interface CreateIssuePayload {
  title: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  category_id: number;
  image?: string;
}

export interface UpdateIssuePayload {
  title?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  category_id?: number;
}

export interface AdminUpdateIssuePayload {
  title?: string;
  description?: string;
  category_id?: number;
  latitude?: number;
  longitude?: number;
  address?: string;
  status_id?: number;
  worker_id?: number;
  is_hidden?: boolean;
  hidden_reason?: string;
}
