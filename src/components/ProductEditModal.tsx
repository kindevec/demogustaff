import React, { useState } from 'react';
import { Product } from '../types';
import { uploadProductImage } from '../lib/supabase';
import { X, Save, Upload, Package, Edit3, Image as ImageIcon, Check, Trash2 } from 'lucide-react';

interface ProductEditModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  product,
  onClose,
  onSave,
  onDelete
}) => {
  if (!product) return null;

  const [form, setForm] = useState<Product>({ ...product });
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const res = await uploadProductImage(file);
    if (res.success && res.url) {
      setForm(prev => ({ ...prev, image: res.url! }));
    } else {
      alert('Error al subir imagen: ' + (res.error || 'Intente nuevamente'));
    }
    setIsUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err: any) {
      alert('Error al guardar producto: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete || !product.id) return;
    if (confirm(`¿Estás seguro de eliminar "${product.name}"?`)) {
      setIsSaving(true);
      await onDelete(product.id);
      setIsSaving(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white text-[#3d2516] rounded-3xl shadow-2xl border border-[#e8dcc4] my-auto max-h-[92vh] flex flex-col overflow-hidden text-left">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#e8dcc4] flex items-center justify-between bg-[#fdfaf5] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#f3ece0] text-[#b05d2e] rounded-2xl border border-[#e8dcc4]">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#3d2516]">
                {product.id && !product.id.startsWith('prod_') ? `Editar Producto — ${product.name}` : 'Crear Nuevo Producto'}
              </h3>
              <p className="text-xs text-[#6d4c41]">
                Los cambios se actualizarán en tiempo real en todo el sitio web.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#f3ece0] text-slate-400 hover:text-[#3d2516] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          
          {/* Código y Nombre */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#3d2516] mb-1">Código del Producto:</label>
              <input
                type="text"
                value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value })}
                placeholder="Ej: GUST-IND-01"
                className="w-full bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl p-2.5 text-xs text-[#3d2516] focus:outline-none focus:border-[#b05d2e]"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-[#3d2516] mb-1">Nombre del Producto:</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Ej: Cocoa edulcorada"
                className="w-full bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl p-2.5 text-xs text-[#3d2516] focus:outline-none focus:border-[#b05d2e]"
                required
              />
            </div>
          </div>

          {/* Categoría y Presentación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#3d2516] mb-1">Categoría:</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value as any })}
                className="w-full bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl p-2.5 text-xs text-[#3d2516] focus:outline-none focus:border-[#b05d2e] cursor-pointer"
              >
                <option value="industrial">Industrial</option>
                <option value="consumer">Consumo</option>
                <option value="coberturas">Coberturas</option>
                <option value="galletas">Galletas</option>
                <option value="cocoa">Cocoa</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#3d2516] mb-1">Presentación / Tamaño:</label>
              <input
                type="text"
                value={form.package_size}
                onChange={e => setForm({ ...form, package_size: e.target.value })}
                placeholder="Ej: Sacos de 25 kg"
                className="w-full bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl p-2.5 text-xs text-[#3d2516] focus:outline-none focus:border-[#b05d2e]"
                required
              />
            </div>
          </div>

          {/* Imagen */}
          <div className="space-y-2">
            <label className="block font-bold text-[#3d2516]">Fotografía del Producto:</label>
            <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-[#fdfaf5] border border-[#e8dcc4] rounded-2xl">
              <div className="relative w-20 h-20 bg-white rounded-xl border border-[#e8dcc4] overflow-hidden shrink-0 flex items-center justify-center">
                {form.image ? (
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-8 h-8 text-[#8d6e63] opacity-40" />
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[10px] font-bold">
                    Subiendo...
                  </div>
                )}
              </div>
              <div className="flex-1 w-full space-y-2">
                <label className="cursor-pointer bg-[#f3ece0] hover:bg-[#e8dcc4] text-[#603813] font-bold px-3 py-2 rounded-xl text-xs border border-[#e8dcc4] flex items-center justify-center gap-1.5 transition-all text-center">
                  <Upload className="w-3.5 h-3.5 text-[#b05d2e]" />
                  <span>{isUploading ? 'Subiendo archivo...' : 'Subir Nueva Imagen desde dispositivo...'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
                <input
                  type="text"
                  value={form.image}
                  onChange={e => setForm({ ...form, image: e.target.value })}
                  placeholder="O pegar URL directa de imagen..."
                  className="w-full bg-white border border-[#e8dcc4] rounded-xl px-3 py-1.5 text-xs text-[#3d2516] focus:outline-none focus:border-[#b05d2e]"
                />
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block font-bold text-[#3d2516] mb-1">Descripción del Producto:</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Descripción detallada para el catálogo..."
              className="w-full bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl p-2.5 text-xs text-[#3d2516] focus:outline-none focus:border-[#b05d2e] leading-relaxed"
              required
            />
          </div>

          {/* Destacado */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_featured_cb"
              checked={Boolean(form.is_featured)}
              onChange={e => setForm({ ...form, is_featured: e.target.checked })}
              className="w-4 h-4 text-[#b05d2e] rounded border-[#e8dcc4] focus:ring-[#b05d2e]"
            />
            <label htmlFor="is_featured_cb" className="font-bold text-[#3d2516] text-xs cursor-pointer select-none">
              Mostrar como Producto Destacado en la Página de Inicio
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#e8dcc4] gap-3">
            {onDelete && product.id && !product.id.startsWith('prod_') ? (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-4 py-2.5 rounded-xl border border-red-200 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Eliminar</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="bg-[#b05d2e] hover:bg-[#8d461f] text-white font-bold px-6 py-2.5 rounded-xl shadow-md text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
