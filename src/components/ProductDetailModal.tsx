import React from 'react';
import { Product, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { X, Download, MessageSquare, Check, Sparkles, Package, FileText, ArrowRight } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenAuth: () => void;
  onRequestQuote: (prod: Product) => void;
  lang: Language;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenAuth,
  onRequestQuote,
  lang
}) => {
  if (!product) return null;
  const t = TRANSLATIONS[lang].productModal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white text-[#3d2516] rounded-2xl sm:rounded-3xl shadow-2xl border border-[#e8dcc4] my-auto max-h-[92vh] flex flex-col overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 rounded-full bg-white/90 text-[#3d2516] hover:bg-white transition-colors shadow-md border border-[#e8dcc4] cursor-pointer"
          aria-label={t.closeAria || 'Cerrar'}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 overflow-y-auto max-h-[92vh]">
          {/* Product Image Box */}
          <div className="relative h-48 sm:h-full min-h-[180px] bg-[#fdf5e6]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#603813] text-white font-mono font-bold text-xs px-2.5 py-1 rounded-lg shadow">
              {product.code}
            </div>
          </div>

          {/* Product Content Details */}
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 flex flex-col justify-between text-left">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#b05d2e] bg-[#f3ece0] px-2.5 py-1 rounded-full border border-[#e8dcc4] inline-block mb-2">
                {t.presentation}: {product.package_size}
              </span>

              <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#3d2516]">
                {product.name}
              </h3>

              <p className="text-xs text-[#6d4c41] leading-relaxed mt-2">
                {product.description}
              </p>

              {/* Technical Features */}
              {product.features && product.features.length > 0 && (
                <div className="mt-3 sm:mt-4 pt-3 border-t border-[#e8dcc4] space-y-1.5">
                  <p className="text-xs font-bold text-[#3d2516]">{t.featuredAttributes}</p>
                  <ul className="space-y-1">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="text-[11px] text-[#4a3224] flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#b05d2e] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-3 sm:pt-4 border-t border-[#e8dcc4] space-y-2">
              <button
                onClick={() => {
                  onClose();
                  onRequestQuote(product);
                }}
                className="w-full bg-[#603813] hover:bg-[#3d2516] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#d4af37]" />
                {t.requestQuoteBtn}
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="w-full bg-[#f3ece0] hover:bg-[#e8dcc4] text-[#603813] border border-[#e8dcc4] font-semibold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#b05d2e]" />
                {t.downloadPdfBtn}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
