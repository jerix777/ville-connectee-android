
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAvailableCommunalDrivers, TaxiCommunalDriver } from '@/services/taxiCommunalService';
import { CommunalDriverCard } from './CommunalDriverCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, Search, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CommunalFindRideProps {
  drivers: TaxiCommunalDriver[];
  loading: boolean;
  onRefresh: () => void;
}

export const CommunalFindRide = ({ drivers, loading, onRefresh }: CommunalFindRideProps) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'moto' | 'brousse'>('moto');

  const { data: filteredDrivers, isLoading: searchLoading } = useQuery({
    queryKey: ['availableCommunalDrivers', category, search],
    queryFn: () => getAvailableCommunalDrivers(category, search),
    enabled: !!search || category !== 'moto',
  });

  const displayDrivers = search || category !== 'moto' ? (filteredDrivers || []) : drivers;
  const isLoadingData = loading || searchLoading;

  if (isLoadingData) {
    return <LoadingSkeleton type="grid" count={6} />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Trouver un taxi communal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Rechercher un chauffeur</Label>
            <div className="flex gap-2">
              <Input
                id="search"
                placeholder="Nom du chauffeur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs value={category} onValueChange={(value) => setCategory(value as 'moto' | 'brousse')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="moto">Motos & Tricycles</TabsTrigger>
              <TabsTrigger value="brousse">Taxis Brousse</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {category === 'moto' ? 'Motos taxis et tricycles' : 'Taxis brousse'} disponibles
          </h3>
          <Badge variant="secondary">
            {displayDrivers.length} chauffeur{displayDrivers.length > 1 ? 's' : ''}
          </Badge>
        </div>

        {displayDrivers.length === 0 ? (
          <div className="text-center py-10">
            <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun chauffeur disponible</h3>
            <p className="text-muted-foreground mb-4">
              Il n'y a actuellement aucun {category === 'moto' ? 'moto-taxi ou tricycle' : 'taxi brousse'} disponible dans votre zone.
            </p>
            <Button onClick={onRefresh} variant="outline">
              Actualiser
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayDrivers.map((driver) => (
              <CommunalDriverCard key={driver.id} driver={driver} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
