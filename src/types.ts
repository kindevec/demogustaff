export type Language = 'es' | 'en';

export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  phone?: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface Prospect {
  id: string;
  name: string;
  email: string;
  company_phone: string;
  interest?: string;
  status: 'new' | 'contacted' | 'qualified';
  created_at: string;
  notes?: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  category: 'industrial' | 'consumer' | 'coberturas' | 'galletas' | 'cocoa';
  package_size: string;
  description: string;
  image: string;
  spec_sheet_url?: string;
  features?: string[];
  is_featured?: boolean;
  order: number;
}

export interface TechnicalSheet {
  id: string;
  product_id: string;
  product_name: string;
  package_size: string;
  version: string;
  pdf_url: string;
  file_size: string;
  updated_at: string;
  description: string;
}

export interface DownloadItem {
  id: string;
  title: string;
  category: 'ficha_tecnica' | 'catalogo' | 'brochure' | 'certificacion';
  file_type: string;
  file_size: string;
  description: string;
  download_url: string;
  required_auth: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  prep_time: string;
  difficulty: 'Fácil' | 'Media' | 'Avanzada';
  servings: string;
  ingredients: string[];
  instructions: string[];
  image: string;
  featured_product_name: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  created_at: string;
  status: 'pending' | 'read' | 'replied';
}

export interface SiteContent {
  home_headline: string;
  home_quienes_somos: string;
  home_productos_summary: string;
  home_industrial_summary: string;
  about_title: string;
  about_history: string;
  about_mision: string;
  about_vision: string;
  about_politica_calidad: string;
  contact_intro: string;
  contact_address: string;
  contact_phones: string;
  contact_whatsapp: string;
}
