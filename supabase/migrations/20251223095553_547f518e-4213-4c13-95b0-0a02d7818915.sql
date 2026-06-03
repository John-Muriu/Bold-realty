-- ==========================================
-- 0. STORAGE BUCKET CREATION
-- ==========================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 1. CLEANUP (In case of re-runs)
-- ==========================================
DROP TABLE IF EXISTS public.inquiries CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.blogs CASCADE;
DROP TABLE IF EXISTS public.property_categories CASCADE;
DROP TABLE IF EXISTS public.properties CASCADE;
DROP TYPE IF EXISTS public.property_status CASCADE;
DROP TYPE IF EXISTS public.listing_type CASCADE;

-- ==========================================
-- 2. CREATE CUSTOM ENUMS
-- ==========================================
CREATE TYPE public.property_status AS ENUM ('ready', 'off-plan', 'sold');
CREATE TYPE public.listing_type AS ENUM ('buy', 'rent');

-- ==========================================
-- 3. CREATE TABLES
-- ==========================================

-- A. Properties Table
CREATE TABLE public.properties (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    price_label TEXT,
    bedrooms INTEGER NOT NULL DEFAULT 0,
    bathrooms INTEGER NOT NULL DEFAULT 0,
    size_sqm DECIMAL(10,2),
    size_label TEXT,
    property_type TEXT NOT NULL DEFAULT 'Apartment',
    status property_status NOT NULL DEFAULT 'ready',
    listing_type listing_type NOT NULL DEFAULT 'buy',
    featured BOOLEAN NOT NULL DEFAULT false,
    image_url TEXT,
    units_available INTEGER DEFAULT 1,
    amenities TEXT[],
    neighbourhood TEXT DEFAULT '',
    units JSONB DEFAULT '[]'::jsonb,
    images TEXT[] DEFAULT ARRAY[]::text[],
    seo_title TEXT,
    seo_description TEXT,
    slug TEXT,
    seo_keywords TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT properties_slug_key UNIQUE (slug)
);

-- B. Testimonials Table
CREATE TABLE public.testimonials (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    content TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- C. Inquiries Table
CREATE TABLE public.inquiries (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- D. Blogs Table
CREATE TABLE public.blogs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Market Trends',
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT blogs_slug_key UNIQUE (slug)
);

-- E. Property Categories Table
CREATE TABLE public.property_categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category_type TEXT NOT NULL CHECK (category_type IN ('property_type', 'listing_type')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT property_categories_name_key UNIQUE (name)
);

-- ==========================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_categories ENABLE ROW LEVEL SECURITY;

-- A. Properties Policies
CREATE POLICY "Properties are viewable by everyone" 
ON public.properties FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert on properties" 
ON public.properties FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update on properties" 
ON public.properties FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated delete on properties" 
ON public.properties FOR DELETE TO authenticated USING (true);


-- B. Testimonials Policies
CREATE POLICY "Testimonials are viewable by everyone" 
ON public.testimonials FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert on testimonials" 
ON public.testimonials FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update on testimonials" 
ON public.testimonials FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated delete on testimonials" 
ON public.testimonials FOR DELETE TO authenticated USING (true);


-- C. Inquiries Policies
CREATE POLICY "Anyone can submit inquiries" 
ON public.inquiries FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated select on inquiries" 
ON public.inquiries FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated delete on inquiries" 
ON public.inquiries FOR DELETE TO authenticated USING (true);


-- D. Blogs Policies
CREATE POLICY "Blogs are viewable by everyone" 
ON public.blogs FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert on blogs" 
ON public.blogs FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update on blogs" 
ON public.blogs FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated delete on blogs" 
ON public.blogs FOR DELETE TO authenticated USING (true);


-- E. Property Categories Policies
CREATE POLICY "Property categories are viewable by everyone" 
ON public.property_categories FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert on property_categories" 
ON public.property_categories FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on property_categories" 
ON public.property_categories FOR DELETE TO authenticated USING (true);


-- ==========================================
-- 5. AUTOMATIC TIMESTAMP TRIGGERS
-- ==========================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================
-- 6. STORAGE ACCESS POLICIES ('images' bucket)
-- ==========================================

-- PREEMPTIVE CLEANUP: Drop existing storage policies of the same name to prevent clashes
DROP POLICY IF EXISTS "Give public access to images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow individual updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow individual deletions" ON storage.objects;

-- A. Allow public read access to images
CREATE POLICY "Give public access to images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

-- B. Allow uploads (INSERT) for authenticated users (Admin panel)
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'images' );

