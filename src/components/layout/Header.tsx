
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
        scrolled ? "bg-ville-DEFAULT shadow-md" : "bg-transparent"
      )}
    >
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="text-ville-foreground mr-2"
        >
          <Menu size={24} />
        </Button>
        <h1 className="text-xl font-bold text-ville-foreground">
          Ville Connectée
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-ville-foreground">
          <Bell size={20} />
        </Button>
      </div>
    </header>
  );
}
