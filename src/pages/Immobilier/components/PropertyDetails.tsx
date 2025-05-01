
import React from "react";
import { Building, Ruler, Bed } from "lucide-react";

interface PropertyDetailsProps {
  type: string;
  surface: number;
  pieces?: number;
  chambres?: number;
}

export function PropertyDetails({ type, surface, pieces, chambres }: PropertyDetailsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 mb-3">
      <div className="flex items-center gap-1">
        <Building size={16} className="text-muted-foreground" />
        <span className="text-sm">{type}</span>
      </div>
      <div className="flex items-center gap-1">
        <Ruler size={16} className="text-muted-foreground" />
        <span className="text-sm">{surface} m²</span>
      </div>
      {pieces && (
        <div className="flex items-center gap-1">
          <span className="text-sm">{pieces} pièces</span>
        </div>
      )}
      {chambres !== undefined && chambres !== null && (
        <div className="flex items-center gap-1">
          <Bed size={16} className="text-muted-foreground" />
          <span className="text-sm">
            {chambres} chambre{chambres > 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}
