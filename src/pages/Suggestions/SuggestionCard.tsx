
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Suggestion } from "@/services/suggestionService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageSquare, Share2 } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface SuggestionCardProps {
  suggestion: Suggestion;
}

export function SuggestionCard({ suggestion }: SuggestionCardProps) {
  const formattedDate = suggestion.created_at
    ? format(new Date(suggestion.created_at), "dd MMMM yyyy à HH:mm", {
        locale: fr,
      })
    : "";

  const statusColorMap = {
    "en attente": "bg-yellow-100 text-yellow-800",
    "approuvée": "bg-green-100 text-green-800",
    "refusée": "bg-red-100 text-red-800",
    "en cours": "bg-blue-100 text-blue-800",
  };

  const statusColor = statusColorMap[suggestion.status] || "bg-gray-100 text-gray-800";

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      {suggestion.image_url && (
        <div className="w-full">
          <AspectRatio ratio={16 / 9}>
            <img
              src={suggestion.image_url}
              alt={suggestion.titre}
              className="h-full w-full object-cover"
            />
          </AspectRatio>
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="space-y-1">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-bold leading-tight text-gray-800">
              {suggestion.titre}
            </h3>
            <Badge className={statusColor}>{suggestion.status}</Badge>
          </div>
          {suggestion.quartiers && (
            <p className="text-sm text-gray-500">
              Quartier: {suggestion.quartiers.nom}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="whitespace-pre-wrap text-gray-700">
          {suggestion.contenu}
        </div>
        
        {suggestion.reponse && (
          <div className="mt-4 rounded-md bg-gray-50 p-4">
            <p className="font-semibold text-gray-700">Réponse:</p>
            <p className="whitespace-pre-wrap text-gray-600">{suggestion.reponse}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-gray-50 px-4 py-2 text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <div>Par {suggestion.auteur}</div>
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            {formattedDate}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
