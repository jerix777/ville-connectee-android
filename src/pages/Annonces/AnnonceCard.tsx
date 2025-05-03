
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Annonce } from "@/services/annonceService";
import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AnnonceCardProps {
  annonce: Annonce;
}

export function AnnonceCard({ annonce }: AnnonceCardProps) {
  return (
    <Card className="mb-4 border-l-4 border-l-red-600">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-600" />
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
            Officiel
          </Badge>
        </div>
        <CardTitle className="mt-2">{annonce.titre}</CardTitle>
        {annonce.emetteur && 
          <CardDescription className="text-sm text-gray-700 font-medium">
            Émis par {annonce.emetteur}
          </CardDescription>
        }
        {annonce.publie_le && (
          <span className="text-xs text-gray-500">
            {format(new Date(annonce.publie_le), "PPP", { locale: fr })}
          </span>
        )}
      </CardHeader>
      <CardContent>
        {annonce.image_url && (
          <img src={annonce.image_url} alt="" className="w-full max-h-72 object-cover rounded mb-3" />
        )}
        <div className="whitespace-pre-line text-gray-800">{annonce.contenu}</div>
      </CardContent>
    </Card>
  );
}
