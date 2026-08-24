import React, { useState } from 'react';
import { Product } from '../types';
import { uploadProductImage, uploadSpecSheetFile } from '../lib/supabase';
import { X, Save, Upload, Package, Edit3, Image as ImageIcon, Check, Trash2, FileText, Download, ExternalLink } from 'lucide-react';
import { CategorySelector } from './admin/CategorySelector';

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
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
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

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPdf(true);
    const res = await uploadSpecSheetFile(file);
    if (res.success && res.url) {
      setForm(prev => ({ ...prev, spec_sheet_url: res.url! }));
    } else {
      alert('Error al subir Ficha Técnica: ' + (res.error || 'Intente nuevamente'));
    }
    setIsUploadingPdf(false);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white text-[#3d2516] rounded-3xl shadow-2xl border border-[#e8dcc4] my-auto max-h-[92vh] flex flex-col overflow-hidden text-left">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#e8dcc4] flex items-center justify-between bg-[#fdfaf5] shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-[#f3ece0] text-[#b05d2e] rounded-2xl border border-[#e8dcc4] shadow-xs">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[#3d2516]">
                  {product.id && !product.id.startsWith('prod_') ? `Editar Producto: ${product.name}` : 'Crear Nuevo Producto'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#f3ece0] text-[#8d461f] border border-[#e8dcc4]">
                  {form.code || 'Nuevo'}
                </span>
              </div>
              <p className="text-xs text-[#8d6e63] mt-0.5">
                Los cambios se actualizarán en tiempo real en todo el catálogo público.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full hover:bg-[#f3ece0] text-slate-400 hover:text-[#3d2516] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            
            {/* Columna Izquierda: Información Comercial */}
            <div className="bg-[#fdfaf5] p-5 sm:p-6 rounded-2xl border border-[#e8dcc4] space-y-4">
              <div className="flex items-center justify-between border-b border-[#e8dcc4] pb-2.5">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#603813] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#b05d2e]" />
                  Datos del Producto
                </h4>
                <span className="text-[10px] text-[#8d6e63]">Campos requeridos *</span>
              </div>

              {/* Código y Presentación */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#3d2516] mb-1 text-xs">Código Interno *</label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={e => setForm({ ...form, code: e.target.value })}
                    placeholder="Ej: GUST-IND-01"
                    className="w-full bg-white border border-[#e8dcc4] rounded-xl p-2.5 text-xs text-[#3d2516] focus:outline-none focus:border-[#b05d2e]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#3d2516] mb-1 text-xs">Presentación / Tamaño *</label>
                  <input
                    type="text"
                    value={form.package_size}
                    onChange={e => setForm({ ...form, package_size: e.target.value })}
                    placeholder="Ej: Sacos de 25 kg"
                    className="w-full bg-white border border-[#e8dcc4] rounded-xl p-2.5 text-xs text-[#3d2516] focus:outline-none focus:border-[#b05d2e]"
                    required
                  />
                </div>
              </div>

              {/* Nombre */}
              <div>
                <label className="block font-bold text-[#3d2516] mb-1 text-xs">Nombre del Producto *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej: Cobertura Semiamarga en Gotas"
                  className="w-full bg-white border border-[#e8dcc4] rounded-xl p-2.5 text-xs text-[#3d2516] focus:outline-none focus:border-[#b05d2e]"
                  required
                />
              </div>

              {/* Categoría */}
              <div>
                <CategorySelector
                  value={form.category}
                  onChange={(cat) => setForm({ ...form, category: cat })}
                  theme="warm"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block font-bold text-[#3d2516] mb-1 text-xs">Descripción Comercial *</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Descripción detallada para el catálogo..."
                  className="w-full bg-white border border-[#e8dcc4] rounded-xl p-2.5 text-xs text-[#3d2516] focus:outline-none focus:border-[#b05d2e] leading-relaxed resize-none"
                  required
                />
              </div>

              {/* Destacado */}
              <div className="pt-1">
                <label className="flex items-center gap-2.5 p-3 bg-white border border-[#e8dcc4] rounded-xl cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={Boolean(form.is_featured)}
                    onChange={e => setForm({ ...form, is_featured: e.target.checked })}
                    className="w-4 h-4 text-[#b05d2e] rounded border-[#e8dcc4] focus:ring-[#b05d2e] cursor-pointer"
                  />
                  <span className="font-bold text-[#3d2516] text-xs">
                    ⭐ Mostrar como Producto Destacado en Inicio
                  </span>
                </label>
              </div>
            </div>

            {/* Columna Derecha: Imagen y Ficha PDF */}
            <div className="space-y-4">
              {/* Imagen */}
              <div className="bg-[#fdfaf5] p-5 sm:p-6 rounded-2xl border border-[#e8dcc4] space-y-3">
                <div className="flex items-center justify-between border-b border-[#e8dcc4] pb-2.5">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#603813] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#b05d2e]" />
                    Fotografía del Producto
                  </h4>
                  <span className="text-[10px] text-[#8d6e63]">800x800 px</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-white border border-[#e8dcc4] rounded-xl">
                  <div className="relative w-24 h-24 bg-[#fdfaf5] rounded-xl border border-[#e8dcc4] overflow-hidden shrink-0 flex items-center justify-center">
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
                      <span>{isUploading ? 'Subiendo archivo...' : 'Subir Nueva Imagen'}</span>
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
                      className="w-full bg-white border border-[#e8dcc4] rounded-xl px-3 py-1.5 text-xs text-[#3d2516] focus:outline-none focus:border-[#b05d2e] font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Ficha Técnica PDF */}
              <div className="bg-[#fdfaf5] p-5 sm:p-6 rounded-2xl border border-[#e8dcc4] space-y-3">
                <div className="flex items-center justify-between border-b border-[#e8dcc4] pb-2.5">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#603813] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#b05d2e]" />
                    Ficha Técnica PDF
                  </h4>
                  {form.spec_sheet_url && (
                    <a
                      href={form.spec_sheet_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#b05d2e] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <ExternalLink className="w-3 h-3" /> Ver PDF actual
                    </a>
                  )}
                </div>

                <div className="p-3.5 bg-white border border-[#e8dcc4] rounded-xl space-y-3">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <label className="cursor-pointer bg-[#f3ece0] hover:bg-[#e8dcc4] text-[#603813] font-bold px-3 py-2 rounded-xl text-xs border border-[#e8dcc4] flex items-center justify-center gap-1.5 transition-all text-center w-full sm:w-auto shrink-0">
                      <FileText className="w-3.5 h-3.5 text-[#b05d2e]" />
                      <span>{isUploadingPdf ? 'Subiendo PDF...' : '📄 Subir PDF'}</span>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handlePdfUpload}
                        className="hidden"
                        disabled={isUploadingPdf}
                      />
                    </label>
                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={form.spec_sheet_url || ''}
                        onChange={e => setForm({ ...form, spec_sheet_url: e.target.value })}
                        placeholder="O pegar URL de Google Drive / PDF..."
                        className="w-full bg-white border border-[#e8dcc4] rounded-xl px-3 py-2 text-xs text-[#3d2516] focus:outline-none focus:border-[#b05d2e] font-mono"
                      />
                    </div>
                  </div>
                  {form.spec_sheet_url ? (
                    <div className="flex items-center justify-between text-[11px] bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <span className="flex items-center gap-1.5 font-medium truncate">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        Ficha: <span className="font-mono truncate">{form.spec_sheet_url}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, spec_sheet_url: '' })}
                        className="text-red-500 hover:text-red-700 font-bold ml-2 shrink-0 cursor-pointer"
                      >
                        Quitar
                      </button>
                    </div>
                  ) : (
                    <p className="text-[10px] text-[#8d6e63]">
                      💡 Permite la descarga del documento técnico en la web pública.
                    </p>
                  )}
                </div>
              </div>
            </div>

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
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="bg-[#b05d2e] hover:bg-[#8d461f] text-white font-bold px-7 py-2.5 rounded-xl shadow-md text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-70"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Guardando...' : 'Guardar Producto'}</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
