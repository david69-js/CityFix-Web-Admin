import { useState, useRef } from 'react';
import {
  FileText, Grid3X3, Users, Calendar, Clock, List,
  Loader2, Download, AlertCircle, Eye, X,
} from 'lucide-react';
import { ReportsService } from '../api/reports';
import { fetchPreviewHtml, downloadPdf } from '../utils/pdfGenerator';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';

const REPORT_TYPES = [
  {
    id: 'summary',
    label: 'Resumen General',
    description: 'Totales, estado y categorías',
    icon: FileText,
    color: '#4d686f',
    fetchFn: ReportsService.summary,
    filename: (from: string, to: string) => `resumen-${from}-${to}.pdf`,
  },
  {
    id: 'by-category',
    label: 'Por Categoría',
    description: 'Desglose por categoría y estado',
    icon: Grid3X3,
    color: '#e3ba6a',
    fetchFn: ReportsService.byCategory,
    filename: (from: string, to: string) => `categorias-${from}-${to}.pdf`,
  },
  {
    id: 'by-worker',
    label: 'Por Trabajador',
    description: 'Rendimiento y asignaciones',
    icon: Users,
    color: '#3B82F6',
    fetchFn: ReportsService.byWorker,
    filename: (from: string, to: string) => `trabajadores-${from}-${to}.pdf`,
  },
  {
    id: 'by-date',
    label: 'Por Fecha',
    description: 'Tendencia de creación y resolución',
    icon: Calendar,
    color: '#8B5CF6',
    fetchFn: ReportsService.byDate,
    filename: (from: string, to: string) => `fechas-${from}-${to}.pdf`,
  },
  {
    id: 'resolution-times',
    label: 'Tiempos de Resolución',
    description: 'Métricas de velocidad de respuesta',
    icon: Clock,
    color: '#EF4444',
    fetchFn: ReportsService.resolutionTimes,
    filename: (from: string, to: string) => `tiempos-resolucion-${from}-${to}.pdf`,
  },
  {
    id: 'details',
    label: 'Detalle de Incidencias',
    description: 'Listado completo de reportes',
    icon: List,
    color: '#F59E0B',
    fetchFn: ReportsService.details,
    filename: (from: string, to: string) => `detalles-${from}-${to}.pdf`,
  },
];

export default function ReportsPDF() {
  const { user } = useAuthStore();
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return {
      from: start.toISOString().split('T')[0],
      to: end.toISOString().split('T')[0],
    };
  });
  const [generating, setGenerating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [preview, setPreview] = useState<{
    report: typeof REPORT_TYPES[0];
    blobUrl: string;
  } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const previewHtmlRef = useRef('');

  if (!user || user.role_id !== 1) {
    return <Navigate to="/reports" replace />;
  }

  const presets = [
    { label: '7 días', days: 7 },
    { label: '30 días', days: 30 },
    { label: '90 días', days: 90 },
  ];

  const setPreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setDateRange({ from: start.toISOString().split('T')[0], to: end.toISOString().split('T')[0] });
  };

  const handlePreview = async (report: typeof REPORT_TYPES[0]) => {
    setPreviewLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = { from: dateRange.from, to: dateRange.to };
      if (report.id === 'by-date') params.group_by = 'day';
      const html = await fetchPreviewHtml(report.id, report.fetchFn, params);
      previewHtmlRef.current = html;
      const blob = new Blob([html], { type: 'text/html' });
      setPreview({ report, blobUrl: URL.createObjectURL(blob) });
    } catch (err: any) {
      setError(err?.message || 'Error al generar la vista previa');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleDownloadFromPreview = async () => {
    if (!preview) return;
    const html = previewHtmlRef.current;
    if (!html) return;
    setGenerating(preview.report.id);
    setError(null);
    try {
      await downloadPdf(html, preview.report.filename(dateRange.from, dateRange.to));
      previewHtmlRef.current = '';
      URL.revokeObjectURL(preview.blobUrl);
      setPreview(null);
    } catch (err: any) {
      setError(err?.message || 'Error al descargar el PDF');
    } finally {
      setGenerating(null);
    }
  };

  const closePreview = () => {
    if (preview) {
      URL.revokeObjectURL(preview.blobUrl);
      previewHtmlRef.current = '';
      setPreview(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#364461] mb-2">Exportar Reportes PDF</h1>
      <p className="text-sm text-gray-400 mb-4">
        Selecciona un tipo de reporte para previsualizar y descargar en PDF
      </p>

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
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#364461] text-sm"
            />
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="block text-xs text-gray-500 mb-1">Hasta</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#364461] text-sm"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORT_TYPES.map((report) => {
          const isLoading = previewLoading || generating === report.id;
          return (
            <div
              key={report.id}
              className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: report.color + '20' }}
                >
                  <report.icon className="w-5 h-5" style={{ color: report.color }} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#364461] text-sm">{report.label}</h3>
                  <p className="text-xs text-gray-400">{report.description}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handlePreview(report)}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 border"
                  style={{
                    borderColor: report.color,
                    color: report.color,
                  }}
                >
                  {previewLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                  Vista Previa
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs text-blue-700 leading-relaxed">
          Haz clic en "Vista Previa" para ver el contenido del reporte antes de descargarlo.
          El rango de fechas aplica a todos los tipos de reporte.
        </p>
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closePreview}>
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[95vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-gray-200 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-[#364461]">{preview.report.label}</h2>
                <p className="text-xs text-gray-400">
                  {dateRange.from} al {dateRange.to}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadFromPreview}
                  disabled={generating === preview.report.id}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50"
                  style={{ backgroundColor: preview.report.color }}
                >
                  {generating === preview.report.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  Descargar PDF
                </button>
                <button
                  onClick={closePreview}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-gray-100 p-4 min-h-0">
              <iframe
                src={preview.blobUrl}
                className="w-full h-full rounded-lg border-0 bg-white shadow-inner"
                title="Vista previa del reporte"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
