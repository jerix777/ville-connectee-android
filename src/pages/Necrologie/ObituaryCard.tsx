
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Obituary } from "@/services/necrologieService";

interface ObituaryCardProps {
  obituary: Obituary;
  onEdit: (obituary: Obituary) => void;
  onDelete: (obituary: Obituary) => void;
}

export function ObituaryCard({ obituary, onEdit, onDelete }: ObituaryCardProps) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Non précisée";
    return format(new Date(dateStr), "d MMMM yyyy", { locale: fr });
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{obituary.prenom} {obituary.nom}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(obituary)}>
              <Pencil className="h-4 w-4 mr-1" />
              Modifier
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(obituary)}>
              <Trash2 className="h-4 w-4 mr-1" />
              Supprimer
            </Button>
          </div>
        </div>
        <CardDescription className="text-sm text-gray-500">
          {obituary.date_naissance ? `${formatDate(obituary.date_naissance)} - ${formatDate(obituary.date_deces)}` : `Décédé(e) le ${formatDate(obituary.date_deces)}`}
          {obituary.lieu_deces && ` à ${obituary.lieu_deces}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {obituary.photo_url && (
          <img src={obituary.photo_url} alt={`${obituary.prenom} ${obituary.nom}`} className="w-32 h-32 object-cover rounded-full mx-auto mb-4" />
        )}
        
        {obituary.message && (
          <p className="text-gray-700 italic">{obituary.message}</p>
        )}
      </CardContent>
    </Card>
  );
}
