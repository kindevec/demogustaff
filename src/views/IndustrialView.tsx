import React, { useState } from 'react';
import { Product, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  Package, 
  Download, 
  MessageSquare, 
  Search, 
  Filter, 
  Check, 
  Sparkles, 
  Lock, 
  FileText, 
  ArrowRight,
  ChevronRight,
  Send
} from 'lucide-react';

interface IndustrialViewProps {
  products: Product[];
  lang: Language;
  onSelectProduct: (p: Product) => void;
  onOpenAuth: () => void;
}

export const IndustrialView: React.FC<IndustrialViewProps> = ({
  products,
  lang,
  onSelectProduct,
  onOpenAuth
}) => {
  const t = TRANSLATIONS[lang].industrialPage;
  const industrialProds = products.filter(p => p.category === 'industrial' || p.category === 'coberturas' || p.category === 'galletas' || p.category === 'cocoa');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPackaging, setSelectedPackaging] = useState<string>('all');
  const [quoteSuccessMsg, setQuoteSuccessMsg] = useState('');

  // Filtering
  const filteredProducts = industrialProds.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.package_size.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedPackaging === 'all') return matchesSearch;
    return matchesSearch && p.package_size.toLowerCase().includes(selectedPackaging.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title & Banner */}
      <div className="bg-[#603813] text-white p-8 sm:p-12 rounded-3xl border border-[#d4af37]/30 shadow-xl text-left space-y-4 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 bg-[#d4af37] text-[#3d2516] font-extrabold px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider shadow">
          <Package className="w-4 h-4" />
          <span>Línea Industrial &amp; Granel</span>
        </div>

        {/* Verbatim Title Requested: "Maquilamos tus emprendimientos" */}
        <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-white">
          Maquilamos tus emprendimientos
        </h1>

        <p className="text-xs sm:text-sm text-[#f3ece0] max-w-3xl leading-relaxed">
          {t.subtitle} Suministro continuo de insumos a granel para la industria alimentaria, confitería, heladería y pastelería industrial en Ecuador y Latinoamérica.
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={onOpenAuth}
            className="bg-[#d4af37] hover:bg-amber-400 text-[#3d2516] font-bold px-6 py-2.5 rounded-full text-xs flex items-center gap-2 transition-colors shadow-lg"
          >
            <Lock className="w-4 h-4" />
            Descargar Fichas Técnicas PDF (Acceso Clientes)
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-[#e8dcc4] shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8d6e63] absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por producto, código o saco/caja..."
            className="w-full bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl py-2 pl-9 pr-3 text-xs text-[#3d2516] placeholder-[#8d6e63] focus:outline-none focus:border-[#b05d2e]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-[#6d4c41] font-bold flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#b05d2e]" /> Empaque:
          </span>
          {['all', 'Sacos', 'Cajas', 'Pomas'].map((pkg) => (
            <button
              key={pkg}
              onClick={() => setSelectedPackaging(pkg)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedPackaging === pkg
                  ? 'bg-[#603813] text-white font-bold'
                  : 'bg-[#f3ece0] text-[#4a3224] hover:bg-[#e8dcc4]'
              }`}
            >
              {pkg === 'all' ? 'Todos los Empaques' : pkg}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 12 Exact Industrial Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-3xl border border-[#e8dcc4] hover:border-[#b05d2e] transition-all overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md group"
          >
            {/* Product Image */}
            <div className="relative h-56 bg-[#fdf5e6] overflow-hidden">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-white/90 text-[#3d2516] font-mono text-xs font-bold px-2.5 py-1 rounded-lg border border-[#e8dcc4] shadow-sm">
                {p.code}
              </div>
              <div className="absolute bottom-3 right-3 bg-[#b05d2e] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
                {p.package_size}
              </div>
            </div>

            {/* Product Details */}
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between text-left">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#3d2516] group-hover:text-[#b05d2e] transition-colors">
                  {p.name}
                </h3>
                <p className="text-xs text-[#6d4c41] leading-relaxed mt-2 line-clamp-3">
                  {p.description}
                </p>

                {p.features && p.features.length > 0 && (
                  <ul className="mt-3 space-y-1 pt-2 border-t border-[#e8dcc4]">
                    {p.features.slice(0, 2).map((f, i) => (
                      <li key={i} className="text-[11px] text-[#6d4c41] flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#b05d2e] shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Card Actions */}
              <div className="pt-4 border-t border-[#e8dcc4] space-y-2">
                <button
                  onClick={() => onSelectProduct(p)}
                  className="w-full bg-[#f3ece0] hover:bg-[#e8dcc4] text-[#603813] border border-[#e8dcc4] font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-[#b05d2e]" />
                  Ver Especificaciones Técnicas
                </button>

                <button
                  onClick={onOpenAuth}
                  className="w-full bg-[#603813] hover:bg-[#3d2516] text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-[#d4af37]" />
                  Descargar Ficha Técnica PDF
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quote Request Form Section */}
      <section className="bg-[#3d2516] text-white p-8 sm:p-12 rounded-3xl border border-[#d4af37]/40 shadow-xl text-left space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs font-bold text-[#d4af37] uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/20">
            Atención Directa Corporativa
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white mt-2">
            Solicita Muestras o Cotizaciones de Maquila
          </h2>
          <p className="text-xs sm:text-sm text-[#f3ece0] mt-1">
            Nuestro equipo técnico y de ventas en Vía a Daule Guayaquil atenderá tus especificaciones industriales de empaque y formulación.
          </p>
        </div>

        {quoteSuccessMsg ? (
          <div className="p-4 bg-emerald-900/80 text-white border border-emerald-500 rounded-2xl text-xs font-bold flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-400" />
            <span>{quoteSuccessMsg}</span>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setQuoteSuccessMsg('¡Solicitud de cotización enviada con éxito! Un asesor industrial de Gustaff S.A. te contactará en breve.');
            }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl"
          >
            <input
              type="text"
              required
              placeholder="Nombre del Solicitante"
              className="bg-white/10 border border-white/20 rounded-xl p-3 text-xs text-white placeholder-[#f3ece0]/60 focus:outline-none focus:border-[#d4af37]"
            />
            <input
              type="email"
              required
              placeholder="Correo Corporativo"
              className="bg-white/10 border border-white/20 rounded-xl p-3 text-xs text-white placeholder-[#f3ece0]/60 focus:outline-none focus:border-[#d4af37]"
            />
            <input
              type="text"
              required
              placeholder="Nombre de la Empresa / Teléfono"
              className="bg-white/10 border border-white/20 rounded-xl p-3 text-xs text-white placeholder-[#f3ece0]/60 focus:outline-none focus:border-[#d4af37]"
            />
            <select
              className="bg-white/10 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
            >
              <option value="" className="text-[#3d2516]">Seleccione Producto de Interés...</option>
              {industrialProds.map(p => (
                <option key={p.id} value={p.name} className="text-[#3d2516]">{p.name} ({p.package_size})</option>
              ))}
            </select>
            <textarea
              placeholder="Especifique volúmenes estimados o requerimientos técnicos de maquila..."
              className="sm:col-span-2 bg-white/10 border border-white/20 rounded-xl p-3 text-xs text-white placeholder-[#f3ece0]/60 focus:outline-none focus:border-[#d4af37] h-24 resize-none"
            />
            <button
              type="submit"
              className="sm:col-span-2 bg-[#d4af37] hover:bg-amber-400 text-[#3d2516] font-bold py-3.5 rounded-full text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-colors"
            >
              <Send className="w-4 h-4" />
              Enviar Solicitud de Cotización
            </button>
          </form>
        )}
      </section>
    </div>
  );
};
