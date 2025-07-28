import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TaxiBooking } from '@/services/taxiService';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { 
  Car, 
  MapPin, 
  Clock, 
  Phone, 
  Activity, 
  TrendingUp, 
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DriverDashboardProps {
  bookings: TaxiBooking[];
  loading: boolean;
}

export function DriverDashboard({ bookings, loading }: DriverDashboardProps) {
  const [isAvailable, setIsAvailable] = useState(true);

  const pendingBookings = bookings.filter(booking => booking.status === 'pending');
  const todayBookings = bookings.filter(booking => {
    const today = new Date();
    const bookingDate = new Date(booking.created_at);
    return bookingDate.toDateString() === today.toDateString();
  });

  const completedBookings = bookings.filter(booking => booking.status === 'completed');

  if (loading) {
    return <LoadingSkeleton type="grid" count={4} />;
  }

  return (
    <div className="space-y-6">
      {/* Header avec statut */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Tableau de bord Chauffeur
            </CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor="availability">Disponible</Label>
              <Switch
                id="availability"
                checked={isAvailable}
                onCheckedChange={setIsAvailable}
              />
              <Badge variant={isAvailable ? "default" : "secondary"}>
                {isAvailable ? 'En ligne' : 'Hors ligne'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">{todayBookings.length}</div>
              <div className="text-sm text-muted-foreground">Courses aujourd'hui</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{pendingBookings.length}</div>
              <div className="text-sm text-muted-foreground">En attente</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{completedBookings.length}</div>
              <div className="text-sm text-muted-foreground">Terminées</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600">4.8</div>
              <div className="text-sm text-muted-foreground">Note moyenne</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Demandes en attente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Demandes de course ({pendingBookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingBookings.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="Aucune demande en attente"
              description="Toutes les demandes ont été traitées. Restez disponible pour recevoir de nouvelles courses."
            />
          ) : (
            <div className="space-y-4">
              {pendingBookings.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="font-medium">Nouvelle demande de course</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {booking.pickup_location}
                        </span>
                        <span>→</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {booking.destination}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {formatDistanceToNow(new Date(booking.created_at), { 
                        addSuffix: true, 
                        locale: fr 
                      })}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Il y a {formatDistanceToNow(new Date(booking.created_at), { locale: fr })}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <XCircle className="h-4 w-4 mr-1" />
                        Refuser
                      </Button>
                      <Button size="sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Accepter
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historique récent */}
      <Card>
        <CardHeader>
          <CardTitle>Historique récent</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <EmptyState
              icon={Car}
              title="Aucune course pour le moment"
              description="Votre historique de courses apparaîtra ici une fois que vous aurez commencé à accepter des demandes."
            />
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      booking.status === 'completed' ? 'bg-green-500' :
                      booking.status === 'pending' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium">
                        {booking.pickup_location} → {booking.destination}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(booking.created_at), { 
                          addSuffix: true, 
                          locale: fr 
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge variant={
                    booking.status === 'completed' ? 'default' :
                    booking.status === 'pending' ? 'secondary' :
                    'destructive'
                  }>
                    {booking.status === 'completed' ? 'Terminée' :
                     booking.status === 'pending' ? 'En attente' :
                     'Annulée'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}