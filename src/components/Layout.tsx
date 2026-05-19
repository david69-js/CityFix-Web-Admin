import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Sidebar from './Sidebar';

export default function Layout() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F1F5F9]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#364461]" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.role_id !== 1) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F1F5F9]">
        <p className="text-lg text-red-600">Acceso denegado. Se requieren permisos de administrador.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F1F5F9]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
