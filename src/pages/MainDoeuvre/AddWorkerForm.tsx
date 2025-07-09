
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMetiers, addProfessional } from "@/services/professionalService";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export function AddWorkerForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    surnom: "",
    metier_id: "",
    contact1: "",
    contact2: "",
    base: ""
  });

  // Pré-remplir le formulaire avec les données de l'utilisateur connecté
  useEffect(() => {
    if (user && profile) {
      const fullName = profile.nom && profile.prenom 
        ? `${profile.nom} ${profile.prenom}`
        : profile.nom || profile.prenom || "";
      
      setFormData(prev => ({
        ...prev,
        nom: fullName,
        contact1: profile.contact_telephone || "",
        base: profile.lieu_residence || ""
      }));
    }
  }, [user, profile]);

  const { data: metiers = [] } = useQuery({
    queryKey: ['metiers'],
    queryFn: getMetiers
  });

  const addWorkerMutation = useMutation({
    mutationFn: addProfessional,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professionals'] });
      toast({
        title: "Professionnel ajouté",
        description: "Le professionnel a été ajouté avec succès",
      });
      setFormData({
        nom: "",
        surnom: "",
        metier_id: "",
        contact1: "",
        contact2: "",
        base: ""
      });
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du professionnel",
        variant: "destructive"
      });
      console.error("Error adding professional:", error);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, metier_id: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWorkerMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          S'inscrire comme professionnel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>S'inscrire comme professionnel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="metier_id">Domaine d'activité</Label>
              <Select onValueChange={handleSelectChange} value={formData.metier_id}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un domaine" />
                </SelectTrigger>
                <SelectContent>
                  {metiers.map(metier => (
                    <SelectItem key={metier.id} value={metier.id}>{metier.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nom">Nom et prénoms</Label>
              <Input
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder={user ? "Déjà rempli à partir de votre profil" : "Votre nom complet"}
                disabled={!!user && !!profile?.nom}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="surnom">Surnom (optionnel)</Label>
              <Input
                id="surnom"
                name="surnom"
                value={formData.surnom}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact1">Contact 1</Label>
              <Input
                id="contact1"
                name="contact1"
                value={formData.contact1}
                onChange={handleChange}
                placeholder={user ? "Déjà rempli à partir de votre profil" : "Votre numéro de téléphone"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact2">Contact 2 (optionnel)</Label>
              <Input
                id="contact2"
                name="contact2"
                value={formData.contact2}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="base">Zone de couverture</Label>
              <Input
                id="base"
                name="base"
                value={formData.base}
                onChange={handleChange}
                placeholder={user ? "Lieu de résidence ou zone de travail" : "Votre zone de couverture"}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              variant="secondary"
              disabled={addWorkerMutation.isPending}
            >
              {addWorkerMutation.isPending ? "Inscription en cours..." : "Je m'inscris"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
