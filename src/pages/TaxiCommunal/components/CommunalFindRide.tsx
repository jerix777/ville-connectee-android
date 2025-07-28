
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAvailableCommunalDrivers } from '@/services/taxiCommunalService';
import { CommunalDriverCard } from './CommunalDriverCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const CommunalFindRide: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'moto' | 'brousse'>('moto');
  const [searchTriggered, setSearchTriggered] = useState(false);

  const { data: drivers, isLoading } = useQuery({
    queryKey: ['availableCommunalDrivers', category, search],
    queryFn: () => getAvailableCommunalDrivers(category, search),
    enabled: searchTriggered,
  });

  const handleSearch = () => {
    setSearchTriggered(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trouver un taxi communal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center mb-2 gap-2">
          <input
            type="text"
            placeholder="Rechercher un chauffeur communal"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-l px-3 py-2 focus:outline-none"
          />
          <Button onClick={handleSearch} className="rounded-r" variant="default">
            Rechercher
          </Button>
        </div>
        <div className="flex gap-2 mb-2">
          <Button
            className={`flex-1 py-2 rounded font-semibold ${category === 'moto' ? 'bg-pink-300 text-white' : 'bg-pink-100 text-pink-700'}`}
            variant={category === 'moto' ? 'default' : 'outline'}
            onClick={() => setCategory('moto')}
          >
            Motos et tricycles
          </Button>
          <Button
            className={`flex-1 py-2 rounded font-semibold ${category === 'brousse' ? 'bg-pink-300 text-white' : 'bg-pink-100 text-pink-700'}`}
            variant={category === 'brousse' ? 'default' : 'outline'}
            onClick={() => setCategory('brousse')}
          >
            Taxis brousse
          </Button>
        </div>
        <div>
          <h2 className="font-bold mb-2">
            {category === 'moto' ? 'Liste des motos taxis jaunes et tricycles' : 'Liste des taxis brousse'}
          </h2>
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          )}
          {searchTriggered && !isLoading && drivers && (
            <div className="space-y-4">
              {drivers.length > 0 ? (
                drivers.map((driver: any) => (
                  <CommunalDriverCard key={driver.id} driver={driver} />
                ))
              ) : (
                <div className="text-gray-500 text-center py-8">Aucun chauffeur trouvé.</div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunalFindRide;
