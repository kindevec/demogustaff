const fs = require('fs');

const newImages = [
    'baldes_crema_chocolate_negro_y_cobertura_gustaff_4kg.png',
    'baldes_crema_relleno_chocolate_gustaff_4kg.png',
    'balin_grageas_arroz_crocante_chocolate_y_blanco_200g.png',
    'bodegon_presentacion_cobertura_papi_choc_1kg_3kg.png',
    'caja_exhibidora_wafer_cocada_gustaff_25g.png',
    'caja_monedas_cobertura_chocolate_negro_y_blanco.png',
    'choco_banano_negro_balde_y_mangas.png',
    'chocolatines_ricoso_coco_y_manjar_empaques.png',
    'chocoleta_paleta_chocolate_avellanas_gustaff_empaques.png',
    'cocoa_forty_repostera_y_bebidas_varios_tamanos.png',
    'crema_avellanas_con_chocolate_frasco.png',
    'dlocura_mini_grageas_chocolate_gustaff_15g.png',
    'futbolita_bolitas_chocolate_gustaff_empaques.png',
    'galletas_cocada_navidad_gustaff_125g.png',
    'galletas_cocada_y_paty_variados_75g.png',
    'galletas_cocada_y_paty_variedad_sabores_gustaff_75g.png',
    'galletas_paty_mantequilla_chocolate_naranja_gustaff_75g.png',
    'galletas_paty_navidad_gustaff_125g.png',
    'pastry_chocolate_50_cacao_semiamargo_100g.png',
    'polvo_de_cacao_alcalino_500g.png',
    'rapi_choc_choco_banano_sabores_rumbo_al_mundial.png',
    'rapi_choc_mini_gotas_chocolate_200g.png',
    'rapichoc_chocobanano_variedad_sabores.jpg',
    'zebritas_doble_chocolate_galletas_200g.png'
];

let sql = '';
let jsonItems = [];
let i = 13;

newImages.forEach((img, idx) => {
    let name = img.replace('.png', '').replace('.jpg', '').split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    let code = 'GUST-NEW-' + (idx + 1).toString().padStart(2, '0');
    let cat = img.includes('galleta') || img.includes('wafer') || img.includes('zebritas') || img.includes('paty') ? 'galletas' 
        : img.includes('cocoa') || img.includes('cacao') ? 'cocoa' 
        : img.includes('cobertura') ? 'coberturas' : 'consumer';
    
    let desc = 'Exquisito producto Gustaff: ' + name + '. Ideal para toda la familia.';
    let package_size = img.includes('25kg') ? 'Sacos de 25 kg' : img.includes('250g') ? 'Empaques de 250 g' : img.includes('4kg') ? 'Baldes de 4 kg' : 'Empaque Individual';
    
    jsonItems.push(`  {
    id: 'prod-${i}',
    code: '${code}',
    name: '${name}',
    category: '${cat}',
    package_size: '${package_size}',
    description: '${desc}',
    image: '/images/bodegon/${img}',
    spec_sheet_url: '/docs/FT-${code}-Gustaff.pdf',
    features: ['Sabor delicioso', 'Calidad Gustaff'],
    is_featured: false,
    order: ${i}
  }`);

    sql += `INSERT INTO public.products (code, name, category, package_size, description, image, spec_sheet_url, features, is_featured, display_order) VALUES ('${code}', '${name}', '${cat}', '${package_size}', '${desc}', '/images/bodegon/${img}', '/docs/FT-${code}-Gustaff.pdf', ARRAY['Sabor delicioso', 'Calidad Gustaff'], false, ${i}) ON CONFLICT (code) DO NOTHING;\n`;
    i++;
});

fs.writeFileSync('new_products.json', jsonItems.join(',\n'));
fs.writeFileSync('new_products.sql', sql);
