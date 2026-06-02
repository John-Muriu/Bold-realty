import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0b0f19] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <img src="/bold-realty-logo-white.png" alt="Bold Realty" className="h-16 w-auto object-contain transition-transform duration-300 hover:scale-105" />
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Bold Realty connects discerning buyers with Kenya's most prestigious properties. Experience the gold standard in real estate.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/properties" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  All Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?type=buy" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Buy Property
                </Link>
              </li>
              <li>
                <Link to="/properties?type=rent" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Rent Property
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6">Property Types</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/properties?property_type=apartment" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Apartments
                </Link>
              </li>
              <li>
                <Link to="/properties?property_type=maisonette" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Maisonettes
                </Link>
              </li>
              <li>
                <Link to="/properties?property_type=villa" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Villas
                </Link>
              </li>
              <li>
                <Link to="/properties?property_type=studio" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Studios
                </Link>
              </li>
              <li>
                <Link to="/properties?status=off-plan" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Off-Plan Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li>
                <a href="tel:+254725316343" className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors text-sm">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>+254 725 316 343</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@boldrealty.co.ke" className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors text-sm">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>info@boldrealty.co.ke</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-gray-300 text-sm">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Kilimani, Nairobi Kenya</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Bold Realty. All rights reserved.</p>
            <p>
              Designed by{" "}
              <a
                href="https://ndovubase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Ndovubase Solutions
              </a>
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
