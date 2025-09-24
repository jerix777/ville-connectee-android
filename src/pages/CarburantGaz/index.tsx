import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLayout } from "@/components/common/PageLayout";
import { StationCard } from "./components/StationCard";
import { FilterSection } from "./components/FilterSection";
import { AddStationForm } from "./AddStationForm";
import { GeolocationButton } from "@/pages/SanteProximite/components/GeolocationButton";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import {
  carburantService,
  type StationCarburant,
} from "@/services/carburantService";
import { usePagination } from "@/hooks/usePagination";
import { Fuel } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function CarburantGaz() {
  const [activeTab, setActiveTab] = useState<string>("tous");
  const [activeViewTab, setActiveViewTab] = useState<string>("liste");
  const [stations, setStations] = useState<StationCarburant[]>([]);
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
      let results = await carburantService.getAllStations();

      // Appliquer les filtres
      if (typeFilter && typeFilter !== "tous") {
        results = results.filter((s) => s.type === typeFilter);
      }

      setStations(results);

      if (results.length === 0 && typeFilter !== "tous") {
        toast({
          title: "Aucune station trouvée",
          description: "Aucune station trouvée avec ces critères",
        });
      }
    } catch (error) {
      console.error("Error loading stations:", error);
      setError("Erreur lors du chargement des stations");
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des stations",
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
      let results = await carburantService.getNearbyStations(
        lat,
        lon,
        radiusFilter,
      );

      // Appliquer les filtres additionnels
      if (typeFilter && typeFilter !== "tous") {
        results = results.filter((s) => s.type === typeFilter);
      }

      setStations(results);

      if (results.length === 0) {
        toast({
          title: "Aucune station trouvée",
          description:
            `Aucune station trouvée dans un rayon de ${radiusFilter}km`,
        });
      } else {
        toast({
          title: "Recherche terminée",
          description: `${results.length} station${
            results.length > 1 ? "s" : ""
          } trouvée${results.length > 1 ? "s" : ""} près de vous`,
        });
      }
    } catch (error) {
      console.error("Error searching nearby stations:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la recherche de stations à proximité",
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

  // Filtrer les stations
  const filteredStations = stations.filter((station) => {
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

  const stationsService = filteredStations.filter((s) =>
    s.type === "station-service"
  );
  const depotsGaz = filteredStations.filter((s) => s.type === "depot-gaz");
  const stationsMixtes = filteredStations.filter((s) =>
    s.type === "station-mixte"
  );

  const getTabData = () => {
    switch (activeTab) {
      case "stations-service":
        return stationsService;
      case "depots-gaz":
        return depotsGaz;
      case "stations-mixtes":
        return stationsMixtes;
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
    { value: "tous", label: `Toutes (${filteredStations.length})` },
    {
      value: "stations-service",
      label: `Stations-service (${stationsService.length})`,
    },
    { value: "depots-gaz", label: `Dépôts de gaz (${depotsGaz.length})` },
    {
      value: "stations-mixtes",
      label: `Stations mixtes (${stationsMixtes.length})`,
    },
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

            {!loading && !userLocation && stations.length === 0 && (
              <EmptyState
                icon={Fuel}
                title="Aucune station trouvée"
                description="Aucune station trouvée avec ces critères. Activez la géolocalisation pour une recherche par proximité."
              />
            )}

            {!loading && stations.length === 0 && userLocation && (
              <EmptyState
                icon={Fuel}
                title="Aucune station trouvée"
                description={`Aucune station trouvée dans un rayon de ${radiusFilter}km avec ces critères.`}
              />
            )}

            {!loading && filteredStations.length > 0 && (
              <div className="space-y-4">
                {
                  /* <div className="text-sm text-muted-foreground mb-4">
                  {filteredStations.length} station{filteredStations.length > 1 ? 's' : ''} trouvée{filteredStations.length > 1 ? 's' : ''}
                  {userLocation ? ' près de vous' : ''}
                </div> */
                }

                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="mb-6 flex-wrap">
                    <TabsTrigger value="tous">
                      Toutes ({filteredStations.length})
                    </TabsTrigger>
                    <TabsTrigger value="stations-service">
                      Stations-service ({stationsService.length})
                    </TabsTrigger>
                    <TabsTrigger value="depots-gaz">
                      Dépôts de gaz ({depotsGaz.length})
                    </TabsTrigger>
                    <TabsTrigger value="stations-mixtes">
                      Stations mixtes ({stationsMixtes.length})
                    </TabsTrigger>
                  </TabsList>

                  {["tous", "stations-service", "depots-gaz", "stations-mixtes"]
                    .map((tabValue) => (
                      <TabsContent key={tabValue} value={tabValue}>
                        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                          {paginatedStations.map((station) => (
                            <StationCard
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
      moduleId="carburant"
      title="Carburant et Gaz"
      description="Contactez vos fournisseurs pour voir la disponibilité du carburant et du gaz pour approvisionnement"
      icon={Fuel}
      iconClassName="text-blue-600"
      activeTab={activeViewTab}
      onTabChange={setActiveViewTab}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Rechercher une station..."
      addContent={<AddStationForm onClose={() => setActiveViewTab("liste")} />}
      loading={loading}
      hasData={filteredStations.length > 0}
      emptyStateIcon={Fuel}
      emptyStateTitle="Aucune station trouvée"
      emptyStateDescription="Aucune station ne correspond à vos critères"
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
