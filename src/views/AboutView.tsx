import React, { useState } from 'react';
import { Language, SiteContent } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { AnimatedSection } from '../components/AnimatedSection';
import { 
  Building2, 
  History, 
  Target, 
  Eye, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Sparkles,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  X,
  FileText
} from 'lucide-react';

interface AboutViewProps {
  siteContent: SiteContent;
  lang: Language;
  setCurrentTab?: (tab: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ siteContent, lang, setCurrentTab }) => {
  const t = TRANSLATIONS[lang].aboutPage;

  // Modal State for Misión, Visión and Política de Calidad
  const [activeModal, setActiveModal] = useState<{
    title: string;
    icon: React.ReactNode;
    content: string;
  } | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* =========================================================================
          1. HEADER BANNER WITH Conocenos.png BACKGROUND & DIRECTLY SUPERIMPOSED TEXT
         ========================================================================= */}
      <AnimatedSection animation="scale-up">
        <div className="relative h-[320px] sm:h-[380px] lg:h-[420px] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#e8dcc4] bg-[#120703]">
          {/* Background Image (Absolute Fill z-0) */}
          <img
            src="/images/bodegon/Conocenos.png"
            alt="Planta Industrial Gustaff S.A."
            className="absolute inset-0 w-full h-full object-cover object-center z-0"
          />
          
          {/* Dark Gradient Overlay (Absolute Fill z-10) */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 via-60% to-black/35 z-10 pointer-events-none" />

          {/* Text Content Overlay (Absolute Fill z-20) */}
          <div className="absolute inset-0 z-20 max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-center text-left space-y-4">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#e86014] text-white px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase shadow-xl w-fit border border-white/20">
              <Calendar className="w-4 h-4 text-white" />
              <span>Trayectoria Industrial desde 1998</span>
            </div>

            {/* Main Title */}
            <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight max-w-3xl drop-shadow-lg">
              {siteContent.about_title || "La fábrica - Historia Gustaff | desde 1998"}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#fdfaf5] font-serif italic leading-relaxed max-w-2xl drop-shadow">
              Conoce el origen, misión, visión y principios de calidad que impulsan el desarrollo de chocolates, coberturas y galletas de Gustaff S.A. en Ecuador.
            </p>

            {/* Nav Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#e86014] uppercase pt-2 border-t border-white/20 w-fit">
              <button 
                onClick={() => setCurrentTab?.('home')} 
                className="hover:underline cursor-pointer text-[#e86014]"
              >
                INICIO
              </button>
              <span className="text-[#e86014]">&gt;</span>
              <span className="text-[#f3ece0]">CONÓCENOS</span>
            </div>

          </div>
        </div>
      </AnimatedSection>

      {/* =========================================================================
          2. SECTION 1: QUIÉNES SOMOS (Image Left with Floating Badge, Text Right)
         ========================================================================= */}
      <AnimatedSection animation="fade-up" delay={150}>
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-4">
          {/* Left Column: Image with floating quote card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-[#e8dcc4]">
              <img
                src="/images/bodegon/rapichoc_chocobanano_variedad_sabores.jpg"
                alt="Historia Gustaff S.A."
                className="w-full h-[440px] object-cover"
              />
            </div>

            {/* Floating Quote Card */}
            <div className="absolute -bottom-6 -right-4 sm:right-4 bg-white p-5 rounded-3xl shadow-2xl border border-[#e8dcc4] max-w-[270px] text-left z-20">
              <p className="text-xs font-serif italic text-[#603813] leading-relaxed">
                "En Gustaff creemos en los nuevos proyectos, en nuestra gente y en la pureza de cada ingrediente."
              </p>
              <span className="text-[11px] font-bold text-[#b05d2e] uppercase tracking-wider mt-2 block font-sans">
                GUSTAFF S.A. | DESDE 1998
              </span>
            </div>
          </div>

          {/* Right Column: History & Key Points */}
          <div className="lg:col-span-7 space-y-5 text-left pt-0">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-[#b05d2e] font-bold text-xs uppercase tracking-wider bg-[#f3ece0] px-3.5 py-1 rounded-full border border-[#e8dcc4]">
                <span>QUIÉNES SOMOS</span>
              </div>
              <h2 className="font-serif font-extrabold text-3xl sm:text-4xl text-[#3d2516] leading-tight">
                Pasión por el Cacao, Tradición e Innovación Alimentaria
              </h2>
            </div>

            <p className="text-sm text-[#4a3224] leading-relaxed whitespace-pre-line bg-white p-6 rounded-2xl border border-[#e8dcc4] shadow-sm">
              {siteContent.about_history}
            </p>

            {/* Bullet Feature Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-4 rounded-2xl border border-[#e8dcc4] shadow-sm space-y-1">
                <div className="flex items-center gap-2 text-[#b05d2e] font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>Fórmulas Termoestables</span>
                </div>
                <p className="text-xs text-[#6d4c41] leading-relaxed">
                  Desarrollos exclusivos diseñados para resistir temperaturas extremas sin perder aroma ni textura.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#e8dcc4] shadow-sm space-y-1">
                <div className="flex items-center gap-2 text-[#b05d2e] font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Normas HACCP &amp; BPM</span>
                </div>
                <p className="text-xs text-[#6d4c41] leading-relaxed">
                  Garantía total de inocuidad alimentaria y trazabilidad internacional en nuestra planta industrial.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setCurrentTab?.('industrial')}
                className="bg-[#603813] hover:bg-[#b05d2e] text-white font-bold px-7 py-3.5 rounded-full text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>Explorar Productos Industriales</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* =========================================================================
          3. SECTION 2: IMPACT COUNTER METRICS BAR (4 Columns)
         ========================================================================= */}
      <AnimatedSection animation="fade-up" delay={150}>
        <div className="bg-white rounded-3xl p-8 border border-[#e8dcc4] shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#e8dcc4]">
            <div className="text-center p-2">
              <span className="block font-serif text-4xl sm:text-5xl font-black text-[#b05d2e]">25+</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#3d2516] mt-1 block">Años de Trayectoria</span>
            </div>
            <div className="text-center p-2 pt-4 md:pt-2">
              <span className="block font-serif text-4xl sm:text-5xl font-black text-[#b05d2e]">100%</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#3d2516] mt-1 block">Cacao Ecuatoriano</span>
            </div>
            <div className="text-center p-2 pt-4 md:pt-2">
              <span className="block font-serif text-4xl sm:text-5xl font-black text-[#b05d2e]">12+</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#3d2516] mt-1 block">Fórmulas Especializadas</span>
            </div>
            <div className="text-center p-2 pt-4 md:pt-2">
              <span className="block font-serif text-4xl sm:text-5xl font-black text-[#b05d2e]">1000+</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#3d2516] mt-1 block">Clientes &amp; Maquilas</span>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* =========================================================================
          4. SECTION 3: FULL-WIDTH BANNER IMAGE WITH 3 SUPERIMPOSED CARDS OVERLAPPING
         ========================================================================= */}
      <AnimatedSection animation="fade-up" delay={200}>
        <div className="relative pb-16">
          {/* Banner with Conocenos.png background photo & dark contrast overlay */}
          <div className="relative rounded-3xl overflow-hidden h-[340px] sm:h-[380px] shadow-2xl border border-[#e8dcc4] bg-[#120703]">
            <img
              src="/images/bodegon/Conocenos.png"
              alt="Planta Industrial Gustaff S.A."
              className="absolute inset-0 w-full h-full object-cover object-center z-0"
            />

            {/* Dark Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/65 to-black/40 z-10 pointer-events-none" />

            {/* Banner Centered Text Content */}
            <div className="absolute inset-0 z-20 max-w-4xl mx-auto px-6 flex flex-col justify-center items-center text-center space-y-4 pb-12">
              <div className="inline-flex items-center gap-2 bg-[#e86014] text-white px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase shadow-xl border border-white/20">
                <span>TECNOLOGÍA &amp; CAPACIDAD ALIMENTARIA</span>
              </div>

              <h2 className="font-serif font-extrabold text-3xl sm:text-4xl text-white drop-shadow-md">
                Desarrollamos Soluciones Integrales para la Industria Alimentaria
              </h2>

              <p className="text-xs sm:text-sm text-[#f3ece0] max-w-2xl leading-relaxed drop-shadow">
                Abastecemos a industrias confiteras, heladeras, panificadoras y emprendimientos corporativos con empaques en sacos de 25 kg, cajas y pomas de 6 kg.
              </p>
            </div>
          </div>

          {/* 3 Superimposed White Cards Overlapping Bottom Edge of Banner Image */}
          <div className="-mt-16 max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-30">
            <div className="bg-white rounded-2xl p-6 border border-[#e8dcc4] shadow-xl text-left space-y-2 hover:-translate-y-1 transition-transform">
              <div className="p-3 bg-[#f3ece0] text-[#b05d2e] rounded-xl w-fit border border-[#e8dcc4]">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-[#3d2516] uppercase tracking-wider">Atención Personalizada</h4>
              <p className="text-xs text-[#6d4c41] leading-relaxed">
                Desarrollo de fórmulas exclusivas ajustadas al perfil de sabor y viscosidad de cada cliente.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#e8dcc4] shadow-xl text-left space-y-2 hover:-translate-y-1 transition-transform">
              <div className="p-3 bg-[#f3ece0] text-[#b05d2e] rounded-xl w-fit border border-[#e8dcc4]">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-[#3d2516] uppercase tracking-wider">Producción de Alta Escala</h4>
              <p className="text-xs text-[#6d4c41] leading-relaxed">
                Capacidad de respuesta inmediata y despacho a nivel nacional para maquilas y grandes lotes.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#e8dcc4] shadow-lg text-left space-y-2 hover:-translate-y-1 transition-transform">
              <div className="p-3 bg-[#f3ece0] text-[#b05d2e] rounded-xl w-fit border border-[#e8dcc4]">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-[#3d2516] uppercase tracking-wider">Garantía Inocuidad HACCP</h4>
              <p className="text-xs text-[#6d4c41] leading-relaxed">
                Controles de calidad automatizados y laboratorios propios en planta para garantizar pureza.
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* =========================================================================
          5. SECTION 4: CORPORATE PHILOSOPHY & VALUES (Truncated + Modal Popup)
         ========================================================================= */}
      <AnimatedSection animation="fade-up" delay={200}>
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 text-[#b05d2e] font-bold text-xs uppercase tracking-widest bg-[#f3ece0] px-4 py-1 rounded-full border border-[#e8dcc4]">
              <span>FILOSOFÍA CORPORATIVA</span>
            </div>
            <h2 className="font-serif font-extrabold text-3xl sm:text-4xl text-[#3d2516]">
              Nuestros Pilares Fundamentales
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Card 1: Misión */}
            <div className="bg-white p-7 rounded-3xl border border-[#e8dcc4] shadow-sm space-y-4 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#f3ece0] text-[#b05d2e] flex items-center justify-center border border-[#e8dcc4]">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-[#3d2516]">{t.misionTitle}</h3>
                <p className="text-xs sm:text-sm text-[#4a3224] leading-relaxed line-clamp-4">
                  {siteContent.about_mision}
                </p>
              </div>

              <button
                onClick={() => setActiveModal({
                  title: t.misionTitle,
                  icon: <Target className="w-6 h-6" />,
                  content: siteContent.about_mision
                })}
                className="pt-3 border-t border-[#e8dcc4] text-xs font-bold text-[#b05d2e] hover:text-[#3d2516] flex items-center justify-between cursor-pointer w-full transition-colors"
              >
                <span>Leer Misión Completa</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 2: Visión */}
            <div className="bg-white p-7 rounded-3xl border border-[#e8dcc4] shadow-sm space-y-4 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#f3ece0] text-[#b05d2e] flex items-center justify-center border border-[#e8dcc4]">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-[#3d2516]">{t.visionTitle}</h3>
                <p className="text-xs sm:text-sm text-[#4a3224] leading-relaxed line-clamp-4">
                  {siteContent.about_vision}
                </p>
              </div>

              <button
                onClick={() => setActiveModal({
                  title: t.visionTitle,
                  icon: <Eye className="w-6 h-6" />,
                  content: siteContent.about_vision
                })}
                className="pt-3 border-t border-[#e8dcc4] text-xs font-bold text-[#b05d2e] hover:text-[#3d2516] flex items-center justify-between cursor-pointer w-full transition-colors"
              >
                <span>Leer Visión Completa</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 3: Política de Calidad */}
            <div className="bg-white p-7 rounded-3xl border border-[#e8dcc4] shadow-sm space-y-4 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#f3ece0] text-[#b05d2e] flex items-center justify-center border border-[#e8dcc4]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-[#3d2516]">{t.qualityTitle}</h3>
                <p className="text-xs sm:text-sm text-[#4a3224] leading-relaxed line-clamp-4">
                  {siteContent.about_politica_calidad}
                </p>
              </div>

              <button
                onClick={() => setActiveModal({
                  title: t.qualityTitle,
                  icon: <ShieldCheck className="w-6 h-6" />,
                  content: siteContent.about_politica_calidad
                })}
                className="pt-3 border-t border-[#e8dcc4] text-xs font-bold text-[#b05d2e] hover:text-[#3d2516] flex items-center justify-between cursor-pointer w-full transition-colors"
              >
                <span>Leer Política Completa</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* =========================================================================
          6. MODAL POPUP FOR FULL CONTENT (Ventana Emergente)
         ========================================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#fdfaf5] border-2 border-[#e8dcc4] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-left">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-2 text-[#8d6e63] hover:text-[#3d2516] bg-[#f3ece0] hover:bg-[#e8dcc4] rounded-full transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 pr-8">
              <div className="p-3 bg-[#603813] text-[#d4af37] rounded-2xl border border-[#d4af37]/30 shrink-0">
                {activeModal.icon}
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#b05d2e] uppercase tracking-widest block font-mono">
                  DOCUMENTACIÓN CORPORATIVA
                </span>
                <h3 className="font-serif font-bold text-2xl text-[#3d2516]">
                  {activeModal.title}
                </h3>
              </div>
            </div>

            {/* Modal Content Body */}
            <div className="text-sm text-[#4a3224] leading-relaxed font-sans bg-white p-6 rounded-2xl border border-[#e8dcc4] max-h-[60vh] overflow-y-auto whitespace-pre-line shadow-inner">
              {activeModal.content}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-[#603813] hover:bg-[#b05d2e] text-white font-bold px-7 py-3 rounded-full text-xs uppercase tracking-wider cursor-pointer transition-colors shadow-md"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
