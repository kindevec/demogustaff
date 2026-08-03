# Translation Data Structure & Component String Audit Report

**Project Root**: `c:/Users/mkmcm/AA Miyako/DevEC/Trabajos Kindev/Gustaff/demogustaff`  
**Explorer**: Explorer 2 (Translation & Component Audit Explorer)  
**Date**: 2026-07-31  

---

## Executive Summary
This report presents a thorough investigation of the `TRANSLATIONS` data structure and a systematic audit of all 18 React component and view files in `src/`. The audit identified the current state of localization, detailed every hardcoded user-facing string (English and Spanish) missing translation key references, and mapped out a complete proposal to expand `TRANSLATIONS` in `src/data/translations.ts` for both Spanish (`es`) and English (`en`).

---

## 1. Existing `TRANSLATIONS` Data Structure Analysis

* **File Location**: `src/data/translations.ts` (163 lines, 6,496 bytes)
* **TypeScript Interface / Structure**:
  ```ts
  export const TRANSLATIONS = {
    es: { ... },
    en: { ... }
  };
  ```

### Current Keys Summary (`es` & `en`)

| Top-Level Category | Sub-Keys Included | Description |
| :--- | :--- | :--- |
| `nav` | `home`, `about`, `products`, `industrial`, `recipes`, `contact`, `downloads`, `admin` | Main header and bottom navigation items |
| `hero` | `badge`, `title`, `subtitle`, `btnCatalog`, `btnContact`, `btnDownloads` | Hero section titles and primary CTA buttons |
| `sections` | `aboutSummaryTitle`, `productsSummaryTitle`, `industrialSummaryTitle`, `recipesTitle`, `qualityTitle` | Main landing section headings |
| `industrialPage` | `title`, `subtitle`, `downloadTechSheets`, `requestQuote`, `packaging`, `code` | Industrial line page header & labels |
| `aboutPage` | `historyTitle`, `misionTitle`, `visionTitle`, `qualityTitle`, `commitmentsTitle` | About page section headers |
| `contactPage` | `title`, `intro`, `name`, `email`, `subject`, `message`, `send`, `address`, `phones`, `whatsapp`, `successMsg` | Contact view form fields, buttons & labels |
| `downloadsPage` | `title`, `subtitle`, `authNotice`, `btnLoginRegister`, `btnDownloadNow`, `restrictedLabel` | Restricted technical download zone header & CTAs |
| `authModal` | `registerTitle`, `loginTitle`, `name`, `email`, `companyPhone`, `password`, `submitRegister`, `submitLogin`, `noAccount`, `hasAccount` | Registration & sign-in modal labels |
| `footer` | `rights`, `plantAddress`, `social` | Basic footer rights, plant address, social title |

---

## 2. Systematic Audit of React Components & Views

Every `.tsx` component and view under `src/` was audited for localization compliance:

| File Path | Uses `TRANSLATIONS` | Audit Status & Summary |
| :--- | :---: | :--- |
| `src/App.tsx` | Partial (passes `lang`) | Pure router container; passes `lang` state to all children. |
| `src/components/AnimatedSection.tsx` | No | Pure animation wrapper component; no user text. |
| `src/components/SocialIcons.tsx` | No | Pure SVG icon definitions; no user text. |
| `src/components/ReCaptchaWidget.tsx` | No | **Hardcoded Spanish**: reCAPTCHA status, verification state & terms. |
| `src/components/WhatsAppWidget.tsx` | No | **Hardcoded Spanish**: Floating popup greetings, status, placeholders, buttons. |
| `src/components/CookieBanner.tsx` | No | **Hardcoded Spanish**: Full cookie consent banner text, category descriptions, buttons. |
| `src/components/Navbar.tsx` | Yes (`t.nav`) | Uses `t.nav` for nav items, but has **hardcoded Spanish** in top bar, mobile drawer, badges, titles. |
| `src/components/BottomNav.tsx` | Yes (`t.nav`) | Fully localized; uses `t.nav` keys for mobile tab labels. |
| `src/components/Footer.tsx` | Imported, Unused | Imports `t.footer`, but **never uses it** in JSX! 100% of text is hardcoded Spanish. |
| `src/components/AuthModal.tsx` | Yes (`t.authModal`) | Uses `t.authModal` for form labels, but has **hardcoded Spanish** error messages, placeholders, subtitle. |
| `src/components/ProductDetailModal.tsx` | No | **Hardcoded Spanish**: Modal labels, feature headings, action CTA buttons. |
| `src/views/HomeView.tsx` | Yes (`t.hero`) | Uses `t.hero` for some slider buttons, but has **hardcoded Spanish** in all 4 slides, ribbon cards, sections. |
| `src/views/AboutView.tsx` | Yes (`t.aboutPage`) | Uses `t.aboutPage` for mission/vision titles, but has **hardcoded Spanish** in hero, history, metrics, philosophy. |
| `src/views/ProductsView.tsx` | No | **Hardcoded Spanish**: Header, search bar placeholder, category filters, card details button. |
| `src/views/IndustrialView.tsx` | Yes (`t.industrialPage`)| Uses `t.industrialPage.subtitle`, but has **hardcoded Spanish** in banner badge, titles, quote form, placeholders. |
| `src/views/RecipesView.tsx` | No | **Hardcoded Spanish**: Header, recipe sidebar, ingredient headings, step-by-step labels. |
| `src/views/ContactView.tsx` | Yes (`t.contactPage`) | Uses `t.contactPage` for form labels, but has **hardcoded Spanish** error messages, submit button states, info card. |
| `src/views/RestrictedZoneView.tsx` | Yes (`t.downloadsPage`)| Uses `t.downloadsPage` for header, but has **hardcoded Spanish** search placeholder, session banner, badges, CTAs. |
| `src/views/AdminView.tsx` | No | Admin CMS management panel; internal dashboard interface in Spanish. |

---

## 3. Comprehensive Inventory of Hardcoded User-Facing Strings

Below is the complete inventory of hardcoded strings in components that currently lack `TRANSLATIONS` references:

### A. Core Components (`src/components/`)

#### 1. `src/components/ReCaptchaWidget.tsx`
* Line 38: `"No soy un robot (Verificado)"` / `"No soy un robot"`
* Line 45: `"Privacidad - Términos"`

#### 2. `src/components/WhatsAppWidget.tsx`
* Line 13: Default WhatsApp text: `"Hola Gustaff S.A., me gustaría solicitar información sobre sus productos industriales y coberturas."`
* Line 31: Title: `"Atención al Cliente Gustaff"`
* Line 34: Subtitle: `"En línea (+593 96 971 8045)"`
* Line 50: Greeting title: `"¡Hola! Bienvenido a Gustaff S.A."`
* Line 53: Greeting body: `"¿En qué podemos ayudarte hoy? Solicita fichas técnicas, cotizaciones para maquila o muestras de coberturas."`
* Line 61: Textarea placeholder: `"Escribe tu mensaje o consulta..."`
* Line 69: Button text: `"Iniciar Chat en WhatsApp"`
* Line 80: Accessibility label: `"Contactar por WhatsApp"`

