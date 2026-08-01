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

export const adminLogin = async (email: string, password: string) => {
  if (!supabase) return { error: 'Supabase no configurado' };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

export const adminLogout = async () => {
  if (!supabase) return;
  await supabase.auth.signOut();
};

export const getAdminSession = async () => {
  if (!supabase) return { session: null };
  const { data, error } = await supabase.auth.getSession();
  if (error) return { session: null, error };
  return { session: data.session };
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

export const fetchProducts = async (): Promise<Product[]> => {
  if (!supabase) return INITIAL_PRODUCTS;
  const { data, error } = await supabase.from('products').select('*').order('display_order', { ascending: true });
  if (error) {
    console.error('Error fetching products:', error);
    return INITIAL_PRODUCTS;
  }
  return (data || []).map(p => {
    const { display_order, ...rest } = p;
    return { ...rest, order: display_order } as Product;
  });
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<{ success: boolean; data?: Product; error?: string }> => {
  if (!supabase) return { success: false, error: 'Supabase no configurado' };
  
  const { order, ...rest } = product as any;
  const dbProduct = { ...rest, display_order: order };
  
  const { data, error } = await supabase.from('products').insert([dbProduct]).select().single();
  if (error) return { success: false, error: error.message };
  return { success: true, data };
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<{ success: boolean; data?: Product; error?: string }> => {
  if (!supabase) return { success: false, error: 'Supabase no configurado' };
  
  const { order, ...rest } = product as any;
  const dbProduct = { ...rest };
  if (order !== undefined) {
    dbProduct.display_order = order;
  }

  const { data, error } = await supabase.from('products').update(dbProduct).eq('id', id).select().single();
  if (error) return { success: false, error: error.message };
  return { success: true, data };
};

export const deleteProduct = async (id: string): Promise<{ success: boolean; error?: string }> => {
  if (!supabase) return { success: false, error: 'Supabase no configurado' };
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
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

export const uploadProductImage = async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
  if (!supabase) return { success: false, error: 'Supabase no configurado' };
  
  const fileExt = file.name.split('.').pop();
  const fileName = `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, { cacheControl: '3600', upsert: false, contentType: file.type || 'image/jpeg' });
    
  if (error) {
    return { success: false, error: error.message };
  }
  
  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName);
    
  return { success: true, url: data.publicUrl };
};
