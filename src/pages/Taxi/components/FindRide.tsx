import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAvailableDrivers } from '@/services/taxiService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DriverCard } from './DriverCard';
import { Skeleton } from '@/components/ui/skeleton';

export const FindRide = () => {
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);

  const { data: drivers, isLoading } = useQuery({
    queryKey: ['availableDrivers'],
    queryFn: getAvailableDrivers,
    enabled: searchTriggered,
  });

  const handleSearch = () => {
    setSearchTriggered(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trouver un taximètre</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Rechercher les chauffeurs disponibles dans votre zone
          </p>
        </div>
        <Button onClick={handleSearch} className="w-full">
          Rechercher
        </Button>

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}

        {searchTriggered && !isLoading && drivers && (
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Taximètres disponibles
            </h3>
            {drivers.length > 0 ? (
              <div className="space-y-4">
                {drivers.map((driver) => (
                  <div key={driver.id} className="p-4 border rounded">
                    <p className="font-medium">Type: {driver.vehicle_type}</p>
                    <p className="text-sm text-muted-foreground">
                      Disponible: {driver.is_available ? 'Oui' : 'Non'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>Aucun taximètre trouvé.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