#### 3. `src/components/CookieBanner.tsx`
* Line 49: Banner title: `"Privacidad y Tratamiento de Datos - Gustaff S.A."`
* Line 52: Banner text: `"Utilizamos cookies para optimizar la navegación en nuestro catálogo industrial, gestionar la descarga segura de fichas técnicas y analizar el uso del sitio de acuerdo con la Ley Orgánica de Protección de Datos Personales del Ecuador."`
* Line 63: Button: `"Configurar"`
* Line 70: Button: `"Aceptar Todas"`
* Line 80: Cat 1 Title: `"Cookies Necesarias"`
* Line 81: Cat 1 Badge: `"Obligatorias"`
* Line 84: Cat 1 Text: `"Permiten el funcionamiento básico del sitio, la autenticación para la zona de descargas de fichas técnicas y la seguridad en formularios."`
* Line 90: Cat 2 Title: `"Cookies Analíticas"`
* Line 99: Cat 2 Text: `"Nos ayudan a medir el flujo de visitantes en las secciones de productos industriales y recetas."`
* Line 105: Cat 3 Title: `"Gestión de Solicitudes Corporativas"`
* Line 114: Cat 3 Text: `"Permiten enviarte novedades de catálogo y muestras de productos de maquila según tu solicitud."`
* Line 123: Button: `"Guardar Preferencias"`

#### 4. `src/components/Navbar.tsx`
* Line 48: Badge: `'PRODUCCIÓN'`
* Line 67: Top bar tagline: `"GUSTAFF S.A. | Fábrica de Chocolates, Coberturas y Galletas desde 1998"`
* Line 71: Top bar phone line: `"Guayaquil: 042255773 / WhatsApp: +593 96 971 8045"`
* Lines 160, 231: Registered user status: `"Cliente Registrado"`
* Lines 165, 240: Sign out title & button: `"Cerrar Sesión"` / `"Salir"`
* Line 176: Client area button: `"Área Clientes"`
* Lines 184, 187, 307: Admin CMS titles & buttons: `"Panel de Administración (CMS)"` / `"Panel Admin"` / `"Panel CMS Admin"`
* Lines 196, 199: Mobile PDF button: `"Descargas PDF"` / `"PDFs"`
* Line 205: Mobile drawer aria label: `"Menú de Herramientas"`
* Line 219: Mobile section header: `"Portal de Clientes & Leads"`
* Line 252: Downloads CTA: `"Acceso a Zona de Descargas Técnicas"`
* Line 257: Registration notice: `"Regístrese como cliente o prospecto para descargar fichas técnicas de uso industrial."`
* Line 268: Registration CTA: `"Ingreso / Registro Clientes"`
* Line 277: Mobile header: `"Herramientas del Sitio"`
* Line 290: Download subtext: `"Catálogo PDF, Fichas Técnicas & Certificaciones"`
* Line 308: Admin subtext: `"Administración de catálogo y mensajes"`
* Line 318: Language toggle header: `"Idioma / Language"`
* Lines 328, 335: Language names: `"Español"`, `"English"`

#### 5. `src/components/Footer.tsx`
* Line 40: Ribbon Item 1: `"NUESTRA PLANTA"`, Subtitle: `"Km 8.5 Vía a Daule, Guayaquil"`
* Line 55: Ribbon Item 2: `"HORARIO ATENCIÓN"`, Subtitle: `"Lun - Vie: 08:00 AM - 17:00 PM"`
* Line 70: Ribbon Item 3: `"LÍNEAS DIRECTAS"`, Subtitle: `"+593 96 971 8045 / 042255773"`
* Line 84: Ribbon Item 4: `"DESPACHOS NACIONALES"`, Subtitle: `"Envíos a nivel nacional para maquila"`
* Line 110: Brand overview text: `"En Gustaff somos soñadores, creemos en los nuevos proyectos, en nuestro personal, proveedores y clientes. Fabricando chocolates, coberturas y galletas desde 1998 en Guayaquil, Ecuador."`
* Line 139: Navigation header: `"Navegación Principal"`
* Lines 143-149: Links: `"Inicio"`, `"Conócenos (Historia 1998)"`, `"Productos de Consumo"`, `"Catálogo Industrial"`, `"Recetas e Inspiración"`, `"Contacto y Cotizaciones"`, `"Área Restringida de Descargas"`
* Line 170: Quality header: `"Sistema de Inocuidad & Calidad"`
* Line 176: Cert 1: `"Normas HACCP & BPM"`, Subtitle: `"Procesos certificados de seguridad alimentaria e inocuidad en planta."`
* Line 186: Cert 2: `"Estándares Internacionales"`, Subtitle: `"Aptos para exportación y maquilas a gran escala."`
* Line 198: Contact header: `"Planta Industrial & Contacto"`
* Line 204: Plant address: `"Km 8.5 Vía a Daule, Lotización San Francisco Av. Camilo Ponce Mz. 7 Solar 3 (Anterior Mz. 2 Solar 3), Guayaquil, Ecuador"`
* Line 210: Phone line: `"Call Center: 042255773 / 2264756"`
* Line 224: Copyright: `"Gustaff 2026, todos los derechos reservados."`
* Line 228: Credit: `"Desarrollado por Kindev"`
* Line 236: Quality link: `"Política de Calidad"`

#### 6. `src/components/AuthModal.tsx`
* Line 34: Error: `'Por favor confirme que no es un robot activando el reCAPTCHA.'`
* Line 39: Error: `'Por favor ingrese un correo electrónico válido.'`
* Line 52: Fallback company: `'Cliente Gustaff'`
* Line 62: Error: `'Por favor complete todos los campos requeridos para el registro.'`
* Line 82: Error: `'Ocurrió un error al procesar su solicitud. Intente nuevamente.'`
* Line 96: Accessibility label: `'Cerrar'`
* Line 109: Header subtitle: `'Gustaff S.A. | Zona Restringida de Descargas Técnicas'`
* Placeholders:
  - Line 133: `'Ej: Ing. Carlos Mendoza'`
  - Line 151: `'ejemplo@empresa.com'`
  - Line 169: `'Ej: Panificadora Central / 0991234567'`
* Line 203: Submit loading text: `'Procesando...'`

#### 7. `src/components/ProductDetailModal.tsx`
* Line 29: Accessibility label: `'Cerrar'`
* Line 51: Label prefix: `'Presentación: '`
* Line 65: Features header: `'Atributos Destacados:'`
* Line 88: Button text: `'Solicitar Cotización / Muestras'`
* Line 99: Button text: `'Descargar Ficha Técnica PDF'`

---

### B. Views (`src/views/`)

