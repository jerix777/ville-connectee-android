
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Village } from "@/services/villageService";

interface VillageCardProps {
  village: Village;
  onEdit: (village: Village) => void;
  onDelete: (village: Village) => void;
}

export function VillageCard({ village, onEdit, onDelete }: VillageCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{village.nom}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(village)}>
              <Pencil className="h-4 w-4 mr-1" />
              Modifier
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(village)}>
              <Trash2 className="h-4 w-4 mr-1" />
              Supprimer
            </Button>
          </div>
        </div>
        {village.code_postal && (
          <CardDescription>Code postal: {village.code_postal}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {village.image_url && (
          <img src={village.image_url} alt={village.nom} className="w-full h-48 object-cover rounded mb-3" />
        )}
        
        {village.description && (
          <p className="text-gray-700 mb-3">{village.description}</p>
        )}
        
        {village.population && (
          <p className="text-sm text-gray-500">Population: {village.population.toLocaleString()} habitants</p>
        )}
      </CardContent>
    </Card>
  );
}
