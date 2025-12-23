import * as React from "react"; 
import { useState } from "react";
import { cn } from "@/lib/utils";
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

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        
        {/* Logo */}
        <Link to="/" className="z-50 flex items-center gap-2 font-bold text-xl text-slate-800">
          <h2>vocuz.</h2>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center space-x-6 md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              
              <NavigationMenuItem>
                <Link to="/works">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    How It Works
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/feature">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Feature
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/pricing">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Pricing
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

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
            className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
          >
            {/* : Tampilkan X jika menu buka, Menu jika tutup */}
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white border-b shadow-lg md:hidden flex flex-col p-4 space-y-4 animate-in slide-in-from-top-5">
            <Link 
              to="/works" 
              className="text-sm font-medium hover:text-blue-600 p-2 rounded-md hover:bg-slate-50"
              onClick={() => setIsMobileMenuOpen(false)}>
              How It Works
            </Link>
            <Link 
              to="/feature" 
              className="text-sm font-medium hover:text-blue-600 p-2 rounded-md hover:bg-slate-50"
              onClick={() => setIsMobileMenuOpen(false)}>
              Feature
            </Link>
            <Link 
              to="/pricing" 
              className="text-sm font-medium hover:text-blue-600 p-2 rounded-md hover:bg-slate-50"
              onClick={() => setIsMobileMenuOpen(false)}>
              Pricing
            </Link>
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

// Komponen ListItem (Tetap disimpan untuk keperluan dropdown masa depan)
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}>
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";