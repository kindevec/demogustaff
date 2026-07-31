import React, { useState } from 'react';
import { Recipe, Language } from '../types';
import { INITIAL_RECIPES } from '../data/initialData';
import { ChefHat, Clock, Users, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

interface RecipesViewProps {
  lang: Language;
}

export const RecipesView: React.FC<RecipesViewProps> = ({ lang }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(INITIAL_RECIPES[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="bg-[#603813] text-white p-8 sm:p-12 rounded-3xl border border-[#d4af37]/30 shadow-xl text-left space-y-3">
        <span className="text-xs font-bold text-[#d4af37] uppercase tracking-widest bg-white/10 px-3.5 py-1 rounded-full border border-white/20 inline-flex items-center gap-1.5">
          <ChefHat className="w-4 h-4 text-[#d4af37]" />
          <span>Inspiración Pastelera</span>
        </span>

        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-white">
          Recetas Elaboradas con Productos Gustaff
        </h1>

        <p className="text-xs sm:text-sm text-[#f3ece0] max-w-2xl">
          Descubre fórmulas probadas en nuestra cocina de aplicaciones usando Cocoa Alcalina, Gotas Termoestables y Galletas Sanduche Gustaff.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recipe Selector */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#3d2516]">
            Recetas Destacadas
          </h3>

          <div className="space-y-3">
            {INITIAL_RECIPES.map((rec) => (
              <div
                key={rec.id}
                onClick={() => setSelectedRecipe(rec)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 items-center text-left ${
                  selectedRecipe?.id === rec.id
                    ? 'bg-[#603813] text-white border-[#d4af37] shadow-md'
                    : 'bg-white border-[#e8dcc4] hover:bg-[#f3ece0] text-[#3d2516]'
                }`}
              >
                <img
                  src={rec.image}
                  alt={rec.title}
                  className="w-20 h-20 object-cover rounded-xl shrink-0"
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
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#e8dcc4] shadow-sm space-y-6 text-left">
            <div className="relative h-64 rounded-2xl overflow-hidden">
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-xl border border-[#e8dcc4] shadow-sm">
                <span className="text-[10px] uppercase font-bold text-[#b05d2e]">Ingrediente Clave:</span>
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
                Ingredientes Necesarios:
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
                Paso a Paso de Preparación:
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
        )}
      </div>
    </div>
  );
};
