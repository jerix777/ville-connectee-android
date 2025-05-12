
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Immobilier } from "@/services/immobilierService";
import { CardHeader } from "./components/CardHeader";
import { PropertyDetails } from "./components/PropertyDetails";
import { LocationInfo } from "./components/LocationInfo";
import { PropertyDescription } from "./components/PropertyDescription";
import { CardFooter } from "./components/CardFooter";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ImmobilierCardProps {
  bien: Immobilier;
}

export function ImmobilierCard({ bien }: ImmobilierCardProps) {
  const handleContact = () => {
    // Copier le numéro dans le presse-papier
    navigator.clipboard.writeText(bien.contact);
    
    // Afficher une notification
    toast({
      title: "Numéro copié !",
      description: `Le numéro de ${bien.vendeur} a été copié dans le presse-papier.`,
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader 
        titre={bien.titre} 
        isForSale={bien.is_for_sale} 
      />
      <CardContent className="flex-grow">
        <PropertyDetails 
          type={bien.type}
          surface={bien.surface}
          pieces={bien.pieces}
          chambres={bien.chambres}
        />
        <LocationInfo adresse={bien.adresse} />
        <PropertyDescription description={bien.description} />
      </CardContent>
      <CardFooter 
        prix={bien.prix}
        isForSale={bien.is_for_sale}
        vendeur={bien.vendeur}
        contact={bien.contact}
      />
      <div className="p-4 pt-0">
        <Button variant="ville" className="w-full" onClick={handleContact}>
          <Phone className="h-4 w-4 mr-1" />
          Contacter le vendeur
        </Button>
      </div>
    </Card>
  );
}
