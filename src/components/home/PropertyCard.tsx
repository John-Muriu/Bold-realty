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
    <div className="card-property group flex flex-col h-full">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] flex-shrink-0">
        <img
          src={property.image_url || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {property.featured && (
            <span className="badge-status bg-primary text-primary-foreground border-none uppercase text-[10px] tracking-wider">
              Featured
            </span>
          )}
          <span className="badge-status bg-secondary text-secondary-foreground border-none uppercase text-[10px] tracking-wider">
            {property.listing_type}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`badge-status ${property.status === "ready" ? "badge-ready" : "badge-off-plan"
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
      <div className="p-6 flex flex-col flex-grow">
        {/* Title */}
        <Link to={`/properties/${property.id}`} className="block group/title mb-2">
          <h3 className="font-display text-xl font-semibold text-card-foreground line-clamp-2 group-hover/title:text-primary transition-colors min-h-[3.5rem]">
            {property.title}
          </h3>
        </Link>

        {/* Location */}
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="text-sm line-clamp-1">{property.location}</span>
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
        <div className="flex items-center gap-2 mt-auto">
          <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" asChild>
            <a href="tel:+2540103002049" title="Call Us">
              <Phone className="w-4 h-4" />
            </a>
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors" asChild>
            <a href="https://wa.me/2540103002049" target="_blank" rel="noopener noreferrer" title="WhatsApp Us">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </a>
          </Button>
          <Button variant="gold" size="sm" className="flex-1" asChild>
            <Link to={`/properties/${property.id}`}>
              Details
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
