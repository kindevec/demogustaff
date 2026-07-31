import { Product, TechnicalSheet, DownloadItem, Recipe, SiteContent } from '../types';

export const INITIAL_SITE_CONTENT: SiteContent = {
  home_headline: "En Gustaff somos soñadores, creemos en los nuevos proyectos, en nuestro personal, proveedores y clientes",
  home_quienes_somos: "En Gustaff somos soñadores, creemos en los nuevos proyectos, en nuestro personal, proveedores y clientes",
  home_productos_summary: "Contamos con un portafolios variado de productos para consumo",
  home_industrial_summary: "Estamos en todos tus desarrollos de productos para emprendimiento y maquilas",
  about_title: "La fábrica - Historia Gustaff | desde 1998",
  about_history: "GUSTAFF S.A., empresa dedicada a la fabricación y desarrollo de productos de chocolates y coberturas para cada necesidad; fue constituída el 18 de junio del 1998 .\n\nA medida que fue creciendo el negocio, en el año de 2002 inicia sus operaciones industriales en el km 7.5 de la Vía a Daule, Guayaquil, constituyéndose como una pequeña industria de chocolates generando empleos a nivel local.\n\nNuestro Gerente General tuvo la visión de aplicar estrategias técnicas y administrativas para que la empresa adquiera su crecimiento, basado en desarrollar y brindar productos y servicios de excelente calidad para nuestros clientes.\n\nEn la actualidad Gustaff S.A. se encuentra ubicada en el km 8.5 vía a Daule, lotización San Francisco Av. Camilo Ponce Mz. 7 Solar 3 donde sigue desarrollando productos de chocolates, coberturas y galletas para cada necesidad.",
  about_mision: "Desarrollar y Elaborar productos de Chocolatería y Confitería para cada necesidad industrial y de consumo.\n\nGUSTAFF S.A. y sus colaboradores están comprometidos y participan de forma activa en cumplir:\n• Las normas de calidad\n• El control en sus procesos\n• La seguridad alimentaria de sus productos\n• La mejora continua de su Sistema de Inocuidad Alimentaria.\n• El cuidado del medio Ambiente",
  about_vision: "Mantener la satisfacción de nuestros clientes actuales y futuros; asegurándoles un servicio de calidad en nuestros procesos y la inocuidad de nuestros productos.\n\nSostener la rentabilidad de la Empresa, liderando y ampliándonos en el mercado local y participar estratégicamente en los mercados de exportación.\n\nDesarrollar talentos y habilidades de nuestros colaboradores, manteniendo un buen ambiente laboral y motivándolos para satisfacer continuamente las necesidades de nuestros clientes y consumidores.",
  about_politica_calidad: "POLITICA DE LA CALIDAD Y SEGURIDAD ALIMENTARIA\n\nGUSTAFF S.A. es una empresa dedicada al procesamiento y comercialización de alimentos como: chocolates, sucedáneos de chocolate, productos de confitería, galletas, polvos de cacao y azúcar impalpable.\n\nLa política de GUSTAFF S.A. está orientada a la producción de alimentos inocuos, de calidad, auténticos y cumpliendo con estándares y normas ecuatorianas e internacionales aplicables a sus productos, utilizando procedimientos de mejora continua con el propósito de aumentar el desempeño de la Seguridad Alimentaria y proporcionar la satisfacción de sus clientes y consumidores.\n\nSocializar esta Política con el personal interno y externo mediante los medios de comunicación indicados por la Organización.\n\nFomentar entre nuestros colaboradores el comportamiento ético, fomentando la cultura de calidad y de inocuidad o seguridad alimentaria.\n\nLa Dirección y el Personal de la GUSTAFF S.A. comparten y entiende este sistema de gestión como una forma de trabajo para todas y cada una de sus actividades y para poder aplicarla ha definido objetivos que ayuden al cumplimiento de la misma.",
  contact_intro: "Para sugerencias o inquietudes, ingrese sus datos y atenderemos su petición.",
  contact_address: "Km 8.5 Vía a Daule, Lotización San Francisco Mz. 2 Solar 3 (Av. Camilo Ponce Mz. 7 Solar 3), Guayaquil, Ecuador",
  contact_phones: "042255773 - 2264756",
  contact_whatsapp: "0969718045 (+593 96 971 8045)"
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    code: 'GUST-IND-01',
    name: 'Cocoa edulcorada',
    category: 'industrial',
    package_size: 'Sacos de 25 kg',
    description: 'Polvo de cacao de alta pureza edulcorado óptimo para repostería industrial, bebidas achocolatadas, galletería y mezclas secas.',
    image: '/images/bodegon/ChatGPT Image 2 jun 2026, 10_37_18 a.m.png',
    spec_sheet_url: '/docs/FT-Cocoa-Edulcorada-Gustaff.pdf',
    features: ['Humedad máx 5%', 'Solubilidad superior', 'Granulometría homogénea', 'Aroma intenso a cacao'],
    is_featured: true,
    order: 1
  },
  {
    id: 'prod-2',
    code: 'GUST-IND-02',
    name: 'Cocoa alcalina',
    category: 'industrial',
    package_size: 'Sacos de 25 kg',
    description: 'Cacao en polvo procesado con alcalinización superior para lograr un color oscuro profundo, menor acidez y excelente solubilidad en lácteos y helados.',
    image: '/images/bodegon/ChatGPT Image 2 jun 2026, 10_37_18 a.m.png',
    spec_sheet_url: '/docs/FT-Cocoa-Alcalina-Gustaff.pdf',
    features: ['PH 7.2 - 7.6', 'Grasa 10-12%', 'Color castaño profundo', 'Ideal para panificación y heladería'],
    is_featured: true,
    order: 2
  },
  {
    id: 'prod-3',
    code: 'GUST-IND-03',
    name: 'Gotas y minigotas',
    category: 'industrial',
    package_size: 'Cajas de 5 kg',
    description: 'Gotas de cobertura de chocolate termoestables que mantienen su forma tras el horneado. Excelente para galletas chocochip y panetones.',
    image: '/images/bodegon/ChatGPT Image 29 may 2026, 12_56_32 p.m.png',
    spec_sheet_url: '/docs/FT-Gotas-Minigotas-Gustaff.pdf',
    features: ['Resistentes al horneado hasta 200°C', 'Distribución uniforme', 'Brillo constante', 'Sabor semidulce equilibrado'],
    is_featured: true,
    order: 3
  },
  {
    id: 'prod-4',
    code: 'GUST-IND-04',
    name: 'Botones',
    category: 'industrial',
    package_size: 'Cajas de 10 kg',
    description: 'Discos/Botones de cobertura industrial de fácil fundido. Diseñados para moldeado, bañado de galletas, alfajores y bombones.',
    image: '/images/bodegon/ChatGPT Image 29 may 2026, 10_35_38 a.m.png',
    spec_sheet_url: '/docs/FT-Botones-Chocolate-Gustaff.pdf',
    features: ['Fundido rápido a 40-45°C', 'Fluidez perfecta para bañado', 'Cierre firme con crocancia', 'Versiones Leche, Semiamargo y Blanco'],
    is_featured: true,
    order: 4
  },
  {
    id: 'prod-5',
    code: 'GUST-IND-05',
    name: 'Azúcar impalpable',
    category: 'industrial',
    package_size: 'Sacos de 25 kg',
    description: 'Azúcar glass micro-pulverizada de fluidez excepcional con antiaglomerante alimentario, indispensable para cubiertas, glacés y turrones.',
    image: '/images/bodegon/ChatGPT Image 2 jun 2026, 10_37_18 a.m.png',
    spec_sheet_url: '/docs/FT-Azucar-Impalpable-Gustaff.pdf',
    features: ['Granulometría ultrafina', 'Cero grumos', 'Dispersión homogénea', 'Certificado Grado Alimentario'],
    is_featured: false,
    order: 5
  },
  {
    id: 'prod-6',
    code: 'GUST-IND-06',
    name: 'Palillos chocolate',
    category: 'industrial',
    package_size: 'Cajas de 5 kg',
    description: 'Fideos / palillos fideos de cobertura de chocolate duro ideal para decoración de tortas, cupcakes, helados y dona toppings.',
    image: '/images/bodegon/CHOCOBANANO.jpg',
    spec_sheet_url: '/docs/FT-Palillos-Chocolate-Gustaff.pdf',
    features: ['Gran resistencia mecánica', 'Brillo natural', 'Excelente presencia visual', 'Caja con protección antihumedad'],
    is_featured: false,
    order: 6
  },
  {
    id: 'prod-7',
    code: 'GUST-IND-07',
    name: 'Palillos multicolor',
    category: 'industrial',
    package_size: 'Cajas de 5 kg',
    description: 'Grajeas / palillos multicolor horneables y de terminación para la industria de confitería, heladería y repostería festiva.',
    image: '/images/bodegon/CHOCOBANANO.jpg',
    spec_sheet_url: '/docs/FT-Palillos-Multicolor-Gustaff.pdf',
    features: ['Pigmentos permitidos de grado alimenticio', 'No destiñen en cremas', 'Formato uniforme'],
    is_featured: false,
    order: 7
  },
  {
    id: 'prod-8',
    code: 'GUST-IND-08',
    name: 'Mini milk',
    category: 'industrial',
    package_size: 'Cajas de 5 kg',
    description: 'Bocados y micro-gotas de chocolate con leche cremosa, enriquecidos con sólidos lácteos para un sabor suave y reconfortante.',
    image: '/images/bodegon/ChatGPT Image 29 may 2026, 10_35_38 a.m.png',
    spec_sheet_url: '/docs/FT-Mini-Milk-Gustaff.pdf',
    features: ['Sabor lácteo cremoso', 'Melt-in-mouth rápido', 'Insuperable para confitería infantil'],
    is_featured: true,
    order: 8
  },
  {
    id: 'prod-9',
    code: 'GUST-IND-09',
    name: 'Kibledd',
    category: 'industrial',
    package_size: 'Sacos de 25 kg',
    description: 'Granulado crocante / trozos de cobertura tostada ideales para toppings en heladería, rellenos de bombones y cereales de chocolate.',
    image: '/images/bodegon/ChatGPT Image 29 may 2026, 12_56_32 p.m.png',
    spec_sheet_url: '/docs/FT-Kibledd-Gustaff.pdf',
    features: ['Textura extra crocante', 'Excelente vida útil', 'Ideal para maquinarias industriales de ensacado'],
    is_featured: false,
    order: 9
  },
  {
    id: 'prod-10',
    code: 'GUST-IND-10',
    name: 'Sirope de chocolate',
    category: 'industrial',
    package_size: 'Pomas de 6 kg',
    description: 'Salsa densa de chocolate rica en cacao puro, fluida a temperatura ambiente. Perfecta para veteado de helados, waffles y malteadas.',
    image: '/images/bodegon/ChatGPT Image 29 may 2026, 12_56_32 p.m.png',
    spec_sheet_url: '/docs/FT-Sirope-Chocolate-Gustaff.pdf',
    features: ['Sin necesidad de calentamiento previa', 'Brillo óptico alto', 'Empaque ergónomico con dispensador industrial'],
    is_featured: true,
    order: 10
  },
  {
    id: 'prod-11',
    code: 'GUST-IND-11',
    name: 'Galleta para helado tipo sanduche',
    category: 'industrial',
    package_size: 'Cajas de 10 kg',
    description: 'Placas de galleta de chocolate amargo horneadas con baja permeabilidad, diseñadas para ensamblaje mecánico de helados sándwich.',
    image: '/images/bodegon/ChatGPT Image 27 may 2026, 12_34_00 p.m.png',
    spec_sheet_url: '/docs/FT-Galleta-Helado-Sanduche-Gustaff.pdf',
    features: ['Mantiene consistencia crujiente en congelación (-18°C)', 'Dimensiones de precisión milimétrica', 'Resistencia al quiebre'],
    is_featured: true,
    order: 11
  },
  {
    id: 'prod-12',
    code: 'GUST-IND-12',
    name: 'Galleta molida',
    category: 'industrial',
    package_size: 'Cajas de 14 kg',
    description: 'Miga y granulado de galleta de chocolate oscuro seleccionada, listo para usar en bases de cheesecakes, capas de postres y toppings.',
    image: '/images/bodegon/ChatGPT Image 27 may 2026, 12_34_00 p.m.png',
    spec_sheet_url: '/docs/FT-Galleta-Molida-Gustaff.pdf',
    features: ['Granulometría uniforme libre de polvo fino', 'Sabor equilibrado de cacao', 'Ideal para bases de tartas de congelación'],
    is_featured: false,
    order: 12
  }
];

