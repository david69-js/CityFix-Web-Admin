import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, Settings, Users,
  Tag, Ticket, Archive, Bell, LogOut, Shield, FileDown, X,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const navItems = [
  { to: '/reports', label: 'Reportes y Estadísticas', icon: LayoutDashboard },
  { to: '/reports/pdf', label: 'Reportes PDF', icon: FileDown },
  { to: '/issues', label: 'Reportes Ciudadanos', icon: ClipboardList },
];

const adminItems = [
  { to: '/admin', label: 'Panel Admin', icon: Settings },
  { to: '/admin/users', label: 'Usuarios', icon: Users },
  { to: '/admin/categories', label: 'Categorías', icon: Tag },
  { to: '/admin/invitations', label: 'Códigos de Invitación', icon: Ticket },
  { to: '/admin/archived', label: 'Archivados', icon: Archive },
  { to: '/admin/campaign', label: 'Campaña Push', icon: Bell },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose = () => {} }: SidebarProps) {
  const { user, logout } = useAuthStore();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#151C2C] text-white flex flex-col h-screen transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:sticky md:top-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-5 border-b border-gray-700 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#e3ba6a]" />
            CityFix Admin
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {user?.first_name} {user?.last_name}
          </p>
        </div>
        <button
          onClick={onClose}
          className="md:hidden p-1 hover:bg-[#1E2738] rounded-lg text-gray-400 hover:text-white transition-colors"
          title="Cerrar menú"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <p className="text-xs uppercase text-gray-500 px-3 pt-3 pb-1 font-semibold">Navegación</p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-[#364461] text-white' : 'text-gray-300 hover:bg-[#1E2738]'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}

        <p className="text-xs uppercase text-gray-500 px-3 pt-5 pb-1 font-semibold">Administración</p>
        {adminItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-[#364461] text-white' : 'text-gray-300 hover:bg-[#1E2738]'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-700">
        <button
          onClick={() => {
            onClose();
            logout();
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-red-500/20 hover:text-red-400 w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
