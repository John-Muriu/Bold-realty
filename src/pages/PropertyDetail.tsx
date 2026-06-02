import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Bed, Bath, Square, Phone, MessageCircle, Check, Share2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import SEO from "@/components/seo/SEO";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MOCK_PROPERTIES, Property } from "@/lib/mockProperties";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;

      if (id.startsWith("mock-")) {
        const mockProp = MOCK_PROPERTIES.find(p => p.id === id);
        if (mockProp) {
          setProperty(mockProp);
        } else {
          setProperty(null);
        }
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!error && data) {
        setProperty(data as unknown as Property);
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

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const propertySchema = property ? {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "url": window.location.href,
    "image": property.images || [property.image_url],
    "datePosted": new Date().toISOString().split('T')[0],
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "KES",
      "availability": property.units_available && property.units_available > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    "provider": {
      "@type": "RealEstateAgent",
      "name": "Bold Realty",
      "image": "https://boldrealty.co.ke/bold-realty-logo.png",
      "telephone": "+254725316343",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Argwings Kodhek Road",
        "addressLocality": "Kilimani, Nairobi",
        "addressRegion": "Nairobi",
        "postalCode": "00100",
        "addressCountry": "KE"
      }
    }
  } : undefined;

  const images = property?.images?.length ? property.images : (property?.image_url ? [property.image_url] : []);

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
      {property && (
        <SEO
          title={property.title}
          description={property.description || `Check out ${property.title} in ${property.location}`}
          image={property.image_url || undefined}
          type="product"
          schema={propertySchema}
        />
      )}
      <Header />

      {/* Lightbox Dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-[95vw] h-[90vh] bg-black/90 border-none p-0 flex items-center justify-center">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white bg-black/50 rounded-full transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>
          <Carousel
            className="w-full h-full flex items-center justify-center"
            opts={{ startIndex: currentImageIndex, loop: true }}
          >
            <CarouselContent>
              {images.map((img, idx) => (
                <CarouselItem key={idx} className="flex items-center justify-center h-full">
                  {img && (
                    <img
                      src={img}
                      alt={`View ${idx + 1}`}
                      className="max-w-full max-h-full object-contain"
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-white/10 hover:bg-white/20 text-white border-none" />
            <CarouselNext className="right-4 bg-white/10 hover:bg-white/20 text-white border-none" />
          </Carousel>
        </DialogContent>
      </Dialog>

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 flex flex-col gap-8">
          {/* Back Button */}
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Properties
          </Link>

          {/* Hero Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-border">
            <div className="space-y-3">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {property.featured && (
                  <span className="badge-status bg-primary text-primary-foreground border-none">
                    Featured
                  </span>
                )}
                <span className="badge-status bg-secondary text-secondary-foreground border-none capitalize">
                  {property.listing_type}
                </span>
                <span className={`badge-status ${property.status === "ready" ? "badge-ready" : "badge-off-plan"}`}>
                  {property.status === "off-plan" ? "Off-Plan" : "Ready"}
                </span>
              </div>
              
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight max-w-4xl">
                {property.title}
              </h1>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-base md:text-lg">{property.location}</span>
              </div>
            </div>
            
            <div className="flex flex-col md:items-end flex-shrink-0 bg-muted/40 p-4 rounded-xl border border-border min-w-[200px]">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price Starting From</span>
              <div className="font-display text-3xl md:text-4xl font-extrabold text-primary mt-1">
                {property.price_label || formatPrice(property.price)}
              </div>
              {property.listing_type === "rent" && (
                <span className="text-xs text-muted-foreground mt-1">per month</span>
              )}
            </div>
          </div>

          {/* Gallery Section */}
          <div className="w-full relative block h-auto min-h-[350px] lg:min-h-[460px] rounded-2xl overflow-hidden">
            {/* Mobile View: Single swipeable/tappable hero image */}
            <div className="lg:hidden relative h-[350px] md:h-[450px] rounded-2xl overflow-hidden group cursor-pointer animate-fade-in" onClick={() => openLightbox(0)}>
              <img
                src={images[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200"}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onContextMenu={(e) => e.preventDefault()}
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
                <span className={`badge-status ${property.status === "ready" ? "badge-ready" : "badge-off-plan"}`}>
                  {property.status === "off-plan" ? "Off-Plan" : "Ready"}
                </span>
              </div>

              {/* Share Button */}
              <Button
                variant="glass"
                size="icon"
                className="absolute top-4 right-4 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
              >
                <Share2 className="w-5 h-5" />
              </Button>

              {/* Photos Counter Badge */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-full text-xs font-semibold text-white tracking-wide">
                  1 / {images.length} Photos
                </div>
              )}
            </div>

            {/* Desktop View: Premium 4-Image Grid Collage */}
            {images.length > 0 && (
              <div className="hidden lg:grid grid-cols-4 gap-4 h-[460px] animate-fade-in">
                {/* Column 1: Main Large Image (Spans 2 columns) */}
                <div 
                  className="col-span-2 h-full rounded-2xl overflow-hidden relative group cursor-pointer shadow-soft"
                  onClick={() => openLightbox(0)}
                >
                  <img
                    src={images[0]}
                    alt={`${property.title} - Main View`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onContextMenu={(e) => e.preventDefault()}
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
                    <span className={`badge-status ${property.status === "ready" ? "badge-ready" : "badge-off-plan"}`}>
                      {property.status === "off-plan" ? "Off-Plan" : "Ready"}
                    </span>
                  </div>

                  {/* Share Button */}
                  <Button
                    variant="glass"
                    size="icon"
                    className="absolute top-6 right-6 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare();
                    }}
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>

                {/* Column 2: Stacked Middle Images (Image 2 and 3) */}
                <div className="col-span-1 h-full grid grid-rows-2 gap-4">
                  {/* Middle Top Image */}
                  {images[1] ? (
                    <div 
                      className="h-full rounded-2xl overflow-hidden cursor-pointer group relative shadow-soft"
                      onClick={() => openLightbox(1)}
                    >
                      <img
                        src={images[1]}
                        alt={`${property.title} - Interior View`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    </div>
                  ) : (
                    <div className="h-full bg-muted rounded-2xl flex items-center justify-center text-muted-foreground text-sm border border-border">
                      No Photo Available
                    </div>
                  )}

                  {/* Middle Bottom Image (with optional hidden overlay) */}
                  {images[2] ? (
                    <div 
                      className="h-full rounded-2xl overflow-hidden cursor-pointer group relative shadow-soft"
                      onClick={() => openLightbox(2)}
                    >
                      <img
                        src={images[2]}
                        alt={`${property.title} - Detail View`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onContextMenu={(e) => e.preventDefault()}
                      />
                      {/* "+ N Photos" Overlay if there are more than 4 images */}
                      {images.length > 4 && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center text-white transition-colors group-hover:bg-black/60">
                          <span className="text-xl font-bold tracking-wide">
                            + {images.length - 4} Photos
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full bg-muted rounded-2xl flex items-center justify-center text-muted-foreground text-sm border border-border">
                      No Photo Available
                    </div>
                  )}
                </div>

                {/* Column 3: Stacked Right Images (Image 4 and empty bottom slot) */}
                <div className="col-span-1 h-full grid grid-rows-2 gap-4">
                  {/* Right Top Image */}
                  {images[3] ? (
                    <div 
                      className="h-full rounded-2xl overflow-hidden cursor-pointer group relative shadow-soft"
                      onClick={() => openLightbox(3)}
                    >
                      <img
                        src={images[3]}
                        alt={`${property.title} - Kitchen View`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    </div>
                  ) : (
                    <div className="h-full bg-muted rounded-2xl flex items-center justify-center text-muted-foreground text-sm border border-border">
                      No Photo Available
                    </div>
                  )}

                  {/* Right Bottom Slot: Premium Brand Panel (just as in the mockup screenshot) */}
                  <div className="h-full bg-[#0b0f19] border border-white/10 rounded-2xl flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden shadow-soft">
                    {/* Decorative gold gradient accent line */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-accent" />
                    <img 
                      src="/bold-realty-logo-white.png" 
                      alt="Bold Realty Logo" 
                      className="h-8 object-contain mb-3 opacity-90"
                      onContextMenu={(e) => e.preventDefault()}
                    />
                    <p className="text-[11px] font-semibold text-primary uppercase tracking-widest mb-1">
                      Prestige & Exclusivity
                    </p>
                    <p className="text-[10px] text-white/50 italic font-light">
                      Bold Realty Kenya
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-full relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">

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
                <div className="prose prose-stone max-w-none text-muted-foreground leading-relaxed">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ node, ...props }) => <h3 className="text-xl font-bold text-foreground mt-6 mb-3" {...props} />,
                      h2: ({ node, ...props }) => <h4 className="text-lg font-bold text-foreground mt-5 mb-2" {...props} />,
                      h3: ({ node, ...props }) => <h5 className="text-base font-bold text-foreground mt-4 mb-2" {...props} />,
                      p: ({ node, ...props }) => <p className="mb-4 last:mb-0 whitespace-pre-line" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
                      li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-semibold text-foreground" {...props} />,
                    }}
                  >
                    {property.description || "No description available."}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Unit Types Table */}
              {property.units && property.units.length > 0 && (
                <div className="mb-10">
                  <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                    Available Units & Pricing
                  </h2>
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-left border-collapse text-[15px]">
                      <thead>
                        <tr className="bg-muted/50 border-b border-border">
                          <th className="p-4 font-semibold text-foreground border-r border-border last:border-r-0">Unit Type</th>
                          <th className="p-4 font-semibold text-foreground border-r border-border last:border-r-0">Size (sqm)</th>
                          <th className="p-4 font-semibold text-foreground border-r border-border last:border-r-0">Cash Price</th>
                          <th className="p-4 font-semibold text-foreground border-r border-border last:border-r-0">Expected Rent</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border bg-card">
                        {property.units.map((unit: any, idx: number) => (
                          <tr key={idx} className="hover:bg-muted/5 transition-colors">
                            <td className="p-4 text-foreground font-medium border-r border-border last:border-r-0">{unit.type || "-"}</td>
                            <td className="p-4 text-muted-foreground border-r border-border last:border-r-0">{unit.size || "-"}</td>
                            <td className="p-4 text-foreground font-semibold border-r border-border last:border-r-0">{unit.price || "-"}</td>
                            <td className="p-4 text-muted-foreground border-r border-border last:border-r-0">{unit.expected_rent || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                    Features & Amenities
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
                    {property.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 py-1"
                      >
                        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                        <span className="text-foreground text-[15px] font-medium leading-relaxed">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 relative">
              <div className="sticky top-32 h-fit bg-card rounded-2xl border border-border p-6 shadow-card">
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
                    <a href="tel:+254725316343">
                      <Phone className="w-5 h-5" />
                      Call Now
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" className="w-full" asChild>
                    <a href="https://wa.me/254725316343" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp
                    </a>
                  </Button>
                </div>

                {/* Agent Info */}
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Listed by</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-border overflow-hidden">
                      <img src="/bold-realty-logo.png" alt="Bold Realty" className="h-8 w-auto object-contain" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Bold Realty</h4>
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
