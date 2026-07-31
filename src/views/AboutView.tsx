import React from 'react';
import { Language, SiteContent } from '../types';
import { TRANSLATIONS } from '../data/translations';
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
  Users
} from 'lucide-react';

interface AboutViewProps {
  siteContent: SiteContent;
  lang: Language;
}

export const AboutView: React.FC<AboutViewProps> = ({ siteContent, lang }) => {
  const t = TRANSLATIONS[lang].aboutPage;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header Banner */}
      <div className="bg-[#603813] text-white p-8 sm:p-12 rounded-3xl border border-[#d4af37]/30 shadow-xl text-center space-y-4 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 bg-white/10 text-[#d4af37] px-4 py-1.5 rounded-full border border-white/20 text-xs font-bold uppercase tracking-wider">
          <Calendar className="w-4 h-4 text-[#d4af37]" />
          <span>Trayectoria Industrial desde 1998</span>
        </div>

        <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-white">
          {siteContent.about_title}
        </h1>

        <p className="text-xs sm:text-sm text-[#f3ece0] max-w-2xl mx-auto">
          Conoce el origen, misión, visión y principios de calidad que impulsan el desarrollo de chocolates, coberturas y galletas de Gustaff S.A. en Ecuador.
        </p>
      </div>

      {/* History Section */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e8dcc4] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-4 text-left">
          <div className="flex items-center space-x-2 text-[#b05d2e] font-bold text-xs uppercase tracking-widest">
            <History className="w-4 h-4" />
            <span>Reseña Histórica</span>
          </div>

          <h2 className="font-serif font-bold text-2xl text-[#3d2516]">
            Historia y Crecimiento Industrial
          </h2>

          <div className="text-xs sm:text-sm text-[#4a3224] leading-relaxed space-y-3 whitespace-pre-line bg-[#fdfaf5] p-6 rounded-2xl border border-[#e8dcc4]">
            {siteContent.about_history}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <img
            src="/images/bodegon/CHOCOBANANO.jpg"
            alt="Fábrica Gustaff S.A."
            className="rounded-2xl object-cover h-80 w-full shadow-md border border-[#e8dcc4]"
          />

          <div className="bg-[#fdfaf5] p-4 rounded-xl border border-[#e8dcc4] flex items-center gap-3 text-xs text-[#3d2516]">
            <MapPin className="w-5 h-5 text-[#b05d2e] shrink-0" />
            <span>
              Ubicación Actual: Km 8.5 vía a Daule, Lotización San Francisco Av. Camilo Ponce Mz. 7 Solar 3, Guayaquil, Ecuador.
            </span>
          </div>
        </div>
      </section>

      {/* Mission & Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mission Card */}
        <div className="bg-white p-8 rounded-3xl border border-[#e8dcc4] shadow-sm space-y-4 text-left">
          <div className="w-12 h-12 rounded-2xl bg-[#f3ece0] text-[#b05d2e] flex items-center justify-center border border-[#e8dcc4]">
            <Target className="w-6 h-6" />
          </div>

          <h3 className="font-serif font-bold text-2xl text-[#3d2516]">
            {t.misionTitle}
          </h3>

          <div className="text-xs sm:text-sm text-[#4a3224] leading-relaxed bg-[#fdfaf5] p-5 rounded-2xl border border-[#e8dcc4] whitespace-pre-line">
            {siteContent.about_mision}
          </div>
        </div>

        {/* Vision Card */}
        <div className="bg-white p-8 rounded-3xl border border-[#e8dcc4] shadow-sm space-y-4 text-left">
          <div className="w-12 h-12 rounded-2xl bg-[#f3ece0] text-[#b05d2e] flex items-center justify-center border border-[#e8dcc4]">
            <Eye className="w-6 h-6" />
          </div>

          <h3 className="font-serif font-bold text-2xl text-[#3d2516]">
            {t.visionTitle}
          </h3>

          <div className="text-xs sm:text-sm text-[#4a3224] leading-relaxed bg-[#fdfaf5] p-5 rounded-2xl border border-[#e8dcc4] whitespace-pre-line">
            {siteContent.about_vision}
          </div>
        </div>
      </div>

      {/* Quality Policy Highlighted Block */}
      <section className="bg-[#603813] text-white rounded-3xl p-8 sm:p-12 border-2 border-[#d4af37] shadow-xl relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <ShieldCheck className="w-64 h-64 text-[#d4af37]" />
        </div>

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#d4af37] text-[#3d2516] font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider shadow-md">
            <Award className="w-4 h-4" />
            <span>Documento Oficial - Política de Calidad</span>
          </div>

          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-white">
            {t.qualityTitle}
          </h2>

          <div className="text-xs sm:text-base text-[#fdfaf5] leading-relaxed font-sans bg-white/10 p-6 sm:p-8 rounded-2xl border border-white/20 whitespace-pre-line">
            {siteContent.about_politica_calidad}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold text-[#d4af37] pt-2">
            <div className="flex items-center gap-2 bg-white/10 p-3 rounded-xl border border-white/20 text-white">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>Alimentos Inocuos & Auténticos</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 p-3 rounded-xl border border-white/20 text-white">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>Normas Ecuatorianas e Internacionales</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 p-3 rounded-xl border border-white/20 text-white">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>Sistema de Gestión de Calidad HACCP/BPM</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
