import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Plus } from "lucide-react";
import { addVillage } from "@/services/villageService";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AddVillageForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [population, setPopulation] = useState<string>("");
  const [codePostal, setCodePostal] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nom) {
      toast("Le nom du village est requis", {
        description: "Veuillez remplir le nom du village.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await addVillage({
        nom,
        description,
        population: population ? parseInt(population, 10) : null,
        code_postal: codePostal || null,
        image_url: imageUrl || null
      });
      
      if (result) {
        queryClient.invalidateQueries({ queryKey: ["villages"] });
        toast("Village ajouté avec succès", {
          description: "Le nouveau village est maintenant visible par tous les utilisateurs.",
        });
        setIsOpen(false);
        // Reset form
        setNom("");
        setDescription("");
        setPopulation("");
        setCodePostal("");
        setImageUrl("");
      }
    } catch (error) {
      toast("Erreur lors de l'ajout du village");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un village
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un village</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom du village *</Label>
            <Input
              id="nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Entrez le nom du village"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description du village"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="population">Population</Label>
            <Input
              id="population"
              type="number"
              value={population}
              onChange={(e) => setPopulation(e.target.value)}
              placeholder="Nombre d'habitants"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="codePostal">Code postal</Label>
            <Input
              id="codePostal"
              value={codePostal}
              onChange={(e) => setCodePostal(e.target.value)}
              placeholder="Code postal"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image (URL)</Label>
            <Input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://exemple.com/image.jpg"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" variant="secondary" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}