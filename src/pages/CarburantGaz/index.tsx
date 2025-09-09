import React, { useState, useEffect } from 'react';
import { PageLayout } from "@/components/common/PageLayout";
import { StationCard } from "./components/StationCard";
import { FilterSection } from "./components/FilterSection";
import { GeolocationButton } from "@/pages/SanteProximite/components/GeolocationButton";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { carburantService, type StationCarburant } from "@/services/carburantService";
import { Fuel } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function CarburantGaz() {
  const [activeTab, setActiveTab] = useState<string>("liste");
  const [stations, setStations] = useState<StationCarburant[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  
  // Filtres
  const [typeFilter, setTypeFilter] = useState<string>('tous');
  const [radiusFilter, setRadiusFilter] = useState<number>(10);

  // Charger toutes les données au démarrage
  const loadAllStations = async () => {
    setLoading(true);
    try {
      let results = await carburantService.getAllStations();

      // Appliquer les filtres
      if (typeFilter && typeFilter !== 'tous') {
        results = results.filter(s => s.type === typeFilter);
      }

      setStations(results);
      
      if (results.length === 0) {
        toast({
          title: "Aucune station trouvée",
          description: "Aucune station trouvée avec ces critères",
        });
      }
    } catch (error) {
      console.error('Error loading stations:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des stations",
        variant: "destructive"
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
      let results = await carburantService.getNearbyStations(lat, lon, radiusFilter);
      
      // Appliquer les filtres additionnels
      if (typeFilter && typeFilter !== 'tous') {
        results = results.filter(s => s.type === typeFilter);
      }

      setStations(results);
      
      if (results.length === 0) {
        toast({
          title: "Aucune station trouvée",
          description: `Aucune station trouvée dans un rayon de ${radiusFilter}km`,
        });
      } else {
        toast({
          title: "Recherche terminée",
          description: `${results.length} station${results.length > 1 ? 's' : ''} trouvée${results.length > 1 ? 's' : ''} près de vous`,
        });
      }
    } catch (error) {
      console.error('Error searching nearby stations:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la recherche de stations à proximité",
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

            {!loading && stations.length > 0 && (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground mb-4">
                  {stations.length} station{stations.length > 1 ? 's' : ''} trouvée{stations.length > 1 ? 's' : ''}
                  {userLocation ? ' près de vous' : ''}
                </div>

                {stations.map((station) => (
                  <StationCard
                    key={station.id}
                    station={station}
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
        title="Carburant et Gaz"
        description="Trouvez les stations-service et points de vente de gaz de votre région"
        icon={Fuel}
        iconClassName="text-blue-600"
        activeTab={activeTab}
        onTabChange={setActiveTab}
        listContent={renderSearchContent()}
        hasData={stations.length > 0}
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