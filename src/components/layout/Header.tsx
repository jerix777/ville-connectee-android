
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback, memo } from "react";
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

function HeaderComponent({ toggleSidebar, isSidebarOpen }: HeaderProps) {
  const [communeName, setCommuneName] = useState<string>("Commune");
  const [loading, setLoading] = useState(true);
  const [showCommuneSelector, setShowCommuneSelector] = useState(false);
  const { communeId } = useAuth();

  // Mémoriser les callbacks pour éviter les re-renders
  const handleCommuneSelectorClose = useCallback(() => {
    setShowCommuneSelector(false);
  }, []);

  const handleCommuneNameClick = useCallback(() => {
    setShowCommuneSelector(true);
  }, []);

  // Effet pour charger le nom de la commune - optimisé
  useEffect(() => {
    if (!communeId) {
      setCommuneName("Commune");
      setLoading(false);
      return;
    }

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
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between py-3 px-4 bg-ville-DEFAULT shadow-md text-white opacity-100"
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
        
        <h1 
          className="text-xl font-bold cursor-pointer hover:underline"
          onClick={handleCommuneNameClick}
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
          className="text-current hover:bg-ville-hover"
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
          <CommuneSelector onClose={handleCommuneSelectorClose} />
        </DialogContent>
      </Dialog>
    </header>
  );
}

// Mémoriser le Header pour éviter les re-renders inutiles
export const Header = memo(HeaderComponent);
