import React, { useState, useRef, useEffect } from 'react';
import { Language, SiteContent } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { AnimatedSection } from '../../components/AnimatedSection';
import { 
  Building2, 
  Target, 
  Eye, 
  ShieldCheck, 
  Award, 
  Sparkles,
  Calendar,
  ArrowRight,
  ChevronsDown,
  ChevronsUp,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';

interface MobileAboutViewProps {
  siteContent: SiteContent;
  lang: Language;
  setCurrentTab?: (tab: string) => void;
  onThemeColorChange?: (color: string) => void;
}

export const MobileAboutView: React.FC<MobileAboutViewProps> = React.memo(({ siteContent, lang, setCurrentTab, onThemeColorChange }) => {
  const t = TRANSLATIONS[lang].aboutPage;

  // Sync header theme color to parent (Navbar)
  React.useEffect(() => {
    onThemeColorChange?.('#3A1B12');
    return () => {
      onThemeColorChange?.('');
    };
  }, [onThemeColorChange]);

  // Expandable History Text State
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

  // Interactive 3 Solutions Feature Drawer State
  const [activeSolutionFeature, setActiveSolutionFeature] = useState<number | null>(null);
  const [expandedDetailId, setExpandedDetailId] = useState<number | null>(null);

  const solutionItems = React.useMemo(() => [
    {
      id: 1,
      icon: Target,
      title: t.personalizedTitle,
      desc: t.personalizedDesc
    },
    {
      id: 2,
      icon: Building2,
      title: t.highScaleTitle,
      desc: t.highScaleDesc
    },
    {
      id: 3,
      icon: Award,
      title: t.haccpCertTitle,
      desc: t.haccpCertDesc
    }
  ], [t]);

  // Metrics Auto-Scrolling Carousel State & Ref
  const metricsRef = useRef<HTMLDivElement>(null);
  const [isMetricsPaused, setIsMetricsPaused] = useState(false);

  const metricItems = React.useMemo(() => [
    { value: '25+', label: t.metricYears },
    { value: '100%', label: t.metricCocoa },
    { value: '12+', label: t.metricFormulas },
    { value: '1000+', label: t.metricClients }
  ], [t]);

  const mobileDisplayMetrics = React.useMemo(() => [
    ...metricItems,
    ...metricItems,
    ...metricItems
  ], [metricItems]);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const scrollStep = (now: number) => {
      if (!isMetricsPaused && metricsRef.current) {
        const el = metricsRef.current;
        if (el.scrollWidth > el.clientWidth) {
          const delta = now - lastTime;
          if (delta >= 30) {
            lastTime = now;
            const singleSetWidth = el.scrollWidth / 3;
            if (el.scrollLeft >= singleSetWidth) {
              el.scrollLeft -= singleSetWidth;
            } else {
              el.scrollLeft += 1;
            }
          }
        }
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isMetricsPaused]);

  // Modal State for Misión, Visión and Política de Calidad
  const [activeModal, setActiveModal] = useState<{
    title: string;
    icon: React.ReactNode;
    content: string;
  } | null>(null);

  return (
    <div className="bg-[#fdfaf5] text-[#4a3224] font-sans selection:bg-[#b05d2e] selection:text-white space-y-6 pb-0 -mb-[8px]">
      
      {/* =========================================================================
          1. HERO HEADER SECTION — MOBILE EXCLUSIVE (Identical Design to MobileHomeView)
          - Uniform height (h-[260px] xs:h-[280px] sm:h-[300px])
          - Background image with left gradient overlay
          - Content text aligned strictly to the left (text-left items-start)
         ========================================================================= */}
      <div 
        className="relative overflow-hidden transition-colors duration-700 ease-in-out w-full h-[260px] xs:h-[280px] sm:h-[300px] group bg-[#3A1B12]"
      >
        {/* Full Width Image */}
        <img
          src="/images/bodegon/Conocenos.webp"
          alt="Planta Industrial Gustaff S.A."
          className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700"
        />

        {/* Gradient Shade for High Text Contrast */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none transition-all duration-700" 
          style={{ 
            background: `linear-gradient(to right, #3A1B12fa 0%, #3A1B12d0 45%, #3A1B1277 75%, transparent 100%)` 
          }} 
        />

        <div className="absolute inset-x-0 bottom-0 h-20 z-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

        {/* Left-Aligned Text Content Overlay (Positioned 20px from header) */}
        <div className="relative z-20 h-full w-full px-5 sm:px-8 pt-[20px] flex flex-col justify-start text-left items-start space-y-3 max-w-lg">
          
          {/* Tagline Badge - Left Aligned */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase text-left border border-white/20 shadow-md bg-yellow-400 text-[#3d2516]">
            <Calendar className="w-3.5 h-3.5 text-[#3d2516] shrink-0" />
            <span className="truncate">{t.bannerBadge}</span>
          </div>

          {/* Title Line 1 + Accent - Left Aligned */}
          <h1 className="font-serif font-black text-2xl xs:text-3xl sm:text-4xl text-white leading-tight uppercase text-left drop-shadow-md">
            {lang === 'es' ? (siteContent.about_title || t.historyTitle) : t.historyTitle}
          </h1>

          {/* Description Paragraph - Left Aligned */}
          <p className="text-xs xs:text-sm text-white/90 leading-relaxed font-serif italic border-l-2 border-[#e86014] pl-3 text-left max-w-xs drop-shadow-sm">
            "{t.bannerSubtitle}"
          </p>

          {/* Action Button - Left Aligned */}
          <div className="pt-0 -mt-[5px] text-left">
            <button
              onClick={() => setCurrentTab?.('industrial')}
              className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-bold text-[#3d2516] bg-yellow-400 hover:bg-yellow-300 shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-95"
            >
              <span>Explorar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Main Content Container */}
      <div className="px-4 space-y-10">

        {/* =========================================================================
            2. SECTION 1: QUIÉNES SOMOS (History & Story)
           ========================================================================= */}
        <AnimatedSection animation="fade-up" delay={150}>
          <div className="space-y-4 text-left">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-[#b05d2e] font-bold text-[11px] uppercase tracking-wider bg-[#f3ece0] px-3 py-1 rounded-full border border-[#e8dcc4]">
                <span>{t.sectionBadge}</span>
              </div>
              <h2 className="font-serif font-extrabold text-2xl text-[#3d2516] leading-tight">
                {t.sectionTitle}
              </h2>
            </div>

            {/* Expandable History Paragraph Container */}
            <div className="relative bg-white p-4 rounded-2xl border border-[#e8dcc4] shadow-sm overflow-hidden transition-all duration-500">
              <div 
                className={`text-xs text-[#4a3224] leading-relaxed whitespace-pre-line transition-all duration-500 ${
                  isHistoryExpanded ? 'max-h-none pb-8' : 'max-h-[155px] overflow-hidden'
                }`}
              >
                {lang === 'es' ? siteContent.about_history : t.cmsFallback.about_history}
                {!isHistoryExpanded && <span className="font-bold text-[#b05d2e]"> ...</span>}
              </div>

              {/* Gradient Semi-Opaque Shade & Expand/Collapse Toggle Button */}
              <div 
                className={`absolute inset-x-0 bottom-0 flex items-end justify-center pb-2 z-10 transition-all duration-300 ${
                  isHistoryExpanded 
                    ? 'h-10 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none' 
                    : 'h-20 bg-gradient-to-t from-white via-white/95 to-transparent'
                }`}
              >
                <button
                  onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                  className="pointer-events-auto p-1 text-[#b05d2e] hover:text-[#603813] transition-all cursor-pointer active:scale-90"
                  aria-label={isHistoryExpanded ? "Ver menos" : "Ver más"}
                >
                  {isHistoryExpanded ? (
                    <ChevronsUp className="w-6 h-6" />
                  ) : (
                    <ChevronsDown className="w-6 h-6 animate-bounce" />
                  )}
                </button>
              </div>
            </div>

            {/* Feature Cards Side-by-Side (Reduced vertical height by 10px) */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="h-[125px] py-2 px-2.5 bg-white rounded-2xl border border-[#e8dcc4] shadow-sm flex flex-col items-center justify-center text-center space-y-1">
                <div className="w-9 h-9 rounded-full bg-[#f3ece0] text-[#b05d2e] flex items-center justify-center border border-[#e8dcc4] shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-[#3d2516] leading-tight">
                  {t.thermostableTitle}
                </h4>
                <p className="text-[10px] text-[#6d4c41] leading-tight font-medium">
                  {t.thermostableDesc}
                </p>
              </div>

              <div className="h-[125px] py-2 px-2.5 bg-white rounded-2xl border border-[#e8dcc4] shadow-sm flex flex-col items-center justify-center text-center space-y-1">
                <div className="w-9 h-9 rounded-full bg-[#f3ece0] text-[#b05d2e] flex items-center justify-center border border-[#e8dcc4] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-[#3d2516] leading-tight">
                  {t.haccpTitle}
                </h4>
                <p className="text-[10px] text-[#6d4c41] leading-tight font-medium">
                  {t.haccpDesc}
                </p>
              </div>
            </div>

            {/* Image with floating quote card — Relocated Below Normas HACCP */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#e8dcc4] my-2">
              <img
                src="/images/bodegon/rapichoc_chocobanano_variedad_sabores.webp"
                alt="Historia Gustaff S.A."
                className="w-full h-[260px] object-cover"
                loading="lazy"
              />
              <div className="absolute bottom-3 right-3 bg-white/95 p-3 rounded-2xl shadow-lg border border-[#e8dcc4] max-w-[220px] text-left z-20 backdrop-blur-sm">
                <p className="text-[11px] font-serif italic text-[#603813] leading-snug">
                  {t.quote}
                </p>
                <span className="text-[10px] font-bold text-[#b05d2e] uppercase tracking-wider mt-1 block font-sans">
                  {t.quoteAuthor}
                </span>
              </div>
            </div>

            <div className="pt-1">
              <button
                onClick={() => setCurrentTab?.('industrial')}
                className="bg-[#603813] hover:bg-[#b05d2e] text-white font-bold px-6 py-3 rounded-full text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-xl transition-all cursor-pointer"
              >
                <span>{t.exploreIndustrialBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </AnimatedSection>

        {/* =========================================================================
            3. SECTION 2: METRICS BAR (Unified Single Container Auto-Scrolling Carousel)
           ========================================================================= */}
        <AnimatedSection animation="fade-up" delay={150}>
          <div className="-mx-4 bg-white border-y border-[#e8dcc4] shadow-md py-3.5 overflow-hidden">
            <div 
              ref={metricsRef}
              onTouchStart={() => setIsMetricsPaused(true)}
              onTouchEnd={() => setIsMetricsPaused(false)}
              onMouseEnter={() => setIsMetricsPaused(true)}
              onMouseLeave={() => setIsMetricsPaused(false)}
              className="flex overflow-x-auto scrollbar-none gap-6 text-center pl-[12px] pr-[12px]"
            >
              {mobileDisplayMetrics.map((m, idx) => (
                <div 
                  key={`${m.label}-${idx}`}
                  className="w-[140px] shrink-0 flex flex-col items-center justify-center text-center space-y-0.5 border-r border-[#e8dcc4]/60 last:border-r-0 pr-6"
                >
                  <span className="block font-serif text-3xl font-black text-[#b05d2e]">
                    {m.value}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#3d2516] leading-tight block">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* =========================================================================
            4. SECTION 3: SOLUTIONS BANNER & 3 CARDS (Edge-to-Edge Full Width Banner)
           ========================================================================= */}
        <AnimatedSection animation="fade-up" delay={200}>
          <div className="space-y-4 -mx-4">
            <div className="relative overflow-hidden h-[250px] shadow-lg bg-[#120703] w-full">
              <img
                src="/images/bodegon/Conocenos.webp"
                alt="Planta Industrial Gustaff S.A."
                className="absolute inset-0 w-full h-full object-cover object-center z-0"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/65 to-black/40 z-10 pointer-events-none" />
              <div className="absolute inset-0 z-20 px-6 flex flex-col justify-center items-center text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 bg-[#e86014] text-white px-3.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase shadow-md border border-white/20">
                  <span>{t.solutionsBannerBadge}</span>
                </div>
                <h2 className="font-serif font-extrabold text-2xl text-white drop-shadow-md">
                  {t.solutionsBannerTitle}
                </h2>
                <p className="text-xs text-[#f3ece0] max-w-xs leading-relaxed drop-shadow">
                  {t.solutionsBannerSubtitle}
                </p>
              </div>
            </div>

            {/* Interactive 3 Icon Accordion Drawer Row (Top-aligned items-start, collapse on click) */}
            <div className="px-4">
              <div className="relative flex items-start justify-center gap-[10px] min-h-[52px] w-full">
                {solutionItems.map((item) => {
                  const IconComp = item.icon;
                  const isActive = activeSolutionFeature === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (isActive) {
                          setActiveSolutionFeature(null);
                          setExpandedDetailId(null);
                        } else {
                          setActiveSolutionFeature(item.id);
                        }
                      }}
                      className={`rounded-2xl flex flex-row text-left items-start transition-all duration-500 ease-out cursor-pointer overflow-hidden ${
                        isActive 
                          ? expandedDetailId === item.id
                            ? 'flex-1 bg-white border border-[#b05d2e] shadow-lg p-2.5 h-auto'
                            : 'flex-1 bg-white border border-[#e8dcc4] shadow-md p-1.5 h-13'
                          : 'w-13 h-13 shrink-0 justify-center p-0 bg-transparent border-none shadow-none'
                      }`}
                    >
                      {/* Icon - Always on Left */}
                      <div className={`flex items-center justify-center shrink-0 transition-all ${
                        isActive 
                          ? 'w-10 h-10 rounded-xl bg-[#b05d2e] text-white self-start mt-0.5' 
                          : 'w-13 h-13 rounded-2xl bg-[#f3ece0] text-[#b05d2e] border border-[#e8dcc4] hover:bg-[#e8dcc4]'
                      }`}>
                        <IconComp className="w-5 h-5" />
                      </div>

                      {/* Expanded Content Text - Always to the right of icon */}
                      {isActive && (
                        <div className="flex flex-row items-center justify-between min-w-0 flex-1 ml-2 text-left self-start mt-0.5">
                          <div className="flex flex-col min-w-0 text-left pr-1">
                            <h4 className="font-bold text-[11px] text-[#3d2516] leading-tight truncate uppercase tracking-wider text-left">
                              {item.title}
                            </h4>
                            <p className={`text-[9.5px] text-[#6d4c41] leading-tight mt-0.5 text-left transition-all ${
                              expandedDetailId === item.id ? 'whitespace-normal' : 'line-clamp-2'
                            }`}>
                              {item.desc}
                            </p>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedDetailId(expandedDetailId === item.id ? null : item.id);
                            }}
                            className="p-1 text-[#b05d2e] hover:text-[#603813] transition-transform shrink-0 cursor-pointer active:scale-90 self-start"
                            aria-label="Ver más detalle"
                          >
                            {expandedDetailId === item.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4 animate-bounce" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* =========================================================================
            5. SECTION 4: NUESTROS PILARES FUNDAMENTALES (MISIÓN, VISIÓN, CALIDAD)
           ========================================================================= */}
        <AnimatedSection animation="fade-up" delay={200}>
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[#b05d2e] font-bold text-[10px] uppercase tracking-widest bg-[#f3ece0] px-3 py-1 rounded-full border border-[#e8dcc4]">
                <span>{t.philosophyBadge}</span>
              </div>
              <h2 className="font-serif font-extrabold text-2xl text-[#3d2516]">
                {t.philosophyTitle}
              </h2>
            </div>

            <div className="space-y-3 text-left">
              {/* Row 1: Misión & Visión Side-by-Side (grid-cols-2) */}
              <div className="grid grid-cols-2 gap-3">
                {/* Card 1: Misión */}
                <div className="bg-white p-4 rounded-2xl border border-[#e8dcc4] shadow-sm flex flex-col justify-between space-y-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#f3ece0] text-[#b05d2e] flex items-center justify-center border border-[#e8dcc4] shrink-0">
                        <Target className="w-4 h-4" />
                      </div>
                      <h3 className="font-serif font-bold text-base text-[#3d2516] leading-tight">{t.misionTitle}</h3>
                    </div>
                    <p className="text-[11px] text-[#4a3224] leading-relaxed line-clamp-3">
                      {lang === 'es' ? siteContent.about_mision : t.cmsFallback.about_mision}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveModal({
                      title: t.misionTitle,
                      icon: <Target className="w-6 h-6 text-[#b05d2e]" />,
                      content: lang === 'es' ? siteContent.about_mision : t.cmsFallback.about_mision
                    })}
                    className="pt-2 border-t border-[#e8dcc4] text-[11px] font-bold text-[#b05d2e] hover:text-[#3d2516] flex items-center justify-between cursor-pointer w-full transition-colors mt-auto"
                  >
                    <span>Ver más</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card 2: Visión */}
                <div className="bg-white p-4 rounded-2xl border border-[#e8dcc4] shadow-sm flex flex-col justify-between space-y-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#f3ece0] text-[#b05d2e] flex items-center justify-center border border-[#e8dcc4] shrink-0">
                        <Eye className="w-4 h-4" />
                      </div>
                      <h3 className="font-serif font-bold text-base text-[#3d2516] leading-tight">{t.visionTitle}</h3>
                    </div>
                    <p className="text-[11px] text-[#4a3224] leading-relaxed line-clamp-3">
                      {lang === 'es' ? siteContent.about_vision : t.cmsFallback.about_vision}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveModal({
                      title: t.visionTitle,
                      icon: <Eye className="w-6 h-6 text-[#b05d2e]" />,
                      content: lang === 'es' ? siteContent.about_vision : t.cmsFallback.about_vision
                    })}
                    className="pt-2 border-t border-[#e8dcc4] text-[11px] font-bold text-[#b05d2e] hover:text-[#3d2516] flex items-center justify-between cursor-pointer w-full transition-colors mt-auto"
                  >
                    <span>Ver más</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Row 2: Política de Calidad (Full Width Banner Below) */}
              <div className="bg-white p-4 rounded-2xl border border-[#e8dcc4] shadow-sm flex flex-col justify-between space-y-2.5 w-full">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#f3ece0] text-[#b05d2e] flex items-center justify-center border border-[#e8dcc4] shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <h3 className="font-serif font-bold text-base text-[#3d2516] leading-tight">{t.qualityTitle}</h3>
                  </div>
                  <p className="text-[11px] text-[#4a3224] leading-relaxed line-clamp-3">
                    {lang === 'es' ? siteContent.about_politica_calidad : t.cmsFallback.about_politica_calidad}
                  </p>
                </div>

                <button
                  onClick={() => setActiveModal({
                    title: t.qualityTitle,
                    icon: <ShieldCheck className="w-6 h-6 text-[#b05d2e]" />,
                    content: lang === 'es' ? siteContent.about_politica_calidad : t.cmsFallback.about_politica_calidad
                  })}
                  className="pt-2 border-t border-[#e8dcc4] text-[11px] font-bold text-[#b05d2e] hover:text-[#3d2516] flex items-center justify-between cursor-pointer w-full transition-colors"
                >
                  <span>{t.readFullQuality}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>

      </div>

      {/* Detail Modal Popup */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#fdfaf5] border-2 border-[#e8dcc4] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-left">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#f3ece0] text-[#3d2516] hover:bg-[#e8dcc4] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-[#603813] text-[#d4af37] border border-[#d4af37]/30">
                {activeModal.icon}
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#b05d2e] uppercase tracking-widest block font-mono">
                  {t.docTitle}
                </span>
                <h3 className="font-serif font-bold text-2xl text-[#3d2516]">
                  {activeModal.title}
                </h3>
              </div>
            </div>
            <div className="text-xs text-[#4a3224] leading-relaxed font-sans bg-white p-4 rounded-2xl border border-[#e8dcc4] max-h-[60vh] overflow-y-auto whitespace-pre-line shadow-inner">
              {activeModal.content}
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-[#603813] hover:bg-[#b05d2e] text-white font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider cursor-pointer transition-colors shadow-md"
              >
                {TRANSLATIONS[lang].common.close}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
});
