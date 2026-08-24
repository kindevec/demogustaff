import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, TechnicalSheet, SiteContent } from '../types';
import { INITIAL_PRODUCTS, INITIAL_TECHNICAL_SHEETS, INITIAL_SITE_CONTENT } from '../data/initialData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'MY_SUPABASE_URL');

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local Storage Keys for Fallback Mode
const STORAGE_KEYS = {
  PRODUCTS: 'gustaff_products_list',
  SITE_CONTENT: 'gustaff_site_content',
  COOKIES_ACCEPTED: 'gustaff_cookies_consent'
};

// Local storage helpers

export const adminLogin = async (email: string, password: string) => {
  if (!supabase) return { error: 'Supabase no configurado' };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

export const adminLogout = async () => {
  if (!supabase) return;
  await supabase.auth.signOut();
};

export const updateAdminPassword = async (newPassword: string) => {
  if (!supabase) return { error: 'Supabase no configurado' };
  const { data, error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: error.message };
  return { success: true, data };
};

export const getAdminSession = async () => {
  if (!supabase) return { session: null };
  const { data, error } = await supabase.auth.getSession();
  if (error) return { session: null, error };
  return { session: data.session };
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

export const fetchSiteContent = async (): Promise<SiteContent> => {
  if (!supabase) return getStoredSiteContent();
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .or('key.eq.main,id.eq.main')
      .maybeSingle();

    if (!error && data && data.content) {
      const parsed = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
      const merged = { ...INITIAL_SITE_CONTENT, ...parsed };
      localStorage.setItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(merged));
      return merged;
    }
  } catch (e) {
    console.warn('Error cargando site_content de Supabase:', e);
  }
  return getStoredSiteContent();
};

export const saveStoredSiteContent = async (content: SiteContent): Promise<void> => {
  localStorage.setItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(content));
  if (supabase) {
    try {
      await supabase.from('site_content').upsert({ 
        key: 'main', 
        id: 'main', 
        content: JSON.stringify(content), 
        updated_at: new Date().toISOString() 
      }, { onConflict: 'key' });
    } catch (e) {
      console.warn('Could not sync site_content to Supabase:', e);
    }
  }
};

export const uploadProductImage = async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
  if (!supabase) return { success: false, error: 'Supabase no configurado' };
  
  const fileExt = file.name.split('.').pop();
  const fileName = `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
  const targetBuckets = ['product-images', 'images', 'documents', 'public'];
  
  let lastError = '';
  for (const bucket of targetBuckets) {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { cacheControl: '3600', upsert: true, contentType: file.type || 'image/jpeg' });
        
      if (!error) {
        const { data } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);
        return { success: true, url: data.publicUrl };
      }
      lastError = error.message;
    } catch (e: any) {
      lastError = e?.message || 'Error al subir imagen';
    }
  }
  
  return { success: false, error: lastError || 'Error al subir imagen' };
};

export const uploadSpecSheetFile = async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
  if (!supabase) return { success: false, error: 'Supabase no configurado' };
  
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `ft-${Date.now()}-${cleanName}`;
  const targetBuckets = ['product-images', 'spec-sheets', 'documents', 'technical-sheets'];
  
  let lastError = '';
  for (const bucket of targetBuckets) {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { cacheControl: '3600', upsert: true, contentType: file.type || 'application/pdf' });
        
      if (!error) {
        const { data } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);
        return { success: true, url: data.publicUrl };
      }
      lastError = error.message;
    } catch (e: any) {
      lastError = e?.message || 'Error al subir archivo';
    }
  }
  
  return { success: false, error: lastError || 'Error al subir archivo PDF.' };
};

export const uploadContactAttachment = async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
  if (!supabase) return { success: false, error: 'Supabase no configurado' };
  
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `contact-${Date.now()}-${cleanName}`;
  const targetBuckets = ['product-images', 'attachments', 'documents', 'spec-sheets'];
  
  let lastError = '';
  for (const bucket of targetBuckets) {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { 
          cacheControl: '3600', 
          upsert: true, 
          contentType: file.type || 'application/octet-stream' 
        });
        
      if (!error) {
        const { data } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);
        return { success: true, url: data.publicUrl };
      }
      lastError = error.message;
    } catch (e: any) {
      lastError = e?.message || 'Error al subir archivo adjunto';
    }
  }
  
  return { success: false, error: lastError || 'Error al subir archivo adjunto a Supabase Storage' };
};

export interface ContactSubmissionPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  reasonType: string;
  subReason?: string;
  message: string;
  attachmentUrl?: string;
  acceptPrivacy: boolean;
  acceptMarketing: boolean;
  recaptchaToken?: string;
}

export const submitContactForm = async (payload: ContactSubmissionPayload): Promise<{ success: boolean; error?: string }> => {
  try {
    const fullName = `${payload.firstName} ${payload.lastName}`.trim();
    const subject = `[Contacto Web] ${payload.reasonType}${payload.subReason ? ` - ${payload.subReason}` : ''}`;
    
    const formattedMessage = `
NUEVO MENSAJE DE CONTACTO (GUSTAFF S.A.)
----------------------------------------
Nombre: ${fullName}
Correo Electrónico: ${payload.email}
Teléfono: ${payload.phone}
País: ${payload.country}
Motivo: ${payload.reasonType}
Detalle: ${payload.subReason || 'N/A'}
Autoriza comunicaciones: ${payload.acceptMarketing ? 'Sí' : 'No'}
Aceptó privacidad: ${payload.acceptPrivacy ? 'Sí' : 'No'}

Evidencia / Archivo Adjunto:
${payload.attachmentUrl ? payload.attachmentUrl : 'Sin archivo adjunto'}

Mensaje / Consulta:
${payload.message}
`.trim();

    // 1. Save to Supabase DB if available
    if (supabase) {
      try {
        await supabase
          .from('contact_submissions')
          .insert([{
            name: fullName,
            email: payload.email,
            subject: subject,
            message: formattedMessage,
            attachment_url: payload.attachmentUrl || null,
            status: 'pending'
          }]);
      } catch (dbErr) {
        console.warn('Advertencia guardando en BD Supabase:', dbErr);
      }
    }

    // 2. Send via Web3Forms API to servicioalcliente@gustaff.com
    try {
      const web3FormsBody: Record<string, any> = {
        access_key: '5b8b80b2-75d3-4f95-8167-27b5993895e6',
        to_email: 'servicioalcliente@gustaff.com',
        from_name: 'Gustaff S.A. Sitio Web',
        subject: subject,
        name: fullName,
        email: payload.email,
        message: formattedMessage,
        attachment_link: payload.attachmentUrl || 'Ninguno'
      };

      if (payload.recaptchaToken) {
        web3FormsBody['g-recaptcha-response'] = payload.recaptchaToken;
        web3FormsBody['recaptcha_token'] = payload.recaptchaToken;
      }

      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(web3FormsBody)
      });
    } catch (emailErr) {
      console.warn('Error en despacho Web3Forms API, continuando...', emailErr);
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error al procesar el mensaje.' };
  }
};

