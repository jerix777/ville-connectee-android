import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";

interface FilterSectionProps {
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  radiusFilter: number;
  onRadiusFilterChange: (value: number) => void;
  urgencesOnly: boolean;
  onUrgencesOnlyChange: (value: boolean) => void;
  gardeOnly: boolean;
  onGardeOnlyChange: (value: boolean) => void;
}

const typeOptions = [
  { value: 'tous', label: 'Tous les établissements' },
  { value: 'hopital', label: 'Hôpitaux' },
  { value: 'pharmacie', label: 'Pharmacies' },
  { value: 'clinique', label: 'Cliniques' },
  { value: 'centre_sante', label: 'Centres de santé' }
];

export function FilterSection({
  typeFilter,
  onTypeFilterChange,
  radiusFilter,
  onRadiusFilterChange,
  urgencesOnly,
  onUrgencesOnlyChange,
  gardeOnly,
  onGardeOnlyChange
}: FilterSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter size={20} />
          Filtres de recherche
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Type d'établissement</Label>
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Rayon de recherche : {radiusFilter} km</Label>
          <Slider
            value={[radiusFilter]}
            onValueChange={(value) => onRadiusFilterChange(value[0])}
            max={50}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 km</span>
            <span>50 km</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="urgences-only"
              checked={urgencesOnly}
              onCheckedChange={onUrgencesOnlyChange}
            />
            <Label htmlFor="urgences-only">Urgences uniquement</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="garde-only"
              checked={gardeOnly}
              onCheckedChange={onGardeOnlyChange}
            />
            <Label htmlFor="garde-only">Garde 24h/24 uniquement</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}