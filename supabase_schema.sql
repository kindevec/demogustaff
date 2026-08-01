-- ================================================================
-- ESQUEMA SQL COMPLETO PARA SUPABASE - GUSTAFF S.A.
-- Copiar y ejecutar en el Editor SQL de Supabase (https://app.supabase.com)
-- ================================================================

-- 1. Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA DE PROSPECTOS (LEADS / CAPTACIÓN)
CREATE TABLE IF NOT EXISTS public.prospects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company_phone TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index para búsquedas rápidas por correo y fecha
CREATE INDEX IF NOT EXISTS idx_prospects_email ON public.prospects(email);
CREATE INDEX IF NOT EXISTS idx_prospects_created ON public.prospects(created_at DESC);

-- 3. TABLA DE MENSAJES DE CONTACTO
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'replied')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLA DE PRODUCTOS (CATÁLOGO INDUSTRIAL Y CONSUMO)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('industrial', 'consumer', 'coberturas', 'galletas', 'cocoa')),
    package_size TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    spec_sheet_url TEXT,
    features TEXT[],
    is_featured BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLA DE FICHAS TÉCNICAS Y DESCARGAS RESTRINGIDAS
CREATE TABLE IF NOT EXISTS public.technical_sheets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    package_size TEXT NOT NULL,
    version TEXT DEFAULT '2026.1',
    pdf_url TEXT NOT NULL,
    file_size TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABLA DE CONTENIDO EDITABLE DEL SITIO (CMS)