#### 8. `src/views/HomeView.tsx`
* Lines 48-124: Slider content array:
  - Slide 1 Tagline: `"✦ DESDE 1998 EN ECUADOR"`, Title: `"COBERTURAS DE CHOCOLATE & GOTAS TERMOESTABLES"`, Fallback Description: `"Formuladas para resistir altas temperaturas de horneado y congelación sin perder su sabor, brillo ni textura excepcional."`
  - Slide 2 Tagline: `"✦ ALTA SOLUBILIDAD & RENDIMIENTO"`, Title: `"CACAO EN POLVO ALCALINO & EDULCORADO"`, Description: `"Extracción pura de cacao 100% ecuatoriano con máximo perfil aromático, ideal para bebidas, repostería y heladería industrial."`, Button: `"Explorar Cacaos"`
  - Slide 3 Tagline: `"✦ HELADERÍA & REPOSTERÍA"`, Title: `"GALLETAS & CONOS PARA HELADO INDUSTRIAL"`, Description: `"Crujientes, sabrosas y diseñadas con la máxima resistencia a la humedad en presentaciones para alta producción."`, Button: `"Ver Galletería"`
  - Slide 4 Tagline: `"✦ SOLUCIONES A LA MEDIDA"`, Title: `"MAQUILA INDUSTRIAL & SIROPE DE CACAO"`, Description: `"Desarrollamos recetas exclusivas y empaques en sacos de 25 kg, cajas y pomas de 6 kg adaptadas a tu proceso productivo."`, Button: `"Solicitar Maquila"`
* Lines 242, 249, 263: Carousel aria labels: `"Anterior Slide"`, `"Siguiente Slide"`, `"Ir a la diapositiva..."`
* Lines 283-332: Feature Ribbon Bar:
  - Card 1: `"Ingredientes Puros"`, `"Cacao 100% de origen ecuatoriano con máximo rendimiento y aroma."`
  - Card 2: `"Maquila Industrial"`, `"Desarrollo de fórmulas a medida para industrias y emprendimientos."`
  - Card 3: `"Normas HACCP & BPM"`, `"Estándares rigurosos de inocuidad y control de calidad industrial."`
  - Card 4: `"Hecho con Pasión"`, `"Más de 25 años perfeccionando coberturas y chocobocados."`
* Lines 348-432: Featured Catalog Section:
  - Badge: `"Selección Especial de Materia Prima"`
  - Heading: `"Nuestras Coberturas & Cacaos Estrella"`
  - Card link: `"Ver Detalles & Ficha"`
  - CTA Button: `"Ver Catálogo Completo de Productos"`
* Lines 459-490: About Us Section:
  - Image badge: `"25+"`, `"Años de Experiencia Industrial"`
  - Heading: `"Un Lugar Donde la Calidad e Innovación Se Unen desde 1998"`
  - Badge: `"SOBRE GUSTAFF S.A."`
  - Body text: `"GUSTAFF S.A. inició sus operaciones industriales en Guayaquil, generando empleos y aplicando estrategias técnicas de vanguardia para brindar chocolates y coberturas de excelencia para cada necesidad del mercado."`
  - CTA Button: `"Conocer Nuestra Historia Completa"`
* Lines 516-560: Industrial Maquila Section:
  - Heading: `"Maquilamos Tu Emprendimiento Corporativo"`
  - Badge: `"MAQUILAMOS TU EMPRENDIMIENTO"`
  - Body text: `"Suministramos sacos de 25 kg de Cacao Edulcorado y Alcalino, cajas de 5 kg y 10 kg de gotas, botones y palillos, pomas de 6 kg de sirope y cajas de galletas industriales adaptadas a tu proceso productivo."`
  - CTA Button: `"Explorar Productos Industriales"`
  - Image Badge: `"Sacos de 25 kg"`, `"Empaques & Maquila a Medida"`
* Lines 578-591: Quality Banner:
  - Heading: `"Compromiso de Inocuidad & Seguridad Alimentaria"`
  - Text: `"Procesamos alimentos en estricto cumplimiento de estándares ecuatorianos e internacionales (HACCP y BPM), garantizando inocuidad, autenticidad y trazabilidad."`
  - Button: `"Leer Política de Calidad"`

#### 9. `src/views/AboutView.tsx`
* Line 62: Banner badge: `"Trayectoria Industrial desde 1998"`
* Line 67: Fallback title: `"La fábrica - Historia Gustaff | desde 1998"`
* Line 72: Subtitle: `"Conoce el origen, misión, visión y principios de calidad que impulsan el desarrollo de chocolates, coberturas y galletas de Gustaff S.A. en Ecuador."`
* Lines 81, 84: Breadcrumbs: `"INICIO"`, `"CONÓCENOS"`
* Lines 108, 112: Image quote: `"En Gustaff creemos en los nuevos proyectos, en nuestra gente y en la pureza de cada ingrediente."`, `"GUSTAFF S.A. | DESDE 1998"`
* Lines 120, 124: Section badge & heading: `"QUIÉNES SOMOS"`, `"Pasión por el Cacao, Tradición e Innovación Alimentaria"`
* Lines 136-150: Features:
  - Feature 1: `"Fórmulas Termoestables"`, `"Desarrollos exclusivos diseñados para resistir temperaturas extremas sin perder aroma ni textura."`
  - Feature 2: `"Normas HACCP & BPM"`, `"Garantía total de inocuidad alimentaria y trazabilidad internacional en nuestra planta industrial."`
* Line 160: CTA Button: `"Explorar Productos Industriales"`
* Lines 176-188: Metrics labels: `"Años de Trayectoria"`, `"Cacao Ecuatoriano"`, `"Fórmulas Especializadas"`, `"Clientes & Maquilas"`
* Lines 212-221: Banner 2: `"TECNOLOGÍA & CAPACIDAD ALIMENTARIA"`, `"Desarrollamos Soluciones Integrales para la Industria Alimentaria"`, `"Abastecemos a industrias confiteras, heladeras, panificadoras y emprendimientos corporativos con empaques en sacos de 25 kg, cajas y pomas de 6 kg."`
* Lines 232-254: Overlapping Cards:
  - Card 1: `"Atención Personalizada"`, `"Desarrollo de fórmulas exclusivas ajustadas al perfil de sabor y viscosidad de cada cliente."`
  - Card 2: `"Producción de Alta Escala"`, `"Capacidad de respuesta inmediata y despacho a nivel nacional para maquilas y grandes lotes."`
  - Card 3: `"Garantía Inocuidad HACCP"`, `"Controles de calidad automatizados y laboratorios propios en planta para garantizar pureza."`
* Lines 268, 271: Philosophy section: `"FILOSOFÍA CORPORATIVA"`, `"Nuestros Pilares Fundamentales"`
* Lines 296, 321, 346: Read more buttons: `"Leer Misión Completa"`, `"Leer Visión Completa"`, `"Leer Política Completa"`
* Lines 365, 378, 396: Modal popup: `"Cerrar modal"`, `"DOCUMENTACIÓN CORPORATIVA"`, `"Cerrar"`

#### 10. `src/views/ProductsView.tsx`
* Lines 23-27: Categories: `"Todos los Productos"`, `"Insumos Industriales"`, `"Coberturas de Chocolate"`, `"Polvos de Cacao"`, `"Galletería"`
* Lines 42, 46, 50: Header: `"Catálogo General Gustaff S.A."`, `"Nuestras Líneas de Chocolates, Coberturas y Galletas"`, `"Contamos con un portafolio variado de productos para consumo y elaboración artesanal e industrial."`
* Line 62: Search placeholder: `"Buscar en el catálogo..."`
* Line 117: Product card button: `"Ver Ficha Técnica"`

