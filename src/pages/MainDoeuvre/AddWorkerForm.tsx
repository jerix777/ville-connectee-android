
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMetiers, addProfessional } from "@/services/professionalService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";

interface AddWorkerFormProps {
  onClose: () => void;
}

export function AddWorkerForm({ onClose }: AddWorkerFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    nom: "",
    surnom: "",
    metier_id: "",
    contact1: "",
    contact2: "",
    base: ""
  });

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
      onClose();
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
          <Label htmlFor="base">Base (quartier/zone)</Label>
          <Input
            id="base"
            name="base"
            value={formData.base}
            onChange={handleChange}
          />
        </div>
      </div>
      <DialogFooter>
        <Button 
          type="submit" 
          className="bg-ville-DEFAULT hover:bg-ville-dark"
          disabled={addWorkerMutation.isPending}
        >
          {addWorkerMutation.isPending ? "Inscription en cours..." : "Je m'inscris"}
        </Button>
      </DialogFooter>
    </form>
  );
}
