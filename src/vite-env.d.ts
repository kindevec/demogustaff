/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_RECAPTCHA_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  grecaptcha?: {
    ready: (callback: () => void) => void;
    render: (
      container: string | HTMLElement,
      parameters: {
        sitekey: string;
        theme?: 'light' | 'dark';
        size?: 'normal' | 'compact';
        callback?: (token: string) => void;
        'expired-callback'?: () => void;
        'error-callback'?: () => void;
        hl?: string;
      }
    ) => number;
    reset: (opt_widget_id?: number) => void;
    getResponse: (opt_widget_id?: number) => string;
  };
  onGoogleReCaptchaLoad?: () => void;
}
