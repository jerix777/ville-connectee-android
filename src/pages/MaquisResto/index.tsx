import React, { useState, useEffect } from 'react';
import { PageLayout } from "@/components/common/PageLayout";
import { RestaurantCard } from "./components/RestaurantCard";
import { FilterSection } from "./components/FilterSection";
import { GeolocationButton } from "@/pages/SanteProximite/components/GeolocationButton";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { restaurantService, type RestaurantBuvette } from "@/services/restaurantService";
import { UtensilsCrossed, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function MaquisResto() {
  const [activeTab, setActiveTab] = useState<string>("liste");
  const [restaurants, setRestaurants] = useState<RestaurantBuvette[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  
  // Filtres
  const [typeFilter, setTypeFilter] = useState<string>('tous');
  const [radiusFilter, setRadiusFilter] = useState<number>(10);

  // Charger toutes les données au démarrage
  const loadAllRestaurants = async () => {
    setLoading(true);
    try {
      let results = await restaurantService.getAllRestaurants();

      // Appliquer les filtres
      if (typeFilter && typeFilter !== 'tous') {
        results = results.filter(r => r.type === typeFilter);
      }

      setRestaurants(results);
      
      if (results.length === 0) {
        toast({
          title: "Aucun établissement trouvé",
          description: "Aucun établissement trouvé avec ces critères",
        });
      }
    } catch (error) {
      console.error('Error loading restaurants:', error);
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

            {!loading && restaurants.length > 0 && (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground mb-4">
                  {restaurants.length} établissement{restaurants.length > 1 ? 's' : ''} trouvé{restaurants.length > 1 ? 's' : ''}
                  {userLocation ? ' près de vous' : ''}
                </div>

                {restaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onCall={handleCall}
                    onDirections={handleDirections}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <PageLayout
        title="Maquis et Resto"
        description="Découvrez les restaurants, maquis et buvettes de votre région"
        icon={UtensilsCrossed}
        iconClassName="text-orange-600"
        activeTab={activeTab}
        onTabChange={setActiveTab}
        listContent={renderSearchContent()}
        hasData={restaurants.length > 0}
        loading={loading}
        showAddButton={false}
        customTabs={[
          { value: "liste", label: "Rechercher" }
        ]}
      />
      <Toaster />
    </>
  );
}