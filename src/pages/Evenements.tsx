
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Phone, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Event, EventType, addEvent, formatDate, getEventTypes, getEvents } from "@/services/eventService";

// EventCard component
function EventCard({ event }: { event: Event }) {
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
        <Button variant="outline" className="w-full">Voir les détails</Button>
      </CardFooter>
    </Card>
  );
}

// AddEventForm component
function AddEventForm({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    titre: "",
    type_id: "",
    organisateur: "",
    lieu: "",
    date_debut: "",
    heure_debut: "",
    date_fin: "",
    heure_fin: "",
    contact1: "",
    contact2: ""
  });
  
  const { data: eventTypes = [] } = useQuery({
    queryKey: ['eventTypes'],
    queryFn: getEventTypes
  });
  
  const addEventMutation = useMutation({
    mutationFn: addEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Événement ajouté",
        description: "L'événement a été ajouté avec succès",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de l'événement",
        variant: "destructive"
      });
      console.error("Error adding event:", error);
    }
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, type_id: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEventMutation.mutate(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type_id">Type d'événement</Label>
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map(type => (
                <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="titre">Titre</Label>
          <Input
            id="titre"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="organisateur">Organisateur</Label>
          <Input
            id="organisateur"
            name="organisateur"
            value={formData.organisateur}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lieu">Lieu</Label>
          <Input
            id="lieu"
            name="lieu"
            value={formData.lieu}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date_debut">Date de début</Label>
          <Input
            id="date_debut"
            name="date_debut"
            type="date"
            value={formData.date_debut}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="heure_debut">Heure de début</Label>
          <Input
            id="heure_debut"
            name="heure_debut"
            type="time"
            value={formData.heure_debut}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date_fin">Date de fin</Label>
          <Input
            id="date_fin"
            name="date_fin"
            type="date"
            value={formData.date_fin}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="heure_fin">Heure de fin</Label>
          <Input
            id="heure_fin"
            name="heure_fin"
            type="time"
            value={formData.heure_fin}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contact1">Contact 1</Label>
          <Input
            id="contact1"
            name="contact1"
            value={formData.contact1}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contact2">Contact 2 (optionnel)</Label>
          <Input
            id="contact2"
            name="contact2"
            value={formData.contact2}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button 
          type="submit" 
          className="bg-ville-DEFAULT hover:bg-ville-dark"
          disabled={addEventMutation.isPending}
        >
          {addEventMutation.isPending ? "Enregistrement..." : "Enregistrer l'événement"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function EvenementsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents
  });
  
  // Filter events for today
  const today = new Date().toISOString().split('T')[0];
  const eventsToday = events.filter(event => event.date_debut === today);
  const upcomingEvents = events.filter(event => event.date_debut > today);
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Événements</h1>
        <p className="text-gray-600">
          Consultez et gérez les événements à venir dans votre ville
        </p>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Liste des événements</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-ville-DEFAULT hover:bg-ville-dark">
              <Plus size={16} className="mr-2" />
              Ajouter un événement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Ajouter un événement</DialogTitle>
              <DialogDescription>
                Remplissez les détails pour ajouter un nouvel événement
              </DialogDescription>
            </DialogHeader>
            <AddEventForm onClose={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="text-center py-10">
          <p>Chargement des événements...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">
          <p>Une erreur est survenue lors du chargement des événements</p>
        </div>
      ) : (
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-4">
            <TabsTrigger value="today" className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Événements du jour</span>
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Événements à venir</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="today">
            {eventsToday.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
                <p>Aucun événement aujourd'hui</p>
              </div>
            ) : (
              <div>
                {eventsToday.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upcoming">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
                <p>Aucun événement à venir</p>
              </div>
            ) : (
              <div>
                {upcomingEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </MainLayout>
  );
}
