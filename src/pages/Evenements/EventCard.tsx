
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, Phone, Info } from "lucide-react";
import { Event } from "@/services/eventService";
import { formatDate } from "@/services/eventService";

export function EventCard({ event }: { event: Event }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{event.titre}</CardTitle>
            <CardDescription>{event.type?.label}</CardDescription>
          </div>
          <div className="bg-ville-light text-ville-DEFAULT px-3 py-1 rounded-full text-sm font-medium">
            {formatDate(event.date_debut)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-ville-DEFAULT" />
            <span>{event.lieu}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-ville-DEFAULT" />
            <span>{event.heure_debut} - {event.heure_fin}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-ville-DEFAULT" />
            <span>{event.contact1}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" className="w-full">
          <Info className="h-4 w-4 mr-1" />
          Voir les détails
        </Button>
      </CardFooter>
    </Card>
  );
}
