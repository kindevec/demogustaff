import React, { useState } from 'react';
import { Recipe, Language } from '../../types';
import { INITIAL_RECIPES } from '../../data/initialData';
import { TRANSLATIONS } from '../../data/translations';
import { AnimatedSection } from '../../components/AnimatedSection';
import { 
  ChefHat, 
  Clock, 
  Users, 
  CheckCircle2, 
  Sparkles,
  BookOpen,
  ChevronRight,
  ArrowLeft,
  X
} from 'lucide-react';

interface MobileRecipesViewProps {
  lang: Language;
  onThemeColorChange?: (color: string) => void;
}

export const MobileRecipesView: React.FC<MobileRecipesViewProps> = React.memo(({ lang, onThemeColorChange }) => {
  const t = TRANSLATIONS[lang].recipesPage;
  const [activeRecipeDetail, setActiveRecipeDetail] = useState<Recipe | null>(null);

  // Sync header theme color to parent (Navbar)
  React.useEffect(() => {
    onThemeColorChange?.('#3A1B12');
    return () => {
      onThemeColorChange?.('');
    };
  }, [onThemeColorChange]);

  return (
    <div className="bg-[#fdfaf5] text-[#4a3224] font-sans selection:bg-[#b05d2e] selection:text-white space-y-6 pb-0 -mb-[8px]">
      
      {/* =========================================================================
          1. HERO HEADER SECTION — MOBILE EXCLUSIVE (Identical Design to previous tabs)
          - Uniform height (h-[260px] xs:h-[280px] sm:h-[300px])
          - Full-width background image with left gradient overlay
          - Content text aligned strictly to the left (text-left items-start)
         ========================================================================= */}
      <div 
        className="relative overflow-hidden transition-colors duration-700 ease-in-out w-full h-[260px] xs:h-[280px] sm:h-[300px] group bg-[#3A1B12]"
      >
        {/* Full Width Background Image */}
        <img
          src="/images/bodegon/recetas.webp"
          alt="Recetas Gustaff S.A."
          className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700"
        />

        {/* Gradient Shade for High Text Contrast */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none transition-all duration-700" 
          style={{ 
            background: `linear-gradient(to right, #3A1B12fa 0%, #3A1B12d0 45%, #3A1B1277 75%, transparent 100%)` 
          }} 
        />

        <div className="absolute inset-x-0 bottom-0 h-20 z-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

        {/* Left-Aligned Text Content Overlay */}
        <div className="relative z-20 h-full w-full px-5 sm:px-8 pt-[20px] flex flex-col justify-start text-left items-start space-y-3 max-w-lg">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase text-left border border-white/20 shadow-md bg-[#e86014] text-white">
            <ChefHat className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="truncate">{t.badge}</span>
          </div>

          {/* Title Line 1 + Accent */}
          <h1 className="font-serif font-black text-2xl xs:text-3xl sm:text-4xl text-white leading-tight uppercase text-left drop-shadow-md">
            RECETAS <span className="text-[#e86014] font-serif italic">GUSTAFF</span>
          </h1>

          {/* Description Paragraph (+20px width, occupies +20px bottom space) */}
          <p className="text-xs xs:text-sm text-white/90 leading-relaxed font-serif italic border-l-2 border-[#e86014] pl-3 text-left max-w-[185px] drop-shadow-sm line-clamp-4 mt-2">
            "{t.subtitle}"
          </p>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 space-y-6">

        {/* =========================================================================
            2. VERTICAL COLUMN RECIPE LIST
           ========================================================================= */}
        <AnimatedSection animation="fade-up" delay={150}>
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <h3 className="font-serif font-bold text-base text-[#3d2516] text-left">
                {t.featuredHeading}
              </h3>
              <span className="text-[10px] text-[#b05d2e] font-bold uppercase tracking-wider bg-[#f3ece0] px-2.5 py-0.5 rounded-full border border-[#e8dcc4]">
                {INITIAL_RECIPES.length} Recetas
              </span>
            </div>

            <div className="space-y-3">
              {INITIAL_RECIPES.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => setActiveRecipeDetail(rec)}
                  className="bg-white p-3.5 rounded-2xl border border-[#e8dcc4] shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-3.5 items-center text-left group"
                >
                  <img
                    src={rec.image}
                    alt={rec.title}
                    className="w-20 h-20 object-cover rounded-xl shrink-0 group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full inline-block bg-[#f3ece0] text-[#b05d2e] truncate max-w-full">
                      {rec.featured_product_name}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-[#3d2516] leading-snug line-clamp-1 group-hover:text-[#b05d2e] transition-colors">
                      {rec.title}
                    </h4>
                    <p className="text-[10px] text-[#6d4c41] line-clamp-2 leading-tight">
                      {rec.description}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-[#b05d2e] font-semibold pt-0.5">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {rec.prep_time}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {rec.servings}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#b05d2e] shrink-0 group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

      </div>

      {/* =========================================================================
          3. FULL TAB RECIPE DETAIL MODAL OVERLAY (X Close Button in Top Right)
         ========================================================================= */}
      {activeRecipeDetail && (
        <div className="fixed inset-0 z-50 bg-[#fdfaf5] overflow-y-auto p-4 sm:p-6 pb-24 text-left animate-fade-in">
          
          {/* Top Right Floating X Close Button */}
          <button
            onClick={() => setActiveRecipeDetail(null)}
            className="fixed top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-[#3d2516] border border-[#e8dcc4] shadow-lg hover:bg-[#b05d2e] hover:text-white transition-all z-50 cursor-pointer active:scale-95"
            aria-label="Cerrar receta"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Full Recipe Content Area (Direct Flow - No Inner Card Frame) */}
          <div className="max-w-md mx-auto space-y-5 mt-2">
            
            {/* Cover Image & Key Ingredient Badge */}
            <div className="relative h-56 rounded-2xl overflow-hidden group shadow-md border border-[#e8dcc4]">
              <img
                src={activeRecipeDetail.image}
                alt={activeRecipeDetail.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#e8dcc4] shadow-sm">
                <span className="text-[9px] uppercase font-bold text-[#b05d2e] block">{t.keyIngredient}</span>
                <p className="text-xs font-bold text-[#3d2516]">{activeRecipeDetail.featured_product_name}</p>
              </div>
            </div>

            {/* Recipe Title & Stats */}
            <div className="space-y-2">
              <h2 className="font-serif font-bold text-2xl text-[#3d2516] leading-tight">
                {activeRecipeDetail.title}
              </h2>
              <p className="text-xs text-[#6d4c41] leading-relaxed">
                {activeRecipeDetail.description}
              </p>

              <div className="flex items-center gap-4 pt-2 text-xs font-bold text-[#b05d2e]">
                <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-[#e8dcc4] shadow-sm">
                  <Clock className="w-4 h-4" />
                  <span>{activeRecipeDetail.prep_time}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-[#e8dcc4] shadow-sm">
                  <Users className="w-4 h-4" />
                  <span>{activeRecipeDetail.servings}</span>
                </div>
              </div>
            </div>

            {/* Ingredients List */}
            <div className="space-y-2.5 pt-3 border-t border-[#e8dcc4]">
              <h4 className="font-bold text-xs uppercase text-[#b05d2e] tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>{t.ingredientsRequired}</span>
              </h4>
              <ul className="grid grid-cols-1 gap-2 text-xs text-[#4a3224]">
                {activeRecipeDetail.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-[#e8dcc4] shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#b05d2e] shrink-0" />
                    <span className="leading-snug">{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step-by-step Instructions */}
            <div className="space-y-2.5 pt-3 border-t border-[#e8dcc4]">
              <h4 className="font-bold text-xs uppercase text-[#b05d2e] tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>{t.stepByStep}</span>
              </h4>
              <ol className="space-y-2.5 text-xs text-[#4a3224]">
                {activeRecipeDetail.instructions.map((inst, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#e8dcc4] shadow-sm">
                    <span className="w-5 h-5 rounded-full bg-[#603813] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{inst}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Bottom Action Button */}
            <div className="pt-2">
              <button
                onClick={() => setActiveRecipeDetail(null)}
                className="w-full py-3 rounded-xl bg-[#603813] text-white font-bold text-xs shadow-md hover:bg-[#b05d2e] transition-all cursor-pointer active:scale-98"
              >
                Cerrar Receta
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
});

MobileRecipesView.displayName = 'MobileRecipesView';
