
import { Souvenir } from "@/services/souvenirService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MapPin, Calendar, User } from "lucide-react";

interface SouvenirCardProps {
  souvenir: Souvenir & {
    quartiers?: {
      id: string;
      nom: string;
    } | null;
  };
}

export const SouvenirCard = ({ souvenir }: SouvenirCardProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMMM yyyy", { locale: fr });
    } catch (error) {
      console.error("Erreur de formatage de la date:", error);
      return dateString;
    }
  };

  return (
    <Card className="h-full overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      {souvenir.photo_url && (
        <div className="w-full h-48 overflow-hidden">
          <AspectRatio ratio={16 / 9} className="bg-muted">
            <img
              src={souvenir.photo_url}
              alt={souvenir.titre}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </AspectRatio>
        </div>
      )}
      <CardHeader className="p-4">
        <CardTitle className="text-xl">{souvenir.titre}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-muted-foreground line-clamp-3 mb-4">
          {souvenir.description}
        </p>
        <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{formatDate(souvenir.date_souvenir)}</span>
          </div>
          <div className="flex items-center gap-2">
            <User size={16} />
            <span>{souvenir.auteur}</span>
          </div>
          {souvenir.quartiers && (
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>{souvenir.quartiers.nom}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
