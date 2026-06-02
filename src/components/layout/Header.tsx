import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  // Navigation State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    {
      name: "For Sale",
      path: "/properties?listingType=buy",
      subItems: [
        { name: "Apartments For Sale In Nairobi", path: "/properties?listingType=buy&propertyType=Apartment" },
        { name: "Houses For Sale In Nairobi", path: "/properties?listingType=buy&propertyType=House" },
        { name: "Villas For Sale In Nairobi", path: "/properties?listingType=buy&propertyType=Villa" },
        { name: "Commercial Property For Sale In Nairobi", path: "/properties?listingType=buy&propertyType=Commercial" },
      ]
    },
    {
      name: "For Rent",
      path: "/properties?listingType=rent",
      subItems: [
        { name: "Apartments For Rent In Nairobi", path: "/properties?listingType=rent&propertyType=Apartment" },
        { name: "Houses For Rent In Nairobi", path: "/properties?listingType=rent&propertyType=House" },
        { name: "Commercial Property For Rent Nairobi", path: "/properties?listingType=rent&propertyType=Commercial" },
      ]
    },
    {
      name: "Listings",
      path: "/properties",
      subItems: [
        { name: "Ongoing Projects", path: "/properties?status=ongoing" },
        { name: "Complete Projects", path: "/properties?status=ready" },
        { name: "Off-Plan Projects", path: "/properties?status=off-plan" },
      ]
    },
    { name: "Locations", path: "/locations" },
    { name: "Blog & Posts", path: "/insights" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar */}
      <div className="bg-secondary text-secondary-foreground py-2 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <a href="tel:+254725316343" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                <span>+254 725 316 343</span>
              </a>
              <a href="mailto:info@boldrealty.co.ke" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                <span>info@boldrealty.co.ke</span>
              </a>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Westlands, Nairobi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img src="/bold-realty-logo.png" alt="Bold Realty" className="h-12 w-auto object-contain transition-transform duration-300 hover:scale-105" />

            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                link.subItems ? (
                  <DropdownMenu key={link.name}>
                    <DropdownMenuTrigger className={`flex items-center gap-1 py-2 text-sm font-medium transition-colors outline-none ${isActive(link.path) ? "text-primary" : "text-foreground hover:text-primary"}`}>
                      {link.name}
                      <ChevronDown className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-background border-border">
                      <DropdownMenuItem asChild>
                        <Link to={link.path} className="w-full cursor-pointer">
                          All Properties
                        </Link>
                      </DropdownMenuItem>
                      {link.subItems.map((subItem) => (
                        <DropdownMenuItem key={subItem.path} asChild>
                          <Link to={subItem.path} className="w-full cursor-pointer">
                            {subItem.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative py-2 text-sm font-medium transition-colors ${isActive(link.path)
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                      }`}
                  >
                    {link.name}
                    {isActive(link.path) && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </Link>
                )
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              <Button variant="gold" size="lg">
                Get Property Advice
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border bg-white">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <div key={link.name}>
                    {link.subItems ? (
                      <>
                        <div className="px-4 py-2 text-sm font-medium text-foreground opacity-70">
                          {link.name}
                        </div>
                        <div className="pl-4 border-l border-border ml-4 flex flex-col gap-1">
                          <Link
                            to={link.path}
                            onClick={() => setIsMenuOpen(false)}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors block"
                          >
                            All Properties
                          </Link>
                          {link.subItems.map(subItem => (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              onClick={() => setIsMenuOpen(false)}
                              className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors block"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      <Link
                        to={link.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors block ${isActive(link.path)
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted"
                          }`}
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                ))}
                <Button variant="gold" className="mt-4 w-full">
                  Get Property Advice
                </Button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
