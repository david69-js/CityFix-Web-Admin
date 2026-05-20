import { useState } from 'react';
import {
  FileText, Grid3X3, Users, Calendar, Clock, List,
  Loader2, Download, AlertCircle, CheckCircle2,
} from 'lucide-react';
import { ReportsService } from '../api/reports';
import { downloadPdf } from '../utils/pdfGenerator';
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
  const [success, setSuccess] = useState<string | null>(null);

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

  const handleDownload = async (report: typeof REPORT_TYPES[0]) => {
    setGenerating(report.id);
    setError(null);
    setSuccess(null);
    try {
      const params: Record<string, any> = { from: dateRange.from, to: dateRange.to };
      if (report.id === 'by-date') {
        params.group_by = 'day';
      }
      await downloadPdf(
        report.id,
        report.filename(dateRange.from, dateRange.to),
        report.fetchFn,
        params,
      );
      setSuccess(report.label);
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err?.message || 'Error al generar el PDF');
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#364461] mb-2">Exportar Reportes PDF</h1>
      <p className="text-sm text-gray-400 mb-4">
        Selecciona un tipo de reporte y descárgalo en formato PDF
      </p>

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
            value={dateRange.from}
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            className="px-3 py-1.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#364461] text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Hasta</label>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="px-3 py-1.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#364461] text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 mb-6 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {success} — PDF generado correctamente
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORT_TYPES.map((report) => {
          const isLoading = generating === report.id;
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
              <button
                onClick={() => handleDownload(report)}
                disabled={isLoading}
                className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: report.color + '15',
                  color: report.color,
                  border: `1.5px solid ${report.color}`,
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Descargar PDF
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs text-blue-700 leading-relaxed">
          Los reportes se generan automáticamente con los datos más recientes del servidor.
          El rango de fechas aplica a todos los tipos de reporte.
        </p>
      </div>
    </div>
  );
}
