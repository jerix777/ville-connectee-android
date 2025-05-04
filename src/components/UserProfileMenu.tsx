
import { LogOut, User, Map, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CommuneSelector } from "./CommuneSelector";
import { useState } from "react";
import { signOut } from "@/services/authService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

export function UserProfileMenu() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [showCommuneSelector, setShowCommuneSelector] = useState(false);
  
  const handleSignOut = async () => {
    const success = await signOut();
    if (success) {
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
    } else {
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
    }
  };
  
  if (!user) {
    return (
      <Button variant="ghost" size="sm" asChild>
        <Link to="/auth">
          <User className="mr-2 h-4 w-4" />
          Se connecter
        </Link>
      </Button>
    );
  }
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <User className="mr-2 h-4 w-4" />
            {profile?.prenom || user.email?.split('@')[0] || 'Utilisateur'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowCommuneSelector(true)}>
            <Map className="mr-2 h-4 w-4" />
            Changer de commune
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Se déconnecter
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Dialog open={showCommuneSelector} onOpenChange={setShowCommuneSelector}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Changer de commune</DialogTitle>
          </DialogHeader>
          <CommuneSelector onClose={() => setShowCommuneSelector(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
