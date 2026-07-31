import React, { useState } from 'react';
import { Product, Prospect, ContactSubmission, SiteContent, Language } from '../types';
import { 
  getLocalProspects, 
  getLocalContactSubmissions, 
  getStoredProducts, 
  saveStoredProducts,
  getStoredSiteContent,
  saveStoredSiteContent
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
  Eye,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  Calendar,
  X
} from 'lucide-react';

interface AdminViewProps {
  setCurrentTab: (tab: string) => void;
  lang?: Language;
}

export const AdminView: React.FC<AdminViewProps> = ({ setCurrentTab }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'prospects' | 'products' | 'content' | 'messages'>('prospects');

  const [prospects, setProspects] = useState<Prospect[]>(() => getLocalProspects());
  const [messages, setMessages] = useState<ContactSubmission[]>(() => getLocalContactSubmissions());
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());
  const [siteContent, setSiteContent] = useState<SiteContent>(() => getStoredSiteContent());

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Search & Filter state
  const [prospectSearch, setProspectSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'gustaff2026' || adminPassword === 'admin') {
      setAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Contraseña incorrecta. (Clave por defecto: gustaff2026)');
    }
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

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    let updatedList: Product[];
    const exists = products.some(p => p.id === editingProduct.id);

    if (exists) {
      updatedList = products.map(p => p.id === editingProduct.id ? editingProduct : p);
    } else {
      updatedList = [...products, editingProduct];
    }

    setProducts(updatedList);
    saveStoredProducts(updatedList);
    setEditingProduct(null);
    showNotice();
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('¿Está seguro de eliminar este producto del catálogo?')) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      saveStoredProducts(updated);
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

  const handleRefreshData = () => {
    setProspects(getLocalProspects());
    setMessages(getLocalContactSubmissions());
    setProducts(getStoredProducts());
    setSiteContent(getStoredSiteContent());
    showNotice();
  };

  // Filtered prospects
  const filteredProspects = prospects.filter(p =>
    p.name.toLowerCase().includes(prospectSearch.toLowerCase()) ||
    p.email.toLowerCase().includes(prospectSearch.toLowerCase()) ||
    p.company_phone.toLowerCase().includes(prospectSearch.toLowerCase())
  );

  // Filtered products
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.code.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#120a06] text-stone-200 flex flex-col font-sans">
      {/* Top Banner Header */}
      <header className="bg-[#1f100a] border-b border-[#3D2314] sticky top-0 z-30 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 text-stone-950 font-black shadow-md shrink-0">
              <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-amber-500 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                  Panel CMS Autoadministrable
                </span>
                <span className="hidden sm:inline-block text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  Gustaff S.A. 2026
                </span>
              </div>
              <h1 className="font-serif font-bold text-base sm:text-xl text-amber-100 leading-tight">
                Administración General del Sitio
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {authenticated && (
              <button
                onClick={handleRefreshData}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#2C1810] hover:bg-[#3D2314] text-stone-300 text-xs font-semibold border border-[#4A2C1D] flex items-center gap-1.5 transition-colors"
                title="Actualizar Datos"
              >
                <RefreshCw className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Actualizar</span>
              </button>
            )}

            <button
              onClick={() => setCurrentTab('home')}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Sitio</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8">
        {!authenticated ? (
          /* Authentication Form */
          <div className="max-w-md mx-auto my-12 sm:my-20 p-6 sm:p-8 bg-[#1F100A] border border-amber-800/40 rounded-3xl shadow-2xl text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-stone-950 mx-auto flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-amber-100">
                Acceso Administrador
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                Ingrese la credencial de autoadministración para acceder al panel.
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs font-medium">
                {authError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1.5 uppercase tracking-wider">
                  Clave de Acceso CMS:
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Escriba aquí (gustaff2026)"
                  className="w-full bg-[#2C1810] border border-amber-900/60 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all"
              >
                Ingresar al Panel
              </button>
            </form>

            <div className="pt-4 border-t border-[#3D2314] text-[11px] text-stone-500">
              Gustaff S.A. | Todos los derechos reservados
            </div>
          </div>
        ) : (
          /* Authenticated CMS Dashboard */
          <div className="space-y-6">
            {/* Global Notice Toast */}
            {isSavedNotice && (
              <div className="p-3.5 bg-emerald-950 text-emerald-200 border border-emerald-700 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-fadeIn shadow-lg">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Cambios guardados correctamente en la base de datos local del sistema.</span>
              </div>
            )}

            {/* Navigation Tabs (Mobile scrollable horizontal bar, Desktop Grid) */}
            <div className="bg-[#1F100A] p-2 rounded-2xl border border-[#3D2314] flex overflow-x-auto gap-2 no-scrollbar shadow-md">
              {[
                { id: 'prospects', label: 'Prospectos / Leads', icon: Users, badge: prospects.length },
                { id: 'products', label: 'Gestión Catálogo', icon: Package, badge: products.length },
                { id: 'content', label: 'Textos de Páginas', icon: FileText },
                { id: 'messages', label: 'Mensajes Recibidos', icon: MessageSquare, badge: messages.length }
              ].map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`flex-1 min-w-[140px] sm:min-w-0 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-stone-950 shadow-md'
                        : 'bg-[#2C1810]/60 text-stone-300 hover:bg-[#2C1810] hover:text-white border border-[#3D2314]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{t.label}</span>
                    {t.badge !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isActive ? 'bg-stone-950 text-amber-400' : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {t.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* TAB 1: PROSPECTOS / LEADS */}
            {activeTab === 'prospects' && (
              <div className="space-y-4 bg-[#1F100A] p-4 sm:p-6 rounded-3xl border border-[#3D2314] shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#3D2314]">
                  <div>
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-amber-200">
                      Registro de Prospectos y Clientes B2B
                    </h3>
                    <p className="text-xs text-stone-400">
                      Usuarios registrados para descargas de fichas técnicas y cotizaciones.
                    </p>
                  </div>

                  <button
                    onClick={handleExportCSV}
                    className="self-start sm:self-auto px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Exportar a Excel (CSV)</span>
                  </button>
                </div>

                {/* Filter / Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={prospectSearch}
                    onChange={(e) => setProspectSearch(e.target.value)}
                    placeholder="Buscar por nombre, correo o empresa/teléfono..."
                    className="w-full bg-[#2C1810] border border-[#3D2314] rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {filteredProspects.length === 0 ? (
                  <div className="text-center py-12 text-stone-500 text-xs bg-[#2C1810]/40 rounded-2xl border border-[#3D2314]">
                    No se encontraron prospectos registrados.
                  </div>
                ) : (
                  <div className="overflow-x-auto no-scrollbar rounded-2xl border border-[#3D2314]">
                    <table className="w-full text-left text-xs text-stone-300 min-w-[600px]">
                      <thead className="bg-[#2C1810] text-amber-200 font-serif uppercase tracking-wider text-[11px] border-b border-[#3D2314]">
                        <tr>
                          <th className="p-3.5">Nombre / Usuario</th>
                          <th className="p-3.5">Correo Electrónico</th>
                          <th className="p-3.5">Empresa / Teléfono</th>
                          <th className="p-3.5">Fecha</th>
                          <th className="p-3.5">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2C1810] bg-[#120a06]">
                        {filteredProspects.map((p) => (
                          <tr key={p.id} className="hover:bg-[#2C1810]/60 transition-colors">
                            <td className="p-3.5 font-bold text-white flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-amber-900/60 text-amber-300 flex items-center justify-center font-serif text-xs">
                                {p.name.charAt(0).toUpperCase()}
                              </div>
                              <span>{p.name}</span>
                            </td>
                            <td className="p-3.5 text-stone-300 font-mono text-[11px]">
                              {p.email}
                            </td>
                            <td className="p-3.5 text-stone-300">
                              {p.company_phone || 'No especificado'}
                            </td>
                            <td className="p-3.5 text-stone-400 text-[11px]">
                              {new Date(p.created_at).toLocaleDateString('es-EC')}
                            </td>
                            <td className="p-3.5">
                              <span className="bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-800">
                                Registrado
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: GESTIÓN DE PRODUCTOS */}
            {activeTab === 'products' && (
              <div className="space-y-6 bg-[#1F100A] p-4 sm:p-6 rounded-3xl border border-[#3D2314] shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#3D2314]">
                  <div>
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-amber-200">
                      Catálogo de Productos Industrial & Consumo
                    </h3>
                    <p className="text-xs text-stone-400">
                      Agregar, editar o eliminar items del catálogo mostrado a los clientes.
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setEditingProduct({
                        id: `prod_${Date.now()}`,
                        code: 'GUST-NEW',
                        name: 'Nuevo Producto Gustaff',
                        category: 'industrial',
                        package_size: '25 Kg',
                        description: 'Descripción del producto...',
                        image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80',
                        order: products.length + 1
                      })
                    }
                    className="self-start sm:self-auto px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nuevo Producto</span>
                  </button>
                </div>

                {/* Edit Form Modal Overlay or Inline Drawer */}
                {editingProduct && (
                  <div className="p-4 sm:p-6 bg-[#2C1810] border border-amber-600/40 rounded-2xl space-y-4 animate-fadeIn shadow-2xl">
                    <div className="flex items-center justify-between pb-2 border-b border-[#3D2314]">
                      <h4 className="font-serif font-bold text-amber-200 text-base">
                        {editingProduct.id.startsWith('prod_') ? 'Crear Nuevo Producto' : 'Editar Producto'}
                      </h4>
                      <button
                        onClick={() => setEditingProduct(null)}
                        className="p-1.5 rounded-full bg-[#1A0E08] text-stone-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-stone-300 font-bold mb-1">Código Interno:</label>
                        <input
                          type="text"
                          value={editingProduct.code}
                          onChange={(e) => setEditingProduct({ ...editingProduct, code: e.target.value })}
                          className="w-full bg-[#1A0E08] border border-[#3D2314] rounded-xl p-2.5 text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-stone-300 font-bold mb-1">Nombre del Producto:</label>
                        <input
                          type="text"
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          className="w-full bg-[#1A0E08] border border-[#3D2314] rounded-xl p-2.5 text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-stone-300 font-bold mb-1">Categoría:</label>
                        <select
                          value={editingProduct.category}
                          onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                          className="w-full bg-[#1A0E08] border border-[#3D2314] rounded-xl p-2.5 text-white"
                        >
                          <option value="industrial">B2B Granel / Industrial</option>
                          <option value="consumer">Consumo Masivo / Retail</option>
                          <option value="coberturas">Coberturas & Gotas</option>
                          <option value="galletas">Galletas Industrial</option>
                          <option value="cocoa">Cocoa en Polvo</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-stone-300 font-bold mb-1">Presentación / Empaque:</label>
                        <input
                          type="text"
                          value={editingProduct.package_size}
                          onChange={(e) => setEditingProduct({ ...editingProduct, package_size: e.target.value })}
                          className="w-full bg-[#1A0E08] border border-[#3D2314] rounded-xl p-2.5 text-white"
                          required
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-stone-300 font-bold mb-1">URL de Imagen (HTTPS):</label>
                        <input
                          type="text"
                          value={editingProduct.image}
                          onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                          className="w-full bg-[#1A0E08] border border-[#3D2314] rounded-xl p-2.5 text-white font-mono text-[11px]"
                          required
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-stone-300 font-bold mb-1">Descripción Técnica:</label>
                        <textarea
                          rows={3}
                          value={editingProduct.description}
                          onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                          className="w-full bg-[#1A0E08] border border-[#3D2314] rounded-xl p-2.5 text-white"
                          required
                        />
                      </div>

                      <div className="sm:col-span-2 flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="px-4 py-2 bg-[#1A0E08] text-stone-400 rounded-xl hover:text-white"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>Guardar Producto</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Filter Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Buscar producto por nombre o código..."
                    className="w-full bg-[#2C1810] border border-[#3D2314] rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Product List Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-[#2C1810] border border-[#3D2314] rounded-2xl p-4 flex flex-col justify-between space-y-3 relative group hover:border-amber-600/40 transition-all shadow-md"
                    >
                      <div className="flex gap-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-16 h-16 rounded-xl object-cover bg-amber-950 shrink-0 border border-amber-900/40"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                            {prod.code}
                          </span>
                          <h4 className="font-serif font-bold text-sm text-stone-100 truncate mt-1">
                            {prod.name}
                          </h4>
                          <p className="text-[11px] text-stone-400">
                            Presentación: {prod.package_size}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>

                      <div className="pt-2 border-t border-[#3D2314] flex items-center justify-between text-xs">
                        <span className="text-[10px] text-amber-500 capitalize bg-[#1A0E08] px-2 py-0.5 rounded border border-[#3D2314]">
                          {prod.category}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingProduct(prod)}
                            className="p-1.5 rounded-lg bg-[#1A0E08] hover:bg-amber-950 text-amber-300 border border-amber-800/40"
                            title="Editar"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 rounded-lg bg-[#1A0E08] hover:bg-red-950 text-red-400 border border-red-900/40"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: TEXTOS DE PÁGINAS (CMS) */}
            {activeTab === 'content' && (
              <form onSubmit={handleSaveContent} className="space-y-6 bg-[#1F100A] p-4 sm:p-6 rounded-3xl border border-[#3D2314] shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#3D2314]">
                  <div>
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-amber-200">
                      Editor de Contenidos Institucionales
                    </h3>
                    <p className="text-xs text-stone-400">
                      Modifique los textos principales que se muestran en el sitio web público.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="self-start sm:self-auto px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Todos los Textos</span>
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-amber-300 font-bold mb-1 uppercase tracking-wider">
                      Titular Principal de Inicio (Headline):
                    </label>
                    <input
                      type="text"
                      value={siteContent.home_headline}
                      onChange={(e) => setSiteContent({ ...siteContent, home_headline: e.target.value })}
                      className="w-full bg-[#2C1810] border border-[#3D2314] rounded-xl p-3 text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-300 font-bold mb-1 uppercase tracking-wider">
                      Resumen "¿Quiénes Somos?":
                    </label>
                    <textarea
                      rows={3}
                      value={siteContent.home_quienes_somos}
                      onChange={(e) => setSiteContent({ ...siteContent, home_quienes_somos: e.target.value })}
                      className="w-full bg-[#2C1810] border border-[#3D2314] rounded-xl p-3 text-stone-100"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-amber-300 font-bold mb-1 uppercase tracking-wider">
                        Misión Institucional:
                      </label>
                      <textarea
                        rows={3}
                        value={siteContent.about_mision}
                        onChange={(e) => setSiteContent({ ...siteContent, about_mision: e.target.value })}
                        className="w-full bg-[#2C1810] border border-[#3D2314] rounded-xl p-3 text-stone-100"
                      />
                    </div>

                    <div>
                      <label className="block text-amber-300 font-bold mb-1 uppercase tracking-wider">
                        Visión Institucional:
                      </label>
                      <textarea
                        rows={3}
                        value={siteContent.about_vision}
                        onChange={(e) => setSiteContent({ ...siteContent, about_vision: e.target.value })}
                        className="w-full bg-[#2C1810] border border-[#3D2314] rounded-xl p-3 text-stone-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-amber-300 font-bold mb-1 uppercase tracking-wider">
                      Política de Calidad e Inocuidad:
                    </label>
                    <textarea
                      rows={3}
                      value={siteContent.about_politica_calidad}
                      onChange={(e) => setSiteContent({ ...siteContent, about_politica_calidad: e.target.value })}
                      className="w-full bg-[#2C1810] border border-[#3D2314] rounded-xl p-3 text-stone-100"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block text-stone-300 font-bold mb-1">Dirección Planta:</label>
                      <input
                        type="text"
                        value={siteContent.contact_address}
                        onChange={(e) => setSiteContent({ ...siteContent, contact_address: e.target.value })}
                        className="w-full bg-[#2C1810] border border-[#3D2314] rounded-xl p-2.5 text-stone-100"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-300 font-bold mb-1">Teléfonos de Contacto:</label>
                      <input
                        type="text"
                        value={siteContent.contact_phones}
                        onChange={(e) => setSiteContent({ ...siteContent, contact_phones: e.target.value })}
                        className="w-full bg-[#2C1810] border border-[#3D2314] rounded-xl p-2.5 text-stone-100"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-300 font-bold mb-1">WhatsApp Directo:</label>
                      <input
                        type="text"
                        value={siteContent.contact_whatsapp}
                        onChange={(e) => setSiteContent({ ...siteContent, contact_whatsapp: e.target.value })}
                        className="w-full bg-[#2C1810] border border-[#3D2314] rounded-xl p-2.5 text-stone-100"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#3D2314] flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 4: MENSAJES RECIBIDOS */}
            {activeTab === 'messages' && (
              <div className="space-y-4 bg-[#1F100A] p-4 sm:p-6 rounded-3xl border border-[#3D2314] shadow-xl">
                <div className="pb-4 border-b border-[#3D2314]">
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-amber-200">
                    Buzón de Consultas y Contactos
                  </h3>
                  <p className="text-xs text-stone-400">
                    Mensajes enviados desde el formulario de contacto público por clientes.
                  </p>
                </div>

                {messages.length === 0 ? (
                  <div className="text-center py-12 text-stone-500 text-xs bg-[#2C1810]/40 rounded-2xl border border-[#3D2314]">
                    No se han recibido mensajes aún.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-4 bg-[#2C1810] border border-[#3D2314] rounded-2xl space-y-2 text-xs hover:border-amber-600/40 transition-all shadow-md"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#3D2314] pb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-amber-900/60 text-amber-300 flex items-center justify-center font-bold">
                              {msg.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-bold text-stone-100 text-sm">{msg.name}</h4>
                              <span className="text-[11px] text-stone-400">{msg.email}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-stone-400 block">
                              {new Date(msg.created_at).toLocaleString('es-EC')}
                            </span>
                            <span className="text-[10px] bg-amber-950 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-800">
                              Asunto: {msg.subject}
                            </span>
                          </div>
                        </div>

                        <p className="text-stone-300 leading-relaxed bg-[#1A0E08] p-3 rounded-xl border border-[#3D2314]">
                          {msg.message}
                        </p>

                        {msg.phone && (
                          <div className="text-[11px] text-amber-400 flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            <span>Teléfono / Celular: {msg.phone}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
