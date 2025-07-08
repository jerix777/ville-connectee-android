
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tribune } from "@/services/tribuneService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MessageSquare, Share2 } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";

interface TribuneCardProps {
  tribune: Tribune;
}

export function TribuneCard({ tribune }: TribuneCardProps) {
  const formattedDate = tribune.created_at
    ? format(new Date(tribune.created_at), "dd MMMM yyyy à HH:mm", {
        locale: fr,
      })
    : "";

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      {tribune.image_url && (
        <div className="w-full">
          <AspectRatio ratio={16 / 9}>
            <img
              src={tribune.image_url}
              alt={tribune.titre}
              className="h-full w-full object-cover"
            />
          </AspectRatio>
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="space-y-1">
          <h3 className="text-lg font-bold leading-tight text-gray-800">
            {tribune.titre}
          </h3>
          {tribune.quartiers && (
            <p className="text-sm text-gray-500">
              Quartier: {tribune.quartiers.nom}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="whitespace-pre-wrap text-gray-700">
          {tribune.contenu}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-gray-50 px-4 py-2 text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <div>Par {tribune.auteur}</div>
          <div>{formattedDate}</div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <MessageSquare className="mr-1 h-4 w-4" />
            Répondre
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Share2 className="mr-1 h-4 w-4" />
            Partager
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
