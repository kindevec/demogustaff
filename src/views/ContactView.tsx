import React, { useState, useRef } from 'react';
import { Language, SiteContent } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { ReCaptchaWidget } from '../components/ReCaptchaWidget';
import { uploadContactAttachment, submitContactForm } from '../lib/supabase';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Send, 
  CheckCircle2,
  Paperclip,
  HelpCircle,
  AlertTriangle,
  Smile,
  Info,
  X,
  ChevronDown
} from 'lucide-react';
import { FacebookIcon, InstagramIcon } from '../components/SocialIcons';

interface ContactViewProps {
  siteContent: SiteContent;
  lang: Language;
  onThemeColorChange?: (color: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = React.memo(({ siteContent, lang, onThemeColorChange }) => {
  const [reasonType, setReasonType] = useState<'question' | 'complaint' | 'compliment' | 'quote'>('question');
  const [subReason, setSubReason] = useState('');
  const [message, setMessage] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [country, setCountry] = useState('Ecuador');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Consent checkboxes
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(true);

  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = TRANSLATIONS[lang].contactPage;

  // Sync header theme color to parent (Navbar)
  React.useEffect(() => {
    onThemeColorChange?.('#3A1B12');
    return () => {
      onThemeColorChange?.('');
    };
  }, [onThemeColorChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSizeInBytes = 4 * 1024 * 1024; // 4MB
      if (file.size > maxSizeInBytes) {
        setErrorMsg('El archivo excede el tamaño máximo permitido de 4MB.');
        setAttachedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setErrorMsg('');
      setAttachedFile(file);
    }
  };

  const removeFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!acceptPrivacy) {
      setErrorMsg(t.privacyCheckError);
      return;
    }

    if (!captchaVerified) {
      setErrorMsg(t.recaptchaError);
      return;
    }

    setIsSubmitting(true);

    try {
      const reasonTitle = 
        reasonType === 'question' ? t.reasonQuestion :
        reasonType === 'complaint' ? t.reasonComplaint :
        reasonType === 'compliment' ? t.reasonCompliment : t.reasonQuote;

      let attachmentUrl = '';
      if (attachedFile) {
        const uploadRes = await uploadContactAttachment(attachedFile);
        if (uploadRes.success && uploadRes.url) {
          attachmentUrl = uploadRes.url;
        }
      }

      const fullName = `${firstName} ${lastName}`.trim();
      const submissionRes = await submitContactForm({
        firstName,
        lastName,
        email,
        phone,
        country,
        reasonType: reasonTitle,
        subReason,
        message,
        attachmentUrl,
        acceptPrivacy,
        acceptMarketing
      });

      if (!submissionRes.success) {
        throw new Error(submissionRes.error || t.genericError);
      }

      // Format WhatsApp message including the stored file link
      const waMessage = `*NUEVO MENSAJE DE CONTACTO (GUSTAFF S.A.)*
----------------------------------------
👤 *Nombre:* ${fullName}
📧 *Email:* ${email}
📱 *Teléfono:* ${phone}
🌎 *País:* ${country}
📌 *Motivo:* ${reasonTitle}${subReason ? ` - ${subReason}` : ''}

💬 *Mensaje:*
${message}
${attachmentUrl ? `\n📎 *Archivo Adjunto (Base de Datos):*\n${attachmentUrl}` : ''}
`.trim();

      // Cleanly extract valid WhatsApp phone number (handles "0969718045 (+593 96 971 8045)" cleanly)
      const parseWhatsAppPhone = (phoneStr?: string): string => {
        if (!phoneStr) return '593969718045';
        const digits = phoneStr.replace(/\D/g, '');
        if (digits.includes('969718045')) return '593969718045';
        if (digits.startsWith('593') && digits.length >= 12) return digits.substring(0, 12);
        if (digits.startsWith('09') && digits.length >= 10) return '593' + digits.substring(1, 10);
        if (digits.startsWith('9') && digits.length >= 9) return '593' + digits.substring(0, 9);
        return '593969718045';
      };

      const waPhone = parseWhatsAppPhone(siteContent.contact_whatsapp);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${waPhone}&text=${encodeURIComponent(waMessage)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      setSuccessMsg('¡Mensaje y archivo guardados con éxito en la base de datos! Redirigiendo a WhatsApp...');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setSubReason('');
      setAttachedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setCaptchaVerified(false);
      setAcceptPrivacy(false);
    } catch (err: any) {
      setErrorMsg(err?.message || t.genericError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#fdfaf5] text-[#3d2516] font-sans selection:bg-[#b05d2e] selection:text-white pb-16">
      
      {/* =========================================================================
          1. HEADER BANNER — Edge-to-Edge ProductsView/AboutView Style (DEJADO COMO ESTÁ)
         ========================================================================= */}
      <div className="relative overflow-hidden transition-colors duration-700 ease-in-out h-[520px] sm:h-[620px] lg:h-[700px] bg-[#3A1B12] group mb-12">
        {/* Background Image (Absolute Fill) with smooth page load zoom */}
        <img
          src="/images/bodegon/contactanos.webp"
          alt="Contáctanos Gustaff S.A."
          className="absolute inset-0 w-full h-full object-cover object-center z-0 animate-hero-zoom"
        />
        
        {/* Left Gradient Overlay — Exact ProductsView/AboutView Style */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none" 
          style={{ 
            background: 'linear-gradient(to right, #3A1B12ee 0%, #3A1B12cc 30%, #3A1B1288 50%, transparent 75%)' 
          }} 
        />

        {/* Mobile Bottom Shade */}
        <div className="absolute inset-x-0 bottom-0 h-56 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent sm:hidden pointer-events-none" />

        {/* Text Content Overlay */}
        <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col justify-center text-left space-y-4 sm:space-y-5">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-extrabold tracking-wider uppercase w-fit border border-white/20 shadow-lg bg-[#e86014] text-white">
            <Mail className="w-4 h-4 text-white" />
            <span>{t.bannerBadge}</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight max-w-3xl drop-shadow-lg">
            {t.title}
          </h1>

          {/* Subtitle / Description */}
          <p className="text-sm sm:text-base text-white/80 max-w-xl leading-relaxed drop-shadow-sm font-serif italic border-l-2 border-[#e86014] pl-3">
            "{lang === 'es' ? (siteContent.contact_intro || t.intro) : t.cmsFallback.contact_intro}"
          </p>

        </div>
      </div>

      {/* =========================================================================
          2. SECCIÓN DE CONTENIDO PLASMADO DIRECTAMENTE EN EL LIENZO BLANCO
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Texto Informativo Superior plasmado en lienzo */}
        <div className="text-left space-y-2 max-w-5xl">
          <p className="text-sm sm:text-base text-[#4a3224] leading-relaxed font-sans">
            {t.topNoticeText}
          </p>
          <p className="text-sm text-[#6d4c41]">
            Le invitamos a leer nuestra{' '}
            <a href="#politica-privacidad" className="text-[#b05d2e] hover:text-[#e86014] underline font-semibold transition-colors">
              {t.privacyPolicyNotice}
            </a>
          </p>
        </div>

        <hr className="border-t border-[#e8dcc4]" />

        {/* Layout Principal: 8 columnas formulario + 4 columnas info institucional */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Columna Izquierda: Formulario sin contenedores de bloque */}
          <div className="lg:col-span-8 text-left">
            
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* BLOQUE 1: Déjanos un mensaje */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-light text-[#3d2516] font-sans tracking-tight">
                    {t.leaveMessageHeading}
                  </h2>
                  <p className="text-xs text-red-600 italic mt-1 font-medium">
                    {t.mandatoryFields}
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-bold flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {/* Selección interactiva de razón por la que contacta */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-[#3d2516] font-sans">
                    {t.reasonLabel}
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setReasonType('question')}
                      className={`p-3.5 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                        reasonType === 'question'
                          ? 'bg-[#3d2516] border-[#3d2516] text-white shadow-md'
                          : 'bg-white border-[#d1d5db] text-[#3d2516] hover:border-[#b05d2e] hover:bg-[#fdf5e6]'
                      }`}
                    >
                      <HelpCircle className={`w-4 h-4 ${reasonType === 'question' ? 'text-[#d4af37]' : 'text-[#b05d2e]'}`} />
                      <span>{t.reasonQuestion}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReasonType('complaint')}
                      className={`p-3.5 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                        reasonType === 'complaint'
                          ? 'bg-[#3d2516] border-[#3d2516] text-white shadow-md'
                          : 'bg-white border-[#d1d5db] text-[#3d2516] hover:border-[#b05d2e] hover:bg-[#fdf5e6]'
                      }`}
                    >
                      <AlertTriangle className={`w-4 h-4 ${reasonType === 'complaint' ? 'text-[#d4af37]' : 'text-[#b05d2e]'}`} />
                      <span>{t.reasonComplaint}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReasonType('compliment')}
                      className={`p-3.5 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                        reasonType === 'compliment'
                          ? 'bg-[#3d2516] border-[#3d2516] text-white shadow-md'
                          : 'bg-white border-[#d1d5db] text-[#3d2516] hover:border-[#b05d2e] hover:bg-[#fdf5e6]'
                      }`}
                    >
                      <Smile className={`w-4 h-4 ${reasonType === 'compliment' ? 'text-[#d4af37]' : 'text-[#b05d2e]'}`} />
                      <span>{t.reasonCompliment}</span>
                    </button>
                  </div>
                </div>

                {/* Sub-razón / Desplegable específico */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#3d2516]">
                    {reasonType === 'question' ? `${t.reasonQuestion} *` :
                     reasonType === 'complaint' ? `${t.reasonComplaint} *` :
                     reasonType === 'compliment' ? `${t.reasonCompliment} *` : `${t.reasonQuote} *`}
                  </label>
                  <div className="relative">
                    <select
                      value={subReason}
                      onChange={(e) => setSubReason(e.target.value)}
                      className="w-full bg-white border border-[#d1d5db] text-[#3d2516] rounded-xl p-3.5 text-sm appearance-none focus:outline-none focus:border-[#b05d2e] focus:ring-1 focus:ring-[#b05d2e] transition-all cursor-pointer shadow-sm"
                    >
                      <option value="" disabled>{t.subReasonPlaceholder}</option>
                      <option value={t.subReasonOpt1}>{t.subReasonOpt1}</option>
                      <option value={t.subReasonOpt2}>{t.subReasonOpt2}</option>
                      <option value={t.subReasonOpt3}>{t.subReasonOpt3}</option>
                      <option value={t.subReasonOpt4}>{t.subReasonOpt4}</option>
                      <option value={t.subReasonOpt5}>{t.subReasonOpt5}</option>
                      <option value={t.subReasonOpt6}>{t.subReasonOpt6}</option>
                    </select>
                    <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Mensaje */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#3d2516]">
                    {t.yourMessageLabel}
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.placeholderMessage}
                    className="w-full bg-white border border-[#d1d5db] text-[#3d2516] rounded-xl p-3.5 text-sm placeholder-gray-400 focus:outline-none focus:border-[#b05d2e] focus:ring-1 focus:ring-[#b05d2e] transition-all resize-y shadow-sm"
                  />
                </div>

                {/* ¿Hay algo que quieras adjuntar? */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#3d2516]">{t.attachLabel}</span>
                    <div className="group relative inline-block">
                      <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-[#3d2516] text-white text-[11px] p-2 rounded shadow-xl whitespace-nowrap z-30">
                        Formatos soportados: PDF, JPG, PNG (máx. 4MB)
                      </div>
                    </div>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    className="hidden"
                  />

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2.5 bg-white hover:bg-gray-50 border border-[#d1d5db] text-[#3d2516] text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <Paperclip className="w-4 h-4 text-[#b05d2e]" />
                      <span>{t.attachButton}</span>
                    </button>
                    
                    <span className="text-xs text-gray-500 font-sans">
                      {t.attachMaxLimit}
                    </span>
                  </div>

                  {attachedFile && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#f3ece0] border border-[#e8dcc4] text-[#3d2516] text-xs rounded-lg mt-2">
                      <Paperclip className="w-3.5 h-3.5 text-[#b05d2e]" />
                      <span className="max-w-xs truncate font-medium">{attachedFile.name}</span>
                      <button type="button" onClick={removeFile} className="text-gray-500 hover:text-red-600 ml-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* País */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#3d2516]">
                    {t.countryLabel}
                  </label>
                  <div className="relative">
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-white border border-[#d1d5db] text-[#3d2516] rounded-xl p-3.5 text-sm appearance-none focus:outline-none focus:border-[#b05d2e] focus:ring-1 focus:ring-[#b05d2e] transition-all cursor-pointer shadow-sm"
                    >
                      <option value="Ecuador">Ecuador</option>
                      <option value="Colombia">Colombia</option>
                      <option value="Perú">Perú</option>
                      <option value="Estados Unidos">Estados Unidos</option>
                      <option value="España">España</option>
                      <option value="México">México</option>
                      <option value="Otro">Otro País</option>
                    </select>
                    <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Nombre & Apellido */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#3d2516]">
                      {t.firstNameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={t.placeholderName}
                      className="w-full bg-white border border-[#d1d5db] text-[#3d2516] rounded-xl p-3.5 text-sm placeholder-gray-400 focus:outline-none focus:border-[#b05d2e] focus:ring-1 focus:ring-[#b05d2e] transition-all shadow-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#3d2516]">
                      {t.lastNameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={t.placeholderLastName}
                      className="w-full bg-white border border-[#d1d5db] text-[#3d2516] rounded-xl p-3.5 text-sm placeholder-gray-400 focus:outline-none focus:border-[#b05d2e] focus:ring-1 focus:ring-[#b05d2e] transition-all shadow-sm"
                    />
                  </div>
                </div>

              </div>

              <hr className="border-t border-[#e8dcc4] my-8" />

              {/* BLOQUE 2: Gracias. Por favor indícanos tu correo y teléfono */}
              <div className="space-y-6">
                <h3 className="text-xl sm:text-2xl font-light text-[#3d2516] leading-snug font-sans">
                  {t.secondSectionTitle}
                </h3>

                {/* Correo Electrónico */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#3d2516]">
                    {t.emailLabel}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.placeholderEmail}
                    className="w-full bg-white border border-[#d1d5db] text-[#3d2516] rounded-xl p-3.5 text-sm placeholder-gray-400 focus:outline-none focus:border-[#b05d2e] focus:ring-1 focus:ring-[#b05d2e] transition-all shadow-sm"
                  />
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#3d2516]">
                    {t.phoneGroupLabel}
                  </label>
                  <span className="block text-xs text-gray-500">{t.phoneInputLabel}</span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.placeholderPhone}
                    className="w-full bg-white border border-[#d1d5db] text-[#3d2516] rounded-xl p-3.5 text-sm placeholder-gray-400 focus:outline-none focus:border-[#b05d2e] focus:ring-1 focus:ring-[#b05d2e] transition-all shadow-sm"
                  />
                </div>

                {/* Casillas de Verificación de Consentimiento */}
                <div className="space-y-3.5 pt-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={acceptPrivacy}
                      onChange={(e) => setAcceptPrivacy(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-[#b05d2e] focus:ring-[#b05d2e] bg-white cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm text-[#4a3224] group-hover:text-[#3d2516] transition-colors leading-normal">
                      {t.privacyCheckbox}
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={acceptMarketing}
                      onChange={(e) => setAcceptMarketing(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-[#b05d2e] focus:ring-[#b05d2e] bg-white cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm text-[#4a3224] group-hover:text-[#3d2516] transition-colors leading-normal">
                      {t.marketingCheckbox}
                    </span>
                  </label>
                </div>

                {/* Google reCAPTCHA Protection */}
                <div className="pt-2">
                  <ReCaptchaWidget verified={captchaVerified} onVerify={setCaptchaVerified} lang={lang} />
                </div>

                {/* Botón de Envío */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-10 py-3.5 bg-[#603813] hover:bg-[#3d2516] text-[#fdfaf5] font-bold rounded-xl text-sm tracking-wide transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2.5"
                  >
                    <Send className="w-4 h-4 text-[#d4af37]" />
                    <span>{isSubmitting ? t.sendingBtn : t.sendBtn}</span>
                  </button>
                </div>

              </div>

            </form>

          </div>

          {/* Columna Derecha: Información Institucional y Mapa sin contenedores pesados */}
          <div className="lg:col-span-4 space-y-8 text-left">
            
            {/* Info Card / List */}
            <div className="space-y-6">
              <h3 className="font-serif font-bold text-xl text-[#3d2516] border-b border-[#e8dcc4] pb-4">
                {t.infoTitle}
              </h3>

              <div className="space-y-5 text-xs sm:text-sm text-[#4a3224]">
                
                {/* Dirección */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#f3ece0] text-[#b05d2e] border border-[#e8dcc4] shrink-0 shadow-sm">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#3d2516] mb-0.5">{t.plantAddressLabel}</h4>
                    <p className="leading-relaxed text-[#4a3224]">
                      {lang === 'es' ? (siteContent.contact_address || t.plantAddressFull) : t.cmsFallback.contact_address}
                    </p>
                  </div>
                </div>

                {/* Teléfonos */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#f3ece0] text-[#b05d2e] border border-[#e8dcc4] shrink-0 shadow-sm">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#3d2516] mb-0.5">{t.phonesLabel}</h4>
                    <p className="text-[#4a3224] font-mono text-xs font-semibold">
                      {lang === 'es' ? (siteContent.contact_phones || t.phonesText) : t.cmsFallback.contact_phones}
                    </p>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#f3ece0] text-emerald-600 border border-[#e8dcc4] shrink-0 shadow-sm">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#3d2516] mb-0.5">{t.whatsappLabel}</h4>
                    <p className="text-emerald-700 font-bold font-mono text-xs">
                      {lang === 'es' ? (siteContent.contact_whatsapp || '0969718045 (+593 96 971 8045)') : t.cmsFallback.contact_whatsapp}
                    </p>
                  </div>
                </div>

              </div>

              {/* Enlaces de Redes Sociales */}
              <div className="pt-4 border-t border-[#e8dcc4] space-y-3">
                <h4 className="font-bold text-xs uppercase text-[#b05d2e] tracking-wider">
                  {t.socialFollow}
                </h4>

                <div className="flex flex-col gap-2.5">
                  <a
                    href="https://www.facebook.com/gustaffecu/"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-white hover:bg-[#1877F2]/10 text-[#3d2516] border border-[#e8dcc4] hover:border-[#1877F2]/40 p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-sm group"
                  >
                    <FacebookIcon size={18} className="transition-transform group-hover:scale-110" />
                    <span>{t.facebookLabel}</span>
                  </a>

                  <a
                    href="https://www.instagram.com/gustaffec/"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-white hover:bg-pink-500/10 text-[#3d2516] border border-[#e8dcc4] hover:border-pink-500/40 p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-sm group"
                  >
                    <InstagramIcon size={18} className="transition-transform group-hover:scale-110" />
                    <span>{t.instagramLabel}</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Visual de Ubicación y Mapa en el lienzo */}
            <div className="bg-[#fdf5e6] h-48 rounded-2xl border border-[#e8dcc4] relative overflow-hidden flex flex-col items-center justify-center p-4 text-center shadow-sm">
              <MapPin className="w-8 h-8 text-[#b05d2e] animate-bounce mb-1" style={{ animationIterationCount: 3 }} />
              <p className="font-serif font-bold text-sm text-[#3d2516]">{t.cityCountry}</p>
              <p className="text-[11px] text-[#6d4c41] mt-0.5">{t.plantSublocation}</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
});
