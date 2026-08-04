import React from 'react';
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

  return (
    <footer className="bg-white text-[#6d4c41] border-t border-[#e8dcc4]">
      {/* Top Location & Info Ribbon (Orange Banner at top of Footer) */}
      <section className="bg-gradient-to-r from-[#b05d2e] via-[#c26532] to-[#994d23] text-[#fdfaf5] py-8 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          
          {/* Info Item 1: Location */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-black/20 text-white flex items-center justify-center shrink-0 border border-white/20">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-white">
                {t.ourPlant}
              </h5>
              <p className="text-xs text-white/90 font-medium mt-0.5">
                {t.plantSub}
              </p>
            </div>
          </div>

          {/* Info Item 2: Opening Hours */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-black/20 text-white flex items-center justify-center shrink-0 border border-white/20">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-white">
                {t.openingHours}
              </h5>
              <p className="text-xs text-white/90 font-medium mt-0.5">
                {t.hoursSub}
              </p>
            </div>
          </div>

          {/* Info Item 3: Call Us */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-black/20 text-white flex items-center justify-center shrink-0 border border-white/20">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-white">
                {t.directLines}
              </h5>
              <p className="text-xs text-white/90 font-medium mt-0.5">
                {t.directPhones}
              </p>
            </div>
          </div>

          {/* Info Item 4: Delivery */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-black/20 text-white flex items-center justify-center shrink-0 border border-white/20">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-white">
                {t.nationalShipping}
              </h5>
              <p className="text-xs text-white/90 font-medium mt-0.5">
                {t.shippingSub}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Main Footer Links & Info */}
      <div className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#e8dcc4]">
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

            {/* Col 2: Navigation Links */}
            <div className="space-y-3 text-left">
              <h3 className="text-base font-serif font-bold text-[#3d2516] tracking-wide uppercase text-xs">
                {t.mainNavHeader}
              </h3>
              <ul className="space-y-2 text-sm">
                {[
                  { id: 'home', label: t.navHome },
                  { id: 'about', label: t.navAbout },
                  { id: 'products', label: t.navProducts },
                  { id: 'industrial', label: t.navIndustrial },
                  { id: 'recipes', label: t.navRecipes },
                  { id: 'contact', label: t.navContact },
                  { id: 'downloads', label: t.navDownloads }
                ].map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => {
                        setCurrentTab(link.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex items-center text-[#6d4c41] hover:text-[#b05d2e] transition-colors gap-1.5 cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-[#b05d2e]" />
                      <span>{link.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Quality & Safety Certifications */}
            <div className="space-y-3 text-left">
              <h3 className="text-base font-serif font-bold text-[#3d2516] tracking-wide uppercase text-xs">
                {t.qualitySafetyHeader}
              </h3>
              <div className="bg-[#fdf5e6] p-4 rounded-xl border border-[#e8dcc4] space-y-3">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#b05d2e] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#3d2516]">{t.haccpTitle}</h4>
                    <p className="text-[11px] text-[#6d4c41]">
                      {t.haccpDesc}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Award className="w-5 h-5 text-[#b05d2e] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#3d2516]">{t.intlTitle}</h4>
                    <p className="text-[11px] text-[#6d4c41]">
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
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#8d6e63]">
            <p className="font-medium text-[#8d6e63]">
              {t.rights}
            </p>

            <div className="flex items-center space-x-6">
              <span className="text-[#8d6e63]">{t.developedBy}</span>
              <button
                onClick={() => {
                  setCurrentTab('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#b05d2e] transition-colors cursor-pointer"
              >
                {t.qualityPolicy}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});