export const INITIAL_TECHNICAL_SHEETS: TechnicalSheet[] = INITIAL_PRODUCTS.map(p => ({
  id: `sheet-${p.id}`,
  product_id: p.id,
  product_name: p.name,
  package_size: p.package_size,
  version: '2026.1 - Rev A',
  pdf_url: p.spec_sheet_url || `/docs/FT-${p.name.replace(/\s+/g, '-')}-Gustaff.pdf`,
  file_size: '1.4 MB',
  updated_at: '2026-01-15',
  description: `Ficha Técnica Oficial con especificaciones fisicoquímicas, microbiológicas, tabla nutricional y condiciones de almacenamiento para ${p.name}.`
}));

export const INITIAL_DOWNLOADS: DownloadItem[] = [
  ...INITIAL_TECHNICAL_SHEETS.map(ts => ({
    id: `dl-${ts.id}`,
    title: `Ficha Técnica: ${ts.product_name} (${ts.package_size})`,
    category: 'ficha_tecnica' as const,
    file_type: 'PDF',
    file_size: ts.file_size,
    description: ts.description,
    download_url: ts.pdf_url,
    required_auth: true
  })),
  {
    id: 'dl-cat-2026',
    title: 'Catálogo General de Productos e Insumos Industriales Gustaff 2026',
    category: 'catalogo',
    file_type: 'PDF',
    file_size: '8.5 MB',
    description: 'Catálogo institucional completo con portafolio de chocolates, coberturas, polvos de cacao, galletas y presentaciones para maquila.',
    download_url: '/docs/Catalogo-General-Gustaff-2026.pdf',
    required_auth: true
  },
  {
    id: 'dl-brochure-inst',
    title: 'Folleto Institucional y Perfil de Planta Gustaff S.A.',
    category: 'brochure',
    file_type: 'PDF',
    file_size: '4.2 MB',
    description: 'Presentación de planta, capacidad instalada en Vía a Daule Guayaquil, estándares de calidad e historia desde 1998.',
    download_url: '/docs/Folleto-Institucional-Gustaff.pdf',
    required_auth: true
  },
  {
    id: 'dl-cert-bpm-haccp',
    title: 'Resumen de Políticas de Calidad e Inocuidad (BPM / HACCP)',
    category: 'certificacion',
    file_type: 'PDF',
    file_size: '2.1 MB',
    description: 'Documento normativo de acreditaciones sanitarias, buenas prácticas de manufactura y control de alérgenos.',
    download_url: '/docs/Certificaciones-Inocuidad-Gustaff.pdf',
    required_auth: true
  }
];

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'rec-1',
    title: 'Torta Suprema con Cocoa Alcalina Gustaff',
    description: 'Una torta húmeda con intenso aroma a cacao, miga sedosa y cobertura espejo elaborada con botones semiamargos.',
    prep_time: '45 mins',
    difficulty: 'Fácil',
    servings: '12 porciones',
    ingredients: [
      '200g de Cocoa Alcalina Gustaff (Sacos de 25kg)',
      '300g de harina pastelera',
      '250g de Azúcar Impalpable Gustaff',
      '3 huevos frescos',
      '150ml de aceite vegetal',
      '200ml de suero de leche cálido',
      '15g de polvo de hornear'
    ],
    instructions: [
      'Cernir la Cocoa Alcalina Gustaff junto a la harina y el Azúcar Impalpable.',
      'Batir los huevos con el aceite e incorporar alternadamente los secos con el suero de leche.',
      'Hornear a 175°C durante 35 minutos.',
      'Bañar con sirope caliente de chocolate Gustaff o ganache de botones.'
    ],
    image: '/images/bodegon/CHOCOBANANO.jpg',
    featured_product_name: 'Cocoa alcalina Gustaff'
  },
  {
    id: 'rec-2',
    title: 'Sandwiches Helados Artesanales de Galleta Gustaff',
    description: 'Deliciosa combinación de helado cremoso de vainilla contenido entre dos galletas horneadas especial para congelación.',
    prep_time: '20 mins',
    difficulty: 'Fácil',
    servings: '20 unidades',
    ingredients: [
      '40 unidades de Galleta para helado tipo sanduche Gustaff',
      '2 litros de helado de vainilla artesanal',
      '100g de Gotas o Minigotas de chocolate Gustaff para decorar bordes'
    ],
    instructions: [
      'Acomodar las galletas Gustaff en una bandeja fría.',
      'Colocar una porción uniforme de helado congelado firme de 2cm de grosor.',
      'Poner la segunda galleta presionando suavemente.',
      'Rodar los bordes en minigotas de chocolate Gustaff y congelar a -18°C.'
    ],
    image: '/images/bodegon/ChatGPT Image 27 may 2026, 12_34_00 p.m.png',
    featured_product_name: 'Galleta para helado tipo sanduche'
  },
  {
    id: 'rec-3',
    title: 'Galletas Chocochip Horneadas con Gotas Termoestables',
    description: 'Clásicas galletas doradas con generosas gotas de chocolate que conservan su cuerpo crujiente al morder.',
    prep_time: '30 mins',
    difficulty: 'Fácil',
    servings: '24 galletas',
    ingredients: [
      '250g de Gotas y minigotas de chocolate Gustaff',
      '200g de mantequilla sin sal',
      '150g de azúcar moreno',
      '100g de Azúcar Impalpable Gustaff',
      '300g de harina leudante'
    ],
    instructions: [
      'Cremar la mantequilla con los azúcares hasta aclarar.',
      'Incorporar harina y mezclar hasta unir.',
      'Agregar las Gotas termoestables Gustaff.',
      'Formar bolitas de 35g y hornear a 180°C por 12-14 minutos.'
    ],
    image: '/images/bodegon/ChatGPT Image 26 may 2026, 02_00_33 p.m.png',
    featured_product_name: 'Gotas y minigotas Gustaff'
  }
];
