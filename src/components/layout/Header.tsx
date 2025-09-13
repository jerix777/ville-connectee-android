
import { Menu } from "lucide-react";
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
import { NotificationBell } from "./NotificationBell";
import { BackButton } from "@/components/common/BackButton";
import { MiniPlayer } from "./MiniPlayer";
import { Capacitor } from '@capacitor/core';

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
        "fixed left-0 right-0 top-0 z-50 flex items-center justify-between py-3 px-4 bg-[#9b87f5] shadow-md text-white",
        Capacitor.isNativePlatform() && "top-12 sm:top-0"
      )}
    >
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="text-current mr-2 hover:bg-ville-hover"
        >
          <Menu size={24} />
        </Button>
        
        <BackButton className="mr-2" />
        
        <h1 
          className={cn(
            "text-lg font-bold cursor-pointer",
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
      
      <MiniPlayer />
      
      <div className="flex items-center gap-3">
        <NotificationBell />
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
