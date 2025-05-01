
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Immobilier } from "@/services/immobilierService";
import { CardHeader } from "./components/CardHeader";
import { PropertyDetails } from "./components/PropertyDetails";
import { LocationInfo } from "./components/LocationInfo";
import { PropertyDescription } from "./components/PropertyDescription";
import { CardFooter } from "./components/CardFooter";

interface ImmobilierCardProps {
  bien: Immobilier;
}

export function ImmobilierCard({ bien }: ImmobilierCardProps) {
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
    </Card>
  );
}