CREATE TABLE IF NOT EXISTS public.site_content (
    key TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ================================================================
-- REGISTRAR POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
-- ================================================================

ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technical_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Permitir inserción pública para captación de prospectos y formulario de contacto
CREATE POLICY "Permitir registro público de prospectos" 
ON public.prospects FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Permitir envío público de contacto" 
ON public.contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Lectura pública para productos, fichas y contenido del sitio
CREATE POLICY "Lectura pública de catálogo de productos" 
ON public.products FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Lectura pública de fichas técnicas" 
ON public.technical_sheets FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Lectura pública de textos CMS" 
ON public.site_content FOR SELECT TO anon, authenticated USING (true);

-- Solo administradores pueden ver todos los prospectos y modificar productos (vía Service Role)

-- ================================================================
-- DATOS SEMILLA (SEED DATA) DE PRODUCTOS INDUSTRIALES GUSTAFF S.A.
-- ================================================================

INSERT INTO public.products (code, name, category, package_size, description, image, spec_sheet_url, features, is_featured, display_order)
VALUES
('GUST-IND-01', 'Cocoa edulcorada', 'industrial', 'Sacos de 25 kg', 'Polvo de cacao de alta pureza edulcorado óptimo para repostería industrial, bebidas achocolatadas, galletería y mezclas secas.', '/images/bodegon/sacos_polvo_cacao_y_azucar_impalpable_gustaff_25kg.png', '/docs/FT-Cocoa-Edulcorada-Gustaff.pdf', ARRAY['Humedad máx 5%', 'Solubilidad superior', 'Granulometría homogénea'], true, 1),
('GUST-IND-02', 'Cocoa alcalina', 'industrial', 'Sacos de 25 kg', 'Cacao en polvo procesado con alcalinización superior para lograr un color oscuro profundo, menor acidez y excelente solubilidad en lácteos y helados.', '/images/bodegon/sacos_polvo_cacao_natural_y_alcalino_gustaff_25kg.png', '/docs/FT-Cocoa-Alcalina-Gustaff.pdf', ARRAY['PH 7.2 - 7.6', 'Grasa 10-12%', 'Color castaño profundo'], true, 2),
('GUST-IND-03', 'Gotas y minigotas', 'industrial', 'Cajas de 5 kg', 'Gotas de cobertura de chocolate termoestables que mantienen su forma tras el horneado. Excelente para galletas chocochip y panetones.', '/images/bodegon/caja_gotas_chocolate_granel.png', '/docs/FT-Gotas-Minigotas-Gustaff.pdf', ARRAY['Resistentes al horneado hasta 200°C', 'Brillo constante'], true, 3),
('GUST-IND-04', 'Botones', 'industrial', 'Cajas de 10 kg', 'Discos/Botones de cobertura industrial de fácil fundido. Diseñados para moldeado, bañado de galletas, alfajores y bombones.', '/images/bodegon/pastry_bloques_chocolate_negro_50_cacao_y_leche_1kg.png', '/docs/FT-Botones-Chocolate-Gustaff.pdf', ARRAY['Fundido rápido a 40-45°C', 'Fluidez perfecta'], true, 4),
('GUST-IND-05', 'Azúcar impalpable', 'industrial', 'Sacos de 25 kg', 'Azúcar glass micro-pulverizada de fluidez excepcional con antiaglomerante alimentario, indispensable para cubiertas, glacés y turrones.', '/images/bodegon/sacos_polvo_cacao_y_azucar_impalpable_gustaff_25kg.png', '/docs/FT-Azucar-Impalpable-Gustaff.pdf', ARRAY['Granulometría ultrafina', 'Cero grumos'], false, 5),
('GUST-IND-06', 'Palillos chocolate', 'industrial', 'Cajas de 5 kg', 'Fideos / palillos fideos de cobertura de chocolate duro ideal para decoración de tortas, cupcakes, helados y dona toppings.', '/images/bodegon/balin_palitos_chocolate_y_multicolor_200g.png', '/docs/FT-Palillos-Chocolate-Gustaff.pdf', ARRAY['Resistencia mecánica', 'Brillo natural'], false, 6),
('GUST-IND-07', 'Palillos multicolor', 'industrial', 'Cajas de 5 kg', 'Grajeas / palillos multicolor horneables y de terminación para la industria de confitería, heladería y repostería festiva.', '/images/bodegon/caja_grageas_lentejas_chocolate_colores_gustaff.png', '/docs/FT-Palillos-Multicolor-Gustaff.pdf', ARRAY['Pigmentos grado alimenticio', 'No destiñen'], false, 7),
('GUST-IND-08', 'Mini milk', 'industrial', 'Cajas de 5 kg', 'Bocados y micro-gotas de chocolate con leche cremosa, enriquecidos con sólidos lácteos para un sabor suave y reconfortante.', '/images/bodegon/cajas_perlas_cereal_chocolate_blanco_y_leche_gustaff.png', '/docs/FT-Mini-Milk-Gustaff.pdf', ARRAY['Sabor lácteo cremoso', 'Melt-in-mouth rápido'], true, 8),
('GUST-IND-09', 'Kibledd', 'industrial', 'Sacos de 25 kg', 'Granulado crocante / trozos de cobertura tostada ideales para toppings en heladería, rellenos de bombones y cereales de chocolate.', '/images/bodegon/sacos_cobertura_chocolate_negro_y_blanco_gustaff.png', '/docs/FT-Kibledd-Gustaff.pdf', ARRAY['Textura extra crocante', 'Excelente vida útil'], false, 9),
('GUST-IND-10', 'Sirope de chocolate', 'industrial', 'Pomas de 6 kg', 'Salsa densa de chocolate rica en cacao puro, fluida a temperatura ambiente. Perfecta para veteado de helados, waffles y malteadas.', '/images/bodegon/siropes_diette_chocolate_menta_blue_fresa_1_25kg.png', '/docs/FT-Sirope-Chocolate-Gustaff.pdf', ARRAY['Fluida a temp ambiente', 'Brillo óptico alto'], true, 10),
('GUST-IND-11', 'Galleta para helado tipo sanduche', 'industrial', 'Cajas de 10 kg', 'Placas de galleta de chocolate amargo horneadas con baja permeabilidad, diseñadas para ensamblaje mecánico de helados sándwich.', '/images/bodegon/zebritas_vainilla_cobertura_chocolate_250g.png', '/docs/FT-Galleta-Helado-Sanduche-Gustaff.pdf', ARRAY['Crujiente a -18°C', 'Precisión milimétrica'], true, 11),
('GUST-IND-12', 'Galleta molida', 'industrial', 'Cajas de 14 kg', 'Miga y granulado de galleta de chocolate oscuro seleccionada, listo para usar en bases de cheesecakes, capas de postres y toppings.', '/images/bodegon/galletas_animalitos_gustaff_200g_y_380g.png', '/docs/FT-Galleta-Molida-Gustaff.pdf', ARRAY['Granulometría uniforme', 'Sin polvo fino'], false, 12)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.products (code, name, category, package_size, description, image, spec_sheet_url, features, is_featured, display_order) VALUES ('GUST-NEW-01', 'Baldes Crema Chocolate Negro Y Cobertura Gustaff 4kg', 'coberturas', 'Baldes de 4 kg', 'Exquisito producto Gustaff: Baldes Crema Chocolate Negro Y Cobertura Gustaff 4kg. Ideal para toda la familia.', '/images/bodegon/baldes_crema_chocolate_negro_y_cobertura_gustaff_4kg.png', '/docs/FT-GUST-NEW-01-Gustaff.pdf', ARRAY['Sabor delicioso', 'Calidad Gustaff'], false, 13) ON CONFLICT (code) DO NOTHING;
INSERT INTO public.products (code, name, category, package_size, description, image, spec_sheet_url, features, is_featured, display_order) VALUES ('GUST-NEW-02', 'Baldes Crema Relleno Chocolate Gustaff 4kg', 'consumer', 'Baldes de 4 kg', 'Exquisito producto Gustaff: Baldes Crema Relleno Chocolate Gustaff 4kg. Ideal para toda la familia.', '/images/bodegon/baldes_crema_relleno_chocolate_gustaff_4kg.png', '/docs/FT-GUST-NEW-02-Gustaff.pdf', ARRAY['Sabor delicioso', 'Calidad Gustaff'], false, 14) ON CONFLICT (code) DO NOTHING;
INSERT INTO public.products (code, name, category, package_size, description, image, spec_sheet_url, features, is_featured, display_order) VALUES ('GUST-NEW-03', 'Balin Grageas Arroz Crocante Chocolate Y Blanco 200g', 'consumer', 'Empaque Individual', 'Exquisito producto Gustaff: Balin Grageas Arroz Crocante Chocolate Y Blanco 200g. Ideal para toda la familia.', '/images/bodegon/balin_grageas_arroz_crocante_chocolate_y_blanco_200g.png', '/docs/FT-GUST-NEW-03-Gustaff.pdf', ARRAY['Sabor delicioso', 'Calidad Gustaff'], false, 15) ON CONFLICT (code) DO NOTHING;
INSERT INTO public.products (code, name, category, package_size, description, image, spec_sheet_url, features, is_featured, display_order) VALUES ('GUST-NEW-04', 'Bodegon Presentacion Cobertura Papi Choc 1kg 3kg', 'coberturas', 'Empaque Individual', 'Exquisito producto Gustaff: Bodegon Presentacion Cobertura Papi Choc 1kg 3kg. Ideal para toda la familia.', '/images/bodegon/bodegon_presentacion_cobertura_papi_choc_1kg_3kg.png', '/docs/FT-GUST-NEW-04-Gustaff.pdf', ARRAY['Sabor delicioso', 'Calidad Gustaff'], false, 16) ON CONFLICT (code) DO NOTHING;
INSERT INTO public.products (code, name, category, package_size, description, image, spec_sheet_url, features, is_featured, display_order) VALUES ('GUST-NEW-05', 'Caja Exhibidora Wafer Cocada Gustaff 25g', 'galletas', 'Empaque Individual', 'Exquisito producto Gustaff: Caja Exhibidora Wafer Cocada Gustaff 25g. Ideal para toda la familia.', '/images/bodegon/caja_exhibidora_wafer_cocada_gustaff_25g.png', '/docs/FT-GUST-NEW-05-Gustaff.pdf', ARRAY['Sabor delicioso', 'Calidad Gustaff'], false, 17) ON CONFLICT (code) DO NOTHING;
INSERT INTO public.products (code, name, category, package_size, description, image, spec_sheet_url, features, is_featured, display_order) VALUES ('GUST-NEW-06', 'Caja Monedas Cobertura Chocolate Negro Y Blanco', 'coberturas', 'Empaque Individual', 'Exquisito producto Gustaff: Caja Monedas Cobertura Chocolate Negro Y Blanco. Ideal para toda la familia.', '/images/bodegon/caja_monedas_cobertura_chocolate_negro_y_blanco.png', '/docs/FT-GUST-NEW-06-Gustaff.pdf', ARRAY['Sabor delicioso', 'Calidad Gustaff'], false, 18) ON CONFLICT (code) DO NOTHING;
INSERT INTO public.products (code, name, category, package_size, description, image, spec_sheet_url, features, is_featured, display_order) VALUES ('GUST-NEW-07', 'Choco Banano Negro Balde Y Mangas', 'consumer', 'Empaque Individual', 'Exquisito producto Gustaff: Choco Banano Negro Balde Y Mangas. Ideal para toda la familia.', '/images/bodegon/choco_banano_negro_balde_y_mangas.png', '/docs/FT-GUST-NEW-07-Gustaff.pdf', ARRAY['Sabor delicioso', 'Calidad Gustaff'], false, 19) ON CONFLICT (code) DO NOTHING;
INSERT INTO public.products (code, name, category, package_size, description, image, spec_sheet_url, features, is_featured, display_order) VALUES ('GUST-NEW-08', 'Chocolatines Ricoso Coco Y Manjar Empaques', 'consumer', 'Empaque Individual', 'Exquisito producto Gustaff: Chocolatines Ricoso Coco Y Manjar Empaques. Ideal para toda la familia.', '/images/bodegon/chocolatines_ricoso_coco_y_manjar_empaques.png', '/docs/FT-GUST-NEW-08-Gustaff.pdf', ARRAY['Sabor delicioso', 'Calidad Gustaff'], false, 20) ON CONFLICT (code) DO NOTHING;
INSERT INTO public.products (code, name, category, package_size, description, image, spec_sheet_url, features, is_featured, display_order) VALUES ('GUST-NEW-09', 'Chocoleta Paleta Chocolate Avellanas Gustaff Empaques', 'consumer', 'Empaque Individual', 'Exquisito producto Gustaff: Chocoleta Paleta Chocolate Avellanas Gustaff Empaques. Ideal para toda la familia.', '/images/bodegon/chocoleta_paleta_chocolate_avellanas_gustaff_empaques.png', '/docs/FT-GUST-NEW-09-Gustaff.pdf', ARRAY['Sabor delicioso', 'Calidad Gustaff'], false, 21) ON CONFLICT (code) DO NOTHING;
INSERT INTO public.products (code, name, category, package_size, description, image, spec_sheet_url, features, is_featured, display_order) VALUES ('GUST-NEW-10', 'Cocoa Forty Repostera Y Bebidas Varios Tamanos', 'cocoa', 'Empaque Individual', 'Exquisito producto Gustaff: Cocoa Forty Repostera Y Bebidas Varios Tamanos. Ideal para toda la familia.', '/images/bodegon/cocoa_forty_repostera_y_bebidas_varios_tamanos.png', '/docs/FT-GUST-NEW-10-Gustaff.pdf', ARRAY['Sabor delicioso', 'Calidad Gustaff'], false, 22) ON CONFLICT (code) DO NOTHING;
INSERT INTO public.products (code, name, category, package_size, description, image, spec_sheet_url, features, is_featured, display_order) VALUES ('GUST-NEW-11', 'Crema Avellanas Con Chocolate Frasco', 'consumer', 'Empaque Individual', 'Exquisito producto Gustaff: Crema Avellanas Con Chocolate Frasco. Ideal para toda la familia.', '/images/bodegon/crema_avellanas_con_chocolate_frasco.png', '/docs/FT-GUST-NEW-11-Gustaff.pdf', ARRAY['Sabor delicioso', 'Calidad Gustaff'], false, 23) ON CONFLICT (code) DO NOTHING;
INSERT INTO public.products (code, name, category, package_size, description, image, spec_sheet_url, features, is_featured, display_order) VALUES ('GUST-NEW-12', 'Dlocura Mini Grageas Chocolate Gustaff 15g', 'consumer', 'Empaque Individual', 'Exquisito producto Gustaff: Dlocura Mini Grageas Chocolate Gustaff 15g. Ideal para toda la familia.', '/images/bodegon/dlocura_mini_grageas_chocolate_gustaff_15g.png', '/docs/FT-GUST-NEW-12-Gustaff.pdf', ARRAY['Sabor delicioso', 'Calidad Gustaff'], false, 24) ON CONFLICT (code) DO NOTHING;
INSERT INTO public.products (code, name, category, package_size, description, image, spec_sheet_url, features, is_featured, display_order) VALUES ('GUST-NEW-13', 'Futbolita Bolitas Chocolate Gustaff Empaques', 'consumer', 'Empaque Individual', 'Exquisito producto Gustaff: Futbolita Bolitas Chocolate Gustaff Empaques. Ideal para toda la familia.', '/images/bodegon/futbolita_bolitas_chocolate_gustaff_empaques.png', '/docs/FT-GUST-NEW-13-Gustaff.pdf', ARRAY['Sabor delicioso', 'Calidad Gustaff'], false, 25) ON CONFLICT (code) DO NOTHING;
INSERT INTO public.products (code, name, category, package_size, description, image, spec_sheet_url, features, is_featured, display_order) VALUES ('GUST-NEW-14', 'Galletas Cocada Navidad Gustaff 125g', 'galletas', 'Empaque Individual', 'Exquisito producto Gustaff: Galletas Cocada Navidad Gustaff 125g. Ideal para toda la familia.', '/images/bodegon/galletas_cocada_navidad_gustaff_125g.png', '/docs/FT-GUST-NEW-14-Gustaff.pdf', ARRAY['Sabor delicioso', 'Calidad Gustaff'], false, 26) ON CONFLICT (code) DO NOTHING;
INSERT INTO public.products (code, name, category, package_size, description, image, spec_sheet_url, features, is_featured, display_order) VALUES ('GUST-NEW-15', 'Galletas Cocada Y Paty Variados 75g', 'galletas', 'Empaque Individual', 'Exquisito producto Gustaff: Galletas Cocada Y Paty Variados 75g. Ideal para toda la familia.', '/images/bodegon/galletas_cocada_y_paty_variados_75g.png', '/docs/FT-GUST-NEW-15-Gustaff.pdf', ARRAY['Sabor delicioso', 'Calidad Gustaff'], false, 27) ON CONFLICT (code) DO NOTHING;
INSERT INTO public.products (code, name, category, package_size, description, image, spec_sheet_url, features, is_featured, display_order) VALUES ('GUST-NEW-16', 'Galletas Cocada Y Paty Variedad Sabores Gustaff 75g', 'galletas', 'Empaque Individual', 'Exquisito producto Gustaff: Galletas Cocada Y Paty Variedad Sabores Gustaff 75g. Ideal para toda la familia.', '/images/bodegon/galletas_cocada_y_paty_variedad_sabores_gustaff_75g.png', '/docs/FT-GUST-NEW-16-Gustaff.pdf', ARRAY['Sabor delicioso', 'Calidad Gustaff'], false, 28) ON CONFLICT (code) DO NOTHING;
INSERT INTO public.products (code, name, category, package_size, description, image, spec_sheet_url, features, is_featured, display_order) VALUES ('GUST-NEW-17', 'Galletas Paty Mantequilla Chocolate Naranja Gustaff 75g', 'galletas', 'Empaque Individual', 'Exquisito producto Gustaff: Galletas Paty Mantequilla Chocolate Naranja Gustaff 75g. Ideal para toda la familia.', '/images/bodegon/galletas_paty_mantequilla_chocolate_naranja_gustaff_75g.png', '/docs/FT-GUST-NEW-17-Gustaff.pdf', ARRAY['Sabor delicioso', 'Calidad Gustaff'], false, 29) ON CONFLICT (code) DO NOTHING;
INSERT INTO public.products (code, name, category, package_size, description, image, spec_sheet_url, features, is_featured, display_order) VALUES ('GUST-NEW-18', 'Galletas Paty Navidad Gustaff 125g', 'galletas', 'Empaque Individual', 'Exquisito producto Gustaff: Galletas Paty Navidad Gustaff 125g. Ideal para toda la familia.', '/images/bodegon/galletas_paty_navidad_gustaff_125g.png', '/docs/FT-GUST-NEW-18-Gustaff.pdf', ARRAY['Sabor delicioso', 'Calidad Gustaff'], false, 30) ON CONFLICT (code) DO NOTHING;
INSERT INTO public.products (code, name, category, package_size, description, image, spec_sheet_url, features, is_featured, display_order) VALUES ('GUST-NEW-19', 'Pastry Chocolate 50 Cacao Semiamargo 100g', 'cocoa', 'Empaque Individual', 'Exquisito producto Gustaff: Pastry Chocolate 50 Cacao Semiamargo 100g. Ideal para toda la familia.', '/images/bodegon/pastry_chocolate_50_cacao_semiamargo_100g.png', '/docs/FT-GUST-NEW-19-Gustaff.pdf', ARRAY['Sabor delicioso', 'Calidad Gustaff'], false, 31) ON CONFLICT (code) DO NOTHING;
INSERT INTO public.products (code, name, category, package_size, description, image, spec_sheet_url, features, is_featured, display_order) VALUES ('GUST-NEW-20', 'Polvo De Cacao Alcalino 500g', 'cocoa', 'Empaque Individual', 'Exquisito producto Gustaff: Polvo De Cacao Alcalino 500g. Ideal para toda la familia.', '/images/bodegon/polvo_de_cacao_alcalino_500g.png', '/docs/FT-GUST-NEW-20-Gustaff.pdf', ARRAY['Sabor delicioso', 'Calidad Gustaff'], false, 32) ON CONFLICT (code) DO NOTHING;
INSERT INTO public.products (code, name, category, package_size, description, image, spec_sheet_url, features, is_featured, display_order) VALUES ('GUST-NEW-21', 'Rapi Choc Choco Banano Sabores Rumbo Al Mundial', 'consumer', 'Empaque Individual', 'Exquisito producto Gustaff: Rapi Choc Choco Banano Sabores Rumbo Al Mundial. Ideal para toda la familia.', '/images/bodegon/rapi_choc_choco_banano_sabores_rumbo_al_mundial.png', '/docs/FT-GUST-NEW-21-Gustaff.pdf', ARRAY['Sabor delicioso', 'Calidad Gustaff'], false, 33) ON CONFLICT (code) DO NOTHING;
INSERT INTO public.products (code, name, category, package_size, description, image, spec_sheet_url, features, is_featured, display_order) VALUES ('GUST-NEW-22', 'Rapi Choc Mini Gotas Chocolate 200g', 'consumer', 'Empaque Individual', 'Exquisito producto Gustaff: Rapi Choc Mini Gotas Chocolate 200g. Ideal para toda la familia.', '/images/bodegon/rapi_choc_mini_gotas_chocolate_200g.png', '/docs/FT-GUST-NEW-22-Gustaff.pdf', ARRAY['Sabor delicioso', 'Calidad Gustaff'], false, 34) ON CONFLICT (code) DO NOTHING;
INSERT INTO public.products (code, name, category, package_size, description, image, spec_sheet_url, features, is_featured, display_order) VALUES ('GUST-NEW-23', 'Rapichoc Chocobanano Variedad Sabores', 'consumer', 'Empaque Individual', 'Exquisito producto Gustaff: Rapichoc Chocobanano Variedad Sabores. Ideal para toda la familia.', '/images/bodegon/rapichoc_chocobanano_variedad_sabores.jpg', '/docs/FT-GUST-NEW-23-Gustaff.pdf', ARRAY['Sabor delicioso', 'Calidad Gustaff'], false, 35) ON CONFLICT (code) DO NOTHING;
INSERT INTO public.products (code, name, category, package_size, description, image, spec_sheet_url, features, is_featured, display_order) VALUES ('GUST-NEW-24', 'Zebritas Doble Chocolate Galletas 200g', 'galletas', 'Empaque Individual', 'Exquisito producto Gustaff: Zebritas Doble Chocolate Galletas 200g. Ideal para toda la familia.', '/images/bodegon/zebritas_doble_chocolate_galletas_200g.png', '/docs/FT-GUST-NEW-24-Gustaff.pdf', ARRAY['Sabor delicioso', 'Calidad Gustaff'], false, 36) ON CONFLICT (code) DO NOTHING;
