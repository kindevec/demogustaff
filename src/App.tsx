import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { Language, Product, SiteContent } from './types';
import { fetchProducts, getStoredSiteContent } from './lib/supabase';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { CookieBanner } from './components/CookieBanner';
import { ProductDetailModal } from './components/ProductDetailModal';

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

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentTabState(getHashTab());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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
      {/* Fixed Main Navigation Header */}
      {currentTab !== 'admin' && (
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          lang={lang}
          onOpenAdmin={handleOpenAdmin}
          themeColor={headerThemeColor}
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
          />
        )}

        {currentTab === 'industrial' && (
          <IndustrialView
            products={products}
            lang={lang}
            onSelectProduct={handleSelectProduct}
            onOpenAuth={handleOpenAdmin}
            onThemeColorChange={setHeaderThemeColor}
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
    </div>
  );
}
