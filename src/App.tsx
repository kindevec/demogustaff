import React, { useState, useEffect } from 'react';
import { User, Language, Product, SiteContent } from './types';
import { getLocalUser, setLocalUser, getStoredProducts, getStoredSiteContent } from './lib/supabase';
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
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [lang, setLang] = useState<Language>('es');

  const [currentUser, setCurrentUser] = useState<User | null>(() => getLocalUser());
  const [products] = useState<Product[]>(() => getStoredProducts());
  const [siteContent] = useState<SiteContent>(() => getStoredSiteContent());

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
          <AboutView siteContent={siteContent} lang={lang} />
        )}

        {currentTab === 'products' && (
          <ProductsView
            products={products}
            lang={lang}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onOpenAuth={() => setAuthModalOpen(true)}
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
          <AdminView setCurrentTab={setCurrentTab} lang={lang} />
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
      <WhatsAppWidget />

      {/* Cookie Privacy Consent Banner */}
      <CookieBanner />

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