-- C. Allow updates (UPDATE) for authenticated users
CREATE POLICY "Allow individual updates"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'images' );

-- D. Allow deletions (DELETE) for authenticated users
CREATE POLICY "Allow individual deletions"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'images' );

-- ==========================================
-- 7. SEED DATA INJECTION
-- ==========================================

-- Seed Properties
INSERT INTO public.properties 
(title, description, location, price, price_label, bedrooms, bathrooms, size_sqm, size_label, property_type, status, listing_type, featured, image_url, units_available, amenities) 
VALUES
('Hephé Palace – Where Nature Meets Nobility', 'Hephé Palace stands in the heart of Westlands, offering a refined blend of urban elegance and the calm ambiance of nature. The development features premium finishes, panoramic skyline views, and world-class amenities including a rooftop infinity pool, sky lounge, gym, cinema, children''s play areas and a padel court.', 'Westlands, Nairobi', 6200000, 'KSh 6.2M - 19.8M', 0, 1, NULL, 'Studio to 3BR+DSQ', 'Apartment', 'off-plan', 'buy', true, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 5, ARRAY['Swimming Pool', 'Gym', 'Sky Lounge', 'Cinema', 'Padel Court']),
('4 Bedroom Maisonettes - Gikambura', 'These modern 4-bedroom maisonettes offer spacious contemporary living within a secure gated community just 24km from Nairobi CBD. The development features quality finishes, ample natural lighting, and a serene family-friendly environment.', 'Gikambura, Kikuyu', 14000000, 'KSh 14M', 4, 4, 200, '200 sqm', 'Maisonette', 'ready', 'buy', true, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 7, ARRAY['Gated Community', 'Garden', 'Parking', 'Security']),
('2 Bedroom All En-Suite Plus SQ', 'This modern Westlands development features spacious two-bedroom all en-suite units with a self-contained SQ. Designed for urban comfort, it includes premium amenities such as a swimming pool, gym, high-speed lifts, backup generator, and ample parking.', 'Westlands', 14800000, 'KSh 14.8M', 2, 2, 131, '131 sqm', 'Apartment', 'off-plan', 'buy', true, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', 6, ARRAY['Swimming Pool', 'Gym', 'Lift', 'Backup Generator', 'Parking']),
('Executive 3BR + DSQ Riverside', 'Luxurious executive apartment in the prestigious Riverside area. Features high-end finishes, spacious rooms, and stunning city views. Perfect for professionals and families seeking premium urban living.', 'Riverside, Nairobi', 40000000, 'KSh 40M', 3, 3, 250, '250 sqm', 'Apartment', 'ready', 'buy', true, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 1, ARRAY['Gym', 'Swimming Pool', 'Concierge', 'Parking', 'Garden']),
('Modern Studio Apartments Kilimani', 'Perfect starter homes in the vibrant Kilimani area. These studios offer modern finishes, excellent amenities, and unbeatable location for young professionals.', 'Kilimani, Nairobi', 5500000, 'KSh 5.5M', 0, 1, 45, '45 sqm', 'Studio', 'ready', 'buy', false, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 12, ARRAY['Gym', 'Rooftop Terrace', 'Coworking Space']),
('Bronze Villa Karen', 'Spectacular 5-bedroom villa set on half an acre in exclusive Karen. Features include a private pool, manicured gardens, staff quarters, and unparalleled privacy.', 'Karen, Nairobi', 85000000, 'KSh 85M', 5, 6, 600, '600 sqm', 'Villa', 'ready', 'buy', false, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 1, ARRAY['Private Pool', 'Garden', 'Staff Quarters', 'Security', 'Garage']);

-- Seed Testimonials
INSERT INTO public.testimonials (name, role, content, rating, avatar_url) VALUES
('Sarah Kamau', 'First-time Buyer', 'The team at Bold Realty made my first home purchase incredibly smooth. Their expertise and patience in explaining every step was invaluable. I found my dream apartment in Westlands!', 5, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'),
('James Mwangi', 'Property Investor', 'I''ve worked with many real estate agencies, but the professionalism and market knowledge here is unmatched. They helped me build a portfolio of 4 properties in just 2 years.', 5, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
('Grace Ochieng', 'Family Home Buyer', 'Finding a family home that met all our needs seemed impossible until we met this team. They understood exactly what we needed and found us the perfect maisonette in Kikuyu.', 5, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150');

-- Seed Property Categories
INSERT INTO public.property_categories (name, category_type) VALUES
('Apartment', 'property_type'),
('Maisonette', 'property_type'),
('Villa', 'property_type'),
('Studio', 'property_type'),
('Townhouse', 'property_type');