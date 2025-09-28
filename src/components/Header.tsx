import { useState } from "react";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navItems = [
    { name: "HOME", href: "#home" },
    { name: "ARTICLES", href: "#articles" },
    { name: "RESEARCH", href: "#research" },
    { name: "WORKSHOPS & TRAININGS", href: "#workshops" },
    { 
      name: "DEPARTMENTS", 
      href: "#departments",
      submenu: [
        { name: "Research", href: "#research" },
        { name: "Litigation", href: "#litigation" },
        { name: "Content Creation", href: "#content-creation" }
      ]
    },
    { name: "ABOUT", href: "#about" },
    { name: "CONTACT", href: "#contact" }
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Top Bar with Logo and Search */}
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center justify-between relative">
          {/* Logo - Newspaper Style */}
          <div className="text-center flex-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-academic font-bold tracking-wide mb-1 sm:mb-2" style={{ color: 'hsl(var(--logo-teal))' }}>
              IPLR
            </h1>
            <p className="text-[10px] sm:text-xs font-body text-muted-foreground uppercase tracking-[0.15em] sm:tracking-[0.2em] border-t border-b border-border py-1 px-2 sm:px-0">
              INSTITUTE OF POLICY AND LAW REFORMS
            </p>
          </div>

          {/* Admin Login Link */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = '/admin/login'}
            className="p-1 sm:p-2 absolute right-12 sm:right-16 top-2 sm:top-6 text-[10px] sm:text-xs"
          >
            Admin
          </Button>

          {/* Search Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-1 sm:p-2 absolute right-2 sm:right-6 top-2 sm:top-6"
          >
            <Search className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="mt-4 sm:mt-6 animate-fade-in">
            <Input
              type="text"
              placeholder="Search articles, research, and videos..."
              className="w-full max-w-md mx-auto border-t-0 border-l-0 border-r-0 rounded-none focus:ring-0 bg-transparent text-sm sm:text-base"
            />
          </div>
        )}
      </div>

      {/* Navigation Tabs - Paper Magazine Style */}
      <div className="border-t-2 border-border bg-background shadow-sm">
        <div className="w-full px-4 sm:px-8">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center">
            <nav className="flex items-center justify-center flex-1 max-w-6xl mx-auto">
              {navItems.map((item) => (
                <div key={item.name} className="relative group">
                  <div
                    className="px-4 lg:px-6 py-4 lg:py-6 text-xs lg:text-sm font-body font-semibold text-foreground uppercase tracking-[0.1em] lg:tracking-[0.15em] hover:bg-muted/30 hover:text-foreground/80 transition-all duration-300 border-b-3 border-transparent hover:border-foreground cursor-pointer whitespace-nowrap flex items-center gap-1"
                    onMouseEnter={() => item.submenu && setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.name}
                    {item.submenu && <ChevronDown className="h-3 w-3" />}
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                  </div>
                  
                  {/* Dropdown Menu */}
                  {item.submenu && activeDropdown === item.name && (
                    <div 
                      className="absolute top-full left-0 bg-background border border-border shadow-lg z-50 min-w-[200px]"
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {item.submenu.map((subItem) => (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveDropdown(null);
                            const element = document.querySelector(subItem.href);
                            if (element) {
                              element.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                              });
                            }
                          }}
                          className="block px-4 py-3 text-sm font-body text-foreground hover:bg-muted/30 transition-colors duration-200"
                        >
                          {subItem.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center justify-between py-3 sm:py-4">
            <span className="text-[10px] sm:text-xs font-body uppercase tracking-[0.1em]">Menu</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 sm:p-2"
            >
              {isMenuOpen ? <X className="h-3 w-3 sm:h-4 sm:w-4" /> : <Menu className="h-3 w-3 sm:h-4 sm:w-4" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 border-t border-border pt-4 animate-fade-in">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <div key={item.name}>
                    {item.submenu ? (
                      <div>
                        <div className="text-[10px] sm:text-xs font-body font-medium text-foreground uppercase tracking-[0.05em] sm:tracking-[0.1em] py-2 sm:py-3 px-1 sm:px-2 hover:bg-muted/30 transition-colors duration-200 flex items-center justify-between">
                          <span>{item.name}</span>
                          <ChevronDown className="h-3 w-3" />
                        </div>
                        <div className="ml-4 space-y-1">
                          {item.submenu.map((subItem) => (
                            <a
                              key={subItem.name}
                              href={subItem.href}
                              className="block text-[10px] sm:text-xs font-body text-muted-foreground py-1 px-2 hover:bg-muted/30 transition-colors duration-200"
                              onClick={(e) => {
                                e.preventDefault();
                                setIsMenuOpen(false);
                                const element = document.querySelector(subItem.href);
                                if (element) {
                                  element.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start'
                                  });
                                }
                              }}
                            >
                              {subItem.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <a
                        href={item.href}
                        className="block text-[10px] sm:text-xs font-body font-medium text-foreground uppercase tracking-[0.05em] sm:tracking-[0.1em] py-2 sm:py-3 px-1 sm:px-2 hover:bg-muted/30 transition-colors duration-200"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsMenuOpen(false);
                          if (item.href === '#home') {
                            // Scroll to top for HOME
                            window.scrollTo({
                              top: 0,
                              behavior: 'smooth'
                            });
                          } else {
                            // Scroll to specific section
                            const element = document.querySelector(item.href);
                            if (element) {
                              element.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                              });
                            }
                          }
                        }}
                      >
                        {item.name}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;