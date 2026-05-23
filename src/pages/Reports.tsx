import { useState } from 'react';
import {
  useReportSummary, useCategoryReport, useWorkerReport,
  useDateReport,
} from '../hooks/useReports';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  FileText, Clock, ThumbsUp, MessageSquare, Loader2, AlertCircle,
} from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  'pendiente': 'Pendiente',
  'en proceso': 'En Proceso',
  'proceso': 'En Proceso',
  'resuelto': 'Resuelto',
  'resolved': 'Resuelto',
};

function resolveStatusName(name: string) {
  if (!name) return 'Desconocido';
  const key = name.toLowerCase().trim();
  return STATUS_LABELS[key] || name;
}

function DateRangeFilter({ value, onChange }: { value: { from: string; to: string }; onChange: (v: any) => void }) {
  const presets = [
    { label: '7 días', days: 7 },
    { label: '30 días', days: 30 },
    { label: '90 días', days: 90 },
  ];
  const setPreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    onChange({ from: start.toISOString().split('T')[0], to: end.toISOString().split('T')[0] });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
        {presets.map((p) => (
          <button
            key={p.days}
            onClick={() => setPreset(p.days)}
            className="flex-1 sm:flex-initial px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors text-center"
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="hidden sm:block h-6 w-px bg-gray-300" />
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <div className="flex-1 min-w-[120px]">
          <label className="block text-xs text-gray-500 mb-1">Desde</label>
          <input
            type="date"
            value={value.from}
            onChange={(e) => onChange({ ...value, from: e.target.value })}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#364461] text-sm"
          />
        </div>
        <div className="flex-1 min-w-[120px]">
          <label className="block text-xs text-gray-500 mb-1">Hasta</label>
          <input
            type="date"
            value={value.to}
            onChange={(e) => onChange({ ...value, to: e.target.value })}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#364461] text-sm"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold text-[#364461]">{value}</p>
      </div>
    </div>
  );
}

export default function Reports() {
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return {
      from: start.toISOString().split('T')[0],
      to: end.toISOString().split('T')[0],
    };
  });

  const { data: summaryRaw, isLoading: loadingSummary, isError: summaryError } = useReportSummary({ from: dateRange.from, to: dateRange.to });
  const { data: categoryRaw, isLoading: loadingCat } = useCategoryReport({ from: dateRange.from, to: dateRange.to });
  const { data: workerRaw, isLoading: loadingWorker } = useWorkerReport({ from: dateRange.from, to: dateRange.to });
  const { data: dateRaw, isLoading: loadingDate } = useDateReport({ from: dateRange.from, to: dateRange.to });

  const summary = summaryRaw;
  const categoryData = categoryRaw;
  const workerData = workerRaw;
  const dateData = dateRaw;

  const byStatus = summary?.by_status ?? [];
  const categories = categoryData?.data ?? [];
  const workers = workerData?.data ?? [];
  const daily = dateData?.created ?? [];

  const isLoading = loadingSummary || loadingCat || loadingWorker || loadingDate;

  const totalIssues = summary?.total_issues ?? 0;
  const avgHours = summary?.avg_resolution_time_hours ?? 0;
  const totalUpvotes = summary?.total_upvotes ?? 0;
  const totalComments = summary?.total_comments ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#364461] mb-2">Reportes y Estadísticas</h1>
      <p className="text-sm text-gray-400 mb-4">
        {dateRange.from} al {dateRange.to}
      </p>
      <DateRangeFilter value={dateRange} onChange={setDateRange} />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#364461]" />
        </div>
      ) : summaryError ? (
        <div className="flex items-center justify-center gap-2 py-12 text-red-500">
          <AlertCircle className="w-5 h-5" />
          <span>Error al cargar estadísticas. Verifica que el servidor esté corriendo.</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={FileText} label="Total Reportes" value={totalIssues} color="#4d686f" />
            <StatCard icon={Clock} label="Prom. Resolución" value={avgHours ? `${Number(avgHours).toFixed(1)}h` : '0h'} color="#e3ba6a" />
            <StatCard icon={ThumbsUp} label="Total Upvotes" value={totalUpvotes} color="#3B82F6" />
            <StatCard icon={MessageSquare} label="Total Comentarios" value={totalComments} color="#10B981" />
          </div>

          {totalIssues === 0 && !isLoading && (
            <div className="text-center py-8 text-gray-400 bg-white rounded-lg border border-gray-200 mb-8">
              No hay datos para el período seleccionado
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="font-semibold text-[#364461] mb-4">Distribución por Estado</h2>
              {byStatus.length > 0 ? (
                <div className="space-y-3">
                  {byStatus.map((s: any, idx: number) => {
                    const total = byStatus.reduce((a: number, b: any) => a + (b.total || 0), 0);
                    const pct = total ? ((s.total / total) * 100).toFixed(1) : 0;
                    const name = resolveStatusName(s.status);
                    return (
                      <div key={name + idx}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-[#364461]">{name}</span>
                          <span className="text-sm text-gray-500">{s.total} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-6">
                          <div
                            className="h-6 rounded-full transition-all flex items-center justify-end px-2"
                            style={{
                              width: `${pct}%`,
                              minWidth: Number(pct) > 0 ? '40px' : '0px',
                              backgroundColor: '#4d686f',
                            }}
                          >
                            <span className={`text-xs font-semibold leading-none ${Number(pct) > 25 ? 'text-white' : 'text-gray-600'}`}>
                              {pct}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">Sin datos</p>
              )}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="font-semibold text-[#364461] mb-4">Tendencia Diaria</h2>
              {daily.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={daily}>
                    <XAxis dataKey="period" tick={{ fontSize: 11 }} tickFormatter={(v) => v?.slice(5) || ''} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="total" fill="#4d686f" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400 text-center py-4">Sin datos</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="font-semibold text-[#364461] mb-4">Categorías</h2>
              {categories.length > 0 ? (
                <div className="space-y-3">
                  {categories.map((c: any, idx: number) => (
                    <div key={c.category || idx} className="flex items-center justify-between text-sm">
                      <span className="font-medium">{c.category}</span>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{c.total} reportes</span>
                        <span>{c.resolved_count} resueltos</span>
                        <span>{c.avg_resolution_time_hours ? `${Number(c.avg_resolution_time_hours).toFixed(1)}h` : '-'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">Sin datos</p>
              )}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="font-semibold text-[#364461] mb-4">Rendimiento de Trabajadores</h2>
              {workers.length > 0 ? (
                <div className="space-y-4">
                  {workers.map((w: any, idx: number) => {
                    const wrk = w.worker || w;
                    const userId = wrk.id || idx;
                    const assigned = Number(w.total_assigned || 0);
                    const completed = Number(w.completed_count || w.issues_resolved || 0);
                    const avgHours = Number(w.avg_completion_time_hours || 0);
                    const pct = assigned ? Math.round((completed / assigned) * 100) : 0;
                    const initial = (wrk.first_name || '?')[0];
                    const cats = w.categories_worked || [];
                    return (
                      <div key={userId} className="border border-gray-100 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-[#364461] flex items-center justify-center text-white text-sm font-medium shrink-0">
                            {initial}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-[#364461] truncate">
                              {wrk.first_name} {wrk.last_name || ''}
                            </p>
                            <p className="text-xs text-gray-400">{wrk.email || ''}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-lg font-bold text-[#364461]">{pct}%</p>
                            <p className="text-xs text-gray-500">{completed}/{assigned} completados</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: pct >= 80 ? '#10B981' : pct >= 40 ? '#e3ba6a' : '#EF4444' }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>
                            Prom. finalización: {avgHours ? `${avgHours.toFixed(1)}h` : '-'}
                          </span>
                          {cats.length > 0 && (
                            <span className="flex items-center gap-1">
                              {cats.map((c: any, i: number) => (
                                <span key={i} className="bg-gray-100 px-2 py-0.5 rounded">
                                  {c.category || c}
                                </span>
                              ))}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-1">Sin datos de trabajadores</p>
                  <p className="text-xs text-gray-300">No hay reportes asignados a trabajadores en este período</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
