import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, Square, Phone, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `KSh ${(price / 1000000).toFixed(1)}M`;
    }
    return `KSh ${price.toLocaleString()}`;
  };

  return (
    <div className="card-property group">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={property.image_url || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {property.featured && (
            <span className="badge-status bg-primary text-primary-foreground border-none">
              Featured
            </span>
          )}
          <span className="badge-status bg-secondary text-secondary-foreground border-none capitalize">
            {property.listing_type}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`badge-status ${
            property.status === "ready" ? "badge-ready" : "badge-off-plan"
          }`}>
            {property.status === "off-plan" ? "Off-Plan" : "Ready"}
          </span>
        </div>

        {/* Units Available */}
        {property.units_available && property.units_available > 1 && (
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded-lg">
              {property.units_available} Units
            </span>
          </div>
        )}

        {/* Price Tag */}
        <div className="absolute bottom-4 right-4">
          <span className="px-4 py-2 bg-primary text-primary-foreground font-bold text-lg rounded-lg shadow-gold">
            {property.price_label || formatPrice(property.price)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="font-display text-xl font-semibold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm">{property.location}</span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 py-4 border-y border-border mb-4">
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-primary" />
            <span className="text-sm text-card-foreground font-medium">
              {property.bedrooms === 0 ? "Studio" : `${property.bedrooms} Beds`}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-primary" />
            <span className="text-sm text-card-foreground font-medium">
              {property.bathrooms} Baths
            </span>
          </div>
          {(property.size_sqm || property.size_label) && (
            <div className="flex items-center gap-1.5">
              <Square className="w-4 h-4 text-primary" />
              <span className="text-sm text-card-foreground font-medium">
                {property.size_label || `${property.size_sqm} sqm`}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <a href="tel:+254721353753">
              <Phone className="w-4 h-4" />
              Call
            </a>
          </Button>
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <a href="https://wa.me/254721353753" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </Button>
          <Button variant="gold" size="sm" className="flex-1" asChild>
            <Link to={`/properties/${property.id}`}>
              Details
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
