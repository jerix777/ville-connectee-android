
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/services/eventService";
import { EventCard } from "./EventCard";
import { AddEventForm } from "./AddEventForm";

export default function EvenementsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents
  });
  
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
