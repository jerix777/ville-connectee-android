
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Village } from "@/services/villageService";

interface VillageCardProps {
  village: Village;
}

export function VillageCard({ village }: VillageCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{village.nom}</CardTitle>
        {village.code_postal && (
          <CardDescription>Code postal: {village.code_postal}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        {village.image_url && (
          <img src={village.image_url} alt={village.nom} className="w-full h-48 object-cover rounded mb-3" />
        )}
        
        {village.description && (
          <p className="text-muted-foreground mb-3">{village.description}</p>
        )}
        
        {village.population && (
          <p className="text-sm text-muted-foreground">Population: {village.population.toLocaleString()} habitants</p>
        )}
      </CardContent>
    </Card>
  );
}
