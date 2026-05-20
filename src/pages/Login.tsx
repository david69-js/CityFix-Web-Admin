import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useLogin } from '../hooks/useAuth';
import axiosBase from 'axios';
import { Shield, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888/api';

export default function Login() {
  const { user, isLoading: authLoading, setToken, setUser } = useAuthStore();
  const login = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F1F5F9]">
        <Loader2 className="w-8 h-8 animate-spin text-[#364461]" />
      </div>
    );
  }

  if (user) return <Navigate to={Number(user.role_id) === 1 ? '/reports' : '/'} replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setToken(null);
    setUser(null);

    try {
      const data = await login.mutateAsync({ email, password });
      const token = data.token || data.access_token;
      const me = await axiosBase.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = me.data?.data || me.data;
      if (userData.is_active === false) {
        setError('Tu cuenta ha sido deshabilitada, ponte en contacto con el administrador.');
        return;
      }
      setToken(token);
      setUser(userData);
    } catch (err: any) {
      let msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message;

      if (msg === 'Unauthorized' || err?.response?.status === 401) {
        msg = 'Credenciales inválidas o tu cuenta ha sido deshabilitada, ponte en contacto con el administrador.';
      } else if (!msg) {
        msg = 'Error de conexión';
      }
      
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#364461] rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-[#e3ba6a]" />
          </div>
          <h1 className="text-2xl font-bold text-[#364461]">CityFix Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Inicia sesión para administrar</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#364461] focus:border-transparent outline-none"
              placeholder="ejemplo@ejemplo.com"
              
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#364461] focus:border-transparent outline-none pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={login.isPending}
            className="w-full bg-[#364461] text-white py-2.5 rounded-lg font-medium hover:bg-[#2a354e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {login.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {login.isPending ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
