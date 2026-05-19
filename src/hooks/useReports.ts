import { useQuery } from '@tanstack/react-query';
import { ReportsService } from '../api/reports';
import type { DateRange } from '../types/reports';

export function useReportSummary(params?: DateRange) {
  return useQuery({
    queryKey: ['reports', 'summary', params],
    queryFn: () => ReportsService.summary(params),
  });
}

export function useCategoryReport(params?: DateRange) {
  return useQuery({
    queryKey: ['reports', 'category', params],
    queryFn: () => ReportsService.byCategory(params),
  });
}

export function useWorkerReport(params?: DateRange) {
  return useQuery({
    queryKey: ['reports', 'worker', params],
    queryFn: () => ReportsService.byWorker(params),
  });
}

export function useDateReport(params?: DateRange) {
  return useQuery({
    queryKey: ['reports', 'date', params],
    queryFn: () => ReportsService.byDate(params),
  });
}

export function useResolutionTimes(params?: DateRange) {
  return useQuery({
    queryKey: ['reports', 'resolution', params],
    queryFn: () => ReportsService.resolutionTimes(params),
  });
}

export function useReportDetails(params?: DateRange & { page?: number }) {
  return useQuery({
    queryKey: ['reports', 'details', params],
    queryFn: () => ReportsService.details(params),
  });
}
