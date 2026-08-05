import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { Language, Product, SiteContent } from './types';
import { fetchProducts, getStoredSiteContent, saveStoredSiteContent, getAdminSession, adminLogout } from './lib/supabase';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { CookieBanner } from './components/CookieBanner';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ProductEditModal } from './components/ProductEditModal';
import { updateProduct, addProduct, deleteProduct } from './lib/supabase';
import { ShieldCheck, LogOut, Edit3, Plus } from 'lucide-react';

/* User-facing views — static imports for instant tab switching */
import { HomeView } from './views/HomeView';
import { AboutView } from './views/AboutView';
import { ProductsView } from './views/ProductsView';
import { IndustrialView } from './views/IndustrialView';
import { RecipesView } from './views/RecipesView';
import { ContactView } from './views/ContactView';

/* Admin panel — lazy loaded (regular users never access it) */
const AdminView = lazy(() => import('./views/AdminView').then(m => ({ default: m.AdminView })));

const getHashTab = () => {
  const hash = window.location.hash.replace('#', '');
  return hash.split('/')[0] || 'home';
};

export default function App() {
  const [currentTab, setCurrentTabState] = useState<string>(getHashTab());
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('sb-') && key.includes('-auth-token')) {
          const val = localStorage.getItem(key);
          if (val && val.includes('access_token')) return true;
        }
      }
    } catch {}
    return false;
  });

  // Check admin auth status
  const checkAuth = useCallback(async () => {
    const { session } = await getAdminSession();
    setIsAdmin(Boolean(session));
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth, currentTab]);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentTabState(getHashTab());
      window.scrollTo(0, 0);
      checkAuth();
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [checkAuth]);

  const setCurrentTab = useCallback((tab: string) => {
    window.location.hash = tab;
  }, []);

  const lang: Language = 'es';

  const [products, setProducts] = useState<Product[]>([]);

  const loadProducts = useCallback(async () => {
    const data = await fetchProducts();
    setProducts(data);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const [siteContent, setSiteContent] = useState<SiteContent>(() => getStoredSiteContent());
  const refreshSiteContent = useCallback(() => setSiteContent(getStoredSiteContent()), []);

  const handleUpdateSiteContent = useCallback(async (newContent: SiteContent) => {
    setSiteContent(newContent);
    await saveStoredSiteContent(newContent);
  }, []);

  const handleAdminLogout = useCallback(async () => {
    await adminLogout();
    setIsAdmin(false);
  }, []);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProductModal, setEditingProductModal] = useState<Product | null>(null);

  const handleEditProductModal = useCallback((p: Product) => {
    setEditingProductModal(p);
  }, []);

  const handleAddNewProductModal = useCallback(() => {
    setEditingProductModal({
      id: `prod_${Date.now()}`,
      code: 'GUST-NEW',
      name: '',
      category: 'industrial',
      package_size: '',
      description: '',
      image: '',
      order: products.length + 1
    });
  }, [products.length]);

  const handleSaveProductModal = useCallback(async (prod: Product) => {
    if (prod.id && !prod.id.startsWith('prod_')) {
      await updateProduct(prod.id, prod);
    } else {
      await addProduct(prod);
    }
    await loadProducts();
  }, [loadProducts]);

  const handleDeleteProductModal = useCallback(async (id: string) => {
    await deleteProduct(id);
    await loadProducts();
  }, [loadProducts]);

  const [headerThemeColor, setHeaderThemeColor] = useState<string>(() => {
    const initialTab = getHashTab();
    return initialTab === 'admin' ? '' : '#3A1B12';
  });

  const handleSelectProduct = useCallback((p: Product) => setSelectedProduct(p), []);
  const handleCloseProduct = useCallback(() => setSelectedProduct(null), []);
  const handleOpenAdmin = useCallback(() => setCurrentTab('admin'), [setCurrentTab]);
  const handleRequestQuote = useCallback(() => {
    setCurrentTab('industrial');
  }, [setCurrentTab]);

  return (
    <div className="min-h-screen bg-[#fdfaf5] text-[#4a3224] font-sans selection:bg-[#b05d2e] selection:text-white flex flex-col justify-between">
      
      {/* Top Admin Active Banner (Visible across site when logged in) */}
      {isAdmin && currentTab !== 'admin' && (
        <div className="bg-[#1e140f] text-[#e8dcc4] text-xs py-2 px-4 flex items-center justify-between z-50 border-b border-[#3A1B12] shadow-md sticky top-0">
          <div className="flex items-center gap-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Modo Administrador Activo — Edición en Tiempo Real</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentTab('admin')} 
              className="inline-flex items-center gap-1 text-[#f3ece0] hover:text-white underline font-medium cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Panel General</span>
            </button>
            <button 
              onClick={handleAdminLogout} 
              className="inline-flex items-center gap-1 bg-[#e86014] hover:bg-[#d9530f] text-white px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}

      {/* Fixed Main Navigation Header */}
      {currentTab !== 'admin' && (
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          lang={lang}
          onOpenAdmin={handleOpenAdmin}
          themeColor={headerThemeColor}
          isAdmin={isAdmin}
        />
      )}

      {/* Main View Router Content */}
      <main className={`flex-1 ${currentTab !== 'admin' ? 'pb-16 lg:pb-0' : ''}`}>
        {currentTab === 'home' && (
          <HomeView
            setCurrentTab={setCurrentTab}
            lang={lang}
            products={products}
            siteContent={siteContent}
            onSelectProduct={handleSelectProduct}
            onThemeColorChange={setHeaderThemeColor}
            isAdmin={isAdmin}
            onUpdateSiteContent={handleUpdateSiteContent}
            onEditProduct={handleEditProductModal}
          />
        )}

        {currentTab === 'about' && (
          <AboutView 
            siteContent={siteContent} 
            lang={lang} 
            setCurrentTab={setCurrentTab}
            onThemeColorChange={setHeaderThemeColor} 
          />
        )}

        {currentTab === 'products' && (
          <ProductsView
            products={products}
            lang={lang}
            onSelectProduct={handleSelectProduct}
            onOpenAuth={handleOpenAdmin}
            onThemeColorChange={setHeaderThemeColor}
            isAdmin={isAdmin}
            onEditProduct={handleEditProductModal}
            onAddProduct={handleAddNewProductModal}
          />
        )}

        {currentTab === 'industrial' && (
          <IndustrialView
            products={products}
            lang={lang}
            onSelectProduct={handleSelectProduct}
            onOpenAuth={handleOpenAdmin}
            onThemeColorChange={setHeaderThemeColor}
            isAdmin={isAdmin}
            onEditProduct={handleEditProductModal}
            onAddProduct={handleAddNewProductModal}
          />
        )}

        {currentTab === 'recipes' && (
          <RecipesView lang={lang} onThemeColorChange={setHeaderThemeColor} />
        )}

        {currentTab === 'contact' && (
          <ContactView siteContent={siteContent} lang={lang} onThemeColorChange={setHeaderThemeColor} />
        )}

        {currentTab === 'admin' && (
          <Suspense fallback={<div className="min-h-[60vh] bg-[#fdfaf5]" />}>
            <AdminView setCurrentTab={setCurrentTab} lang={lang} refreshProducts={loadProducts} products={products} refreshSiteContent={refreshSiteContent} />
          </Suspense>
        )}
      </main>

      {/* Universal Footer */}
      {currentTab !== 'admin' && (
        <Footer setCurrentTab={setCurrentTab} lang={lang} />
      )}

      {/* Fixed Mobile Bottom Navigation Bar */}
      {currentTab !== 'admin' && (
        <BottomNav
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          lang={lang}
        />
      )}

      {/* Interactive Floating WhatsApp Widget (+593 96 971 8045) */}
      {currentTab !== 'admin' && (
        <WhatsAppWidget lang={lang} />
      )}

      {/* Cookie Privacy Consent Banner */}
      <CookieBanner lang={lang} />

      {/* Product Detail / Technical Sheet Drawer */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={handleCloseProduct}
        onRequestQuote={handleRequestQuote}
        lang={lang}
      />

      {/* Admin Inline Product Edit Modal */}
      <ProductEditModal
        product={editingProductModal}
        onClose={() => setEditingProductModal(null)}
        onSave={handleSaveProductModal}
        onDelete={handleDeleteProductModal}
      />
    </div>
  );
}
