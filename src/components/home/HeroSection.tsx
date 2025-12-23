import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Home, DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    location: "",
    propertyType: "",
    priceRange: "",
    listingType: "buy",
  });

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
    if (filters.listingType) params.set("listing_type", filters.listingType);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex items-center hero-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Premium Real Estate</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 animate-fade-up delay-100">
            Building Dreams,{" "}
            <span className="text-gradient-gold">One Home</span>{" "}
            at a Time
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto animate-fade-up delay-200">
            Discover your dream home today. We connect you with premium properties across Nairobi's most sought-after locations.
          </p>

          {/* Search Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 animate-fade-up delay-300">
            {/* Listing Type Tabs */}
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setFilters({ ...filters, listingType: "buy" })}
                className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  filters.listingType === "buy"
                    ? "bg-primary text-primary-foreground shadow-gold"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setFilters({ ...filters, listingType: "rent" })}
                className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  filters.listingType === "rent"
                    ? "bg-primary text-primary-foreground shadow-gold"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
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
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-white/10 border border-white/10 text-white appearance-none cursor-pointer focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="" className="bg-secondary">Select Location</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc} className="bg-secondary">{loc}</option>
                  ))}
                </select>
              </div>

              {/* Property Type */}
              <div className="relative">
                <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filters.propertyType}
                  onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-white/10 border border-white/10 text-white appearance-none cursor-pointer focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="" className="bg-secondary">Property Type</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type} className="bg-secondary">{type}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-white/10 border border-white/10 text-white appearance-none cursor-pointer focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="" className="bg-secondary">Price Range</option>
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value} className="bg-secondary">{range.label}</option>
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
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 animate-fade-up delay-500">
        <span className="text-sm">Scroll to explore</span>
        <div className="w-6 h-10 rounded-full border-2 border-gray-400 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-primary animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
