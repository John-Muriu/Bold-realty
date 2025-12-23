import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Bed, Bath, Square, Phone, MessageCircle, Check, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  amenities: string[] | null;
}

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!error && data) {
        setProperty(data as Property);
      }
      setLoading(false);
    };

    fetchProperty();
  }, [id]);

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `KSh ${(price / 1000000).toFixed(1)}M`;
    }
    return `KSh ${price.toLocaleString()}`;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 w-32 bg-muted rounded mb-8" />
              <div className="aspect-[16/9] bg-muted rounded-2xl mb-8" />
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <div className="h-10 bg-muted rounded" />
                  <div className="h-6 w-48 bg-muted rounded" />
                  <div className="h-32 bg-muted rounded" />
                </div>
                <div className="h-64 bg-muted rounded-2xl" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Property Not Found
            </h1>
            <p className="text-muted-foreground mb-8">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Button variant="gold" asChild>
              <Link to="/properties">
                <ArrowLeft className="w-4 h-4" />
                Back to Properties
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Properties
          </Link>

          {/* Main Image */}
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8">
            <img
              src={property.image_url || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200"}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            
            {/* Badges */}
            <div className="absolute top-6 left-6 flex flex-wrap gap-2">
              {property.featured && (
                <span className="badge-status bg-primary text-primary-foreground border-none">
                  Featured
                </span>
              )}
              <span className="badge-status bg-secondary text-secondary-foreground border-none capitalize">
                {property.listing_type}
              </span>
              <span className={`badge-status ${
                property.status === "ready" ? "badge-ready" : "badge-off-plan"
              }`}>
                {property.status === "off-plan" ? "Off-Plan" : "Ready"}
              </span>
            </div>

            {/* Share Button */}
            <Button
              variant="glass"
              size="icon"
              className="absolute top-6 right-6"
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Title & Location */}
              <div className="mb-8">
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {property.title}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{property.location}</span>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap items-center gap-6 p-6 bg-card rounded-xl border border-border mb-8">
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-primary" />
                  <span className="text-foreground font-medium">
                    {property.bedrooms === 0 ? "Studio" : `${property.bedrooms} Bedrooms`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-primary" />
                  <span className="text-foreground font-medium">
                    {property.bathrooms} Bathrooms
                  </span>
                </div>
                {(property.size_sqm || property.size_label) && (
                  <div className="flex items-center gap-2">
                    <Square className="w-5 h-5 text-primary" />
                    <span className="text-foreground font-medium">
                      {property.size_label || `${property.size_sqm} sqm`}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="text-foreground font-medium">{property.property_type}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  Description
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description || "No description available."}
                </p>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                    Amenities
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border"
                      >
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-foreground">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 bg-card rounded-2xl border border-border p-6 shadow-card">
                {/* Price */}
                <div className="mb-6">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <div className="font-display text-3xl font-bold text-primary">
                    {property.price_label || formatPrice(property.price)}
                  </div>
                  {property.listing_type === "rent" && (
                    <span className="text-sm text-muted-foreground">per month</span>
                  )}
                </div>

                {/* Units Available */}
                {property.units_available && property.units_available > 1 && (
                  <div className="mb-6 p-4 bg-primary/10 rounded-lg">
                    <span className="text-sm text-primary font-medium">
                      {property.units_available} Units Available
                    </span>
                  </div>
                )}

                {/* Contact Buttons */}
                <div className="space-y-3">
                  <Button variant="gold" size="lg" className="w-full" asChild>
                    <a href="tel:+254721353753">
                      <Phone className="w-5 h-5" />
                      Call Now
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" className="w-full" asChild>
                    <a href="https://wa.me/254721353753" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp
                    </a>
                  </Button>
                  <Button variant="secondary" size="lg" className="w-full" asChild>
                    <Link to="/contact">
                      Schedule Viewing
                    </Link>
                  </Button>
                </div>

                {/* Agent Info */}
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Listed by</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <span className="text-primary-foreground font-display font-bold">N</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">NdetoHomes</h4>
                      <p className="text-sm text-muted-foreground">Verified Agent</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetail;
