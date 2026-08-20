export type Language = 'es' | 'en';


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
  
  // Dynamic Translations
  name_en?: string;
  description_en?: string;
  package_size_en?: string;
  features_en?: string[];
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

export interface SlideConfig {
  id: number;
  tagline: string;
  titleLine1: string;
  titleAccent: string;
  description: string;
  image: string;
  primaryBtnText: string;
  primaryTab: string;
  objectPosition?: string;
  isActive?: boolean;
  bgZoom?: number;
}

export interface ProductSlideConfig {
  id: string;
  tagline: string;
  titleLine1: string;
  titleAccent: string;
  description: string;
  image: string;
  bgColor: string;
  navColor: string;
  accentColor: string;
  objectPosition?: string;
  isActive?: boolean;
  bgZoom?: number;
}

export interface IndustrialBannerConfig {
  badge: string;
  title: string;
  subtitle: string;
  image: string;
  objectPosition?: string;
  bgZoom?: number;
}

export interface SiteContent {
  home_headline: string;
  home_quienes_somos: string;
  home_productos_summary: string;
  home_industrial_summary: string;
  home_slides?: SlideConfig[];
  products_slides?: ProductSlideConfig[];
  industrial_banner?: IndustrialBannerConfig;
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
