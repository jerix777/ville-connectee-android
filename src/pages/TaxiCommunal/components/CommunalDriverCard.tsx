import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type TaxiCommunalDriver = {
  id: string;
  user_id: string;
  vehicle_type: string;
  is_available: boolean;
  license_plate?: string | null;
  vehicle_model?: string | null;
  profiles: {
    full_name: string;
    phone: string;
  } | null;
};

type CommunalDriverCardProps = {
  driver: TaxiCommunalDriver;
};

export const CommunalDriverCard = ({ driver }: CommunalDriverCardProps) => {
  if (!driver.profiles) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{driver.profiles.full_name}</CardTitle>
          <Badge variant={driver.is_available ? 'success' : 'destructive'}>
            {driver.is_available ? 'Disponible' : 'Indisponible'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="capitalize">Véhicule: {driver.vehicle_type}</p>
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2">
            <Phone size={16} /> {driver.profiles.phone}
          </p>
          <Button asChild size="sm">
            <a href={`tel:${driver.profiles.phone}`}>Appeler</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
