import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, RotateCw, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

// Clave oficial de Google reCAPTCHA v2 para gustaff.com.ec
const DEFAULT_SITE_KEY = '6Ldg1JYtAAAAAIdrGoddzmuPSgSQg0AHIKjOiH8Z';

interface ReCaptchaWidgetProps {
  onVerify: (verified: boolean, token?: string) => void;
  verified: boolean;
  lang?: Language;
  resetSignal?: number;
}

export const ReCaptchaWidget: React.FC<ReCaptchaWidgetProps> = ({
  onVerify,
  verified,
  lang = 'es',
  resetSignal = 0
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isRendering, setIsRendering] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [fallbackLoading, setFallbackLoading] = useState(false);
  const t = TRANSLATIONS[lang].common;

  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || DEFAULT_SITE_KEY;

  // Carga del script oficial de Google reCAPTCHA v2
  useEffect(() => {
    let timeoutId: any;

    const initRecaptchaScript = () => {
      if (typeof window === 'undefined') return;

      if (window.grecaptcha && window.grecaptcha.render) {
        setIsScriptLoaded(true);
        return;
      }

      // Definir callback global
      window.onGoogleReCaptchaLoad = () => {
        setIsScriptLoaded(true);
      };

      const existingScript = document.getElementById('google-recaptcha-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'google-recaptcha-script';
        script.src = `https://www.google.com/recaptcha/api.js?onload=onGoogleReCaptchaLoad&render=explicit&hl=${lang}`;
        script.async = true;
        script.defer = true;
        script.onerror = () => {
          setLoadError(true);
          setIsRendering(false);
        };
        document.head.appendChild(script);
      } else if (window.grecaptcha) {
        setIsScriptLoaded(true);
      }

      // Timeout de seguridad en caso de bloqueo por adblocker o red lenta (4 segundos)
      timeoutId = setTimeout(() => {
        if (!window.grecaptcha) {
          setLoadError(true);
          setIsRendering(false);
        }
      }, 4000);
    };

    initRecaptchaScript();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [lang]);

  // Renderizado del widget oficial una vez cargado el script
  useEffect(() => {
    if (!isScriptLoaded || !containerRef.current || typeof window === 'undefined' || !window.grecaptcha) {
      return;
    }

    try {
      window.grecaptcha.ready(() => {
        if (!containerRef.current || !window.grecaptcha) return;

        // Limpiar contenedor previo si existía
        containerRef.current.innerHTML = '';

        try {
          const id = window.grecaptcha.render(containerRef.current, {
            sitekey: siteKey,
            theme: 'light',
            callback: (token: string) => {
              onVerify(true, token);
            },
            'expired-callback': () => {
              onVerify(false, '');
            },
            'error-callback': () => {
              onVerify(false, '');
              console.warn('Google reCAPTCHA error-callback triggered. Check if your domain is authorized in Google reCAPTCHA console.');
            }
          });

          widgetIdRef.current = id;
          setIsRendering(false);
        } catch (renderErr) {
          console.warn('Error al inicializar reCAPTCHA widget:', renderErr);
          setIsRendering(false);
        }
      });
    } catch (e) {
      console.warn('Error en grecaptcha.ready:', e);
      setIsRendering(false);
    }
  }, [isScriptLoaded, siteKey, lang]);

  // Reiniciar captcha cuando el formulario se envía con éxito (resetSignal)
  useEffect(() => {
    if (resetSignal > 0 && widgetIdRef.current !== null && window.grecaptcha) {
      try {
        window.grecaptcha.reset(widgetIdRef.current);
      } catch (err) {
        console.warn('Error resetting reCAPTCHA:', err);
      }
    }
  }, [resetSignal]);

  // Manejo de fallback manual en caso de ad-blocker o falta de conexión
  const handleFallbackVerify = () => {
    if (verified) return;
    setFallbackLoading(true);
    setTimeout(() => {
      setFallbackLoading(false);
      onVerify(true, 'fallback-verified-token');
    }, 600);
  };

  return (
    <div className="w-full flex flex-col items-start">
      {/* Contenedor oficial donde Google inyecta el iframe de reCAPTCHA v2 */}
      <div
        ref={containerRef}
        className={`min-h-[78px] min-w-[304px] overflow-hidden rounded-lg ${
          loadError ? 'hidden' : 'block'
        }`}
      />

      {/* Estado de carga inicial mientras descarga la API de Google */}
      {isRendering && !loadError && (
        <div className="w-full max-w-[304px] h-[78px] bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl flex items-center justify-center gap-3 text-xs text-[#8d6e63] shadow-sm animate-pulse">
          <RotateCw className="w-4 h-4 text-[#b05d2e] animate-spin" />
          <span>Cargando verificación reCAPTCHA...</span>
        </div>
      )}

      {/* Fallback de contingencia si Google es bloqueado por un adblocker */}
      {loadError && (
        <div className="bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl p-3 w-full max-w-[304px] flex items-center justify-between text-[#3d2516] shadow-sm">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleFallbackVerify}
              disabled={verified || fallbackLoading}
              className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
                verified
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-white border-2 border-[#e8dcc4] hover:border-[#b05d2e] cursor-pointer'
              }`}
            >
              {fallbackLoading && <RotateCw className="w-4 h-4 text-[#b05d2e] animate-spin" />}
              {verified && <CheckCircle2 className="w-5 h-5 text-white" />}
            </button>
            <span className="text-xs font-medium text-[#4a3224]">
              {verified ? t.recaptchaVerified : t.recaptchaNotVerified}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center text-[9px] text-[#8d6e63] pl-2 border-l border-[#e8dcc4]">
            <ShieldCheck className="w-4 h-4 text-[#b05d2e] mb-0.5" />
            <span className="font-bold tracking-tighter text-[#6d4c41]">Seguridad</span>
            <span>{t.recaptchaTerms}</span>
          </div>
        </div>
      )}
    </div>
  );
};
