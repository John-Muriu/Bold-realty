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
      name: "Properties",
      path: "/properties",
      subItems: [
        { name: "For Rent", path: "/properties?listingType=rent" },
        { name: "For Sale", path: "/properties?listingType=buy" },
      ]
    },
    { name: "About", path: "/about" },
    { name: "Insights", path: "/insights" },
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
              <a href="tel:+2540103002049" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                <span>+254 721 353753</span>
              </a>
              <a href="mailto:info@ivorycrest.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                <span>info@ivorycrest.com</span>
              </a>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Kilimani, Nairobi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img src="/ivory-crest-logo.png" alt="Ivory Crest" className="h-12 w-auto object-contain transition-transform duration-300 hover:scale-105" />
              <div className="hidden sm:block">
                <h1 className="font-display text-xl font-bold text-foreground">IVORY <span className="text-primary">CREST</span></h1>
                <p className="text-xs text-muted-foreground">Prestige. Exclusivity. Excellence</p>
              </div>
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
                List Your Property
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
          <div className="lg:hidden border-t border-border bg-background">
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
                  List Your Property
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
