import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Car, MapPin, Clock, Phone } from 'lucide-react';

interface DriverDashboardProps {
  // Add any props needed for the driver dashboard
}

export function DriverDashboard({}: DriverDashboardProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Tableau de bord Chauffeur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-sm text-muted-foreground">Courses aujourd'hui</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-primary">4.8</div>
              <div className="text-sm text-muted-foreground">Note moyenne</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-primary">€245</div>
              <div className="text-sm text-muted-foreground">Gains du jour</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Demandes de course</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">Course vers l'aéroport</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Centre-ville → Aéroport
                  </p>
                </div>
                <Badge>Nouveau</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    15 min
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    +33 6 12 34 56 78
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Refuser</Button>
                  <Button size="sm">Accepter</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}