import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useGeolocationPreference } from "@/contexts/GeolocationContext";

interface GeolocationButtonProps {
  onLocationFound: (lat: number, lon: number) => void;
  isLoading?: boolean;
}

export function GeolocationButton({ onLocationFound, isLoading }: GeolocationButtonProps) {
  const { geolocationEnabled } = useGeolocationPreference();
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  if (!geolocationEnabled) {
    return null;
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationFound(latitude, longitude);
        setIsGettingLocation(false);
        toast.success("Position obtenue avec succès");
      },
      (error) => {
        setIsGettingLocation(false);
        let errorMessage = "Erreur lors de l'obtention de votre position";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Veuillez autoriser l'accès à votre position";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Votre position n'est pas disponible";
            break;
          case error.TIMEOUT:
            errorMessage = "Délai d'attente dépassé pour obtenir votre position";
            break;
        }
        
        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  return (
    <Button
      onClick={getCurrentLocation}
      disabled={isGettingLocation || isLoading}
      className="w-full"
      variant="default"
    >
      {isGettingLocation ? (
        <>
          <Loader2 size={16} className="mr-2 animate-spin" />
          Obtention de votre position...
        </>
      ) : (
        <>
          <MapPin size={16} className="mr-2" />
          Utiliser ma position
        </>
      )}
    </Button>
  );
}