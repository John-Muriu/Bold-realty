-- Add missing columns to properties table
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS neighbourhood TEXT,
ADD COLUMN IF NOT EXISTS units JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT ARRAY[]::text[],
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS seo_keywords TEXT;

-- Add uniqueness constraint to slug
ALTER TABLE public.properties
ADD CONSTRAINT properties_slug_key UNIQUE (slug);
