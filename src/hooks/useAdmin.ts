import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export function useAdminUsers(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['admin-users', params],
    queryFn: () =>
      api.get('/admin/users', { params }).then((r) => r.data),
  });
}

export function useToggleUserActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) =>
      api.patch(`/admin/users/${userId}/toggle-active`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
    onError: (err: any) => {
      alert(err?.response?.data?.message || 'Error al cambiar el estado del usuario');
    },
  });
}

export function useAdminUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Record<string, any>) =>
      api.put(`/admin/users/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
    onError: (err: any) => {
      alert(err?.response?.data?.message || 'Error al actualizar el usuario');
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () =>
      api.get('/categories').then((r) => r.data),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; icon: string }) =>
      api.post('/categories', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { first_name: string; last_name?: string; email: string; password: string; password_confirmation: string; phone?: string; role_id: number }) =>
      api.post('/admin/users', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
}

export function useSendCampaign() {
  return useMutation({
    mutationFn: (data: { title: string; message: string }) =>
      api.post('/admin/notifications/campaign', data).then((r) => r.data),
  });
}

export function useAdminArchivedIssues(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['admin-archived', params],
    queryFn: () =>
      api.get('/admin/issues', { params: { ...params, is_hidden: 1 } }).then((r) => r.data),
  });
}

export function useCreateInvitation() {
  return useMutation({
    mutationFn: (data: { code: string; max_uses?: number; expires_at?: string; role_id?: number }) =>
      api.post('/invitation-codes', data).then((r) => r.data),
  });
}
