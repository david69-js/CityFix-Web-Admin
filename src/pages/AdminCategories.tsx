import { useState } from 'react';
import { useCategories, useCreateCategory } from '../hooks/useAdmin';
import { Loader2, Plus } from 'lucide-react';
import type { ComponentType } from 'react';
import {
  FaTrash, FaRoad, FaLightbulb, FaWater, FaTree, FaBuilding,
  FaWrench, FaBug, FaLeaf, FaRecycle, FaQuestionCircle,
} from 'react-icons/fa';

type IconComponent = ComponentType<{ className?: string }>;

const iconMap: Record<string, IconComponent> = {
  trash: FaTrash,
  road: FaRoad,
  lightbulb: FaLightbulb,
  water: FaWater,
  tree: FaTree,
  building: FaBuilding,
  wrench: FaWrench,
  bug: FaBug,
  leaf: FaLeaf,
  recycle: FaRecycle,
};

function resolveIcon(iconName: string): IconComponent {
  if (!iconName) return FaQuestionCircle;
  const clean = iconName
    .toLowerCase()
    .replace(/fa-solid\s*/g, '')
    .replace(/fa-regular\s*/g, '')
    .replace(/fas\s*/g, '')
    .replace(/far\s*/g, '')
    .replace(/fa-/g, '')
    .replace(/fa\s*/g, '')
    .trim();
  return iconMap[clean] || FaQuestionCircle;
}

const ICON_OPTIONS = [
  { name: 'trash', icon: FaTrash },
  { name: 'road', icon: FaRoad },
  { name: 'lightbulb', icon: FaLightbulb },
  { name: 'water', icon: FaWater },
  { name: 'tree', icon: FaTree },
  { name: 'building', icon: FaBuilding },
  { name: 'wrench', icon: FaWrench },
  { name: 'bug', icon: FaBug },
  { name: 'leaf', icon: FaLeaf },
  { name: 'recycle', icon: FaRecycle },
];

export default function AdminCategories() {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const [catName, setCatName] = useState('');
  const [catIcon, setCatIcon] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim() || !catIcon) return;
    createCategory.mutate(
      { name: catName, icon: catIcon },
      { onSuccess: () => { setCatName(''); setCatIcon(''); } }
    );
  };

  const catList = Array.isArray(categories) ? categories : categories?.data ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#364461] mb-6">Categorías</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-[#364461] mb-4">Crear Categoría</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="Nombre de la categoría"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#364461]"
            />
            <div>
              <p className="text-sm text-gray-500 mb-2">Seleccionar Icono</p>
              <div className="grid grid-cols-5 gap-2">
                {ICON_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const selected = catIcon === `fa-${opt.name}`;
                  return (
                    <button
                      key={opt.name}
                      type="button"
                      onClick={() => setCatIcon(`fa-${opt.name}`)}
                      className={`p-3 rounded-lg border flex flex-col items-center gap-1 text-sm transition-colors ${
                        selected
                          ? 'border-[#364461] bg-[#364461] text-white'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-[10px]">{opt.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              type="submit"
              disabled={!catName.trim() || !catIcon || createCategory.isPending}
              className="w-full px-4 py-2.5 bg-[#364461] text-white rounded-lg hover:bg-[#2a354e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {createCategory.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              <Plus className="w-4 h-4" />
              Crear Categoría
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-[#364461] mb-4">Categorías existentes</h2>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#364461]" />
            </div>
          ) : catList.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No hay categorías</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {catList.map((c: any) => {
                const Icon = resolveIcon(c.icon);
                return (
                  <div key={c.id} className="flex items-center gap-4 py-3">
                    <div className="w-10 h-10 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[#4d686f]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-[#364461]">{c.name}</p>
                      <p className="text-xs text-gray-400">ID: {c.id} · Icono: {c.icon}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
