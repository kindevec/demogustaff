# Language Toggle & State Management Analysis — demogustaff

## Executive Summary
This report analyzes the language toggle mechanism and language state management within the **demogustaff** project (`c:/Users/mkmcm/AA Miyako/DevEC/Trabajos Kindev/Gustaff/demogustaff`).
While the top-level state setter `setLang` correctly updates the `lang` state in `App.tsx` upon clicking the language buttons in `Navbar.tsx`, the UI fails to translate most of the application because **over 80% of UI strings, slider content, filter options, card labels, and view headers are hardcoded in Spanish** instead of accessing `TRANSLATIONS[lang]`. Furthermore, data models (`Product`, `Recipe`, `SiteContent`) lack English fields, and `translations.ts` is incomplete.

---

## 1. Navbar / Header Language Toggle Component Location
- **Primary Component**: `src/components/Navbar.tsx`
- **Desktop Toggle Buttons** (Lines 76–95):
  ```tsx
  {/* Language Switcher */}
  <div className="flex items-center bg-[#f3ece0] rounded-full p-0.5 border border-[#e8dcc4]">
    <Globe className="w-3 h-3 text-[#b05d2e] ml-1.5 mr-1" />
    <button
      onClick={() => setLang('es')}
      className={`px-2 py-0.5 text-[11px] font-bold rounded-full transition-all cursor-pointer ${
        lang === 'es' ? 'bg-[#603813] text-white' : 'text-[#6d4c41] hover:text-[#3d2516]'
      }`}
    >
      Es
    </button>
    <button
      onClick={() => setLang('en')}
      className={`px-2 py-0.5 text-[11px] font-bold rounded-full transition-all cursor-pointer ${
        lang === 'en' ? 'bg-[#603813] text-white' : 'text-[#6d4c41] hover:text-[#3d2516]'
      }`}
    >
      En
    </button>
  </div>
  ```
- **Mobile Drawer Toggle Buttons** (Lines 321–338):
  ```tsx
  <div className="flex items-center bg-[#f3ece0] rounded-full p-1 border border-[#e8dcc4]">
    <button
      onClick={() => setLang('es')}
      className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
        lang === 'es' ? 'bg-[#603813] text-white' : 'text-[#6d4c41]'
      }`}
    >
      Español
    </button>
    <button
      onClick={() => setLang('en')}
      className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
        lang === 'en' ? 'bg-[#603813] text-white' : 'text-[#6d4c41]'
      }`}
    >
      English
    </button>
  </div>
  ```

---

## 2. Declaration & Flow of Language State
- **State Declaration**: Defined in root component `src/App.tsx` (Line 23):
  ```tsx
  const [lang, setLang] = useState<Language>('es');
  ```
- **Prop Drilling**:
  `App.tsx` passes `lang` and `setLang` down to `Navbar.tsx` (Lines 64–74):
  ```tsx
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
  ```
  `App.tsx` also passes `lang` as a prop to all view components (`HomeView`, `AboutView`, `ProductsView`, `IndustrialView`, `RecipesView`, `ContactView`, `RestrictedZoneView`, `AdminView`) and components (`Footer`, `BottomNav`, `AuthModal`, `ProductDetailModal`).
- **Translation Object**: `src/data/translations.ts` exports `TRANSLATIONS` containing `es` and `en` dictionaries.

---

## 3. Root Cause Analysis of the Toggle Bug

### Root Cause A: Widespread Hardcoded Spanish Text in Views & Components
Although `lang` is passed to components, most views bypass `TRANSLATIONS[lang]` and render hardcoded Spanish strings.

