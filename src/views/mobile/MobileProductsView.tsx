import React, { useState, useEffect, useCallback } from 'react';
import { Product, Language } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { AnimatedSection } from '../../components/AnimatedSection';
import {
  Search,
  ArrowRight,
  Package,
  Sparkles,
  Layers,
  Cookie,
  Beaker,
  Factory,
  Edit3,
  Plus,
  Eye,
  Check,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface MobileProductsViewProps {
  products: Product[];
  lang: Language;
  onSelectProduct: (p: Product) => void;
  onOpenAuth?: () => void;
  onThemeColorChange?: (color: string) => void;
  isAdmin?: boolean;
  onEditProduct?: (p: Product) => void;
  onAddProduct?: () => void;
}

// Category slide configuration matching desktop structure
const CATEGORY_SLIDES = [
  {
    id: 'coberturas',
    label: 'Coberturas de Chocolate',
    tagline: '✦ CHOCOLATERÍA PREMIUM',
    titleLine1: 'COBERTURAS',
    titleAccent: '& GOTAS DE CHOCOLATE',
    description: 'Botones, gotas termoestables y palillos de cobertura formulados para moldeo, bañado y horneado industrial.',
    image: '/images/Slider de publicidad/COBERTURAS DE CHOCOLATE.webp',
    bgColor: '#3A1B12',
    navColor: '#3A1B12'
  },
  {
    id: 'cocoa',
    label: 'Cacao en Polvo',
    tagline: '✦ SOLUBILIDAD SUPERIOR',
    titleLine1: 'CACAO EN POLVO',
    titleAccent: 'ALCALINO & EDULCORADO',
    description: 'Extracción pura de cacao ecuatoriano con máximo perfil aromático, ideal para bebidas y heladería.',
    image: '/images/Slider de publicidad/CACAO EN POLVO.webp',
    bgColor: '#2E1208',
    navColor: '#2E1208'
  },
  {
    id: 'galletas',
    label: 'Galletas & Conos',
    tagline: '✦ HELADERÍA & REPOSTERÍA',
    titleLine1: 'GALLETAS & CONOS',
    titleAccent: 'PARA HELADO INDUSTRIAL',
    description: 'Crujientes, sabrosas y diseñadas con máxima resistencia a la humedad en presentaciones industriales.',
    image: '/images/Slider de publicidad/GALLETAS Y CONOS.webp',
    bgColor: '#4D3318',
    navColor: '#4D3318'
  },
  {
    id: 'industrial',
    label: 'Maquila Industrial',
    tagline: '✦ SOLUCIONES A LA MEDIDA',
    titleLine1: 'MAQUILA INDUSTRIAL',
    titleAccent: '& SIROPE DE CACAO',
    description: 'Desarrollamos recetas exclusivas y empaques adaptados a tu proceso productivo con las mejores materias primas.',
    image: '/images/Slider de publicidad/MAQUILA INDUSTRIAL.webp',
    bgColor: '#1A251B',
    navColor: '#1A251B'
  }
];

// Safe, accent-insensitive search normalization
const normalizeString = (str?: string | null): string => {
  if (!str) return '';
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const MobileProductsView: React.FC<MobileProductsViewProps> = React.memo(({
  products,
  lang,
  onSelectProduct,
  onOpenAuth,
  onThemeColorChange,
  isAdmin = false,
  onEditProduct,
  onAddProduct
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const slide = CATEGORY_SLIDES[currentSlide];

  // Sync theme color to parent (Navbar)
  useEffect(() => {
    onThemeColorChange?.(slide.navColor);
    return () => {
      onThemeColorChange?.('');
    };
  }, [currentSlide, onThemeColorChange, slide.navColor]);

  // Auto advance slides
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CATEGORY_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Swipe Gesture Handling (Touch & Mouse Drag)
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % CATEGORY_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + CATEGORY_SLIDES.length) % CATEGORY_SLIDES.length);
  }, []);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsPaused(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setTouchStartX(clientX);
    setTouchEndX(clientX);
    if (!('touches' in e)) setIsMouseDown(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if ('touches' in e || isMouseDown) {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      setTouchEndX(clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    setIsMouseDown(false);
    if (touchStartX !== null && touchEndX !== null) {
      const distance = touchStartX - touchEndX;
      const minSwipeDistance = 35; // minimum px to trigger swipe
      if (distance > minSwipeDistance) {
        nextSlide(); // Swipe Left -> Next
      } else if (distance < -minSwipeDistance) {
        prevSlide(); // Swipe Right -> Prev
      }
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Handle category click from slider
  const handleCategoryFromSlider = (catId: string) => {
    setSelectedFilter(catId);
    // Smooth scroll down to filter tabs
    const filterElement = document.getElementById('mobile-product-filters');
    if (filterElement) {
      filterElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter products logic
  const filteredProducts = React.useMemo(() => {
    return (products || []).filter(p => {
      if (!p) return false;

      const query = normalizeString(searchTerm);
      const pName = normalizeString(p.name);
      const pCode = normalizeString(p.code);
      const pDesc = normalizeString(p.description);
      const pPkg = normalizeString(p.package_size);
      const pCat = normalizeString(p.category);

      const matchesSearch = query === '' ||
        pName.includes(query) ||
        pCode.includes(query) ||
        pDesc.includes(query) ||
        pPkg.includes(query) ||
        pCat.includes(query);

      if (!matchesSearch) return false;

      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'coberturas') {
        return p.category === 'coberturas' ||
          (p.category === 'industrial' && (
            pName.includes('cobertura') ||
            pName.includes('gota') ||
            pName.includes('boton') ||
            pName.includes('palillo') ||
            pName.includes('mini milk')
          ));
      }
      if (selectedFilter === 'cocoa') {
        return p.category === 'cocoa' ||
          (p.category === 'industrial' && (
            pName.includes('cocoa') ||
            pName.includes('cacao') ||
            pName.includes('azucar') ||
            pName.includes('sirope')
          ));
      }
      if (selectedFilter === 'galletas') {
        return p.category === 'galletas' ||
          (p.category === 'industrial' && (
            pName.includes('galleta') ||
            pName.includes('kibledd')
          ));
      }
    });
  }, [products, searchTerm, selectedFilter]);

  // Pagination State (5 rows of 2 columns = 10 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset to page 1 on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));

  const currentProducts = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const getProductImage = (p: Product) => {
    const img = p.image_url || p.image || '/images/placeholder.png';
    return encodeURI(img);
  };

  const filterTabs = [
    { id: 'all', label: 'Todos', icon: Package },
    { id: 'coberturas', label: 'Coberturas', icon: Layers },
    { id: 'cocoa', label: 'Cacao', icon: Beaker },
    { id: 'galletas', label: 'Galletas', icon: Cookie },
    { id: 'industrial', label: 'Industrial', icon: Factory }
  ];

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
          1. HERO HEADER SECTION — MOBILE EXCLUSIVE (Identical Design & Swipeable)
          - Uniform height (h-[260px] xs:h-[280px] sm:h-[300px])
          - Background image with left gradient overlay
          - Touch/Mouse Swipe Left & Right to switch slides
         ========================================================================= */}
      <div 
        className="relative overflow-hidden transition-colors duration-700 ease-in-out w-full h-[260px] xs:h-[280px] sm:h-[300px] group bg-[#3A1B12] select-none cursor-grab active:cursor-grabbing"
        style={{ backgroundColor: slide.bgColor }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        {/* Render All Category Slides for Smooth Fade Transitions */}
        {CATEGORY_SLIDES.map((s, idx) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Full Width Background Image */}
            <img
              src={encodeURI(s.image)}
              alt={s.titleLine1}
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading={idx === 0 ? "eager" : "lazy"}
            />

            {/* Gradient Shade for High Text Contrast */}
            <div 
              className="absolute inset-0 z-10 pointer-events-none" 
              style={{ 
                background: `linear-gradient(to right, ${s.bgColor}fa 0%, ${s.bgColor}d0 45%, ${s.bgColor}77 75%, transparent 100%)` 
              }} 
            />

            <div className="absolute inset-x-0 bottom-0 h-20 z-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

            {/* Left-Aligned Text Content Overlay */}
            <div className="relative z-20 h-full w-full px-5 sm:px-8 pt-[20px] flex flex-col justify-start text-left items-start space-y-3 max-w-lg">
              
              {/* Tagline Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase text-left border border-white/20 shadow-md bg-[#e86014] text-white">
                <Sparkles className="w-3.5 h-3.5 text-white shrink-0" />
                <span className="truncate">{s.tagline}</span>
              </div>

              {/* Title Line 1 + Accent */}
              <h1 className="font-serif font-black text-2xl xs:text-3xl sm:text-4xl text-white leading-tight uppercase text-left drop-shadow-md">
                {s.titleLine1} <span className="block text-xs xs:text-sm sm:text-base font-sans font-bold text-[#e86014] mt-0.5">{s.titleAccent}</span>
              </h1>

              {/* Description Paragraph */}
              <p className="text-xs xs:text-sm text-white/90 leading-relaxed font-serif italic border-l-2 border-[#e86014] pl-3 text-left max-w-xs drop-shadow-sm line-clamp-2">
                "{s.description}"
              </p>

              {/* Action Button */}
              <div className="pt-0 -mt-[5px] text-left flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategoryFromSlider(s.id);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-bold text-white bg-[#e86014] shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-95"
                >
                  <span>Explorar Categoría</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        ))}

        {/* Slider Indicator Dots (Bottom Right) */}
        <div className="absolute bottom-3 right-4 z-30 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
          {CATEGORY_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(idx);
              }}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentSlide ? 'w-5 bg-[#e86014]' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="px-4 space-y-6">

        {/* =========================================================================
            2. SEARCH & FILTER TABS BAR
           ========================================================================= */}
        <AnimatedSection animation="fade-up" delay={150}>
          <div id="mobile-product-filters" className="space-y-4 pt-1">
            
            {/* Search Input Box */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre, código o presentación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-[#e8dcc4] rounded-2xl py-3 pl-11 pr-4 text-xs text-[#3d2516] placeholder-[#8c6d58] shadow-sm focus:outline-none focus:border-[#b05d2e] focus:ring-1 focus:ring-[#b05d2e] transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b05d2e]" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#b05d2e] bg-[#f3ece0] px-2 py-0.5 rounded-full"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Category Filter Pills (Horizontal Scroll) */}
            <div className="flex overflow-x-auto scrollbar-none gap-2 pb-1 -mx-4 px-4">
              {filterTabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = selectedFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedFilter(tab.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#b05d2e] text-white shadow-md'
                        : 'bg-white text-[#6d4c41] border border-[#e8dcc4] hover:bg-[#f3ece0]'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#b05d2e]'}`} />
                    <span>{tab.label}</span>
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
            3. PRODUCTS GRID (2 Columns Side-by-Side Cards)
           ========================================================================= */}
        <AnimatedSection animation="fade-up" delay={200}>
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-[#e8dcc4] text-center space-y-3 shadow-sm">
              <Package className="w-10 h-10 text-[#b05d2e] mx-auto opacity-50" />
              <h3 className="font-serif font-bold text-base text-[#3d2516]">No se encontraron productos</h3>
              <p className="text-xs text-[#6d4c41] max-w-xs mx-auto">
                No hay resultados que coincidan con tu búsqueda. Intenta con otros términos o cambia de categoría.
              </p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedFilter('all'); }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#b05d2e] shadow-sm"
              >
                Ver todos los productos
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

                    {/* Product Info */}
                    <div className="p-3 flex-1 flex flex-col justify-between space-y-2 text-left">
                      <div className="space-y-1">
                        <h4 className="font-serif font-bold text-xs text-[#3d2516] leading-snug line-clamp-2 group-hover:text-[#b05d2e] transition-colors">
                          {p.name}
                        </h4>
                        <p className="text-[10px] text-[#6d4c41] line-clamp-2 leading-relaxed">
                          {p.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#e8dcc4]/60 flex items-center justify-between text-[10px] text-[#b05d2e] font-bold">
                        <span className="truncate pr-1">{p.package_size}</span>
                        <ChevronRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls (5 Rows Max = 10 Products per Page) */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-[#e8dcc4] shadow-sm text-xs font-bold mt-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage(prev => Math.max(1, prev - 1));
                      document.getElementById('mobile-product-filters')?.scrollIntoView({ behavior: 'smooth' });
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
                      document.getElementById('mobile-product-filters')?.scrollIntoView({ behavior: 'smooth' });
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

MobileProductsView.displayName = 'MobileProductsView';
