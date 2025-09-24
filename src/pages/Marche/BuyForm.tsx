
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addMarketItem, MarketItem } from "@/services/marketService";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BuyFormProps {
  onClose: () => void;
}

export function BuyForm({ onClose }: BuyFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    vendeur: "",
    titre: "",
    description: "",
    prix: 0,
    contact1: "",
    contact2: "",
    is_for_sale: false
  });
  
  const addItemMutation = useMutation({
    mutationFn: (data: Omit<MarketItem, "id">) => {
      return addMarketItem(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketItems'] });
      toast({
        title: "Demande publiée",
        description: "Votre demande d'achat a été publiée avec succès",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la publication de la demande",
        variant: "destructive"
      });
      console.error("Error adding market item:", error);
    }
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'prix' ? parseFloat(value) : value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titre || !formData.vendeur || !formData.description || !formData.prix || !formData.contact1) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    addItemMutation.mutate(formData);
  };
  
  return (
    <ScrollArea className="max-h-[60vh]">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vendeur">Nom et prénom</Label>
            <Input
              id="vendeur"
              name="vendeur"
              value={formData.vendeur}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="titre">Objet recherché</Label>
            <Input
              id="titre"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Caractéristiques souhaitées</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="prix">Prix d'achat maximum (CFA)</Label>
            <Input
              id="prix"
              name="prix"
              type="number"
              value={formData.prix}
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
            <Label htmlFor="contact2">Contact secondaire (optionnel)</Label>
            <Input
              id="contact2"
              name="contact2"
              value={formData.contact2}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            variant="secondary"
            disabled={addItemMutation.isPending}
          >
            {addItemMutation.isPending ? "Publication en cours..." : "Publier la demande"}
          </Button>
        </DialogFooter>
      </form>
    </ScrollArea>
  );
}
