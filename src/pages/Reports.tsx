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

function DateRangeFilter({ value, onChange }: { value: { start_date: string; end_date: string }; onChange: (v: any) => void }) {
  const presets = [
    { label: '7 días', days: 7 },
    { label: '30 días', days: 30 },
    { label: '90 días', days: 90 },
  ];
  const setPreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    onChange({ start_date: start.toISOString().split('T')[0], end_date: end.toISOString().split('T')[0] });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {presets.map((p) => (
        <button
          key={p.days}
          onClick={() => setPreset(p.days)}
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
        >
          {p.label}
        </button>
      ))}
      <div className="h-6 w-px bg-gray-300" />
      <div>
        <label className="block text-xs text-gray-500 mb-1">Desde</label>
        <input
          type="date"
          value={value.start_date}
          onChange={(e) => onChange({ ...value, start_date: e.target.value })}
          className="px-3 py-1.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#364461] text-sm"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Hasta</label>
        <input
          type="date"
          value={value.end_date}
          onChange={(e) => onChange({ ...value, end_date: e.target.value })}
          className="px-3 py-1.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#364461] text-sm"
        />
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

function safeData(d: any) {
  if (!d) return undefined;
  return d.data ?? d;
}

export default function Reports() {
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return {
      start_date: start.toISOString().split('T')[0],
      end_date: end.toISOString().split('T')[0],
    };
  });

  const params = { start_date: dateRange.start_date, end_date: dateRange.end_date };

  const { data: summaryRaw, isLoading: loadingSummary, isError: summaryError } = useReportSummary(params);
  const { data: categoryRaw, isLoading: loadingCat } = useCategoryReport(params);
  const { data: workerRaw, isLoading: loadingWorker } = useWorkerReport(params);
  const { data: dateRaw, isLoading: loadingDate } = useDateReport(params);

  const summary = safeData(summaryRaw);
  const categoryData = safeData(categoryRaw);
  const workerData = safeData(workerRaw);
  const dateData = safeData(dateRaw);

  const byStatus = summary?.by_status ?? [];
  const categories = categoryData?.summary ?? (Array.isArray(categoryData) ? categoryData : []);
  const workers = workerData?.workers ?? (Array.isArray(workerData) ? workerData : []);
  const daily = dateData?.daily ?? (Array.isArray(dateData) ? dateData : []);

  const isLoading = loadingSummary || loadingCat || loadingWorker || loadingDate;

  const totalIssues = summary?.total_issues ?? 0;
  const avgHours = summary?.avg_resolution_hours ?? 0;
  const totalUpvotes = summary?.total_upvotes ?? 0;
  const totalComments = summary?.total_comments ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#364461] mb-2">Reportes y Estadísticas</h1>
      <p className="text-sm text-gray-400 mb-4">
        {dateRange.start_date} al {dateRange.end_date}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                  {byStatus.map((s: any) => {
                    const total = byStatus.reduce((a: number, b: any) => a + (b.total || 0), 0);
                    const pct = total ? ((s.total / total) * 100).toFixed(1) : 0;
                    return (
                      <div key={s.status_name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{s.status_name}</span>
                          <span className="font-medium">{s.total} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{ width: `${pct}%`, backgroundColor: s.status_color || '#4d686f' }}
                          />
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
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v?.slice(5) || ''} />
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
                  {categories.map((c: any) => (
                    <div key={c.category_name} className="flex items-center justify-between text-sm">
                      <span className="font-medium">{c.category_name}</span>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{c.total} reportes</span>
                        <span>{c.resolved} resueltos</span>
                        <span>{c.avg_resolution_hours ? `${Number(c.avg_resolution_hours).toFixed(1)}h` : '-'}</span>
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
                  {workers.map((w: any) => {
                    const wrk = w.worker || w;
                    const assigned = w.assigned || 0;
                    const resolved = w.resolved || 0;
                    const pct = assigned ? (resolved / assigned) * 100 : 0;
                    return (
                      <div key={wrk.id || wrk.worker_id} className="border border-gray-100 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">
                            {wrk.first_name} {wrk.last_name || ''}
                          </span>
                          <span className="text-xs text-gray-500">
                            {resolved}/{assigned} resueltos
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-[#10B981] transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Prom. {w.avg_resolution_hours ? `${Number(w.avg_resolution_hours).toFixed(1)}h` : '-'} por resolución
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">Sin datos</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
