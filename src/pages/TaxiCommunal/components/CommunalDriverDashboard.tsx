import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Car, MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';

export const CommunalDriverDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isAvailable, setIsAvailable] = useState(true);

  // Simulation des données du tableau de bord
  const { data: driverProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['communalDriverProfile', user?.id],
    queryFn: async () => {
      // Simulation - remplacer par un vrai appel API
      return {
        id: '1',
        vehicle_type: 'moto',
        vehicle_model: 'Honda 125',
        license_plate: 'AB-123-CD',
        is_available: true,
        total_rides: 15,
        rating: 4.8,
        earnings_today: 12500
      };
    },
    enabled: !!user,
  });

  const { data: recentBookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['communalDriverBookings', user?.id],
    queryFn: async () => {
      // Simulation - remplacer par un vrai appel API
      return [];
    },
    enabled: !!user,
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: async (available: boolean) => {
      // Simulation - remplacer par un vrai appel API
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: 'Statut mis à jour',
        description: `Vous êtes maintenant ${isAvailable ? 'disponible' : 'indisponible'}`,
      });
      queryClient.invalidateQueries({ queryKey: ['communalDriverProfile'] });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour votre statut',
        variant: 'destructive',
      });
    },
  });

  const handleAvailabilityToggle = (checked: boolean) => {
    setIsAvailable(checked);
    toggleAvailabilityMutation.mutate(checked);
  };

  if (profileLoading) {
    return <LoadingSkeleton type="grid" count={3} />;
  }

  if (!driverProfile) {
    return (
      <div className="text-center py-10">
        <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Profile non trouvé</h3>
        <p className="text-muted-foreground mb-4">
          Votre profil de chauffeur n'a pas pu être chargé.
        </p>
        <Button onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </div>
    );
  }

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

  return (
    <div className="space-y-6">
      {/* Header avec statut */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Tableau de bord chauffeur</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {getVehicleIcon(driverProfile.vehicle_type)} {driverProfile.vehicle_model || 'Véhicule communal'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">
                {isAvailable ? 'Disponible' : 'Indisponible'}
              </span>
              <Switch
                checked={isAvailable}
                onCheckedChange={handleAvailabilityToggle}
                disabled={toggleAvailabilityMutation.isPending}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {driverProfile.license_plate && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className="font-mono">{driverProfile.license_plate}</span>
              </div>
            )}
            <Badge variant={isAvailable ? "default" : "secondary"}>
              {isAvailable ? 'En ligne' : 'Hors ligne'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{driverProfile.total_rides}</p>
                <p className="text-sm text-muted-foreground">Courses totales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="text-yellow-500">⭐</div>
              <div>
                <p className="text-2xl font-bold">{driverProfile.rating}</p>
                <p className="text-sm text-muted-foreground">Note moyenne</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="text-green-500">💰</div>
              <div>
                <p className="text-2xl font-bold">{driverProfile.earnings_today.toLocaleString()} F</p>
                <p className="text-sm text-muted-foreground">Gains aujourd'hui</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demandes récentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Demandes récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bookingsLoading ? (
            <LoadingSkeleton type="list" count={3} />
          ) : recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune demande récente</h3>
              <p className="text-muted-foreground">
                Les nouvelles demandes de courses apparaîtront ici.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((booking: any) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{booking.pickup_location}</span>
                      <span className="text-muted-foreground">→</span>
                      <span>{booking.destination}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Il y a {booking.time_ago}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={booking.status === 'pending' ? 'secondary' : 'default'}>
                      {booking.status === 'pending' ? 'En attente' : 'Acceptée'}
                    </Badge>
                    {booking.status === 'pending' && (
                      <Button size="sm">
                        Accepter
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};