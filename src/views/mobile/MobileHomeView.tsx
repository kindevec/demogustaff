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
    const custom = siteContent.home_slides;
    if (custom && custom.length > 0) {
      return custom.map((c, idx) => {
        const def = defaultSlides.find(d => d.id === c.id) || defaultSlides[idx] || defaultSlides[0];
        return {
          ...def,
          ...c,
          id: c.id || idx + 1,
          tagline: c.tagline || def.tagline,
          titleLine1: c.titleLine1 || def.titleLine1,
          titleAccent: c.titleAccent || def.titleAccent,
          description: c.description || def.description,
          image: c.image || def.image,
          primaryBtnText: c.primaryBtnText || def.primaryBtnText,
          primaryTab: c.primaryTab || def.primaryTab,
          objectPosition: c.objectPosition || def.objectPosition,
          bgZoom: c.bgZoom
        };
      });
    }
    return defaultSlides;
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
    <div className="bg-[#fdfaf5] text-[#4a3224] font-sans selection:bg-[#b05d2e] selection:text-white space-y-5 pb-0 -mb-[8px]">
      
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
                style={{
                  objectPosition: slide.objectPosition || 'center top',
                  transform: slide.bgZoom && slide.bgZoom > 100 ? (() => {
                    const zoomScale = slide.bgZoom / 100;
                    const posParts = (slide.objectPosition || '50% 50%').replace(/%/g, '').trim().split(/\s+/);
                    const px = parseFloat(posParts[0]) || 50;
                    const py = parseFloat(posParts[1]) || 50;
                    return `scale(${zoomScale}) translate(${((50 - px) * (1 - 1 / zoomScale))}%, ${((50 - py) * (1 - 1 / zoomScale))}%)`;
                  })() : undefined,
                  transformOrigin: 'center center'
                }}
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
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase text-left border border-white/20 shadow-md bg-yellow-400 text-[#3d2516]">
                  <Sparkles className="w-3.5 h-3.5 text-[#3d2516] shrink-0" />
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
                    className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-bold text-[#3d2516] bg-yellow-400 hover:bg-yellow-300 shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-95"
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
      <div className="relative z-30 !mt-[8px] mx-4 h-13 flex items-center justify-center gap-[8px]" style={{ marginTop: '8px' }}>
        {featureItems.map((item, index) => {
          const IconComp = item.icon;
          const isActive = activeFeature === item.id;
          const isRightSide = index >= 2; // Icons on right side (3 & 4) expand left

          return (
            <div
              key={item.id}
              onClick={() => setActiveFeature(isActive ? null : item.id)}
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

      {/* =========================================================================
          3. FEATURED PRODUCTS CATALOG FOR MOBILE
         ========================================================================= */}
      <AnimatedSection animation="fade-up" delay={100} className="px-4 space-y-6">
        
        {/* Section Header with Top-Right Ir Button */}
        <div className="relative flex items-center justify-between pt-1">
          <div className="flex-1 text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[#b05d2e] font-bold text-[10px] uppercase tracking-widest bg-[#f3ece0] px-3 py-1 rounded-full border border-[#e8dcc4]">
              <span>{hp.featuredBadge}</span>
            </div>
            <h2 className="font-serif font-extrabold text-2xl text-[#3d2516]">
              {hp.featuredTitle}
            </h2>
          </div>

          <button
            onClick={() => setCurrentTab('products')}
            className="absolute right-0 bottom-1 translate-y-[25px] inline-flex items-center gap-1 bg-[#603813] active:bg-[#b05d2e] text-white font-bold px-3.5 py-1.5 rounded-full text-xs transition-colors shadow-sm cursor-pointer z-10"
          >
            <span>Ir</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Product Cards Horizontal Carousel (Cards: 187px x 294.5px, 10px initial left offset) */}
        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-3.5 pl-[10px] pr-[10px] py-2 -mx-4 scroll-pl-[10px]">
          {featuredProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => onSelectProduct(prod)}
              className="w-[187px] h-[294.5px] shrink-0 snap-start bg-white rounded-2xl border border-[#e8dcc4] hover:border-[#b05d2e] active:scale-[0.98] transition-all cursor-pointer overflow-hidden shadow-sm flex flex-col justify-between relative group text-left"
            >
              {/* Product Image Box (Occupies full 100% card width flush to edges) */}
              <div className="relative w-full h-[145px] shrink-0 overflow-hidden bg-[#fdf5e6]">
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditProduct?.(prod);
                    }}
                    className="absolute top-2 left-2 z-20 bg-[#e86014] text-white px-2 py-0.5 rounded-full text-[9px] font-bold shadow-md flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Editar</span>
                  </button>
                )}

                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#b05d2e] text-white flex items-center justify-center shadow-sm">
                  <Heart className="w-3 h-3 fill-white" />
                </div>
              </div>

              {/* Product Information Body (Clean internal padding) */}
              <div className="p-3 pt-2.5 flex-1 flex flex-col justify-between space-y-1 text-left min-w-0">
                <div>
                  <h3 className="font-serif font-bold text-xs text-[#3d2516] truncate group-hover:text-[#b05d2e] transition-colors">
                    {prod.name}
                  </h3>

                  <div className="flex items-center justify-between text-[10px] mt-1">
                    <div className="flex items-center text-amber-500 gap-0.5">
                      <Star className="w-3 h-3 fill-amber-500" />
                      <span className="text-[#6d4c41] font-mono text-[9px]">(HACCP)</span>
                    </div>
                    <span className="bg-[#f3ece0] text-[#b05d2e] font-bold text-[9px] px-1.5 py-0.5 rounded-full border border-[#e8dcc4] truncate max-w-[75px]">
                      {prod.package_size}
                    </span>
                  </div>

                  <p className="text-[10px] text-[#6d4c41] line-clamp-2 leading-tight mt-1.5">
                    {prod.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#e8dcc4] flex items-center justify-between text-[10px] text-[#b05d2e] font-bold">
                  <span>{hp.viewDetails}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

            </div>
          ))}
        </div>

      </AnimatedSection>

      {/* =========================================================================
          4. ABOUT US SUMMARY FOR MOBILE
         ========================================================================= */}
      <AnimatedSection animation="fade-up" delay={150} className="px-4 py-2 space-y-4 text-left">
        
        {/* Title and Description OUTSIDE and ABOVE the card container */}
        <div className="space-y-2">
          <h2 className="font-serif font-extrabold text-2xl text-[#3d2516]">
            {hp.aboutHeading}
          </h2>
          <p className="text-xs text-[#603813] font-serif italic bg-[#f3ece0]/90 p-3 rounded-xl border-l-4 border-[#b05d2e]">
            "{lang === 'es' ? siteContent.home_quienes_somos : t.cmsFallback.home_quienes_somos}"
          </p>
        </div>

        {/* Card Container below title and description */}
        <div className="relative rounded-2xl shadow-md border border-[#e8dcc4]">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src="/images/bodegon/rapichoc_chocobanano_variedad_sabores.jpg"
              alt="Fábrica Gustaff"
              className="w-full h-52 object-cover"
              loading="lazy"
            />
          </div>
          
          {/* Badge overlapped 50% on the card bottom-left edge */}
          <div className="absolute bottom-0 translate-y-1/2 left-4 z-20 bg-[#b05d2e] text-white px-4 py-2 rounded-xl shadow-lg border-2 border-white text-center">
            <span className="text-xl font-black font-serif leading-none block">25+</span>
            <span className="text-[10px] uppercase font-extrabold tracking-wider block mt-0.5">AÑOS</span>
          </div>

          {/* CONÓCENOS Button overlapped 50% on the card bottom-right edge */}
          <button
            onClick={() => setCurrentTab('about')}
            className="absolute bottom-0 translate-y-1/2 right-4 z-20 bg-[#603813] active:bg-[#b05d2e] text-white font-bold px-4 py-2.5 rounded-xl border-2 border-white text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg cursor-pointer transition-colors"
          >
            <span>CONÓCENOS</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </AnimatedSection>

      {/* =========================================================================
          5. INDUSTRIAL MAQUILA SUMMARY FOR MOBILE
         ========================================================================= */}
      <AnimatedSection animation="fade-up" delay={200} className="px-4 py-2 space-y-4 text-left">
        
        {/* Title and Description OUTSIDE and ABOVE the card container */}
        <div className="space-y-2">
          <h2 className="font-serif font-extrabold text-2xl text-[#3d2516]">
            {hp.industrialHeading}
          </h2>
          <p className="text-xs text-[#603813] font-serif italic bg-[#f3ece0]/90 p-3 rounded-xl border-l-4 border-[#b05d2e]">
            "{lang === 'es' ? siteContent.home_industrial_summary : t.cmsFallback.home_industrial_summary}"
          </p>
        </div>

        {/* Card Container below title and description */}
        <div className="relative rounded-2xl shadow-md border border-[#e8dcc4]">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src="/images/bodegon/crema_avellanas_con_chocolate_frasco.png"
              alt="Maquila Gustaff"
              className="w-full h-52 object-cover"
              loading="lazy"
            />
          </div>

          {/* Badge overlapped 50% on the card bottom-left edge */}
          <div className="absolute bottom-0 translate-y-1/2 left-4 z-20 bg-[#b05d2e] text-white px-3.5 py-1.5 rounded-xl shadow-lg border-2 border-white flex items-center gap-1.5 text-center">
            <Factory className="w-4 h-4 text-white shrink-0" />
            <span className="text-[10px] uppercase font-extrabold tracking-wider">MAQUILA A MEDIDA</span>
          </div>

          {/* EXPLORAR Button overlapped 50% on the card bottom-right edge */}
          <button
            onClick={() => setCurrentTab('industrial')}
            className="absolute bottom-0 translate-y-1/2 right-4 z-20 bg-[#603813] active:bg-[#b05d2e] text-white font-bold px-4 py-2.5 rounded-xl border-2 border-white text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg cursor-pointer transition-colors"
          >
            <span>EXPLORAR</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </AnimatedSection>

      {/* =========================================================================
          6. QUALITY BANNER FOR MOBILE
         ========================================================================= */}
      <AnimatedSection animation="scale-up" delay={250} className="px-4">
        <div className="bg-white border border-[#e8dcc4] rounded-2xl p-5 space-y-3 text-left shadow-sm relative">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#f3ece0] text-[#b05d2e] rounded-xl border border-[#e8dcc4] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-sm text-[#3d2516] pr-16">
              {hp.qualityBannerTitle}
            </h3>
          </div>
          <p className="text-xs text-[#6d4c41] leading-relaxed pb-2">
            {hp.qualityBannerText}
          </p>
          
          <button
            onClick={() => setCurrentTab('about')}
            className="absolute bottom-0 translate-y-1/2 left-4 z-20 bg-[#603813] active:bg-[#b05d2e] text-white px-4 py-2 rounded-xl border-2 border-white text-xs font-bold uppercase tracking-wider shadow-lg cursor-pointer transition-colors flex items-center gap-1"
          >
            <span>LEER</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </AnimatedSection>

    </div>
  );
});

MobileHomeView.displayName = 'MobileHomeView';
