import { CategoryItem, Product } from '../types';

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 'industrial', name: 'Industrial' },
  { id: 'consumer', name: 'Consumo' },
  { id: 'coberturas', name: 'Coberturas' },
  { id: 'galletas', name: 'Galletas' },
  { id: 'cocoa', name: 'Cocoa' }
];

const STORAGE_KEY = 'gustaff_custom_categories';

/**
 * Obtiene las categorías almacenadas en localStorage o las predeterminadas.
 */
export const getStoredCategories = (): CategoryItem[] => {
  if (typeof window === 'undefined') return DEFAULT_CATEGORIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error al leer categorías de localStorage:', e);
  }
  return DEFAULT_CATEGORIES;
};

/**
 * Guarda las categorías en localStorage y notifica cambios a la ventana.
 */
export const saveStoredCategories = (categories: CategoryItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    window.dispatchEvent(new CustomEvent('gustaff_categories_updated', { detail: categories }));
  } catch (e) {
    console.warn('Error al guardar categorías en localStorage:', e);
  }
};

/**
 * Obtiene todas las categorías disponibles fusionando categorías predeterminadas/almacenadas
 * con cualquier categoría que tengan los productos actuales.
 */
export const getAllCategories = (products?: Product[]): CategoryItem[] => {
  const stored = getStoredCategories();
  const map = new Map<string, CategoryItem>();

  // 1. Agregar las categorías predeterminadas y guardadas
  stored.forEach(c => {
    map.set(c.id.toLowerCase(), c);
  });

  // 2. Si hay productos con categorías únicas no registradas, incorporarlas
  if (products && Array.isArray(products)) {
    products.forEach(p => {
      if (p.category) {
        const catKey = p.category.toLowerCase().trim();
        if (catKey && !map.has(catKey)) {
          const formattedName = p.category.charAt(0).toUpperCase() + p.category.slice(1);
          map.set(catKey, { id: catKey, name: formattedName });
        }
      }
    });
  }

  return Array.from(map.values());
};

/**
 * Agrega una nueva categoría al registro.
 */
export const addCustomCategory = (name: string, existingProducts?: Product[]): CategoryItem => {
  const current = getAllCategories(existingProducts);
  const cleanName = name.trim();
  const slug = cleanName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  const finalId = slug || `cat_${Date.now()}`;

  // Verificar si ya existe
  const existing = current.find(c => c.id.toLowerCase() === finalId || c.name.toLowerCase() === cleanName.toLowerCase());
  if (existing) {
    return existing;
  }

  const newCat: CategoryItem = {
    id: finalId,
    name: cleanName
  };

  const updated = [...current, newCat];
  saveStoredCategories(updated);
  return newCat;
};

/**
 * Actualiza el nombre de una categoría existente.
 */
export const updateCustomCategory = (id: string, newName: string, existingProducts?: Product[]): CategoryItem[] => {
  const current = getAllCategories(existingProducts);
  const cleanName = newName.trim();
  const updated = current.map(c => {
    if (c.id.toLowerCase() === id.toLowerCase()) {
      return { ...c, name: cleanName };
    }
    return c;
  });
  saveStoredCategories(updated);
  return updated;
};
