import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Clock, Star, Euro } from "lucide-react";
import type { RestaurantBuvette } from "@/services/restaurantService";

interface RestaurantCardProps {
  restaurant: RestaurantBuvette;
  onCall?: (phone: string) => void;
  onDirections?: (lat: number, lon: number) => void;
}

const typeLabels: Record<string, string> = {
  restaurant: "Restaurant",
  buvette: "Buvette", 
  maquis: "Maquis"
};

const typeColors: Record<string, string> = {
  restaurant: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  buvette: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  maquis: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
};

export function RestaurantCard({ 
  restaurant, 
  onCall, 
  onDirections 
}: RestaurantCardProps) {
  const handleCall = () => {
    if (restaurant.telephone && onCall) {
      onCall(restaurant.telephone);
    }
  };

  const handleDirections = () => {
    if (restaurant.latitude && restaurant.longitude && onDirections) {
      onDirections(restaurant.latitude, restaurant.longitude);
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{restaurant.nom}</h3>
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className={typeColors[restaurant.type] || ""}
              >
                {typeLabels[restaurant.type] || restaurant.type}
              </Badge>
              {restaurant.prix_moyen && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Euro className="h-4 w-4" />
                  <span>{restaurant.prix_moyen}€</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {restaurant.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {restaurant.description}
          </p>
        )}

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <span className="text-sm">{restaurant.adresse}</span>
          </div>
          
          {restaurant.telephone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{restaurant.telephone}</span>
            </div>
          )}
          
          {restaurant.horaires && (
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
              <span className="text-sm">{restaurant.horaires}</span>
            </div>
          )}
        </div>

        {restaurant.specialites && restaurant.specialites.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Spécialités</h4>
            <div className="flex flex-wrap gap-1">
              {restaurant.specialites.slice(0, 3).map((specialite, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {specialite}
                </Badge>
              ))}
              {restaurant.specialites.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{restaurant.specialites.length - 3} autres
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {restaurant.telephone && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleCall}
              className="flex-1"
            >
              <Phone className="h-4 w-4 mr-1" />
              Appeler
            </Button>
          )}
          {restaurant.latitude && restaurant.longitude && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleDirections}
              className="flex-1"
            >
              <MapPin className="h-4 w-4 mr-1" />
              Itinéraire
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}