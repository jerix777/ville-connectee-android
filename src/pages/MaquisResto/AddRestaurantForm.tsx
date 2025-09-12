import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { restaurantService, type RestaurantBuvetteInput } from "@/services/restaurantService";
import { UtensilsCrossed, Upload } from "lucide-react";

export function AddRestaurantForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<RestaurantBuvetteInput>({
    nom: '',
    type: '',
    adresse: '',
    telephone: '',
    email: '',
    description: '',
    prix_moyen: '',
    horaires: '',
    specialites: '',
    services: '',
    image_url: '',
    latitude: null,
    longitude: null
  });

  const handleInputChange = (field: keyof RestaurantBuvetteInput, value: string | number | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom || !formData.type || !formData.adresse) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let finalFormData = { ...formData };

      // Upload image if selected
      if (selectedFile) {
        const imageUrl = await restaurantService.uploadRestaurantImage(selectedFile);
        finalFormData.image_url = imageUrl;
      }

      await restaurantService.addRestaurant(finalFormData);
      
      // Reset form
      setFormData({
        nom: '',
        type: '',
        adresse: '',
        telephone: '',
        email: '',
        description: '',
        prix_moyen: '',
        horaires: '',
        specialites: '',
        services: '',
        image_url: '',
        latitude: null,
        longitude: null
      });
      setSelectedFile(null);

      toast({
        title: "Succès",
        description: "L'établissement a été ajouté avec succès",
      });

      // Refresh the page to show the new restaurant
      window.location.reload();
    } catch (error) {
      console.error('Error adding restaurant:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout de l'établissement",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UtensilsCrossed className="h-5 w-5" />
          Ajouter un établissement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nom">Nom de l'établissement *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => handleInputChange('nom', e.target.value)}
                placeholder="Nom de l'établissement"
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Type d'établissement *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                  <SelectItem value="maquis">Maquis</SelectItem>
                  <SelectItem value="buvette">Buvette</SelectItem>
                  <SelectItem value="cafe">Café</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="adresse">Adresse *</Label>
            <Input
              id="adresse"
              value={formData.adresse}
              onChange={(e) => handleInputChange('adresse', e.target.value)}
              placeholder="Adresse complète"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                value={formData.telephone}
                onChange={(e) => handleInputChange('telephone', e.target.value)}
                placeholder="Numéro de téléphone"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Adresse email"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Description de l'établissement"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="prix_moyen">Prix moyen</Label>
              <Input
                id="prix_moyen"
                value={formData.prix_moyen}
                onChange={(e) => handleInputChange('prix_moyen', e.target.value)}
                placeholder="Ex: 2000-5000 FCFA"
              />
            </div>

            <div>
              <Label htmlFor="horaires">Horaires</Label>
              <Input
                id="horaires"
                value={formData.horaires}
                onChange={(e) => handleInputChange('horaires', e.target.value)}
                placeholder="Ex: 8h-22h"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="specialites">Spécialités</Label>
            <Input
              id="specialites"
              value={formData.specialites}
              onChange={(e) => handleInputChange('specialites', e.target.value)}
              placeholder="Ex: Attiéké, Poisson braisé (séparer par des virgules)"
            />
          </div>

          <div>
            <Label htmlFor="services">Services</Label>
            <Input
              id="services"
              value={formData.services}
              onChange={(e) => handleInputChange('services', e.target.value)}
              placeholder="Ex: Livraison, Terrasse (séparer par des virgules)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude || ''}
                onChange={(e) => handleInputChange('latitude', e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="Ex: 5.3364"
              />
            </div>

            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude || ''}
                onChange={(e) => handleInputChange('longitude', e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="Ex: -4.0267"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="image">Photo de l'établissement</Label>
            <div className="mt-2">
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image')?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {selectedFile ? selectedFile.name : 'Choisir une photo'}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Ajout en cours...' : 'Ajouter l\'établissement'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}