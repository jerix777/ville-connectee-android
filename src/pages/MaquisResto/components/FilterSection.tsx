import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface FilterSectionProps {
  typeFilter: string;
  onTypeChange: (value: string) => void;
  radiusFilter: number;
  onRadiusChange: (value: number) => void;
  hasLocation: boolean;
}

const restaurantTypes = [
  { value: 'tous', label: 'Tous les types' },
  { value: 'restaurant', label: 'Restaurants' },
  { value: 'maquis', label: 'Maquis' },
  { value: 'buvette', label: 'Buvettes' }
];

export function FilterSection({
  typeFilter,
  onTypeChange,
  radiusFilter,
  onRadiusChange,
  hasLocation
}: FilterSectionProps) {
  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <h3 className="font-medium text-sm">Filtres</h3>
      
      <div className="space-y-2">
        <Label className="text-sm">Type d'établissement</Label>
        <Select value={typeFilter} onValueChange={onTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {restaurantTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasLocation && (
        <div className="space-y-2">
          <Label className="text-sm">Rayon de recherche: {radiusFilter} km</Label>
          <Slider
            value={[radiusFilter]}
            onValueChange={([value]) => onRadiusChange(value)}
            max={50}
            min={1}
            step={1}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}