import { useMutation } from '@tanstack/react-query';
import api from '../api/axios';

export function useLogin() {
  return useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      api.post('/auth/login', payload).then((r) => r.data),
  });
}

export function useUsers() {
  return useMutation({
    mutationFn: () =>
      api.get('/admin/users').then((r) => r.data),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) =>
      api.post('/auth/forgot-password', { email }).then((r) => r.data),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: { email: string; token: string; password: string; password_confirmation: string }) =>
      api.post('/auth/reset-password', payload).then((r) => r.data),
  });
}

export function useCheckEmail() {
  return useMutation({
    mutationFn: (email: string) =>
      api.post('/auth/check-email', { email }).then((r) => r.data),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: { first_name: string; last_name?: string; email: string; password: string; password_confirmation: string; invitation_code?: string }) =>
      api.post('/auth/register', payload).then((r) => r.data),
  });
}
