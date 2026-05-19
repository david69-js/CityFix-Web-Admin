import { useState } from 'react';
import { useCategories, useCreateCategory } from '../hooks/useAdmin';
import { Loader2 } from 'lucide-react';

const ICONS = ['trash', 'road', 'lightbulb', 'water', 'tree', 'building', 'wrench', 'bug', 'leaf', 'recycle'];

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
                {ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setCatIcon(`fa-${icon}`)}
                    className={`p-3 rounded-lg border text-center text-sm transition-colors ${
                      catIcon === `fa-${icon}`
                        ? 'border-[#364461] bg-[#364461] text-white'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={!catName.trim() || !catIcon || createCategory.isPending}
              className="w-full px-4 py-2.5 bg-[#364461] text-white rounded-lg hover:bg-[#2a354e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {createCategory.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
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
            <div className="space-y-2">
              {catList.map((c: any) => (
                <div key={c.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <span className="bg-gray-100 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium text-gray-600">
                    {c.icon?.replace('fa-', '') || '?'}
                  </span>
                  <span className="text-sm text-gray-700">{c.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
