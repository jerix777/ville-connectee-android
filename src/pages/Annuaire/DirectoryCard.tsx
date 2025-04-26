
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Phone, User } from "lucide-react";
import { Professional } from "@/services/professionalService";

export function DirectoryCard({ professional }: { professional: Professional }) {
  return (
    <Card className="mb-4 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <User size={20} className="text-purple-500" />
          <div>
            <CardTitle className="text-lg">{professional.nom}</CardTitle>
            {professional.surnom && (
              <p className="text-xs text-gray-500 italic">"{professional.surnom}"</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <div>
          <span className="font-semibold text-secondary-purple">Domaine :</span>{" "}
          {professional.metier?.nom || ""}
        </div>
        <div>
          <span className="font-semibold">Base :</span> {professional.base}
        </div>
        <div className="flex items-center gap-1">
          <Phone size={14} className="text-purple-400" />
          <span>{professional.contact1}</span>
        </div>
        {professional.contact2 && (
          <div className="flex items-center gap-1">
            <Phone size={14} className="text-purple-400" />
            <span>{professional.contact2}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
