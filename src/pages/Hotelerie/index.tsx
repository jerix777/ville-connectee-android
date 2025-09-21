import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLayout } from "@/components/common/PageLayout";
import { HotelCard } from "./components/HotelCard";
import { FilterSection } from "./components/FilterSection";
import { AddHotelForm } from "./AddHotelForm";
import { GeolocationButton } from "@/pages/SanteProximite/components/GeolocationButton";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { hotelService, type StationHotel } from "@/services/hotelService";
import { usePagination } from "@/hooks/usePagination";
import { Fuel } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function HotelGaz() {
  const [activeTab, setActiveTab] = useState<string>("tous");
  const [activeViewTab, setActiveViewTab] = useState<string>("liste");
  const [hotels, setHotels] = useState<StationHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<
    { lat: number; lon: number } | null
  >(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filtres
  const [typeFilter, setTypeFilter] = useState<string>("tous");
  const [radiusFilter, setRadiusFilter] = useState<number>(10);

  // Charger toutes les données au démarrage
  const loadAllStations = async () => {
    setLoading(true);
    setError(null);
    try {
      let results = await hotelService.getAllStations();

      // Appliquer les filtres
      if (typeFilter && typeFilter !== "tous") {
        results = results.filter((s) => s.type === typeFilter);
      }

      setHotels(results);

      if (results.length === 0 && typeFilter !== "tous") {
        toast({
          title: "Aucun hôtel trouvé",
          description: "Aucun hôtel trouvé avec ces critères",
        });
      }
    } catch (error) {
      console.error("Error loading hotels:", error);
      setError("Erreur lors du chargement des hôtels");
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des hôtels",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au démarrage
  useEffect(() => {
    loadAllStations();
  }, []);

  // Re-filtrer quand les filtres changent (sauf radius qui nécessite la géolocalisation)
  useEffect(() => {
    if (userLocation) {
      searchNearbyStations(userLocation.lat, userLocation.lon);
    } else {
      loadAllStations();
    }
  }, [typeFilter]);

  // Re-rechercher avec radius quand la géolocalisation est active
  useEffect(() => {
    if (userLocation) {
      searchNearbyStations(userLocation.lat, userLocation.lon);
    }
  }, [radiusFilter]);

  const handleLocationFound = async (lat: number, lon: number) => {
    setUserLocation({ lat, lon });
    await searchNearbyStations(lat, lon);
  };

  const searchNearbyStations = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      let results = await hotelService.getNearbyStations(
        lat,
        lon,
        radiusFilter,
      );

      // Appliquer les filtres additionnels
      if (typeFilter && typeFilter !== "tous") {
        results = results.filter((s) => s.type === typeFilter);
      }

      setHotels(results);

      if (results.length === 0) {
        toast({
          title: "Aucun hôtel trouvé",
          description: `Aucun hôtel trouvé dans un rayon de ${radiusFilter}km`,
        });
      } else {
        toast({
          title: "Recherche terminée",
          description: `${results.length} hôtel${
            results.length > 1 ? "s" : ""
          } trouvé${results.length > 1 ? "s" : ""} près de vous`,
        });
      }
    } catch (error) {
      console.error("Error searching nearby stations:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la recherche d'hôtels à proximité",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, "_self");
  };

  const handleDirections = (lat: number, lon: number) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`,
      "_blank",
    );
  };

  // Filtrer les hôtels
  const filteredStations = hotels.filter((station) => {
    const matchesSearch = !searchQuery ||
      station.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.adresse.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (station.description &&
        station.description.toLowerCase().includes(
          searchQuery.toLowerCase(),
        )) ||
      (station.services &&
        station.services.some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    return matchesSearch;
  });

  const chambres = filteredStations.filter((s) => s.type === "chambre");
  const auberges = filteredStations.filter((s) => s.type === "auberge");
  const residences = filteredStations.filter((s) =>
    s.type === "residence-meublee"
  );

  const getTabData = () => {
    switch (activeTab) {
      case "auberge":
        return auberges;
      case "residence-meublee":
        return residences;
      case "chambre":
        return chambres;
      default:
        return filteredStations;
    }
  };

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedStations,
    goToPage,
    canGoNext,
    canGoPrevious,
  } = usePagination({
    data: getTabData(),
    itemsPerPage: 9,
  });

  const customTabs = [
    { value: "tous", label: `Tous (${filteredStations.length})` },
    { value: "auberge", label: `Auberges (${auberges.length})` },
    { value: "residence-meublee", label: `Résidences (${residences.length})` },
    { value: "chambre", label: `Chambres (${chambres.length})` },
  ];

  const renderSearchContent = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {
            /* <div className="lg:w-80 flex-shrink-0">
            <div className="space-y-4">
              <FilterSection
                typeFilter={typeFilter}
                onTypeChange={setTypeFilter}
                radiusFilter={radiusFilter}
                onRadiusChange={setRadiusFilter}
                hasLocation={userLocation !== null}
              />
              <GeolocationButton
                onLocationFound={handleLocationFound}
              />
            </div>
          </div> */
          }

          <div className="flex-1">
            {loading && <LoadingSkeleton type="list" count={3} />}

            {!loading && !userLocation && hotels.length === 0 && (
              <EmptyState
                icon={Fuel}
                title="Aucun hôtel trouvé"
                description="Aucun hôtel trouvé avec ces critères. Activez la géolocalisation pour une recherche par proximité."
              />
            )}

            {!loading && hotels.length === 0 && userLocation && (
              <EmptyState
                icon={Fuel}
                title="Aucun hôtel trouvé"
                description={`Aucun hôtel trouvé dans un rayon de ${radiusFilter}km avec ces critères.`}
              />
            )}

            {!loading && filteredStations.length > 0 && (
              <div className="space-y-4">
                {
                  /* <div className="text-sm text-muted-foreground mb-4">
                  {filteredStations.length} hôtel{filteredStations.length > 1 ? 's' : ''} trouvé{filteredStations.length > 1 ? 's' : ''}
                  {userLocation ? ' près de vous' : ''}
                </div> */
                }

                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="mb-6 flex-wrap">
                    {customTabs.map((t) => (
                      <TabsTrigger key={t.value} value={t.value}>
                        {t.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {customTabs.map((t) => (
                    <TabsContent key={t.value} value={t.value}>
                      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {paginatedStations.map((station) => (
                          <HotelCard
                            key={station.id}
                            station={station}
                            onCall={handleCall}
                            onDirections={handleDirections}
                          />
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageLayout
      title="Hotel / Résidence meublée"
      description="Contactez vos fournisseurs pour voir la disponibilité du hotel et du gaz pour approvisionnement"
      icon={Fuel}
      iconClassName="text-blue-600"
      activeTab={activeViewTab}
      onTabChange={setActiveViewTab}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Rechercher un hotel..."
      addContent={<AddHotelForm />}
      loading={loading}
      hasData={filteredStations.length > 0}
      emptyStateIcon={Fuel}
      emptyStateTitle="Aucun hôtel trouvé"
      emptyStateDescription="Aucun hôtel ne correspond à vos critères"
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={goToPage}
      canGoNext={canGoNext}
      canGoPrevious={canGoPrevious}
      resultCount={filteredStations.length}
      customTabs={customTabs}
      skeletonType="grid"
      skeletonCount={6}
      listContent={error
        ? (
          <div className="text-center py-10 text-red-500">
            <p>{error}</p>
          </div>
        )
        : renderSearchContent()}
    />
  );
}
