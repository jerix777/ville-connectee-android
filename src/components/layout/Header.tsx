import { memo, useEffect, useState, useCallback } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export const Header = memo(function Header({ toggleSidebar }: HeaderProps) {
  const [communeName, setCommuneName] = useState<string>("Commune");
  const [loading, setLoading] = useState(true);
  const [showCommuneSelector, setShowCommuneSelector] = useState(false);
  const { communeId } = useAuth();

  const handleOpenSelector = useCallback(() => setShowCommuneSelector(true), []);
  const handleCloseSelector = useCallback(() => setShowCommuneSelector(false), []);

  useEffect(() => {
    let mounted = true;
    
    const loadCommune = async () => {
      setLoading(true);
      try {
        const commune = await getCommune(communeId);
        if (mounted) {
          setCommuneName(commune?.nom || "Commune");
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la commune:", error);
        if (mounted) {
          toast({
            title: "Erreur",
            description: "Impossible de charger les informations de la commune",
            variant: "destructive"
          });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    loadCommune();
    return () => { mounted = false; };
  }, [communeId]);

  return (
    <header 
      className={cn(
        "fixed left-0 right-0 top-0 z-50 flex items-center justify-between py-3 px-4 bg-primary shadow-md text-primary-foreground",
        Capacitor.isNativePlatform() && "top-12 sm:top-0"
      )}
    >
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="text-current mr-2 hover:bg-primary/80"
        >
          <Menu size={24} />
        </Button>
        
        <BackButton className="mr-2" />
        
        <h1 
          className="text-lg font-bold cursor-pointer hover:underline"
          onClick={handleOpenSelector}
        >
          {loading ? <Skeleton className="h-6 w-32 bg-primary-foreground/20" /> : communeName}
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
          <CommuneSelector onClose={handleCloseSelector} />
        </DialogContent>
      </Dialog>
    </header>
  );
});
