import React, { useState, useRef } from 'react';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  ExternalLink, 
  AlertCircle, 
  RotateCw, 
  ShieldCheck, 
  FileCheck, 
  Download,
  Trash2
} from 'lucide-react';
import { SiteContent } from '../../types';
import { uploadTermsDocument } from '../../lib/supabase';

interface AdminTermsTabProps {
  siteContent: SiteContent;
  onUpdateSiteContent: (newContent: SiteContent) => void;
  refreshSiteContent?: () => void;
}

export const AdminTermsTab: React.FC<AdminTermsTabProps> = ({
  siteContent,
  onUpdateSiteContent,
  refreshSiteContent
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const currentPdfUrl = siteContent.terms_document_url || '/docs/Terminos_y_Condiciones_Gustaff.pdf';
  const hasCustomPdf = Boolean(siteContent.terms_document_url);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('Por favor seleccione únicamente un archivo en formato PDF (.pdf).');
      setSelectedFile(null);
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('El archivo excede el tamaño máximo permitido de 15 MB.');
      setSelectedFile(null);
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('Por favor arrastre únicamente un archivo en formato PDF (.pdf).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('El archivo excede el tamaño máximo permitido de 15 MB.');
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await uploadTermsDocument(selectedFile);
    setIsUploading(false);

    if (res.success && res.url) {
      const updated = { ...siteContent, terms_document_url: res.url };
      onUpdateSiteContent(updated);
      if (refreshSiteContent) refreshSiteContent();
      setSelectedFile(null);
      setSuccessMessage('¡Documento de Términos y Condiciones actualizado exitosamente! Los nuevos clientes visualizarán este archivo al registrarse.');
      setTimeout(() => setSuccessMessage(null), 6000);
    } else {
      setErrorMessage(res.error || 'Error al subir el archivo PDF.');
    }
  };

  const handleRemoveCustomTerms = () => {
    if (confirm('¿Desea restablecer el documento al archivo predeterminado del sistema?')) {
      const updated = { ...siteContent, terms_document_url: undefined };
      onUpdateSiteContent(updated);
      if (refreshSiteContent) refreshSiteContent();
      setSuccessMessage('Se ha restablecido el documento predeterminado.');
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm shrink-0">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Términos, Condiciones y Privacidad
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Administra el documento PDF que los clientes (personas naturales y empresas) deben aceptar al registrarse.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Cumplimiento Legal y Privacidad</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3 text-sm animate-fadeIn shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Current Active Document Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              Documento Activo en Registro
            </h3>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600 font-bold text-xs uppercase shrink-0">
                  PDF
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {hasCustomPdf ? 'Términos_y_Privacidad_Gustaff_SA.pdf' : 'Documento Estándar Gustaff'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {hasCustomPdf ? 'Documento personalizado en la nube' : 'Archivo base del sistema'}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex flex-wrap gap-2">
                <a
                  href={currentPdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ver / Abrir PDF</span>
                </a>

                {hasCustomPdf && (
                  <button
                    type="button"
                    onClick={handleRemoveCustomTerms}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 text-xs font-bold rounded-xl transition-all border border-slate-200"
                    title="Restablecer al documento por defecto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Restablecer</span>
                  </button>
                )}
              </div>
            </div>

            <div className="mt-5 p-4 bg-amber-50/60 border border-amber-200/70 rounded-2xl text-xs text-amber-900 leading-relaxed space-y-2">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                ¿Cómo funciona para el cliente?
              </p>
              <p>
                Cuando una persona o empresa entra al formulario de registro, verá el check:
                <strong className="block mt-1 font-semibold text-slate-800 bg-white/70 p-2 rounded-lg border border-amber-200">
                  "Acepto los <span className="text-amber-700 underline">Términos y condiciones de privacidad</span>"
                </strong>
              </p>
              <p>
                Al hacer clic en el texto resaltado, se abrirá automáticamente este documento PDF para su lectura antes de registrarse.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Uploader Area */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-amber-500" />
              Subir o Reemplazar Documento PDF
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Selecciona el archivo PDF actualizado con las políticas de tratamiento de datos personales y términos comerciales.
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-5">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-amber-500 bg-amber-50/50 scale-[1.01]'
                    : selectedFile
                    ? 'border-emerald-400 bg-emerald-50/30'
                    : 'border-slate-300 hover:border-amber-400 hover:bg-slate-50/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-colors ${
                  selectedFile ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {selectedFile ? (
                    <FileCheck className="w-7 h-7" />
                  ) : (
                    <UploadCloud className="w-7 h-7" />
                  )}
                </div>

                {selectedFile ? (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Listo para subir
                    </p>
                    <span className="inline-block mt-2 text-xs font-semibold text-amber-600 underline">
                      Haz clic para cambiar archivo
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <p className="text-sm font-bold text-slate-800">
                      Arrastra tu archivo PDF aquí o <span className="text-amber-600 underline">explora tus archivos</span>
                    </p>
                    <p className="text-xs text-slate-400">
                      Solo archivos en formato PDF (.pdf) • Máximo 15 MB
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                {selectedFile && (
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    disabled={isUploading}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Cancelar
                  </button>
                )}

                <button
                  type="submit"
                  disabled={!selectedFile || isUploading}
                  className="w-full sm:w-auto px-6 py-3.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-2xl text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span>Subiendo y guardando PDF...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Guardar Documento de Términos</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
