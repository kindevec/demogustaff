import React, { useState } from 'react';
import { translateProduct } from '../../lib/translateProduct';
import { Product, Language, SiteContent } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { AnimatedSection } from '../../components/AnimatedSection';
import { 
  Package, 
  Search, 
  Filter, 
  Lock, 
  ArrowRight,
  Award,
  Factory,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Edit3,
  Plus,
  MessageCircle
} from 'lucide-react';

interface MobileIndustrialViewProps {
  products: Product[];
  lang: Language;
  siteContent?: SiteContent;
  onSelectProduct: (p: Product) => void;
  onOpenAuth?: () => void;
  onThemeColorChange?: (color: string) => void;
  isAdmin?: boolean;
  onEditProduct?: (p: Product) => void;
  onAddProduct?: () => void;
}

// Helper for safe search normalization
const normalizeString = (str?: string | null): string => {
  if (!str) return '';
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const MobileIndustrialView: React.FC<MobileIndustrialViewProps> = React.memo(({
  products,
  lang,
  siteContent,
  onSelectProduct,
  onOpenAuth,
  onThemeColorChange,
  isAdmin = false,
  onEditProduct,
  onAddProduct
}) => {
  const t = TRANSLATIONS[lang].industrialPage;
  
  const industrialProds = React.useMemo(() => {
    return products.map(p => translateProduct(p, lang)).filter(p => p.category === 'industrial' || p.category === 'coberturas' || p.category === 'galletas' || p.category === 'cocoa');
  }, [products, lang]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPackaging, setSelectedPackaging] = useState<string>('all');
  const [activeRibbonFeature, setActiveRibbonFeature] = useState<number | null>(null);

  const ribbonItems = React.useMemo(() => [
    {
      id: 1,
      icon: Award,
      title: t.ribbonCard1Title,
      desc: t.ribbonCard1Desc
    },
    {
      id: 2,
      icon: Factory,
      title: t.ribbonCard2Title,
      desc: t.ribbonCard2Desc
    },
    {
      id: 3,
      icon: Package,
      title: t.ribbonCard3Title,
      desc: t.ribbonCard3Desc
    },
    {
      id: 4,
      icon: ShieldCheck,
      title: t.ribbonCard4Title,
      desc: t.ribbonCard4Desc
    }
  ], [t]);

  // Sync header theme color to parent (Navbar)
  React.useEffect(() => {
    onThemeColorChange?.('#1A251B');
    return () => {
      onThemeColorChange?.('');
    };
  }, [onThemeColorChange]);

  const packagingFilters = [
    { id: 'all', label: t.pkgFilterAll },
    { id: 'Sacos', label: t.pkgSacos },
    { id: 'Cajas', label: t.pkgCajas },
    { id: 'Pomas', label: t.pkgPomas }
  ];

  // Filtering products
  const filteredProducts = React.useMemo(() => {
    return (industrialProds || []).filter(p => {
      if (!p) return false;

      const query = normalizeString(searchTerm);
      const pName = normalizeString(p.name);
      const pCode = normalizeString(p.code);
      const pPkg = normalizeString(p.package_size);
      const pDesc = normalizeString(p.description);

      const matchesSearch = query === '' ||
                            pName.includes(query) ||
                            pCode.includes(query) ||
                            pPkg.includes(query) ||
                            pDesc.includes(query);
      
      if (selectedPackaging === 'all') return matchesSearch;
      let pkgKeyword = normalizeString(selectedPackaging);
      if (lang === 'en') {
        if (pkgKeyword === 'sacos') pkgKeyword = 'bags';
        if (pkgKeyword === 'cajas') pkgKeyword = 'boxes';
        if (pkgKeyword === 'pomas') pkgKeyword = 'pails';
      }
      return matchesSearch && pPkg.includes(pkgKeyword);
    });
  }, [industrialProds, searchTerm, selectedPackaging, lang]);

  // Pagination State (5 rows of 2 columns = 10 items max per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedPackaging]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));

  const currentProducts = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const getProductImage = (p: Product) => {
    const img = p.image_url || p.image || '/images/placeholder.png';
    return encodeURI(img);
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'industrial': return 'Industrial';
      case 'coberturas': return 'Cobertura';
      case 'cocoa': return 'Cacao';
      case 'galletas': return 'Galletería';
      default: return cat;
    }
  };

  return (
    <div className="bg-[#fdfaf5] text-[#4a3224] font-sans selection:bg-[#b05d2e] selection:text-white space-y-6 pb-0 -mb-[8px]">
      
      {/* =========================================================================
          1. HERO HEADER SECTION — MOBILE EXCLUSIVE (Identical Design to MobileProductsView)
          - Uniform height (h-[260px] xs:h-[280px] sm:h-[300px])
          - Background image with left gradient overlay
          - Content text aligned strictly to the left (text-left items-start)
         ========================================================================= */}
      <div 
        className="relative overflow-hidden transition-colors duration-700 ease-in-out w-full h-[260px] xs:h-[280px] sm:h-[300px] group bg-[#1A251B]"
      >
        {/* Full Width Background Image */}
        <img
          src={siteContent?.industrial_banner?.image || '/images/bodegon/Maquila.webp'}
          alt="Maquila Industrial Gustaff S.A."
          className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700"
          style={{
            objectPosition: siteContent?.industrial_banner?.objectPosition || 'center center',
            transform: siteContent?.industrial_banner?.bgZoom && siteContent.industrial_banner.bgZoom > 100 ? (() => {
              const zoomScale = siteContent.industrial_banner.bgZoom / 100;
              const posParts = (siteContent.industrial_banner.objectPosition || '50% 50%').replace(/%/g, '').trim().split(/\s+/);
              const px = parseFloat(posParts[0]) || 50;
              const py = parseFloat(posParts[1]) || 50;
              return `scale(${zoomScale}) translate(${((50 - px) * (1 - 1 / zoomScale))}%, ${((50 - py) * (1 - 1 / zoomScale))}%)`;
            })() : undefined,
            transformOrigin: 'center center'
          }}
        />

        {/* Gradient Shade for High Text Contrast */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none transition-all duration-700" 
          style={{ 
            background: `linear-gradient(to right, #1A251Bfa 0%, #1A251Bd0 45%, #1A251B77 75%, transparent 100%)` 
          }} 
        />

        <div className="absolute inset-x-0 bottom-0 h-20 z-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

        {/* Left-Aligned Text Content Overlay */}
        <div className="relative z-20 h-full w-full px-5 sm:px-8 pt-[20px] flex flex-col justify-start text-left items-start space-y-3 max-w-lg">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase text-left border border-white/20 shadow-md bg-[#e86014] text-white">
            <Package className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="truncate">{siteContent?.industrial_banner?.badge || t.bannerBadge}</span>
          </div>

          {/* Title Line 1 + Accent */}
          <h1 className="font-serif font-black text-2xl xs:text-3xl sm:text-4xl text-white leading-tight uppercase text-left drop-shadow-md">
            {siteContent?.industrial_banner?.title || t.bannerTitle}
          </h1>

          {/* Description Paragraph (+20px width, occupies +20px bottom space) */}
          <p className="text-xs xs:text-sm text-white/90 leading-relaxed font-serif italic border-l-2 border-[#e86014] pl-3 text-left max-w-[185px] drop-shadow-sm line-clamp-4 mt-2">
            "{siteContent?.industrial_banner?.subtitle || t.subtitle}"
          </p>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 space-y-6">

        {/* =========================================================================
            2. FEATURE RIBBON - 4 INTERACTIVE ICONS ROW (Matching MobileHomeView)
           ========================================================================= */}
        <AnimatedSection animation="fade-up" delay={150}>
          <div className="relative z-30 h-13 flex items-center justify-center gap-[8px] pt-1">
            {ribbonItems.map((item, index) => {
              const IconComp = item.icon;
              const isActive = activeRibbonFeature === item.id;
              const isRightSide = index >= 2; // Icons 3 & 4 expand left

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveRibbonFeature(isActive ? null : item.id)}
                  className={`h-13 transition-all duration-300 ease-in-out cursor-pointer overflow-hidden flex items-center rounded-2xl border shadow-md ${
                    isActive 
                      ? `flex-1 bg-white/95 border-[#b05d2e] p-2 min-w-0 ${isRightSide ? 'flex-row-reverse text-right' : 'flex-row text-left'}` 
                      : 'w-13 shrink-0 justify-center bg-[#f3ece0] border-[#e8dcc4] p-0'
                  }`}
                  title={item.title}
                >
                  <div className={`shrink-0 w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300 ${
                    isActive ? 'bg-[#f3ece0] border border-[#e8dcc4]' : 'bg-transparent border-none'
                  }`}>
                    <IconComp className="w-5 h-5 text-[#b05d2e]" />
                  </div>

                  {isActive && (
                    <div className={`flex-1 min-w-0 ${isRightSide ? 'mr-1.5' : 'ml-1.5'}`}>
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#3d2516] truncate">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-[#6d4c41] leading-tight line-clamp-2 mt-0.5 font-sans">
                        {item.desc}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </AnimatedSection>

        {/* =========================================================================
            3. SEARCH & PACKAGING FILTER BAR
           ========================================================================= */}
        <AnimatedSection animation="fade-up" delay={200}>
          <div id="mobile-industrial-filters" className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-[#e8dcc4] rounded-2xl py-3 pl-11 pr-4 text-xs text-[#3d2516] placeholder-[#8c6d58] shadow-sm focus:outline-none focus:border-[#b05d2e] focus:ring-1 focus:ring-[#b05d2e] transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b05d2e]" />
            </div>

            {/* Packaging Filter Pills */}
            <div className="flex overflow-x-auto scrollbar-none gap-2 pb-1 -mx-4 px-4">
              {packagingFilters.map((pkg) => {
                const isActive = selectedPackaging === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackaging(pkg.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#b05d2e] text-white shadow-md'
                        : 'bg-white text-[#6d4c41] border border-[#e8dcc4] hover:bg-[#f3ece0]'
                    }`}
                  >
                    <span>{pkg.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Admin Add Button */}
            {isAdmin && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={onAddProduct}
                  className="inline-flex items-center gap-2 bg-[#e86014] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-[#b05d2e] transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Producto</span>
                </button>
              </div>
            )}
          </div>
        </AnimatedSection>

        {/* =========================================================================
            4. PRODUCTS GRID (2 Columns, Full Width Image, 5 Rows Max = 10 per Page)
           ========================================================================= */}
        <AnimatedSection animation="fade-up" delay={250}>
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-[#e8dcc4] text-center space-y-3 shadow-sm">
              <Package className="w-10 h-10 text-[#b05d2e] mx-auto opacity-50" />
              <h3 className="font-serif font-bold text-base text-[#3d2516]">No se encontraron resultados</h3>
              <p className="text-xs text-[#6d4c41] max-w-xs mx-auto">
                No hay productos que coincidan con la búsqueda o filtro seleccionado.
              </p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedPackaging('all'); }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#b05d2e] shadow-sm"
              >
                Ver catálogo completo
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {currentProducts.map((p) => (
                  <div
                    key={p.id || p.code}
                    onClick={() => onSelectProduct(p)}
                    className="group bg-white rounded-2xl border border-[#e8dcc4] shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all cursor-pointer relative"
                  >
                    {/* Product Image Box - Full Width */}
                    <div className="relative h-36 w-full bg-[#fcf8f2] overflow-hidden border-b border-[#e8dcc4]/50">
                      <img
                        src={getProductImage(p)}
                        alt={p.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      
                      {/* Category Badge */}
                      <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider bg-[#b05d2e] text-white px-2 py-0.5 rounded-full shadow-sm">
                        {getCategoryBadge(p.category)}
                      </span>

                      {/* Admin Edit Button */}
                      {isAdmin && onEditProduct && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditProduct(p);
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-white text-[#b05d2e] rounded-full shadow-md hover:bg-[#b05d2e] hover:text-white transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Product Info (Code line removed) */}
                    <div className="p-3 flex-1 flex flex-col justify-between space-y-2 text-left">
                      <div className="space-y-1">
                        <h4 className="font-serif font-bold text-xs text-[#3d2516] leading-snug line-clamp-2 group-hover:text-[#b05d2e] transition-colors">
                          {p.name}
                        </h4>
                        <p className="text-[10px] text-[#6d4c41] line-clamp-2 leading-relaxed">
                          {p.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#e8dcc4]/60 flex items-center justify-between gap-1 text-[10px]">
                        <span className="truncate text-[#6d4c41] font-semibold">{p.package_size}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const phone = '593969718045';
                            const message = `Hola Gustaff S.A., me gustaría solicitar una cotización sobre el producto: *${p.name}* (Código: ${p.code}, Presentación: ${p.package_size}).`;
                            const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
                            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                          }}
                          className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold text-white bg-[#b05d2e] hover:bg-[#603813] shadow-sm transition-all cursor-pointer shrink-0 active:scale-95 border border-[#e8dcc4]"
                          title="Cotizar producto"
                        >
                          <span>Cotizar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Bar (5 Rows Max = 10 Items per Page) */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-[#e8dcc4] shadow-sm text-xs font-bold mt-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage(prev => Math.max(1, prev - 1));
                      document.getElementById('mobile-industrial-filters')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#f3ece0] text-[#b05d2e] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#b05d2e] hover:text-white transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Anterior</span>
                  </button>

                  <span className="text-[#3d2516] font-serif">
                    Página <strong className="text-[#b05d2e]">{currentPage}</strong> de {totalPages}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage(prev => Math.min(totalPages, prev + 1));
                      document.getElementById('mobile-industrial-filters')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#f3ece0] text-[#b05d2e] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#b05d2e] hover:text-white transition-all cursor-pointer"
                  >
                    <span>Siguiente</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </AnimatedSection>

      </div>
    </div>
  );
});

MobileIndustrialView.displayName = 'MobileIndustrialView';
