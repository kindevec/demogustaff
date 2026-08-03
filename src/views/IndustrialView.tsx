import React, { useState } from 'react';
import { translateProduct } from '../lib/translateProduct';
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
}

export const IndustrialView: React.FC<IndustrialViewProps> = ({
  products,
  lang,
  onSelectProduct,
  onOpenAuth
}) => {
  const t = TRANSLATIONS[lang].industrialPage;
  const industrialProds = products.map(p => translateProduct(p, lang)).filter(p => p.category === 'industrial' || p.category === 'coberturas' || p.category === 'galletas' || p.category === 'cocoa');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPackaging, setSelectedPackaging] = useState<string>('all');
  const [quoteSuccessMsg, setQuoteSuccessMsg] = useState('');

  const packagingFilters = [
    { id: 'all', label: t.pkgFilterAll },
    { id: 'Sacos', label: t.pkgSacos },
    { id: 'Cajas', label: t.pkgCajas },
    { id: 'Pomas', label: t.pkgPomas }
  ];

  // Filtering
  const filteredProducts = industrialProds.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.package_size.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedPackaging === 'all') return matchesSearch;
    let pkgKeyword = selectedPackaging.toLowerCase();
    if (lang === 'en') {
      if (pkgKeyword === 'sacos') pkgKeyword = 'bags';
      if (pkgKeyword === 'cajas') pkgKeyword = 'boxes';
      if (pkgKeyword === 'pomas') pkgKeyword = 'pails';
    }
    return matchesSearch && p.package_size.toLowerCase().includes(pkgKeyword);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title & Banner */}
      <div className="bg-[#603813] text-white p-8 sm:p-12 rounded-3xl border border-[#d4af37]/30 shadow-xl text-left space-y-4 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 bg-[#d4af37] text-[#3d2516] font-extrabold px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider shadow">
          <Package className="w-4 h-4" />
          <span>{t.bannerBadge}</span>
        </div>

        <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-white">
          {t.bannerTitle}
        </h1>

        <p className="text-xs sm:text-sm text-[#f3ece0] max-w-3xl leading-relaxed">
          {t.subtitle}
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={onOpenAuth}
            className="bg-[#d4af37] hover:bg-amber-400 text-[#3d2516] font-bold px-6 py-2.5 rounded-full text-xs flex items-center gap-2 transition-colors shadow-lg"
          >
            <Lock className="w-4 h-4" />
            {t.downloadPdfClient}
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
            placeholder={t.searchPlaceholder}
            className="w-full bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl py-2 pl-9 pr-3 text-xs text-[#3d2516] placeholder-[#8d6e63] focus:outline-none focus:border-[#b05d2e]"
          />
        </div>

        <div className="w-full sm:w-auto relative min-w-[200px]">
          <Filter className="w-4 h-4 text-[#8d6e63] absolute left-3 top-2.5" />
          <select
            value={selectedPackaging}
            onChange={(e) => setSelectedPackaging(e.target.value)}
            className="w-full appearance-none bg-[#f3ece0] border border-[#e8dcc4] rounded-xl py-2 pl-9 pr-10 text-xs font-semibold text-[#4a3224] focus:outline-none focus:border-[#b05d2e] focus:bg-[#fdfaf5] cursor-pointer"
          >
            {packagingFilters.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#8d6e63]">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Grid of Industrial Products */}
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
                  {t.viewTechSpecs}
                </button>

                <button
                  onClick={onOpenAuth}
                  className="w-full bg-[#603813] hover:bg-[#3d2516] text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-[#d4af37]" />
                  {t.downloadTechPdf}
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
            {t.quoteBadge}
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white mt-2">
            {t.quoteTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#f3ece0] mt-1">
            {t.quoteDesc}
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
              setQuoteSuccessMsg(t.quoteSuccess);
            }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl"
          >
            <input
              type="text"
              required
              placeholder={t.applicantName}
              className="bg-white/10 border border-white/20 rounded-xl p-3 text-xs text-white placeholder-[#f3ece0]/60 focus:outline-none focus:border-[#d4af37]"
            />
            <input
              type="email"
              required
              placeholder={t.corporateEmail}
              className="bg-white/10 border border-white/20 rounded-xl p-3 text-xs text-white placeholder-[#f3ece0]/60 focus:outline-none focus:border-[#d4af37]"
            />
            <input
              type="text"
              required
              placeholder={t.companyPhone}
              className="bg-white/10 border border-white/20 rounded-xl p-3 text-xs text-white placeholder-[#f3ece0]/60 focus:outline-none focus:border-[#d4af37]"
            />
            <select
              className="bg-white/10 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
            >
              <option value="" className="text-[#3d2516]">{t.selectProduct}</option>
              {industrialProds.map(p => (
                <option key={p.id} value={p.name} className="text-[#3d2516]">{p.name} ({p.package_size})</option>
              ))}
            </select>
            <textarea
              placeholder={t.specifyRequirements}
              className="sm:col-span-2 bg-white/10 border border-white/20 rounded-xl p-3 text-xs text-white placeholder-[#f3ece0]/60 focus:outline-none focus:border-[#d4af37] h-24 resize-none"
            />
            <button
              type="submit"
              className="sm:col-span-2 bg-[#d4af37] hover:bg-amber-400 text-[#3d2516] font-bold py-3.5 rounded-full text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-colors"
            >
              <Send className="w-4 h-4" />
              {t.sendQuoteBtn}
            </button>
          </form>
        )}
      </section>
    </div>
  );
};