1. **`src/views/HomeView.tsx`**:
   - `slides` array (Lines 45–126): Taglines (`"✦ DESDE 1998 EN ECUADOR"`), titles (`"COBERTURAS DE CHOCOLATE"`, `"& GOTAS TERMOESTABLES"`), descriptions, and button text (`"Explorar Cacaos"`, `"Ver Galletería"`, `"Solicitar Maquila"`) are hardcoded in Spanish.
   - Feature Ribbon Bar (Lines 283–332): Titles (`"Ingredientes Puros"`, `"Maquila Industrial"`, `"Normas HACCP & BPM"`, `"Hecho con Pasión"`) and descriptions are hardcoded in Spanish.
   - Featured Catalog Section (Lines 348, 351, 417, 432): Headers and buttons (`"Selección Especial de Materia Prima"`, `"Nuestras Coberturas & Cacaos Estrella"`, `"Ver Catálogo Completo de Productos"`) are hardcoded in Spanish.
   - About Us & Industrial Sections (Lines 459, 474, 489, 516, 537): `"Años de Experiencia Industrial"`, `"SOBRE GUSTAFF S.A."`, `"Maquilamos Tu Emprendimiento Corporativo"`, etc., are hardcoded in Spanish.
   - Quality Policy Banner (Lines 578, 590): `"Compromiso de Inocuidad & Seguridad Alimentaria"`, `"Leer Política de Calidad"` are hardcoded in Spanish.

2. **`src/components/Navbar.tsx`**:
   - Top banner announcement (Line 67: `"GUSTAFF S.A. | Fábrica de Chocolates, Coberturas y Galletas desde 1998"`) is hardcoded.
   - Desktop action buttons (Line 176: `"Área Clientes"`, Line 185: `"Panel Admin"`) are hardcoded.
   - Mobile Drawer items (Lines 218, 251, 257, 268, 277, 290, 307) are hardcoded in Spanish.

3. **`src/views/AboutView.tsx`**:
   - Subtitle (Lines 71–72), breadcrumb (Lines 81, 84), floating quote (Lines 108–112), section titles (`"QUIÉNES SOMOS"`, `"Pasión por el Cacao, Tradición e Innovación Alimentaria"`), metric labels (Lines 176–188), superimposed cards (Lines 232–252), and button text are hardcoded in Spanish.

4. **`src/views/ProductsView.tsx`**:
   - Header (Lines 42, 45, 49), category filter buttons (Lines 22–28: `"Todos los Productos"`, `"Insumos Industriales"`, `"Coberturas de Chocolate"`, `"Polvos de Cacao"`, `"Galletería"`), search placeholder (Line 62: `"Buscar en el catálogo..."`), and card action (Line 117: `"Ver Ficha Técnica"`) are hardcoded in Spanish.

5. **`src/views/IndustrialView.tsx`**:
   - Banner title (Line 60: `"Maquilamos tus emprendimientos"`), quote request form labels/placeholders (Lines 181–241), search placeholder (Line 86), and packaging filter array (Line 95: `"Todos los Empaques"`) are hardcoded in Spanish.

6. **`src/views/RecipesView.tsx`**:
   - Page header (Lines 19, 23, 27), section headers (Lines 34, 105, 120: `"Recetas Destacadas"`, `"Ingredientes Necesarios:"`, `"Paso a Paso de Preparación:"`) are hardcoded in Spanish.

7. **`src/views/ContactView.tsx`**:
   - Institutional info titles (Lines 180, 189, 199, 219), form labels/placeholders (Lines 85, 111, 125, 139, 153), and submit button fallback (Line 170) are hardcoded in Spanish.

8. **`src/components/Footer.tsx`**:
   - Top location ribbon items (Lines 40, 55, 70, 85: `"NUESTRA PLANTA"`, `"HORARIO ATENCIÓN"`, `"LÍNEAS DIRECTAS"`, `"DESPACHOS NACIONALES"`), navigation links array (Lines 143–149), certifications section (Lines 170–191), and copyright text (Lines 223–236) are hardcoded in Spanish.

### Root Cause B: Data Models Lack Multilingual Fields
- **`Product`** objects in `src/data/initialData.ts` and Supabase have single-language properties (`name`, `description`, `features`, `package_size`, `category`).
- **`Recipe`** objects in `src/data/initialData.ts` have single-language properties (`title`, `description`, `ingredients`, `instructions`).
- **`SiteContent`** in Supabase/localStorage stores single-language text (`home_headline`, `home_quienes_somos`, `about_history`, `about_mision`, `about_vision`, `about_politica_calidad`).

### Root Cause C: Incomplete `TRANSLATIONS` Object
- `src/data/translations.ts` lacks dictionaries for `productsPage`, `recipesPage`, `homePage` (slider banners, cards, headers), filter category names, and `footer` ribbon labels.

