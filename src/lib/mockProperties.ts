export interface Property {
  id: string;
  title: string;
  description: string | null;
  location: string;
  price: number;
  price_label: string | null;
  bedrooms: number;
  bathrooms: number;
  size_sqm: number | null;
  size_label: string | null;
  property_type: string;
  status: "ready" | "off-plan" | "sold";
  listing_type: "buy" | "rent";
  featured: boolean;
  image_url: string | null;
  units_available: number | null;
  created_at?: string;
  images: string[] | null;
  amenities: string[] | null;
  neighbourhood?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  slug?: string | null;
  seo_keywords?: string | null;
  units?: {
    type: string;
    size?: string;
    price?: string;
    expected_rent?: string;
  }[] | null;
}

export const MOCK_PROPERTIES: Property[] = [];
