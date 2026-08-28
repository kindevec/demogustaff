import React, { useState, useEffect } from 'react';
import { 
  User, 
  Building, 
  FileText, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  LogOut, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  ShoppingBag,
  RotateCw,
  AlertCircle,
  Menu,
  X
} from 'lucide-react';
import { ClientProfile, Language } from '../types';
import { getClientSession, updateClientProfile, clientLogout } from '../lib/supabase';

interface ClientProfileViewProps {
  setCurrentTab: (tab: string) => void;
  lang?: Language;
  onLogout?: () => void;
}

export const ClientProfileView: React.FC<ClientProfileViewProps> = ({
  setCurrentTab,
  onLogout
}) => {
  const [profile, setProfile] = useState<ClientProfile | null>(() => getClientSession());
  const [isSaving, setIsSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const session = getClientSession();
    if (session) {
      setProfile(session);
    } else {
      setCurrentTab('login');
    }
  }, [setCurrentTab]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5f0]">
        <div className="flex flex-col items-center gap-4 text-[#8d6e63]">
          <RotateCw className="w-10 h-10 text-[#b05d2e] animate-spin" />
          <p className="text-base font-medium">Cargando panel de cliente...</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: keyof ClientProfile, value: string) => {
    setProfile(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSaving(true);
    setErrorMessage(null);
    setSavedNotice(false);

    const res = await updateClientProfile(profile);
    setIsSaving(false);

    if (res.success && res.data) {
      setProfile(res.data);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 4000);
    } else {
      setErrorMessage(res.error || 'Error al guardar los cambios del perfil.');
    }
  };

  const handleSignOut = async () => {
    await clientLogout();
    if (onLogout) onLogout();
    setCurrentTab('home');
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] flex flex-col md:flex-row font-sans text-[#3d2516]">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-[#e8dcc4] px-5 py-4 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <img
            src="/images/bodegon/logo_gustaff_oficial.png"
            alt="Gustaff S.A."
            className="h-10 w-auto object-contain cursor-pointer"
            onClick={() => setCurrentTab('home')}
          />
          <span className="text-sm font-bold text-[#8d6e63] border-l border-[#e8dcc4] pl-2.5">
            Panel de Clientes
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2.5 rounded-2xl bg-[#fdfaf5] text-[#3d2516] border border-[#e8dcc4]"
          aria-label="Abrir menú"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ================================================================ */}
      {/* LEFT SIDEBAR - PROPORTIONALLY ENLARGED */}
      {/* ================================================================ */}
      <aside className={`w-full md:w-80 lg:w-92 bg-white border-r border-[#e8dcc4] flex flex-col justify-between shadow-sm shrink-0 z-20 ${
        mobileMenuOpen ? 'block' : 'hidden md:flex'
      }`}>
        
        {/* Top Branding & User Summary */}
        <div className="p-7 border-b border-[#e8dcc4]/60 space-y-6">
          {/* Logo (Desktop) */}
          <div 
            onClick={() => setCurrentTab('home')}
            className="hidden md:flex items-center gap-3.5 cursor-pointer group"
            title="Ir a la página principal"
          >
            <img 
              src="/images/bodegon/logo_gustaff_oficial.png" 
              alt="Gustaff S.A." 
              className="h-12 w-auto object-contain transition-transform group-hover:scale-105" 
            />
            <div className="border-l-2 border-[#b05d2e] pl-3">
              <span className="font-black text-base text-[#3d2516] block leading-tight">GUSTAFF</span>
              <span className="text-xs text-[#8d6e63] font-bold uppercase tracking-wider">Portal Clientes</span>
            </div>
          </div>

          {/* Client Card */}
          <div className="bg-[#fdfaf5] p-5 rounded-3xl border border-[#e8dcc4] space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#3d2516] to-[#603813] text-[#f3ece0] flex items-center justify-center text-2xl font-black shadow-sm border border-[#d4af37]/40 shrink-0">
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'C'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base font-black text-[#3d2516] truncate">
                  {profile.name} {profile.lastName || ''}
                </p>
                <p className="text-sm text-[#8d6e63] truncate">
                  {profile.email}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#e8dcc4]/60 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Cliente Verificado</span>
              </span>
              <span className="text-[#a88c78] font-medium">Activo</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Sidebar Center) */}
        <div className="p-5 space-y-2 flex-1 overflow-y-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#a88c78] px-3 mb-3">
            Opciones del Panel
          </p>

          {/* Active Tab: Mi Perfil */}
          <button
            type="button"
            className="w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl bg-[#3d2516] text-white font-black text-base shadow-sm transition-all"
          >
            <User className="w-5 h-5 text-[#d4af37]" />
            <span>Mi Perfil</span>
          </button>
        </div>

        {/* Bottom Sidebar Actions */}
        <div className="p-5 border-t border-[#e8dcc4]/60 space-y-3">
          <button
            type="button"
            onClick={() => setCurrentTab('home')}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-[#fdfaf5] hover:bg-[#f3ece0] text-[#603813] hover:text-[#b05d2e] border border-[#e8dcc4] text-sm font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la Tienda</span>
          </button>

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-sm font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* ================================================================ */}
      {/* RIGHT CONTENT PANEL - 50% ENLARGED SYMMETRICALLY */}
      {/* ================================================================ */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-10 lg:p-14">
        <div className="w-full max-w-6xl space-y-8">
          
          {/* Header a lo largo del contenedor (Aumentado 50%) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e8dcc4]">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#3d2516] tracking-tight flex items-center gap-3.5">
                <User className="w-9 h-9 sm:w-11 sm:h-11 text-[#e86014]" />
                <span>Perfil de Cliente</span>
              </h1>
              <p className="text-sm sm:text-base text-[#8d6e63] mt-2 font-medium">
                Consulta y mantén actualizada tu información de contacto, facturación y despacho.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Términos y Privacidad Aceptados</span>
            </div>
          </div>

          {/* Feedback Notifications */}
          {savedNotice && (
            <div className="p-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-3xl flex items-center gap-3.5 text-base animate-fadeIn shadow-xs font-semibold">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <span>¡Tus datos de perfil han sido guardados exitosamente!</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-5 bg-red-50 border border-red-200 text-red-700 rounded-3xl flex items-center gap-3.5 text-base animate-fadeIn shadow-xs font-semibold">
              <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Formulario en 2 Columnas (Aumentado un 50% de forma simétrica) */}
          <form onSubmit={handleSaveProfile} className="space-y-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              
              {/* COLUMNA IZQUIERDA: Apartado 1 - Información Personal y de Contacto */}
              <div className="space-y-5">
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#e8dcc4]">
                  <span className="w-3 h-3 rounded-full bg-[#e86014]" />
                  <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-[#603813]">
                    1. Información Personal y de Contacto
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm sm:text-base font-bold text-[#603813] mb-1.5">
                      Nombres / Titular *
                    </label>
                    <div className="relative">
                      <User className="w-5 h-5 text-[#a88c78] absolute left-4 top-4" />
                      <input
                        type="text"
                        required
                        value={profile.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full text-base sm:text-lg pl-12 pr-4 py-3.5 bg-white border border-[#e8dcc4] rounded-2xl font-medium text-[#3d2516] outline-none focus:ring-2 focus:ring-[#e86014] focus:border-[#e86014] transition-all shadow-xs"
                        placeholder="Ej. Juan Carlos"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-bold text-[#603813] mb-1.5">
                      Apellidos
                    </label>
                    <input
                      type="text"
                      value={profile.lastName || ''}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full text-base sm:text-lg px-4 py-3.5 bg-white border border-[#e8dcc4] rounded-2xl font-medium text-[#3d2516] outline-none focus:ring-2 focus:ring-[#e86014] focus:border-[#e86014] transition-all shadow-xs"
                      placeholder="Ej. Pérez Andrade"
                    />
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-bold text-[#603813] mb-1.5">
                      Correo Electrónico (Identificador de Cuenta)
                    </label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-[#a88c78] absolute left-4 top-4" />
                      <input
                        type="email"
                        disabled
                        value={profile.email}
                        className="w-full text-base sm:text-lg pl-12 pr-4 py-3.5 bg-gray-100/90 border border-gray-200 rounded-2xl font-medium text-gray-500 cursor-not-allowed shadow-xs"
                        title="El correo electrónico es el identificador principal de tu cuenta"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-bold text-[#603813] mb-1.5">
                      WhatsApp / Teléfono *
                    </label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-[#a88c78] absolute left-4 top-4" />
                      <input
                        type="tel"
                        required
                        value={profile.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full text-base sm:text-lg pl-12 pr-4 py-3.5 bg-white border border-[#e8dcc4] rounded-2xl font-medium text-[#3d2516] outline-none focus:ring-2 focus:ring-[#e86014] focus:border-[#e86014] transition-all shadow-xs"
                        placeholder="0998506763"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* COLUMNA DERECHA: Apartado 2 - Datos de Facturación y Despacho */}
              <div className="space-y-5">
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#e8dcc4]">
                  <span className="w-3 h-3 rounded-full bg-[#b05d2e]" />
                  <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-[#603813]">
                    2. Datos de Facturación y Despacho <span className="text-xs text-[#a88c78] font-normal lowercase">(opcional)</span>
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm sm:text-base font-bold text-[#603813] mb-1.5">
                      Razón Social / Nombre Comercial
                    </label>
                    <div className="relative">
                      <Building className="w-5 h-5 text-[#a88c78] absolute left-4 top-4" />
                      <input
                        type="text"
                        value={profile.businessName || ''}
                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                        className="w-full text-base sm:text-lg pl-12 pr-4 py-3.5 bg-white border border-[#e8dcc4] rounded-2xl font-medium text-[#3d2516] outline-none focus:ring-2 focus:ring-[#e86014] focus:border-[#e86014] transition-all shadow-xs"
                        placeholder="Ej. Panadería & Confitería Dulces S.A."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-bold text-[#603813] mb-1.5">
                      RUC o Cédula de Identidad
                    </label>
                    <div className="relative">
                      <FileText className="w-5 h-5 text-[#a88c78] absolute left-4 top-4" />
                      <input
                        type="text"
                        value={profile.rucDni || ''}
                        onChange={(e) => handleInputChange('rucDni', e.target.value)}
                        className="w-full text-base sm:text-lg pl-12 pr-4 py-3.5 bg-white border border-[#e8dcc4] rounded-2xl font-medium text-[#3d2516] outline-none focus:ring-2 focus:ring-[#e86014] focus:border-[#e86014] transition-all shadow-xs"
                        placeholder="1790000000001"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-bold text-[#603813] mb-1.5">
                      Dirección de Entrega / Despacho
                    </label>
                    <div className="relative">
                      <MapPin className="w-5 h-5 text-[#a88c78] absolute left-4 top-4" />
                      <input
                        type="text"
                        value={profile.address || ''}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full text-base sm:text-lg pl-12 pr-4 py-3.5 bg-white border border-[#e8dcc4] rounded-2xl font-medium text-[#3d2516] outline-none focus:ring-2 focus:ring-[#e86014] focus:border-[#e86014] transition-all shadow-xs"
                        placeholder="Calle principal y número de local"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-bold text-[#603813] mb-1.5">
                      Ciudad / Provincia
                    </label>
                    <input
                      type="text"
                      value={profile.city || ''}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full text-base sm:text-lg px-4 py-3.5 bg-white border border-[#e8dcc4] rounded-2xl font-medium text-[#3d2516] outline-none focus:ring-2 focus:ring-[#e86014] focus:border-[#e86014] transition-all shadow-xs"
                      placeholder="Quito / Pichincha"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Botones de Acción Ampliados Simétricamente */}
            <div className="pt-8 border-t border-[#e8dcc4] flex flex-col sm:flex-row items-center justify-between gap-5">
              <button
                type="button"
                onClick={() => setCurrentTab('products')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#f3ece0] hover:bg-[#e8dcc4] text-[#603813] font-bold text-base transition-all cursor-pointer shadow-xs"
              >
                <ShoppingBag className="w-5 h-5 text-[#b05d2e]" />
                <span>Explorar Catálogo</span>
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-[#3d2516] hover:bg-[#e86014] text-white font-black text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RotateCw className="w-5 h-5 animate-spin text-[#d4af37]" />
                    <span>Guardando cambios...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 text-[#d4af37]" />
                    <span>Guardar Cambios</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      </main>

    </div>
  );
};
