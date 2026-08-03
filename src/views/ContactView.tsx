import React, { useState } from 'react';
import { Language, SiteContent } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { ReCaptchaWidget } from '../components/ReCaptchaWidget';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  Sparkles,
  Building2
} from 'lucide-react';
import { FacebookIcon, InstagramIcon } from '../components/SocialIcons';

interface ContactViewProps {
  siteContent: SiteContent;
  lang: Language;
}

export const ContactView: React.FC<ContactViewProps> = ({ siteContent, lang }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = TRANSLATIONS[lang].contactPage;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!captchaVerified) {
      setErrorMsg(t.recaptchaError);
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setSuccessMsg(t.successMsg);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setCaptchaVerified(false);
    } catch (err) {
      setErrorMsg(t.genericError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Banner */}
      <div className="bg-[#603813] text-white p-8 sm:p-12 rounded-3xl border border-[#d4af37]/30 shadow-xl text-left space-y-3">
        <span className="text-xs font-bold text-[#d4af37] uppercase tracking-widest bg-white/10 px-3.5 py-1 rounded-full border border-white/20 inline-flex items-center gap-1.5">
          <Mail className="w-4 h-4 text-[#d4af37]" />
          <span>{t.bannerBadge}</span>
        </span>

        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-white">
          {t.title}
        </h1>

        <p className="text-sm sm:text-base text-[#f3ece0] font-medium">
          "{lang === 'es' ? (siteContent.contact_intro || t.intro) : t.cmsFallback.contact_intro}"
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Form Column */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#e8dcc4] shadow-sm space-y-6 text-left">
          <h3 className="font-serif font-bold text-xl text-[#3d2516]">
            {t.formTitle}
          </h3>

          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#3d2516] mb-1">
                {t.name} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.placeholderName}
                className="w-full bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl p-3 text-xs text-[#3d2516] placeholder-[#8d6e63] focus:outline-none focus:border-[#b05d2e]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3d2516] mb-1">
                {t.email} *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.placeholderEmail}
                className="w-full bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl p-3 text-xs text-[#3d2516] placeholder-[#8d6e63] focus:outline-none focus:border-[#b05d2e]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3d2516] mb-1">
                {t.subject} *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t.placeholderSubject}
                className="w-full bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl p-3 text-xs text-[#3d2516] placeholder-[#8d6e63] focus:outline-none focus:border-[#b05d2e]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3d2516] mb-1">
                {t.message} *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.placeholderMessage}
                className="w-full bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl p-3 text-xs text-[#3d2516] placeholder-[#8d6e63] focus:outline-none focus:border-[#b05d2e] resize-none"
              />
            </div>

            {/* Google reCAPTCHA Protection */}
            <div className="pt-2">
              <ReCaptchaWidget verified={captchaVerified} onVerify={setCaptchaVerified} lang={lang} />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#603813] hover:bg-[#3d2516] text-[#fdfaf5] font-bold py-3.5 rounded-full text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Send className="w-4 h-4 text-[#d4af37]" />
              {isSubmitting ? t.sendingBtn : t.sendBtn}
            </button>
          </form>
        </div>

        {/* Contact Information & Map Column */}
        <div className="lg:col-span-5 space-y-6 text-left">
          {/* Info Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8dcc4] shadow-sm space-y-6">
            <h3 className="font-serif font-bold text-xl text-[#3d2516] border-b border-[#e8dcc4] pb-3">
              {t.infoTitle}
            </h3>

            <div className="space-y-4 text-xs text-[#4a3224]">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#f3ece0] text-[#b05d2e] border border-[#e8dcc4] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#3d2516]">{t.plantAddressLabel}</h4>
                  <p className="mt-0.5 leading-relaxed">
                    {lang === 'es' ? (siteContent.contact_address || t.plantAddressFull) : t.cmsFallback.contact_address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#f3ece0] text-[#b05d2e] border border-[#e8dcc4] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#3d2516]">{t.phonesLabel}</h4>
                  <p className="mt-0.5">{lang === 'es' ? (siteContent.contact_phones || t.phonesText) : t.cmsFallback.contact_phones}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#f3ece0] text-emerald-600 border border-[#e8dcc4] shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#3d2516]">{t.whatsappLabel}</h4>
                  <p className="mt-0.5 text-emerald-700 font-bold">{lang === 'es' ? (siteContent.contact_whatsapp || '0969718045 (+593 96 971 8045)') : t.cmsFallback.contact_whatsapp}</p>
                </div>
              </div>
            </div>

            {/* Required Social Networks Links */}
            <div className="pt-4 border-t border-[#e8dcc4] space-y-3">
              <h4 className="font-bold text-xs uppercase text-[#b05d2e] tracking-wider">
                {t.socialFollow}
              </h4>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <a
                  href="https://www.facebook.com/gustaffecu/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:flex-1 bg-[#fdfaf5] hover:bg-[#1877F2]/10 text-[#3d2516] border border-[#e8dcc4] hover:border-[#1877F2]/40 p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-sm group"
                >
                  <FacebookIcon size={20} className="transition-transform group-hover:scale-110" />
                  <span>{t.facebookLabel}</span>
                </a>

                <a
                  href="https://www.instagram.com/gustaffec/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:flex-1 bg-[#fdfaf5] hover:bg-pink-500/10 text-[#3d2516] border border-[#e8dcc4] hover:border-pink-500/40 p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-sm group"
                >
                  <InstagramIcon size={20} className="transition-transform group-hover:scale-110" />
                  <span>{t.instagramLabel}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Map Visual */}
          <div className="bg-white rounded-3xl p-4 border border-[#e8dcc4] shadow-sm text-center space-y-2">
            <div className="bg-[#fdf5e6] h-44 rounded-2xl border border-[#e8dcc4] relative overflow-hidden flex flex-col items-center justify-center p-4">
              <MapPin className="w-8 h-8 text-[#b05d2e] animate-bounce mb-1" />
              <p className="font-serif font-bold text-sm text-[#3d2516]">{t.cityCountry}</p>
              <p className="text-[11px] text-[#6d4c41]">{t.plantSublocation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
