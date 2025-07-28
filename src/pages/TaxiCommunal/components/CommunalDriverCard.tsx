import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Car, MapPin } from 'lucide-react';
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

  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType) {
      case 'moto':
        return '🏍️';
      case 'tricycle':
        return '🛺';
      case 'brousse':
        return '🚐';
      default:
        return '🚕';
    }
  };

  const getVehicleLabel = (vehicleType: string) => {
    switch (vehicleType) {
      case 'moto':
        return 'Moto-taxi';
      case 'tricycle':
        return 'Tricycle';
      case 'brousse':
        return 'Taxi brousse';
      default:
        return 'Véhicule';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
              <Car className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium">
                {driver.profiles.full_name}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {getVehicleIcon(driver.vehicle_type)} {getVehicleLabel(driver.vehicle_type)}
              </p>
            </div>
          </div>
          <Badge 
            variant={driver.is_available ? "default" : "secondary"}
            className={driver.is_available ? "bg-green-100 text-green-800" : ""}
          >
            {driver.is_available ? 'Disponible' : 'Occupé'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {driver.license_plate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4" />
            <span className="font-mono">{driver.license_plate}</span>
          </div>
        )}
        {driver.vehicle_model && (
          <p className="text-sm text-muted-foreground mb-3">
            Modèle: {driver.vehicle_model}
          </p>
        )}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            asChild
          >
            <a href={`tel:${driver.profiles.phone}`}>
              <Phone className="h-4 w-4 mr-1" />
              Appeler
            </a>
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => {
              // Future: Logique de réservation
            }}
          >
            Contacter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
