export interface DateRange {
  from: string;
  to: string;
}

export interface StatusSummary {
  status: string;
  total: number;
}

export interface CategorySummary {
  category: string;
  total: number;
}

export interface ReportSummary extends DateRange {
  total_issues: number;
  by_status: StatusSummary[];
  by_category: CategorySummary[];
  total_upvotes: number;
  total_comments: number;
  total_workers_assigned: number;
  avg_resolution_time_hours: number | null;
}

export interface CategoryReportItem {
  category: string;
  total: number;
  by_status: StatusSummary[];
  resolved_count: number;
  avg_resolution_time_hours: number | null;
}

export interface CategoryReport extends DateRange {
  data: CategoryReportItem[];
}

export interface WorkerInfo {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface WorkerCategory {
  category: string;
  total: number;
}

export interface WorkerReportItem {
  worker: WorkerInfo;
  total_assigned: number;
  completed_count: number;
  issues_resolved: number;
  categories_worked: WorkerCategory[];
  avg_completion_time_hours: number | null;
}

export interface WorkerReport extends DateRange {
  data: WorkerReportItem[];
}

export interface DateDataPoint {
  period: string;
  total: number;
}

export interface DateReport extends DateRange {
  group_by: string;
  created: DateDataPoint[];
  resolved: DateDataPoint[];
}

export interface WorkerResolution {
  worker: WorkerInfo;
  issues_resolved: number;
  avg_resolution_time_hours: number | null;
}

export interface ResolutionReport extends DateRange {
  issues_resolved: number;
  avg_hours: number | null;
  min_hours: number | null;
  max_hours: number | null;
  by_worker: WorkerResolution[];
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  per_page: number;
  total: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}
