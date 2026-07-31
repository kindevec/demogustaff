import React, { useState } from 'react';
import { Product, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { Search, Filter, Package, Check, ChevronRight, FileText, Lock } from 'lucide-react';

interface ProductsViewProps {
  products: Product[];
  lang: Language;
  onSelectProduct: (p: Product) => void;
  onOpenAuth: () => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  lang,
  onSelectProduct,
  onOpenAuth
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todos los Productos' },
    { id: 'industrial', label: 'Insumos Industriales' },
    { id: 'coberturas', label: 'Coberturas de Chocolate' },
    { id: 'cocoa', label: 'Polvos de Cacao' },
    { id: 'galletas', label: 'Galletería' }
  ];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.code.toLowerCase().includes(searchTerm.toLowerCase());
    if (selectedCategory === 'all') return matchesSearch;
    return matchesSearch && p.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="bg-[#603813] text-white p-8 sm:p-12 rounded-3xl border border-[#d4af37]/30 shadow-xl text-left space-y-3">
        <span className="text-xs font-bold text-[#d4af37] uppercase tracking-widest bg-white/10 px-3.5 py-1 rounded-full border border-white/20">
          Catálogo General Gustaff S.A.
        </span>

        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-white">
          Nuestras Líneas de Chocolates, Coberturas y Galletas
        </h1>

        <p className="text-xs sm:text-sm text-[#f3ece0] max-w-2xl">
          Contamos con un portafolio variado de productos para consumo y elaboración artesanal e industrial.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e8dcc4] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#8d6e63] absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar en el catálogo..."
            className="w-full bg-[#fdfaf5] border border-[#e8dcc4] rounded-xl py-2 pl-9 pr-3 text-xs text-[#3d2516] placeholder-[#8d6e63] focus:outline-none focus:border-[#b05d2e]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#603813] text-white font-bold'
                  : 'bg-[#f3ece0] text-[#4a3224] hover:bg-[#e8dcc4]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            onClick={() => onSelectProduct(p)}
            className="bg-white rounded-2xl border border-[#e8dcc4] hover:border-[#b05d2e] transition-all cursor-pointer overflow-hidden group shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            <div className="relative h-48 bg-[#fdf5e6] overflow-hidden">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-white/90 text-[#3d2516] font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-[#e8dcc4]">
                {p.code}
              </div>
            </div>

            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between text-left">
              <div>
                <h3 className="font-serif font-bold text-base text-[#3d2516] group-hover:text-[#b05d2e] transition-colors">
                  {p.name}
                </h3>
                <p className="text-[11px] text-[#b05d2e] font-bold mt-0.5">
                  {p.package_size}
                </p>
                <p className="text-xs text-[#6d4c41] line-clamp-2 mt-1">
                  {p.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#e8dcc4] flex items-center justify-between text-xs text-[#b05d2e] font-bold">
                <span>Ver Ficha Técnica</span>
                <ChevronRight className="w-4 h-4 text-[#b05d2e]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
