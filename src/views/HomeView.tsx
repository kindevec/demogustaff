import React, { useState, useEffect } from 'react';
import { translateProduct } from '../lib/translateProduct';
import { Language, Product, SiteContent } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { AnimatedSection } from '../components/AnimatedSection';
import { 
  Sparkles, 
  Factory, 
  Package, 
  Award, 
  ChevronRight, 
  ChevronLeft,
  Lock, 
  ArrowRight, 
  ShieldCheck,
  Star,
  Heart,
  Download
} from 'lucide-react';

interface HomeViewProps {
  setCurrentTab: (tab: string) => void;
  lang: Language;
  products: Product[];
  siteContent: SiteContent;
  onSelectProduct: (p: Product) => void;
  onThemeColorChange?: (color: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setCurrentTab,
  lang,
  products,
  siteContent,
  onSelectProduct,
  onThemeColorChange
}) => {
  const t = TRANSLATIONS[lang];
  const hp = t.homePage;
  const featuredProducts = products.map(p => translateProduct(p, lang)).filter(p => p.is_featured).slice(0, 4);

  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Intelligent Slides Color & Edge-to-Edge WebP Banners Config
  const slides = [
    {
      id: 1,
      tagline: hp.slide1Tagline,
      titleLine1: hp.slide1Title,
      titleAccent: hp.slide1Accent,
      description: lang === 'es' ? (siteContent.home_headline || hp.slide1Desc) : t.cmsFallback.home_headline,
      image: "/images/Slider de publicidad/COBERTURAS DE CHOCOLATE.webp",
      objectFit: "object-cover object-center sm:object-right",
      textColor: "text-white",
      subtextColor: "text-[#e5d5c5]",
      quoteBg: "bg-black/35 backdrop-blur-md border-white/15",
      quoteText: "text-[#f3ece0]",
      taglineBadge: "bg-[#e86014] text-white border-[#e86014]/40 font-bold",
      accentColor: "text-[#e86014]",
      navColor: "#3A1B12",
      btnPrimary: "bg-gradient-to-r from-[#e86014] to-[#d9530f] hover:from-[#d9530f] hover:to-[#c4470b] text-white shadow-xl shadow-[#e8601444]",
      btnSecondary: "bg-black/40 hover:bg-black/60 text-white border border-white/30 backdrop-blur-md",
      gradientMask: "from-[#120703]/85 via-[#120703]/60 via-45% to-transparent",
      primaryBtnText: t.hero.btnCatalog || "Ver Catálogo Industrial",
      primaryTab: "industrial"
    },
    {
      id: 2,
      tagline: hp.slide2Tagline,
      titleLine1: hp.slide2Title,
      titleAccent: hp.slide2Accent,
      description: hp.slide2Desc,
      image: "/images/Slider de publicidad/CACAO EN POLVO.webp",
      objectFit: "object-cover object-center sm:object-right",
      textColor: "text-white",
      subtextColor: "text-[#d4c3b5]",
      quoteBg: "bg-black/35 backdrop-blur-md border-white/15",
      quoteText: "text-[#f3ece0]",
      taglineBadge: "bg-[#e86014] text-white border-[#e86014]/40 font-bold",
      accentColor: "text-[#e86014]",
      navColor: "#2E1208",
      btnPrimary: "bg-gradient-to-r from-[#e86014] to-[#d9530f] hover:from-[#d9530f] hover:to-[#c4470b] text-white shadow-xl shadow-[#e8601444]",
      btnSecondary: "bg-black/40 hover:bg-black/60 text-white border border-white/30 backdrop-blur-md",
      gradientMask: "from-[#170a04]/85 via-[#170a04]/60 via-45% to-transparent",
      primaryBtnText: hp.slide2Btn,
      primaryTab: "products"
    },
    {
      id: 3,
      tagline: hp.slide3Tagline,
      titleLine1: hp.slide3Title,
      titleAccent: hp.slide3Accent,
      description: hp.slide3Desc,
      image: "/images/Slider de publicidad/GALLETAS Y CONOS.webp",
      objectFit: "object-cover object-center sm:object-right",
      textColor: "text-white",
      subtextColor: "text-[#e5d5c5]",
      quoteBg: "bg-black/35 backdrop-blur-md border-white/15",
      quoteText: "text-[#f3ece0]",
      taglineBadge: "bg-[#e86014] text-white border-[#e86014]/40 font-bold",
      accentColor: "text-[#e86014]",
      navColor: "#4D3318",
      btnPrimary: "bg-gradient-to-r from-[#e86014] to-[#d9530f] hover:from-[#d9530f] hover:to-[#c4470b] text-white shadow-xl shadow-[#e8601444]",
      btnSecondary: "bg-black/40 hover:bg-black/60 text-white border border-white/30 backdrop-blur-md",
      gradientMask: "from-[#1c0c05]/85 via-[#1c0c05]/60 via-45% to-transparent",
      primaryBtnText: hp.slide3Btn,
      primaryTab: "products"
    },
    {
      id: 4,
      tagline: hp.slide4Tagline,
      titleLine1: hp.slide4Title,
      titleAccent: hp.slide4Accent,
      description: hp.slide4Desc,
      image: "/images/Slider de publicidad/MAQUILA INDUSTRIAL.webp",
      objectFit: "object-cover object-center sm:object-right",
      textColor: "text-white",
      subtextColor: "text-[#d4c3b5]",
      quoteBg: "bg-black/35 backdrop-blur-md border-white/15",
      quoteText: "text-[#f3ece0]",
      taglineBadge: "bg-[#e86014] text-white border-[#e86014]/40 font-bold",
      accentColor: "text-[#e86014]",
      navColor: "#1A251B",
      btnPrimary: "bg-gradient-to-r from-[#e86014] to-[#d9530f] hover:from-[#d9530f] hover:to-[#c4470b] text-white shadow-xl shadow-[#e8601444]",
      btnSecondary: "bg-black/40 hover:bg-black/60 text-white border border-white/30 backdrop-blur-md",
      gradientMask: "from-[#150903]/85 via-[#150903]/60 via-45% to-transparent",
      primaryBtnText: hp.slide4Btn,
      primaryTab: "industrial"
    }
  ];

  // Sync theme color to parent (Navbar)
  useEffect(() => {
    onThemeColorChange?.(slides[currentSlide]?.navColor || '#3A1B12');
    return () => {
      onThemeColorChange?.('');
    };
  }, [currentSlide, onThemeColorChange, slides]);

  // Auto advance slides every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="bg-[#fdfaf5] text-[#4a3224] font-sans selection:bg-[#b05d2e] selection:text-white space-y-16 pb-16">
      
      {/* =========================================================================
          1. HERO SLIDER SECTION (Full Edge-to-Edge 4 WebP Banners)
         ========================================================================= */}
      {/* =========================================================================
          1. HERO SLIDER SECTION (Full Edge-to-Edge ProductsView Style)
         ========================================================================= */}
      <div 
        className="relative overflow-hidden transition-colors duration-700 ease-in-out h-[580px] sm:h-[680px] lg:h-[784px] group"
        style={{ backgroundColor: slides[currentSlide]?.navColor || '#3A1B12' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Active Slide Renderer */}
        <div className="relative h-full">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                idx === currentSlide ? 'opacity-100 z-10 scale-100 pointer-events-auto' : 'opacity-0 z-0 scale-105 pointer-events-none'
              }`}
            >
              {/* Full Background Image Container (Edge-to-Edge Coverage with smooth zoom) */}
              <img
                src={slide.image}
                alt={slide.titleLine1}
                className={`absolute inset-0 w-full h-full ${slide.objectFit} transition-transform duration-700 ${idx === currentSlide ? 'animate-hero-zoom' : ''}`}
              />

              {/* Left Gradient Overlay — Dynamic per slide navColor */}
              <div 
                className="absolute inset-0 z-10 pointer-events-none transition-all duration-700" 
                style={{ 
                  background: `linear-gradient(to right, ${slide.navColor}ee 0%, ${slide.navColor}cc 30%, ${slide.navColor}88 50%, transparent 75%)` 
                }} 
              />

              {/* Mobile Bottom Shade */}
              <div className="absolute inset-x-0 bottom-0 h-56 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent sm:hidden pointer-events-none" />

              {/* Text & Content Overlay */}
              <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col justify-center text-left space-y-4 sm:space-y-5">
                
                {/* Tagline Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-extrabold tracking-wider uppercase w-fit border border-white/20 shadow-lg bg-[#e86014] text-white">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>{slide.tagline}</span>
                </div>

                {/* Headline Title */}
                <h1 className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight max-w-2xl drop-shadow-lg uppercase">
                  {slide.titleLine1}
                  <span className="block text-2xl sm:text-3xl lg:text-4xl font-bold mt-1 text-[#e86014]">
                    {slide.titleAccent}
                  </span>
                </h1>

                {/* Description Paragraph */}
                <p className="text-sm sm:text-base text-white/80 max-w-md leading-relaxed drop-shadow-sm font-serif italic border-l-2 border-[#e86014] pl-3">
                  "{slide.description}"
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setCurrentTab(slide.primaryTab)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white bg-[#e86014] shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 w-fit cursor-pointer group/btn"
                  >
                    <span>{slide.primaryBtnText}</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => setCurrentTab('downloads')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-black/40 hover:bg-black/60 border border-white/30 backdrop-blur-md transition-all duration-300 w-fit cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-[#e86014]" />
                    <span>{t.hero.btnDownloads}</span>
                  </button>
                </div>

              </div>

            </div>
          ))}

          {/* Navigation Controls: Left & Right Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 transition-all shadow-lg cursor-pointer hover:scale-110"
            aria-label={hp.prevSlide}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 transition-all shadow-lg cursor-pointer hover:scale-110"
            aria-label={hp.nextSlide}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Pagination Indicators / Slide Dots */}
          <div className="absolute bottom-20 sm:bottom-24 lg:bottom-28 left-6 sm:left-10 lg:left-16 z-30 flex items-center gap-2.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentSlide ? 'w-10 h-3 bg-[#e86014]' : 'w-3 h-3 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`${hp.goToSlide} ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </div>

      {/* =========================================================================
          2. FEATURE RIBBON BAR (4 Independent Cards Superimposed over Hero Slider)
         ========================================================================= */}
      <AnimatedSection animation="fade-up" delay={100} className="relative z-30 -mt-16 sm:-mt-20 lg:-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Card 1 */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 border border-[#e8dcc4] shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex items-start gap-4 text-left">
            <div className="p-3 bg-[#f3ece0] text-[#b05d2e] rounded-2xl shrink-0 border border-[#e8dcc4] shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-[#3d2516]">
                {hp.feature1Title}
              </h4>
              <p className="text-xs text-[#6d4c41] mt-1 leading-relaxed">
                {hp.feature1Desc}
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 border border-[#e8dcc4] shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex items-start gap-4 text-left">
            <div className="p-3 bg-[#f3ece0] text-[#b05d2e] rounded-2xl shrink-0 border border-[#e8dcc4] shadow-sm">
              <Factory className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-[#3d2516]">
                {hp.feature2Title}
              </h4>
              <p className="text-xs text-[#6d4c41] mt-1 leading-relaxed">
                {hp.feature2Desc}
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 border border-[#e8dcc4] shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex items-start gap-4 text-left">
            <div className="p-3 bg-[#f3ece0] text-[#b05d2e] rounded-2xl shrink-0 border border-[#e8dcc4] shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-[#3d2516]">
                {hp.feature3Title}
              </h4>
              <p className="text-xs text-[#6d4c41] mt-1 leading-relaxed">
                {hp.feature3Desc}
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 border border-[#e8dcc4] shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex items-start gap-4 text-left">
            <div className="p-3 bg-[#f3ece0] text-[#b05d2e] rounded-2xl shrink-0 border border-[#e8dcc4] shadow-sm">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-[#3d2516]">
                {hp.feature4Title}
              </h4>
              <p className="text-xs text-[#6d4c41] mt-1 leading-relaxed">
                {hp.feature4Desc}
              </p>
            </div>
          </div>

        </div>
      </AnimatedSection>

      {/* =========================================================================
          3. FEATURED CATALOG ("Our Chef's Specials" Card Grid)
         ========================================================================= */}
      <AnimatedSection animation="fade-up" delay={150} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-[#b05d2e] font-bold text-xs uppercase tracking-widest bg-[#f3ece0] px-4 py-1 rounded-full border border-[#e8dcc4]">
            <span>{hp.featuredBadge}</span>
          </div>
          <h2 className="font-serif font-extrabold text-3xl sm:text-4xl text-[#3d2516]">
            {hp.featuredTitle}
          </h2>
          <div className="flex justify-center items-center gap-2 text-[#b05d2e] text-sm pt-1">
            <span className="w-12 h-[1px] bg-[#b05d2e]/40" />
            <span>🍫</span>
            <span className="w-12 h-[1px] bg-[#b05d2e]/40" />
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => onSelectProduct(prod)}
              className="bg-white rounded-3xl border border-[#e8dcc4] hover:border-[#b05d2e] transition-all duration-300 cursor-pointer overflow-hidden group shadow-sm hover:shadow-xl flex flex-col justify-between"
            >
              {/* Product Image (Flush to top, left & right card edges) */}
              <div className="relative h-56 sm:h-60 overflow-hidden bg-[#fdf5e6]">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Floating Heart / Detail Icon */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#b05d2e] text-[#fdfaf5] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform z-10">
                  <Heart className="w-4 h-4 fill-white" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between text-left">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#3d2516] group-hover:text-[#b05d2e] transition-colors line-clamp-1">
                    {prod.name}
                  </h3>

                  {/* Rating Stars & Presentation */}
                  <div className="flex items-center justify-between text-xs mt-2">
                    <div className="flex items-center text-amber-500 gap-1">
                      <div className="flex text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                      </div>
                      <span className="text-[#6d4c41] text-[11px] font-mono ml-1">(HACCP)</span>
                    </div>
                    <span className="bg-[#f3ece0] text-[#b05d2e] font-bold text-[11px] px-2 py-0.5 rounded-full border border-[#e8dcc4]">
                      {prod.package_size}
                    </span>
                  </div>

                  <p className="text-xs text-[#6d4c41] line-clamp-2 mt-3 leading-relaxed">
                    {prod.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#e8dcc4] flex items-center justify-between text-xs text-[#b05d2e] font-bold">
                  <span>{hp.viewDetails}</span>
                  <ChevronRight className="w-4 h-4 text-[#b05d2e] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* View Full Catalog Action Button */}
        <div className="text-center pt-2">
          <button
            onClick={() => setCurrentTab('products')}
            className="inline-flex items-center gap-2 bg-[#603813] hover:bg-[#b05d2e] text-white font-bold px-8 py-3.5 rounded-full text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 cursor-pointer"
          >
            <span>{hp.viewFullCatalog}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </AnimatedSection>

      {/* =========================================================================
          4. ABOUT US SECTION
         ========================================================================= */}
      <AnimatedSection animation="fade-up" delay={200} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Image Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-[#e8dcc4]">
              <img
                src="/images/bodegon/rapichoc_chocobanano_variedad_sabores.jpg"
                alt="Nuestra Fábrica Gustaff"
                className="w-full h-[420px] object-cover"
              />
            </div>

            {/* Floating Orange Experience Badge */}
            <div className="absolute -bottom-6 -left-4 sm:left-4 bg-gradient-to-br from-[#b05d2e] to-[#994d23] text-white p-6 rounded-3xl shadow-2xl border-2 border-white max-w-[220px]">
              <span className="block text-4xl sm:text-5xl font-black font-serif leading-none">
                {hp.yearsExpNumber}
              </span>
              <span className="text-xs uppercase font-extrabold tracking-wider mt-1 block opacity-95">
                {hp.yearsExpBadge}
              </span>
            </div>
          </div>

          {/* Right Text Column */}
          <div className="lg:col-span-6 space-y-5 text-left pt-0">
            
            <div className="space-y-3">
              <h2 className="font-serif font-extrabold text-3xl sm:text-4xl text-[#3d2516] leading-tight">
                {hp.aboutHeading}
              </h2>
              <div className="inline-flex items-center gap-2 text-[#b05d2e] font-bold text-xs uppercase tracking-wider bg-[#f3ece0] px-3.5 py-1 rounded-full border border-[#e8dcc4]">
                <span>{hp.aboutBadge}</span>
              </div>
            </div>

            <p className="text-base text-[#603813] font-serif italic bg-[#f3ece0]/80 p-5 rounded-2xl border-l-4 border-[#b05d2e] border-y border-r border-[#e8dcc4] shadow-sm">
              "{lang === 'es' ? siteContent.home_quienes_somos : t.cmsFallback.home_quienes_somos}"
            </p>

            <p className="text-sm text-[#4a3224] leading-relaxed">
              {hp.aboutHistoryBody}
            </p>

            <div className="pt-2 flex items-center justify-between flex-wrap gap-4">
              <button
                onClick={() => setCurrentTab('about')}
                className="bg-[#603813] hover:bg-[#b05d2e] text-white font-bold px-8 py-3.5 rounded-full text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>{hp.fullHistoryBtn}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="font-serif italic text-xl text-[#b05d2e] font-bold opacity-90">
                Gustaff S.A. ❤
              </div>
            </div>

          </div>

        </div>
      </AnimatedSection>

      {/* =========================================================================
          5. INDUSTRIAL MAQUILA SECTION
         ========================================================================= */}
      <AnimatedSection animation="fade-up" delay={200} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-5 text-left pt-0">
            
            <div className="space-y-3">
              <h2 className="font-serif font-extrabold text-3xl sm:text-4xl text-[#3d2516] leading-tight">
                {hp.industrialHeading}
              </h2>
              <div className="inline-flex items-center gap-2 text-[#b05d2e] font-bold text-xs uppercase tracking-wider bg-[#f3ece0] px-3.5 py-1 rounded-full border border-[#e8dcc4]">
                <span>{hp.industrialBadge}</span>
              </div>
            </div>

            <p className="text-base text-[#603813] font-serif italic bg-[#f3ece0]/80 p-5 rounded-2xl border-l-4 border-[#b05d2e] border-y border-r border-[#e8dcc4] shadow-sm">
              "{lang === 'es' ? siteContent.home_industrial_summary : t.cmsFallback.home_industrial_summary}"
            </p>

            <p className="text-sm text-[#4a3224] leading-relaxed">
              {hp.industrialBody}
            </p>

            <div className="pt-2">
              <button
                onClick={() => setCurrentTab('industrial')}
                className="bg-[#603813] hover:bg-[#b05d2e] text-white font-bold px-7 py-3.5 rounded-full text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5"
              >
                <Package className="w-4 h-4 text-[#d4af37]" />
                <span>{hp.exploreIndustrialBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-[#e8dcc4]">
              <img
                src="/images/bodegon/crema_avellanas_con_chocolate_frasco.png"
                alt="Maquila Industrial Gustaff"
                className="w-full h-[420px] object-cover"
              />
            </div>

            {/* Floating Industrial Maquila Badge */}
            <div className="absolute -bottom-6 -right-4 sm:right-4 bg-gradient-to-br from-[#603813] to-[#3d2516] text-white p-6 rounded-3xl shadow-2xl border-2 border-white max-w-[230px]">
              <span className="block text-3xl sm:text-4xl font-black font-serif text-[#d4af37] leading-none">
                {hp.bulkBadgeTitle}
              </span>
              <span className="text-xs uppercase font-extrabold tracking-wider mt-1 block opacity-95 text-[#f3ece0]">
                {hp.bulkBadgeText}
              </span>
            </div>
          </div>

        </div>
      </AnimatedSection>

      {/* =========================================================================
          6. QUALITY POLICY BANNER
         ========================================================================= */}
      <AnimatedSection animation="scale-up" delay={250} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#e8dcc4] rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-start gap-4 text-left">
            <div className="p-3 bg-[#f3ece0] text-[#b05d2e] rounded-2xl border border-[#e8dcc4] shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#3d2516]">
                {hp.qualityBannerTitle}
              </h3>
              <p className="text-xs text-[#6d4c41] leading-relaxed mt-1 max-w-2xl">
                {hp.qualityBannerText}
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('about')}
            className="shrink-0 bg-[#603813] hover:bg-[#b05d2e] text-white border border-[#603813] px-6 py-3 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:scale-105"
          >
            {hp.readQualityPolicyBtn}
          </button>
        </div>
      </AnimatedSection>

    </div>
  );
};
