
import { Link } from "react-router-dom";
import { MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Property } from "@/lib/mockProperties";

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


        {/* Actions */}
        <div className="mt-auto">
          <Button variant="gold" className="w-full text-xs" asChild>
            <a href="https://wa.me/254725316343" target="_blank" rel="noopener noreferrer">
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
