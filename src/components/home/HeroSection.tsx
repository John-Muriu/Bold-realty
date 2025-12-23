import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Home, DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const HeroSection = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    location: "",
    propertyType: "",
    priceRange: "",
    listingType: "buy",
  });

  // Carousel setup
  const [emblaRef] = useEmblaCarousel({ loop: true, duration: 30 }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  const heroImages = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop", // Modern Villa
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2075&auto=format&fit=crop", // Luxury Interior
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2075&auto=format&fit=crop", // Poolside
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2075&auto=format&fit=crop", // Modern Mansion
  ];

  const locations = [
    "Westlands, Nairobi",
    "Kilimani, Nairobi",
    "Karen, Nairobi",
    "Riverside, Nairobi",
    "Kikuyu",
    "Lavington",
  ];

  const propertyTypes = ["Apartment", "Maisonette", "Villa", "Studio", "Townhouse"];

  const priceRanges = [
    { label: "Under KSh 10M", value: "0-10000000" },
    { label: "KSh 10M - 20M", value: "10000000-20000000" },
    { label: "KSh 20M - 50M", value: "20000000-50000000" },
    { label: "Above KSh 50M", value: "50000000-999999999" },
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.location) params.set("location", filters.location);
    if (filters.propertyType) params.set("property_type", filters.propertyType);
    if (filters.priceRange) params.set("price_range", filters.priceRange);
    if (filters.listingType) params.set("listingType", filters.listingType);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Carousel Background */}
      <div className="absolute inset-0 z-0 bg-navy" ref={emblaRef}>
        <div className="flex h-full">
          {heroImages.map((src, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 relative h-full">
              <img
                src={src}
                alt={`Hero Property ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/30" />
            </div>
          ))}
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float z-10" />
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-float z-10" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-sm text-gold font-medium">Premium Real Estate</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 animate-fade-up delay-100">
            Building Dreams,{" "}
            <span className="text-gradient-gold">One Home</span>{" "}
            at a Time
          </h1>

          <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-2xl mx-auto animate-fade-up delay-200 text-shadow-sm">
            Discover your dream home today. We connect you with premium properties across Nairobi's most sought-after locations.
          </p>

          {/* Search Card */}
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 animate-fade-up delay-300 shadow-2xl">
            {/* Listing Type Tabs */}
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setFilters({ ...filters, listingType: "buy" })}
                className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${filters.listingType === "buy"
                  ? "bg-gold text-white shadow-gold hover:bg-gold-light"
                  : "bg-black/40 text-gray-300 hover:bg-black/60 border border-white/5"
                  }`}
              >
                Buy
              </button>
              <button
                onClick={() => setFilters({ ...filters, listingType: "rent" })}
                className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${filters.listingType === "rent"
                  ? "bg-gold text-white shadow-gold hover:bg-gold-light"
                  : "bg-black/40 text-gray-300 hover:bg-black/60 border border-white/5"
                  }`}
              >
                Rent
              </button>
            </div>

            {/* Search Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location */}
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-black/50 border border-white/10 text-white appearance-none cursor-pointer focus:outline-none focus:border-gold/50 transition-colors hover:bg-black/60"
                >
                  <option value="" className="bg-gray-900 text-gray-300">Select Location</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc} className="bg-gray-900 text-white">{loc}</option>
                  ))}
                </select>
              </div>

              {/* Property Type */}
              <div className="relative">
                <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filters.propertyType}
                  onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-black/50 border border-white/10 text-white appearance-none cursor-pointer focus:outline-none focus:border-gold/50 transition-colors hover:bg-black/60"
                >
                  <option value="" className="bg-gray-900 text-gray-300">Property Type</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type} className="bg-gray-900 text-white">{type}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-black/50 border border-white/10 text-white appearance-none cursor-pointer focus:outline-none focus:border-gold/50 transition-colors hover:bg-black/60"
                >
                  <option value="" className="bg-gray-900 text-gray-300">Price Range</option>
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value} className="bg-gray-900 text-white">{range.label}</option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <Button onClick={handleSearch} variant="gold" size="xl" className="w-full">
                <Search className="w-5 h-5" />
                <span>Find Properties</span>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 animate-fade-up delay-400">
            <Button variant="glass" onClick={() => navigate("/properties")}>
              All Listings
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="glass" onClick={() => navigate("/contact")}>
              Contact Our Experts
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-300 animate-fade-up delay-500 z-20">
        <span className="text-sm">Scroll to explore</span>
        <div className="w-6 h-10 rounded-full border-2 border-gray-300 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-gold animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
