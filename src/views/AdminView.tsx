import React, { useState, useEffect } from 'react';
import { Product, Prospect, ContactSubmission, SiteContent, Language } from '../types';
import { 
  getLocalProspects, 
  getLocalContactSubmissions, 
  addProduct,
  updateProduct,
  deleteProduct,
  adminLogin,
  adminLogout,
  getAdminSession,
  getStoredSiteContent,
  saveStoredSiteContent,
  uploadProductImage,
  fetchProspects,
  fetchMessages
} from '../lib/supabase';
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
  X,
  LogOut,
  Menu
} from 'lucide-react';

interface AdminViewProps {
  setCurrentTab: (tab: string) => void;
  lang?: Language;
  products: Product[];
  refreshProducts: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ setCurrentTab, products, refreshProducts }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        setProspects(await fetchProspects());
        setMessages(await fetchMessages());
      }
    };
    loadData();
  }, [authenticated]);

  const [activeTab, setActiveTab] = useState<'prospects' | 'products' | 'content' | 'messages'>('prospects');

  const [prospects, setProspects] = useState<Prospect[]>(() => getLocalProspects());
  const [messages, setMessages] = useState<ContactSubmission[]>(() => getLocalContactSubmissions());
  const [siteContent, setSiteContent] = useState<SiteContent>(() => getStoredSiteContent());

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [prospectSearch, setProspectSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

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

  const handleExportCSV = () => {
    if (prospects.length === 0) {
      alert('No hay prospectos registrados aún.');
      return;
    }
    const headers = ['Nombre', 'Correo', 'Empresa_Telefono', 'Estado', 'Fecha_Registro'];
    const rows = prospects.map(p => [
      `"${p.name}"`,
      `"${p.email}"`,
      `"${p.company_phone}"`,
      `"${p.status}"`,
      `"${p.created_at}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Prospectos_Gustaff_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const handleDeleteProduct = async (id: string) => {
    if (confirm('¿Está seguro de eliminar este producto del catálogo?')) {
      const res = await deleteProduct(id);
      if (res.error) alert('Error: ' + res.error);
      refreshProducts();
      showNotice();
    }
  };

  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSiteContent(siteContent);
    showNotice();
  };

  const showNotice = () => {
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleRefreshData = async () => {
    setProspects(await fetchProspects());
    setMessages(await fetchMessages());
    refreshProducts();
    setSiteContent(getStoredSiteContent());
    showNotice();
  };

  const filteredProspects = prospects.filter(p =>
    p.name.toLowerCase().includes(prospectSearch.toLowerCase()) ||
    p.email.toLowerCase().includes(prospectSearch.toLowerCase()) ||
    p.company_phone.toLowerCase().includes(prospectSearch.toLowerCase())
  );

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.code.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const tabs = [
    { id: 'prospects', label: 'Prospectos / Leads', icon: Users, badge: prospects.length },
    { id: 'products', label: 'Gestión Catálogo', icon: Package, badge: products.length },
    { id: 'content', label: 'Textos de Páginas', icon: FileText },
    { id: 'messages', label: 'Mensajes Recibidos', icon: MessageSquare, badge: messages.length }
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
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center mb-6">
            <ShieldCheck className="w-8 h-8" />
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
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">Admin CMS</h1>
              <p className="text-[10px] text-slate-500 font-medium">Gustaff S.A. 2026</p>
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
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 -ml-2 text-slate-600 rounded-lg hover:bg-slate-50">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                <Lock className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900">Admin CMS</span>
            </div>
          </div>
          <button onClick={() => setCurrentTab('home')} className="p-2 text-slate-500 bg-slate-50 border border-slate-200 rounded-lg">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </header>

        {/* Mobile Nav Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm animate-fadeIn" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="absolute top-16 left-4 right-4 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden" onClick={e => e.stopPropagation()}>
               <div className="p-2 space-y-1">
                {tabs.map(t => {
                  const Icon = t.icon;
                  const isActive = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => { setActiveTab(t.id as any); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                        {t.label}
                      </div>
                    </button>
                  );
                })}
               </div>
               <div className="p-2 border-t border-slate-100 grid grid-cols-2 gap-2 bg-slate-50">
                 <button onClick={handleRefreshData} className="flex flex-col items-center justify-center p-3 text-xs font-medium text-slate-600 bg-white rounded-xl border border-slate-200 shadow-sm">
                   <RefreshCw className="w-4 h-4 mb-1" /> Actualizar
                 </button>
                 <button onClick={handleLogout} className="flex flex-col items-center justify-center p-3 text-xs font-medium text-red-600 bg-white rounded-xl border border-slate-200 shadow-sm">
                   <LogOut className="w-4 h-4 mb-1" /> Salir
                 </button>
               </div>
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
          
          {/* Global Toast */}
          {isSavedNotice && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-sm flex items-center gap-3 animate-fadeIn">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-emerald-800 text-sm font-medium">Cambios guardados correctamente.</span>
            </div>
          )}

          {/* TAB: PROSPECTS */}
          {activeTab === 'prospects' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Registro de Prospectos</h2>
                  <p className="text-sm text-slate-500 mt-1">Usuarios que han descargado fichas o solicitado información.</p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-medium transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <div className="relative max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={prospectSearch}
                      onChange={(e) => setProspectSearch(e.target.value)}
                      placeholder="Buscar prospectos..."
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-sm"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4">Usuario</th>
                        <th className="px-6 py-4">Contacto</th>
                        <th className="px-6 py-4">Empresa / Tel</th>
                        <th className="px-6 py-4">Fecha</th>
                        <th className="px-6 py-4">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filteredProspects.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-500 bg-slate-50/50">
                            No se encontraron resultados.
                          </td>
                        </tr>
                      ) : (
                        filteredProspects.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
                                {p.name.charAt(0).toUpperCase()}
                              </div>
                              {p.name}
                            </td>
                            <td className="px-6 py-4 text-slate-500">{p.email}</td>
                            <td className="px-6 py-4 text-slate-500">{p.company_phone || '-'}</td>
                            <td className="px-6 py-4 text-slate-500 text-xs">{new Date(p.created_at).toLocaleDateString('es-EC')}</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                Nuevo Lead
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
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
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold transition-all shadow-sm shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  Nuevo Producto
                </button>
              </div>

              {editingProduct && (
                <div className="bg-white rounded-2xl shadow-xl border border-amber-200 overflow-hidden animate-fadeIn relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <Package className="w-5 h-5 text-amber-500" />
                      {editingProduct.id.startsWith('prod_') ? 'Crear Producto' : 'Editar Producto'}
                    </h3>
                    <button onClick={() => setEditingProduct(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleSaveProduct} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">CÓDIGO INTERNO</label>
                          <input type="text" value={editingProduct.code} onChange={(e) => setEditingProduct({ ...editingProduct, code: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" required />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">NOMBRE DEL PRODUCTO</label>
                          <input type="text" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">CATEGORÍA</label>
                            <select value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
                              <option value="industrial">Industrial</option>
                              <option value="consumer">Consumo</option>
                              <option value="coberturas">Coberturas</option>
                              <option value="galletas">Galletas</option>
                              <option value="cocoa">Cocoa</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">PRESENTACIÓN</label>
                            <input type="text" value={editingProduct.package_size} onChange={(e) => setEditingProduct({ ...editingProduct, package_size: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" required />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">IMAGEN DEL PRODUCTO</label>
                          <div className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                            {editingProduct.image ? (
                              <img src={editingProduct.image} alt="Preview" className="w-20 h-20 rounded-lg object-cover border border-slate-200 bg-white shadow-sm shrink-0" />
                            ) : (
                              <div className="w-20 h-20 rounded-lg border border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-[10px] text-slate-400 shrink-0">
                                Sin foto
                              </div>
                            )}
                            <div className="flex-1">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={isUploading}
                                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white file:text-slate-700 file:border file:border-slate-200 hover:file:bg-slate-50 cursor-pointer mb-2"
                              />
                              {isUploading ? (
                                <p className="text-amber-600 text-xs font-medium animate-pulse">Subiendo a Supabase...</p>
                              ) : (
                                <p className="text-slate-400 text-[10px]">Formatos: JPG, PNG, WEBP (Max 5MB)</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">DESCRIPCIÓN COMERCIAL</label>
                          <textarea rows={3} value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" required />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
                      <button type="button" onClick={() => setEditingProduct(null)} className="px-5 py-2.5 text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium transition-colors">
                        Cancelar
                      </button>
                      <button type="submit" className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors">
                        <Save className="w-4 h-4" />
                        Guardar Cambios
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
                 <div className="relative w-full max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Buscar producto por nombre..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-sm"
                  />
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
                        <button onClick={() => handleDeleteProduct(prod.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CMS CONTENT */}
          {activeTab === 'content' && (
            <div className="max-w-4xl animate-fadeIn">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Editor de Textos (CMS)</h2>
                <p className="text-sm text-slate-500 mt-1">Modifica la información corporativa visible en el sitio web.</p>
              </div>

              <form onSubmit={handleSaveContent} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 md:p-8 space-y-8">
                  
                  <section>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">Página de Inicio</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Titular Principal (Hero)</label>
                        <input type="text" value={siteContent.home_headline} onChange={(e) => setSiteContent({ ...siteContent, home_headline: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Resumen "Quiénes Somos"</label>
                        <textarea rows={3} value={siteContent.home_quienes_somos} onChange={(e) => setSiteContent({ ...siteContent, home_quienes_somos: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">Identidad Corporativa</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Misión</label>
                        <textarea rows={4} value={siteContent.about_mision} onChange={(e) => setSiteContent({ ...siteContent, about_mision: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Visión</label>
                        <textarea rows={4} value={siteContent.about_vision} onChange={(e) => setSiteContent({ ...siteContent, about_vision: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Política de Calidad</label>
                        <textarea rows={3} value={siteContent.about_politica_calidad} onChange={(e) => setSiteContent({ ...siteContent, about_politica_calidad: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">Información de Contacto</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Dirección Matriz</label>
                        <input type="text" value={siteContent.contact_address} onChange={(e) => setSiteContent({ ...siteContent, contact_address: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfonos Fijos</label>
                        <input type="text" value={siteContent.contact_phones} onChange={(e) => setSiteContent({ ...siteContent, contact_phones: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Línea WhatsApp</label>
                        <input type="text" value={siteContent.contact_whatsapp} onChange={(e) => setSiteContent({ ...siteContent, contact_whatsapp: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                      </div>
                    </div>
                  </section>
                </div>
                
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                  <button type="submit" className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm shadow-amber-500/20 transition-all">
                    <Save className="w-4 h-4" />
                    Publicar Contenidos
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Bandeja de Mensajes</h2>
                <p className="text-sm text-slate-500 mt-1">Consultas enviadas desde el formulario de contacto.</p>
              </div>

              {messages.length === 0 ? (
                <div className="p-12 bg-white border border-slate-200 rounded-2xl text-center shadow-sm">
                  <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No hay mensajes en la bandeja de entrada.</p>
                </div>
              ) : (
                <div className="space-y-4 max-w-4xl">
                  {messages.map((msg) => (
                    <div key={msg.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
                            {msg.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{msg.name}</h4>
                            <p className="text-xs text-slate-500 flex items-center gap-2">
                              <a href={`mailto:${msg.email}`} className="hover:text-amber-600 transition-colors">{msg.email}</a>
                              {msg.phone && (
                                <>
                                  <span className="text-slate-300">•</span>
                                  <span>{msg.phone}</span>
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                            {new Date(msg.created_at).toLocaleString('es-EC')}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-bold text-slate-800 mb-2">Asunto: {msg.subject}</h5>
                        <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
};
