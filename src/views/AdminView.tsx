import React, { useState, useEffect } from 'react';
import { HomeView } from './HomeView';
import { AboutView } from './AboutView';
import { ContactView } from './ContactView';
import { Product, SiteContent, Language } from '../types';
import { 
  addProduct,
  updateProduct,
  deleteProduct,
  adminLogin,
  adminLogout,
  getAdminSession,
  getStoredSiteContent,
  saveStoredSiteContent,
  uploadProductImage
} from '../lib/supabase';
import { translateText, translateArray } from '../lib/translateAPI';
import { 
  Lock, 
  Users, 
  Package, 
  FileText, 
  MessageSquare, 
  Download, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  CheckCircle, 
  RefreshCw,
  ArrowLeft,
  Search,
  ShieldCheck,
  Eye,
    X,
  LogOut,
  Menu,
  AlertTriangle
} from 'lucide-react';

interface AdminViewProps {
  setCurrentTab: (tab: string) => void;
  lang?: Language;
  products: Product[];
  refreshProducts: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ setCurrentTab, products, refreshProducts, refreshSiteContent }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [previewView, setPreviewView] = useState<'home' | 'about' | 'contact' | null>(null);


  useEffect(() => {
    const checkSession = async () => {
      const { session } = await getAdminSession();
      if (session) {
        setAuthenticated(true);
      }
      setIsCheckingAuth(false);
    };
    checkSession();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (authenticated) {
        
      }
    };
    loadData();
  }, [authenticated]);

  const getActiveTab = () => {
    const hash = window.location.hash.replace('#', '');
    const parts = hash.split('/');
    if (parts[0] === 'admin' && parts[1]) {
      return parts[1] as 'products' | 'content';
    }
    return 'products';
  };

  const [activeTab, setActiveTabState] = useState<'products' | 'content'>(getActiveTab());

  useEffect(() => {
    const handleHashChange = () => {
      setActiveTabState(getActiveTab());
      window.scrollTo(0, 0); // Reset scroll to top on tab change
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const setActiveTab = (tab: 'products' | 'content') => {
    window.location.hash = `admin/${tab}`;
    setIsMobileMenuOpen(false); // Close mobile menu if open
  };

  const [siteContent, setSiteContent] = useState<SiteContent>(() => getStoredSiteContent());

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<'all' | 'industrial' | 'consumer' | 'coberturas' | 'galletas' | 'cocoa'>('all');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const { data, error } = await adminLogin(email, password);
    if (error || !data.session) {
      setAuthError('Credenciales incorrectas o problema de red.');
    } else {
      setAuthenticated(true);
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    setAuthenticated(false);
    setEmail('');
    setPassword('');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;
    
    setIsUploading(true);
    const res = await uploadProductImage(file);
    if (res.success && res.url) {
      setEditingProduct({ ...editingProduct, image: res.url });
    } else {
      alert('Error al subir imagen: ' + res.error);
    }
    setIsUploading(false);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsTranslating(true);
    // Auto-translate if English fields are empty
    try {
      if (!editingProduct.name_en) {
        editingProduct.name_en = await translateText(editingProduct.name);
      }
      if (!editingProduct.description_en && editingProduct.description) {
        editingProduct.description_en = await translateText(editingProduct.description);
      }
      if (!editingProduct.package_size_en && editingProduct.package_size) {
        editingProduct.package_size_en = await translateText(editingProduct.package_size);
      }
      if ((!editingProduct.features_en || editingProduct.features_en.length === 0) && editingProduct.features && editingProduct.features.length > 0) {
        editingProduct.features_en = await translateArray(editingProduct.features);
      }
    } catch (err) {
      console.error('Translation failed', err);
    }
    setIsTranslating(false);

    if (editingProduct.id.startsWith('prod_')) {
      const { id, ...newProductData } = editingProduct;
      const res = await addProduct(newProductData as any);
      if (res.error) alert('Error: ' + res.error);
    } else {
      const res = await updateProduct(editingProduct.id, editingProduct);
      if (res.error) alert('Error: ' + res.error);
    }

    refreshProducts();
    setEditingProduct(null);
    showNotice();
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    const res = await deleteProduct(productToDelete.id);
    setIsDeleting(false);
    if (res.error) alert('Error: ' + res.error);
    refreshProducts();
    setProductToDelete(null);
    showNotice();
  };

  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSiteContent(siteContent);
    if (refreshSiteContent) refreshSiteContent();
    showNotice();
  };

  const showNotice = () => {
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleRefreshData = async () => {
    
    refreshProducts();
    setSiteContent(getStoredSiteContent());
    showNotice();
  };


  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.code.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const tabs = [
    { id: 'products', label: 'Gestión Catálogo', icon: Package, badge: products.length },
    { id: 'content', label: 'Textos de Páginas', icon: FileText }
  ];

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Verificando sesión segura...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-amber-500/5 blur-[100px]" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-amber-500/5 blur-[100px]" />
        </div>

        <button
          onClick={() => setCurrentTab('home')}
          className="absolute top-6 left-6 p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm flex items-center gap-2 transition-all hover:shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:block">Volver al Sitio</span>
        </button>

        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10 relative z-10 animate-fadeIn">
          <div className="mx-auto flex items-center justify-center mb-8">
            <img src="/images/bodegon/logo_gustaff_oficial.png" alt="Logo Gustaff S.A." className="h-20 w-auto object-contain drop-shadow-sm" />
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Acceso Administrador</h2>
            <p className="text-slate-500 mt-2 text-sm">Ingrese sus credenciales de acceso seguro para administrar el catálogo y contenido.</p>
          </div>

          {authError && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-400"
                placeholder="admin@gustaff.ec"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-400"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 mt-2"
            >
              Ingresar al Panel
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400">© 2026 Gustaff S.A. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col shadow-sm shrink-0 relative z-20">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setCurrentTab('home')}
            title="Volver al inicio"
          >
            <img src="/images/bodegon/logo_gustaff_oficial.png" alt="Gustaff" className="h-9 object-contain drop-shadow-sm group-hover:scale-105 transition-transform" />
            <div className="border-l-2 border-amber-500 pl-3 ml-1">
              <h1 className="font-bold text-slate-900 leading-tight text-lg group-hover:text-amber-600 transition-colors">Admin CMS</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Gestión Web</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-2">Navegación</p>
          {tabs.map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                  {t.label}
                </div>
                {t.badge !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-amber-200 text-amber-800' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-100 space-y-2">
          <button
            onClick={handleRefreshData}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
            Actualizar Datos
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
          <div className="pt-2">
            <button
              onClick={() => setCurrentTab('home')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Volver al Sitio
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentTab('home')}
          >
            <div className="flex items-center gap-2.5">
              <img src="/images/bodegon/logo_gustaff_oficial.png" alt="Gustaff" className="h-6 object-contain drop-shadow-sm group-hover:scale-105 transition-transform" />
              <div className="h-4 w-px bg-slate-300"></div>
              <span className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">Admin CMS</span>
            </div>
          </div>
          <button onClick={() => setCurrentTab('home')} className="p-2 text-slate-500 bg-slate-50 border border-slate-200 rounded-lg">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </header>

        {/* Scrollable Content (Add pb-20 to avoid content being hidden by bottom nav) */}
        <div className="flex-1 overflow-y-auto w-full h-full custom-scrollbar">
          <div className="p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto pb-24 md:pb-8">
          
          {/* Global Toast */}
          {isSavedNotice && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-sm flex items-center gap-3 animate-fadeIn">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-emerald-800 text-sm font-medium">Cambios guardados correctamente.</span>
            </div>
          )}

          {/* TAB: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Catálogo de Productos</h2>
                  <p className="text-sm text-slate-500 mt-1">Gestiona los productos mostrados en la web pública.</p>
                </div>
                <button
                  onClick={() =>
                    setEditingProduct({
                      id: `prod_${Date.now()}`,
                      code: 'GUST-NEW',
                      name: '',
                      category: 'industrial',
                      package_size: '',
                      description: '',
                      image: '',
                      order: products.length + 1
                    })
                  }
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold transition-all shadow-sm shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  Nuevo Producto
                </button>
              </div>

              {editingProduct && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                  <div className="bg-white w-full sm:w-[95%] max-w-4xl h-[95vh] sm:h-auto sm:max-h-[90vh] flex flex-col relative rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-amber-600" />
                    
                    <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0 sticky top-0 z-10">
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg sm:text-xl flex items-center gap-2.5">
                          <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
                            <Package className="w-5 h-5" />
                          </div>
                          {editingProduct.id.startsWith('prod_') ? 'Crear Nuevo Producto' : 'Editar Producto'}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 ml-12 hidden sm:block">Completa la información del producto para el catálogo público.</p>
                      </div>
                      <button type="button" onClick={() => setEditingProduct(null)} className="p-2 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-xl transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="overflow-y-auto p-5 sm:p-6 sm:px-8 bg-slate-50/50 flex-1">
                      <form onSubmit={handleSaveProduct} className="flex flex-col h-full">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 flex-1">
                          
                          {/* Columna Izquierda: Información Básica */}
                          <div className="space-y-5">
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                              <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                Información Básica
                              </h4>
                              
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">CÓDIGO INTERNO</label>
                                <input type="text" value={editingProduct.code} onChange={(e) => setEditingProduct({ ...editingProduct, code: e.target.value })} className="w-full bg-slate-50 hover:bg-white border border-slate-200 hover:border-amber-300 rounded-xl p-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium" placeholder="Ej: GUST-IND-01" required />
                              </div>
                              
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">NOMBRE DEL PRODUCTO</label>
                                <input type="text" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full bg-slate-50 hover:bg-white border border-slate-200 hover:border-amber-300 rounded-xl p-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium" placeholder="Ej: Azúcar impalpable" required />
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-slate-700 mb-1.5">CATEGORÍA</label>
                                  <select value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })} className="w-full bg-slate-50 hover:bg-white border border-slate-200 hover:border-amber-300 rounded-xl p-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all cursor-pointer font-medium">
                                    <option value="industrial">Industrial</option>
                                    <option value="consumer">Consumo</option>
                                    <option value="coberturas">Coberturas</option>
                                    <option value="galletas">Galletas</option>
                                    <option value="cocoa">Cocoa</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-slate-700 mb-1.5">PRESENTACIÓN</label>
                                  <input type="text" value={editingProduct.package_size} onChange={(e) => setEditingProduct({ ...editingProduct, package_size: e.target.value })} className="w-full bg-slate-50 hover:bg-white border border-slate-200 hover:border-amber-300 rounded-xl p-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium" placeholder="Ej: Sacos de 25 kg" required />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Columna Derecha: Imagen y Detalles */}
                          <div className="space-y-5">
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                              <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                Imagen y Detalles
                              </h4>
                              
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2">FOTOGRAFÍA DEL PRODUCTO</label>
                                <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50/50 border border-slate-200 border-dashed rounded-xl transition-all hover:bg-slate-50 hover:border-amber-300">
                                  {editingProduct.image ? (
                                    <div className="relative group">
                                      <img src={editingProduct.image} alt="Preview" className="w-24 h-24 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-200 bg-white shadow-sm shrink-0" />
                                      <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Edit3 className="w-5 h-5 text-white" />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="w-24 h-24 sm:w-20 sm:h-20 rounded-xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-slate-400 shrink-0">
                                      <Package className="w-6 h-6 mb-1 opacity-50" />
                                      <span className="text-[10px] font-medium">Sin foto</span>
                                    </div>
                                  )}
                                  <div className="flex-1 w-full text-center sm:text-left">
                                    <label className="relative cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-700 hover:text-amber-700 rounded-lg text-xs font-bold transition-all shadow-sm w-full sm:w-auto mb-2">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={isUploading}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                      />
                                      {isUploading ? (
                                        <>
                                          <div className="w-3.5 h-3.5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                                          Subiendo...
                                        </>
                                      ) : (
                                        <>
                                          Subir Nueva Imagen
                                        </>
                                      )}
                                    </label>
                                    <p className="text-slate-400 text-[10px] leading-tight px-2 sm:px-0">
                                      Formatos: JPG, PNG, WEBP. <br className="hidden sm:block" />Peso máximo: 5MB.
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">DESCRIPCIÓN COMERCIAL</label>
                                <textarea rows={4} value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} className="w-full bg-slate-50 hover:bg-white border border-slate-200 hover:border-amber-300 rounded-xl p-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all resize-none font-medium" placeholder="Escribe una descripción atractiva para el producto..." required />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8 pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3 pb-6 sm:pb-0">
                          <button type="button" onClick={() => setEditingProduct(null)} className="w-full sm:w-auto px-6 py-2.5 text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold transition-all active:scale-[0.98]">
                            Cancelar
                          </button>
                          <button 
                            type="submit" 
                            disabled={isTranslating}
                            className="w-full sm:w-auto justify-center px-8 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-md shadow-amber-500/25 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {isTranslating ? (
                              <><RefreshCw className="w-4 h-4 animate-spin" /> Traduciendo...</>
                            ) : (
                              <><Save className="w-4 h-4" /> Guardar Cambios</>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
                <div className="relative w-full sm:max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Buscar por código, nombre..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-sm transition-all"
                  />
                </div>
                
                <div className="relative w-full sm:w-auto">
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value as any)}
                    className="w-full sm:w-[220px] appearance-none pl-5 pr-10 py-3 bg-white border border-slate-200 hover:border-amber-300 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-sm transition-all cursor-pointer"
                  >
                    <option value="all">Todas las Categorías</option>
                    <option value="industrial">Línea Industrial</option>
                    <option value="consumer">Consumo Masivo</option>
                    <option value="coberturas">Coberturas</option>
                    <option value="galletas">Galletas</option>
                    <option value="cocoa">Cacao en Polvo</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredProducts.map((prod) => (
                  <div key={prod.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col group hover:shadow-lg hover:border-amber-300 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/0 group-hover:bg-amber-500 transition-colors" />
                    
                    <div className="flex items-start gap-4 mb-3">
                      <img src={prod.image} alt={prod.name} className="w-16 h-16 rounded-xl object-cover bg-slate-50 border border-slate-100 shrink-0" />
                      <div>
                        <div className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-500 uppercase tracking-wider mb-1">
                          {prod.code}
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm leading-tight">{prod.name}</h4>
                      </div>
                    </div>
                    
                    <div className="flex-1 mb-4">
                      <p className="text-xs text-slate-500 line-clamp-2">{prod.description}</p>
                    </div>
                    
                    <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-xs">
                        <span className="block text-[9px] text-slate-400 uppercase">Presentación</span>
                        <span className="font-medium text-slate-700">{prod.package_size}</span>
                      </div>
                      
                      <div className="flex gap-1">
                        <button onClick={() => setEditingProduct(prod)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Editar">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setProductToDelete(prod)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delete Product Modal */}
              {productToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                  <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden w-full max-w-md relative animate-scaleIn">
                    <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
                    <div className="p-6 sm:p-8 text-center space-y-4">
                      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-2 text-red-500 shadow-sm border border-red-100">
                        <AlertTriangle className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Eliminar Producto</h3>
                      <p className="text-sm text-slate-500">
                        ¿Estás seguro de que deseas eliminar <span className="font-bold text-slate-700">"{productToDelete.name}"</span> del catálogo? Esta acción no se puede deshacer.
                      </p>
                    </div>
                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                      <button 
                        type="button" 
                        onClick={() => setProductToDelete(null)} 
                        disabled={isDeleting}
                        className="w-full px-5 py-2.5 text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold transition-all"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="button" 
                        onClick={confirmDeleteProduct}
                        disabled={isDeleting}
                        className="w-full justify-center px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isDeleting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Eliminando...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            Sí, Eliminar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: CMS CONTENT */}
          {activeTab === 'content' && (
            <div className="w-full animate-fadeIn pb-safe-bottom sm:pb-0">
              <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-lg text-amber-500 hidden sm:block">
                      <FileText className="w-5 h-5" />
                    </div>
                    Editor de Textos (CMS)
                  </h2>
                  <p className="text-sm text-slate-500 mt-2 sm:mt-1 sm:ml-12">Modifica la información corporativa visible en el sitio web de forma rápida.</p>
                </div>
              </div>

              <form onSubmit={handleSaveContent} className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-amber-600" />
                
                <div className="p-6 sm:p-8 md:p-10 space-y-10">
                  
                  {/* SECCIÓN 1 */}
                  <section className="space-y-5">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Página de Inicio
                    
                        <button type="button" onClick={() => setPreviewView('home')} className="ml-auto flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full hover:bg-amber-200 transition-colors">
                          <Eye className="w-3.5 h-3.5" /> Previsualizar
                        </button>
                      </h3>
                    <div className="bg-slate-50/50 p-5 sm:p-6 rounded-2xl border border-slate-100 space-y-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">TITULAR PRINCIPAL (HERO)</label>
                        <input type="text" value={siteContent.home_headline} onChange={(e) => setSiteContent({ ...siteContent, home_headline: e.target.value })} className="w-full bg-white border border-slate-200 hover:border-amber-300 rounded-xl p-3.5 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium shadow-sm" placeholder="Ej: Pasión por el chocolate..." />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">RESUMEN "QUIÉNES SOMOS"</label>
                        <textarea rows={3} value={siteContent.home_quienes_somos} onChange={(e) => setSiteContent({ ...siteContent, home_quienes_somos: e.target.value })} className="w-full bg-white border border-slate-200 hover:border-amber-300 rounded-xl p-3.5 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium resize-none shadow-sm" placeholder="Breve descripción de la empresa..." />
                      </div>
                    </div>
                  </section>

                  {/* SECCIÓN 2 */}
                  <section className="space-y-5">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Identidad Corporativa
                    
                        <button type="button" onClick={() => setPreviewView('about')} className="ml-auto flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full hover:bg-amber-200 transition-colors">
                          <Eye className="w-3.5 h-3.5" /> Previsualizar
                        </button>
                      </h3>
                    <div className="bg-slate-50/50 p-5 sm:p-6 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">MISIÓN</label>
                        <textarea rows={4} value={siteContent.about_mision} onChange={(e) => setSiteContent({ ...siteContent, about_mision: e.target.value })} className="w-full bg-white border border-slate-200 hover:border-amber-300 rounded-xl p-3.5 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium resize-none shadow-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">VISIÓN</label>
                        <textarea rows={4} value={siteContent.about_vision} onChange={(e) => setSiteContent({ ...siteContent, about_vision: e.target.value })} className="w-full bg-white border border-slate-200 hover:border-amber-300 rounded-xl p-3.5 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium resize-none shadow-sm" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-2">POLÍTICA DE CALIDAD</label>
                        <textarea rows={3} value={siteContent.about_politica_calidad} onChange={(e) => setSiteContent({ ...siteContent, about_politica_calidad: e.target.value })} className="w-full bg-white border border-slate-200 hover:border-amber-300 rounded-xl p-3.5 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium resize-none shadow-sm" />
                      </div>
                    </div>
                  </section>

                  {/* SECCIÓN 3 */}
                  <section className="space-y-5">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Información de Contacto
                    </h3>
                    <div className="bg-slate-50/50 p-5 sm:p-6 rounded-2xl border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">DIRECCIÓN MATRIZ</label>
                        <input type="text" value={siteContent.contact_address} onChange={(e) => setSiteContent({ ...siteContent, contact_address: e.target.value })} className="w-full bg-white border border-slate-200 hover:border-amber-300 rounded-xl p-3.5 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium shadow-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">TELÉFONOS FIJOS</label>
                        <input type="text" value={siteContent.contact_phones} onChange={(e) => setSiteContent({ ...siteContent, contact_phones: e.target.value })} className="w-full bg-white border border-slate-200 hover:border-amber-300 rounded-xl p-3.5 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium shadow-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">LÍNEA WHATSAPP</label>
                        <input type="text" value={siteContent.contact_whatsapp} onChange={(e) => setSiteContent({ ...siteContent, contact_whatsapp: e.target.value })} className="w-full bg-white border border-slate-200 hover:border-amber-300 rounded-xl p-3.5 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium shadow-sm" />
                      </div>
                    </div>
                  </section>
                </div>
                
                <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-4">
                  <button type="submit" className="w-full sm:w-auto justify-center px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl flex items-center gap-2.5 shadow-md shadow-amber-500/25 transition-all active:scale-[0.98]">
                    <Save className="w-5 h-5" />
                    Publicar Contenidos
                  </button>
                </div>
              </form>
            </div>
          )}

          </div>
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex items-center justify-around pb-safe pt-2 px-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
          {tabs.map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-colors ${
                  isActive ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div className={`p-1.5 rounded-full ${isActive ? 'bg-amber-50' : 'bg-transparent'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] mt-0.5 font-medium truncate w-full text-center px-1 ${
                  isActive ? 'text-amber-700' : 'text-slate-500'
                }`}>
                  {t.id === 'products' ? 'Catálogo' : 'Textos'}
                </span>
              </button>
            );
          })}
        </div>
      </main>

      {/* Live Preview Modal */}
      {previewView && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-[1400px] h-full sm:h-[90vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center shrink-0">
              <h3 className="font-bold flex items-center gap-2">
                <Eye className="w-5 h-5 text-amber-400" />
                Previsualización en Vivo: {previewView === 'home' ? 'Inicio' : previewView === 'about' ? 'Nosotros' : 'Contacto'}
              </h3>
              <button 
                type="button"
                onClick={() => setPreviewView(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer flex items-center gap-2 text-sm font-semibold"
              >
                Cerrar <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto bg-slate-50 relative custom-scrollbar">
              <div className="w-full">
                {previewView === 'home' && (
                  <HomeView 
                    products={products} 
                    lang="es" 
                    siteContent={siteContent}
                    onSelectProduct={() => {}}
                    onNavigate={() => {}}
                  />
                )}
                {previewView === 'about' && (
                  <AboutView 
                    lang="es" 
                    siteContent={siteContent}
                  />
                )}
                {previewView === 'contact' && (
                  <ContactView 
                    lang="es" 
                    siteContent={siteContent}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
