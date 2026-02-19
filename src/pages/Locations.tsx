import { Link } from "react-router-dom";
import { MapPin, ArrowRight, Search, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useState } from "react";

const locations = [
    {
        id: 1,
        name: "Karen",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
        description: "Exclusive residential area with lush greenery and spacious estates, perfect for families seeking tranquility.",
        slug: "Karen",
    },
    {
        id: 2,
        name: "Westlands",
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
        description: "Nairobi's entertainment and commercial hub, offering luxury apartments close to the city's best nightlife and malls.",
        slug: "Westlands",
    },
    {
        id: 3,
        name: "Kilimani",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
        description: "A vibrant neighborhood with a dynamic mix of residential, commercial, and retail spaces.",
        slug: "Kilimani",
    },
    {
        id: 4,
        name: "Lavington",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
        description: "An upscale residential suburb known for its serene environment, top international schools, and shopping centers.",
        slug: "Lavington",
    },
    {
        id: 5,
        name: "Kileleshwa",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
        description: "A quiet, leafy suburb offering a perfect blend of modern apartments and peaceful living.",
        slug: "Kileleshwa",
    },
    {
        id: 6,
        name: "Runda",
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
        description: "A prestigious gated community popular with diplomats and expatriates, offering high security and large homes.",
        slug: "Runda",
    },
    {
        id: 7,
        name: "Muthaiga",
        image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
        description: "One of Nairobi's most affluent neighborhoods, home to country clubs, embassies, and historic mansions.",
        slug: "Muthaiga",
    },
    {
        id: 8,
        name: "Upper Hill",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
        description: "The financial district featuring high-rise modern living with spectacular views of the city skyline.",
        slug: "Upper Hill",
    },
];

const Locations = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredLocations = locations.filter((location) =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow pt-20">
                {/* Hero Section */}
                <section className="bg-navy text-white py-20 relative overflow-hidden">
                    <div className="absolute inset-0 z-0 opacity-20">
                        <img
                            src="https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2070&auto=format&fit=crop"
                            alt="Background"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
                            Explore Properties by Location
                        </h1>
                        <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-10">
                            Find your ideal home in your preferred neighborhood.
                        </p>

                        {/* Search/Filter */}
                        <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20 flex items-center">
                            <div className="pl-4 text-white/60">
                                <Search className="w-5 h-5" />
                            </div>
                            <Input
                                type="text"
                                placeholder="Search area (e.g., Westlands, Karen)..."
                                className="bg-transparent border-none text-white placeholder:text-white/60 focus-visible:ring-0 h-12 text-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                {/* Locations Grid */}
                <section className="py-20 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredLocations.map((location) => (
                                <div key={location.id} className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-border flex flex-col h-full group">
                                    {/* Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={location.image}
                                            alt={location.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <div className="bg-white/90 backdrop-blur-sm text-navy px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {location.name}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-2xl font-display font-bold text-navy mb-2 group-hover:text-primary transition-colors">
                                            {location.name}
                                        </h3>
                                        <p className="text-muted-foreground mb-6 flex-grow text-sm leading-relaxed">
                                            {location.description}
                                        </p>

                                        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all" asChild>
                                            <Link to={`/properties?location=${location.slug}`}>
                                                View Properties
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredLocations.length === 0 && (
                            <div className="text-center py-20">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                                    <Home className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">No locations found</h3>
                                <p className="text-muted-foreground">
                                    Try searching for a different area.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Locations;
