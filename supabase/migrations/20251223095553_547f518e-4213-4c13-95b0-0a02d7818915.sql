-- Create enum for property status
CREATE TYPE public.property_status AS ENUM ('ready', 'off-plan', 'sold');

-- Create enum for listing type
CREATE TYPE public.listing_type AS ENUM ('buy', 'rent');

-- Create properties table
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
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create testimonials table
CREATE TABLE public.testimonials (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    content TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inquiries table for contact form
CREATE TABLE public.inquiries (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Properties are publicly readable
CREATE POLICY "Properties are viewable by everyone" 
ON public.properties 
FOR SELECT 
USING (true);

-- Testimonials are publicly readable
CREATE POLICY "Testimonials are viewable by everyone" 
ON public.testimonials 
FOR SELECT 
USING (true);

-- Anyone can submit an inquiry
CREATE POLICY "Anyone can submit inquiries" 
ON public.inquiries 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample properties
INSERT INTO public.properties (title, description, location, price, price_label, bedrooms, bathrooms, size_sqm, size_label, property_type, status, listing_type, featured, image_url, units_available, amenities) VALUES
('Hephé Palace – Where Nature Meets Nobility', 'Hephé Palace stands in the heart of Westlands, offering a refined blend of urban elegance and the calm ambiance of nature. The development features premium finishes, panoramic skyline views, and world-class amenities including a rooftop infinity pool, sky lounge, gym, cinema, children''s play areas and a padel court.', 'Westlands, Nairobi', 6200000, 'KSh 6.2M - 19.8M', 0, 1, NULL, 'Studio to 3BR+DSQ', 'Apartment', 'off-plan', 'buy', true, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 5, ARRAY['Swimming Pool', 'Gym', 'Sky Lounge', 'Cinema', 'Padel Court']),
('4 Bedroom Maisonettes - Gikambura', 'These modern 4-bedroom maisonettes offer spacious contemporary living within a secure gated community just 24km from Nairobi CBD. The development features quality finishes, ample natural lighting, and a serene family-friendly environment.', 'Gikambura, Kikuyu', 14000000, 'KSh 14M', 4, 4, 200, '200 sqm', 'Maisonette', 'ready', 'buy', true, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 7, ARRAY['Gated Community', 'Garden', 'Parking', 'Security']),
('2 Bedroom All En-Suite Plus SQ', 'This modern Westlands development features spacious two-bedroom all en-suite units with a self-contained SQ. Designed for urban comfort, it includes premium amenities such as a swimming pool, gym, high-speed lifts, backup generator, and ample parking.', 'Westlands', 14800000, 'KSh 14.8M', 2, 2, 131, '131 sqm', 'Apartment', 'off-plan', 'buy', true, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', 6, ARRAY['Swimming Pool', 'Gym', 'Lift', 'Backup Generator', 'Parking']),
('Executive 3BR + DSQ Riverside', 'Luxurious executive apartment in the prestigious Riverside area. Features high-end finishes, spacious rooms, and stunning city views. Perfect for professionals and families seeking premium urban living.', 'Riverside, Nairobi', 40000000, 'KSh 40M', 3, 3, 250, '250 sqm', 'Apartment', 'ready', 'buy', true, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 1, ARRAY['Gym', 'Swimming Pool', 'Concierge', 'Parking', 'Garden']),
('Modern Studio Apartments Kilimani', 'Perfect starter homes in the vibrant Kilimani area. These studios offer modern finishes, excellent amenities, and unbeatable location for young professionals.', 'Kilimani, Nairobi', 5500000, 'KSh 5.5M', 0, 1, 45, '45 sqm', 'Studio', 'ready', 'buy', false, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 12, ARRAY['Gym', 'Rooftop Terrace', 'Coworking Space']),
('Luxury Villa Karen', 'Spectacular 5-bedroom villa set on half an acre in exclusive Karen. Features include a private pool, manicured gardens, staff quarters, and unparalleled privacy.', 'Karen, Nairobi', 85000000, 'KSh 85M', 5, 6, 600, '600 sqm', 'Villa', 'ready', 'buy', false, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 1, ARRAY['Private Pool', 'Garden', 'Staff Quarters', 'Security', 'Garage']);

-- Insert sample testimonials
INSERT INTO public.testimonials (name, role, content, rating, avatar_url) VALUES
('Sarah Kamau', 'First-time Buyer', 'The team at NdetoHomes made my first home purchase incredibly smooth. Their expertise and patience in explaining every step was invaluable. I found my dream apartment in Westlands!', 5, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'),
('James Mwangi', 'Property Investor', 'I''ve worked with many real estate agencies, but the professionalism and market knowledge here is unmatched. They helped me build a portfolio of 4 properties in just 2 years.', 5, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
('Grace Ochieng', 'Family Home Buyer', 'Finding a family home that met all our needs seemed impossible until we met this team. They understood exactly what we needed and found us the perfect maisonette in Kikuyu.', 5, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150');