import React, { useState } from 'react';
import { Language, User } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  Lock, 
  User as UserIcon, 
  Globe, 
  Menu, 
  X, 
  FileText, 
  Settings, 
  ChevronRight,
  LogOut,
  PhoneCall,
  Sparkles,
  Database
} from 'lucide-react';
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from './SocialIcons';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenAdmin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[lang].nav;

  const navItems = [
    { id: 'home', label: t.home },
    { id: 'about', label: t.about },
    { id: 'products', label: t.products },
    { id: 'industrial', label: t.industrial, badge: 'B2B' },
    { id: 'recipes', label: t.recipes },
    { id: 'contact', label: t.contact }
  ];

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md text-[#3d2516] shadow-sm border-b border-[#e8dcc4]">
      {/* Top Banner (Hidden on Mobile) */}
      <div className="hidden md:block bg-[#3d2516] text-xs py-1.5 px-4 text-[#f3ece0] border-b border-[#603813]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1 font-medium text-[#f3ece0]">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              GUSTAFF S.A. | Fábrica de Chocolates, Coberturas y Galletas desde 1998
            </span>
            <span className="hidden md:inline text-[#a88c78]">|</span>
            <span className="hidden md:flex items-center gap-1 text-[#d4af37]">
              <PhoneCall className="w-3 h-3" /> Guayaquil: 042255773 / WhatsApp: +593 96 971 8045
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-[#f3ece0] rounded-full p-0.5 border border-[#e8dcc4]">
              <Globe className="w-3 h-3 text-[#b05d2e] ml-1.5 mr-1" />
              <button
                onClick={() => setLang('es')}
                className={`px-2 py-0.5 text-[11px] font-bold rounded-full transition-all ${
                  lang === 'es' ? 'bg-[#603813] text-white' : 'text-[#6d4c41] hover:text-[#3d2516]'
                }`}
              >
                Es
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 text-[11px] font-bold rounded-full transition-all ${
                  lang === 'en' ? 'bg-[#603813] text-white' : 'text-[#6d4c41] hover:text-[#3d2516]'
                }`}
              >
                En
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <button 
          onClick={() => handleNavClick('home')}
          className="flex items-center group text-left"
        >
          <img 
            src="/images/bodegon/logo-gustaff.png" 
            alt="Gustaff S.A." 
            className="h-12 w-auto object-contain group-hover:scale-105 transition-transform"
          />
        </button>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center space-x-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === item.id
                  ? 'bg-[#f3ece0] text-[#3d2516] border-b-2 border-[#d4af37]'
                  : 'text-[#4a3224] hover:text-[#b05d2e] hover:bg-[#f3ece0]/60'
              }`}
            >
              {item.label}
              {item.badge && (
                <span className="bg-[#b05d2e] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full font-mono">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          {/* Downloads Restricted Area */}
          <button
            onClick={() => handleNavClick('downloads')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
              currentTab === 'downloads'
                ? 'bg-[#603813] text-white'
                : 'bg-[#f3ece0] text-[#603813] hover:bg-[#603813] hover:text-white border border-[#e8dcc4]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            {t.downloads}
          </button>
        </nav>

        {/* Action Buttons: User Auth & CMS */}
        <div className="hidden lg:flex items-center space-x-3">
          {currentUser ? (
            <div className="flex items-center gap-2 bg-[#f3ece0] p-1.5 pr-3 rounded-full border border-[#e8dcc4]">
              <div className="w-7 h-7 rounded-full bg-[#603813] text-white font-bold text-xs flex items-center justify-center">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-[#3d2516] truncate max-w-[100px]">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-[#8d6e63]">Cliente Registrado</p>
              </div>
              <button
                onClick={onLogout}
                className="text-[#8d6e63] hover:text-[#b05d2e] ml-1 p-1"
                title="Cerrar Sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 bg-[#603813] hover:bg-[#3d2516] text-white font-semibold px-5 py-2 rounded-full text-sm shadow-md shadow-[#60381333] transition-all transform hover:-translate-y-0.5"
            >
              <UserIcon className="w-4 h-4 text-[#d4af37]" />
              Área Clientes
            </button>
          )}

          {/* CMS Admin Button */}
          <button
            onClick={onOpenAdmin}
            className="p-2 text-[#6d4c41] hover:text-[#3d2516] bg-[#f3ece0] hover:bg-[#e8dcc4] rounded-full border border-[#e8dcc4] transition-colors"
            title="Panel de Administración (CMS)"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="lg:hidden flex items-center space-x-2">
          <button
            onClick={() => handleNavClick('downloads')}
            className="p-2 bg-[#603813] text-white rounded-full text-xs font-bold flex items-center gap-1 shadow-sm"
            title="Descargas PDF"
          >
            <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="text-[10px] uppercase tracking-wider font-extrabold pr-1">PDFs</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-[#f3ece0] text-[#3d2516] border border-[#e8dcc4] focus:outline-none hover:bg-[#e8dcc4] transition-colors"
            aria-label="Menú de Herramientas"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Tools & Portal Drawer (No redundant navigation links) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#fdfaf5] border-b border-[#e8dcc4] px-4 pt-3 pb-6 space-y-4 animate-fadeIn shadow-lg max-h-[85vh] overflow-y-auto">
          {/* Section 1: User Account & Client Area */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#e8dcc4] shadow-sm">
            <div className="text-xs font-bold text-[#b05d2e] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5" />
              <span>Portal de Clientes & Leads</span>
            </div>

            {currentUser ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between bg-[#fdfaf5] p-2.5 rounded-xl border border-[#e8dcc4]">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#603813] text-[#d4af37] font-bold text-xs flex items-center justify-center">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#3d2516]">{currentUser.name}</p>
                      <p className="text-[10px] text-[#8d6e63]">{currentUser.company || 'Cliente Registrado'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="p-1.5 text-xs text-red-700 bg-red-50 hover:bg-red-100 rounded-lg font-semibold flex items-center gap-1"
                    title="Cerrar Sesión"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Salir</span>
                  </button>
                </div>

                <button
                  onClick={() => handleNavClick('downloads')}
                  className="w-full py-2.5 bg-[#603813] text-[#f3ece0] rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                >
                  <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Acceso a Zona de Descargas Técnicas</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[11px] text-[#6d4c41] leading-tight">
                  Regístrese como cliente o prospecto para descargar fichas técnicas de uso industrial.
                </p>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full py-2.5 bg-[#603813] text-white font-bold rounded-xl text-center text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2"
                >
                  <UserIcon className="w-4 h-4 text-[#d4af37]" />
                  <span>Ingreso / Registro Clientes</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 2: Zona de Descargas & Herramientas */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-[#8d6e63] uppercase tracking-wider px-1">
              Herramientas del Sitio
            </p>

            <button
              onClick={() => handleNavClick('downloads')}
              className="w-full text-left p-3 rounded-xl bg-white border border-[#e8dcc4] hover:bg-[#f3ece0] transition-colors flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#603813] text-[#d4af37]">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#3d2516] block">{t.downloads}</span>
                  <span className="text-[10px] text-[#8d6e63]">Catálogo PDF, Fichas Técnicas & Certificaciones</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#b05d2e]" />
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full p-2.5 bg-white border border-[#e8dcc4] rounded-xl hover:bg-[#f3ece0] text-left transition-colors flex items-center gap-2.5 shadow-sm"
            >
              <div className="p-1.5 rounded-lg bg-[#f3ece0] text-[#3d2516]">
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#3d2516] block">Panel CMS Admin</span>
                <span className="text-[10px] text-[#8d6e63]">Administración de catálogo y mensajes</span>
              </div>
            </button>
          </div>

          {/* Section 3: Idioma & Contacto Directo */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#e8dcc4] space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#3d2516] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#b05d2e]" />
                <span>Idioma / Language</span>
              </span>

              <div className="flex items-center bg-[#f3ece0] rounded-full p-1 border border-[#e8dcc4]">
                <button
                  onClick={() => setLang('es')}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                    lang === 'es' ? 'bg-[#603813] text-white' : 'text-[#6d4c41]'
                  }`}
                >
                  Español
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                    lang === 'en' ? 'bg-[#603813] text-white' : 'text-[#6d4c41]'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-[#f3ece0] flex items-center justify-between text-xs">
              <a
                href="tel:042255773"
                className="flex items-center gap-1 text-[#603813] font-semibold hover:underline"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#b05d2e]" />
                <span>042255773</span>
              </a>

              <a
                href="https://wa.me/593969718045"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-emerald-700 font-bold hover:underline"
              >
                <WhatsAppIcon size={16} />
                <span>WhatsApp</span>
              </a>

              <div className="flex items-center gap-2">
                <a
                  href="https://www.facebook.com/gustaffecu/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 rounded-lg hover:bg-blue-50"
                  aria-label="Facebook"
                >
                  <FacebookIcon size={18} />
                </a>
                <a
                  href="https://www.instagram.com/gustaffec/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 rounded-lg hover:bg-pink-50"
                  aria-label="Instagram"
                >
                  <InstagramIcon size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
