
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getEvents, Event } from "@/services/eventService";
import { EventCard } from "./EventCard";
import { AddEventForm } from "./AddEventForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Plus, Search } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function EvenementsPage() {
  const [activeTab, setActiveTab] = useState<string>("tous");
  const [activeViewTab, setActiveViewTab] = useState<string>("liste");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showActions, setShowActions] = useState<boolean>(true); // <-- Ajouté

  const { data: events, isLoading, error } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents
  });

  const today = new Date().toISOString().split('T')[0];

  const filteredEvents = (events || []).filter((event) => {
    const matchesSearch = !searchQuery ||
      event.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.lieu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organisateur.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const eventsToday = filteredEvents.filter(event => event.date_debut === today);
  const upcomingEvents = filteredEvents.filter(event => event.date_debut > today);

  const getTabData = () => {
    switch (activeTab) {
      case "aujourd-hui": return eventsToday;
      case "a-venir": return upcomingEvents;
      default: return filteredEvents;
    }
  };

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedEvents,
    goToPage,
    canGoNext,
    canGoPrevious,
  } = usePagination({
    data: getTabData(),
    itemsPerPage: 9,
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold flex items-center">
              <Calendar className="mr-2" />
              Événements
            </h1>
            <p className="text-gray-500 mt-1">
              Découvrez et participez aux événements de la communauté
            </p>
          </div>

          <Tabs
            value={activeViewTab}
            onValueChange={setActiveViewTab}
            className="w-full md:w-auto"
          >
            <TabsList className="grid w-full md:w-auto grid-cols-2">
              <TabsTrigger value="liste">Liste</TabsTrigger>
              <TabsTrigger value="ajouter">Ajouter</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {activeViewTab === "liste" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Rechercher un événement..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={() => { setActiveViewTab("ajouter"); }} className="whitespace-nowrap" >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-4">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">
                <p>Erreur lors du chargement des événements.</p>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="tous">
                    Tous ({filteredEvents.length})
                  </TabsTrigger>
                  <TabsTrigger value="aujourd-hui">
                    Aujourd'hui ({eventsToday.length})
                  </TabsTrigger>
                  <TabsTrigger value="a-venir">
                    À venir ({upcomingEvents.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="tous">
                  {filteredEvents.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500">Aucun événement trouvé.</p>
                      <Button
                        variant="link"
                        onClick={() => setSearchQuery("")}
                      >
                        Réinitialiser les filtres
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {paginatedEvents.map((event) => (
                          <EventCard key={event.id} event={event} />
                        ))}
                      </div>
                      <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={goToPage}
                        canGoNext={canGoNext}
                        canGoPrevious={canGoPrevious}
                      />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="aujourd-hui">
                  {eventsToday.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500">Aucun événement aujourd'hui.</p>
                    </div>
                  ) : (
                    <div>
                      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {paginatedEvents.map((event) => (
                          <EventCard key={event.id} event={event} />
                        ))}
                      </div>
                      <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={goToPage}
                        canGoNext={canGoNext}
                        canGoPrevious={canGoPrevious}
                      />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="a-venir">
                  {upcomingEvents.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500">Aucun événement à venir.</p>
                    </div>
                  ) : (
                    <div>
                      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {paginatedEvents.map((event) => (
                          <EventCard key={event.id} event={event} />
                        ))}
                      </div>
                      <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={goToPage}
                        canGoNext={canGoNext}
                        canGoPrevious={canGoPrevious}
                      />
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}

        {activeViewTab === "ajouter" && (
          <AuthGuard>
            <AddEventForm />
          </AuthGuard>
        )}
      </div>
    </MainLayout>
  );
}
