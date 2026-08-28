import React, { useState } from 'react';
import { Language, ClientProfile } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  Menu, 
  X, 
  UserCircle, 
  PhoneCall,
  Sparkles,
  User
} from 'lucide-react';
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from './SocialIcons';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: Language;
  onOpenAdmin: () => void;
  themeColor?: string;
  isAdmin?: boolean;
  clientProfile?: ClientProfile | null;
}

export const Navbar: React.FC<NavbarProps> = React.memo(({
  currentTab,
  setCurrentTab,
  lang,
  onOpenAdmin,
  themeColor,
  isAdmin = false,
  clientProfile = null
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[lang].nav;

  const navItems = React.useMemo(() => [
    { id: 'home', label: t.home },
    { id: 'products', label: t.products },
    { id: 'industrial', label: t.industrial, badge: t.productionBadge },
    { id: 'about', label: t.about },
    { id: 'recipes', label: t.recipes },
    { id: 'contact', label: t.contact }
  ], [t]);

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md shadow-sm border-b transition-colors duration-500 ease-in-out ${
        themeColor
          ? 'text-white border-white/10'
          : 'bg-white/95 text-[#3d2516] border-[#e8dcc4]'
      }`}
      style={themeColor ? { backgroundColor: themeColor } : {}}
    >
      {/* Top Banner (Hidden on Mobile) */}
      <div className={`hidden md:block text-xs py-1.5 px-4 text-[#f3ece0] border-b transition-colors duration-500 ${themeColor ? 'bg-black/20 border-white/10' : 'bg-[#3d2516] border-[#603813]'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1 font-medium text-[#f3ece0]">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              {t.topBarTagline}
            </span>
            <span className="hidden md:inline text-[#a88c78]">|</span>
            <span className="hidden md:flex items-center gap-1 text-[#d4af37]">
              <PhoneCall className="w-3 h-3" /> {t.topBarPhones}
            </span>
          </div>

          <div className="flex items-center space-x-3">
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <button 
          onClick={() => handleNavClick('home')}
          className="flex items-center shrink-0 group text-left cursor-pointer w-[140px] sm:w-[170px] h-[48px] justify-start overflow-visible"
        >
          <img 
            src="/images/bodegon/logo_gustaff_oficial.png" 
            alt="Gustaff S.A." 
            width={180}
            height={68}
            className="h-[68px] -my-[10px] w-auto object-contain scale-[1.4] lg:scale-100 origin-left group-hover:scale-[1.45] lg:group-hover:scale-105 transition-transform"
          />
        </button>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center space-x-2 shrink-0">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === item.id
                  ? (themeColor ? 'bg-white/20 text-white border-b-2 border-white/60' : 'bg-[#f3ece0] text-[#3d2516] border-b-2 border-[#d4af37]')
                  : (themeColor ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-[#4a3224] hover:text-[#b05d2e] hover:bg-[#f3ece0]/60')
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
        </nav>

        {/* Action Buttons: Client Profile / Login Button (Hidden when logged in as Admin) */}
        {!isAdmin && (
          <div className="hidden lg:flex items-center space-x-3 shrink-0">
            {clientProfile ? (
              <button
                onClick={() => setCurrentTab('profile')}
                className="flex items-center gap-2 bg-[#f3ece0] hover:bg-[#e8dcc4] text-[#603813] font-bold px-4 py-2 rounded-full text-sm border border-[#d4af37]/60 shadow-xs transition-all duration-300 cursor-pointer group"
                title="Ver mi perfil"
              >
                <div className="w-5 h-5 rounded-full bg-[#b05d2e] text-white flex items-center justify-center text-[10px] font-black">
                  {clientProfile.name.charAt(0).toUpperCase()}
                </div>
                <span className="truncate max-w-[120px]">{clientProfile.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentTab('login')}
                className="flex items-center gap-1.5 bg-[#f3ece0] hover:bg-[#e8dcc4] text-[#603813] font-bold px-4 py-2 rounded-full text-sm border border-[#e8dcc4] transition-all duration-300 cursor-pointer"
                title="Acceso de Clientes y Empresas"
              >
                <UserCircle className="w-4 h-4 text-[#b05d2e]" />
                <span>Login</span>
              </button>
            )}
          </div>
        )}

        {/* Mobile Social Icons + User Profile / Login */}
        <div className="lg:hidden flex items-center space-x-2">
          {!isAdmin && (
            <button
              onClick={() => setCurrentTab(clientProfile ? 'profile' : 'login')}
              className="p-2 rounded-xl bg-[#f3ece0] hover:bg-[#e8dcc4] text-[#3d2516] border border-[#e8dcc4] transition-colors flex items-center justify-center cursor-pointer"
              aria-label={clientProfile ? 'Mi Perfil' : 'Login'}
              title={clientProfile ? 'Mi Perfil' : 'Login'}
            >
              {clientProfile ? (
                <div className="w-6 h-6 rounded-full bg-[#b05d2e] text-white flex items-center justify-center text-xs font-black">
                  {clientProfile.name.charAt(0).toUpperCase()}
                </div>
              ) : (
                <UserCircle className="w-6 h-6 text-[#b05d2e]" />
              )}
            </button>
          )}
          <a
            href="https://www.facebook.com/gustaffecu/"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-[#f3ece0] hover:bg-[#e8dcc4] text-[#3d2516] border border-[#e8dcc4] transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Facebook"
          >
            <FacebookIcon size={24} />
          </a>
          <a
            href="https://www.instagram.com/gustaffec/"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-[#f3ece0] hover:bg-[#e8dcc4] text-[#3d2516] border border-[#e8dcc4] transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Instagram"
          >
            <InstagramIcon size={24} />
          </a>
        </div>
      </div>
    </header>
  );
});
