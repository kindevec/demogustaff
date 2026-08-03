import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, RotateCw } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface ReCaptchaWidgetProps {
  onVerify: (verified: boolean) => void;
  verified: boolean;
  lang?: Language;
}

export const ReCaptchaWidget: React.FC<ReCaptchaWidgetProps> = ({ onVerify, verified, lang = 'es' }) => {
  const [loading, setLoading] = useState(false);
  const t = TRANSLATIONS[lang].common;

  const handleCheckboxChange = () => {
    if (verified) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onVerify(true);
    }, 800);
  };

  return (
    <div className="bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl p-3 w-full max-w-full sm:max-w-xs flex items-center justify-between text-[#3d2516] shadow-sm">
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={handleCheckboxChange}
          disabled={verified || loading}
          className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
            verified
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'bg-white border-2 border-[#e8dcc4] hover:border-[#b05d2e]'
          }`}
        >
          {loading && <RotateCw className="w-4 h-4 text-[#b05d2e] animate-spin" />}
          {verified && <CheckCircle2 className="w-5 h-5 text-white" />}
        </button>
        <span className="text-xs font-medium text-[#4a3224]">
          {verified ? t.recaptchaVerified : t.recaptchaNotVerified}
        </span>
      </div>

      <div className="flex flex-col items-center justify-center text-[9px] text-[#8d6e63] pl-2 border-l border-[#e8dcc4]">
        <ShieldCheck className="w-4 h-4 text-[#b05d2e] mb-0.5" />
        <span className="font-bold tracking-tighter text-[#6d4c41]">reCAPTCHA</span>
        <span>{t.recaptchaTerms}</span>
      </div>
    </div>
  );
};
