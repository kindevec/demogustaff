import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  Sliders,
  Plus,
  Save,
  Check,
  X,
  Upload,
  Move,
  ZoomIn,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Sparkles,
  Link as LinkIcon,
  Edit3,
  Camera,
  Layers,
  Package,
  Factory
} from 'lucide-react';
import { SiteContent, SlideConfig, ProductSlideConfig, IndustrialBannerConfig } from '../../types';
import { uploadProductImage } from '../../lib/supabase';

interface AdminBannersTabProps {
  siteContent: SiteContent;
  onUpdateSiteContent: (content: SiteContent) => void;
}

type SectionId = 'inicio' | 'productos' | 'industrial';

export const DEFAULT_HOME_SLIDES: SlideConfig[] = [
  {
    id: 1,
    tagline: '✦ DESDE 1998 EN ECUADOR',
    titleLine1: 'COBERTURAS DE CHOCOLATE',
    titleAccent: '& GOTAS TERMOESTABLES',
    description: 'Formuladas para resistir altas temperaturas de horneado y congelación sin perder su sabor, brillo ni textura excepcional.',
    image: '/images/Slider de publicidad/COBERTURAS DE CHOCOLATE.webp',
    primaryBtnText: 'Ver Catálogo Industrial',
    primaryTab: 'industrial',
    objectPosition: '50% 50%',
    bgZoom: 100
  },
  {
    id: 2,
    tagline: '✦ ALTA SOLUBILIDAD & RENDIMIENTO',
    titleLine1: 'CACAO EN POLVO',
    titleAccent: 'ALCALINO & EDULCORADO',
    description: 'Extracción pura de cacao 100% ecuatoriano con máximo perfil aromático, ideal para bebidas, repostería y heladería industrial.',
    image: '/images/Slider de publicidad/CACAO EN POLVO.webp',
    primaryBtnText: 'Explorar Cacaos',
    primaryTab: 'products',
    objectPosition: '50% 50%',
    bgZoom: 100
  },
  {
    id: 3,
    tagline: '✦ HELADERÍA & REPOSTERÍA',
    titleLine1: 'GALLETAS & CONOS',
    titleAccent: 'PARA HELADO INDUSTRIAL',
    description: 'Crujientes, sabrosas y diseñadas con la máxima resistencia a la humedad en presentaciones para alta producción.',
    image: '/images/Slider de publicidad/GALLETAS Y CONOS.webp',
    primaryBtnText: 'Ver Galletería',
    primaryTab: 'products',
    objectPosition: '50% 50%',
    bgZoom: 100
  },
  {
    id: 4,
    tagline: '✦ SOLUCIONES A LA MEDIDA',
    titleLine1: 'MAQUILA INDUSTRIAL',
    titleAccent: '& SIROPE DE CACAO',
    description: 'Desarrollamos recetas exclusivas y empaques en sacos de 25 kg, cajas y pomas de 6 kg adaptadas a tu proceso productivo.',
    image: '/images/Slider de publicidad/MAQUILA INDUSTRIAL.webp',
    primaryBtnText: 'Solicitar Maquila',
    primaryTab: 'industrial',
    objectPosition: '50% 50%',
    bgZoom: 100
  }
];

export const DEFAULT_PRODUCT_SLIDES: ProductSlideConfig[] = [
  {
    id: 'coberturas',
    tagline: '✦ CHOCOLATERÍA PREMIUM',
    titleLine1: 'COBERTURAS',
    titleAccent: '& GOTAS DE CHOCOLATE',
    description: 'Botones, gotas termoestables y palillos de cobertura formulados para moldeo, bañado y horneado industrial con brillo y crocancia excepcionales.',
    image: '/images/Slider de publicidad/COBERTURAS DE CHOCOLATE.webp',
    bgColor: '#3A1B12',
    navColor: '#3A1B12',
    accentColor: '#e86014',
    objectPosition: '50% 50%',
    bgZoom: 100
  },
  {
    id: 'cocoa',
    tagline: '✦ SOLUBILIDAD SUPERIOR',
    titleLine1: 'CACAO EN POLVO',
    titleAccent: 'ALCALINO & EDULCORADO',
    description: 'Extracción pura de cacao ecuatoriano con máximo perfil aromático, ideal para bebidas, repostería y heladería industrial.',
    image: '/images/Slider de publicidad/CACAO EN POLVO.webp',
    bgColor: '#2E1208',
    navColor: '#2E1208',
    accentColor: '#d4763a',
    objectPosition: '50% 50%',
    bgZoom: 100
  },
  {
    id: 'galletas',
    tagline: '✦ HELADERÍA & REPOSTERÍA',
    titleLine1: 'GALLETAS & CONOS',
    titleAccent: 'PARA HELADO INDUSTRIAL',
    description: 'Crujientes, sabrosas y diseñadas con máxima resistencia a la humedad en presentaciones para alta producción.',
    image: '/images/Slider de publicidad/GALLETAS Y CONOS.webp',
    bgColor: '#4D3318',
    navColor: '#4D3318',
    accentColor: '#d4a84b',
    objectPosition: '50% 50%',
    bgZoom: 100
  },
  {
    id: 'industrial',
    tagline: '✦ SOLUCIONES A LA MEDIDA',
    titleLine1: 'MAQUILA INDUSTRIAL',
    titleAccent: '& SIROPE DE CACAO',
    description: 'Desarrollamos recetas exclusivas y empaques adaptados a tu proceso productivo con las mejores materias primas.',
    image: '/images/Slider de publicidad/MAQUILA INDUSTRIAL.webp',
    bgColor: '#1A251B',
    navColor: '#1A251B',
    accentColor: '#6db86e',
    objectPosition: '50% 50%',
    bgZoom: 100
  }
];

