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
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Decorative Gradient Blurs */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-primary/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="space-y-4">
            <div className="w-12 h-1 bg-primary rounded-full" />
            <h2 className="text-4xl md:text-5xl font-display font-bold text-navy leading-tight">
              Explore Top <span className="text-gradient-gold">Locations</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Browse premium properties in Kenya's most prestigious and sought-after neighborhoods.
            </p>
          </div>
          <Button
            variant="outline"
            className="hidden md:flex gap-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 hover:-translate-y-0.5"
            asChild
          >
            <Link to="/locations">
              View All Locations <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {locations.map((location) => (
            <Link
              key={location.id}
              to={`/properties?location=${location.slug}`}
              className="group relative h-[380px] overflow-hidden rounded-2xl cursor-pointer shadow-soft hover:shadow-gold transition-all duration-500 block"
            >
              {/* Dynamic Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10 transition-all duration-500 group-hover:via-black/45" />

              {/* Parallax Image */}
              <img
                src={location.image}
                alt={location.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* Floating Count Badge */}
              <div className="absolute top-4 right-4 z-20">
                <span className="bg-black/40 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold !text-white tracking-wide uppercase transition-all duration-300 group-hover:bg-primary group-hover:border-primary">
                  {location.count} {location.count === 1 ? "Property" : "Properties"}
                </span>
              </div>

              {/* Floating Pin Icon */}
              <div className="absolute top-4 left-4 z-20">
                <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-md group-hover:bg-primary/30 group-hover:border-primary/45 transition-colors duration-300">
                  <MapPin className="w-5 h-5 !text-white" />
                </div>
              </div>

              {/* Bottom Glassmorphism Info Panel */}
              <div className="absolute bottom-4 inset-x-4 p-5 rounded-xl backdrop-blur-md bg-black/70 border border-white/20 !text-white transition-all duration-500 group-hover:bg-black/85 group-hover:border-white/40 group-hover:-translate-y-1">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-display text-2xl font-bold mb-1 tracking-wide !text-white drop-shadow-sm transition-colors">
                      {location.name}
                    </h3>
                    <p className="!text-white/90 text-xs font-semibold uppercase tracking-wider drop-shadow-sm">
                      Explore Listings
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-primary !text-white flex items-center justify-center transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 shadow-md">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-12 md:hidden">
          <Button variant="outline" className="w-full gap-2 border-primary text-primary" asChild>
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
