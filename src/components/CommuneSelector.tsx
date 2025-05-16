
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getVillages, Village } from "@/services/villageService";
import { updateUserProfile, saveSessionCommune } from "@/services/authService";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Check, Loader2 } from "lucide-react";

interface CommuneSelectorProps {
  onClose?: () => void;
}

export function CommuneSelector({ onClose }: CommuneSelectorProps) {
  const { toast } = useToast();
  const { user, sessionId, communeId: currentCommuneId, refreshProfile } = useAuth();
  const [villages, setVillages] = useState<Village[]>([]);
  const [selectedCommune, setSelectedCommune] = useState<string | null>(currentCommuneId);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchVillages = async () => {
      setIsLoading(true);
      try {
        const villagesData = await getVillages();
        if (Array.isArray(villagesData) && villagesData.length > 0) {
          setVillages(villagesData);
          
          // Si aucune commune n'est sélectionnée, on prend la première par défaut
          if (!selectedCommune && !currentCommuneId) {
            setSelectedCommune(villagesData[0].id);
          }
        } else {
          toast({
            title: "Aucune commune disponible",
            description: "Veuillez contacter l'administrateur",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement des villages", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les communes",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVillages();
  }, [toast, currentCommuneId, selectedCommune]);

  const handleSubmit = async () => {
    if (!selectedCommune) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une commune",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (user) {
        // Utilisateur connecté - mettre à jour son profil
        const updated = await updateUserProfile(user.id, {
          commune_id: selectedCommune
        });

        if (updated) {
          if (refreshProfile) {
            await refreshProfile();
          }
          toast({
            title: "Succès",
            description: "Votre commune a été mise à jour",
          });
        } else {
          throw new Error("Erreur de mise à jour");
        }
      } else {
        // Utilisateur non connecté - sauvegarder la préférence de session
        if (!sessionId) {
          toast({
            title: "Erreur",
            description: "Identifiant de session non disponible",
            variant: "destructive"
          });
          return;
        }
        
        const success = await saveSessionCommune(sessionId, selectedCommune);
        
        if (success) {
          if (refreshProfile) {
            await refreshProfile();
          }
        } else {
          throw new Error("Erreur d'enregistrement");
        }
      }

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la commune", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre commune",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground mb-2">
        Veuillez sélectionner votre commune pour personnaliser votre expérience.
      </p>
      
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-ville-DEFAULT" />
          </div>
        ) : (
          <Select
            value={selectedCommune || ""}
            onValueChange={setSelectedCommune}
            disabled={isLoading || isSubmitting}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez une commune" />
            </SelectTrigger>
            <SelectContent>
              {villages.map((village) => (
                <SelectItem key={village.id} value={village.id}>
                  {village.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button 
          onClick={handleSubmit} 
          disabled={!selectedCommune || isSubmitting || isLoading} 
          className="w-full"
          variant="ville"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Chargement...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Confirmer
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
