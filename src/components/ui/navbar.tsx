import * as React from "react"; 
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; 

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button"; 

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { label: "How It Works", targetId: "works" },
    { label: "Features", targetId: "features" },
    { label: "Pricing", targetId: "pricing" },
  ];

  // Logic Smooth Scroll
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault(); 
    
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="z-50 flex items-center gap-2 font-bold text-xl text-slate-800">
          <h2>vocuz.</h2>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center space-x-6 md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.label}>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    
                    <a 
                      href={`#${link.targetId}`}
                      onClick={(e) => handleScroll(e, link.targetId)}
                      className="cursor-pointer">
                      {link.label}
                    </a>

                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}

            </NavigationMenuList>
          </NavigationMenu>

          <Link to="/login">
            <Button>Login</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden z-50">
          <button 
            onClick={toggleMenu} 
            className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white border-b shadow-lg md:hidden flex flex-col p-4 space-y-4 animate-in slide-in-from-top-5">
            
            {/* Loop Menu Mobile */}
            {navLinks.map((link) => (
               <a 
                 key={link.label}
                 href={`#${link.targetId}`}
                 className="text-sm font-medium hover:text-blue-600 p-2 rounded-md hover:bg-slate-50 block"
                 onClick={(e) => handleScroll(e, link.targetId)}>
                 {link.label}
               </a>
            ))}

            <div className="pt-2 border-t">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full">Login</Button>
                </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}