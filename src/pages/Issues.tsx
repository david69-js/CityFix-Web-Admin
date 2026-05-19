import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminIssues, useStatuses, useAdminUpdateIssue } from '../hooks/useIssues';
import StatusBadge from '../components/StatusBadge';
import { Search, MapPin, MessageSquare, ThumbsUp, Calendar, Loader2, Archive } from 'lucide-react';

export default function Issues() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<number | ''>('');
  const { data: statuses } = useStatuses();
  const archiveIssue = useAdminUpdateIssue();

  const filters: Record<string, any> = { is_archived: 0 };
  if (search) filters.search = search;
  if (statusFilter) filters.status_id = statusFilter;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useAdminIssues(filters);

  const issues = data?.pages.flatMap((p) => p.data) ?? [];

  const handleArchive = (id: number) => {
    if (confirm('¿Archivar este reporte?')) {
      archiveIssue.mutate({ id, is_archived: true });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#364461] mb-6">Reportes Activos</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar reportes..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#364461]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value ? Number(e.target.value) : '')}
          className="px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#364461] bg-white"
        >
          <option value="">Todos los estados</option>
          {statuses?.map((s: any) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#364461]" />
        </div>
      ) : issues.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No hay reportes activos</div>
      ) : (
        <div className="space-y-3">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <Link to={`/issues/${issue.id}`} className="flex-1 min-w-0">
                  <h3 className="font-medium text-[#364461] truncate">{issue.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{issue.description}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(issue.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {issue.address || 'Sin ubicación'}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      {issue.upvotes_count ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {issue.comments_count ?? 0}
                    </span>
                  </div>
                </Link>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <StatusBadge name={issue.status.name} color={issue.status.color} />
                    <button
                      onClick={() => handleArchive(issue.id)}
                      className="p-1.5 text-gray-300 hover:text-[#4d686f] transition-colors"
                      title="Archivar"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    {issue.category.name}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="w-full py-3 text-center text-sm text-[#364461] hover:underline disabled:opacity-50"
            >
              {isFetchingNextPage ? 'Cargando...' : 'Cargar más'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
