
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Phone, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Types for our event
interface Event {
  id: string;
  title: string;
  type: string;
  organizer: string;
  location: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  contact1: string;
  contact2?: string;
}

// Sample events data
const sampleEvents: Event[] = [
  {
    id: "1",
    title: "Festival de la Culture",
    type: "Culturel",
    organizer: "Mairie",
    location: "Place centrale",
    startDate: "2025-05-15",
    startTime: "18:00",
    endDate: "2025-05-15",
    endTime: "23:00",
    contact1: "0123456789"
  },
  {
    id: "2",
    title: "Marché hebdomadaire",
    type: "Commercial",
    organizer: "Association des commerçants",
    location: "Rue principale",
    startDate: "2025-04-21",
    startTime: "08:00",
    endDate: "2025-04-21",
    endTime: "13:00",
    contact1: "0123456789"
  },
  {
    id: "3",
    title: "Réunion du conseil",
    type: "Municipal",
    organizer: "Mairie",
    location: "Salle du conseil",
    startDate: "2025-04-22",
    startTime: "19:00",
    endDate: "2025-04-22",
    endTime: "21:00",
    contact1: "0123456789",
    contact2: "9876543210"
  }
];

// Event types for select
const eventTypes = [
  "Culturel", 
  "Municipal", 
  "Commercial", 
  "Sportif", 
  "Éducatif", 
  "Associatif", 
  "Autre"
];

// Format date helper
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// EventCard component
function EventCard({ event }: { event: Event }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>{event.type}</CardDescription>
          </div>
          <div className="bg-ville-light text-ville-DEFAULT px-3 py-1 rounded-full text-sm font-medium">
            {formatDate(event.startDate)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-ville-DEFAULT" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-ville-DEFAULT" />
            <span>{event.startTime} - {event.endTime}</span>
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
function AddEventForm() {
  const [formData, setFormData] = useState({
    type: "",
    organizer: "",
    location: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    contact1: "",
    contact2: ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Événement ajouté:", formData);
    // Ici, vous ajouteriez normalement l'événement à votre état ou base de données
    // puis vous fermeriez la dialogue
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type d'événement</Label>
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="organizer">Organisateur</Label>
          <Input
            id="organizer"
            name="organizer"
            value={formData.organizer}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Lieu</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="startDate">Date de début</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="startTime">Heure de début</Label>
          <Input
            id="startTime"
            name="startTime"
            type="time"
            value={formData.startTime}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endDate">Date de fin</Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endTime">Heure de fin</Label>
          <Input
            id="endTime"
            name="endTime"
            type="time"
            value={formData.endTime}
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
        <Button type="submit" className="bg-ville-DEFAULT hover:bg-ville-dark">
          Enregistrer l'événement
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function EvenementsPage() {
  // Filter events for today
  const today = new Date().toISOString().split('T')[0];
  const eventsToday = sampleEvents.filter(event => event.startDate === today);
  const upcomingEvents = sampleEvents.filter(event => event.startDate > today);
  
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
        
        <Dialog>
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
            <AddEventForm />
          </DialogContent>
        </Dialog>
      </div>
      
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
    </MainLayout>
  );
}
