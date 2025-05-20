
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { getCommune } from "@/services/communeService";
import { UserProfileMenu } from "@/components/UserProfileMenu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CommuneSelector } from "@/components/CommuneSelector";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export function Header({ toggleSidebar, isSidebarOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [communeName, setCommuneName] = useState<string>("Commune");
  const [loading, setLoading] = useState(true);
  const [showCommuneSelector, setShowCommuneSelector] = useState(false);
  const { communeId } = useAuth();

  // Effet pour détecter le défilement
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Effet pour charger le nom de la commune
  useEffect(() => {
    const loadCommune = async () => {
      setLoading(true);
      try {
        const commune = await getCommune(communeId);
        setCommuneName(commune?.nom || "Commune");
      } catch (error) {
        console.error("Erreur lors du chargement de la commune:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les informations de la commune",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadCommune();
  }, [communeId]);

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
        
        <h1 
          className={cn(
            "text-xl font-bold cursor-pointer",
            "hover:underline"
          )}
          onClick={() => setShowCommuneSelector(true)}
        >
          {loading ? (
            <Skeleton className="h-6 w-32" />
          ) : (
            communeName
          )}
        </h1>
      </div>
      
      <div className="flex items-center gap-3">
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
        
        <UserProfileMenu />
      </div>
      
      <Dialog open={showCommuneSelector} onOpenChange={setShowCommuneSelector}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sélectionner votre commune</DialogTitle>
          </DialogHeader>
          <CommuneSelector onClose={() => setShowCommuneSelector(false)} />
        </DialogContent>
      </Dialog>
    </header>
  );
}