export const DEFAULT_INDUSTRIAL_BANNER: IndustrialBannerConfig = {
  badge: 'Línea Industrial & Granel',
  title: 'Maquilamos tus emprendimientos',
  subtitle: 'Línea de ingredientes, materias primas y soluciones de empaque industrial para confitería, heladería, galletería y panificación.',
  image: '/images/bodegon/Maquila.webp',
  objectPosition: '50% 50%',
  bgZoom: 100
};

// Robust helper to parse position coordinates safely
const getPosFromSlide = (slide: any): { x: number; y: number } => {
  if (!slide) return { x: 50, y: 50 };
  if (slide.bgPositionX !== undefined && slide.bgPositionY !== undefined) {
    const px = parseFloat(slide.bgPositionX);
    const py = parseFloat(slide.bgPositionY);
    return { x: isNaN(px) ? 50 : Math.max(0, Math.min(100, px)), y: isNaN(py) ? 50 : Math.max(0, Math.min(100, py)) };
  }
  if (slide.objectPosition) {
    const clean = String(slide.objectPosition).replace(/object-|%/g, '').trim();
    const parts = clean.split(/\s+/);
    if (parts.length >= 2) {
      const px = parseFloat(parts[0]);
      const py = parseFloat(parts[1]);
      return { x: isNaN(px) ? 50 : Math.max(0, Math.min(100, px)), y: isNaN(py) ? 50 : Math.max(0, Math.min(100, py)) };
    }
  }
  return { x: 50, y: 50 };
};

