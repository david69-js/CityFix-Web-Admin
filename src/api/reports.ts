import api from './axios';
import type { DateRange } from '../types/reports';

export const ReportsService = {
  summary: (params?: DateRange) =>
    api.get('/admin/reports/summary', { params }).then((r) => r.data),

  byCategory: (params?: DateRange) =>
    api.get('/admin/reports/by-category', { params }).then((r) => r.data),

  byWorker: (params?: DateRange) =>
    api.get('/admin/reports/by-worker', { params }).then((r) => r.data),

  byDate: (params?: DateRange) =>
    api.get('/admin/reports/by-date', { params }).then((r) => r.data),

  resolutionTimes: (params?: DateRange) =>
    api.get('/admin/reports/resolution-times', { params }).then((r) => r.data),

  details: (params?: DateRange & { page?: number }) =>
    api.get('/admin/reports/details', { params }).then((r) => r.data),
};
