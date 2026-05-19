import { useState } from 'react';
import { useSendCampaign } from '../hooks/useAdmin';
import { Loader2, Send, CheckCircle2 } from 'lucide-react';

export default function AdminCampaign() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const { mutate: sendCampaign, isPending, isSuccess } = useSendCampaign() as any;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendCampaign(
      { title, message },
      { onSuccess: () => { setTitle(''); setMessage(''); } }
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#364461] mb-6">Campaña Push</h1>

      <div className="max-w-lg bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="font-semibold text-[#364461] mb-4">Enviar Notificación a Todos</h2>
        <p className="text-sm text-gray-500 mb-4">
          Envía una notificación push a todos los usuarios de la aplicación.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Título</label>
            <input
              placeholder="Ej: ¡Novedades en CityFix!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#364461]"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Mensaje</label>
            <textarea
              placeholder="Escribe el mensaje de la notificación..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#364461] resize-none"
              required
            />
          </div>

          {isSuccess && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-3 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
              Notificación enviada exitosamente
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full px-4 py-2.5 bg-[#364461] text-white rounded-lg hover:bg-[#2a354e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            <Send className="w-4 h-4" />
            Enviar a Todos
          </button>
        </form>
      </div>
    </div>
  );
}
