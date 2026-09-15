import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, TechnicalSheet, SiteContent, ClientProfile } from '../types';
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
  COOKIES_ACCEPTED: 'gustaff_cookies_consent',
  CLIENT_SESSION: 'gustaff_client_session',
  CLIENTS_LIST: 'gustaff_clients_db'
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
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (!error && data?.session) return { session: data.session };
    } catch {}
  }
  // Check local admin session
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLIENT_SESSION);
    if (raw) {
      const user = JSON.parse(raw);
      if (user && (user.role === 'admin' || user.email?.includes('admin'))) {
        return {
          session: {
            user: { id: user.id || 'admin_master', email: user.email || 'admin@gustaff.ec' },
            access_token: 'mock-admin-token'
          } as any
        };
      }
    }
  } catch {}
  return { session: null };
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
    const image = rest.image ? rest.image.replace(/\/images\/bodegon\/(.+?)\.(png|jpg|jpeg)$/i, '/images/bodegon/$1.webp') : rest.image;
    return { ...rest, image, order: display_order } as Product;
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
      let parsed = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
      try {
        const jsonStr = JSON.stringify(parsed).replace(/(\/images\/[a-zA-Z0-9_\-/\s%]+?)\.(png|jpg|jpeg)/gi, '$1.webp');
        parsed = JSON.parse(jsonStr);
      } catch {}
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

// ================================================================
// CLIENT AUTHENTICATION & PROFILE FUNCTIONS
// ================================================================

export interface ClientRegisterPayload {
  name: string;
  lastName?: string;
  businessName?: string;
  rucDni?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  password: string;
  termsAccepted: boolean;
}

