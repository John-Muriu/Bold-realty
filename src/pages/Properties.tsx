import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Filter, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/home/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_PROPERTIES, Property } from "@/lib/mockProperties";

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    propertyType: searchParams.get("property_type") || "",
    listingType: searchParams.get("listing_type") || "",
    status: searchParams.get("status") || "",
  });

  const locations = [
    "Westlands, Nairobi",
    "Kilimani, Nairobi",
    "Karen, Nairobi",
    "Riverside, Nairobi",
    "Gikambura, Kikuyu",
    "Westlands",
  ];

  const propertyTypes = ["Apartment", "Maisonette", "Villa", "Studio", "Townhouse"];

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      let query = supabase.from("properties").select("*");

      if (filters.location) {
        query = query.ilike("location", `%${filters.location}%`);
      }
      if (filters.propertyType) {
        query = query.ilike("property_type", `%${filters.propertyType}%`);
      }
      if (filters.listingType) {
        query = query.eq("listing_type", filters.listingType as any);
      }
      if (filters.status) {
        query = query.eq("status", filters.status as any);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
      }

      const { data, error } = await query.order("featured", { ascending: false }).order("created_at", { ascending: false });

      if (!error && data) {
        const dbProperties = data as unknown as Property[];
        
        const filteredMocks = MOCK_PROPERTIES.filter((prop) => {
          if (filters.location && !prop.location.toLowerCase().includes(filters.location.toLowerCase())) {
            return false;
          }
          if (filters.propertyType && !prop.property_type.toLowerCase().includes(filters.propertyType.toLowerCase())) {
            return false;
          }
          if (filters.listingType && prop.listing_type !== filters.listingType) {
            return false;
          }
          if (filters.status && prop.status !== filters.status) {
            return false;
          }
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const titleMatch = prop.title.toLowerCase().includes(searchLower);
            const locMatch = prop.location.toLowerCase().includes(searchLower);
            if (!titleMatch && !locMatch) {
              return false;
            }
          }
          return true;
        });

        const combined = [...dbProperties, ...filteredMocks].sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          
          const timeA = new Date(a.created_at || 0).getTime();
          const timeB = new Date(b.created_at || 0).getTime();
          return timeB - timeA;
        });

        setProperties(combined);
      } else {
        const filteredMocks = MOCK_PROPERTIES.filter((prop) => {
          if (filters.location && !prop.location.toLowerCase().includes(filters.location.toLowerCase())) {
            return false;
          }
          if (filters.propertyType && !prop.property_type.toLowerCase().includes(filters.propertyType.toLowerCase())) {
            return false;
          }
          if (filters.listingType && prop.listing_type !== filters.listingType) {
            return false;
          }
          if (filters.status && prop.status !== filters.status) {
            return false;
          }
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const titleMatch = prop.title.toLowerCase().includes(searchLower);
            const locMatch = prop.location.toLowerCase().includes(searchLower);
            if (!titleMatch && !locMatch) {
              return false;
            }
          }
          return true;
        });
        setProperties(filteredMocks);
      }
      setLoading(false);
    };

    fetchProperties();
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      location: "",
      propertyType: "",
      listingType: "",
      status: "",
    });
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-40 pb-20">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="relative rounded-3xl overflow-hidden mb-12 h-[300px] flex items-center justify-center">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600"
                alt="Properties Hero"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                All Properties
              </h1>
              <p className="text-gray-200 text-lg max-w-2xl mx-auto mb-6">
                Browse our complete collection of premium properties across Nairobi
              </p>

              {/* Breadcrumbs */}
              <nav className="flex items-center justify-center gap-2 text-sm text-gray-300">
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
                <span>/</span>
                <span className="text-white font-medium">Properties</span>
              </nav>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-card rounded-2xl border border-border p-6 mb-8 shadow-soft">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search properties..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-12 h-12"
                />
              </div>

              {/* Desktop Filters */}
              <div className="hidden lg:flex items-center gap-4">
                <select
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                  className="h-12 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>

                <select
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange("propertyType", e.target.value)}
                  className="h-12 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">All Types</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                  <option value="Commercial">Commercial</option>
                  <option value="House">House</option>
                </select>

                <select
                  value={filters.listingType}
                  onChange={(e) => handleFilterChange("listingType", e.target.value)}
                  className="h-12 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Buy & Rent</option>
                  <option value="buy">Buy</option>
                  <option value="rent">Rent</option>
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="h-12 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">All Status</option>
                  <option value="ready">Ready (Complete)</option>
                  <option value="off-plan">Off-Plan</option>
                  <option value="ongoing">Ongoing</option>
                </select>

                {hasActiveFilters && (
                  <Button variant="ghost" onClick={clearFilters} className="text-destructive">
                    <X className="w-4 h-4" />
                    Clear
                  </Button>
                )}
              </div>

              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                <select
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                  className="h-12 px-4 rounded-lg border border-input bg-background text-foreground"
                >
                  <option value="">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>

                <select
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange("propertyType", e.target.value)}
                  className="h-12 px-4 rounded-lg border border-input bg-background text-foreground"
                >
                  <option value="">All Types</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>

                <select
                  value={filters.listingType}
                  onChange={(e) => handleFilterChange("listingType", e.target.value)}
                  className="h-12 px-4 rounded-lg border border-input bg-background text-foreground"
                >
                  <option value="">Buy & Rent</option>
                  <option value="buy">Buy</option>
                  <option value="rent">Rent</option>
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="h-12 px-4 rounded-lg border border-input bg-background text-foreground"
                >
                  <option value="">All Status</option>
                  <option value="ready">Ready</option>
                  <option value="off-plan">Off-Plan</option>
                </select>

                {hasActiveFilters && (
                  <Button variant="destructive" onClick={clearFilters} className="col-span-2">
                    Clear All Filters
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Results Count */}
          <p className="text-muted-foreground mb-6">
            Showing {properties.length} {properties.length === 1 ? "property" : "properties"}
          </p>

          {/* Properties Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property, index) => (
                <div
                  key={property.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
                No properties found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters to find more properties
              </p>
              <Button variant="gold" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Properties;
