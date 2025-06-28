
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { X } from "lucide-react";
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
    <Card className="w-full mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{village ? "Modifier le village" : "Ajouter un village"}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
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
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "En cours..." : village ? "Mettre à jour" : "Ajouter"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