#### 11. `src/views/IndustrialView.tsx`
* Lines 55, 60, 64: Header: `"Línea Industrial & Granel"`, `"Maquilamos tus emprendimientos"`, `" Suministro continuo de insumos a granel para la industria alimentaria, confitería, heladería y pastelería industrial en Ecuador y Latinoamérica."`
* Line 73: Header button: `"Descargar Fichas Técnicas PDF (Acceso Clientes)"`
* Line 86: Search placeholder: `"Buscar por producto, código o saco/caja..."`
* Lines 93, 105: Packaging filter: `"Empaque:"`, `"Todos los Empaques"`
* Lines 162, 170: Card buttons: `"Ver Especificaciones Técnicas"`, `"Descargar Ficha Técnica PDF"`
* Lines 181-189: Quote section header: `"Atención Directa Corporativa"`, `"Solicita Muestras o Cotizaciones de Maquila"`, `"Nuestro equipo técnico y de ventas en Vía a Daule Guayaquil atenderá tus especificaciones industriales de empaque y formulación."`
* Line 195: Quote success: `"¡Solicitud de cotización enviada con éxito! Un asesor industrial de Gustaff S.A. te contactará en breve."`
* Form placeholders & CTA (Lines 207-240):
  - `'Nombre del Solicitante'`
  - `'Correo Corporativo'`
  - `'Nombre de la Empresa / Teléfono'`
  - `'Seleccione Producto de Interés...'`
  - `'Especifique volúmenes estimados o requerimientos técnicos de maquila...'`
  - `'Enviar Solicitud de Cotización'`

#### 12. `src/views/RecipesView.tsx`
* Lines 19, 23, 27: Header: `"Inspiración Pastelera"`, `"Recetas Elaboradas con Productos Gustaff"`, `"Descubre fórmulas probadas en nuestra cocina de aplicaciones usando Cocoa Alcalina, Gotas Termoestables y Galletas Sanduche Gustaff."`
* Line 35: Sidebar heading: `"Recetas Destacadas"`
* Lines 89, 106, 121: Recipe details: `"Ingrediente Clave:"`, `"Ingredientes Necesarios:"`, `"Paso a Paso de Preparación:"`

#### 13. `src/views/ContactView.tsx`
* Line 68: Banner badge: `"Atención Directa Gustaff S.A."`
* Lines 41, 56: Errors: `"Por favor active la casilla reCAPTCHA para verificar que no es un robot."`, `"Ocurrió un error al enviar el mensaje. Intente de nuevo."`
* Line 170: Submit button state: `"ENVIANDO..."` (Button text: `"ENVIAR"`)
* Line 85: Form title: `"Formulario de Contacto Directo"`
* Placeholders (Lines 111, 125, 139, 153):
  - `'Ingrese su nombre completo'`
  - `'correo@ejemplo.com'`
  - `'Ej: Cotización de Cobertura / Sugerencia'`
  - `'Escriba su mensaje o inquietud en detalle...'`
* Lines 179-251: Info Column:
  - `"Información Institucional"`
  - `"Dirección de Planta:"`, `"Km 8.5 Vía a Daule, Lotización San Francisco Mz. 2 Solar 3 (Av. Camilo Ponce Mz. 7 Solar 3), Guayaquil, Ecuador."`
  - `"Líneas Telefónicas:"`, `"042255773 - 2264756"`
  - `"Call Center / WhatsApp:"`
  - `"Síguenos en Redes Sociales:"`, `"Facebook Gustaff"`, `"Instagram @gustaffec"`
  - `"Guayaquil, Ecuador"`, `"Km 8.5 Vía a Daule, Lotización San Francisco"`

#### 14. `src/views/RestrictedZoneView.tsx`
* Line 69: Header badge: `"Área Restringida de Descargas Técnicas"`
* Line 77: Subtitle extension: `" Descargue en formato PDF las fichas técnicas con parámetros fisicoquímicos, microbiológicos, vida útil y tablas nutricionales."`
* Lines 100, 104: Session banner: `"Sesión Activa: "`, `"Empresa: "`, `"Cliente Registrado"`, `" | Acceso habilitado a todas las descargas."`
* Line 115: Toast message: `"¡Descarga iniciada exitosamente para: "'`
* Lines 127, 133: Search bar & info: `"Buscar ficha técnica, catálogo o brochure..."`, `" Documentos Técnicos Disponibles"`
* Lines 147, 170, 178: Card badges & buttons: `"Ficha Técnica PDF"`, `"Documento Institucional"`, `"Descargar Documento PDF"`, `"Registrarse para Descargar"`

---

## 4. Proposed `TRANSLATIONS` Expansion Map (`es` & `en`)

To achieve complete 100% coverage across the application, the `TRANSLATIONS` dictionary in `src/data/translations.ts` should be expanded as follows:

