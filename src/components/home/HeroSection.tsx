import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Home, DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

// Import local assets
import hero1 from "@/assets/hero-2.jpg";
import hero2 from "@/assets/coworking.webp";
import hero3 from "@/assets/reception4.webp";
import hero4 from "@/assets/residence_lounge7.webp";

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
    hero1, // Modern Villa
    hero2, // Luxury Interior
    hero3, // Poolside
    hero4, // Modern Mansion
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
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
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
              {/* Clean minimal overlay */}
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-20 pt-20">
        <div className="max-w-5xl mx-auto">

          {/* Content Wrapper */}
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight animate-fade-up">
              Building Dreams, <br className="hidden md:block" />
              <span className="text-white">One Home at a Time</span>
            </h1>

            <p className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto font-light leading-relaxed animate-fade-up delay-100">
              Connect with premium properties across Nairobi's most sought-after locations.
            </p>
          </div>

          {/* Search Card - Minimal & Clean */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl animate-fade-up delay-200">
            {/* Tabs */}
            <div className="flex justify-center mb-6">
              <div className="bg-black/20 p-1 rounded-lg inline-flex">
                <button
                  onClick={() => setFilters({ ...filters, listingType: "buy" })}
                  className={`px-8 py-2 rounded-md text-sm font-medium transition-all ${filters.listingType === "buy"
                    ? "bg-white text-navy shadow-sm"
                    : "text-gray-300 hover:text-white"
                    }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setFilters({ ...filters, listingType: "rent" })}
                  className={`px-8 py-2 rounded-md text-sm font-medium transition-all ${filters.listingType === "rent"
                    ? "bg-white text-navy shadow-sm"
                    : "text-gray-300 hover:text-white"
                    }`}
                >
                  Rent
                </button>
              </div>
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Location */}
              <div className="md:col-span-3 relative group">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-white transition-colors" />
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full h-12 pl-10 pr-4 rounded-lg bg-black/20 border border-white/10 text-white text-sm focus:outline-none focus:bg-black/40 focus:border-white/30 transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-gray-900 text-gray-400">Location</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc} className="bg-gray-900 text-white">{loc}</option>
                  ))}
                </select>
              </div>

              {/* Property Type */}
              <div className="md:col-span-3 relative group">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-white transition-colors" />
                <select
                  value={filters.propertyType}
                  onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                  className="w-full h-12 pl-10 pr-4 rounded-lg bg-black/20 border border-white/10 text-white text-sm focus:outline-none focus:bg-black/40 focus:border-white/30 transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-gray-900 text-gray-400">Type</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type} className="bg-gray-900 text-white">{type}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="md:col-span-3 relative group">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-white transition-colors" />
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                  className="w-full h-12 pl-10 pr-4 rounded-lg bg-black/20 border border-white/10 text-white text-sm focus:outline-none focus:bg-black/40 focus:border-white/30 transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-gray-900 text-gray-400">Price</option>
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value} className="bg-gray-900 text-white">{range.label}</option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <div className="md:col-span-3">
                <Button
                  onClick={handleSearch}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg text-sm border-0"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
