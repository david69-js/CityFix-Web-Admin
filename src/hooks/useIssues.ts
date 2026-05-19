import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import api from '../api/axios';
import type { Issue, PaginatedResponse } from '../types/api';

export function useIssuesFeed(filters?: Record<string, any>) {
  return useInfiniteQuery<PaginatedResponse<Issue>>({
    queryKey: ['issues', 'feed', filters],
    queryFn: ({ pageParam }) =>
      api.get('/issues', { params: { ...filters, page: pageParam } }).then((r) => r.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.current_page < lastPage.last_page ? lastPage.current_page + 1 : undefined,
  });
}

export function useAdminIssues(filters?: Record<string, any>) {
  return useInfiniteQuery<PaginatedResponse<Issue>>({
    queryKey: ['issues', 'admin', filters],
    queryFn: ({ pageParam }) =>
      api.get('/admin/issues', { params: { ...filters, page: pageParam } }).then((r) => r.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.current_page < lastPage.last_page ? lastPage.current_page + 1 : undefined,
  });
}

export function useIssueDetails(id: number) {
  return useQuery<Issue>({
    queryKey: ['issue', id],
    queryFn: () =>
      api.get(`/issues/${id}`).then((r) => r.data?.data || r.data),
    enabled: !!id,
  });
}

export function useIssueComments(id: number) {
  return useQuery({
    queryKey: ['issue-comments', id],
    queryFn: () =>
      api.get(`/issues/${id}/comments`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useAddComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, comment }: { id: number; comment: string }) =>
      api.post(`/issues/${id}/comments`, { comment }).then((r) => r.data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['issue-comments', id] });
      qc.invalidateQueries({ queryKey: ['issue', id] });
    },
  });
}

export function useDeleteComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (commentId: number) =>
      api.delete(`/comments/${commentId}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['issue-comments'] }),
  });
}

export function useToggleUpvote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (issueId: number) =>
      api.post(`/issues/${issueId}/toggle-upvote`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['issues'] }),
  });
}

export function useUpdateIssueStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status_id }: { id: number; status_id: number }) =>
      api.patch(`/issues/${id}/status`, { status_id }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['issues'] }),
  });
}

export function useAssignWorker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ issue_id, worker_id, notes }: { issue_id: number; worker_id: number; notes?: string }) =>
      api.post('/assignments', { issue_id, worker_id, notes }).then((r) => r.data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['issues'] });
      qc.invalidateQueries({ queryKey: ['issue', vars.issue_id] });
    },
  });
}

export function useWorkers(search?: string) {
  return useQuery({
    queryKey: ['workers', search || 'all'],
    queryFn: () =>
      api.get('/admin/users', { params: { role: 2, search } }).then((r) => r.data),
  });
}

export function useMyAssignments() {
  return useQuery({
    queryKey: ['my-assignments'],
    queryFn: () =>
      api.get('/my-assignments').then((r) => r.data),
  });
}

export function useAdminUpdateIssue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Record<string, any>) =>
      api.post(`/issues/${id}`, { ...data, _method: 'PUT' }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['issues'] }),
  });
}

export function useToggleIssueHidden() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (issueId: number) =>
      api.post(`/admin/issues/${issueId}/toggle-hidden`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['issues'] }),
  });
}

export function useArchiveIssue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_archived }: { id: number; is_archived: boolean }) =>
      api.post(`/admin/issues/${id}`, { is_archived, _method: 'PUT' }).then((r) => r.data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['issues'] });
      qc.invalidateQueries({ queryKey: ['issue', vars.id] });
    },
  });
}

export function useDeleteIssue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (issueId: number) =>
      api.delete(`/issues/${issueId}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['issues'] }),
  });
}

export function useStatuses() {
  return useQuery({
    queryKey: ['statuses'],
    queryFn: () =>
      api.get('/issue-statuses').then((r) => r.data),
  });
}
