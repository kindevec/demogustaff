import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Check, X, Tag } from 'lucide-react';
import { CategoryItem, Product } from '../../types';
import { getAllCategories, addCustomCategory, updateCustomCategory } from '../../data/categories';

interface CategorySelectorProps {
  value: string;
  onChange: (category: string) => void;
  products?: Product[];
  theme?: 'warm' | 'slate';
  labelClassName?: string;
  selectClassName?: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  onChange,
  products = [],
  theme = 'slate',
  labelClassName,
  selectClassName
}) => {
  const [categories, setCategories] = useState<CategoryItem[]>(() => getAllCategories(products));
  const [inlineMode, setInlineMode] = useState<'none' | 'add' | 'edit'>('none');
  const [inputValue, setInputValue] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Sincronizar categorías cuando cambie la lista de productos o el evento global
  useEffect(() => {
    const refreshCategories = () => {
      setCategories(getAllCategories(products));
    };

    refreshCategories();

    window.addEventListener('gustaff_categories_updated', refreshCategories);
    return () => {
      window.removeEventListener('gustaff_categories_updated', refreshCategories);
    };
  }, [products]);

  // Si el valor actual no está en la lista de categorías, agregarlo dinámicamente
  useEffect(() => {
    if (value && !categories.some(c => c.id.toLowerCase() === value.toLowerCase())) {
      const formatted = value.charAt(0).toUpperCase() + value.slice(1);
      setCategories(prev => [...prev, { id: value.toLowerCase(), name: formatted }]);
    }
  }, [value, categories]);

  const selectedCategoryObj = categories.find(
    c => c.id.toLowerCase() === (value || '').toLowerCase()
  ) || categories[0];

  const handleStartAdd = () => {
    setInputValue('');
    setErrorMsg('');
    setInlineMode('add');
  };

  const handleStartEdit = () => {
    if (!selectedCategoryObj) return;
    setInputValue(selectedCategoryObj.name);
    setErrorMsg('');
    setInlineMode('edit');
  };

  const handleCancelInline = () => {
    setInlineMode('none');
    setInputValue('');
    setErrorMsg('');
  };

  const handleSaveInline = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setErrorMsg('El nombre no puede estar vacío.');
      return;
    }

    if (inlineMode === 'add') {
      const added = addCustomCategory(trimmed, products);
      setCategories(getAllCategories(products));
      onChange(added.id);
    } else if (inlineMode === 'edit' && selectedCategoryObj) {
      updateCustomCategory(selectedCategoryObj.id, trimmed, products);
      setCategories(getAllCategories(products));
    }

    setInlineMode('none');
    setInputValue('');
    setErrorMsg('');
  };

  const isWarm = theme === 'warm';

  return (
    <div className="w-full">
      {/* Cabecera con Etiqueta y Botones de Acción */}
      <div className="flex items-center justify-between mb-1.5">
        <label className={labelClassName || (isWarm ? "block font-bold text-[#3d2516]" : "block text-xs font-bold text-slate-700")}>
          {isWarm ? 'Categoría:' : 'CATEGORÍA'}
        </label>
        
        {inlineMode === 'none' && (
          <div className="flex items-center gap-1.5">
            {/* Botón Editar categoría (Lápiz) */}
            <button
              type="button"
              onClick={handleStartEdit}
              title="Editar nombre de esta categoría"
              className={`p-1.5 px-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                isWarm
                  ? 'bg-[#f3ece0] text-[#8d461f] hover:bg-[#e8dcc4] border border-[#e8dcc4]'
                  : 'bg-slate-100 text-slate-600 hover:text-amber-700 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">Editar</span>
            </button>

            {/* Botón Agregar categoría (+) */}
            <button
              type="button"
              onClick={handleStartAdd}
              title="Crear nueva categoría"
              className={`p-1.5 px-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                isWarm
                  ? 'bg-[#b05d2e] text-white hover:bg-[#8d461f] shadow-xs'
                  : 'bg-amber-600 text-white hover:bg-amber-700 shadow-xs'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">Nueva</span>
            </button>
          </div>
        )}
      </div>

      {/* Selector de Categorías O Input de Edición/Creación Inline */}
      {inlineMode !== 'none' ? (
        <div className="space-y-1.5 animate-fadeIn">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                autoFocus
                onFocus={(e) => {
                  if (inlineMode === 'edit') e.target.select();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSaveInline();
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    handleCancelInline();
                  }
                }}
                placeholder={inlineMode === 'add' ? "Escribe el nombre de la nueva categoría..." : "Editar nombre de categoría..."}
                className="w-full bg-white border-2 border-amber-500 rounded-xl p-3 sm:p-3.5 text-sm sm:text-base text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-amber-500/20 shadow-xs transition-all"
              />
            </div>
            
            {/* Botón Guardar / Crear (Check) */}
            <button
              type="button"
              onClick={handleSaveInline}
              title={inlineMode === 'add' ? "Crear categoría (Enter)" : "Guardar cambios (Enter)"}
              className="p-3 sm:p-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl shadow-xs transition-all flex items-center justify-center cursor-pointer font-bold shrink-0"
            >
              <Check className="w-5 h-5" />
            </button>

            {/* Botón Cancelar (X) */}
            <button
              type="button"
              onClick={handleCancelInline}
              title="Cancelar (Escape)"
              className="p-3 sm:p-3.5 bg-slate-200 hover:bg-slate-300 text-slate-700 active:scale-95 rounded-xl transition-all flex items-center justify-center cursor-pointer font-bold shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {errorMsg && <p className="text-xs text-red-500 font-semibold">{errorMsg}</p>}
        </div>
      ) : (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={
            selectClassName ||
            (isWarm
              ? "w-full bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl p-2.5 text-xs text-[#3d2516] focus:outline-none focus:border-[#b05d2e] cursor-pointer font-medium"
              : "w-full bg-slate-50 hover:bg-white border border-slate-200 hover:border-amber-300 rounded-xl p-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all cursor-pointer font-medium")
          }
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};
