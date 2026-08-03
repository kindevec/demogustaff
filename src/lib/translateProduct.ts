import { Product, Language } from '../types';

export const translateProduct = (product: Product, lang: Language): Product => {
  if (lang === 'es') return product;

  // Create a deep copy to translate
  const translated = { 
    ...product,
    features: product.features ? [...product.features] : undefined
  };

  // 1. Generic Package Size Translations
  if (translated.package_size) {
    translated.package_size = translated.package_size
      .replace('Sacos de 25 kg', '25 kg Bags')
      .replace('Sacos de', 'Bags of')
      .replace('Cajas de 10 kg', '10 kg Boxes')
      .replace('Cajas de 5 kg', '5 kg Boxes')
      .replace('Cajas de', 'Boxes of')
      .replace('Baldes de 4 kg', '4 kg Pails')
      .replace('Baldes de', 'Pails of')
      .replace('Pomas de 6 kg', '6 kg Pails')
      .replace('Pomas de', 'Pails of')
      .replace('Empaque Individual', 'Individual Packaging');
  }

  // 2. Exact Description Translations for Industrial Products
  if (translated.description) {
    translated.description = translated.description
      .replace('Exquisito producto Gustaff:', 'Exquisite Gustaff product:')
      .replace('Ideal para toda la familia.', 'Ideal for the whole family.')
      .replace('Polvo de cacao de alta pureza edulcorado óptimo para repostería industrial, bebidas achocolatadas, galletería y mezclas secas.', 'High-purity sweetened cocoa powder, optimal for industrial baking, chocolate drinks, cookies, and dry mixes.')
      .replace('Cacao en polvo procesado con alcalinización superior para lograr un color oscuro profundo, menor acidez y excelente solubilidad en lácteos y helados.', 'Superior alkalized cocoa powder to achieve a deep dark color, lower acidity, and excellent solubility in dairy and ice cream.')
      .replace('Gotas de cobertura de chocolate termoestables que mantienen su forma tras el horneado. Excelente para galletas chocochip y panetones.', 'Bake-stable chocolate coating drops that maintain their shape after baking. Excellent for chocolate chip cookies and panettone.')
      .replace('Discos/Botones de cobertura industrial de fácil fundido. Diseñados para moldeado, bañado de galletas, alfajores y bombones.', 'Industrial coating discs/buttons for easy melting. Designed for molding, enrobing cookies, alfajores, and bonbons.')
      .replace('Azúcar glass micro-pulverizada de fluidez excepcional con antiaglomerante alimentario, indispensable para cubiertas, glacés y turrones.', 'Industrial-grade micro-pulverized sugar with exceptional fluidity and food anti-caking agent, indispensable for covers, glazes, and nougats.')
      .replace('Fideos / palillos fideos de cobertura de chocolate duro ideal para decoración de tortas, cupcakes, helados y dona toppings.', 'Hard chocolate coating noodles / sprinkles ideal for decorating cakes, cupcakes, ice cream, and donut toppings.')
      .replace('Grajeas / palillos multicolor horneables y de terminación para la industria de confitería, heladería y repostería festiva.', 'Bake-stable multicolored sprinkles / nonpareils for finishing in the confectionery, ice cream, and festive pastry industry.')
      .replace('Bocados y micro-gotas de chocolate con leche cremosa, enriquecidos con sólidos lácteos para un sabor suave y reconfortante.', 'Creamy milk chocolate bites and micro-drops, enriched with milk solids for a smooth and comforting flavor.')
      .replace('Granulado crocante / trozos de cobertura tostada ideales para toppings en heladería, rellenos de bombones y cereales de chocolate.', 'Crunchy granules / pieces of toasted coating ideal for ice cream toppings, bonbon fillings, and chocolate cereals.')
      .replace('Salsa densa de chocolate rica en cacao puro, fluida a temperatura ambiente. Perfecta para veteado de helados, waffles y malteadas.', 'Dense chocolate sauce rich in pure cocoa, fluid at room temperature. Perfect for marbleizing ice cream, waffles, and milkshakes.')
      .replace('Placas de galleta de chocolate amargo horneadas con baja permeabilidad, diseñadas para ensamblaje mecánico de helados sándwich.', 'Baked dark chocolate cookie plates with low permeability, designed for mechanical assembly of ice cream sandwiches.')
      .replace('Miga y granulado de galleta de chocolate oscuro seleccionada, listo para usar en bases de cheesecakes, capas de postres y toppings.', 'Selected dark chocolate cookie crumbs and granules, ready to use in cheesecake bases, dessert layers, and toppings.');
  }

  // 3. Exact Features Translations
  if (translated.features) {
    translated.features = translated.features.map(f => {
      return f
        .replace('Humedad máx 5%', 'Max humidity 5%')
        .replace('Solubilidad superior', 'Superior solubility')
        .replace('Granulometría homogénea', 'Homogeneous granulometry')
        .replace('Aroma intenso a cacao', 'Intense cocoa aroma')
        .replace('PH 7.2 - 7.6', 'PH 7.2 - 7.6')
        .replace('Grasa 10-12%', 'Fat 10-12%')
        .replace('Color castaño profundo', 'Deep brown color')
        .replace('Ideal para panificación y heladería', 'Ideal for baking and ice cream')
        .replace('Fundido rápido a 40-45°C', 'Fast melting at 40-45°C')
        .replace('Fluidez perfecta para bañado', 'Perfect fluidity for coating')
        .replace('Cierre firme con crocancia', 'Firm set with crunch')
        .replace('Versiones Leche, Semiamargo y Blanco', 'Milk, Semi-sweet and White versions')
        .replace('Granulometría ultrafina', 'Ultra-fine granulometry')
        .replace('Cero grumos', 'Zero lumps')
        .replace('Dispersión homogénea', 'Homogeneous dispersion')
        .replace('Certificado Grado Alimentario', 'Food Grade Certified')
        .replace('Resistentes al horneado hasta 200°C', 'Bake-resistant up to 200°C')
        .replace('Distribución uniforme', 'Uniform distribution')
        .replace('Brillo constante', 'Constant shine')
        .replace('Sabor semidulce equilibrado', 'Balanced semi-sweet flavor')
        .replace('Gran resistencia mecánica', 'Great mechanical resistance')
        .replace('Brillo natural', 'Natural shine')
        .replace('Excelente presencia visual', 'Excellent visual presence')
        .replace('Caja con protección antihumedad', 'Moisture-proof box')
        .replace('Pigmentos permitidos de grado alimenticio', 'Food-grade permitted pigments')
        .replace('No destiñen en cremas', 'Do not bleed in creams')
        .replace('Formato uniforme', 'Uniform format')
        .replace('Sabor lácteo cremoso', 'Creamy dairy flavor')
        .replace('Melt-in-mouth rápido', 'Fast melt-in-mouth')
        .replace('Insuperable para confitería infantil', 'Unbeatable for kids confectionery')
        .replace('Textura extra crocante', 'Extra crunchy texture')
        .replace('Excelente vida útil', 'Excellent shelf life')
        .replace('Ideal para maquinarias industriales de ensacado', 'Ideal for industrial bagging machinery')
        .replace('Sin necesidad de calentamiento previa', 'No prior heating needed')
        .replace('Brillo óptico alto', 'High optical shine')
        .replace('Empaque ergónomico con dispensador industrial', 'Ergonomic packaging with industrial dispenser')
        .replace('Mantiene consistencia crujiente en congelación (-18°C)', 'Maintains crispy consistency in freezing (-18°C)')
        .replace('Dimensiones de precisión milimétrica', 'Millimetric precision dimensions')
        .replace('Resistencia al quiebre', 'Break resistance')
        .replace('Granulometría uniforme libre de polvo fino', 'Uniform granulometry free of fine dust')
        .replace('Sabor equilibrado de cacao', 'Balanced cocoa flavor')
        .replace('Ideal para bases de tartas de congelación', 'Ideal for freezing tart bases');
    });
  }
  const nameTranslations: Record<string, string> = {
    'Cocoa edulcorada': 'Sweetened Cocoa',
    'Cocoa alcalina': 'Alkalized Cocoa',
    'Gotas y minigotas': 'Drops & Mini Drops',
    'Botones': 'Buttons',
    'Azúcar impalpable': 'Powdered Sugar',
    'Palillos chocolate': 'Chocolate Sticks',
    'Palillos multicolor': 'Multicolored Sticks',
    'Mini milk': 'Mini Milk',
    'Kibledd': 'Kibbled Chocolate',
    'Sirope de chocolate': 'Chocolate Syrup',
    'Galleta para helado tipo sanduche': 'Ice Cream Sandwich Cookie',
    'Galleta molida': 'Ground Cookie Crumb',
    'Baldes Crema Chocolate Negro Y Cobertura Gustaff 4kg': 'Gustaff Dark Chocolate & Coating Cream Pails 4kg',
    'Baldes Crema Relleno Avellana Chocolate Gustaff 4kg': 'Gustaff Hazelnut Chocolate Cream Pails 4kg',
    'Baldes Crema Relleno Blanco Gustaff 4kg': 'Gustaff White Filling Cream Pails 4kg',
    'Baldes Crema Relleno Chocolate Gustaff 4kg': 'Gustaff Chocolate Filling Cream Pails 4kg',
    'Balin Grageas Arroz Crocante Chocolate Y Blanco 200g': 'Chocolate & White Crispy Rice Dragees 200g',
    'Bodegon Presentacion Cobertura Papi Choc 1kg 3kg': 'Papi Choc Coating 1kg & 3kg',
    'Caja Exhibidora Wafer Cocada Gustaff 25g': 'Gustaff Coconut Wafer Display Box 25g',
    'Caja Monedas Cobertura Chocolate Negro Y Blanco': 'Dark & White Chocolate Coating Coins Box',
    'Choco Banano Negro Balde Y Mangas': 'Dark Choco Banana Pail & Sleeves',
    'Chocolatines Ricoso Coco Y Manjar Empaques': 'Ricoso Coconut & Dulce de Leche Chocolates',
    'Chocoleta Paleta Chocolate Avellanas Gustaff Empaques': 'Gustaff Hazelnut Chocolate Popsicles',
    'Cocoa Forty Repostera Y Bebidas Varios Tamanos': 'Forty Cocoa for Baking & Drinks (Various Sizes)',
    'Crema Avellanas Con Chocolate Frasco': 'Hazelnut Chocolate Cream Jar',
    'Dlocura Mini Grageas Chocolate Gustaff 15g': 'Gustaff Dlocura Mini Chocolate Dragees 15g',
    'Futbolita Bolitas Chocolate Gustaff Empaques': 'Gustaff Futbolita Chocolate Balls',
    'Galletas Cocada Navidad Gustaff 125g': 'Gustaff Christmas Coconut Cookies 125g',
    'Galletas Cocada Y Paty Variados 75g': 'Assorted Coconut & Paty Cookies 75g',
    'Galletas Cocada Y Paty Variedad Sabores Gustaff 75g': 'Gustaff Assorted Flavors Coconut & Paty Cookies 75g',
    'Galletas Paty Mantequilla Chocolate Naranja Gustaff 75g': 'Gustaff Paty Butter Chocolate Orange Cookies 75g',
    'Galletas Paty Navidad Gustaff 125g': 'Gustaff Christmas Paty Cookies 125g',
    'Pastry Chocolate 50 Cacao Semiamargo 100g': 'Pastry 50% Cocoa Semi-sweet Chocolate 100g',
    'Polvo De Cacao Alcalino 500g': 'Alkalized Cocoa Powder 500g',
    'Rapi Choc Choco Banano Sabores Rumbo Al Mundial': 'Rapi Choc Banana Flavors World Cup Edition',
    'Rapi Choc Mini Gotas Chocolate 200g': 'Rapi Choc Mini Chocolate Drops 200g',
    'Rapichoc Chocobanano Variedad Sabores': 'Rapichoc Assorted Banana Flavors',
    'Zebritas Doble Chocolate Galletas 200g': 'Zebritas Double Chocolate Cookies 200g'
  };

  if (nameTranslations[translated.name]) {
    translated.name = nameTranslations[translated.name];
  }

  // 6. Dynamic Overrides (from DB/CMS)
  if (product.name_en) translated.name = product.name_en;
  if (product.description_en) translated.description = product.description_en;
  if (product.package_size_en) translated.package_size = product.package_size_en;
  if (product.features_en && product.features_en.length > 0) translated.features = [...product.features_en];

  return translated;
};
