
import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, Square, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  images?: string[] | null;
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const images = property.images && property.images.length > 0
    ? property.images
    : [property.image_url || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"];

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `KES ${(price / 1000000).toFixed(1)}M`;
    }
    return `KES ${price.toLocaleString()}`;
  };

  return (
    <div className="card-property group flex flex-col h-full bg-card hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden border border-border">
      {/* Image Carousel */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        <Carousel className="absolute inset-0 w-full h-full [&>div]:h-full" opts={{ loop: true }}>
          <CarouselContent className="h-full">
            {images.map((img, index) => (
              <CarouselItem key={index} className="h-full">
                <Link to={`/properties/${property.id}`} className="block h-full">
                  <img
                    src={img}
                    alt={`${property.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 1 && (
            <>
              <CarouselPrevious className="left-2 bg-white/80 hover:bg-white text-primary border-none opacity-0 group-hover:opacity-100 transition-opacity" />
              <CarouselNext className="right-2 bg-white/80 hover:bg-white text-primary border-none opacity-0 group-hover:opacity-100 transition-opacity" />
            </>
          )}
        </Carousel>

        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <span className="bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
            For {property.listing_type}
          </span>
          {property.featured && (
            <span className="bg-secondary/90 backdrop-blur-sm text-secondary-foreground text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
              Featured
            </span>
          )}
        </div>

        <div className="absolute top-4 right-4 z-10">
          <span className="bg-navy/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full lowercase">
            {property.property_type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Price & Title */}
        <div className="mb-3">
          <div className="flex justify-between items-start mb-1">
            <span className="text-primary font-bold text-xl">
              {property.price_label || formatPrice(property.price)}
              {property.listing_type === 'rent' && <span className="text-sm font-normal text-muted-foreground">/mo</span>}
            </span>
          </div>
          <Link to={`/properties/${property.id}`} className="block group-hover:text-primary transition-colors">
            <h3 className="font-display text-lg font-bold text-card-foreground line-clamp-1">
              {property.title}
            </h3>
          </Link>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm line-clamp-1 text-gray-500">{property.location}</span>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-2 py-4 border-t border-border mb-4">
          <div className="flex flex-col items-center justify-center p-2 bg-muted/50 rounded-lg">
            <Bed className="w-4 h-4 text-primary mb-1" />
            <span className="text-xs font-semibold text-foreground">
              {property.bedrooms === 0 ? "Studio" : property.bedrooms}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase">Beds</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 bg-muted/50 rounded-lg">
            <Bath className="w-4 h-4 text-primary mb-1" />
            <span className="text-xs font-semibold text-foreground">
              {property.bathrooms}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase">Baths</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 bg-muted/50 rounded-lg">
            <Square className="w-4 h-4 text-primary mb-1" />
            <span className="text-xs font-semibold text-foreground">
              {property.size_label || (property.size_sqm ? property.size_sqm : "-")}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase">Sqm</span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <Button variant="secondary" className="w-full text-xs" asChild>
            <a href="https://book.settime.io/ivory-crest" target="_blank" rel="noopener noreferrer">
              Schedule Viewing
            </a>
          </Button>
          <Button variant="outline" className="w-full text-xs border-primary text-primary hover:bg-primary hover:text-white" asChild>
            <a href="https://wa.me/2540103002049" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-3 h-3 mr-1.5" />
              Contact Agent
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
