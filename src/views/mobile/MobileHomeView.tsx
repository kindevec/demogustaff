import React, { useState, useEffect } from 'react';
import { translateProduct } from '../../lib/translateProduct';
import { Language, Product, SiteContent, SlideConfig } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { AnimatedSection } from '../../components/AnimatedSection';
import { uploadProductImage } from '../../lib/supabase';
import { 
  Sparkles, 
  Factory, 
  Award, 
  Heart,
  ChevronRight, 
  ChevronLeft,
  ArrowRight, 
  ShieldCheck,
  Star,
  Package,
  Edit3,
  Camera,
  Move,
  Hand,
  Save,
  X
} from 'lucide-react';

interface MobileHomeViewProps {
  setCurrentTab: (tab: string) => void;
  lang: Language;
  products: Product[];
  siteContent: SiteContent;
  onSelectProduct: (p: Product) => void;
  onThemeColorChange?: (color: string) => void;
  isAdmin?: boolean;
  onUpdateSiteContent?: (content: SiteContent) => void;
  onEditProduct?: (p: Product) => void;
}

export const MobileHomeView: React.FC<MobileHomeViewProps> = React.memo(({
  setCurrentTab,
  lang,
  products,
  siteContent,
  onSelectProduct,
  onThemeColorChange,
  isAdmin = false,
  onUpdateSiteContent,
  onEditProduct
}) => {
  const t = TRANSLATIONS[lang];
  const hp = t.homePage;
  const featuredProducts = products.map(p => translateProduct(p, lang)).filter(p => p.is_featured).slice(0, 4);

  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  // Interactive 4 Feature Items Data
  const featureItems = React.useMemo(() => [
    {
      id: 1,
      icon: Sparkles,
      title: hp.feature1Title || "Ingredientes Puros",
      desc: hp.feature1Desc || "Cacao 100% de origen ecuatoriano con máximo rendimiento y aroma."
    },
    {
      id: 2,
      icon: Factory,
      title: hp.feature2Title || "Maquila Industrial",
      desc: hp.feature2Desc || "Desarrollo de fórmulas a medida para industrias y emprendimientos."
    },
    {
      id: 3,
      icon: Award,
      title: hp.feature3Title || "Variedad de Sabores",
      desc: hp.feature3Desc || "Coberturas, cremas, rellenos y chocobocados en múltiples presentaciones."
    },
    {
      id: 4,
      icon: Heart,
      title: hp.feature4Title || "Hecho con Pasión",
      desc: hp.feature4Desc || "Más de 25 años perfeccionando coberturas y chocobocados."
    }
  ], [hp]);

  // Intelligent Default Slides Config
  const defaultSlides = React.useMemo(() => [
    {
      id: 1,
      tagline: hp.slide1Tagline,
      titleLine1: hp.slide1Title,
      titleAccent: hp.slide1Accent,
      description: lang === 'es' ? (siteContent.home_headline || hp.slide1Desc) : t.cmsFallback.home_headline,
      image: "/images/Slider de publicidad/COBERTURAS DE CHOCOLATE.webp",
      objectFit: "object-cover object-center",
      navColor: "#3A1B12",
      primaryBtnText: "Explorar",
      primaryTab: "industrial"
    },
    {
      id: 2,
      tagline: hp.slide2Tagline,
      titleLine1: hp.slide2Title,
      titleAccent: hp.slide2Accent,
      description: hp.slide2Desc,
      image: "/images/Slider de publicidad/CACAO EN POLVO.webp",
      objectFit: "object-cover object-center",
      navColor: "#2E1208",
      primaryBtnText: "Explorar",
      primaryTab: "products"
    },
    {
      id: 3,
      tagline: hp.slide3Tagline,
      titleLine1: hp.slide3Title,
      titleAccent: hp.slide3Accent,
      description: hp.slide3Desc,
      image: "/images/Slider de publicidad/GALLETAS Y CONOS.webp",
      objectFit: "object-cover object-center",
      navColor: "#4D3318",
      primaryBtnText: "Explorar",
      primaryTab: "products"
    },
    {
      id: 4,
      tagline: hp.slide4Tagline,
      titleLine1: hp.slide4Title,
      titleAccent: hp.slide4Accent,
      description: hp.slide4Desc,
      image: "/images/Slider de publicidad/MAQUILA INDUSTRIAL.webp",
      objectFit: "object-cover object-center",
      navColor: "#1A251B",
      primaryBtnText: "Explorar",
      primaryTab: "industrial"
    }
  ], [hp, lang, siteContent.home_headline, t.cmsFallback.home_headline]);

  // Merge Custom Admin Slides with Defaults
  const slides = React.useMemo(() => {
    const custom = siteContent.home_slides || [];
    return defaultSlides.map((def, idx) => {
      const match = custom.find(c => c.id === def.id) || custom[idx];
      if (!match) return def;
      return {
        ...def,
        tagline: match.tagline || def.tagline,
        titleLine1: match.titleLine1 || def.titleLine1,
        titleAccent: match.titleAccent || def.titleAccent,
        description: match.description || def.description,
        image: match.image || def.image,
        primaryBtnText: match.primaryBtnText || def.primaryBtnText,
        primaryTab: match.primaryTab || def.primaryTab,
        objectPosition: match.objectPosition || def.objectPosition
      };
    });
  }, [defaultSlides, siteContent.home_slides]);

  // Admin Inline Editing State
  const [isEditingTextInline, setIsEditingTextInline] = useState(false);
  const [isAdjustingImage, setIsAdjustingImage] = useState(false);
  const [isUploadingSlideImage, setIsUploadingSlideImage] = useState(false);
  const [dragPos, setDragPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  const [inlineTextForm, setInlineTextForm] = useState<SlideConfig>({
    id: 1,
    tagline: '',
    titleLine1: '',
    titleAccent: '',
    description: '',
    image: '',
    primaryBtnText: '',
    primaryTab: '',
    objectPosition: '50% 50%'
  });

  useEffect(() => {
    const s = slides[currentSlide];
    if (s) {
      setInlineTextForm({
        id: s.id,
        tagline: s.tagline,
        titleLine1: s.titleLine1,
        titleAccent: s.titleAccent,
        description: s.description,
        image: s.image,
        primaryBtnText: s.primaryBtnText,
        primaryTab: s.primaryTab,
        objectPosition: s.objectPosition || '50% 50%'
      });
    }
  }, [currentSlide, slides]);

  // Sync theme color
  useEffect(() => {
    onThemeColorChange?.(slides[currentSlide]?.navColor || '#3A1B12');
    return () => {
      onThemeColorChange?.('');
    };
  }, [currentSlide, onThemeColorChange, slides]);

  // Auto advance slides
  useEffect(() => {
    if (isPaused || isEditingTextInline || isAdjustingImage) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, isEditingTextInline, isAdjustingImage, slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="bg-[#fdfaf5] text-[#4a3224] font-sans selection:bg-[#b05d2e] selection:text-white space-y-5 pb-16">
      
      {/* =========================================================================
          1. HERO SLIDER SECTION - MOBILE EXCLUSIVE
          - Image fits full tab width (w-full object-cover side-to-side)
          - Content text aligned strictly to the left (text-left items-start)
         ========================================================================= */}
      <div 
        className="relative overflow-hidden transition-colors duration-700 ease-in-out w-full h-[260px] xs:h-[280px] sm:h-[300px] group"
        style={{ backgroundColor: slides[currentSlide]?.navColor || '#3A1B12' }}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Admin Controls */}
        {isAdmin && (
          <div className="absolute top-3 right-3 z-40 flex items-center gap-1.5">
            <label className="bg-black/70 hover:bg-black/90 text-white px-2.5 py-1.5 rounded-full font-bold text-[10px] shadow-lg flex items-center gap-1 border border-white/40 cursor-pointer backdrop-blur-md">
              <Camera className="w-3.5 h-3.5 text-[#e86014]" />
              <span>{isUploadingSlideImage ? '...' : `📷 Foto`}</span>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setIsUploadingSlideImage(true);
                  const res = await uploadProductImage(file);
                  if (res.success && res.url) {
                    const targetSlide = slides[currentSlide];
                    const updatedSlideConfig: SlideConfig = {
                      ...targetSlide,
                      image: res.url
                    };
                    const existingSlides = siteContent.home_slides ? [...siteContent.home_slides] : [...defaultSlides];
                    const idx = existingSlides.findIndex(s => s.id === updatedSlideConfig.id);
                    if (idx !== -1) existingSlides[idx] = updatedSlideConfig;
                    else existingSlides.push(updatedSlideConfig);
                    onUpdateSiteContent?.({ ...siteContent, home_slides: existingSlides });
                  }
                  setIsUploadingSlideImage(false);
                }}
                className="hidden"
                disabled={isUploadingSlideImage}
              />
            </label>
          </div>
        )}

        {/* Active Slide Renderer */}
        <div className="relative h-full w-full">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out w-full h-full ${
                idx === currentSlide ? 'opacity-100 z-10 scale-100 pointer-events-auto' : 'opacity-0 z-0 scale-105 pointer-events-none'
              }`}
            >
              {/* Full Width Image (Uniform 100% size for all 1920x1080 banners) */}
              <img
                src={slide.image}
                alt={slide.titleLine1}
                className="absolute inset-0 w-full h-full object-cover object-top transition-all duration-700"
                style={{ objectPosition: 'center top' }}
                fetchPriority={idx === 0 ? "high" : undefined}
                loading={idx === 0 ? undefined : "lazy"}
              />

              {/* Gradient Shade for High Text Contrast */}
              <div 
                className="absolute inset-0 z-10 pointer-events-none transition-all duration-700" 
                style={{ 
                  background: `linear-gradient(to right, ${slide.navColor}fa 0%, ${slide.navColor}d0 45%, ${slide.navColor}77 75%, transparent 100%)` 
                }} 
              />

              <div className="absolute inset-x-0 bottom-0 h-20 z-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

              {/* Left-Aligned Text Content Overlay (Positioned 20px from header) */}
              <div className="relative z-20 h-full w-full px-5 sm:px-8 pt-[20px] flex flex-col justify-start text-left items-start space-y-3 max-w-lg">
                
                {/* Tagline Badge - Left Aligned */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase text-left border border-white/20 shadow-md bg-[#e86014] text-white">
                  <Sparkles className="w-3.5 h-3.5 text-white shrink-0" />
                  <span className="truncate">{slide.tagline}</span>
                </div>

                {/* Title Line 1 + Accent - Left Aligned */}
                <h1 className="font-serif font-black text-2xl xs:text-3xl sm:text-4xl text-white leading-tight uppercase text-left drop-shadow-md">
                  {slide.titleLine1}
                  <span className="block text-xl xs:text-2xl sm:text-3xl font-bold mt-0.5 text-[#e86014] text-left">
                    {slide.titleAccent}
                  </span>
                </h1>

                {/* Description Paragraph - Left Aligned */}
                <p className="text-xs xs:text-sm text-white/90 leading-relaxed font-serif italic border-l-2 border-[#e86014] pl-3 text-left max-w-xs drop-shadow-sm">
                  "{slide.description}"
                </p>

                {/* Action Button - Left Aligned (Reduced vertical padding py-1.5, same text size) */}
                <div className="pt-0 -mt-[5px] text-left">
                  <button
                    onClick={() => setCurrentTab(slide.primaryTab)}
                    className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-bold text-white bg-[#e86014] shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-95"
                  >
                    <span>Explorar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>
          ))}

          {/* Navigation Arrows Grouped in the Right Corner for Mobile */}
          <div className="absolute bottom-3 right-3 z-30 flex items-center gap-1.5">
            <button
              onClick={prevSlide}
              className="p-1.5 rounded-full bg-black/50 text-white backdrop-blur-sm border border-white/20 active:scale-90 transition-transform shadow-md"
              aria-label={hp.prevSlide}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={nextSlide}
              className="p-1.5 rounded-full bg-black/50 text-white backdrop-blur-sm border border-white/20 active:scale-90 transition-transform shadow-md"
              aria-label={hp.nextSlide}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* =========================================================================
          2. FEATURE ICONS ROW - HORIZONTAL SIDE BY SIDE (Smooth Horizontal Expansion)
         ========================================================================= */}
      <div className="relative z-30 !mt-[8px] mx-4 flex items-center justify-center gap-[8px] text-left" style={{ marginTop: '8px' }}>
        {featureItems.map((item) => {
          const IconComp = item.icon;
          const isActive = activeFeature === item.id;

          return (
            <div
              key={item.id}
              onClick={() => setActiveFeature(isActive ? null : item.id)}
              className={`cursor-pointer overflow-hidden ${
                isActive 
                  ? 'flex-1 bg-white/95 backdrop-blur-md rounded-2xl border border-[#b05d2e] shadow-lg p-2.5 flex items-center gap-2.5 min-w-0' 
                  : 'aspect-square w-12 sm:w-14 shrink-0 flex items-center justify-center bg-[#f3ece0] text-[#b05d2e] rounded-2xl border border-[#e8dcc4] shadow-md'
              }`}
              title={item.title}
            >
              <div className={`shrink-0 flex items-center justify-center ${
                isActive ? 'p-2 bg-[#f3ece0] text-[#b05d2e] rounded-xl border border-[#e8dcc4]' : ''
              }`}>
                <IconComp className="w-5 h-5 text-[#b05d2e]" />
              </div>

              {isActive && (
                <div className="flex-1 min-w-0 pr-1">
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

      {/* =========================================================================
          3. FEATURED PRODUCTS CATALOG FOR MOBILE
         ========================================================================= */}
      <AnimatedSection animation="fade-up" delay={100} className="px-4 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[#b05d2e] font-bold text-[10px] uppercase tracking-widest bg-[#f3ece0] px-3 py-1 rounded-full border border-[#e8dcc4]">
            <span>{hp.featuredBadge}</span>
          </div>
          <h2 className="font-serif font-extrabold text-2xl text-[#3d2516]">
            {hp.featuredTitle}
          </h2>
        </div>

        {/* Product Cards Stack / Grid */}
        <div className="grid grid-cols-1 gap-4">
          {featuredProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => onSelectProduct(prod)}
              className="bg-white rounded-2xl border border-[#e8dcc4] active:scale-[0.99] transition-all cursor-pointer overflow-hidden shadow-sm flex flex-row items-center p-3 gap-3"
            >
              <div className="relative w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-[#fdf5e6]">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="flex-1 space-y-1 text-left min-w-0">
                <h3 className="font-serif font-bold text-sm text-[#3d2516] truncate">
                  {prod.name}
                </h3>
                
                <span className="inline-block bg-[#f3ece0] text-[#b05d2e] font-bold text-[10px] px-2 py-0.5 rounded-full border border-[#e8dcc4]">
                  {prod.package_size}
                </span>

                <p className="text-[11px] text-[#6d4c41] line-clamp-2 leading-tight">
                  {prod.description}
                </p>

                <div className="pt-1 flex items-center gap-1 text-[11px] text-[#b05d2e] font-bold">
                  <span>{hp.viewDetails}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-1">
          <button
            onClick={() => setCurrentTab('products')}
            className="inline-flex items-center gap-2 bg-[#603813] active:bg-[#b05d2e] text-white font-bold px-6 py-3 rounded-full text-xs uppercase tracking-wider transition-colors shadow-md w-full justify-center"
          >
            <span>{hp.viewFullCatalog}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </AnimatedSection>

      {/* =========================================================================
          4. ABOUT US SUMMARY FOR MOBILE
         ========================================================================= */}
      <AnimatedSection animation="fade-up" delay={150} className="px-4 py-2 space-y-4 text-left">
        <div className="relative rounded-2xl overflow-hidden shadow-md border border-[#e8dcc4]">
          <img
            src="/images/bodegon/rapichoc_chocobanano_variedad_sabores.jpg"
            alt="Fábrica Gustaff"
            className="w-full h-52 object-cover"
            loading="lazy"
          />
          <div className="absolute bottom-3 left-3 bg-[#b05d2e] text-white px-3 py-1.5 rounded-xl shadow-lg border border-white">
            <span className="text-xl font-black font-serif leading-none block">{hp.yearsExpNumber}</span>
            <span className="text-[9px] uppercase font-bold tracking-wider">{hp.yearsExpBadge}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif font-extrabold text-2xl text-[#3d2516]">
            {hp.aboutHeading}
          </h2>
          <p className="text-xs text-[#603813] font-serif italic bg-[#f3ece0]/90 p-3 rounded-xl border-l-4 border-[#b05d2e]">
            "{lang === 'es' ? siteContent.home_quienes_somos : t.cmsFallback.home_quienes_somos}"
          </p>
          <button
            onClick={() => setCurrentTab('about')}
            className="bg-[#603813] text-white font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md w-full justify-center"
          >
            <span>{hp.fullHistoryBtn}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </AnimatedSection>

      {/* =========================================================================
          5. INDUSTRIAL MAQUILA SUMMARY FOR MOBILE
         ========================================================================= */}
      <AnimatedSection animation="fade-up" delay={200} className="px-4 py-2 space-y-4 text-left">
        <div className="relative rounded-2xl overflow-hidden shadow-md border border-[#e8dcc4]">
          <img
            src="/images/bodegon/crema_avellanas_con_chocolate_frasco.png"
            alt="Maquila Gustaff"
            className="w-full h-52 object-cover"
            loading="lazy"
          />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif font-extrabold text-2xl text-[#3d2516]">
            {hp.industrialHeading}
          </h2>
          <p className="text-xs text-[#603813] font-serif italic bg-[#f3ece0]/90 p-3 rounded-xl border-l-4 border-[#b05d2e]">
            "{lang === 'es' ? siteContent.home_industrial_summary : t.cmsFallback.home_industrial_summary}"
          </p>
          <button
            onClick={() => setCurrentTab('industrial')}
            className="bg-[#603813] text-white font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md w-full justify-center"
          >
            <Package className="w-4 h-4 text-[#d4af37]" />
            <span>{hp.exploreIndustrialBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </AnimatedSection>

      {/* =========================================================================
          6. QUALITY BANNER FOR MOBILE
         ========================================================================= */}
      <AnimatedSection animation="scale-up" delay={250} className="px-4">
        <div className="bg-white border border-[#e8dcc4] rounded-2xl p-5 space-y-3 text-left shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#f3ece0] text-[#b05d2e] rounded-xl border border-[#e8dcc4] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-sm text-[#3d2516]">
              {hp.qualityBannerTitle}
            </h3>
          </div>
          <p className="text-xs text-[#6d4c41] leading-relaxed">
            {hp.qualityBannerText}
          </p>
          <button
            onClick={() => setCurrentTab('about')}
            className="w-full bg-[#603813] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all"
          >
            {hp.readQualityPolicyBtn}
          </button>
        </div>
      </AnimatedSection>

    </div>
  );
});

MobileHomeView.displayName = 'MobileHomeView';
