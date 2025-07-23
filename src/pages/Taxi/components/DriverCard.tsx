import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

// This type should be moved to a more central location (e.g., services/taxiService) later
export type TaxiDriver = {
  id: string;
  user_id: string;
  vehicle_type: 'moto' | 'voiture';
  availability: 'disponible' | 'indisponible' | 'en_course';
  profiles: {
    full_name: string;
    phone: string;
  } | null;
};

type DriverCardProps = {
  driver: TaxiDriver;
};

export const DriverCard = ({ driver }: DriverCardProps) => {
  if (!driver.profiles) {
    return null;
  }

  const getAvailabilityLabel = (availability: string) => {
    switch (availability) {
      case 'disponible':
        return 'Disponible';
      case 'indisponible':
        return 'Indisponible';
      case 'en_course':
        return 'En course';
      default:
        return 'Inconnu';
    }
  };

  const getAvailabilityVariant = (availability: string) => {
    switch (availability) {
      case 'disponible':
        return 'success';
      case 'indisponible':
        return 'destructive';
      case 'en_course':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{driver.profiles.full_name}</CardTitle>
          <Badge variant={getAvailabilityVariant(driver.availability)}>
            {getAvailabilityLabel(driver.availability)}
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
