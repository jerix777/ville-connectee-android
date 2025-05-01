
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Ruler, Bed } from "lucide-react";
import { Immobilier } from "@/services/immobilierService";
import { formatPrice } from "@/lib/formatters";

interface ImmobilierCardProps {
  bien: Immobilier;
}

export function ImmobilierCard({ bien }: ImmobilierCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{bien.titre}</CardTitle>
          <Badge variant={bien.is_for_sale ? "default" : "outline"}>
            {bien.is_for_sale ? "À vendre" : "À louer"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Building size={16} className="text-muted-foreground" />
            <span className="text-sm">{bien.type}</span>
          </div>
          <div className="flex items-center gap-1">
            <Ruler size={16} className="text-muted-foreground" />
            <span className="text-sm">{bien.surface} m²</span>
          </div>
          {bien.pieces && (
            <div className="flex items-center gap-1">
              <span className="text-sm">{bien.pieces} pièces</span>
            </div>
          )}
          {bien.chambres !== undefined && bien.chambres !== null && (
            <div className="flex items-center gap-1">
              <Bed size={16} className="text-muted-foreground" />
              <span className="text-sm">
                {bien.chambres} chambre{bien.chambres > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 mb-3 text-sm text-muted-foreground">
          <MapPin size={16} />
          <span>{bien.adresse}</span>
        </div>

        <p className="text-sm text-gray-700 line-clamp-2 mb-2">{bien.description}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start border-t pt-3">
        <div className="flex justify-between w-full">
          <div className="text-ville-DEFAULT font-bold text-xl">
            {formatPrice(bien.prix)}
            {!bien.is_for_sale && <span className="text-sm font-normal">/mois</span>}
          </div>
          <div className="text-sm text-muted-foreground">{bien.vendeur}</div>
        </div>
        <div className="text-sm mt-1">
          <span className="text-muted-foreground mr-1">Contact:</span>
          <span className="font-medium">{bien.contact}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
