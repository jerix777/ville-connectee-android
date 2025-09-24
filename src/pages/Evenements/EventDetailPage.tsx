import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getEvents, formatDate } from "@/services/eventService";
import { MainLayout } from "@/components/layout/MainLayout";
import { DetailPageHeader } from "@/components/common/DetailPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Phone, User, Calendar } from "lucide-react";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { toast } from "@/hooks/use-toast";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      if (!id) throw new Error('ID manquant');
      const allEvents = await getEvents();
      return allEvents.find(e => e.id === id);
    },
    enabled: !!id,
  });

  const handleContact = () => {
    if (event?.contact1) {
      navigator.clipboard.writeText(event.contact1);
      toast({
        title: "Contact copié !",
        description: `Le contact de l'organisateur a été copié dans le presse-papier.`,
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <DetailPageHeader title="Détail de l'événement" />
        <LoadingSkeleton />
      </MainLayout>
    );
  }

  if (error || !event) {
    return (
      <MainLayout>
        <DetailPageHeader title="Événement non trouvé" />
        <div className="p-4 text-center">
          <p>Cet événement n'existe pas ou a été supprimé.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <DetailPageHeader title="Détail de l'événement" />
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{event.titre}</CardTitle>
            <p className="text-muted-foreground">{event.type?.label}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <User size={18} className="text-ville-DEFAULT" />
                <span className="font-medium">Organisateur:</span>
                <span>{event.organisateur}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-ville-DEFAULT" />
                <span className="font-medium">Lieu:</span>
                <span>{event.lieu}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-ville-DEFAULT" />
                <span className="font-medium">Date:</span>
                <span>
                  {formatDate(event.date_debut)}
                  {event.date_debut !== event.date_fin && ` - ${formatDate(event.date_fin)}`}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-ville-DEFAULT" />
                <span className="font-medium">Horaire:</span>
                <span>{event.heure_debut} - {event.heure_fin}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-ville-DEFAULT" />
                <span className="font-medium">Contact:</span>
                <span>{event.contact1}</span>
              </div>
              
              {event.contact2 && (
                <div className="flex items-center gap-2">
                  <Phone size={18} className="text-ville-DEFAULT" />
                  <span className="font-medium">Contact secondaire:</span>
                  <span>{event.contact2}</span>
                </div>
              )}
            </div>
            
            <Button onClick={handleContact} className="w-full">
              <Phone className="h-4 w-4 mr-2" />
              Contacter l'organisateur
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}