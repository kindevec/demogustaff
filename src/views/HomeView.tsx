import React from 'react';
import { Language, Product, SiteContent } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  Sparkles, 
  Factory, 
  Package, 
  Award, 
  ChevronRight, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Download,
  PhoneCall,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

interface HomeViewProps {
  setCurrentTab: (tab: string) => void;
  lang: Language;
  products: Product[];
  siteContent: SiteContent;
  onOpenAuth: () => void;
  onSelectProduct: (p: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setCurrentTab,
  lang,
  products,
  siteContent,
  onOpenAuth,
  onSelectProduct
}) => {
  const t = TRANSLATIONS[lang];
  const featuredProducts = products.filter(p => p.is_featured).slice(0, 4);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#fdfaf5] via-[#fdf5e6] to-[#fdfaf5] text-[#3d2516] pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#e8dcc4] overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#b05d2e]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#603813]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-[#f3ece0] text-[#603813] px-4 py-1.5 rounded-full border border-[#e8dcc4] text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-[#b05d2e]" />
              <span>{t.hero.badge}</span>
            </div>

            <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#3d2516] leading-tight">
              {t.hero.title}
            </h1>

            {/* Exact Main Message Copywriting */}
            <p className="text-base sm:text-lg text-[#603813] font-serif italic border-l-4 border-[#b05d2e] pl-4 py-1.5 leading-relaxed bg-[#f3ece0]/60 rounded-r-xl">
              "{siteContent.home_headline}"
            </p>

            <p className="text-sm text-[#4a3224] leading-relaxed max-w-2xl">
              Especialistas en la producción de polvos de cacao, coberturas de chocolate termoestables, gotas, botones, galletas para helado y sirope industrial.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setCurrentTab('industrial')}
                className="bg-[#b05d2e] hover:bg-[#994d23] text-white font-bold px-7 py-3.5 rounded-full text-sm shadow-lg shadow-[#b05d2e33] flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <span>{t.hero.btnCatalog}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentTab('downloads')}
                className="bg-[#f3ece0] hover:bg-[#e8dcc4] text-[#603813] border border-[#e8dcc4] font-semibold px-6 py-3.5 rounded-full text-sm flex items-center gap-2 transition-all"
              >
                <Lock className="w-4 h-4 text-[#b05d2e]" />
                <span>{t.hero.btnDownloads}</span>
              </button>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-[#e8dcc4] text-[#6d4c41] text-xs">
              <div className="flex items-center gap-2">
                <Factory className="w-5 h-5 text-[#b05d2e] shrink-0" />
                <span>Planta Vía a Daule Guayaquil</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#b05d2e] shrink-0" />
                <span>Normas HACCP & BPM</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#b05d2e] shrink-0" />
                <span>Maquila & B2B</span>
              </div>
            </div>
          </div>

          {/* Right Hero Feature Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#e8dcc4] shadow-xl bg-white">
              <img
                src="https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=1000&q=80"
                alt="Chocolates Gustaff"
                className="w-full h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3d2516] via-[#3d2516]/40 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2 text-left text-white">
                <div className="bg-[#d4af37] text-[#3d2516] font-bold text-[11px] px-3 py-1 rounded-full w-fit uppercase font-mono">
                  Línea Industrial 2026
                </div>
                <h3 className="font-serif font-bold text-xl text-white">
                  Calidad Suave & Cobertura Térmica
                </h3>
                <p className="text-xs text-[#f3ece0]">
                  Ingredientes desarrollados para superar pruebas exigentes de horneado y congelación.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

        {/* 1. SECTION: QUIÉNES SOMOS (RESUMEN) */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e8dcc4] shadow-md relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold text-[#b05d2e] uppercase tracking-widest bg-[#f3ece0] px-3 py-1 rounded-full border border-[#e8dcc4]">
                {t.sections.aboutSummaryTitle}
              </span>

              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#3d2516]">
                La Fábrica - Historia Gustaff | desde 1998
              </h2>

              {/* Exact Copywriting for Quiénes Somos */}
              <p className="text-base text-[#603813] font-serif italic bg-[#fdf5e6] p-4 rounded-2xl border-l-4 border-[#b05d2e]">
                "{siteContent.home_quienes_somos}"
              </p>

              <p className="text-xs sm:text-sm text-[#4a3224] leading-relaxed">
                GUSTAFF S.A. inició sus operaciones industriales en Guayaquil, generando empleos y aplicando estrategias técnicas de vanguardia para brindar chocolates y coberturas de excelencia para cada necesidad del mercado.
              </p>

              <div>
                <button
                  onClick={() => setCurrentTab('about')}
                  className="bg-[#603813] hover:bg-[#3d2516] text-white font-bold px-6 py-2.5 rounded-full text-xs flex items-center gap-2 transition-colors shadow-sm"
                >
                  <span>Conocer Nuestra Historia Completa</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <img
                src="https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80"
                alt="Nuestra Fábrica"
                className="rounded-2xl object-cover h-64 w-full shadow-md border border-[#e8dcc4]"
              />
            </div>
          </div>
        </section>

        {/* 2. SECTION: PRODUCTOS (RESUMEN) */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#e8dcc4] pb-4">
            <div>
              <span className="text-xs font-bold text-[#b05d2e] uppercase tracking-widest bg-[#f3ece0] px-3 py-1 rounded-full border border-[#e8dcc4]">
                {t.sections.productsSummaryTitle}
              </span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#3d2516] mt-2">
                Portafolio Variado para Consumo
              </h2>
              {/* Exact Copywriting for Productos Summary */}
              <p className="text-sm text-[#6d4c41] mt-1">
                "{siteContent.home_productos_summary}"
              </p>
            </div>

            <button
              onClick={() => setCurrentTab('products')}
              className="text-xs font-bold text-[#b05d2e] hover:text-[#994d23] flex items-center gap-1"
            >
              Ver Todos los Productos de Consumo <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onSelectProduct(prod)}
                className="bg-white rounded-2xl border border-[#e8dcc4] hover:border-[#b05d2e] transition-all cursor-pointer overflow-hidden group shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div className="relative h-48 bg-[#fdf5e6] overflow-hidden">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 text-[#3d2516] font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-[#e8dcc4]">
                    {prod.code}
                  </div>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#3d2516] group-hover:text-[#b05d2e] transition-colors">
                      {prod.name}
                    </h3>
                    <p className="text-[11px] text-[#b05d2e] font-semibold mt-0.5">
                      {prod.package_size}
                    </p>
                    <p className="text-xs text-[#6d4c41] line-clamp-2 mt-1">
                      {prod.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#e8dcc4] flex items-center justify-between text-xs text-[#b05d2e] font-bold">
                    <span>Ver Detalles y Ficha</span>
                    <ChevronRight className="w-4 h-4 text-[#b05d2e]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. SECTION: INDUSTRIAL (RESUMEN) */}
        <section className="bg-[#603813] text-white rounded-3xl p-8 sm:p-12 border border-[#d4af37]/40 shadow-xl relative">
          <div className="max-w-3xl space-y-4 text-left">
            <span className="text-xs font-bold text-[#d4af37] uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {t.sections.industrialSummaryTitle}
            </span>

            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-white">
              Maquilamos tus emprendimientos
            </h2>

            {/* Exact Copywriting for Industrial Summary */}
            <p className="text-base text-[#fdfaf5] font-serif italic bg-white/10 p-4 rounded-2xl border-l-4 border-[#d4af37]">
              "{siteContent.home_industrial_summary}"
            </p>

            <p className="text-xs sm:text-sm text-[#f3ece0] leading-relaxed">
              Suministramos sacos de 25 kg de Cocoa Edulcorada y Alcalina, cajas de 5 kg y 10 kg de gotas, botones y palillos, pomas de 6 kg de sirope y cajas de 10 kg/14 kg de galletas industriales.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => setCurrentTab('industrial')}
                className="bg-[#d4af37] hover:bg-amber-400 text-[#3d2516] font-bold px-6 py-3 rounded-full text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-colors"
              >
                <Package className="w-4 h-4" />
                Explorar los 12 Productos Industriales
              </button>

              <button
                onClick={onOpenAuth}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold px-5 py-3 rounded-full text-xs flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-[#d4af37]" />
                Descargar Fichas Técnicas PDF
              </button>
            </div>
          </div>
        </section>

        {/* 4. QUALITY POLICY BANNER */}
        <section className="bg-white border border-[#e8dcc4] rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#f3ece0] text-[#b05d2e] rounded-2xl border border-[#e8dcc4] shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#3d2516]">
                Compromiso de Inocuidad & Seguridad Alimentaria
              </h3>
              <p className="text-xs text-[#6d4c41] leading-relaxed mt-1 max-w-2xl">
                Procesamos alimentos en estricto cumplimiento de estándares ecuatorianos e internacionales (HACCP y BPM), garantizando inocuidad, autenticidad y trazabilidad.
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('about')}
            className="shrink-0 bg-[#603813] hover:bg-[#3d2516] text-white border border-[#603813] px-5 py-2.5 rounded-full text-xs font-bold transition-colors shadow-sm"
          >
            Leer Política de Calidad
          </button>
        </section>

      </div>
    </div>
  );
};
