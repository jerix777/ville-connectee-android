
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export function Header({ toggleSidebar, isSidebarOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between py-3 px-4 transition-all duration-300",
        scrolled 
          ? "bg-ville-DEFAULT shadow-md text-white" 
          : "bg-ville-light text-ville-DEFAULT"
      )}
    >
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className={cn(
            "text-current mr-2",
            scrolled ? "hover:bg-ville-hover" : "hover:bg-ville-light"
          )}
        >
          <Menu size={24} />
        </Button>
        <h1 className="text-xl font-bold">
          Ville Connectée
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "text-current",
            scrolled ? "hover:bg-ville-hover" : "hover:bg-ville-light"
          )}
        >
          <Bell size={20} />
        </Button>
      </div>
    </header>
  );
}

