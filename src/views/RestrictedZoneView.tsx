import React, { useState } from 'react';
import { User, DownloadItem, Language } from '../types';
import { INITIAL_DOWNLOADS } from '../data/initialData';
import { TRANSLATIONS } from '../data/translations';
import { 
  Lock, 
  Unlock, 
  FileText, 
  Download, 
  ShieldAlert, 
  CheckCircle2, 
  Search, 
  Sparkles,
  UserCheck,
  FileCheck,
  ArrowRight
} from 'lucide-react';

interface RestrictedZoneViewProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  lang: Language;
}

export const RestrictedZoneView: React.FC<RestrictedZoneViewProps> = ({
  currentUser,
  onOpenAuth,
  lang
}) => {
  const t = TRANSLATIONS[lang].downloadsPage;
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadSuccessItem, setDownloadSuccessItem] = useState<string | null>(null);

  const filteredDownloads = INITIAL_DOWNLOADS.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (item: DownloadItem) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    // Simulate instant download trigger
    setDownloadSuccessItem(item.title);

    // Create virtual blob link download simulation
    const element = document.createElement('a');
    const file = new Blob([
      `GUSTAFF S.A. - DOCUMENTO OFICIAL\n================================\nTítulo: ${item.title}\nCategoría: ${item.category}\nVersión: 2026.1\nFecha de Descarga: ${new Date().toLocaleDateString()}\nUsuario Registrado: ${currentUser.name} (${currentUser.email})\n\nEste documento contiene información técnica de calidad e inocuidad alimentaria del catálogo de Gustaff S.A.`
    ], { type: 'text/plain' });

    element.href = URL.createObjectURL(file);
    element.download = `${item.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setTimeout(() => setDownloadSuccessItem(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="bg-[#603813] text-white p-8 sm:p-12 rounded-3xl border border-[#d4af37]/30 shadow-xl text-left space-y-4 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 bg-[#d4af37] text-[#3d2516] font-extrabold px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider shadow">
          {currentUser ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          <span>Área Restringida de Descargas Técnicas</span>
        </div>

        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-white">
          {t.title}
        </h1>

        <p className="text-xs sm:text-sm text-[#f3ece0] max-w-3xl leading-relaxed">
          {t.subtitle} Descargue en formato PDF las fichas técnicas con parámetros fisicoquímicos, microbiológicos, vida útil y tablas nutricionales.
        </p>

        {!currentUser ? (
          <div className="p-4 bg-white/10 border border-white/20 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-[#d4af37] shrink-0" />
              <p className="text-xs text-[#f3ece0]">
                {t.authNotice}
              </p>
            </div>
            <button
              onClick={onOpenAuth}
              className="shrink-0 bg-[#d4af37] hover:bg-amber-400 text-[#3d2516] font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider shadow transition-colors"
            >
              {t.btnLoginRegister}
            </button>
          </div>
        ) : (
          <div className="p-4 bg-emerald-900/80 border border-emerald-500 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">
                  Sesión Activa: {currentUser.name} ({currentUser.email})
                </p>
                <p className="text-[11px] text-emerald-200">
                  Empresa: {currentUser.company || 'Cliente Registrado'} | Acceso habilitado a todas las descargas.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {downloadSuccessItem && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-bold flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-emerald-600" />
          <span>¡Descarga iniciada exitosamente para: "{downloadSuccessItem}"!</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e8dcc4] shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-[#8d6e63] absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar ficha técnica, catálogo o brochure..."
            className="w-full bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl py-2 pl-9 pr-3 text-xs text-[#3d2516] placeholder-[#8d6e63] focus:outline-none focus:border-[#b05d2e]"
          />
        </div>

        <div className="text-xs text-[#b05d2e] font-bold">
          {filteredDownloads.length} Documentos Técnicos Disponibles
        </div>
      </div>

      {/* Grid of Download Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDownloads.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-6 border border-[#e8dcc4] hover:border-[#b05d2e] transition-all shadow-sm hover:shadow-md flex flex-col justify-between text-left space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#f3ece0] text-[#b05d2e] px-2.5 py-1 rounded-md border border-[#e8dcc4]">
                  {item.category === 'ficha_tecnica' ? 'Ficha Técnica PDF' : 'Documento Institucional'}
                </span>
                <span className="text-xs font-mono font-bold text-[#8d6e63]">
                  {item.file_size}
                </span>
              </div>

              <h3 className="font-serif font-bold text-lg text-[#3d2516]">
                {item.title}
              </h3>

              <p className="text-xs text-[#6d4c41] leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#e8dcc4]">
              {currentUser ? (
                <button
                  onClick={() => handleDownload(item)}
                  className="w-full bg-[#603813] hover:bg-[#3d2516] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <Download className="w-4 h-4 text-[#d4af37]" />
                  Descargar Documento PDF
                </button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="w-full bg-[#f3ece0] hover:bg-[#e8dcc4] text-[#603813] border border-[#e8dcc4] font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Lock className="w-4 h-4 text-[#b05d2e]" />
                  Registrarse para Descargar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
