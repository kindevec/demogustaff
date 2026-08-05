import React, { useState, useEffect, useCallback } from 'react';
import { Product, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { AnimatedSection } from '../components/AnimatedSection';
import {
  Search,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Package,
  Sparkles,
  Layers,
  Cookie,
  Beaker,
  Factory,
  Edit3,
  Plus
} from 'lucide-react';

interface ProductsViewProps {
  products: Product[];
  lang: Language;
  onSelectProduct: (p: Product) => void;
  onOpenAuth?: () => void;
  onThemeColorChange?: (color: string) => void;
  isAdmin?: boolean;
  onEditProduct?: (p: Product) => void;
  onAddProduct?: () => void;
}

// Category slide configuration with unique colors
const CATEGORY_SLIDES = [
  {
    id: 'coberturas',
    label: 'Coberturas de Chocolate',
    tagline: '✦ CHOCOLATERÍA PREMIUM',
    titleLine1: 'COBERTURAS',
    titleAccent: '& GOTAS DE CHOCOLATE',
    description: 'Botones, gotas termoestables y palillos de cobertura formulados para moldeo, bañado y horneado industrial con brillo y crocancia excepcionales.',
    image: '/images/Slider de publicidad/COBERTURAS DE CHOCOLATE.webp',
    bgColor: '#3A1B12',
    navColor: '#3A1B12',
    accentColor: '#e86014',
    gradientFrom: '#3A1B12',
    gradientVia: '#5B2C1E',
    filterCategories: ['coberturas', 'industrial'],
    icon: Layers
  },
  {
    id: 'cocoa',
    label: 'Cacao en Polvo',
    tagline: '✦ SOLUBILIDAD SUPERIOR',
    titleLine1: 'CACAO EN POLVO',
    titleAccent: 'ALCALINO & EDULCORADO',
    description: 'Extracción pura de cacao ecuatoriano con máximo perfil aromático, ideal para bebidas, repostería y heladería industrial.',
    image: '/images/Slider de publicidad/CACAO EN POLVO.webp',
    bgColor: '#2E1208',
    navColor: '#2E1208',
    accentColor: '#d4763a',
    gradientFrom: '#2E1208',
    gradientVia: '#4A2010',
    filterCategories: ['cocoa', 'industrial'],
    icon: Beaker
  },
  {
    id: 'galletas',
    label: 'Galletas & Conos',
    tagline: '✦ HELADERÍA & REPOSTERÍA',
    titleLine1: 'GALLETAS & CONOS',
    titleAccent: 'PARA HELADO INDUSTRIAL',
    description: 'Crujientes, sabrosas y diseñadas con máxima resistencia a la humedad en presentaciones para alta producción.',
    image: '/images/Slider de publicidad/GALLETAS Y CONOS.webp',
    bgColor: '#4D3318',
    navColor: '#4D3318',
    accentColor: '#d4a84b',
    gradientFrom: '#4D3318',
    gradientVia: '#7A5230',
    filterCategories: ['galletas', 'industrial'],
    icon: Cookie
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
    navColor: '#1A251B',
    accentColor: '#6db86e',
    gradientFrom: '#1A251B',
    gradientVia: '#2D3A2E',
    filterCategories: ['industrial'],
    icon: Factory
  }
];

// Helper for safe, accent-insensitive search normalization
const normalizeString = (str?: string | null): string => {
  if (!str) return '';
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const ProductsView: React.FC<ProductsViewProps> = React.memo(({
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
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % CATEGORY_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + CATEGORY_SLIDES.length) % CATEGORY_SLIDES.length);
  }, []);

  // Handle category click from slider — set filter
  const handleCategoryFromSlider = () => {
    setSelectedFilter(slide.id);
  };

  // Filter products
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
      return p.category === selectedFilter;
    });
  }, [products, searchTerm, selectedFilter]);

  const filterTabs = [
    { id: 'all', label: 'Todos', icon: Package },
    { id: 'coberturas', label: 'Coberturas', icon: Layers },
    { id: 'cocoa', label: 'Cacao', icon: Beaker },
    { id: 'galletas', label: 'Galletas', icon: Cookie },
    { id: 'industrial', label: 'Industrial', icon: Factory }
  ];

  // Category label helper
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'industrial': return 'Industrial';
      case 'coberturas': return 'Coberturas';
      case 'cocoa': return 'Cacao';
      case 'galletas': return 'Galletería';
      default: return cat;
    }
  };

  return (
    <div className="text-white font-sans selection:bg-[#b05d2e] selection:text-white">

      {/* =====================================================================
          1. HERO SLIDER — Edge-to-Edge, No Container
         ===================================================================== */}
      <div
        className="relative overflow-hidden transition-colors duration-700 ease-in-out h-[580px] sm:h-[680px] lg:h-[784px]"
        style={{ backgroundColor: slide.bgColor }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slides — Full-width, edge-to-edge */}
        <div className="relative h-full">
          {CATEGORY_SLIDES.map((s, idx) => (
            <div
              key={s.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                idx === currentSlide
                  ? 'opacity-100 z-10 scale-100'
                  : 'opacity-0 z-0 scale-105'
              }`}
            >
              {/* Background Image — Full Edge-to-Edge with smooth zoom */}
              <img
                src={s.image}
                alt={s.titleLine1}
                className={`absolute inset-0 w-full h-full object-cover object-center ${idx === currentSlide ? 'animate-hero-zoom' : ''}`}
              />

              {/* Left Gradient Overlay */}
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  background: `linear-gradient(to right, ${s.gradientFrom}ee 0%, ${s.gradientFrom}cc 30%, ${s.gradientFrom}88 50%, transparent 75%)`
                }}
              />

              {/* Bottom Shade for Mobile */}
              <div className="absolute inset-x-0 bottom-0 h-56 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent sm:hidden pointer-events-none" />

              {/* Text Content */}
              <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col justify-center text-left space-y-4 sm:space-y-5">

                {/* Tagline Badge */}
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-extrabold tracking-wider uppercase w-fit border border-white/20 shadow-lg"
                  style={{ backgroundColor: s.accentColor }}
                >
                  {s.tagline}
                </div>

                {/* Title */}
                <h1 className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight max-w-2xl drop-shadow-lg">
                  {s.titleLine1}
                  <span className="block text-2xl sm:text-3xl lg:text-4xl font-bold mt-1" style={{ color: s.accentColor }}>
                    {s.titleAccent}
                  </span>
                </h1>

                {/* Description */}
                <p className="text-sm sm:text-base text-white/80 max-w-md leading-relaxed drop-shadow-sm">
                  {s.description}
                </p>

                {/* CTA Button */}
                <button
                  onClick={handleCategoryFromSlider}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 w-fit cursor-pointer group/btn"
                  style={{ backgroundColor: s.accentColor }}
                >
                  <span>Ver productos de esta línea</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 transition-all shadow-lg cursor-pointer hover:scale-110"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 transition-all shadow-lg cursor-pointer hover:scale-110"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-6 left-6 sm:left-10 lg:left-16 z-30 flex items-center gap-2.5">
            {CATEGORY_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentSlide
                    ? 'w-10 h-3'
                    : 'w-3 h-3 bg-white/40 hover:bg-white/60'
                }`}
                style={idx === currentSlide ? { backgroundColor: s.accentColor } : {}}
                aria-label={s.label}
              />
            ))}
          </div>
        </div>
      </div>


      {/* =====================================================================
          2. PRODUCT CATALOG GRID — Cream Background Zone
         ===================================================================== */}
      <div className="bg-[#fdfaf5] text-[#4a3224] pb-20">

        {/* Search & Filter Bar */}
        <AnimatedSection animation="fade-up" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e8dcc4] shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#8d6e63] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar producto o código..."
                className="w-full bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#3d2516] placeholder-[#8d6e63] focus:outline-none focus:border-[#b05d2e] focus:ring-2 focus:ring-[#b05d2e]/20 transition-all"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {filterTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedFilter(tab.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                      selectedFilter === tab.id
                        ? 'bg-[#603813] text-white shadow-md'
                        : 'bg-[#f3ece0] text-[#4a3224] hover:bg-[#e8dcc4]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </AnimatedSection>

        {/* Results Count */}
        <AnimatedSection animation="fade-in" delay={100} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-[#8d6e63] font-medium">
              <span className="text-[#3d2516] font-bold">{filteredProducts.length}</span> producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
              {selectedFilter !== 'all' && (
                <span className="ml-2 text-[#b05d2e] font-semibold">
                  en "{filterTabs.find(t => t.id === selectedFilter)?.label}"
                </span>
              )}
            </p>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <button
                  onClick={onAddProduct}
                  className="bg-[#b05d2e] hover:bg-[#8d461f] text-white px-4 py-2 rounded-full text-xs font-bold shadow-md border border-white/20 flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Nuevo Producto</span>
                </button>
              )}
              {selectedFilter !== 'all' && (
                <button
                  onClick={() => setSelectedFilter('all')}
                  className="text-xs text-[#b05d2e] font-bold hover:underline cursor-pointer"
                >
                  Ver todos
                </button>
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* Product Cards Grid — TravelCard Style */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((p, idx) => (
              <AnimatedSection
                key={p.id}
                animation="scale-up"
                delay={(idx % 8) * 90}
              >
                {/* === TravelCard Style Product Card === */}
                <div
                  onClick={() => onSelectProduct(p)}
                  className="group relative w-full aspect-square overflow-hidden rounded-xl border border-[#e8dcc4] bg-[#120703] shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
                >
                  {/* Background Image with Zoom Effect on Hover */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                  />

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

                  {/* Content Container */}
                  <div className="relative flex h-full flex-col justify-between p-4 sm:p-5">

                    {/* Top Section: Badges & Admin Edit */}
                    <div className="flex items-start justify-between w-full z-20">
                      {isAdmin ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditProduct?.(p);
                          }}
                          className="bg-[#e86014] hover:bg-[#d9530f] text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-lg border border-white/40 flex items-center gap-1 transition-transform hover:scale-105 cursor-pointer"
                          title="Editar este producto"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Editar</span>
                        </button>
                      ) : <div />}

                      {/* Featured Badge */}
                      {p.is_featured && (
                        <div className="flex items-center gap-1 bg-[#e86014] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md border border-white/20">
                          <Sparkles className="w-2.5 h-2.5" />
                          Destacado
                        </div>
                      )}
                    </div>

                    {/* Middle/Bottom Section: Details (slides up on hover) */}
                    <div className="space-y-1.5 sm:space-y-2 transition-transform duration-500 ease-in-out group-hover:-translate-y-20 sm:group-hover:-translate-y-24">
                      {/* Category Tag */}
                      <span className="inline-block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/70 bg-white/10 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-sm">
                        <span>{getCategoryLabel(p.category)}</span>
                      </span>

                      {/* Product Name */}
                      <h3 className="text-lg sm:text-xl font-bold text-white leading-snug line-clamp-2">
                        <span>{p.name}</span>
                      </h3>

                      {/* Package Size */}
                      <p className="text-xs text-white/70 flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        <span>{p.package_size}</span>
                      </p>
                    </div>

                    {/* Bottom Section: Description & Action Button (revealed on hover) */}
                    <div className="absolute -bottom-28 left-0 w-full p-4 sm:p-5 opacity-0 transition-all duration-500 ease-in-out group-hover:bottom-0 group-hover:opacity-100 space-y-2.5 bg-gradient-to-t from-black via-black/90 to-transparent pt-6">
                      <p className="text-xs text-white/70 leading-normal line-clamp-2">
                        <span>{p.description}</span>
                      </p>
                      <div className="flex items-center justify-between pt-1 border-t border-white/15">
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Ficha Técnica</span>
                        <span className="inline-flex items-center gap-1.5 bg-white text-[#3d2516] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xl hover:bg-[#f3ece0] transition-colors">
                          Ver Detalles <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <AnimatedSection animation="scale-up" className="text-center py-20">
              <div className="inline-flex flex-col items-center gap-4">
                <div className="p-6 rounded-full bg-[#f3ece0] border border-[#e8dcc4]">
                  <Search className="w-10 h-10 text-[#8d6e63]" />
                </div>
                <h3 className="font-serif font-bold text-xl text-[#3d2516]">
                  No se encontraron productos
                </h3>
                <p className="text-sm text-[#6d4c41] max-w-sm">
                  Intenta con otro término de búsqueda o selecciona una categoría diferente.
                </p>
                <button
                  onClick={() => { setSearchTerm(''); setSelectedFilter('all'); }}
                  className="mt-2 px-6 py-2.5 bg-[#603813] text-white rounded-full text-sm font-bold hover:bg-[#b05d2e] transition-colors cursor-pointer"
                >
                  Ver todos los productos
                </button>
              </div>
            </AnimatedSection>
          )}
        </div>
      </div>
    </div>
  );
});
