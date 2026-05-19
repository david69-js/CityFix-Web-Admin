import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useIssueDetails, useIssueComments, useAddComment, useDeleteComment,
  useUpdateIssueStatus, useAssignWorker, useWorkers,
  useToggleUpvote, useArchiveIssue,
} from '../hooks/useIssues';
import { useAuthStore } from '../store/authStore';
import StatusBadge from '../components/StatusBadge';
import {
  ArrowLeft, MapPin, Calendar, User, MessageSquare, ThumbsUp,
  Loader2, Send, Trash2, CornerDownRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function IssueDetails() {
  const { id } = useParams<{ id: string }>();
  const issueId = Number(id);
  const { user: currentUser } = useAuthStore();

  const { data: issue, isLoading } = useIssueDetails(issueId);
  const { data: comments } = useIssueComments(issueId);
  const { data: workers } = useWorkers();

  const addComment = useAddComment();
  const deleteComment = useDeleteComment();
  const updateStatus = useUpdateIssueStatus();
  const assignWorker = useAssignWorker();
  const toggleUpvote = useToggleUpvote();
  const archiveIssue = useArchiveIssue();

  const [comment, setComment] = useState('');
  const [selectedWorker, setSelectedWorker] = useState('');
  const [workerNotes, setWorkerNotes] = useState('');
  const [assignMsg, setAssignMsg] = useState<{ ok: boolean; text: string } | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#364461]" />
      </div>
    );
  }

  if (!issue) {
    return <div className="text-center py-12 text-gray-500">Reporte no encontrado</div>;
  }

  const handleStatusChange = (status_id: number) => {
    updateStatus.mutate({ id: issueId, status_id });
  };

  const handleAssign = () => {
    if (!selectedWorker) return;
    setAssignMsg(null);
    assignWorker.mutate(
      { issue_id: issueId, worker_id: Number(selectedWorker), notes: workerNotes },
      {
        onSuccess: () => {
          setAssignMsg({ ok: true, text: 'Trabajador asignado correctamente' });
          setWorkerNotes('');
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message || err?.message || 'Error al asignar trabajador';
          setAssignMsg({ ok: false, text: msg });
        },
      }
    );
  };

  const workerList = workers
    ? Array.isArray(workers)
      ? workers
      : workers.data
        ? Array.isArray(workers.data)
          ? workers.data
          : []
        : []
    : [];

  const handleAddComment = () => {
    if (!comment.trim()) return;
    addComment.mutate({ id: issueId, comment });
    setComment('');
  };

  const commentList = Array.isArray(comments) ? comments : comments?.data ?? [];

  return (
    <div>
      <Link
        to="/issues"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#364461] mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a reportes
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-[#364461]">{issue.title}</h1>
                <p className="text-sm text-gray-400 mt-1">#{issue.id}</p>
              </div>
              <StatusBadge name={issue.status.name} color={issue.status.color} />
            </div>

            <p className="text-gray-600 mb-4">{issue.description || 'Sin descripción'}</p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(issue.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {issue.user.first_name} {issue.user.last_name}
              </span>
              <span
                className="flex items-center gap-1 cursor-pointer hover:text-[#4d686f] transition-colors"
                onClick={() => {
                  const q = issue.latitude && issue.longitude
                    ? `${issue.latitude},${issue.longitude}`
                    : issue.address;
                  if (q) window.open(`https://www.google.com/maps?q=${encodeURIComponent(q)}`, '_blank');
                }}
                title="Ver en Google Maps"
              >
                <MapPin className="w-4 h-4" />
                {issue.address || 'Sin ubicación'}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={() => toggleUpvote.mutate(issueId)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
                  issue.is_upvoted
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                {issue.upvotes_count ?? 0}
              </button>
              <span className="flex items-center gap-1.5 text-gray-500">
                <MessageSquare className="w-4 h-4" />
                {issue.comments_count ?? 0}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="font-semibold text-[#364461] mb-4">Cambiar Estado</h2>
            <div className="flex gap-2">
              {[1, 2, 3].map((sid) => (
                <button
                  key={sid}
                  onClick={() => handleStatusChange(sid)}
                  disabled={issue.status_id === sid}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    issue.status_id === sid
                      ? 'bg-[#364461] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {sid === 1 ? 'Pendiente' : sid === 2 ? 'En Proceso' : 'Resuelto'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="font-semibold text-[#364461] mb-4">
              Comentarios ({commentList.length})
            </h2>

            <div className="space-y-4 mb-6">
              {commentList.map((c: any) => (
                <div key={c.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#364461] flex items-center justify-center text-white text-sm font-medium shrink-0">
                    {c.user?.first_name?.[0] || '?'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#364461]">
                        {c.user?.first_name} {c.user?.last_name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{c.comment}</p>
                  </div>
                  {(currentUser?.id === c.user_id || currentUser?.role_id === 1) && (
                    <button
                      onClick={() => deleteComment.mutate(c.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Escribir un comentario..."
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#364461]"
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <button
                onClick={handleAddComment}
                disabled={!comment.trim() || addComment.isPending}
                className="px-4 py-2.5 bg-[#364461] text-white rounded-lg hover:bg-[#2a354e] transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="font-semibold text-[#364461] mb-4">Asignar Trabajador</h2>
            <div className="space-y-3">
              <select
                value={selectedWorker}
                onChange={(e) => setSelectedWorker(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#364461] bg-white"
              >
                <option value="">Seleccionar trabajador...</option>
                {workerList.map((w: any) => (
                  <option key={w.id} value={w.id}>
                    {w.first_name} {w.last_name || ''} ({w.email})
                  </option>
                ))}
              </select>
              {workerList.length === 0 && !workers && (
                <p className="text-xs text-gray-400">Cargando trabajadores...</p>
              )}
              {workerList.length === 0 && workers && (
                <p className="text-xs text-amber-600">No hay trabajadores disponibles. Verifica que existan usuarios con rol de trabajador.</p>
              )}
              <textarea
                value={workerNotes}
                onChange={(e) => setWorkerNotes(e.target.value)}
                placeholder="Notas para la asignación..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#364461] resize-none"
                rows={3}
              />
              {assignMsg && (
                <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-lg ${assignMsg.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {assignMsg.ok ? '✓' : '✕'} {assignMsg.text}
                </div>
              )}
              <button
                onClick={handleAssign}
                disabled={!selectedWorker || assignWorker.isPending}
                className="w-full px-4 py-2.5 bg-[#364461] text-white rounded-lg hover:bg-[#2a354e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {assignWorker.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                <CornerDownRight className="w-4 h-4" />
                Asignar
              </button>
            </div>
            {issue.worker && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Asignado actualmente</p>
                <p className="text-sm font-medium text-[#364461]">
                  {issue.worker.first_name} {issue.worker.last_name}
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="font-semibold text-[#364461] mb-4">Información</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-400">Categoría</dt>
                <dd className="font-medium">{issue.category.name}</dd>
              </div>
              <div>
                <dt className="text-gray-400">Reportado por</dt>
                <dd className="font-medium">{issue.user.first_name} {issue.user.last_name}</dd>
              </div>
              <div>
                <dt className="text-gray-400">Creado</dt>
                <dd className="font-medium">{new Date(issue.created_at).toLocaleString()}</dd>
              </div>
              {issue.updated_at && (
                <div>
                  <dt className="text-gray-400">Actualizado</dt>
                  <dd className="font-medium">{new Date(issue.updated_at).toLocaleString()}</dd>
                </div>
              )}
              {issue.latitude && issue.longitude && (
                <div>
                  <dt className="text-gray-400">Coordenadas</dt>
                  <dd
                    className="font-medium text-xs text-blue-600 cursor-pointer hover:underline"
                    onClick={() => window.open(`https://www.google.com/maps?q=${issue.latitude},${issue.longitude}`, '_blank')}
                  >
                    {issue.latitude}, {issue.longitude}
                  </dd>
                </div>
              )}
            </dl>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => archiveIssue.mutate({ id: issueId, is_archived: !issue.is_archived })}
                className="w-full px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                {issue.is_archived ? 'Restaurar reporte' : 'Archivar reporte'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
