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
('GUST-IND-01', 'Cocoa edulcorada', 'industrial', 'Sacos de 25 kg', 'Polvo de cacao de alta pureza edulcorado óptimo para repostería industrial, bebidas achocolatadas, galletería y mezclas secas.', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80', '/docs/FT-Cocoa-Edulcorada-Gustaff.pdf', ARRAY['Humedad máx 5%', 'Solubilidad superior', 'Granulometría homogénea'], true, 1),
('GUST-IND-02', 'Cocoa alcalina', 'industrial', 'Sacos de 25 kg', 'Cacao en polvo procesado con alcalinización superior para lograr un color oscuro profundo, menor acidez y excelente solubilidad en lácteos y helados.', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80', '/docs/FT-Cocoa-Alcalina-Gustaff.pdf', ARRAY['PH 7.2 - 7.6', 'Grasa 10-12%', 'Color castaño profundo'], true, 2),
('GUST-IND-03', 'Gotas y minigotas', 'industrial', 'Cajas de 5 kg', 'Gotas de cobertura de chocolate termoestables que mantienen su forma tras el horneado. Excelente para galletas chocochip y panetones.', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80', '/docs/FT-Gotas-Minigotas-Gustaff.pdf', ARRAY['Resistentes al horneado hasta 200°C', 'Brillo constante'], true, 3),
('GUST-IND-04', 'Botones', 'industrial', 'Cajas de 10 kg', 'Discos/Botones de cobertura industrial de fácil fundido. Diseñados para moldeado, bañado de galletas, alfajores y bombones.', 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=800&q=80', '/docs/FT-Botones-Chocolate-Gustaff.pdf', ARRAY['Fundido rápido a 40-45°C', 'Fluidez perfecta'], true, 4),
('GUST-IND-05', 'Azúcar impalpable', 'industrial', 'Sacos de 25 kg', 'Azúcar glass micro-pulverizada de fluidez excepcional con antiaglomerante alimentario, indispensable para cubiertas, glacés y turrones.', 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=800&q=80', '/docs/FT-Azucar-Impalpable-Gustaff.pdf', ARRAY['Granulometría ultrafina', 'Cero grumos'], false, 5),
('GUST-IND-06', 'Palillos chocolate', 'industrial', 'Cajas de 5 kg', 'Fideos / palillos fideos de cobertura de chocolate duro ideal para decoración de tortas, cupcakes, helados y dona toppings.', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80', '/docs/FT-Palillos-Chocolate-Gustaff.pdf', ARRAY['Resistencia mecánica', 'Brillo natural'], false, 6),
('GUST-IND-07', 'Palillos multicolor', 'industrial', 'Cajas de 5 kg', 'Grajeas / palillos multicolor horneables y de terminación para la industria de confitería, heladería y repostería festiva.', 'https://images.unsplash.com/photo-1514517220017-8ce97a34a7b6?auto=format&fit=crop&w=800&q=80', '/docs/FT-Palillos-Multicolor-Gustaff.pdf', ARRAY['Pigmentos grado alimenticio', 'No destiñen'], false, 7),
('GUST-IND-08', 'Mini milk', 'industrial', 'Cajas de 5 kg', 'Bocados y micro-gotas de chocolate con leche cremosa, enriquecidos con sólidos lácteos para un sabor suave y reconfortante.', 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80', '/docs/FT-Mini-Milk-Gustaff.pdf', ARRAY['Sabor lácteo cremoso', 'Melt-in-mouth rápido'], true, 8),
('GUST-IND-09', 'Kibledd', 'industrial', 'Sacos de 25 kg', 'Granulado crocante / trozos de cobertura tostada ideales para toppings en heladería, rellenos de bombones y cereales de chocolate.', 'https://images.unsplash.com/photo-1621236378699-8597faf6a176?auto=format&fit=crop&w=800&q=80', '/docs/FT-Kibledd-Gustaff.pdf', ARRAY['Textura extra crocante', 'Excelente vida útil'], false, 9),
('GUST-IND-10', 'Sirope de chocolate', 'industrial', 'Pomas de 6 kg', 'Salsa densa de chocolate rica en cacao puro, fluida a temperatura ambiente. Perfecta para veteado de helados, waffles y malteadas.', 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80', '/docs/FT-Sirope-Chocolate-Gustaff.pdf', ARRAY['Fluida a temp ambiente', 'Brillo óptico alto'], true, 10),
('GUST-IND-11', 'Galleta para helado tipo sanduche', 'industrial', 'Cajas de 10 kg', 'Placas de galleta de chocolate amargo horneadas con baja permeabilidad, diseñadas para ensamblaje mecánico de helados sándwich.', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80', '/docs/FT-Galleta-Helado-Sanduche-Gustaff.pdf', ARRAY['Crujiente a -18°C', 'Precisión milimétrica'], true, 11),
('GUST-IND-12', 'Galleta molida', 'industrial', 'Cajas de 14 kg', 'Miga y granulado de galleta de chocolate oscuro seleccionada, listo para usar en bases de cheesecakes, capas de postres y toppings.', 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80', '/docs/FT-Galleta-Molida-Gustaff.pdf', ARRAY['Granulometría uniforme', 'Sin polvo fino'], false, 12)
ON CONFLICT (code) DO NOTHING;
