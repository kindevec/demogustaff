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
  Lock
} from 'lucide-react';
import { FacebookIcon, InstagramIcon } from './SocialIcons';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab, lang }) => {
  const t = TRANSLATIONS[lang].footer;

  return (
    <footer className="bg-white text-[#6d4c41] border-t border-[#e8dcc4] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#e8dcc4]">
          {/* Col 1: About Brand */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img 
                src="/images/bodegon/logo-gustaff.png" 
                alt="Gustaff S.A." 
                className="h-14 w-auto object-contain"
              />
            </div>

            <p className="text-sm text-[#6d4c41] leading-relaxed">
              En Gustaff somos soñadores, creemos en los nuevos proyectos, en nuestro personal, proveedores y clientes. Fabricando chocolates, coberturas y galletas desde 1998 en Guayaquil, Ecuador.
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
          <div className="space-y-3">
            <h3 className="text-base font-serif font-bold text-[#3d2516] tracking-wide uppercase text-xs">
              Navegación Principal
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { id: 'home', label: 'Inicio' },
                { id: 'about', label: 'Conócenos (Historia 1998)' },
                { id: 'products', label: 'Productos de Consumo' },
                { id: 'industrial', label: 'Catálogo Industrial (12 Ítems)' },
                { id: 'recipes', label: 'Recetas e Inspiración' },
                { id: 'contact', label: 'Contacto y Cotizaciones' },
                { id: 'downloads', label: 'Área Restringida de Descargas' }
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      setCurrentTab(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center text-[#6d4c41] hover:text-[#b05d2e] transition-colors gap-1.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#b05d2e]" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quality & Safety Certifications */}
          <div className="space-y-3">
            <h3 className="text-base font-serif font-bold text-[#3d2516] tracking-wide uppercase text-xs">
              Sistema de Inocuidad & Calidad
            </h3>
            <div className="bg-[#fdf5e6] p-4 rounded-xl border border-[#e8dcc4] space-y-3">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#b05d2e] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#3d2516]">Normas HACCP & BPM</h4>
                  <p className="text-[11px] text-[#6d4c41]">
                    Procesos certificados de seguridad alimentaria e inocuidad en planta.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Award className="w-5 h-5 text-[#b05d2e] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#3d2516]">Estándares Internacionales</h4>
                  <p className="text-[11px] text-[#6d4c41]">
                    Aptos para exportación y maquilas a gran escala.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Plant Address */}
          <div className="space-y-3">
            <h3 className="text-base font-serif font-bold text-[#3d2516] tracking-wide uppercase text-xs">
              Planta Industrial & Contacto
            </h3>
            <ul className="space-y-3 text-xs text-[#6d4c41]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#b05d2e] shrink-0 mt-0.5" />
                <span>
                  Km 8.5 Vía a Daule, Lotización San Francisco Av. Camilo Ponce Mz. 7 Solar 3 (Anterior Mz. 2 Solar 3), Guayaquil, Ecuador
                </span>
              </li>

              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#b05d2e] shrink-0" />
                <span>Call Center: 042255773 / 2264756</span>
              </li>

              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#b05d2e] shrink-0" />
                <span>contacto@gustaff.com.ec</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#8d6e63]">
          <p className="font-medium text-[#8d6e63]">
            Gustaff 2026, todos los derechos reservados.
          </p>

          <div className="flex items-center space-x-6">
            <span className="text-[#8d6e63]">Desarrollado por Kindev</span>
            <button
              onClick={() => {
                setCurrentTab('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#b05d2e] transition-colors"
            >
              Política de Calidad
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
