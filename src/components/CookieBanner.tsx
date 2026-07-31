import React, { useState, useEffect } from 'react';
import { Shield, Check, Settings, X, Cookie } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytical, setAnalytical] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('gustaff_cookies_consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('gustaff_cookies_consent', JSON.stringify({
      necessary: true,
      analytical: true,
      marketing: true,
      date: new Date().toISOString()
    }));
    setVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('gustaff_cookies_consent', JSON.stringify({
      necessary: true,
      analytical,
      marketing,
      date: new Date().toISOString()
    }));
    setVisible(false);
    setShowSettings(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 z-50 p-3.5 sm:p-5 bg-[#3d2516] text-white border-t border-[#603813] shadow-2xl animate-fadeIn max-h-[85vh] overflow-y-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-start gap-2.5 sm:gap-3 max-w-3xl">
          <div className="p-2 sm:p-2.5 rounded-xl bg-white/10 text-[#d4af37] border border-white/20 shrink-0 mt-0.5">
            <Cookie className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-[#d4af37] flex items-center gap-2">
              Privacidad y Tratamiento de Datos - Gustaff S.A.
            </h4>
            <p className="text-[11px] sm:text-xs text-[#f3ece0] leading-relaxed mt-1">
              Utilizamos cookies para optimizar la navegación en nuestro catálogo industrial, gestionar la descarga segura de fichas técnicas y analizar el uso del sitio de acuerdo con la Ley Orgánica de Protección de Datos Personales del Ecuador.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0 pt-1 md:pt-0">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex-1 sm:flex-initial px-3 py-2 text-xs font-semibold rounded-lg bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-colors flex items-center justify-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5" />
            Configurar
          </button>
          <button
            onClick={handleAcceptAll}
            className="flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-lg bg-[#d4af37] text-[#3d2516] hover:bg-amber-400 transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Aceptar Todas
          </button>
        </div>
      </div>

      {/* Preferences Modal */}
      {showSettings && (
        <div className="mt-4 pt-4 border-t border-[#3D2314] max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#2C1810] p-3 rounded-xl border border-[#4A2C1D]">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-amber-200">Cookies Necesarias</span>
              <span className="text-[10px] bg-amber-900/80 text-amber-300 px-2 py-0.5 rounded">Obligatorias</span>
            </div>
            <p className="text-[11px] text-stone-400">
              Permiten el funcionamiento básico del sitio, la autenticación para la zona de descargas de fichas técnicas y la seguridad en formularios.
            </p>
          </div>

          <div className="bg-[#2C1810] p-3 rounded-xl border border-[#4A2C1D]">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-amber-200">Cookies Analíticas</span>
              <input
                type="checkbox"
                checked={analytical}
                onChange={(e) => setAnalytical(e.target.checked)}
                className="accent-amber-500 w-4 h-4"
              />
            </div>
            <p className="text-[11px] text-stone-400">
              Nos ayudan a medir el flujo de visitantes en las secciones de productos industriales y recetas.
            </p>
          </div>

          <div className="bg-[#2C1810] p-3 rounded-xl border border-[#4A2C1D]">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-amber-200">Gestión de Leads B2B</span>
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="accent-amber-500 w-4 h-4"
              />
            </div>
            <p className="text-[11px] text-stone-400">
              Permiten enviarte novedades de catálogo y muestras de productos de maquila según tu solicitud.
            </p>
          </div>

          <div className="md:col-span-3 flex justify-end pt-2">
            <button
              onClick={handleSavePreferences}
              className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-1.5 rounded-lg text-xs"
            >
              Guardar Preferencias
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
