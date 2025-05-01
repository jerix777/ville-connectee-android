
import React from "react";
import { MapPin } from "lucide-react";

interface LocationInfoProps {
  adresse: string;
}

export function LocationInfo({ adresse }: LocationInfoProps) {
  return (
    <div className="flex items-center gap-1 mb-3 text-sm text-muted-foreground">
      <MapPin size={16} />
      <span>{adresse}</span>
    </div>
  );
}
