import { useMutation } from '@tanstack/react-query';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';

export function useLogin() {
  const { setToken, setUser, logout } = useAuthStore();

  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const res = await api.post('/auth/login', payload);
      const data = res.data;
      const token = data.token || data.access_token;
      setToken(token);
      const me = await api.get('/auth/me');
      const userData = me.data?.data || me.data;
      if (userData.is_active === false) {
        logout();
        throw new Error('Tu cuenta ha sido desactivada. Contacta al administrador.');
      }
      setUser(userData);
      return data;
    },
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
