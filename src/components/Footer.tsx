import React, { useRef, useState, useEffect } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Award, 
  ChevronRight,
  Sparkles,
  Clock,
  PhoneCall,
  Truck
} from 'lucide-react';
import { FacebookIcon, InstagramIcon } from './SocialIcons';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  lang: Language;
}

export const Footer: React.FC<FooterProps> = React.memo(({ setCurrentTab, lang }) => {
  const t = TRANSLATIONS[lang].footer;
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const ribbonItems = React.useMemo(() => [
    { id: 'plant', icon: MapPin, title: t.ourPlant, sub: t.plantSub },
    { id: 'hours', icon: Clock, title: t.openingHours, sub: t.hoursSub },
    { id: 'phones', icon: PhoneCall, title: t.directLines, sub: t.directPhones },
    { id: 'shipping', icon: Truck, title: t.nationalShipping, sub: t.shippingSub }
  ], [t]);

  // Duplicated set for 100% seamless infinite mobile marquee loop
  const mobileDisplayItems = React.useMemo(() => [
    ...ribbonItems,
    ...ribbonItems,
    ...ribbonItems
  ], [ribbonItems]);

  // Slow smooth 100% seamless infinite auto-scroll for mobile location ribbon
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const scrollStep = (now: number) => {
      if (!isPaused && carouselRef.current) {
        const el = carouselRef.current;
        if (el.scrollWidth > el.clientWidth) {
          const delta = now - lastTime;
          if (delta >= 30) { // ~30ms frame interval
            lastTime = now;
            // Width of one full set of items
            const singleSetWidth = el.scrollWidth / 3;
            if (el.scrollLeft >= singleSetWidth) {
              // Seamless invisible reset back by 1 set width
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
  }, [isPaused]);

  return (
    <footer className="bg-white text-[#6d4c41] border-t border-[#e8dcc4]">
      {/* Top Location & Info Ribbon (Orange Banner Carousel on Mobile) */}
      <section className="bg-gradient-to-r from-[#b05d2e] via-[#c26532] to-[#994d23] text-[#fdfaf5] py-6 px-0 sm:px-6 lg:px-8 shadow-xl overflow-hidden">
        
        {/* Mobile Horizontal Seamless Infinite Carousel */}
        <div 
          ref={carouselRef}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="lg:hidden flex overflow-x-auto scrollbar-none gap-4 sm:gap-6 text-center pl-[10px] pr-[10px]"
        >
          {mobileDisplayItems.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div 
                key={`${item.id}-${idx}`}
                className="w-[200px] sm:w-[240px] shrink-0 flex flex-col items-center justify-center text-center space-y-2"
              >
                <div className="w-12 h-12 rounded-full bg-black/20 text-white flex items-center justify-center shrink-0 border border-white/20">
                  <IconComp className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wider text-white">
                    {item.title}
                  </h5>
                  <p className="text-xs text-white/90 font-medium mt-0.5">
                    {item.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Grid Layout (4 columns side-by-side) */}
        <div className="hidden lg:grid max-w-7xl mx-auto lg:grid-cols-4 gap-6 text-center">
          {ribbonItems.map((item) => {
            const IconComp = item.icon;
            return (
              <div 
                key={item.id}
                className="flex flex-col items-center justify-center text-center space-y-2"
              >
                <div className="w-12 h-12 rounded-full bg-black/20 text-white flex items-center justify-center shrink-0 border border-white/20">
                  <IconComp className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wider text-white">
                    {item.title}
                  </h5>
                  <p className="text-xs text-white/90 font-medium mt-0.5">
                    {item.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* Main Footer Links & Info */}
      <div className="pt-6 pb-2 sm:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-12 border-b border-[#e8dcc4]">
            {/* Col 1: About Brand */}
            <div className="space-y-4 text-left">
              <div className="flex items-center">
                <img 
                  src="/images/bodegon/logo_gustaff_oficial.png" 
                  alt="Gustaff S.A." 
                  className="h-14 w-auto object-contain"
                />
              </div>

              <p className="text-sm text-[#6d4c41] leading-relaxed">
                {t.aboutBrandText}
              </p>

              <div className="flex items-center space-x-3 pt-2">
                <a
                  href="https://www.facebook.com/gustaffecu/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-[#f3ece0] hover:bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center transition-all border border-[#e8dcc4] shadow-sm hover:border-[#1877F2]/40 group"
                  aria-label="Facebook Gustaff"
                >
                  <FacebookIcon size={20} className="transition-transform group-hover:scale-110" />
                </a>
                <a
                  href="https://www.instagram.com/gustaffec/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-[#f3ece0] hover:bg-pink-500/10 flex items-center justify-center transition-all border border-[#e8dcc4] shadow-sm hover:border-pink-500/40 group"
                  aria-label="Instagram Gustaff"
                >
                  <InstagramIcon size={20} className="transition-transform group-hover:scale-110" />
                </a>
              </div>
            </div>

            {/* Col 2: Quality & Safety Certifications (Independent Side by Side) */}
            <div className="space-y-3 text-left">
              <h3 className="text-base font-serif font-bold text-[#3d2516] tracking-wide uppercase text-xs">
                {t.qualitySafetyHeader}
              </h3>
              <div className="grid grid-cols-2 gap-4 pt-1.5">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#b05d2e] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#3d2516]">{t.haccpTitle}</h4>
                    <p className="text-[11px] text-[#6d4c41] mt-0.5 leading-snug">
                      {t.haccpDesc}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Award className="w-5 h-5 text-[#b05d2e] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#3d2516]">{t.intlTitle}</h4>
                    <p className="text-[11px] text-[#6d4c41] mt-0.5 leading-snug">
                      {t.intlDesc}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Col 4: Contact & Plant Address */}
            <div className="space-y-3 text-left">
              <h3 className="text-base font-serif font-bold text-[#3d2516] tracking-wide uppercase text-xs">
                {t.plantContactHeader}
              </h3>
              <ul className="space-y-3 text-xs text-[#6d4c41]">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#b05d2e] shrink-0 mt-0.5" />
                  <span>
                    {t.plantAddressFull}
                  </span>
                </li>

                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#b05d2e] shrink-0" />
                  <span>{t.callCenter}</span>
                </li>

                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#b05d2e] shrink-0" />
                  <span>{t.contactEmail}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Legal Copyright */}
          <div className="pt-[10px] pb-[68px] md:pb-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-[#8d6e63]">
            <div className="flex items-center gap-3">
              <p className="font-medium text-[#8d6e63] text-left">
                © {new Date().getFullYear()} Gustaff S.A. Todos los derechos reservados.
              </p>
              <span className="hidden sm:inline text-[#d4af37]">|</span>
              <button
                type="button"
                onClick={() => setCurrentTab('login')}
                className="hover:text-[#b05d2e] underline font-semibold cursor-pointer transition-colors"
              >
                Portal de Clientes
              </button>
            </div>

            <p className="font-medium text-[#8d6e63] text-right shrink-0">
              Desarrollado por <span className="font-bold text-[#b05d2e]">Kindev</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});
