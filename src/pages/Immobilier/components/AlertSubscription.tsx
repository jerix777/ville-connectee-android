
import React, { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";

export function AlertSubscription() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [isLocation, setIsLocation] = useState(false);
  const [isVente, setIsVente] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here we would typically save this to a database via an API call
    // For demonstration, we're just showing a toast notification
    toast({
      title: "Alerte configurée",
      description: `Vous recevrez des alertes pour les ${isVente ? 'ventes' : ''}${isVente && isLocation ? ' et ' : ''}${isLocation ? 'locations' : ''} à l'adresse ${email}`,
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" />
          Créer une alerte
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle>Configurer mes alertes immobilières</AlertDialogTitle>
            <AlertDialogDescription>
              Recevez des notifications par email dès qu'un bien correspondant à vos critères est publié.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="max-price">Prix maximum (CFA)</Label>
              <Input
                id="max-price"
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="Prix maximum"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="vente"
                  checked={isVente}
                  onCheckedChange={setIsVente}
                />
                <Label htmlFor="vente">Ventes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="location"
                  checked={isLocation}
                  onCheckedChange={setIsLocation}
                />
                <Label htmlFor="location">Locations</Label>
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction type="submit">Créer l'alerte</AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
