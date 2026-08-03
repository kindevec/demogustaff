import React, { useState, useEffect, useCallback } from 'react';
import { User, Language, Product, SiteContent } from './types';
import { getLocalUser, setLocalUser, fetchProducts, getStoredSiteContent } from './lib/supabase';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { CookieBanner } from './components/CookieBanner';
import { AuthModal } from './components/AuthModal';
import { ProductDetailModal } from './components/ProductDetailModal';

import { HomeView } from './views/HomeView';
import { AboutView } from './views/AboutView';
import { ProductsView } from './views/ProductsView';
import { IndustrialView } from './views/IndustrialView';
import { RecipesView } from './views/RecipesView';
import { ContactView } from './views/ContactView';
import { RestrictedZoneView } from './views/RestrictedZoneView';
import { AdminView } from './views/AdminView';

export default function App() {
  const getHashTab = () => {
    const hash = window.location.hash.replace('#', '');
    return hash.split('/')[0] || 'home';
  };

  const [currentTab, setCurrentTabState] = useState<string>(getHashTab());

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentTabState(getHashTab());
      window.scrollTo(0, 0); // Reset scroll to top on tab change
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const setCurrentTab = (tab: string) => {
    window.location.hash = tab;
  };
  const [lang, setLang] = useState<Language>('es');

  const [currentUser, setCurrentUser] = useState<User | null>(() => getLocalUser());
  const [products, setProducts] = useState<Product[]>([]);

  const loadProducts = async () => {
    const data = await fetchProducts();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);
  const [siteContent] = useState<SiteContent>(() => getStoredSiteContent());

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productsThemeColor, setProductsThemeColor] = useState('');

  // Sync scroll top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  const handleLogout = () => {
    setLocalUser(null);
    setCurrentUser(null);
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentTab('downloads');
  };

  const handleRequestQuote = (product: Product) => {
    setCurrentTab('industrial');
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] text-[#4a3224] font-sans selection:bg-[#b05d2e] selection:text-white flex flex-col justify-between">
      {/* Fixed Main Navigation Header */}
      {currentTab !== 'admin' && (
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          lang={lang}
          setLang={setLang}
          currentUser={currentUser}
          onOpenAuth={() => setAuthModalOpen(true)}
          onLogout={handleLogout}
          onOpenAdmin={() => setCurrentTab('admin')}
          themeColor={currentTab === 'products' ? productsThemeColor : ''}
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
            onOpenAuth={() => setAuthModalOpen(true)}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {currentTab === 'about' && (
          <AboutView siteContent={siteContent} lang={lang} setCurrentTab={setCurrentTab} />
        )}

        {currentTab === 'products' && (
          <ProductsView
            products={products}
            lang={lang}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onOpenAuth={() => setAuthModalOpen(true)}
            onThemeColorChange={setProductsThemeColor}
          />
        )}

        {currentTab === 'industrial' && (
          <IndustrialView
            products={products}
            lang={lang}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentTab === 'recipes' && (
          <RecipesView lang={lang} />
        )}

        {currentTab === 'contact' && (
          <ContactView siteContent={siteContent} lang={lang} />
        )}

        {currentTab === 'downloads' && (
          <RestrictedZoneView
            currentUser={currentUser}
            onOpenAuth={() => setAuthModalOpen(true)}
            lang={lang}
          />
        )}

        {currentTab === 'admin' && (
          <AdminView setCurrentTab={setCurrentTab} lang={lang} refreshProducts={loadProducts} products={products} />
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

      {/* Auth / Lead Registration Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        lang={lang}
      />

      {/* Product Detail / Technical Sheet Drawer */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onRequestQuote={handleRequestQuote}
        lang={lang}
      />
    </div>
  );
}
