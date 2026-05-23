import { useState, useMemo } from 'react';
import { useAdminUsers, useToggleUserActive, useAdminUpdateUser } from '../hooks/useAdmin';
import { Search, CheckCircle, XCircle, Loader2, Shield, Wrench, User as UserIcon } from 'lucide-react';

const roleLabels: Record<number, { label: string; icon: any; color: string }> = {
  1: { label: 'Admin', icon: Shield, color: '#e3ba6a' },
  2: { label: 'Trabajador', icon: Wrench, color: '#4d686f' },
  3: { label: 'Ciudadano', icon: UserIcon, color: '#6d756a' },
};

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useAdminUsers();
  const toggleActive = useToggleUserActive();
  const updateUser = useAdminUpdateUser();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ role_id: 0, phone: '' });

  const allUsers = Array.isArray(data) ? data : data?.data ?? [];

  const users = useMemo(() => {
    if (!search) return allUsers;
    const q = search.toLowerCase();
    return allUsers.filter(
      (u: any) =>
        u.first_name?.toLowerCase().includes(q) ||
        u.last_name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
    );
  }, [allUsers, search]);

  const startEdit = (u: any) => {
    setEditingId(u.id);
    setEditForm({ role_id: u.role_id, phone: u.phone || '' });
  };

  const saveEdit = (id: number) => {
    updateUser.mutate({ id, ...editForm });
    setEditingId(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#364461] mb-6">Usuarios</h1>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar usuarios..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#364461]"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#364461]" />
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Usuario</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Email</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Rol</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Teléfono</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Estado</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => {
                const role = roleLabels[u.role_id] || roleLabels[3];
                const RoleIcon = role.icon;
                return (
                  <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#364461] flex items-center justify-center text-white text-sm font-medium">
                          {u.first_name?.[0] || '?'}
                        </div>
                        <span className="font-medium text-sm">{u.first_name} {u.last_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                    <td className="px-4 py-3">
                      {editingId === u.id ? (
                        <select
                          value={editForm.role_id}
                          onChange={(e) => setEditForm({ ...editForm, role_id: Number(e.target.value) })}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value={1}>Admin</option>
                          <option value={2}>Trabajador</option>
                          <option value={3}>Ciudadano</option>
                        </select>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-sm">
                          <RoleIcon className="w-4 h-4" style={{ color: role.color }} />
                          {role.label}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {editingId === u.id ? (
                        <input
                          type="text"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="px-2 py-1 border border-gray-300 rounded text-sm w-32"
                        />
                      ) : (
                        u.phone || '-'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {u.is_active !== false ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="w-3 h-3" /> Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-red-600">
                          <XCircle className="w-3 h-3" /> Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {editingId === u.id ? (
                          <>
                            <button
                              onClick={() => saveEdit(u.id)}
                              className="text-xs px-3 py-1.5 bg-[#364461] text-white rounded-lg hover:bg-[#2a354e]"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(u)}
                              className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => toggleActive.mutate(u.id)}
                              className="text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                            >
                              {u.is_active !== false ? 'Desactivar' : 'Activar'}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
