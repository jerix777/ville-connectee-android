import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Phone } from "lucide-react";
import { EtablissementSante } from "@/services/santeService";

const TYPE_LABELS = {
  'hopital': { label: 'Hôpital', color: 'bg-red-100 text-red-800' },
  'pharmacie': { label: 'Pharmacie', color: 'bg-green-100 text-green-800' },
  'clinique': { label: 'Clinique', color: 'bg-blue-100 text-blue-800' },
  'centre_sante': { label: 'Centre de santé', color: 'bg-purple-100 text-purple-800' },
} as const;

interface EtablissementCardProps {
  etablissement: EtablissementSante;
}



export function EtablissementCard({ etablissement }: EtablissementCardProps): JSX.Element {
  const typeInfo = TYPE_LABELS[etablissement.type];

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (etablissement.telephone) {
      window.location.href = `tel:${etablissement.telephone}`;
    }
  };

  const handleDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (etablissement.adresse) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(etablissement.adresse)}`, '_blank');
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold mb-2">
              {etablissement.nom}
            </CardTitle>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline" className={`flex items-center gap-1 ${typeInfo.color}`}>
                {typeInfo.label}
              </Badge>
              {etablissement.urgences && (
                <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                  Urgences
                </Badge>
              )}
              {etablissement.garde_permanente && (
                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                  Garde permanente
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {etablissement.adresse && (
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
            <span className="text-sm text-muted-foreground">
              {etablissement.adresse}
            </span>
          </div>
        )}

        {etablissement.telephone && (
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-muted-foreground">
              {etablissement.telephone}
            </span>
          </div>
        )}

        {etablissement.horaires && (
          <div className="flex items-start gap-2">
            <Clock size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
            <span className="text-sm text-muted-foreground">
              {etablissement.horaires}
            </span>
          </div>
        )}

        {etablissement.description && (
          <p className="text-sm text-muted-foreground mt-2">
            {etablissement.description}
          </p>
        )}

        {etablissement.telephone && (
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCall} 
              className="flex-1">
              <Phone size={16} className="mr-2" />
              Appeler
            </Button>
            {etablissement.adresse && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDirections}
                className="flex-1"
              >
                <MapPin size={16} className="mr-1" />
                Itinéraire
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
