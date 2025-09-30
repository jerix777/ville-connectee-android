
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEvents, Event } from "@/services/eventService";
import { EventCard } from "./EventCard";
import { AddEventForm } from "./AddEventForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLayout } from "@/components/common/PageLayout";
import { Toaster } from "@/components/ui/toaster";

export default function EvenementsPage() {
  const [activeViewTab, setActiveViewTab] = useState<string>("liste");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilterTab, setActiveFilterTab] = useState<string>("tous");

  const { data: events, isLoading, error, refetch } = useQuery({
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
    switch (activeFilterTab) {
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

  const renderEventsList = () => {
    if (isLoading) {
      return (
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
      );
    }

    if (error) {
      return (
        <div className="text-center py-10 text-red-500">
          <p>Erreur lors du chargement des événements.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Filter tabs */}
        <Tabs value={activeFilterTab} onValueChange={setActiveFilterTab} className="w-full">
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
      </div>
    );
  };

  return (
    <>
      <PageLayout
        moduleId="evenements"
        title="Événements"
        description="Découvrez et participez aux événements de la communauté"
        icon={Calendar}
        activeTab={activeViewTab}
        onTabChange={setActiveViewTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher un événement..."
        loading={isLoading}
        hasData={getTabData().length > 0}
        emptyStateIcon={Calendar}
        emptyStateTitle={searchQuery ? "Aucun événement trouvé avec ces critères." : "Aucun événement disponible pour le moment."}
        onAddFirst={() => setActiveViewTab("ajouter")}
        addFirstText="Créer le premier événement"
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        canGoNext={canGoNext}
        canGoPrevious={canGoPrevious}
        resultCount={getTabData().length}
        skeletonType="grid"
        skeletonCount={6}
        listContent={renderEventsList()}
        addContent={<AddEventForm onClose={() => setActiveViewTab("liste")} />}
      />
      <Toaster />
    </>
  );
}
