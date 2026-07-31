import React, { useState } from 'react';
import { User, Language } from '../types';
import { registerLead, setLocalUser } from '../lib/supabase';
import { TRANSLATIONS } from '../data/translations';
import { ReCaptchaWidget } from './ReCaptchaWidget';
import { X, Lock, Mail, User as UserIcon, Building, ShieldCheck, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  lang: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, lang }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [password, setPassword] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = TRANSLATIONS[lang].authModal;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!captchaVerified) {
      setErrorMsg('Por favor confirme que no es un robot activando el reCAPTCHA.');
      return;
    }

    if (!email.includes('@')) {
      setErrorMsg('Por favor ingrese un correo electrónico válido.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLogin) {
        // Quick login simulation or Supabase auth
        const user: User = {
          id: `usr-${Date.now()}`,
          name: name || email.split('@')[0],
          email: email,
          company: companyPhone || 'Cliente Gustaff',
          phone: companyPhone,
          role: 'user',
          created_at: new Date().toISOString()
        };
        setLocalUser(user);
        onSuccess(user);
        onClose();
      } else {
        if (!name || !companyPhone) {
          setErrorMsg('Por favor complete todos los campos requeridos para el registro.');
          setIsSubmitting(false);
          return;
        }

        const res = await registerLead({
          name,
          email,
          company_phone: companyPhone,
          password
        });

        if (res.error) {
          setErrorMsg(res.error);
        } else {
          onSuccess(res.user);
          onClose();
        }
      }
    } catch (e) {
      setErrorMsg('Ocurrió un error al procesar su solicitud. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-md bg-white text-[#3d2516] rounded-2xl sm:rounded-3xl shadow-2xl border border-[#e8dcc4] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Header */}
        <div className="bg-[#603813] text-white p-4 sm:p-6 text-center relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#d4af37] text-[#3d2516] mx-auto mb-2 sm:mb-3 flex items-center justify-center font-black font-serif text-xl sm:text-2xl shadow-md">
            G
          </div>

          <h3 className="font-serif font-bold text-lg sm:text-xl text-white">
            {isLogin ? t.loginTitle : t.registerTitle}
          </h3>
          <p className="text-[11px] sm:text-xs text-[#f3ece0] mt-0.5 sm:mt-1">
            Gustaff S.A. | Zona Restringida de Descargas Técnicas
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 text-left overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-[#3d2516] mb-1">
                {t.name} *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#8d6e63] absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Ing. Carlos Mendoza"
                  className="w-full bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#3d2516] placeholder-[#8d6e63] focus:outline-none focus:border-[#b05d2e]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#3d2516] mb-1">
              {t.email} *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8d6e63] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@empresa.com"
                className="w-full bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#3d2516] placeholder-[#8d6e63] focus:outline-none focus:border-[#b05d2e]"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-[#3d2516] mb-1">
                {t.companyPhone} *
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-[#8d6e63] absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  placeholder="Ej: Panificadora Central / 0991234567"
                  className="w-full bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#3d2516] placeholder-[#8d6e63] focus:outline-none focus:border-[#b05d2e]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#3d2516] mb-1">
              {t.password}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8d6e63] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#3d2516] placeholder-[#8d6e63] focus:outline-none focus:border-[#b05d2e]"
              />
            </div>
          </div>

          {/* reCAPTCHA Protection */}
          <div className="pt-2">
            <ReCaptchaWidget verified={captchaVerified} onVerify={setCaptchaVerified} />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#603813] hover:bg-[#3d2516] text-white font-bold py-3 rounded-full text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
          >
            {isSubmitting ? 'Procesando...' : (isLogin ? t.submitLogin : t.submitRegister)}
            <ArrowRight className="w-4 h-4 text-[#d4af37]" />
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg('');
              }}
              className="text-xs text-[#b05d2e] hover:underline font-bold"
            >
              {isLogin ? t.noAccount : t.hasAccount}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