### Root Cause D: Lack of Global Context (Prop Drilling)
- Passing `lang` as a prop down multiple component layers creates vulnerability where subcomponents easily omit or fail to utilize the prop.

---

## 4. Summary Table of Bug Locations

| File | Line Numbers | Description of Issue |
|---|---|---|
| `src/App.tsx` | 23, 64-166 | State `lang` declared locally and passed via props instead of React Context. |
| `src/data/translations.ts` | 1-163 | Missing translation keys for `home`, `products`, `recipes`, `industrial`, `footer` ribbon, and filters. |
| `src/components/Navbar.tsx` | 67, 176, 185, 218-308 | Top banner, action buttons, and drawer tools contain hardcoded Spanish text. |
| `src/views/HomeView.tsx` | 45-126, 283-332, 348-592 | Hero slides array, feature cards, headers, catalog section, and banners use hardcoded Spanish. |
| `src/views/AboutView.tsx` | 71-84, 108-160, 176-188, 213-252 | Subtitle, breadcrumbs, quote cards, metrics, and superimposed cards are hardcoded in Spanish. |
| `src/views/ProductsView.tsx` | 22-28, 42-63, 117 | Category array, header, search placeholder, and card action buttons are hardcoded in Spanish. |
| `src/views/IndustrialView.tsx` | 55-75, 86, 95-107, 181-241 | Banner text, search/packaging filters, and quote form labels/placeholders are hardcoded in Spanish. |
| `src/views/RecipesView.tsx` | 19-35, 105-133 | Header, section titles, ingredients label, and step-by-step labels are hardcoded in Spanish. |
| `src/views/ContactView.tsx` | 85-170, 180-241 | Form title, inputs, placeholders, and sidebar info titles are hardcoded in Spanish. |
| `src/components/Footer.tsx` | 40-90, 110-149, 170-236 | Top ribbon items, brand bio, link labels array, certifications, and copyright are hardcoded in Spanish. |
| `src/data/initialData.ts` | 1-250 | `Product` and `Recipe` items have single-language Spanish fields. |

---

## 5. Concrete Fix Strategy

1. **Introduce React Language Context (`LanguageContext`)**:
   - Create `src/context/LanguageContext.tsx` storing `lang: Language`, `setLang: (lang: Language) => void`, and `t: typeof TRANSLATIONS['es']`.
   - Wrap `<App />` with `<LanguageProvider>` in `src/main.tsx`.
   - Replace prop drilling with `useLanguage()` custom hook.

2. **Expand `src/data/translations.ts`**:
   - Add comprehensive English and Spanish translation objects for:
     - `nav` (top banner, drawer headers, admin panel buttons, client area buttons).
     - `home` (all 4 hero slides taglines, titles, descriptions, primary button text; feature ribbon cards; section headers; quality banner).
     - `productsPage` (header, categories array: `All`, `Industrial`, `Coatings`, `Cocoa`, `Cookies`; search placeholder; card action).
     - `industrialPage` (banner titles, packaging filters: `All`, `Bags`, `Boxes`, `Jugs`; quote request form labels, placeholders, success messages).
     - `recipesPage` (header, key ingredient label, ingredients list label, preparation steps label).
     - `aboutPage` (subtitle, breadcrumbs, metrics bar, superimposed banner cards).
     - `footer` (top ribbon 4 items, main nav links array, certifications, copyright text).

3. **Provide Multilingual Field Resolvers for Products and Recipes**:
   - Create a translation map in `data/translations.ts` or add optional `name_en`, `description_en`, `category_en` to `Product` and `Recipe` data objects.
   - Use helper function `getLocalizedProduct(product, lang)` and `getLocalizedRecipe(recipe, lang)` to dynamically resolve localized strings.

4. **Refactor Components to Use `t` Dictionary**:
   - Replace all static Spanish strings in `Navbar.tsx`, `HomeView.tsx`, `AboutView.tsx`, `ProductsView.tsx`, `IndustrialView.tsx`, `RecipesView.tsx`, `ContactView.tsx`, `RestrictedZoneView.tsx`, `Footer.tsx`, `BottomNav.tsx`, `AuthModal.tsx`, and `ProductDetailModal.tsx` with dynamic lookup `t.section.key`.
