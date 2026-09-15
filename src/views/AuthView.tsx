import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Building, 
  FileText, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Sparkles,
  LogIn,
  UserPlus,
  RotateCw,
  ExternalLink
} from 'lucide-react';
import { ClientProfile, Language, SiteContent } from '../types';
import { clientLogin, clientRegister, adminLogin, fetchSiteContent, getStoredSiteContent } from '../lib/supabase';
import { ReCaptchaWidget } from '../components/ReCaptchaWidget';

interface AuthViewProps {
  setCurrentTab: (tab: string) => void;
  lang?: Language;
  onSuccess: (user: ClientProfile, isAdmin?: boolean) => void;
  initialMode?: 'login' | 'register';
  siteContent?: SiteContent;
}

export const AuthView: React.FC<AuthViewProps> = ({
  setCurrentTab,
  lang = 'es',
  onSuccess,
  initialMode = 'login',
  siteContent
}) => {
  const [activeMode, setActiveMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Terms PDF url
  const termsUrl = siteContent?.terms_document_url || getStoredSiteContent().terms_document_url || '/docs/Terminos_y_Condiciones_Gustaff.pdf';

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form State (Unified Natural Person + Business)
  const [regName, setRegName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regBusinessName, setRegBusinessName] = useState('');
  const [regRucDni, setRegRucDni] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | undefined>(undefined);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage('Por favor ingrese su correo electrónico y contraseña.');
      return;
    }

    setLoading(true);
    const res = await clientLogin(loginEmail, loginPassword);
    setLoading(false);

    if (res.success && res.user) {
      const isAdminUser = Boolean(res.isAdmin || res.user.role === 'admin');
      setSuccessMessage(`¡Bienvenido de nuevo, ${res.user.name}!`);
      onSuccess(res.user, isAdminUser);
      setTimeout(() => {
        if (isAdminUser) {
          setCurrentTab('admin');
        } else {
          setCurrentTab('profile');
        }
      }, 350);
    } else {
      setErrorMessage(res.error || 'Credenciales no válidas. Verifique su correo y contraseña.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMessage('Por favor complete los campos obligatorios (Nombre, Correo y Contraseña).');
      return;
    }

    if (regPassword.length < 4) {
      setErrorMessage('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Las contraseñas no coinciden. Por favor verifíquelas.');
      return;
    }

    if (!acceptTerms) {
      setErrorMessage('Debe aceptar los Términos y condiciones de privacidad para continuar.');
      return;
    }

    if (!recaptchaVerified) {
      setErrorMessage('Por favor complete la verificación de seguridad reCAPTCHA.');
      return;
    }

    setLoading(true);
    const res = await clientRegister({
      name: regName.trim(),
      lastName: regLastName.trim(),
      businessName: regBusinessName.trim(),
      rucDni: regRucDni.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      address: regAddress.trim(),
      city: regCity.trim(),
      password: regPassword,
      termsAccepted: true
    });
    setLoading(false);

    if (res.success && res.user) {
      setSuccessMessage('¡Cuenta creada exitosamente! Redirigiendo a tu perfil...');
      setTimeout(() => {
        onSuccess(res.user!, false);
        setCurrentTab('profile');
      }, 600);
    } else {
      setErrorMessage(res.error || 'Ocurrió un error al registrar la cuenta.');
    }
  };

  return (
    <div className="h-screen w-screen bg-[#1e130c] flex flex-col md:flex-row overflow-hidden fixed inset-0 z-[200]">
      
      {/* Left Panel - Image Section (Empaque al Toque Style) */}
      <div className="hidden md:block flex-1 h-full relative overflow-hidden bg-[#1e130c]">
        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <button
            type="button"
            onClick={() => setCurrentTab('home')}
            className="w-11 h-11 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/70 transition-all text-white cursor-pointer shadow-lg hover:scale-105 border border-white/20"
            title="Volver al sitio web"
            aria-label="Volver al sitio web"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Brand Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 z-1 pointer-events-none" />

        {/* Brand Image */}
        <img
          src="/images/login_chocolate_bg.webp"
          alt="Gustaff S.A. - Coberturas y Chocolates Finos"
          className="w-full h-full object-cover select-none filter brightness-95"
        />

        {/* Bottom branding caption */}
        <div className="absolute bottom-8 sm:bottom-12 left-8 sm:left-12 right-8 sm:right-12 z-10 text-white max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#d4af37] text-[#3d2516] px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase shadow-xl mb-4">
            <Sparkles className="w-4 h-4 text-[#3d2516]" />
            <span>Portal de Clientes & Empresas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight drop-shadow-2xl text-white">
            ¡Bienvenido a <span className="text-[#e86014]">Gustaff</span>!
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-200 mt-3 font-sans leading-relaxed drop-shadow-lg max-w-xl">
            Tu espacio exclusivo para gestionar tu información, acceder a cotizaciones industriales, catálogo de coberturas y materias primas de cacao fino de aroma.
          </p>
        </div>
      </div>

      {/* Right Panel - Form Section (Dimensionado al 38-44% de pantalla con scroll suave) */}
      <div className="w-full md:w-[46%] lg:w-[42%] xl:w-[38%] md:min-w-[480px] lg:min-w-[530px] shrink-0 h-full flex flex-col justify-between bg-white p-6 sm:p-10 lg:p-12 overflow-y-auto relative shadow-2xl z-20">
        
        {/* Mobile Back Button */}
        <div className="absolute top-6 left-6 md:hidden z-10">
          <button
            type="button"
            onClick={() => setCurrentTab('home')}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all text-gray-700 cursor-pointer shadow-xs"
            title="Volver"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="w-full max-w-[430px] sm:max-w-[470px] mx-auto my-auto py-4">
          
          {/* Logo Oficial Gustaff Maximizado y Centrado */}
          <div className="flex justify-center items-center mb-6">
            <img
              src="/images/bodegon/logo_gustaff_oficial.webp"
              alt="Gustaff S.A."
              className="h-20 sm:h-24 w-auto max-w-[260px] object-contain drop-shadow-xs transition-transform hover:scale-105 duration-200"
            />
          </div>

          {/* Encabezado del Formulario */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-[#3d2516] tracking-tight">
              {activeMode === 'login' ? 'Acceso al Portal' : 'Registro de Cliente / Empresa'}
            </h1>
            <p className="text-[#8d6e63] text-xs sm:text-sm font-medium mt-1">
              {activeMode === 'login'
                ? 'Ingresa tus credenciales para administrar tu perfil'
                : 'Completa tus datos personales o empresariales en un solo paso'}
            </p>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-2xl flex items-center gap-2.5 shadow-2xs animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-2xl flex items-center gap-2.5 shadow-2xs animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ================================================================ */}
          {/* LOGIN FORM */}
          {/* ================================================================ */}
          {activeMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#603813] uppercase tracking-wider mb-1.5 text-left">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#a88c78] absolute left-4 top-4" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="correo@ejemplo.com o admin@gustaff.ec"
                    className="w-full text-sm pl-11 pr-4 py-3.5 bg-[#fdfaf5] border border-[#e8dcc4] rounded-2xl font-medium text-[#3d2516] outline-none focus:ring-2 focus:ring-[#e86014] focus:bg-white transition-all shadow-2xs"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#603813] uppercase tracking-wider text-left">
                    Contraseña
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#a88c78] absolute left-4 top-4" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-sm pl-11 pr-11 py-3.5 bg-[#fdfaf5] border border-[#e8dcc4] rounded-2xl font-medium text-[#3d2516] outline-none focus:ring-2 focus:ring-[#e86014] focus:bg-white transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 p-1 text-gray-400 hover:text-gray-700 cursor-pointer transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 text-xs text-[#8d6e63] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#e86014] border-[#e8dcc4] rounded focus:ring-[#e86014] cursor-pointer"
                  />
                  <span>Recordar mi sesión</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3d2516] hover:bg-[#e86014] text-white py-3.5 sm:py-4 px-6 rounded-2xl font-black text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-xl hover:scale-[1.01] active:scale-95 cursor-pointer flex items-center justify-center gap-2 mt-3 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-[#d4af37]" />
                    <span>Verificando...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 text-[#d4af37]" />
                    <span>Ingresar al Portal</span>
                  </>
                )}
              </button>

              <div className="pt-4 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-500 mb-2">
                  ¿Eres nuevo cliente o empresa?
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('register');
                    setErrorMessage(null);
                  }}
                  className="w-full py-2.5 px-4 bg-[#f3ece0] hover:bg-[#e8dcc4] text-[#603813] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#b05d2e]" />
                  <span>Crear Cuenta Nueva</span>
                </button>
              </div>
            </form>
          )}

          {/* ================================================================ */}
          {/* UNIFIED REGISTRATION FORM (NATURAL PERSON & BUSINESS) */}
          {/* ================================================================ */}
          {activeMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              
              {/* Nombres y Apellidos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#603813] uppercase tracking-wider mb-1">
                    Nombres / Titular *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-[#a88c78] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Ej. Juan Carlos"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2.5 bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl font-medium text-[#3d2516] outline-none focus:ring-2 focus:ring-[#e86014] focus:bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#603813] uppercase tracking-wider mb-1">
                    Apellidos
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Pérez Andrade"
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl font-medium text-[#3d2516] outline-none focus:ring-2 focus:ring-[#e86014] focus:bg-white"
                  />
                </div>
              </div>

              {/* Razón Social y RUC/Cédula */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#603813] uppercase tracking-wider mb-1">
                    Razón Social / Empresa <span className="text-[10px] text-[#a88c78] font-normal">(Opcional)</span>
                  </label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 text-[#a88c78] absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Ej. Panadería Delicia S.A."
                      value={regBusinessName}
                      onChange={(e) => setRegBusinessName(e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2.5 bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl font-medium text-[#3d2516] outline-none focus:ring-2 focus:ring-[#e86014] focus:bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#603813] uppercase tracking-wider mb-1">
                    RUC o Cédula <span className="text-[10px] text-[#a88c78] font-normal">(Opcional)</span>
                  </label>
                  <div className="relative">
                    <FileText className="w-3.5 h-3.5 text-[#a88c78] absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="1790000000001"
                      value={regRucDni}
                      onChange={(e) => setRegRucDni(e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2.5 bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl font-medium text-[#3d2516] outline-none focus:ring-2 focus:ring-[#e86014] focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Correo y Teléfono */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#603813] uppercase tracking-wider mb-1">
                    Correo Electrónico *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-[#a88c78] absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="tu@correo.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2.5 bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl font-medium text-[#3d2516] outline-none focus:ring-2 focus:ring-[#e86014] focus:bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#603813] uppercase tracking-wider mb-1">
                    WhatsApp / Teléfono *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-[#a88c78] absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="0998506763"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2.5 bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl font-medium text-[#3d2516] outline-none focus:ring-2 focus:ring-[#e86014] focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Dirección y Ciudad */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#603813] uppercase tracking-wider mb-1">
                    Dirección de Entrega
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-[#a88c78] absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Calle y número"
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2.5 bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl font-medium text-[#3d2516] outline-none focus:ring-2 focus:ring-[#e86014] focus:bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#603813] uppercase tracking-wider mb-1">
                    Ciudad / Provincia
                  </label>
                  <input
                    type="text"
                    placeholder="Quito / Guayaquil"
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl font-medium text-[#3d2516] outline-none focus:ring-2 focus:ring-[#e86014] focus:bg-white"
                  />
                </div>
              </div>

              {/* Contraseña y Confirmación */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#603813] uppercase tracking-wider mb-1">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-[#a88c78] absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full text-xs pl-8 pr-7 py-2.5 bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl font-medium text-[#3d2516] outline-none focus:ring-2 focus:ring-[#e86014] focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#603813] uppercase tracking-wider mb-1">
                    Confirmar Contraseña *
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-[#a88c78] absolute left-3 top-3" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full text-xs pl-8 pr-7 py-2.5 bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl font-medium text-[#3d2516] outline-none focus:ring-2 focus:ring-[#e86014] focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Casilla de Términos y Condiciones de Privacidad (Con Enlace Redireccionable a PDF) */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 text-xs text-[#603813] cursor-pointer select-none bg-[#fdfaf5] p-3 rounded-xl border border-[#e8dcc4]">
                  <input
                    type="checkbox"
                    required
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-[#e86014] border-[#e8dcc4] rounded focus:ring-[#e86014] cursor-pointer shrink-0"
                  />
                  <span className="leading-snug">
                    Acepto los{' '}
                    <a
                      href={termsUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#b05d2e] hover:text-[#e86014] font-black underline inline-flex items-center gap-1 transition-colors"
                      title="Abrir Términos y Condiciones en PDF"
                    >
                      Términos y condiciones de privacidad
                      <ExternalLink className="w-3 h-3 inline-block" />
                    </a>
                    {' '}para el uso y tratamiento de mis datos.
                  </span>
                </label>
              </div>

              {/* reCAPTCHA Widget Verification */}
              <div className="pt-1">
                <ReCaptchaWidget
                  onVerify={(verified, token) => {
                    setRecaptchaVerified(verified);
                    setRecaptchaToken(token);
                  }}
                  verified={recaptchaVerified}
                  lang={lang}
                />
              </div>

              {/* Botón de Registro */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#b05d2e] to-[#e86014] hover:from-[#9c4f24] hover:to-[#d0530e] text-white py-3.5 px-6 rounded-2xl font-black text-sm transition-all duration-200 shadow-md hover:shadow-xl hover:scale-[1.01] active:scale-95 cursor-pointer flex items-center justify-center gap-2 mt-3 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-white" />
                    <span>Guardando y creando cuenta...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 text-white" />
                    <span>Crear Cuenta y Continuar</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('login');
                    setErrorMessage(null);
                  }}
                  className="text-xs text-[#b05d2e] hover:underline font-bold"
                >
                  ¿Ya tienes una cuenta registrada? Inicia sesión aquí
                </button>
              </div>
            </form>
          )}

          {/* Footer Crédito */}
          <div className="mt-8 text-center select-none pointer-events-none">
            <span className="block font-black text-xs uppercase tracking-[0.25em] text-[#a88c78]/60">
              GUSTAFF S.A.
            </span>
            <span className="block text-[10px] text-[#a88c78]/80 mt-0.5 font-medium">
              Chocolatería Fina & Maquila Industrial • Ecuador
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
