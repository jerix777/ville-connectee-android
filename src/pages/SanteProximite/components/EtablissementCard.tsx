import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, MapPin, Phone } from "lucide-react";
import { EtablissementSante } from "@/services/santeService";

interface EtablissementCardProps {
  etablissement: EtablissementSante;
  onCall?: (phone: string) => void;
  onDirections?: (lat: number, lon: number) => void;
}

const typeLabels: Record<string, string> = {
  hopital: "Hôpital",
  pharmacie: "Pharmacie",
  clinique: "Clinique",
  centre_sante: "Centre de Santé",
};

const typeColors: Record<string, string> = {
  hopital: "bg-red-100 text-red-800 border-red-200",
  pharmacie: "bg-green-100 text-green-800 border-green-200",
  clinique: "bg-blue-100 text-blue-800 border-blue-200",
  centre_sante: "bg-purple-100 text-purple-800 border-purple-200",
};

export function EtablissementCard(
  { etablissement, onCall, onDirections }: EtablissementCardProps,
) {
  const handleCall = () => {
    if (etablissement.telephone && onCall) {
      onCall(etablissement.telephone);
    }
  };

  const handleDirections = () => {
    if (onDirections) {
      onDirections(etablissement.latitude, etablissement.longitude);
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
              <Badge
                variant="outline"
                className={typeColors[etablissement.type] ||
                  "bg-gray-100 text-gray-800 border-gray-200"}
              >
                {typeLabels[etablissement.type] || etablissement.type}
              </Badge>
              {
                /* {etablissement.urgences && (
                <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                  <AlertCircle size={12} className="mr-1" />
                  Urgences
                </Badge>
              )}
              {etablissement.garde_permanente && (
                <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                  <Clock size={12} className="mr-1" />
                  24h/24
                </Badge>
              )} */
              }
            </div>
          </div>
          {
            /* {etablissement.distance !== undefined && (
            <div className="text-right">
              <span className="text-sm font-medium text-primary">
                {etablissement.distance} km
              </span>
            </div>
          )} */
          }
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-start gap-2">
          <MapPin
            size={16}
            className="text-muted-foreground mt-0.5 flex-shrink-0"
          />
          <span className="text-sm text-muted-foreground">
            {etablissement.adresse}
          </span>
        </div>

        {etablissement.telephone && (
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-muted-foreground">
              {etablissement.telephone}
            </span>
          </div>
        )}

        {/* {etablissement.horaires && (
          <div className="flex items-start gap-2">
            <Clock
              size={16}
              className="text-muted-foreground mt-0.5 flex-shrink-0"
            />
            <span className="text-sm text-muted-foreground">
              {etablissement.horaires}
            </span>
          </div>
        )} */}

        {/* {etablissement.description && (
          <p className="text-sm text-muted-foreground">
            {etablissement.description}
          </p>
        )} */}

        {/* {etablissement.services && etablissement.services.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Services :</span>
            <div className="flex flex-wrap gap-1">
              {etablissement.services.map((service, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {service}
                </Badge>
              ))}
            </div>
          </div>
        )} */}

        <div className="flex gap-2 pt-2">
          {etablissement.telephone && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCall}
              className="flex-1"
            >
              <Phone size={16} className="mr-1" />
              Appeler
            </Button>
          )}
          {
            /* <Button
            variant="outline"
            size="sm"
            onClick={handleDirections}
            className="flex-1"
          >
            <MapPin size={16} className="mr-1" />
            Itinéraire
          </Button> */
          }
        </div>
      </CardContent>
    </Card>
  );
}
