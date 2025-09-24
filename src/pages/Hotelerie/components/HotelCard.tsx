import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, MapPin, Hotel as HotelIcon } from "lucide-react";
import type { Hotel } from "@/services/hotelService";

interface HotelCardProps {
  hotel: Hotel;
  onCall: (phone: string) => void;
  onDirections: (address: string) => void;
}

export function HotelCard({ hotel, onCall, onDirections }: HotelCardProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'auberge':
        return 'Auberge';
      case 'residence-meublee':
        return 'Résidence meublée';
      case 'chambre':
        return 'Chambre';
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'auberge':
        return 'bg-blue-100 text-blue-800';
      case 'residence-meublee':
        return 'bg-orange-100 text-orange-800';
      case 'chambre':
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
              {hotel.nom}
            </h3>
            <Badge className={getTypeColor(hotel.type)}>
              {getTypeLabel(hotel.type)}
            </Badge>
          </div>
          <HotelIcon className="h-6 w-6 text-muted-foreground" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            {hotel.adresse}
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Phone className="h-4 w-4 mr-2" />
            {hotel.contact1}
            {hotel.contact2 && ` / ${hotel.contact2}`}
          </div>

          {hotel.description && (
            <p className="text-sm text-muted-foreground pt-2">
              {hotel.description}
            </p>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCall(hotel.contact1)}
            className="flex items-center gap-1"
          >
            <Phone className="h-4 w-4" />
            Appeler
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDirections(hotel.adresse)}
            className="flex items-center gap-1"
          >
            <MapPin className="h-4 w-4" />
            Itinéraire
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
