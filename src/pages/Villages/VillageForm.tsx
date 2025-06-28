
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import type { Village } from "@/services/villageService";

interface VillageFormProps {
  village?: Village;
  onSubmit: (village: Omit<Village, "id" | "created_at">) => Promise<void>;
  onCancel: () => void;
}

export default function VillageForm({ village, onSubmit, onCancel }: VillageFormProps) {
  const [nom, setNom] = useState(village?.nom || "");
  const [description, setDescription] = useState(village?.description || "");
  const [population, setPopulation] = useState<string>(village?.population?.toString() || "");
  const [codePostal, setCodePostal] = useState(village?.code_postal || "");
  const [imageUrl, setImageUrl] = useState(village?.image_url || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nom) {
      toast({
        title: "Erreur",
        description: "Le nom du village est requis",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        nom,
        description,
        population: population ? parseInt(population, 10) : null,
        code_postal: codePostal || null,
        image_url: imageUrl || null
      });
      
      toast({
        title: "Succès",
        description: village ? "Village mis à jour" : "Village ajouté"
      });
      
      setIsOpen(false);
      onCancel();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le village",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="lg">
          <Plus className="mr-2 h-5 w-5" />
          {village ? "Modifier le village" : "Ajouter un village"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{village ? "Modifier le village" : "Ajouter un village"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nom" className="block text-sm font-medium mb-1">
              Nom du village *
            </label>
            <Input
              id="nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Nom du village"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <Textarea
              id="description"
              value={description || ""}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description du village"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="population" className="block text-sm font-medium mb-1">
                Population
              </label>
              <Input
                id="population"
                type="number"
                value={population}
                onChange={(e) => setPopulation(e.target.value)}
                placeholder="Nombre d'habitants"
              />
            </div>
            
            <div>
              <label htmlFor="codePostal" className="block text-sm font-medium mb-1">
                Code postal
              </label>
              <Input
                id="codePostal"
                value={codePostal || ""}
                onChange={(e) => setCodePostal(e.target.value)}
                placeholder="Code postal"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
              URL de l'image
            </label>
            <Input
              id="imageUrl"
              value={imageUrl || ""}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="URL de l'image du village"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "En cours..." : village ? "Mettre à jour" : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
