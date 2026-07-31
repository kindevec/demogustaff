import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User, Prospect, Product, ContactSubmission, TechnicalSheet, SiteContent } from '../types';
import { INITIAL_PRODUCTS, INITIAL_TECHNICAL_SHEETS, INITIAL_SITE_CONTENT } from '../data/initialData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'MY_SUPABASE_URL');

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local Storage Keys for Fallback Mode
const STORAGE_KEYS = {
  USER: 'gustaff_current_user',
  PROSPECTS: 'gustaff_prospects_list',
  PRODUCTS: 'gustaff_products_list',
  MESSAGES: 'gustaff_contact_messages',
  SITE_CONTENT: 'gustaff_site_content',
  COOKIES_ACCEPTED: 'gustaff_cookies_consent'
};

// Local storage helpers
export const getLocalUser = (): User | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setLocalUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};

export const registerLead = async (data: {
  name: string;
  email: string;
  company_phone: string;
  password?: string;
}): Promise<{ user: User; error: string | null }> => {
  const newUser: User = {
    id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    email: data.email,
    name: data.name,
    company: data.company_phone,
    phone: data.company_phone,
    role: 'user',
    created_at: new Date().toISOString()
  };

  const newProspect: Prospect = {
    id: `prosp-${Date.now()}`,
    name: data.name,
    email: data.email,
    company_phone: data.company_phone,
    status: 'new',
    created_at: new Date().toISOString(),
    notes: 'Registrado desde formulario de captación de descargas'
  };

  // If Supabase is available, sync to Supabase
  if (supabase) {
    try {
      const { error: sbError } = await supabase.from('prospects').insert([{
        name: data.name,
        email: data.email,
        company_phone: data.company_phone,
        status: 'new'
      }]);
      if (sbError) console.warn('Supabase sync notice:', sbError.message);
    } catch (e) {
      console.warn('Supabase request skipped:', e);
    }
  }

  // Save to local storage list of prospects
  const existingProspects: Prospect[] = getLocalProspects();
  existingProspects.unshift(newProspect);
  localStorage.setItem(STORAGE_KEYS.PROSPECTS, JSON.stringify(existingProspects));

  // Set current user session
  setLocalUser(newUser);

  return { user: newUser, error: null };
};

export const getLocalProspects = (): Prospect[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROSPECTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveContactSubmission = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; error: string | null }> => {
  const newMsg: ContactSubmission = {
    id: `msg-${Date.now()}`,
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
    created_at: new Date().toISOString(),
    status: 'pending'
  };

  if (supabase) {
    try {
      await supabase.from('contact_submissions').insert([{
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message
      }]);
    } catch (e) {
      console.warn('Supabase insert note:', e);
    }
  }

  const existingMsgs: ContactSubmission[] = getLocalContactSubmissions();
  existingMsgs.unshift(newMsg);
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(existingMsgs));

  return { success: true, error: null };
};

export const getLocalContactSubmissions = (): ContactSubmission[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const getStoredProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return raw ? JSON.parse(raw) : INITIAL_PRODUCTS;
  } catch {
    return INITIAL_PRODUCTS;
  }
};

export const saveStoredProducts = (products: Product[]): void => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

export const getStoredSiteContent = (): SiteContent => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SITE_CONTENT);
    return raw ? JSON.parse(raw) : INITIAL_SITE_CONTENT;
  } catch {
    return INITIAL_SITE_CONTENT;
  }
};

export const saveStoredSiteContent = (content: SiteContent): void => {
  localStorage.setItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(content));
};
