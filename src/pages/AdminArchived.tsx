import { useState } from 'react';
import { useAdminIssues, useToggleIssueHidden, useDeleteIssue } from '../hooks/useIssues';
import StatusBadge from '../components/StatusBadge';
import { Search, RotateCcw, Trash2, Loader2, Calendar, MapPin } from 'lucide-react';

export default function AdminArchived() {
  const [search, setSearch] = useState('');
  const filters: Record<string, any> = { is_hidden: 1 };
  if (search) filters.search = search;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useAdminIssues(filters);

  const toggleHidden = useToggleIssueHidden();
  const deleteIssue = useDeleteIssue();

  const allIssues = data?.pages.flatMap((p) => p.data) ?? [];
  const issues = allIssues.filter((i: any) => i.is_hidden);

  const handleRestore = (id: number) => {
    toggleHidden.mutate({ issueId: id });
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Eliminar permanentemente este reporte? Esta acción no se puede deshacer.')) {
      deleteIssue.mutate(id);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#364461] mb-6">Reportes Archivados</h1>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar archivados..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#364461]"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#364461]" />
        </div>
      ) : issues.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No hay reportes archivados</div>
      ) : (
        <div className="space-y-3">
          {issues.map((issue: any) => (
            <div key={issue.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-[#364461]">{issue.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{issue.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(issue.created_at).toLocaleDateString()}
                    </span>
                    {issue.address && (
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
                        <MapPin className="w-3 h-3" />
                        {issue.address}
                      </span>
                    )}
                    <StatusBadge name={issue.status?.name || 'N/A'} color={issue.status?.color} />
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <button
                    onClick={() => handleRestore(issue.id)}
                    disabled={toggleHidden.isPending}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[#4d686f] text-white rounded-lg hover:bg-[#3a5258] transition-colors disabled:opacity-50"
                    title="Restaurar"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restaurar
                  </button>
                  <button
                    onClick={() => handleDelete(issue.id)}
                    disabled={deleteIssue.isPending}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
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
