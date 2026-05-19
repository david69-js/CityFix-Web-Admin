import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types/api';
import api from '../api/axios';

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() =>
    localStorage.getItem('auth_token')
  );
  const [user, setUserState] = useState<User | null>(() => {
    const raw = localStorage.getItem('auth_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  const setToken = (t: string | null) => {
    setTokenState(t);
    if (t) localStorage.setItem('auth_token', t);
    else localStorage.removeItem('auth_token');
  };

  const setUser = (u: User | null) => {
    setUserState(u);
    if (u) localStorage.setItem('auth_user', JSON.stringify(u));
    else localStorage.removeItem('auth_user');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  useEffect(() => {
    if (token) {
      api
        .get('/auth/me')
        .then((res) => {
          const userData = res.data?.data || res.data;
          if (userData.is_active === false) {
            setToken(null);
            setUser(null);
          } else {
            setUser(userData);
          }
        })
        .catch(() => {
          setToken(null);
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, isLoading, setToken, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthStore() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthStore must be used within AuthProvider');
  return ctx;
}
