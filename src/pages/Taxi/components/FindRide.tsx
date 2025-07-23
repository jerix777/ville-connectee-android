import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { taxiService } from '@/services/taxiService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DriverCard } from './DriverCard';
import { Skeleton } from '@/components/ui/skeleton';

export const FindRide = () => {
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);

  const { data: lines } = useQuery({
    queryKey: ['taxiLines'],
    queryFn: taxiService.getTaxiLines,
  });

  const { data: drivers, isLoading } = useQuery({
    queryKey: ['drivers', startPoint, endPoint],
    queryFn: () => taxiService.findDriversByLine(startPoint, endPoint),
    enabled: searchTriggered && !!startPoint && !!endPoint,
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Select onValueChange={setStartPoint} value={startPoint}>
            <SelectTrigger>
              <SelectValue placeholder="Point de départ" />
            </SelectTrigger>
            <SelectContent>
              {lines?.map((line) => (
                <SelectItem key={line.id} value={line.start_point}>
                  {line.start_point}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setEndPoint} value={endPoint}>
            <SelectTrigger>
              <SelectValue placeholder="Point d'arrivée" />
            </SelectTrigger>
            <SelectContent>
              {lines?.map((line) => (
                <SelectItem key={line.id} value={line.end_point}>
                  {line.end_point}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                  <DriverCard key={driver.id} driver={driver} />
                ))}
              </div>
            ) : (
              <p>Aucun taximètre trouvé pour cette ligne.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
