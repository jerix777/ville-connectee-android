import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createBooking, TaxiDriver } from '@/services/taxiService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DriverCard } from './DriverCard';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Car, MapPin, Navigation } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface FindRideProps {
  drivers: TaxiDriver[];
  loading: boolean;
  onRefresh: () => void;
}

export const FindRide = ({ drivers, loading, onRefresh }: FindRideProps) => {
  const { user } = useAuth();
  const [selectedDriver, setSelectedDriver] = useState<TaxiDriver | null>(null);
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const bookingMutation = useMutation({
    mutationFn: (data: { pickup_location: string; destination: string; driver_id?: string }) =>
      createBooking(data),
    onSuccess: () => {
      toast({
        title: 'Demande envoyée',
        description: 'Votre demande de course a été envoyée au chauffeur',
      });
      setIsBookingOpen(false);
      setPickupLocation('');
      setDestination('');
      setSelectedDriver(null);
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: `Erreur lors de la demande: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleBookRide = () => {
    if (!pickupLocation || !destination) {
      toast({
        title: 'Informations manquantes',
        description: 'Veuillez renseigner le lieu de départ et la destination',
        variant: 'destructive',
      });
      return;
    }

    bookingMutation.mutate({
      pickup_location: pickupLocation,
      destination: destination,
      driver_id: selectedDriver?.id,
    });
  };

  if (loading) {
    return <LoadingSkeleton type="grid" count={6} />;
  }

  if (drivers.length === 0) {
    return (
      <div className="text-center py-10">
        <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Aucun chauffeur disponible</h3>
        <p className="text-muted-foreground mb-4">
          Il n'y a actuellement aucun chauffeur disponible dans votre zone. Essayez de nouveau plus tard.
        </p>
        <Button onClick={onRefresh} variant="outline">
          Actualiser
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Réserver une course
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" size="lg">
                <MapPin className="h-4 w-4 mr-2" />
                Demander une course
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Réserver une course</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pickup">Lieu de départ</Label>
                  <Input
                    id="pickup"
                    placeholder="Où vous trouvez-vous ?"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    placeholder="Où voulez-vous aller ?"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsBookingOpen(false)}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleBookRide}
                    disabled={bookingMutation.isPending}
                    className="flex-1"
                  >
                    {bookingMutation.isPending ? 'Envoi...' : 'Confirmer'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card> */}

      <div>
        <h3 className="text-lg font-semibold mb-4">
          Chauffeurs disponibles ({drivers.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drivers.map((driver) => (
            <DriverCard 
              key={driver.id} 
              driver={driver}
              onSelect={() => {
                setSelectedDriver(driver);
                setIsBookingOpen(true);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
