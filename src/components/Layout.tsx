import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Sidebar from './Sidebar';
import { Menu, Shield } from 'lucide-react';

export default function Layout() {
  const { user, isLoading } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F1F5F9]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#364461]" />
      </div>
    );
  }

  if (!user || user.is_active === false) return <Navigate to="/login" replace />;
  if (Number(user.role_id) !== 1) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F1F5F9]">
        <p className="text-lg text-red-600">Acceso denegado. Se requieren permisos de administrador.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#F1F5F9] overflow-hidden">
      {/* Barra superior en móviles */}
      <header className="flex md:hidden items-center justify-between bg-[#151C2C] text-white px-4 py-3 border-b border-gray-700 shrink-0">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-1.5 hover:bg-[#1E2738] rounded-lg text-gray-300 hover:text-white transition-colors"
          title="Abrir menú"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#e3ba6a]" />
          <span className="font-bold text-sm">CityFix Admin</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#364461] flex items-center justify-center text-white text-xs font-medium shrink-0">
          {(user?.first_name || '?')[0]}
        </div>
      </header>

      {/* Backdrop para móviles */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Menú lateral */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
}
