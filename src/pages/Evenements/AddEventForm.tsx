
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addEvent, getEventTypes } from "@/services/eventService";
import { Plus, Calendar } from "lucide-react";

export function AddEventForm() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    titre: "",
    type_id: "",
    organisateur: "",
    lieu: "",
    date_debut: "",
    heure_debut: "",
    date_fin: "",
    heure_fin: "",
    contact1: "",
    contact2: ""
  });
  
  const { data: eventTypes = [] } = useQuery({
    queryKey: ['eventTypes'],
    queryFn: getEventTypes
  });
  
  const addEventMutation = useMutation({
    mutationFn: addEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Événement ajouté",
        description: "L'événement a été ajouté avec succès",
      });
      setIsOpen(false);
      setFormData({
        titre: "",
        type_id: "",
        organisateur: "",
        lieu: "",
        date_debut: "",
        heure_debut: "",
        date_fin: "",
        heure_fin: "",
        contact1: "",
        contact2: ""
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de l'événement",
        variant: "destructive"
      });
      console.error("Error adding event:", error);
    }
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, type_id: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEventMutation.mutate(formData);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel événement
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Nouvel événement
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type_id">Type d'événement</Label>
              <Select onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="titre">Titre</Label>
              <Input
                id="titre"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                placeholder="Titre de l'événement"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="organisateur">Organisateur</Label>
              <Input
                id="organisateur"
                name="organisateur"
                value={formData.organisateur}
                onChange={handleChange}
                placeholder="Nom de l'organisateur"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lieu">Lieu</Label>
              <Input
                id="lieu"
                name="lieu"
                value={formData.lieu}
                onChange={handleChange}
                placeholder="Lieu de l'événement"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date_debut">Date de début</Label>
              <Input
                id="date_debut"
                name="date_debut"
                type="date"
                value={formData.date_debut}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="heure_debut">Heure de début</Label>
              <Input
                id="heure_debut"
                name="heure_debut"
                type="time"
                value={formData.heure_debut}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date_fin">Date de fin</Label>
              <Input
                id="date_fin"
                name="date_fin"
                type="date"
                value={formData.date_fin}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="heure_fin">Heure de fin</Label>
              <Input
                id="heure_fin"
                name="heure_fin"
                type="time"
                value={formData.heure_fin}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact1">Contact principal</Label>
              <Input
                id="contact1"
                name="contact1"
                value={formData.contact1}
                onChange={handleChange}
                placeholder="Téléphone ou email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact2">Contact secondaire (optionnel)</Label>
              <Input
                id="contact2"
                name="contact2"
                value={formData.contact2}
                onChange={handleChange}
                placeholder="Téléphone ou email"
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
              disabled={addEventMutation.isPending}
            >
              {addEventMutation.isPending ? "Enregistrement..." : "Créer l'événement"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
