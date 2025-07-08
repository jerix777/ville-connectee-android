
import React from "react";
import { CardFooter as UICardFooter } from "@/components/ui/card";
import { formatPrice } from "@/lib/formatters";

interface CardFooterProps {
  prix: number;
  isForSale: boolean;
  vendeur: string;
  contact: string;
}

export function CardFooter({ prix, isForSale, vendeur, contact }: CardFooterProps) {
  return (
    <UICardFooter className="flex flex-col items-start border-t pt-3">
      <div className="flex justify-between w-full">
        <div className="text-ville-DEFAULT font-bold text-lg">
          {formatPrice(prix)}
          {!isForSale && <span className="text-sm font-normal">/mois</span>}
        </div>
        <div className="text-sm text-muted-foreground">{vendeur}</div>
      </div>
      <div className="text-sm mt-1">
        <span className="text-muted-foreground mr-1">Contact:</span>
        <span className="font-medium">{contact}</span>
      </div>
    </UICardFooter>
  );
}
