import { useState } from 'react';
import { useCreateInvitation } from '../hooks/useAdmin';
import { Loader2, Ticket, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminInvitations() {
  const [form, setForm] = useState({ code: '', max_uses: '', expires_at: '', role_id: 3 });
  const [error, setError] = useState('');
  const { mutate: createInvitation, isPending, isSuccess } = useCreateInvitation() as any;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    createInvitation(
      {
        code: form.code,
        max_uses: form.max_uses ? Number(form.max_uses) : undefined,
        expires_at: form.expires_at || undefined,
        role_id: form.role_id,
      },
      {
        onSuccess: () => setForm({ code: '', max_uses: '', expires_at: '', role_id: 3 }),
        onError: (err: any) => {
          setError(err?.response?.data?.message || err?.response?.data?.error || 'Error al generar el código');
        },
      }
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#364461] mb-6">Códigos de Invitación</h1>

      <div className="max-w-lg bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="font-semibold text-[#364461] mb-4">Generar Código</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Código</label>
            <input
              placeholder="Ej: CITYFIX-ADMIN-2024"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#364461]"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Usos máximos (opcional)</label>
            <input
              type="number"
              placeholder="Ilimitado si se deja vacío"
              value={form.max_uses}
              onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#364461]"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Fecha de expiración (opcional)</label>
            <input
              type="datetime-local"
              value={form.expires_at}
              onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#364461]"
            />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Rol</p>
            <div className="flex gap-2">
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

          {isSuccess && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-3 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
              Código de invitación generado exitosamente
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full px-4 py-2.5 bg-[#364461] text-white rounded-lg hover:bg-[#2a354e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            <Ticket className="w-4 h-4" />
            Generar Código
          </button>
        </form>
      </div>
    </div>
  );
}
