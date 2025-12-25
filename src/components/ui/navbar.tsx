import * as React from "react"; 
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation(); 
  const navigate = useNavigate(); 

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  
  const navLinks = [
    { label: "How It Works", href: "works", type: "scroll" },
    { label: "Features", href: "features", type: "scroll" },
    { label: "Pricing", href: "/pricing", type: "route" }, 
  ];

  const handleNavigation = (e: React.MouseEvent, link: { href: string; type: string }) => {
    e.preventDefault();

    if (link.type === "route") {
      navigate(link.href);
      setIsMobileMenuOpen(false);
      window.scrollTo(0, 0); 
    } else {
      
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const element = document.getElementById(link.href);
          if (element) element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        const element = document.getElementById(link.href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          
        <Link to="/" className="z-50 flex items-center gap-2 font-bold text-xl text-slate-800">
          <h2>vocuz.</h2>
        </Link>

        <div className="hidden items-center space-x-6 md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.label}>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <a 
                      href={link.type === 'route' ? link.href : `#${link.href}`}
                      onClick={(e) => handleNavigation(e, link)}
                      className="cursor-pointer"
                    >
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
            {navLinks.map((link) => (
               <a 
                 key={link.label}
                 href={link.type === 'route' ? link.href : `#${link.href}`}
                 className="text-sm font-medium hover:text-blue-600 p-2 rounded-md hover:bg-slate-50 block"
                 onClick={(e) => handleNavigation(e, link)}>
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