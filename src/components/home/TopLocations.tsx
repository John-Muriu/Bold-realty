import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const locations = [
    {
        id: 1,
        name: "Karen",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
        count: 2,
        slug: "Karen",
    },
    {
        id: 2,
        name: "Westlands",
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
        count: 1,
        slug: "Westlands",
    },
    {
        id: 3,
        name: "Upper Hill",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
        count: 1,
        slug: "Upper Hill",
    },
    {
        id: 4,
        name: "Kilimani",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
        count: 1,
        slug: "Kilimani",
    },
];

const TopLocations = () => {
    return (
        <section className="py-24 bg-background">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <div className="w-20 h-1.5 bg-primary mb-6" />
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-navy mb-4">
                            Explore Top <span className="bg-primary/20 px-2 text-navy">Locations</span>
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            Browse properties in Kenya's most sought-after neighborhoods.
                        </p>
                    </div>
                    <Button variant="outline" className="hidden md:flex gap-2 border-navy text-navy hover:bg-navy hover:text-white transition-colors" asChild>
                        <Link to="/locations">
                            View All Locations <ArrowRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {locations.map((location) => (
                        <Link
                            key={location.id}
                            to={`/properties?location=${location.slug}`}
                            className="group relative h-[300px] overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                            <img
                                src={location.image}
                                alt={location.name}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            <div className="absolute top-4 left-4 z-20">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                    <MapPin className="w-5 h-5 text-white" />
                                </div>
                            </div>

                            <div className="absolute bottom-0 inset-x-0 p-6 z-20 text-white">
                                <h3 className="font-display text-2xl font-bold mb-1">{location.name}</h3>
                                <p className="text-white/80 font-medium">
                                    {location.count} {location.count === 1 ? 'Property' : 'Properties'}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 md:hidden">
                    <Button variant="outline" className="w-full gap-2 border-navy text-navy" asChild>
                        <Link to="/locations">
                            View All Locations <ArrowRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default TopLocations;
