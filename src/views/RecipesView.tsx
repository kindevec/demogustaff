import React, { useState } from 'react';
import { Recipe, Language } from '../types';
import { INITIAL_RECIPES } from '../data/initialData';
import { TRANSLATIONS } from '../data/translations';
import { AnimatedSection } from '../components/AnimatedSection';
import { ChefHat, Clock, Users, CheckCircle2 } from 'lucide-react';

interface RecipesViewProps {
  lang: Language;
  onThemeColorChange?: (color: string) => void;
}

export const RecipesView: React.FC<RecipesViewProps> = React.memo(({ lang, onThemeColorChange }) => {
  const t = TRANSLATIONS[lang].recipesPage;
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(INITIAL_RECIPES[0]);

  // Sync header theme color to parent (Navbar)
  React.useEffect(() => {
    onThemeColorChange?.('#3A1B12');
    return () => {
      onThemeColorChange?.('');
    };
  }, [onThemeColorChange]);

  return (
    <div className="text-white font-sans selection:bg-[#b05d2e] selection:text-white space-y-12 pb-16">
      
      {/* =========================================================================
          1. HEADER BANNER — Edge-to-Edge ProductsView/AboutView Style
         ========================================================================= */}
      <div className="relative overflow-hidden transition-colors duration-700 ease-in-out h-[520px] sm:h-[620px] lg:h-[700px] bg-[#3A1B12] group">
        {/* Background Image (Absolute Fill) with smooth page load zoom */}
        <img
          src="/images/bodegon/recetas.webp"
          alt="Recetas Gustaff S.A."
          className="absolute inset-0 w-full h-full object-cover object-center z-0 animate-hero-zoom"
        />
        
        {/* Left Gradient Overlay — Exact ProductsView/AboutView Style */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none" 
          style={{ 
            background: 'linear-gradient(to right, #3A1B12ee 0%, #3A1B12cc 30%, #3A1B1288 50%, transparent 75%)' 
          }} 
        />

        {/* Mobile Bottom Shade */}
        <div className="absolute inset-x-0 bottom-0 h-56 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent sm:hidden pointer-events-none" />

        {/* Text Content Overlay */}
        <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col justify-center text-left space-y-4 sm:space-y-5">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-extrabold tracking-wider uppercase w-fit border border-white/20 shadow-lg bg-[#e86014] text-white">
            <ChefHat className="w-4 h-4 text-white" />
            <span>{t.badge}</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight max-w-3xl drop-shadow-lg">
            {t.title}
          </h1>

          {/* Subtitle / Description */}
          <p className="text-sm sm:text-base text-white/80 max-w-xl leading-relaxed drop-shadow-sm font-serif italic border-l-2 border-[#e86014] pl-3">
            "{t.subtitle}"
          </p>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recipe Selector */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#3d2516]">
            {t.featuredHeading}
          </h3>

          <div className="space-y-3">
            {INITIAL_RECIPES.map((rec) => (
              <div
                key={rec.id}
                onClick={() => setSelectedRecipe(rec)}
                className={`p-4 rounded-2xl border transition-all duration-300 transform hover:scale-[1.01] cursor-pointer flex gap-4 items-center text-left ${
                  selectedRecipe?.id === rec.id
                    ? 'bg-[#603813] text-white border-[#d4af37] shadow-md'
                    : 'bg-white border-[#e8dcc4] hover:bg-[#f3ece0] text-[#3d2516]'
                }`}
              >
                <img
                  src={rec.image}
                  alt={rec.title}
                  className="w-20 h-20 object-cover rounded-xl shrink-0"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    selectedRecipe?.id === rec.id
                      ? 'bg-[#d4af37] text-[#3d2516]'
                      : 'bg-[#f3ece0] text-[#b05d2e]'
                  }`}>
                    {rec.featured_product_name}
                  </span>
                  <h4 className={`font-serif font-bold text-sm mt-1 ${
                    selectedRecipe?.id === rec.id ? 'text-white' : 'text-[#3d2516]'
                  }`}>
                    {rec.title}
                  </h4>
                  <div className={`flex items-center gap-3 text-[11px] mt-1 ${
                    selectedRecipe?.id === rec.id ? 'text-[#f3ece0]' : 'text-[#6d4c41]'
                  }`}>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#b05d2e]" /> {rec.prep_time}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3 text-[#b05d2e]" /> {rec.servings}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Selected Recipe Details */}
        {selectedRecipe && (
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8dcc4] shadow-sm space-y-6 text-left">
              <div className="relative h-64 rounded-2xl overflow-hidden group">
                <img
                  src={selectedRecipe.image}
                  alt={selectedRecipe.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-xl border border-[#e8dcc4] shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-[#b05d2e]">{t.keyIngredient}</span>
                  <p className="text-xs font-bold text-[#3d2516]">{selectedRecipe.featured_product_name}</p>
                </div>
              </div>

              <div>
                <h2 className="font-serif font-bold text-2xl text-[#3d2516]">
                  {selectedRecipe.title}
                </h2>
                <p className="text-xs text-[#6d4c41] mt-1 leading-relaxed">
                  {selectedRecipe.description}
                </p>
              </div>

              {/* Ingredients */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase text-[#b05d2e] tracking-wider">
                  {t.ingredientsRequired}
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#4a3224]">
                  {selectedRecipe.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-center gap-2 bg-[#fdfaf5] p-2.5 rounded-xl border border-[#e8dcc4]">
                      <CheckCircle2 className="w-4 h-4 text-[#b05d2e] shrink-0" />
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Preparation Steps */}
              <div className="space-y-2 pt-2 border-t border-[#e8dcc4]">
                <h4 className="font-bold text-xs uppercase text-[#b05d2e] tracking-wider">
                  {t.stepByStep}
                </h4>
                <ol className="space-y-2 text-xs text-[#4a3224]">
                  {selectedRecipe.instructions.map((inst, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-[#fdfaf5] p-3 rounded-xl border border-[#e8dcc4]">
                      <span className="w-5 h-5 rounded-full bg-[#603813] text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{inst}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
});