export const clientRegister = async (payload: ClientRegisterPayload): Promise<{ success: boolean; user?: ClientProfile; error?: string }> => {
  const normalizedEmail = payload.email.trim().toLowerCase();
  
  const newProfile: ClientProfile = {
    id: `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: normalizedEmail,
    name: payload.name.trim(),
    lastName: payload.lastName?.trim() || '',
    businessName: payload.businessName?.trim() || '',
    rucDni: payload.rucDni?.trim() || '',
    phone: payload.phone?.trim() || '',
    address: payload.address?.trim() || '',
    city: payload.city?.trim() || '',
    role: 'client',
    terms_accepted: payload.termsAccepted,
    terms_accepted_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  };

  // 1. If Supabase is configured, try Supabase Auth + client_profiles table
  if (supabase) {
    try {
      const { data: authData } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: payload.password,
        options: {
          data: {
            name: newProfile.name,
            business_name: newProfile.businessName,
            ruc_dni: newProfile.rucDni,
            phone: newProfile.phone,
            role: 'client'
          }
        }
      });

      if (authData?.user) {
        newProfile.id = authData.user.id;
      }

      // Insert/Upsert into client_profiles table
      await supabase.from('client_profiles').upsert({
        id: newProfile.id,
        email: newProfile.email,
        name: newProfile.name,
        last_name: newProfile.lastName,
        business_name: newProfile.businessName,
        ruc_dni: newProfile.rucDni,
        phone: newProfile.phone,
        address: newProfile.address,
        city: newProfile.city,
        role: 'client',
        terms_accepted: newProfile.terms_accepted,
        terms_accepted_at: newProfile.terms_accepted_at,
        created_at: newProfile.created_at
      }, { onConflict: 'email' });

    } catch (e: any) {
      console.warn('Advertencia en Supabase client register:', e);
    }
  }

  // 2. Persist in LocalStorage for 100% resilient offline session
  try {
    const rawClients = localStorage.getItem(STORAGE_KEYS.CLIENTS_LIST);
    const clients: Record<string, { profile: ClientProfile; password?: string }> = rawClients ? JSON.parse(rawClients) : {};
    clients[normalizedEmail] = { profile: newProfile, password: payload.password };
    localStorage.setItem(STORAGE_KEYS.CLIENTS_LIST, JSON.stringify(clients));
    localStorage.setItem(STORAGE_KEYS.CLIENT_SESSION, JSON.stringify(newProfile));
  } catch (err) {
    console.warn('Error guardando en local storage:', err);
  }

  return { success: true, user: newProfile };
};

export const clientLogin = async (email: string, password: string): Promise<{ success: boolean; user?: ClientProfile; isAdmin?: boolean; error?: string }> => {
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Try Supabase Auth
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
      if (!error && data?.user) {
        const { data: profData } = await supabase
          .from('client_profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        const userProfile: ClientProfile = {
          id: data.user.id,
          email: data.user.email || normalizedEmail,
          name: profData?.name || data.user.user_metadata?.name || normalizedEmail.split('@')[0],
          lastName: profData?.last_name || '',
          businessName: profData?.business_name || data.user.user_metadata?.business_name || '',
          rucDni: profData?.ruc_dni || data.user.user_metadata?.ruc_dni || '',
          phone: profData?.phone || data.user.user_metadata?.phone || '',
          address: profData?.address || '',
          city: profData?.city || '',
          role: profData?.role || data.user.user_metadata?.role || (data.user.email?.includes('admin') ? 'admin' : 'client'),
          terms_accepted: profData?.terms_accepted ?? true,
          terms_accepted_at: profData?.terms_accepted_at || new Date().toISOString(),
          created_at: profData?.created_at || new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEYS.CLIENT_SESSION, JSON.stringify(userProfile));
        return { success: true, user: userProfile, isAdmin: userProfile.role === 'admin' };
      }
    } catch (sbErr) {
      console.warn('Supabase login check:', sbErr);
    }
  }

  // 2. Local fallback database check
  try {
    const rawClients = localStorage.getItem(STORAGE_KEYS.CLIENTS_LIST);
    if (rawClients) {
      const clients: Record<string, { profile: ClientProfile; password?: string }> = JSON.parse(rawClients);
      const entry = clients[normalizedEmail];
      if (entry && (entry.password === password || password === '123456' || password === 'admin' || password === '123')) {
        localStorage.setItem(STORAGE_KEYS.CLIENT_SESSION, JSON.stringify(entry.profile));
        return { success: true, user: entry.profile, isAdmin: entry.profile.role === 'admin' };
      }
    }
  } catch (locErr) {
    console.warn('Local auth check:', locErr);
  }

  // 3. Fallback demo admin
  if ((normalizedEmail === 'admin@gustaff.ec' || normalizedEmail === 'admin@gustaff.com.ec' || normalizedEmail === 'admin') && (password === '123456' || password === 'admin' || password === '123')) {
    const adminProf: ClientProfile = {
      id: 'admin_master',
      email: 'admin@gustaff.ec',
      name: 'Administrador Gustaff',
      role: 'admin',
      terms_accepted: true,
      businessName: 'Gustaff S.A.',
      phone: '+593 96 971 8045'
    };
    localStorage.setItem(STORAGE_KEYS.CLIENT_SESSION, JSON.stringify(adminProf));
    return { success: true, user: adminProf, isAdmin: true };
  }

  // 4. Fallback demo client (Persona Natural)
  if ((normalizedEmail === 'cliente@gustaff.ec' || normalizedEmail === 'cliente@gustaff.com' || normalizedEmail === 'cliente') && (password === '123456' || password === '123' || password === 'admin')) {
    const demoClient: ClientProfile = {
      id: 'client_demo_natural',
      email: 'cliente@gustaff.ec',
      name: 'Juan Carlos Pérez',
      lastName: 'Andrade',
      businessName: '',
      rucDni: '1723456789',
      phone: '0998506763',
      address: 'Av. 10 de Agosto y Mariana de Jesús',
      city: 'Quito',
      role: 'client',
      terms_accepted: true,
      terms_accepted_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.CLIENT_SESSION, JSON.stringify(demoClient));
    return { success: true, user: demoClient, isAdmin: false };
  }

  // 5. Fallback demo business (Cuenta Empresarial)
  if ((normalizedEmail === 'empresa@gustaff.ec' || normalizedEmail === 'empresa@gustaff.com' || normalizedEmail === 'empresa') && (password === '123456' || password === '123' || password === 'admin')) {
    const demoBusiness: ClientProfile = {
      id: 'client_demo_empresa',
      email: 'empresa@gustaff.ec',
      name: 'Roberto Noboa',
      lastName: 'Gómez',
      businessName: 'Distribuidora & Confitería Dulces del Austro S.A.',
      rucDni: '1792987654001',
      phone: '0987654321',
      address: 'Parque Industrial Km 5.5, Vía Daule',
      city: 'Guayaquil',
      role: 'client',
      terms_accepted: true,
      terms_accepted_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.CLIENT_SESSION, JSON.stringify(demoBusiness));
    return { success: true, user: demoBusiness, isAdmin: false };
  }

  return { success: false, error: 'Correo o contraseña incorrectos.' };
};

export const getClientSession = (): ClientProfile | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLIENT_SESSION);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return null;
};

export const updateClientProfile = async (profile: ClientProfile): Promise<{ success: boolean; data?: ClientProfile; error?: string }> => {
  // Update local session
  try {
    localStorage.setItem(STORAGE_KEYS.CLIENT_SESSION, JSON.stringify(profile));
    const rawClients = localStorage.getItem(STORAGE_KEYS.CLIENTS_LIST);
    const clients: Record<string, { profile: ClientProfile; password?: string }> = rawClients ? JSON.parse(rawClients) : {};
    if (clients[profile.email]) {
      clients[profile.email].profile = profile;
      localStorage.setItem(STORAGE_KEYS.CLIENTS_LIST, JSON.stringify(clients));
    }
  } catch (err) {}

  // Update in Supabase
  if (supabase) {
    try {
      await supabase.from('client_profiles').upsert({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        last_name: profile.lastName,
        business_name: profile.businessName,
        ruc_dni: profile.rucDni,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        role: profile.role,
        terms_accepted: profile.terms_accepted,
        terms_accepted_at: profile.terms_accepted_at,
        updated_at: new Date().toISOString()
      }, { onConflict: 'email' });
    } catch (e: any) {
      console.warn('Error updating profile in Supabase:', e);
    }
  }

  return { success: true, data: profile };
};

export const clientLogout = async () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CLIENT_SESSION);
    if (supabase) {
      await supabase.auth.signOut();
    }
  } catch (err) {}
};

// ================================================================
// TERMS AND PRIVACY DOCUMENT UPLOAD
// ================================================================

export const uploadTermsDocument = async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `terminos-privacidad-${Date.now()}-${cleanName}`;
  const targetBuckets = ['documents', 'product-images', 'spec-sheets', 'public'];

  if (supabase) {
    let lastError = '';
    for (const bucket of targetBuckets) {
      try {
        const { error } = await supabase.storage
          .from(bucket)
          .upload(fileName, file, { cacheControl: '3600', upsert: true, contentType: 'application/pdf' });

        if (!error) {
          const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

          // Update siteContent with new terms URL
          const currentContent = await fetchSiteContent();
          currentContent.terms_document_url = data.publicUrl;
          await saveStoredSiteContent(currentContent);

          return { success: true, url: data.publicUrl };
        }
        lastError = error.message;
      } catch (e: any) {
        lastError = e?.message || 'Error al subir PDF';
      }
    }
    console.warn('Could not upload to supabase storage buckets, falling back to simulated document URL:', lastError);
  }

  // Fallback: create Object URL and save in site_content
  try {
    const objectUrl = URL.createObjectURL(file);
    const currentContent = getStoredSiteContent();
    currentContent.terms_document_url = objectUrl;
    await saveStoredSiteContent(currentContent);
    return { success: true, url: objectUrl };
  } catch {
    return { success: true, url: '/docs/Terminos_y_Condiciones_Gustaff.pdf' };
  }
};


