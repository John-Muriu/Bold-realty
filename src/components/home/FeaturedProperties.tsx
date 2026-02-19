import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import PropertyCard from "./PropertyCard";

interface Property {
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
  images: string[] | null;
}

interface FeaturedPropertiesProps {
  title?: string;
  description?: string;
  className?: string;
  filter?: {
    location?: string;
    featured?: boolean;
  };
  limit?: number;
}

const FeaturedProperties = ({
  title = "Discover Premium Properties",
  description = "Our handpicked selection of premium properties offering exceptional value and prime locations",
  className = "",
  filter = { featured: true },
  limit = 4
}: FeaturedPropertiesProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      let query = supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (filter.featured) {
        query = query.eq("featured", true);
      }

      if (filter.location) {
        query = query.ilike("location", `%${filter.location}%`);
      }

      const { data, error } = await query;

      if (!error && data) {
        setProperties(data as unknown as Property[]);
      }
      setLoading(false);
    };

    fetchProperties();
  }, [filter, limit]);

  if (loading) {
    return (
      <section className={`py-20 bg-background ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 w-48 bg-muted rounded-lg mx-auto mb-4 animate-pulse" />
            <div className="h-4 w-96 bg-muted rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-muted" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-10 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) return null;

  return (
    <section className={`py-20 bg-background ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Exclusive Listings
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property, index) => (
            <div
              key={property.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12 animate-fade-up delay-400">
          <Button variant="gold" size="lg" asChild>
            <Link to="/properties">
              View All Properties
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
