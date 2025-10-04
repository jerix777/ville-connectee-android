import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface Location {
  lat: number;
  lon: number;
}

interface UseGeolocationOptions {
  onLocationFound?: (location: Location) => void;
  onError?: (error: string) => void;
}

export function useGeolocation(options?: UseGeolocationOptions) {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentPosition = useCallback(() => {
    setLoading(true);

    if (!navigator.geolocation) {
      const error = "La géolocalisation n'est pas supportée par votre navigateur";
      toast.error(error);
      options?.onError?.(error);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        setLocation(newLocation);
        options?.onLocationFound?.(newLocation);
        setLoading(false);
      },
      (error) => {
        let message = "Erreur lors de la géolocalisation";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "L'accès à la géolocalisation a été refusé";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "La position n'est pas disponible";
            break;
          case error.TIMEOUT:
            message = "La demande de géolocalisation a expiré";
            break;
        }
        toast.error(message);
        options?.onError?.(message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, [options]);

  const clearLocation = useCallback(() => {
    setLocation(null);
  }, []);

  return {
    location,
    loading,
    getCurrentPosition,
    clearLocation,
  };
}