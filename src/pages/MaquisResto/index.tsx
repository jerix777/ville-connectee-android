import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLayout } from "@/components/common/PageLayout";
import { RestaurantCard } from "./components/RestaurantCard";
import { FilterSection } from "./components/FilterSection";
import { AddRestaurantForm } from "./AddRestaurantForm";
import { GeolocationButton } from "@/pages/SanteProximite/components/GeolocationButton";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { restaurantService, type RestaurantBuvette } from "@/services/restaurantService";
import { usePagination } from "@/hooks/usePagination";
import { UtensilsCrossed } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function MaquisResto() {
  const [activeTab, setActiveTab] = useState<string>("tous");
  const [activeViewTab, setActiveViewTab] = useState<string>("liste");
  const [restaurants, setRestaurants] = useState<RestaurantBuvette[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Filtres
  const [typeFilter, setTypeFilter] = useState<string>('tous');
  const [radiusFilter, setRadiusFilter] = useState<number>(10);

  // Charger toutes les données au démarrage
  const loadAllRestaurants = async () => {
    setLoading(true);
    setError(null);
    try {
      let results = await restaurantService.getAllRestaurants();

      // Appliquer les filtres
      if (typeFilter && typeFilter !== 'tous') {
        results = results.filter(r => r.type === typeFilter);
      }

      setRestaurants(results);
      
      if (results.length === 0 && typeFilter !== 'tous') {
        toast({
          title: "Aucun établissement trouvé",
          description: "Aucun établissement trouvé avec ces critères",
        });
      }
    } catch (error) {
      console.error('Error loading restaurants:', error);
      setError("Erreur lors du chargement des établissements");
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des établissements",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au démarrage
  useEffect(() => {
    loadAllRestaurants();
  }, []);

  // Re-filtrer quand les filtres changent (sauf radius qui nécessite la géolocalisation)
  useEffect(() => {
    if (userLocation) {
      searchNearbyRestaurants(userLocation.lat, userLocation.lon);
    } else {
      loadAllRestaurants();
    }
  }, [typeFilter]);

  // Re-rechercher avec radius quand la géolocalisation est active
  useEffect(() => {
    if (userLocation) {
      searchNearbyRestaurants(userLocation.lat, userLocation.lon);
    }
  }, [radiusFilter]);

  const handleLocationFound = async (lat: number, lon: number) => {
    setUserLocation({ lat, lon });
    await searchNearbyRestaurants(lat, lon);
  };

  const searchNearbyRestaurants = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      let results = await restaurantService.getNearbyRestaurants(lat, lon, radiusFilter);
      
      // Appliquer les filtres additionnels
      if (typeFilter && typeFilter !== 'tous') {
        results = results.filter(r => r.type === typeFilter);
      }

      setRestaurants(results);
      
      if (results.length === 0) {
        toast({
          title: "Aucun établissement trouvé",
          description: `Aucun établissement trouvé dans un rayon de ${radiusFilter}km`,
        });
      } else {
        toast({
          title: "Recherche terminée",
          description: `${results.length} établissement${results.length > 1 ? 's' : ''} trouvé${results.length > 1 ? 's' : ''} près de vous`,
        });
      }
    } catch (error) {
      console.error('Error searching nearby restaurants:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la recherche d'établissements à proximité",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleDirections = (lat: number, lon: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, '_blank');
  };

  // Filtrer les restaurants
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = !searchQuery || 
      restaurant.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.adresse.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (restaurant.description && restaurant.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (restaurant.specialites && restaurant.specialites.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
    
    return matchesSearch;
  });

  const restaurantsList = filteredRestaurants.filter(r => r.type === 'restaurant');
  const maquisList = filteredRestaurants.filter(r => r.type === 'maquis');
  const buvettesList = filteredRestaurants.filter(r => r.type === 'buvette');
  const cafesList = filteredRestaurants.filter(r => r.type === 'cafe');
  const barsList = filteredRestaurants.filter(r => r.type === 'bar');

  const getTabData = () => {
    switch (activeTab) {
      case "restaurants": return restaurantsList;
      case "maquis": return maquisList;
      case "buvettes": return buvettesList;
      case "cafes": return cafesList;
      case "bars": return barsList;
      default: return filteredRestaurants;
    }
  };

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedRestaurants,
    goToPage,
    canGoNext,
    canGoPrevious,
  } = usePagination({
    data: getTabData(),
    itemsPerPage: 9,
  });

  const customTabs = [
    { value: "tous", label: `Tous (${filteredRestaurants.length})` },
    { value: "restaurants", label: `Restaurants (${restaurantsList.length})` },
    { value: "maquis", label: `Maquis (${maquisList.length})` },
    { value: "buvettes", label: `Buvettes (${buvettesList.length})` },
    { value: "cafes", label: `Cafés (${cafesList.length})` },
    { value: "bars", label: `Bars (${barsList.length})` }
  ];

  const renderSearchContent = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-80 flex-shrink-0">
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
          </div>

          <div className="flex-1">
            {loading && (
              <LoadingSkeleton type="list" count={3} />
            )}

            {!loading && !userLocation && restaurants.length === 0 && (
              <EmptyState
                icon={UtensilsCrossed}
                title="Aucun établissement trouvé"
                description="Aucun établissement trouvé avec ces critères. Activez la géolocalisation pour une recherche par proximité."
              />
            )}

            {!loading && restaurants.length === 0 && userLocation && (
              <EmptyState
                icon={UtensilsCrossed}
                title="Aucun établissement trouvé"
                description={`Aucun établissement trouvé dans un rayon de ${radiusFilter}km avec ces critères.`}
              />
            )}

            {!loading && filteredRestaurants.length > 0 && (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground mb-4">
                  {filteredRestaurants.length} établissement{filteredRestaurants.length > 1 ? 's' : ''} trouvé{filteredRestaurants.length > 1 ? 's' : ''}
                  {userLocation ? ' près de vous' : ''}
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="mb-6 flex-wrap">
                    <TabsTrigger value="tous">Tous ({filteredRestaurants.length})</TabsTrigger>
                    <TabsTrigger value="restaurants">Restaurants ({restaurantsList.length})</TabsTrigger>
                    <TabsTrigger value="maquis">Maquis ({maquisList.length})</TabsTrigger>
                    <TabsTrigger value="buvettes">Buvettes ({buvettesList.length})</TabsTrigger>
                    <TabsTrigger value="cafes">Cafés ({cafesList.length})</TabsTrigger>
                    <TabsTrigger value="bars">Bars ({barsList.length})</TabsTrigger>
                  </TabsList>

                  {["tous", "restaurants", "maquis", "buvettes", "cafes", "bars"].map((tabValue) => (
                    <TabsContent key={tabValue} value={tabValue}>
                      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {paginatedRestaurants.map((restaurant) => (
                          <RestaurantCard
                            key={restaurant.id}
                            restaurant={restaurant}
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
      title="Maquis et Resto"
      description="Découvrez les restaurants, maquis et buvettes de votre région"
      icon={UtensilsCrossed}
      iconClassName="text-orange-600"
      activeTab={activeViewTab}
      onTabChange={setActiveViewTab}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Rechercher un établissement..."
      addContent={<AddRestaurantForm />}
      loading={loading}
      hasData={filteredRestaurants.length > 0}
      emptyStateIcon={UtensilsCrossed}
      emptyStateTitle="Aucun établissement trouvé"
      emptyStateDescription="Aucun établissement ne correspond à vos critères"
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={goToPage}
      canGoNext={canGoNext}
      canGoPrevious={canGoPrevious}
      resultCount={filteredRestaurants.length}
      customTabs={customTabs}
      skeletonType="grid"
      skeletonCount={6}
      listContent={error ? (
        <div className="text-center py-10 text-red-500">
          <p>{error}</p>
        </div>
      ) : renderSearchContent()}
    />
  );
}