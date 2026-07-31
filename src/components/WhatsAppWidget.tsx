import React, { useState } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { WhatsAppIcon } from './SocialIcons';

export const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMsg, setUserMsg] = useState('');

  const defaultPhone = '593969718045'; // +593 96 971 8045

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const textToSend = userMsg.trim() || 'Hola Gustaff S.A., me gustaría solicitar información sobre sus productos industriales y coberturas.';
    const encoded = encodeURIComponent(textToSend);
    window.open(`https://wa.me/${defaultPhone}?text=${encoded}`, '_blank');
    setIsOpen(false);
    setUserMsg('');
  };

  return (
    <div className="fixed bottom-20 right-3 sm:right-6 lg:bottom-6 lg:right-6 z-40 flex flex-col items-end">
      {/* Interactive Popup Box */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-1.5rem)] max-w-sm sm:w-96 bg-white text-[#3d2516] rounded-2xl shadow-2xl border border-[#e8dcc4] overflow-hidden animate-slideUp">
          <div className="bg-gradient-to-r from-green-700 to-green-600 p-4 flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 p-1 flex items-center justify-center">
                <WhatsAppIcon size={24} className="text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Atención al Cliente Gustaff</h4>
                <p className="text-[11px] text-green-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  En línea (+593 96 971 8045)
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 bg-[#fdfaf5] space-y-3">
            <div className="bg-white p-3 rounded-xl border border-[#e8dcc4] text-xs text-[#4a3224]">
              <p className="font-bold text-[#3d2516] mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#b05d2e]" />
                ¡Hola! Bienvenido a Gustaff S.A.
              </p>
              <p>
                ¿En qué podemos ayudarte hoy? Solicita fichas técnicas, cotizaciones para maquila o muestras de coberturas.
              </p>
            </div>

            <form onSubmit={handleSend} className="space-y-2">
              <textarea
                value={userMsg}
                onChange={(e) => setUserMsg(e.target.value)}
                placeholder="Escribe tu mensaje o consulta..."
                className="w-full bg-white border border-[#e8dcc4] rounded-xl p-3 text-xs text-[#3d2516] placeholder-[#8d6e63] focus:outline-none focus:border-green-500 resize-none h-20"
              />
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <Send className="w-4 h-4" />
                Iniciar Chat en WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center border-2 border-emerald-300"
        aria-label="Contactar por WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400"></span>
        </span>
        <WhatsAppIcon size={28} className="text-white" />
      </button>
    </div>
  );
};
