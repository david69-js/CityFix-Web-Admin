export interface DateRange {
  start_date?: string;
  end_date?: string;
}

export interface StatusSummary {
  status_name: string;
  status_color: string;
  total: number;
}

export interface CategorySummary {
  category_name: string;
  category_icon: string;
  total: number;
  resolved: number;
  avg_resolution_hours: number;
}

export interface ReportSummary {
  total_issues: number;
  avg_resolution_hours: number;
  total_upvotes: number;
  total_comments: number;
  by_status: StatusSummary[];
}

export interface CategoryReportItem {
  category_name: string;
  category_icon: string;
  total: number;
  resolved: number;
  avg_resolution_hours: number;
}

export interface CategoryReport {
  summary: CategoryReportItem[];
  total: number;
}

export interface WorkerInfo {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
}

export interface WorkerCategory {
  name: string;
  count: number;
}

export interface WorkerReportItem {
  worker: WorkerInfo;
  assigned: number;
  resolved: number;
  avg_resolution_hours: number;
  categories: WorkerCategory[];
}

export interface WorkerReport {
  workers: WorkerReportItem[];
  total: number;
}

export interface DateDataPoint {
  date: string;
  total: number;
}

export interface DateReport {
  daily: DateDataPoint[];
  total: number;
}

export interface WorkerResolution {
  worker_id: number;
  worker_name: string;
  avg_hours: number;
  resolved: number;
}

export interface ResolutionReport {
  avg_general: number;
  by_worker: WorkerResolution[];
}

export interface IssueDetail {
  id: number;
  title: string;
  status: string;
  category: string;
  created_at: string;
  resolved_at?: string;
  resolution_hours?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
