import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Filter, Fuel } from "lucide-react";

interface FilterSectionProps {
  typeFilter: string;
  onTypeChange: (type: string) => void;
  radiusFilter: number;
  onRadiusChange: (radius: number) => void;
  hasLocation: boolean;
}

export function FilterSection({
  typeFilter,
  onTypeChange,
  radiusFilter,
  onRadiusChange,
  hasLocation
}: FilterSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="h-5 w-5" />
          Filtres de recherche
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Type d'établissement
          </label>
          <Select value={typeFilter} onValueChange={onTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les types</SelectItem>
              <SelectItem value="auberge">Auberge</SelectItem>
              <SelectItem value="residence-meublee">Résidence meublée</SelectItem>
              <SelectItem value="chambre">Chambre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Rayon de recherche: {radiusFilter} km
            {!hasLocation && (
              <span className="text-xs text-muted-foreground ml-2">
                (nécessite la géolocalisation)
              </span>
            )}
          </label>
          <Slider
            value={[radiusFilter]}
            onValueChange={(value) => onRadiusChange(value[0])}
            max={50}
            min={1}
            step={1}
            disabled={!hasLocation}
            className={!hasLocation ? "opacity-50" : ""}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1 km</span>
            <span>50 km</span>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Fuel className="h-4 w-4" />
            <span>
              {hasLocation 
                ? "Recherche par proximité activée" 
                : "Activez la géolocalisation pour une recherche par proximité"
              }
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}