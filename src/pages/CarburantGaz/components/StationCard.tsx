import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, MapPin, Clock, Fuel } from "lucide-react";
import type { StationCarburant } from "@/services/carburantService";

interface StationCardProps {
  station: StationCarburant;
  onCall: (phone: string) => void;
  onDirections: (lat: number, lon: number) => void;
}

export function StationCard({ station, onCall, onDirections }: StationCardProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'station-service':
        return 'Station-service';
      case 'depot-gaz':
        return 'Dépôt de gaz';
      case 'station-mixte':
        return 'Station mixte';
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'station-service':
        return 'bg-blue-100 text-blue-800';
      case 'depot-gaz':
        return 'bg-orange-100 text-orange-800';
      case 'station-mixte':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {station.nom}
            </h3>
            <Badge className={getTypeColor(station.type)}>
              {getTypeLabel(station.type)}
            </Badge>
          </div>
          <Fuel className="h-6 w-6 text-muted-foreground" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            {station.adresse}
          </div>

          {/* {station.horaires && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              {station.horaires}
            </div>
          )} */}

          {station.services && station.services.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">Services disponibles :</div>
              <div className="flex flex-wrap gap-1">
                {station.services.map((service, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* {(station.prix_essence || station.prix_gasoil || station.prix_gaz) && (
            <div>
              <div className="text-sm font-medium mb-2">Prix :</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                {station.prix_essence && (
                  <div>Essence : {station.prix_essence} FCFA/L</div>
                )}
                {station.prix_gasoil && (
                  <div>Gasoil : {station.prix_gasoil} FCFA/L</div>
                )}
                {station.prix_gaz && (
                  <div>Gaz butane : {station.prix_gaz} FCFA/kg</div>
                )}
              </div>
            </div>
          )} */}

          {/* {station.description && (
            <p className="text-sm text-muted-foreground">
              {station.description}
            </p>
          )} */}
        </div>

        <div className="flex gap-2 mt-4">
          {station.telephone && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCall(station.telephone!)}
              className="flex items-center gap-1"
            >
              <Phone className="h-4 w-4" />
              Appeler
            </Button>
          )}
          
          {/* {station.latitude && station.longitude && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDirections(station.latitude!, station.longitude!)}
              className="flex items-center gap-1"
            >
              <MapPin className="h-4 w-4" />
              Itinéraire
            </Button>
          )} */}
        </div>
      </CardContent>
    </Card>
  );
}