```ts
export const TRANSLATIONS = {
  es: {
    // Existing categories retained ...
    
    // New / Expanded Categories:
    common: {
      recaptchaVerified: "No soy un robot (Verificado)",
      recaptchaNotVerified: "No soy un robot",
      recaptchaTerms: "Privacidad - Términos",
      close: "Cerrar",
      exit: "Salir",
      logout: "Cerrar Sesión",
      processing: "Procesando...",
      sending: "ENVIANDO...",
      send: "ENVIAR",
      present: "Presentación",
      registeredClient: "Cliente Registrado",
      developedBy: "Desarrollado por Kindev"
    },
    whatsappWidget: {
      title: "Atención al Cliente Gustaff",
      onlineStatus: "En línea (+593 96 971 8045)",
      greetingTitle: "¡Hola! Bienvenido a Gustaff S.A.",
      greetingBody: "¿En qué podemos ayudarte hoy? Solicita fichas técnicas, cotizaciones para maquila o muestras de coberturas.",
      placeholder: "Escribe tu mensaje o consulta...",
      sendBtn: "Iniciar Chat en WhatsApp",
      ariaLabel: "Contactar por WhatsApp",
      defaultText: "Hola Gustaff S.A., me gustaría solicitar información sobre sus productos industriales y coberturas."
    },
    cookieBanner: {
      title: "Privacidad y Tratamiento de Datos - Gustaff S.A.",
      body: "Utilizamos cookies para optimizar la navegación en nuestro catálogo industrial, gestionar la descarga segura de fichas técnicas y analizar el uso del sitio de acuerdo con la Ley Orgánica de Protección de Datos Personales del Ecuador.",
      configure: "Configurar",
      acceptAll: "Aceptar Todas",
      savePreferences: "Guardar Preferencias",
      catNecessaryTitle: "Cookies Necesarias",
      catNecessaryBadge: "Obligatorias",
      catNecessaryDesc: "Permiten el funcionamiento básico del sitio, la autenticación para la zona de descargas de fichas técnicas y la seguridad en formularios.",
      catAnalyticalTitle: "Cookies Analíticas",
      catAnalyticalDesc: "Nos ayudan a medir el flujo de visitantes en las secciones de productos industriales y recetas.",
      catMarketingTitle: "Gestión de Solicitudes Corporativas",
      catMarketingDesc: "Permiten enviarte novedades de catálogo y muestras de productos de maquila según tu solicitud."
    },
    navExtra: {
      topBarTagline: "GUSTAFF S.A. | Fábrica de Chocolates, Coberturas y Galletas desde 1998",
      topBarPhones: "Guayaquil: 042255773 / WhatsApp: +593 96 971 8045",
      productionBadge: "PRODUCCIÓN",
      clientArea: "Área Clientes",
      adminPanel: "Panel Admin",
      pdfDownloads: "Descargas PDF",
      portalHeader: "Portal de Clientes & Leads",
      downloadZoneAccess: "Acceso a Zona de Descargas Técnicas",
      registerPrompt: "Regístrese como cliente o prospecto para descargar fichas técnicas de uso industrial.",
      loginRegisterCTA: "Ingreso / Registro Clientes",
      siteTools: "Herramientas del Sitio",
      catalogSubtext: "Catálogo PDF, Fichas Técnicas & Certificaciones",
      adminSubtext: "Administración de catálogo y mensajes",
      languageLabel: "Idioma / Language"
    },
    footerExtra: {
      ourPlant: "NUESTRA PLANTA",
      plantSub: "Km 8.5 Vía a Daule, Guayaquil",
      openingHours: "HORARIO ATENCIÓN",
      hoursSub: "Lun - Vie: 08:00 AM - 17:00 PM",
      directLines: "LÍNEAS DIRECTAS",
      directPhones: "+593 96 971 8045 / 042255773",
      nationalShipping: "DESPACHOS NACIONALES",
      shippingSub: "Envíos a nivel nacional para maquila",
      aboutBrandText: "En Gustaff somos soñadores, creemos en los nuevos proyectos, en nuestro personal, proveedores y clientes. Fabricando chocolates, coberturas y galletas desde 1998 en Guayaquil, Ecuador.",
      mainNavHeader: "Navegación Principal",
      qualitySafetyHeader: "Sistema de Inocuidad & Calidad",
      haccpTitle: "Normas HACCP & BPM",
      haccpDesc: "Procesos certificados de seguridad alimentaria e inocuidad en planta.",
      intlTitle: "Estándares Internacionales",
      intlDesc: "Aptos para exportación y maquilas a gran escala.",
      plantContactHeader: "Planta Industrial & Contacto",
      plantAddressFull: "Km 8.5 Vía a Daule, Lotización San Francisco Av. Camilo Ponce Mz. 7 Solar 3 (Anterior Mz. 2 Solar 3), Guayaquil, Ecuador",
      callCenter: "Call Center: 042255773 / 2264756",
      qualityPolicy: "Política de Calidad"
    },
    productModal: {
      presentation: "Presentación",
      featuredAttributes: "Atributos Destacados:",
      requestQuoteBtn: "Solicitar Cotización / Muestras",
      downloadPdfBtn: "Descargar Ficha Técnica PDF"
    },
    homePageExtra: {
      slide1Tagline: "✦ DESDE 1998 EN ECUADOR",
      slide1Title: "COBERTURAS DE CHOCOLATE",
      slide1Accent: "& GOTAS TERMOESTABLES",
      slide1Desc: "Formuladas para resistir altas temperaturas de horneado y congelación sin perder su sabor, brillo ni textura excepcional.",
      slide2Tagline: "✦ ALTA SOLUBILIDAD & RENDIMIENTO",
      slide2Title: "CACAO EN POLVO",
      slide2Accent: "ALCALINO & EDULCORADO",
      slide2Desc: "Extracción pura de cacao 100% ecuatoriano con máximo perfil aromático, ideal para bebidas, repostería y heladería industrial.",
      slide2Btn: "Explorar Cacaos",
      slide3Tagline: "✦ HELADERÍA & REPOSTERÍA",
      slide3Title: "GALLETAS & CONOS",
      slide3Accent: "PARA HELADO INDUSTRIAL",
      slide3Desc: "Crujientes, sabrosas y diseñadas con la máxima resistencia a la humedad en presentaciones para alta producción.",
      slide3Btn: "Ver Galletería",
      slide4Tagline: "✦ SOLUCIONES A LA MEDIDA",
      slide4Title: "MAQUILA INDUSTRIAL",
      slide4Accent: "& SIROPE DE CACAO",
      slide4Desc: "Desarrollamos recetas exclusivas y empaques en sacos de 25 kg, cajas y pomas de 6 kg adaptadas a tu proceso productivo.",
      slide4Btn: "Solicitar Maquila",
      feature1Title: "Ingredientes Puros",
      feature1Desc: "Cacao 100% de origen ecuatoriano con máximo rendimiento y aroma.",
      feature2Title: "Maquila Industrial",
      feature2Desc: "Desarrollo de fórmulas a medida para industrias y emprendimientos.",
      feature3Title: "Normas HACCP & BPM",
      feature3Desc: "Estándares rigurosos de inocuidad y control de calidad industrial.",
      feature4Title: "Hecho con Pasión",
      feature4Desc: "Más de 25 años perfeccionando coberturas y chocobocados.",
      featuredBadge: "Selección Especial de Materia Prima",
      featuredTitle: "Nuestras Coberturas & Cacaos Estrella",
      viewDetails: "Ver Detalles & Ficha",
      viewFullCatalog: "Ver Catálogo Completo de Productos",
      yearsExpNumber: "25+",
      yearsExpBadge: "Años de Experiencia Industrial",
      aboutHeading: "Un Lugar Donde la Calidad e Innovación Se Unen desde 1998",
      aboutBadge: "SOBRE GUSTAFF S.A.",
      aboutHistoryBody: "GUSTAFF S.A. inició sus operaciones industriales en Guayaquil, generando empleos y aplicando estrategias técnicas de vanguardia para brindar chocolates y coberturas de excelencia para cada necesidad del mercado.",
      fullHistoryBtn: "Conocer Nuestra Historia Completa",
      industrialHeading: "Maquilamos Tu Emprendimiento Corporativo",
      industrialBadge: "MAQUILAMOS TU EMPRENDIMIENTO",
      industrialBody: "Suministramos sacos de 25 kg de Cacao Edulcorado y Alcalino, cajas de 5 kg y 10 kg de gotas, botones y palillos, pomas de 6 kg de sirope y cajas de galletas industriales adaptadas a tu proceso productivo.",
      exploreIndustrialBtn: "Explorar Productos Industriales",
      bulkBadgeTitle: "Sacos de 25 kg",
      bulkBadgeText: "Empaques & Maquila a Medida",
      qualityBannerTitle: "Compromiso de Inocuidad & Seguridad Alimentaria",
      qualityBannerText: "Procesamos alimentos en estricto cumplimiento de estándares ecuatorianos e internacionales (HACCP y BPM), garantizando inocuidad, autenticidad y trazabilidad.",
      readQualityPolicyBtn: "Leer Política de Calidad"
    },
    aboutPageExtra: {
      bannerBadge: "Trayectoria Industrial desde 1998",
      bannerSubtitle: "Conoce el origen, misión, visión y principios de calidad que impulsan el desarrollo de chocolates, coberturas y galletas de Gustaff S.A. en Ecuador.",
      quote: '"En Gustaff creemos en los nuevos proyectos, en nuestra gente y en la pureza de cada ingrediente."',
      sectionTitle: "Pasión por el Cacao, Tradición e Innovación Alimentaria",
      thermostableTitle: "Fórmulas Termoestables",
      thermostableDesc: "Desarrollos exclusivos diseñados para resistir temperaturas extremas sin perder aroma ni textura.",
      haccpTitle: "Normas HACCP & BPM",
      haccpDesc: "Garantía total de inocuidad alimentaria y trazabilidad internacional en nuestra planta industrial.",
      metricYears: "Años de Trayectoria",
      metricCocoa: "Cacao Ecuatoriano",
      metricFormulas: "Fórmulas Especializadas",
      metricClients: "Clientes & Maquilas",
      solutionsBannerBadge: "TECNOLOGÍA & CAPACIDAD ALIMENTARIA",
      solutionsBannerTitle: "Desarrollamos Soluciones Integrales para la Industria Alimentaria",
      solutionsBannerSubtitle: "Abastecemos a industrias confiteras, heladeras, panificadoras y emprendimientos corporativos con empaques en sacos de 25 kg, cajas y pomas de 6 kg.",
      personalizedTitle: "Atención Personalizada",
      personalizedDesc: "Desarrollo de fórmulas exclusivas ajustadas al perfil de sabor y viscosidad de cada cliente.",
      highScaleTitle: "Producción de Alta Escala",
      highScaleDesc: "Capacidad de respuesta inmediata y despacho a nivel nacional para maquilas y grandes lotes.",
      haccpCertTitle: "Garantía Inocuidad HACCP",
      haccpCertDesc: "Controles de calidad automatizados y laboratorios propios en planta para garantizar pureza.",
      philosophyBadge: "FILOSOFÍA CORPORATIVA",
      philosophyTitle: "Nuestros Pilares Fundamentales",
      readFullMision: "Leer Misión Completa",
      readFullVision: "Leer Visión Completa",
      readFullQuality: "Leer Política Completa",
      docTitle: "DOCUMENTACIÓN CORPORATIVA"
    },
    productsPage: {
      catalogBadge: "Catálogo General Gustaff S.A.",
      catalogTitle: "Nuestras Líneas de Chocolates, Coberturas y Galletas",
      catalogSubtitle: "Contamos con un portafolio variado de productos para consumo y elaboración artesanal e industrial.",
      searchPlaceholder: "Buscar en el catálogo...",
      catAll: "Todos los Productos",
      catIndustrial: "Insumos Industriales",
      catCoberturas: "Coberturas de Chocolate",
      catCocoa: "Polvos de Cacao",
      catGalletas: "Galletería",
      viewSpecSheet: "Ver Ficha Técnica"
    },
    industrialPageExtra: {
      bannerBadge: "Línea Industrial & Granel",
      downloadPdfClient: "Descargar Fichas Técnicas PDF (Acceso Clientes)",
      searchPlaceholder: "Buscar por producto, código o saco/caja...",
      pkgFilterLabel: "Empaque:",
      pkgFilterAll: "Todos los Empaques",
      viewTechSpecs: "Ver Especificaciones Técnicas",
      downloadTechPdf: "Descargar Ficha Técnica PDF",
      quoteBadge: "Atención Directa Corporativa",
      quoteTitle: "Solicita Muestras o Cotizaciones de Maquila",
      quoteDesc: "Nuestro equipo técnico y de ventas en Vía a Daule Guayaquil atenderá tus especificaciones industriales de empaque y formulación.",
      quoteSuccess: "¡Solicitud de cotización enviada con éxito! Un asesor industrial de Gustaff S.A. te contactará en breve.",
      applicantName: "Nombre del Solicitante",
      corporateEmail: "Correo Corporativo",
      companyPhone: "Nombre de la Empresa / Teléfono",
      selectProduct: "Seleccione Producto de Interés...",
      specifyRequirements: "Especifique volúmenes estimados o requerimientos técnicos de maquila...",
      sendQuoteBtn: "Enviar Solicitud de Cotización"
    },
    recipesPage: {
      badge: "Inspiración Pastelera",
      title: "Recetas Elaboradas con Productos Gustaff",
      subtitle: "Descubre fórmulas probadas en nuestra cocina de aplicaciones usando Cocoa Alcalina, Gotas Termoestables y Galletas Sanduche Gustaff.",
      featuredHeading: "Recetas Destacadas",
      keyIngredient: "Ingrediente Clave:",
      ingredientsRequired: "Ingredientes Necesarios:",
      stepByStep: "Paso a Paso de Preparación:"
    },
    contactPageExtra: {
      bannerBadge: "Atención Directa Gustaff S.A.",
      formTitle: "Formulario de Contacto Directo",
      recaptchaError: "Por favor active la casilla reCAPTCHA para verificar que no es un robot.",
      genericError: "Ocurrió un error al enviar el mensaje. Intente de nuevo.",
      placeholderName: "Ingrese su nombre completo",
      placeholderEmail: "correo@ejemplo.com",
      placeholderSubject: "Ej: Cotización de Cobertura / Sugerencia",
      placeholderMessage: "Escriba su mensaje o inquietud en detalle...",
      infoTitle: "Información Institucional",
      plantAddressLabel: "Dirección de Planta:",
      phonesLabel: "Líneas Telefónicas:",
      whatsappLabel: "Call Center / WhatsApp:",
      socialFollow: "Síguenos en Redes Sociales:"
    },
    downloadsPageExtra: {
      headerBadge: "Área Restringida de Descargas Técnicas",
      subtitleDesc: "Descargue en formato PDF las fichas técnicas con parámetros fisicoquímicos, microbiológicos, vida útil y tablas nutricionales.",
      activeSession: "Sesión Activa:",
      accessEnabled: "Acceso habilitado a todas las descargas.",
      downloadStarted: "¡Descarga iniciada exitosamente para:",
      searchPlaceholder: "Buscar ficha técnica, catálogo o brochure...",
      docsAvailable: "Documentos Técnicos Disponibles",
      specSheetPdf: "Ficha Técnica PDF",
      institutionalDoc: "Documento Institucional",
      downloadPdf: "Descargar Documento PDF",
      registerToDownload: "Registrarse para Descargar"
    },
    authModalExtra: {
      recaptchaError: "Por favor confirme que no es un robot activando el reCAPTCHA.",
      validEmailError: "Por favor ingrese un correo electrónico válido.",
      requiredFieldsError: "Por favor complete todos los campos requeridos para el registro.",
      processingError: "Ocurrió un error al procesar su solicitud. Intente nuevamente.",
      headerSubtitle: "Gustaff S.A. | Zona Restringida de Descargas Técnicas",
      placeholderName: "Ej: Ing. Carlos Mendoza",
      placeholderEmail: "ejemplo@empresa.com",
      placeholderCompanyPhone: "Ej: Panificadora Central / 0991234567"
    }
  },
  en: {
    // Retain existing English keys ...

    // English equivalents for all new categories:
    common: {
      recaptchaVerified: "I'm not a robot (Verified)",
      recaptchaNotVerified: "I'm not a robot",
      recaptchaTerms: "Privacy - Terms",
      close: "Close",
      exit: "Exit",
      logout: "Sign Out",
      processing: "Processing...",
      sending: "SENDING...",
      send: "SEND",
      present: "Packaging",
      registeredClient: "Registered Client",
      developedBy: "Developed by Kindev"
    },
    whatsappWidget: {
      title: "Gustaff Customer Support",
      onlineStatus: "Online (+593 96 971 8045)",
      greetingTitle: "Hello! Welcome to Gustaff S.A.",
      greetingBody: "How can we help you today? Request technical spec sheets, private label quotes, or coating samples.",
      placeholder: "Type your message or inquiry...",
      sendBtn: "Start WhatsApp Chat",
      ariaLabel: "Contact via WhatsApp",
      defaultText: "Hello Gustaff S.A., I would like to request information about your industrial products and coatings."
    },
    cookieBanner: {
      title: "Privacy & Data Protection - Gustaff S.A.",
      body: "We use cookies to optimize browsing in our industrial catalog, manage secure technical sheet downloads, and analyze site usage in compliance with Ecuador's Data Protection Laws.",
      configure: "Configure",
      acceptAll: "Accept All",
      savePreferences: "Save Preferences",
      catNecessaryTitle: "Necessary Cookies",
      catNecessaryBadge: "Required",
      catNecessaryDesc: "Enable basic site functionality, authentication for the technical download zone, and form security.",
      catAnalyticalTitle: "Analytical Cookies",
      catAnalyticalDesc: "Help us measure visitor traffic across industrial product and recipe sections.",
      catMarketingTitle: "Corporate Request Management",
      catMarketingDesc: "Allow sending catalog updates and private label product samples upon request."
    },
    navExtra: {
      topBarTagline: "GUSTAFF S.A. | Chocolate, Compound Coatings & Cookie Factory since 1998",
      topBarPhones: "Guayaquil: 042255773 / WhatsApp: +593 96 971 8045",
      productionBadge: "PRODUCTION",
      clientArea: "Client Area",
      adminPanel: "Admin Panel",
      pdfDownloads: "PDF Downloads",
      portalHeader: "Client & Lead Portal",
      downloadZoneAccess: "Access to Technical Downloads Zone",
      registerPrompt: "Register as a client or lead to download industrial technical spec sheets.",
      loginRegisterCTA: "Client Sign In / Register",
      siteTools: "Site Tools",
      catalogSubtext: "PDF Catalog, Spec Sheets & Certifications",
      adminSubtext: "Catalog & message management",
      languageLabel: "Language / Idioma"
    },
    footerExtra: {
      ourPlant: "OUR PLANT",
      plantSub: "Km 8.5 Vía a Daule, Guayaquil",
      openingHours: "OPENING HOURS",
      hoursSub: "Mon - Fri: 08:00 AM - 17:00 PM",
      directLines: "DIRECT LINES",
      directPhones: "+593 96 971 8045 / 042255773",
      nationalShipping: "NATIONWIDE SHIPPING",
      shippingSub: "Nationwide shipping for private labeling",
      aboutBrandText: "At Gustaff we are dreamers; we believe in new projects, in our staff, suppliers, and customers. Manufacturing chocolates, compound coatings, and cookies since 1998 in Guayaquil, Ecuador.",
      mainNavHeader: "Main Navigation",
      qualitySafetyHeader: "Food Safety & Quality System",
      haccpTitle: "HACCP & GMP Standards",
      haccpDesc: "Certified food safety and hygiene processes in our plant.",
      intlTitle: "International Standards",
      intlDesc: "Suitable for export and large-scale private label manufacturing.",
      plantContactHeader: "Industrial Plant & Contact",
      plantAddressFull: "Km 8.5 Vía a Daule, Lotización San Francisco Av. Camilo Ponce Mz. 7 Solar 3 (Anterior Mz. 2 Solar 3), Guayaquil, Ecuador",
      callCenter: "Call Center: 042255773 / 2264756",
      qualityPolicy: "Quality Policy"
    },
    productModal: {
      presentation: "Packaging",
      featuredAttributes: "Key Features:",
      requestQuoteBtn: "Request Quote / Samples",
      downloadPdfBtn: "Download Technical Spec PDF"
    },
    homePageExtra: {
      slide1Tagline: "✦ SINCE 1998 IN ECUADOR",
      slide1Title: "CHOCOLATE COMPOUND COATINGS",
      slide1Accent: "& BAKE-STABLE DROPS",
      slide1Desc: "Formulated to withstand high baking and freezing temperatures while retaining exceptional taste, shine, and texture.",
      slide2Tagline: "✦ HIGH SOLUBILITY & YIELD",
      slide2Title: "COCOA POWDER",
      slide2Accent: "DUTCHED & SWEETENED",
      slide2Desc: "Pure 100% Ecuadorian cocoa extraction with maximum aromatic profile, ideal for beverages, baking, and commercial ice cream.",
      slide2Btn: "Explore Cocoa Powders",
      slide3Tagline: "✦ ICE CREAM & BAKERY",
      slide3Title: "COOKIES & CONES",
      slide3Accent: "FOR COMMERCIAL ICE CREAM",
      slide3Desc: "Crispy, delicious, and designed with maximum moisture resistance in high-yield packaging.",
      slide3Btn: "Explore Cookies",
      slide4Tagline: "✦ TAILORED SOLUTIONS",
      slide4Title: "PRIVATE LABEL MANUFACTURING",
      slide4Accent: "& COCOA SYRUP",
      slide4Desc: "We develop custom recipes and bulk packaging in 25 kg bags, boxes, and 6 kg pails tailored to your production process.",
      slide4Btn: "Request Private Labeling",
      feature1Title: "Pure Ingredients",
      feature1Desc: "100% Ecuadorian cocoa with maximum yield and rich aroma.",
      feature2Title: "Private Labeling",
      feature2Desc: "Custom formula development for food industries and enterprises.",
      feature3Title: "HACCP & GMP Standards",
      feature3Desc: "Rigorous standards for food safety and industrial quality control.",
      feature4Title: "Crafted with Passion",
      feature4Desc: "Over 25 years perfecting coatings and chocolate bites.",
      featuredBadge: "Special Selection of Raw Materials",
      featuredTitle: "Our Signature Coatings & Cocoa Powders",
      viewDetails: "View Details & Spec Sheet",
      viewFullCatalog: "View Full Product Catalog",
      yearsExpNumber: "25+",
      yearsExpBadge: "Years of Industrial Experience",
      aboutHeading: "Where Quality and Innovation Meet Since 1998",
      aboutBadge: "ABOUT GUSTAFF S.A.",
      aboutHistoryBody: "GUSTAFF S.A. began industrial operations in Guayaquil, generating jobs and applying cutting-edge technical strategies to provide excellent chocolates and coatings for every market need.",
      fullHistoryBtn: "Read Our Full History",
      industrialHeading: "We Manufacture Your Corporate Project",
      industrialBadge: "PRIVATE LABEL MANUFACTURING",
      industrialBody: "We supply 25 kg bags of Sweetened and Dutched Cocoa, 5 kg and 10 kg boxes of drops, buttons, and sticks, 6 kg syrup pails, and industrial cookie boxes tailored to your production process.",
      exploreIndustrialBtn: "Explore Industrial Products",
      bulkBadgeTitle: "25 kg Bags",
      bulkBadgeText: "Custom Packaging & Private Labeling",
      qualityBannerTitle: "Food Safety & Hygiene Commitment",
      qualityBannerText: "We process food in strict compliance with Ecuadorian and international standards (HACCP & GMP), guaranteeing food safety, authenticity, and traceability.",
      readQualityPolicyBtn: "Read Quality Policy"
    },
    aboutPageExtra: {
      bannerBadge: "Industrial Experience Since 1998",
      bannerSubtitle: "Discover the origins, mission, vision, and quality principles driving Gustaff S.A.'s chocolate, coating, and cookie development in Ecuador.",
      quote: '"At Gustaff we believe in new projects, in our people, and in the purity of every ingredient."',
      sectionTitle: "Passion for Cocoa, Tradition & Food Innovation",
      thermostableTitle: "Bake-Stable Formulas",
      thermostableDesc: "Exclusive developments designed to withstand extreme temperatures without losing aroma or texture.",
      haccpTitle: "HACCP & GMP Standards",
      haccpDesc: "Total food safety guarantee and international traceability in our industrial plant.",
      metricYears: "Years of Experience",
      metricCocoa: "Ecuadorian Cocoa",
      metricFormulas: "Specialized Formulas",
      metricClients: "Clients & Private Labels",
      solutionsBannerBadge: "TECHNOLOGY & FOOD CAPACITY",
      solutionsBannerTitle: "We Develop Comprehensive Solutions for the Food Industry",
      solutionsBannerSubtitle: "We supply confectionery, ice cream, bakery industries, and corporate enterprises with 25 kg bags, boxes, and 6 kg pails.",
      personalizedTitle: "Personalized Service",
      personalizedDesc: "Custom formula development adjusted to each client's flavor profile and viscosity.",
      highScaleTitle: "Large-Scale Production",
      highScaleDesc: "Immediate response capacity and nationwide dispatch for private label and bulk orders.",
      haccpCertTitle: "HACCP Hygiene Guarantee",
      haccpCertDesc: "Automated quality controls and in-house plant laboratories to ensure purity.",
      philosophyBadge: "CORPORATE PHILOSOPHY",
      philosophyTitle: "Our Fundamental Pillars",
      readFullMision: "Read Full Mission",
      readFullVision: "Read Full Vision",
      readFullQuality: "Read Full Policy",
      docTitle: "CORPORATE DOCUMENTATION"
    },
    productsPage: {
      catalogBadge: "Gustaff S.A. General Catalog",
      catalogTitle: "Our Chocolate, Compound Coating & Cookie Lines",
      catalogSubtitle: "We offer a diverse portfolio for consumer products, artisanal, and industrial manufacturing.",
      searchPlaceholder: "Search in catalog...",
      catAll: "All Products",
      catIndustrial: "Industrial Ingredients",
      catCoberturas: "Compound Coatings",
      catCocoa: "Cocoa Powders",
      catGalletas: "Cookies & Wafers",
      viewSpecSheet: "View Spec Sheet"
    },
    industrialPageExtra: {
      bannerBadge: "Industrial & Bulk Line",
      downloadPdfClient: "Download Technical Specs PDF (Client Access)",
      searchPlaceholder: "Search by product, code, or bag/box...",
      pkgFilterLabel: "Packaging:",
      pkgFilterAll: "All Packaging",
      viewTechSpecs: "View Technical Specs",
      downloadTechPdf: "Download Technical Spec PDF",
      quoteBadge: "Direct Corporate Assistance",
      quoteTitle: "Request Samples or Private Label Quotes",
      quoteDesc: "Our technical and sales team at Vía a Daule Guayaquil will handle your industrial packaging and formulation specs.",
      quoteSuccess: "Quote request submitted successfully! A Gustaff S.A. industrial representative will contact you shortly.",
      applicantName: "Applicant Name",
      corporateEmail: "Corporate Email",
      companyPhone: "Company Name / Phone",
      selectProduct: "Select Product of Interest...",
      specifyRequirements: "Specify estimated volumes or technical private label requirements...",
      sendQuoteBtn: "Submit Quote Request"
    },
    recipesPage: {
      badge: "Baking & Culinary Inspiration",
      title: "Recipes Crafted with Gustaff Products",
      subtitle: "Discover formulas tested in our test kitchen using Dutched Cocoa, Bake-Stable Drops, and Gustaff Sandwich Cookies.",
      featuredHeading: "Featured Recipes",
      keyIngredient: "Key Ingredient:",
      ingredientsRequired: "Required Ingredients:",
      stepByStep: "Step-by-Step Instructions:"
    },
    contactPageExtra: {
      bannerBadge: "Direct Support Gustaff S.A.",
      formTitle: "Direct Contact Form",
      recaptchaError: "Please check the reCAPTCHA box to verify you are not a robot.",
      genericError: "An error occurred while sending the message. Please try again.",
      placeholderName: "Enter your full name",
      placeholderEmail: "email@example.com",
      placeholderSubject: "E.g., Coating Quote / Suggestion",
      placeholderMessage: "Write your message or inquiry in detail...",
      infoTitle: "Corporate Information",
      plantAddressLabel: "Plant Address:",
      phonesLabel: "Telephone Lines:",
      whatsappLabel: "Call Center / WhatsApp:",
      socialFollow: "Follow Us on Social Networks:"
    },
    downloadsPageExtra: {
      headerBadge: "Restricted Technical Downloads Area",
      subtitleDesc: "Download technical spec sheets in PDF format containing physicochemical, microbiological parameters, shelf life, and nutritional tables.",
      activeSession: "Active Session:",
      accessEnabled: "Access enabled for all downloads.",
      downloadStarted: "Download successfully started for:",
      searchPlaceholder: "Search spec sheet, catalog, or brochure...",
      docsAvailable: "Technical Documents Available",
      specSheetPdf: "Technical Spec PDF",
      institutionalDoc: "Corporate Document",
      downloadPdf: "Download PDF Document",
      registerToDownload: "Register to Download"
    },
    authModalExtra: {
      recaptchaError: "Please confirm you are not a robot by activating the reCAPTCHA.",
      validEmailError: "Please enter a valid email address.",
      requiredFieldsError: "Please complete all required fields for registration.",
      processingError: "An error occurred while processing your request. Please try again.",
      headerSubtitle: "Gustaff S.A. | Restricted Technical Downloads Area",
      placeholderName: "E.g., Eng. Carlos Mendoza",
      placeholderEmail: "example@company.com",
      placeholderCompanyPhone: "E.g., Central Bakery / 0991234567"
    }
  }
};
```

---

## 5. Verification Method & Implementation Guidance

To verify this inventory and perform implementation during subsequent milestones:

1. **Verify Inventory Accuracy**:
   - Inspect files via `view_file` at the cited line numbers.
   - Run a search for text strings (e.g. `"No soy un robot"`, `"Privacidad y Tratamiento de Datos"`, `"Ingredientes Puros"`) across `src/`.
2. **Verify TypeScript Compatibility**:
   - Update `src/data/translations.ts` with the new dictionary keys.
   - Run `npx tsc --noEmit` or `npm run build` to confirm zero TypeScript compilation errors.
3. **Verify UI Translation Switching**:
   - Switch language between `es` and `en` in the UI top bar or mobile drawer.
   - Verify that all components (Footer, Cookie Banner, Product Drawer, WhatsApp widget, Home slides, Products grid, Industrial quote form, Recipes view, Contact form, Downloads zone) dynamically reflect the chosen language.
