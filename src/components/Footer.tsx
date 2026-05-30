import { Youtube, Instagram, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-accent text-accent-foreground">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Organization Info */}
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h3 className="text-lg sm:text-xl font-academic font-bold mb-2">IPLR</h3>
              <p className="text-xs sm:text-sm font-body opacity-80 leading-relaxed">
                Institute of Policy and Law Reforms - Advancing policy research, legal analysis, and institutional reform through innovative research and publications.
              </p>
            </div>
            <div className="flex space-x-3 sm:space-x-4">
              <Button variant="ghost" size="sm" className="p-1 sm:p-2 hover:bg-white/10 touch-target">
                <Youtube className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 sm:p-2 hover:bg-white/10 touch-target"
                onClick={() => window.open('https://www.instagram.com/iplr.pk?igsh=b2JjaG1wY3JmbHA0', '_blank')}
              >
                <Instagram className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1 sm:p-2 hover:bg-white/10 touch-target">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-academic font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
            <nav className="flex flex-col space-y-2 sm:space-y-3">
              {[
                "Latest Articles",
                "Research Publications",
                "Video Library",
                "About IPLR",
                "Contact Us"
              ].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-xs sm:text-sm font-body opacity-80 hover:opacity-100 transition-opacity duration-200 hover:underline touch-target"
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>

          {/* Research Areas */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-academic font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Research Areas</h4>
            <nav className="flex flex-col space-y-2 sm:space-y-3">
              {[
                "Environmental Law",
                "Policy Analysis", 
                "Constitutional Law",
                "Administrative Law",
                "Reform Studies"
              ].map((area) => (
                <a
                  key={area}
                  href="#"
                  className="text-xs sm:text-sm font-body opacity-80 hover:opacity-100 transition-opacity duration-200 hover:underline touch-target"
                >
                  {area}
                </a>
              ))}
            </nav>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h4 className="font-academic font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Stay Updated</h4>
              <p className="text-xs sm:text-sm font-body opacity-80 mb-3 sm:mb-4">
                Subscribe to our newsletter for the latest research and publications.
              </p>
              <div className="space-y-2 sm:space-y-3">
                <Input 
                  type="email" 
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60 text-xs sm:text-sm"
                />
                <Button 
                  className="w-full bg-white text-accent hover:bg-white/90 transition-colors duration-300 text-xs sm:text-sm touch-target"
                >
                  Subscribe
                </Button>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-start space-x-2 sm:space-x-3 text-xs sm:text-sm font-body opacity-80">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
                <span>15-XX Khayaban-e-Iqbal, DHA Lahore Cantt (Second Floor)</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm font-body opacity-80">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>info@iplr.pk</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6 sm:my-8 bg-white/20" />

        <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-4 md:space-y-0">
          <p className="text-xs sm:text-sm font-body opacity-60 text-center sm:text-left">
            © 2024 Institute of Policy and Law Reforms. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-6">
            {["Privacy Policy", "Terms of Service", "Academic Standards"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-xs sm:text-sm font-body opacity-60 hover:opacity-80 transition-opacity duration-200 touch-target"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
