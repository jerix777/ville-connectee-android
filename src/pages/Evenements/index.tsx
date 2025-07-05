
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getEvents, Event } from "@/services/eventService";
import { EventCard } from "./EventCard";
import { AddEventForm } from "./AddEventForm";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, X } from "lucide-react";

export default function EvenementsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("tous");

  const { data: events, isLoading, error } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents
  });

  const today = new Date().toISOString().split('T')[0];
  const eventsToday = events?.filter(event => event.date_debut === today) || [];
  const upcomingEvents = events?.filter(event => event.date_debut > today) || [];

  const renderEvents = (eventsList: Event[]) => {
    if (eventsList.length === 0) {
      return (
        <div className="text-center py-10 text-muted-foreground">
          <Calendar size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p>Aucun événement disponible dans cette catégorie.</p>
        </div>
      );
    }

    return (
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {eventsList.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="text-ville-DEFAULT" />
            Événements
          </h1>

          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setShowAddForm(!showAddForm)} 
              variant={showAddForm ? "outline" : "ville"}
            >
              {showAddForm ? (
                <>
                  <X size={16} /> Annuler
                </>
              ) : (
                <>
                  <Plus size={16} /> Nouvel événement
                </>
              )}
            </Button>
          </div>
        </div>

        {showAddForm && (
          <div className="mb-8">
            <AddEventForm />
          </div>
        )}

        {isLoading && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Chargement des événements...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-red-500">
            <p>Erreur lors du chargement des événements.</p>
          </div>
        )}

        {!isLoading && !error && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="tous">
                Tous les événements ({events?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="aujourd-hui">
                Aujourd'hui ({eventsToday.length})
              </TabsTrigger>
              <TabsTrigger value="a-venir">
                À venir ({upcomingEvents.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tous">
              {renderEvents(events || [])}
            </TabsContent>
            <TabsContent value="aujourd-hui">
              {renderEvents(eventsToday)}
            </TabsContent>
            <TabsContent value="a-venir">
              {renderEvents(upcomingEvents)}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </MainLayout>
  );
}
