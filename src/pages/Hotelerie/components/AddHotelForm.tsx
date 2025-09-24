import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { hotelService } from "@/services/hotelService";
import { Hotel } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface HotelFormInput {
  nom: string;
  type: string;
  adresse: string;
  contact1: string;
  contact2?: string;
  email?: string;
  description?: string;
}

interface AddHotelFormProps {
  onClose?: () => void;
}

export function AddHotelForm({ onClose }: AddHotelFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<HotelFormInput>({
    nom: "",
    type: "",
    adresse: "",
    contact1: "",
    contact2: "",
    email: "",
    description: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const addHotelMutation = useMutation({
    mutationFn: hotelService.addHotel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      toast({
        title: "Hôtel ajouté",
        description: "L'hôtel a été ajouté avec succès.",
      });
      setFormData({
        nom: "",
        type: "",
        adresse: "",
        contact1: "",
        contact2: "",
        email: "",
        description: "",
      });
      if (onClose) {
        onClose();
      }
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de l'hôtel.",
        variant: "destructive",
      });
      console.error("Error adding hotel:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom || !formData.type || !formData.adresse || !formData.contact1) {
      toast({
        title: "Champs obligatoires",
        description: "Veuillez remplir tous les champs marqués d'un *.",
        variant: "destructive",
      });
      return;
    }
    addHotelMutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hotel className="h-5 w-5" />
          Ajouter un hôtel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nom">Nom de l'hôtel *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={handleInputChange}
                placeholder="Nom de l'hôtel"
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Type d'établissement *</Label>
              <Select
                value={formData.type}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auberge">Auberge</SelectItem>
                  <SelectItem value="residence-meublee">
                    Résidence meublée
                  </SelectItem>
                  <SelectItem value="chambre">Chambre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="adresse">Adresse *</Label>
            <Input
              id="adresse"
              value={formData.adresse}
              onChange={handleInputChange}
              placeholder="Adresse complète"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact1">Contact principal *</Label>
              <Input
                id="contact1"
                value={formData.contact1}
                onChange={handleInputChange}
                placeholder="Numéro de téléphone principal"
                required
              />
            </div>
            <div>
              <Label htmlFor="contact2">Contact 2</Label>
              <Input
                id="contact2"
                value={formData.contact2}
                onChange={handleInputChange}
                placeholder="Autre numéro de téléphone"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Adresse email"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description de l'établissement"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={addHotelMutation.isPending}
            >
              {addHotelMutation.isPending ? "Ajout en cours..." : "Ajouter l'hôtel"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
