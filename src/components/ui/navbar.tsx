import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Link, useNavigate} from "react-router-dom"; 
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
     } from "@/components/ui/navigation-menu";
import { Button } from "./button";

export function Navbar(){
    const navigate = useNavigate();
    const [isMobileFeaturesOpen, setIsMobileFeaturesOpen] = useState(false);
    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm">
            <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                {/* Logo */}
                <Link to="/" className="z-50 flex items-center gap2 font-bold text-xl text-slate-800">
                    <h2>vocuz.</h2>
                </Link>
                {/* Desktop Menu */}
                <div className="hidden items-center space-x-6 md:flex">
                    <NavigationMenu>
                    <NavigationMenuList>

                            <NavigationMenuItem>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                <Link to="/works">How It Works</Link>
                            </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    <Link to="/feature">Feature</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    <Link to="/pricing">Pricing</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                    <Button>
                        <Link to="/login">Login</Link>
                    </Button>
                </div>
            </div>
        </nav>
    )
}