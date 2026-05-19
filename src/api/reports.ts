import api from './axios';

function defaults(params?: Record<string, any>) {
  if (!params || (!params.from && !params.to)) {
    const to = new Date().toISOString().split('T')[0];
    const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    return { from, to, ...params };
  }
  return params;
}

export const ReportsService = {
  summary: (params?: Record<string, any>) =>
    api.get('/admin/reports/summary', { params: defaults(params) }).then((r) => r.data),

  byCategory: (params?: Record<string, any>) =>
    api.get('/admin/reports/by-category', { params: defaults(params) }).then((r) => r.data),

  byWorker: (params?: Record<string, any>) =>
    api.get('/admin/reports/by-worker', { params: defaults(params) }).then((r) => r.data),

  byDate: (params?: Record<string, any>) =>
    api.get('/admin/reports/by-date', { params: defaults(params) }).then((r) => r.data),

  resolutionTimes: (params?: Record<string, any>) =>
    api.get('/admin/reports/resolution-times', { params: defaults(params) }).then((r) => r.data),

  details: (params?: Record<string, any>) =>
    api.get('/admin/reports/details', { params: defaults(params) }).then((r) => r.data),
};
