
import React from "react";
import { CardHeader as UICardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CardHeaderProps {
  titre: string;
  isForSale: boolean;
}

export function CardHeader({ titre, isForSale }: CardHeaderProps) {
  return (
    <UICardHeader>
      <div className="flex justify-between items-start">
        <CardTitle className="text-lg">{titre}</CardTitle>
        <Badge variant={isForSale ? "default" : "outline"}>
          {isForSale ? "À vendre" : "À louer"}
        </Badge>
      </div>
    </UICardHeader>
  );
}
