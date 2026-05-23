import { useState } from 'react';
import { useCreateUser } from '../hooks/useAdmin';
import { Loader2, Users, Tag, Ticket, Bell, Archive, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const quickLinks = [
  { to: '/admin/categories', label: 'Categorías', icon: Tag, desc: 'Crear y gestionar categorías' },
  { to: '/admin/users', label: 'Usuarios', icon: Users, desc: 'Gestionar usuarios del sistema' },
  { to: '/admin/invitations', label: 'Invitaciones', icon: Ticket, desc: 'Generar códigos de invitación' },
  { to: '/admin/archived', label: 'Archivados', icon: Archive, desc: 'Reportes archivados' },
  { to: '/admin/campaign', label: 'Campaña Push', icon: Bell, desc: 'Enviar notificaciones masivas' },
];

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#364461] mb-6">Panel de Administración</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {quickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-[#364461] flex items-center justify-center">
                <link.icon className="w-5 h-5 text-[#e3ba6a]" />
              </div>
              <div>
                <h3 className="font-medium text-[#364461] group-hover:text-[#4d686f] transition-colors">
                  {link.label}
                </h3>
                <p className="text-xs text-gray-400">{link.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-lg">
        <h2 className="font-semibold text-[#364461] mb-4">Crear Usuario</h2>
        <CreateUserForm />
      </div>
    </div>
  );
}

function CreateUserForm() {
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', password: '', password_confirmation: '', phone: '', role_id: 3,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { mutate: createUser, isPending } = useCreateUser() as any;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    createUser(form, {
      onSuccess: () => {
        setForm({ first_name: '', last_name: '', email: '', password: '', password_confirmation: '', phone: '', role_id: 3 });
        setSuccess(true);
      },
      onError: (err: any) => {
        setError(err?.response?.data?.message || err?.response?.data?.error || 'Error al crear usuario');
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input placeholder="Nombre" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#364461]" required />
        <input placeholder="Apellido" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#364461]" />
      </div>
      <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#364461]" required />
      <input type="tel" placeholder="Teléfono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#364461]" />
      <input type="password" placeholder="Contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#364461]" required />
      <input type="password" placeholder="Confirmar contraseña" value={form.password_confirmation} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#364461]" required />
      <div>
        <p className="text-sm text-gray-500 mb-2">Rol</p>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 1, label: 'Admin' },
            { id: 2, label: 'Trabajador' },
            { id: 3, label: 'Ciudadano' },
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setForm({ ...form, role_id: r.id })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                form.role_id === r.id
                  ? 'bg-[#364461] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-3 rounded-lg">
          <CheckCircle2 className="w-4 h-4" />
          Usuario creado exitosamente
        </div>
      )}

      <button type="submit" disabled={isPending}
        className="w-full px-4 py-2.5 bg-[#364461] text-white rounded-lg hover:bg-[#2a354e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
        Crear Usuario
      </button>
    </form>
  );
}