export const AdminBannersTab: React.FC<AdminBannersTabProps> = ({ siteContent, onUpdateSiteContent }) => {
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [editedSlide, setEditedSlide] = useState<any>(null);
  const [isUploadingBg, setIsUploadingBg] = useState(false);
  const [isBgUrlModalOpen, setIsBgUrlModalOpen] = useState(false);
  const [bgUrlInput, setBgUrlInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isEditingBg, setIsEditingBg] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  
  const panStartRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  // Merge custom slides with full default data
  const homeSlides = useMemo(() => {
    const custom = siteContent.home_slides || [];
    return DEFAULT_HOME_SLIDES.map((def, idx) => {
      const match = custom.find((c: any) => c.id === def.id) || custom[idx];
      if (!match) return def;
      const pos = getPosFromSlide(match);
      return {
        ...def,
        tagline: match.tagline || def.tagline,
        titleLine1: match.titleLine1 || def.titleLine1,
        titleAccent: match.titleAccent || def.titleAccent,
        description: (match.description && !match.description.endsWith('...')) ? match.description : def.description,
        image: match.image || def.image,
        primaryBtnText: match.primaryBtnText || def.primaryBtnText,
        primaryTab: match.primaryTab || def.primaryTab,
        objectPosition: match.objectPosition || `${pos.x}% ${pos.y}%`,
        bgPositionX: pos.x,
        bgPositionY: pos.y,
        bgZoom: match.bgZoom || def.bgZoom
      };
    });
  }, [siteContent.home_slides]);

  const productSlides = useMemo(() => {
    const custom = siteContent.products_slides || [];
    return DEFAULT_PRODUCT_SLIDES.map((def, idx) => {
      const match = custom.find((c: any) => c.id === def.id) || custom[idx];
      if (!match) return def;
      const pos = getPosFromSlide(match);
      return {
        ...def,
        tagline: match.tagline || def.tagline,
        titleLine1: match.titleLine1 || def.titleLine1,
        titleAccent: match.titleAccent || def.titleAccent,
        description: (match.description && !match.description.endsWith('...')) ? match.description : def.description,
        image: match.image || def.image,
        bgColor: match.bgColor || def.bgColor,
        navColor: match.navColor || def.navColor,
        accentColor: match.accentColor || def.accentColor,
        objectPosition: match.objectPosition || `${pos.x}% ${pos.y}%`,
        bgPositionX: pos.x,
        bgPositionY: pos.y,
        bgZoom: match.bgZoom || def.bgZoom
      };
    });
  }, [siteContent.products_slides]);

  const industrialBanner = useMemo(() => {
    const custom = siteContent.industrial_banner;
    if (!custom) return DEFAULT_INDUSTRIAL_BANNER;
    const pos = getPosFromSlide(custom);
    return {
      ...DEFAULT_INDUSTRIAL_BANNER,
      badge: custom.badge || DEFAULT_INDUSTRIAL_BANNER.badge,
      title: custom.title || DEFAULT_INDUSTRIAL_BANNER.title,
      subtitle: (custom.subtitle && !custom.subtitle.endsWith('...')) ? custom.subtitle : DEFAULT_INDUSTRIAL_BANNER.subtitle,
      image: custom.image || DEFAULT_INDUSTRIAL_BANNER.image,
      objectPosition: custom.objectPosition || `${pos.x}% ${pos.y}%`,
      bgPositionX: pos.x,
      bgPositionY: pos.y,
      bgZoom: custom.bgZoom || DEFAULT_INDUSTRIAL_BANNER.bgZoom
    };
  }, [siteContent.industrial_banner]);

  const getSectionData = useCallback(() => {
    if (activeSection === 'inicio') return homeSlides;
    if (activeSection === 'productos') return productSlides;
    if (activeSection === 'industrial') return [industrialBanner];
    return [];
  }, [activeSection, homeSlides, productSlides, industrialBanner]);

  const sectionData = getSectionData();

  // Load slide into editedSlide only when section or slide index changes
  useEffect(() => {
    if (activeSection) {
      const data = activeSection === 'inicio' ? homeSlides : activeSection === 'productos' ? productSlides : [industrialBanner];
      const safeIndex = Math.min(activeSlideIndex, data.length - 1);
      const target = data[safeIndex] || data[0];
      if (target) {
        const pos = getPosFromSlide(target);
        setEditedSlide({
          ...JSON.parse(JSON.stringify(target)),
          bgPositionX: pos.x,
          bgPositionY: pos.y,
          objectPosition: `${pos.x}% ${pos.y}%`,
          bgZoom: target.bgZoom ?? 100
        });
        setBgUrlInput(target.image || '');
      }
    } else {
      setEditedSlide(null);
    }
  }, [activeSection, activeSlideIndex]);

  const currentOriginalSlide = sectionData[activeSlideIndex] || sectionData[0];
  const currentSlide = editedSlide || currentOriginalSlide;

  const isDirty = editedSlide && currentOriginalSlide
    ? JSON.stringify(editedSlide) !== JSON.stringify(currentOriginalSlide)
    : false;

  const handleCancelChanges = () => {
    if (currentOriginalSlide) {
      const pos = getPosFromSlide(currentOriginalSlide);
      setEditedSlide({
        ...JSON.parse(JSON.stringify(currentOriginalSlide)),
        bgPositionX: pos.x,
        bgPositionY: pos.y,
        objectPosition: `${pos.x}% ${pos.y}%`,
        bgZoom: currentOriginalSlide.bgZoom ?? 100
      });
      setBgUrlInput(currentOriginalSlide.image || '');
    }
  };

  const handleSave = () => {
    if (!editedSlide || !activeSection) return;
    setIsSaving(true);
    
    const pos = getPosFromSlide(editedSlide);
    const slideToSave = {
      ...editedSlide,
      bgPositionX: pos.x,
      bgPositionY: pos.y,
      objectPosition: `${pos.x}% ${pos.y}%`,
      bgZoom: editedSlide.bgZoom ?? 100
    };

    let updatedContent = { ...siteContent };
    
    if (activeSection === 'inicio') {
      const newSlides = [...homeSlides];
      newSlides[activeSlideIndex] = slideToSave;
      updatedContent.home_slides = newSlides;
    } else if (activeSection === 'productos') {
      const newSlides = [...productSlides];
      newSlides[activeSlideIndex] = slideToSave;
      updatedContent.products_slides = newSlides;
    } else if (activeSection === 'industrial') {
      updatedContent.industrial_banner = slideToSave;
    }

    onUpdateSiteContent(updatedContent);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsSaving(false);
    }, 3000);
  };

  // 2D Pan handlers
  const handlePanStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!editedSlide || !isEditingBg) return;
    if ('touches' in e && e.touches.length !== 1) return;
    e.preventDefault();
    setIsPanning(true);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const pos = getPosFromSlide(editedSlide);

    panStartRef.current = {
      x: clientX,
      y: clientY,
      posX: pos.x,
      posY: pos.y,
    };
  }, [editedSlide, isEditingBg]);

  const handlePanMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isPanning || !panStartRef.current || !canvasRef.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const rect = canvasRef.current.getBoundingClientRect();
    const dx = clientX - panStartRef.current.x;
    const dy = clientY - panStartRef.current.y;
    
    // 1 canvas width/height movement = 100% position shift
    const sensX = 100 / Math.max(rect.width, 1);
    const sensY = 100 / Math.max(rect.height, 1);

    const newX = Math.max(0, Math.min(100, panStartRef.current.posX - dx * sensX));
    const newY = Math.max(0, Math.min(100, panStartRef.current.posY - dy * sensY));

    const roundedX = Math.round(newX);
    const roundedY = Math.round(newY);

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setEditedSlide((prev: any) => {
        if (!prev) return null;
        return {
          ...prev,
          bgPositionX: roundedX,
          bgPositionY: roundedY,
          objectPosition: `${roundedX}% ${roundedY}%`
        };
      });
    });
  }, [isPanning]);

  const handlePanEnd = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      panStartRef.current = null;
      cancelAnimationFrame(rafRef.current);
    }
  }, [isPanning]);

  // Global window listener for mouseup / touchend
  useEffect(() => {
    if (!isPanning) return;
    const onUp = () => handlePanEnd();
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, [isPanning, handlePanEnd]);

  const handleBgFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editedSlide) return;

    const tempUrl = URL.createObjectURL(file);
    setEditedSlide((prev: any) => (prev ? { ...prev, image: tempUrl } : null));

    try {
      setIsUploadingBg(true);
      const res = await uploadProductImage(file);
      if (res.success && res.url) {
        setEditedSlide((prev: any) => (prev ? { ...prev, image: res.url } : null));
        setBgUrlInput(res.url);
      } else {
        alert('Error al subir imagen: ' + (res.error || 'Ocurrió un error'));
      }
    } catch (err) {
      console.warn('Storage upload error', err);
    } finally {
      setIsUploadingBg(false);
    }
  };

  const getBgColor = () => {
    if (activeSection === 'productos') return currentSlide.bgColor || '#3A1B12';
    return '#3A1B12';
  };

  const zoomPercent = Math.max(100, Math.min(250, currentSlide?.bgZoom ?? 100));
  const zoomScale = zoomPercent / 100;
  const currentPos = getPosFromSlide(currentSlide);

  // =========================================================================
  // VIEW 1: HUB DE SECCIONES (3 TARJETAS GRANDES A TODO EL ANCHO)
  // =========================================================================
  if (activeSection === null) {
    return (
      <div className="space-y-6 w-full animate-in fade-in duration-200">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm w-full">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <Sliders className="w-4 h-4" />
              <span>Gestor de Banners y Portadas</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              Personalización de Encabezados Principales
            </h2>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
              Modifica en tiempo real los sliders, banners de portada, imágenes de fondo con zoom y textos de las 3 páginas principales del sitio web.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {/* Card Inicio */}
          <div
            onClick={() => { setActiveSection('inicio'); setActiveSlideIndex(0); setIsEditingBg(false); }}
            className="group relative bg-white rounded-3xl border-2 border-slate-200/90 hover:border-amber-500 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="relative aspect-[16/10] w-full bg-[#3A1B12] overflow-hidden">
              <img
                src={homeSlides[0]?.image || '/images/Slider de publicidad/COBERTURAS DE CHOCOLATE.webp'}
                alt="Pestaña Inicio"
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                style={{
                  objectPosition: `${getPosFromSlide(homeSlides[0]).x}% ${getPosFromSlide(homeSlides[0]).y}%`,
                  transform: homeSlides[0]?.bgZoom && homeSlides[0].bgZoom > 100 ? `scale(${homeSlides[0].bgZoom / 100})` : undefined,
                  transformOrigin: 'center center'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3A1B12] via-black/25 to-black/40" />
              <div className="absolute top-3.5 left-3.5 flex items-center gap-2 z-10">
                <span className="text-2xl drop-shadow-md">🏠</span>
                <span className="bg-black/75 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full border border-white/20">
                  Pestaña Inicio
                </span>
              </div>
              <div className="absolute top-3.5 right-3.5 z-10">
                <span className="bg-amber-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-md">
                  {homeSlides.length} Banners
                </span>
              </div>
              <div className="absolute bottom-3 left-4 right-4 z-10">
                <p className="text-white font-black text-sm line-clamp-1 drop-shadow-md">
                  {homeSlides[0]?.titleLine1} <span className="text-amber-400">{homeSlides[0]?.titleAccent}</span>
                </p>
              </div>
            </div>
            <div className="p-5 space-y-3 bg-white flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-amber-600 uppercase tracking-wider block">
                  Carrusel Principal
                </span>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  Carrusel interactivo de {homeSlides.length} diapositivas que reciben al visitante en la portada.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 group-hover:text-amber-600 transition-colors flex items-center gap-1.5">
                  <span>Personalizar Banners</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold">
                  Editar
                </span>
              </div>
            </div>
          </div>

          {/* Card Productos */}
          <div
            onClick={() => { setActiveSection('productos'); setActiveSlideIndex(0); setIsEditingBg(false); }}
            className="group relative bg-white rounded-3xl border-2 border-slate-200/90 hover:border-amber-500 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="relative aspect-[16/10] w-full bg-[#3A1B12] overflow-hidden">
              <img
                src={productSlides[0]?.image || '/images/Slider de publicidad/COBERTURAS DE CHOCOLATE.webp'}
                alt="Pestaña Productos"
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                style={{
                  objectPosition: `${getPosFromSlide(productSlides[0]).x}% ${getPosFromSlide(productSlides[0]).y}%`,
                  transform: productSlides[0]?.bgZoom && productSlides[0].bgZoom > 100 ? `scale(${productSlides[0].bgZoom / 100})` : undefined,
                  transformOrigin: 'center center'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3A1B12] via-black/25 to-black/40" />
              <div className="absolute top-3.5 left-3.5 flex items-center gap-2 z-10">
                <span className="text-2xl drop-shadow-md">📦</span>
                <span className="bg-black/75 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full border border-white/20">
                  Pestaña Productos
                </span>
              </div>
              <div className="absolute top-3.5 right-3.5 z-10">
                <span className="bg-amber-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-md">
                  {productSlides.length} Categorías
                </span>
              </div>
              <div className="absolute bottom-3 left-4 right-4 z-10">
                <p className="text-white font-black text-sm line-clamp-1 drop-shadow-md">
                  {productSlides[0]?.titleLine1} <span className="text-amber-400">{productSlides[0]?.titleAccent}</span>
                </p>
              </div>
            </div>
            <div className="p-5 space-y-3 bg-white flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-amber-600 uppercase tracking-wider block">
                  Slider de Categorías
                </span>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  Encabezado dinámico con {productSlides.length} categorías que introduce el catálogo comercial.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 group-hover:text-amber-600 transition-colors flex items-center gap-1.5">
                  <span>Personalizar Slider</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold">
                  Editar
                </span>
              </div>
            </div>
          </div>

          {/* Card Industrial */}
          <div
            onClick={() => { setActiveSection('industrial'); setActiveSlideIndex(0); setIsEditingBg(false); }}
            className="group relative bg-white rounded-3xl border-2 border-slate-200/90 hover:border-amber-500 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="relative aspect-[16/10] w-full bg-[#3A1B12] overflow-hidden">
              <img
                src={industrialBanner.image || '/images/bodegon/Maquila.webp'}
                alt="Pestaña Industrial"
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                style={{
                  objectPosition: `${getPosFromSlide(industrialBanner).x}% ${getPosFromSlide(industrialBanner).y}%`,
                  transform: industrialBanner.bgZoom && industrialBanner.bgZoom > 100 ? `scale(${industrialBanner.bgZoom / 100})` : undefined,
                  transformOrigin: 'center center'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3A1B12] via-black/25 to-black/40" />
              <div className="absolute top-3.5 left-3.5 flex items-center gap-2 z-10">
                <span className="text-2xl drop-shadow-md">⚙️</span>
                <span className="bg-black/75 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full border border-white/20">
                  Pestaña Industrial
                </span>
              </div>
              <div className="absolute top-3.5 right-3.5 z-10">
                <span className="bg-amber-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-md">
                  1 Banner
                </span>
              </div>
              <div className="absolute bottom-3 left-4 right-4 z-10">
                <p className="text-white font-black text-sm line-clamp-1 drop-shadow-md">
                  {industrialBanner.title}
                </p>
              </div>
            </div>
            <div className="p-5 space-y-3 bg-white flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-amber-600 uppercase tracking-wider block">
                  Banner Maquila & Granel
                </span>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  Portada principal de la línea industrial, maquila de chocolates y materias primas.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 group-hover:text-amber-600 transition-colors flex items-center gap-1.5">
                  <span>Personalizar Portada</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold">
                  Editar
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: EDITOR WYSIWYG A PANTALLA COMPLETA
  // =========================================================================
  return (
    <div className="space-y-4 w-full animate-in fade-in duration-200">
      
      {/* Botón Volver a Secciones */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => { setActiveSection(null); setIsEditingBg(false); }}
          className="px-4 py-2.5 bg-white border border-slate-200 hover:border-amber-500 text-slate-800 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer transition-all hover:bg-amber-50"
        >
          <ArrowLeft className="w-4 h-4 text-amber-600" />
          <span>Volver a Secciones de Banners</span>
        </button>

        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:block">
          Sección activa: <span className="text-amber-600 font-black">{activeSection.toUpperCase()}</span>
        </div>
      </div>

      <div className="space-y-4 w-full">
        {/* BARRA SUPERIOR DE PESTAÑAS DE SLIDES Y ACCIONES */}
        <div className="flex items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm w-full">
          <div className="flex items-center gap-2 overflow-x-auto pr-2">
            {(activeSection === 'inicio' || activeSection === 'productos') && (
              <>
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider pl-1 pr-2">
                  Diapositivas:
                </span>
                {sectionData.map((s, idx) => {
                  const isActive = idx === activeSlideIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => { setActiveSlideIndex(idx); setIsEditingBg(false); }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        isActive
                          ? 'bg-[#3A1B12] text-white shadow-md scale-102 ring-2 ring-amber-500'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <span>#{idx + 1}</span>
                      <span className="max-w-[130px] truncate hidden sm:inline">
                        {s.titleLine1 || `Slide ${idx + 1}`}
                      </span>
                    </button>
                  );
                })}
              </>
            )}
            {activeSection === 'industrial' && (
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider pl-2 flex items-center gap-2">
                <Factory className="w-4 h-4 text-amber-500" />
                <span>Banner de Maquila Industrial (Portada Única)</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isDirty && (
              <button
                type="button"
                onClick={handleCancelChanges}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                title="Descartar cambios"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Cancelar</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isUploadingBg}
              className={`px-6 py-2 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                saveSuccess ? 'bg-emerald-600' : 'bg-amber-500 hover:bg-amber-600'
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>¡Guardado con Éxito!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar Banner</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* LIENZO EN VIVO WYSIWYG EDGE-TO-EDGE */}
        {currentSlide && (
          <div
            ref={canvasRef}
            className={`relative w-full rounded-3xl overflow-hidden border-2 shadow-2xl min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] bg-[#3A1B12] transition-all select-none ${
              isEditingBg
                ? 'border-amber-500 ' + (isPanning ? 'cursor-grabbing' : 'cursor-grab')
                : 'border-slate-200'
            }`}
            onMouseDown={isEditingBg ? handlePanStart : undefined}
            onMouseMove={isEditingBg ? handlePanMove : undefined}
            onMouseUp={isEditingBg ? handlePanEnd : undefined}
            onMouseLeave={isEditingBg ? handlePanEnd : undefined}
            onTouchStart={isEditingBg ? handlePanStart : undefined}
            onTouchMove={isEditingBg ? handlePanMove : undefined}
            onTouchEnd={isEditingBg ? handlePanEnd : undefined}
          >
            {/* Imagen de Fondo con Posición y Zoom limpios sin transform conflict */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img
                src={currentSlide.image || '/images/bodegon/Maquila.webp'}
                alt="Fondo del Banner"
                draggable={false}
                className="w-full h-full object-cover select-none pointer-events-none transition-none"
                style={{
                  objectPosition: `${currentPos.x}% ${currentPos.y}%`,
                  transform: zoomScale > 1 ? `scale(${zoomScale}) translate(${((50 - currentPos.x) * (1 - 1 / zoomScale))}%, ${((50 - currentPos.y) * (1 - 1 / zoomScale))}%)` : undefined,
                  transformOrigin: 'center center',
                }}
              />
            </div>
            
            {/* Overlay Gradiente Exacto de Gustaff */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                background: isEditingBg
                  ? 'rgba(0,0,0,0.35)'
                  : `linear-gradient(to right, ${getBgColor()}f0 0%, ${getBgColor()}cc 35%, ${getBgColor()}80 60%, transparent 85%)`
              }}
            />

            {/* MODO EDICIÓN DE PORTADA (PAN & ZOOM) */}
            {isEditingBg ? (
              <>
                <div className="absolute inset-0 border-4 border-amber-500/50 rounded-3xl pointer-events-none z-10 animate-pulse" />
                
                {/* Indicador Central de Arrastre */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col items-center gap-2 bg-black/60 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/20 shadow-2xl">
                  <Move className="w-8 h-8 text-amber-400 animate-bounce" />
                  <span className="text-white font-bold text-xs sm:text-sm drop-shadow-md">
                    Arrastra en cualquier dirección para encuadrar
                  </span>
                  <span className="text-[10px] text-slate-300 font-mono">
                    Posición: X: {Math.round(currentPos.x)}% | Y: {Math.round(currentPos.y)}%
                  </span>
                </div>

                {/* Barra Inferior Flotante de Zoom y Guardar */}
                <div
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-wrap items-center justify-center gap-4 bg-black/90 backdrop-blur-xl px-6 py-3.5 rounded-2xl border border-white/25 shadow-2xl max-w-xl w-[92%] sm:w-auto"
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2.5">
                    <ZoomIn className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-[11px] text-white/80 font-bold uppercase tracking-wider">Zoom:</span>
                    <input
                      type="range"
                      min="100"
                      max="250"
                      step="5"
                      value={zoomPercent}
                      onChange={(e) => {
                        if (editedSlide) {
                          setEditedSlide({ ...editedSlide, bgZoom: Number(e.target.value) });
                        }
                      }}
                      className="w-32 sm:w-44 h-2 accent-amber-500 cursor-pointer bg-white/20 rounded-lg"
                      title={`Zoom: ${zoomPercent}%`}
                    />
                    <span className="text-xs font-mono text-amber-400 font-bold min-w-[42px] text-center">
                      {zoomPercent}%
                    </span>
                  </div>

                  <div className="w-px h-5 bg-white/20 hidden sm:block" />

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (editedSlide) {
                          setEditedSlide({ ...editedSlide, bgPositionX: 50, bgPositionY: 50, objectPosition: '50% 50%', bgZoom: 100 });
                        }
                      }}
                      className="px-3 py-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Restablecer posición y zoom a valores iniciales"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restablecer</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsEditingBg(false)}
                      className="px-5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Listo</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Botón Editar Portada (Top-Left) */}
                <button
                  type="button"
                  onClick={() => setIsEditingBg(true)}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="absolute top-4 left-4 z-30 px-4 py-2.5 bg-black/80 hover:bg-black text-white font-bold text-xs rounded-2xl backdrop-blur shadow-lg flex items-center gap-2 cursor-pointer transition-all hover:scale-105 border border-white/25"
                  title="Entrar en modo encuadre y zoom de la foto"
                >
                  <Move className="w-4 h-4 text-amber-400" />
                  <span>📐 Editar Portada / Encuadre</span>
                </button>

                {/* Botones Cambiar Fondo y URL (Top-Right) */}
                <div className="absolute top-4 right-4 z-30 flex items-center gap-2" onMouseDown={(e) => e.stopPropagation()}>
                  <label className="px-4 py-2.5 bg-black/80 hover:bg-black text-white font-bold text-xs rounded-2xl backdrop-blur shadow-lg flex items-center gap-2 cursor-pointer transition-all hover:scale-105 border border-white/25">
                    {isUploadingBg ? (
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    ) : (
                      <Upload className="w-4 h-4 text-amber-400" />
                    )}
                    <span>{isUploadingBg ? 'Subiendo...' : '📷 Cambiar Foto (PC)'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBgFileUpload}
                      disabled={isUploadingBg}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsBgUrlModalOpen(true)}
                    className="px-3.5 py-2.5 bg-black/80 hover:bg-black text-white font-bold text-xs rounded-2xl backdrop-blur shadow-lg flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 border border-white/25"
                    title="Pegar URL directa de imagen"
                  >
                    <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>URL</span>
                  </button>
                </div>

                {/* MODAL POPUP PARA PEGAR URL */}
                {isBgUrlModalOpen && (
                  <div className="absolute inset-x-8 top-16 z-40 bg-white p-5 rounded-2xl shadow-2xl border border-slate-200 space-y-3 animate-in fade-in max-w-xl mx-auto">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Pegar URL directa de la imagen</span>
                      <button
                        type="button"
                        onClick={() => setIsBgUrlModalOpen(false)}
                        className="text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="https://... o /images/ruta.webp"
                      value={bgUrlInput}
                      onChange={(e) => setBgUrlInput(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsBgUrlModalOpen(false)}
                        className="px-3.5 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer font-bold"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (bgUrlInput.trim() && editedSlide) {
                            setEditedSlide({ ...editedSlide, image: bgUrlInput.trim() });
                            setIsBgUrlModalOpen(false);
                          }
                        }}
                        className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Aplicar Fondo
                      </button>
                    </div>
                  </div>
                )}

                {/* CAMPOS DE TEXTO EDITABLES DIRECTAMENTE SOBRE EL LIENZO */}
                <div className="relative z-20 h-full w-full max-w-7xl mx-auto flex items-center px-6 sm:px-12 lg:px-16 py-12">
                  <div className="w-full max-w-3xl space-y-5 mt-10 sm:mt-6 text-left">
                    
                    {/* Badge */}
                    <div>
                      <label className="block text-white/70 text-[10px] font-bold uppercase tracking-wider mb-1">
                        Etiqueta Superior (Badge)
                      </label>
                      <div className="inline-flex items-center gap-2 bg-[#e86014] px-4 py-1.5 rounded-full border border-white/20 shadow-md">
                        <Sparkles className="w-3.5 h-3.5 text-white shrink-0" />
                        <input
                          type="text"
                          value={activeSection === 'industrial' ? (currentSlide.badge || '') : (currentSlide.tagline || '')}
                          onChange={(e) => {
                            if (editedSlide) {
                              if (activeSection === 'industrial') setEditedSlide({ ...editedSlide, badge: e.target.value });
                              else setEditedSlide({ ...editedSlide, tagline: e.target.value });
                            }
                          }}
                          placeholder="Etiqueta..."
                          className="bg-transparent font-extrabold text-[11px] text-white uppercase tracking-wider outline-none w-64 sm:w-80"
                        />
                      </div>
                    </div>

                    {/* Titles */}
                    <div className="space-y-2">
                      <label className="block text-white/70 text-[10px] font-bold uppercase tracking-wider">
                        Título Principal {activeSection !== 'industrial' ? '(Línea 1 + Acento Naranja)' : ''}
                      </label>
                      
                      <input
                        type="text"
                        value={activeSection === 'industrial' ? (currentSlide.title || '') : (currentSlide.titleLine1 || '')}
                        onChange={(e) => {
                          if (editedSlide) {
                            if (activeSection === 'industrial') setEditedSlide({ ...editedSlide, title: e.target.value });
                            else setEditedSlide({ ...editedSlide, titleLine1: e.target.value });
                          }
                        }}
                        placeholder="Título Principal..."
                        className="w-full bg-black/30 hover:bg-black/40 focus:bg-black/50 text-white font-black text-2xl sm:text-4xl lg:text-5xl tracking-tight px-4 py-2 rounded-2xl border border-white/20 outline-none focus:ring-2 focus:ring-amber-500 uppercase font-serif backdrop-blur-md shadow-lg"
                      />
                      
                      {activeSection !== 'industrial' && (
                        <input
                          type="text"
                          value={currentSlide.titleAccent || ''}
                          onChange={(e) => {
                            if (editedSlide) setEditedSlide({ ...editedSlide, titleAccent: e.target.value });
                          }}
                          placeholder="Texto Destacado Naranja..."
                          className="w-full bg-black/30 hover:bg-black/40 focus:bg-black/50 text-[#e86014] font-black text-xl sm:text-3xl lg:text-4xl tracking-tight px-4 py-2 rounded-2xl border border-[#e86014]/40 outline-none focus:ring-2 focus:ring-amber-500 font-serif backdrop-blur-md shadow-lg"
                        />
                      )}
                    </div>

                    {/* Description Completa */}
                    <div className="space-y-1">
                      <label className="block text-white/70 text-[10px] font-bold uppercase tracking-wider">
                        Descripción Completa del Banner
                      </label>
                      <textarea
                        rows={3}
                        value={activeSection === 'industrial' ? (currentSlide.subtitle || '') : (currentSlide.description || '')}
                        onChange={(e) => {
                          if (editedSlide) {
                            if (activeSection === 'industrial') setEditedSlide({ ...editedSlide, subtitle: e.target.value });
                            else setEditedSlide({ ...editedSlide, description: e.target.value });
                          }
                        }}
                        placeholder="Ingresa la descripción completa que se mostrará en la portada..."
                        className="w-full bg-black/30 hover:bg-black/40 focus:bg-black/50 text-white text-xs sm:text-sm font-serif italic p-3.5 rounded-2xl border-l-4 border-l-[#e86014] border-y border-r border-white/20 resize-y outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed shadow-lg backdrop-blur-md"
                      />
                    </div>

                    {/* Botón de Acción CTA */}
                    {activeSection !== 'industrial' && (
                      <div className="space-y-1">
                        <label className="block text-white/70 text-[10px] font-bold uppercase tracking-wider">
                          Botón de Acción (Texto y Destino)
                        </label>
                        <div className="inline-flex flex-wrap items-center gap-3 bg-black/40 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-lg">
                          <input
                            type="text"
                            value={currentSlide.primaryBtnText || ''}
                            onChange={(e) => {
                              if (editedSlide) setEditedSlide({ ...editedSlide, primaryBtnText: e.target.value });
                            }}
                            placeholder="Texto del botón..."
                            className="bg-transparent text-white font-bold text-xs sm:text-sm px-3 py-1.5 outline-none focus:border-amber-500 border-b border-white/30 w-48 sm:w-56"
                          />
                          <select
                            value={currentSlide.primaryTab || 'products'}
                            onChange={(e) => {
                              if (editedSlide) setEditedSlide({ ...editedSlide, primaryTab: e.target.value });
                            }}
                            className="bg-[#3A1B12] text-white text-xs font-bold px-3 py-2 rounded-xl border border-white/30 outline-none cursor-pointer"
                          >
                            <option value="products">Ir a Productos</option>
                            <option value="industrial">Ir a Industrial</option>
                            <option value="about">Ir a Conócenos</option>
                            <option value="recipes">Ir a Recetas</option>
                            <option value="contact">Ir a Contacto</option>
                          </select>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
