
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "glass-effect shadow-medium" 
          : "bg-white/90 backdrop-blur-sm"
      )}
    >
      <div className="flex items-center justify-between py-4 px-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="rounded-xl hover:bg-expo-gray-100 transition-colors"
          >
            <Menu size={20} className="text-expo-gray-700" />
          </Button>
          
          <div 
            className="cursor-pointer group"
            onClick={() => setShowCommuneSelector(true)}
          >
            {loading ? (
              <Skeleton className="h-8 w-32 rounded-lg" />
            ) : (
              <h1 className="text-2xl font-bold text-expo-DEFAULT group-hover:text-expo-accent transition-colors">
                {communeName}
              </h1>
            )}
            <div className="h-0.5 w-0 bg-expo-accent transition-all duration-300 group-hover:w-full"></div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-xl hover:bg-expo-gray-100 transition-colors relative"
          >
            <Bell size={18} className="text-expo-gray-700" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-expo-error rounded-full border-2 border-white"></div>
          </Button>
          
          <UserProfileMenu />
        </div>
      </div>
      
      <Dialog open={showCommuneSelector} onOpenChange={setShowCommuneSelector}>
        <DialogContent className="rounded-2xl border-0 shadow-strong">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-expo-DEFAULT">
              Sélectionner votre commune
            </DialogTitle>
          </DialogHeader>
          <CommuneSelector onClose={() => setShowCommuneSelector(false)} />
        </DialogContent>
      </Dialog>
    </header>
  );
}
