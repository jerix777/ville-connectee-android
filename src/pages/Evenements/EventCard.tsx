
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, Phone, Info, User } from "lucide-react";
import { Event } from "@/services/eventService";
import { formatDate } from "@/services/eventService";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

export function EventCard({ event }: { event: Event }) {
  const navigate = useNavigate();

  const handleContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(event.contact1);
    toast("Contact copié!", {
      description: `Le contact de l'organisateur a été copié dans le presse-papier.`,
    });
  };

  const handleClick = () => {
    navigate(`/evenements/${event.id}`);
  };

  return (
    <Card className="h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow" onClick={handleClick}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{event.titre}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              {event.type?.label}
            </CardDescription>
          </div>
          <div className="bg-ville-light text-ville-DEFAULT px-3 py-1 rounded-full text-sm font-medium">
            {formatDate(event.date_debut)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <User size={16} className="text-ville-DEFAULT flex-shrink-0" />
          <span className="truncate">{event.organisateur}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin size={16} className="text-ville-DEFAULT flex-shrink-0" />
          <span className="truncate">{event.lieu}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock size={16} className="text-ville-DEFAULT flex-shrink-0" />
          <span>{event.heure_debut} - {event.heure_fin}</span>
        </div>
        {event.date_debut !== event.date_fin && (
          <div className="text-sm text-muted-foreground">
            Du {formatDate(event.date_debut)} au {formatDate(event.date_fin)}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button variant="secondary" className="w-full" onClick={handleContact}>
          <Phone className="h-4 w-4 mr-1" />
          Contacter l'organisateur
        </Button>
      </CardFooter>
    </Card>
  );
}
