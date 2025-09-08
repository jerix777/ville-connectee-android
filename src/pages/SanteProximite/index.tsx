import React, { useState, useEffect } from 'react';
import { PageLayout } from "@/components/common/PageLayout";
import { GeolocationButton } from "./components/GeolocationButton";
import { FilterSection } from "./components/FilterSection";
import { EtablissementCard } from "./components/EtablissementCard";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { santeService, EtablissementSante } from "@/services/santeService";
import { Heart, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

export default function SanteProximite() {
  const [activeTab, setActiveTab] = useState<string>("recherche");
  const [etablissements, setEtablissements] = useState<EtablissementSante[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  
  // Filtres
  const [typeFilter, setTypeFilter] = useState<string>("tous");
  const [radiusFilter, setRadiusFilter] = useState<number>(10);
  const [urgencesOnly, setUrgencesOnly] = useState(false);
  const [gardeOnly, setGardeOnly] = useState(false);

  const handleLocationFound = async (lat: number, lon: number) => {
    setUserLocation({ lat, lon });
    await searchNearbyEtablissements(lat, lon);
  };

  const searchNearbyEtablissements = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      let results = await santeService.getEtablissementsProches(
        lat, 
        lon, 
        radiusFilter,
        typeFilter
      );

      // Appliquer les filtres supplémentaires
      if (urgencesOnly) {
        results = results.filter(e => e.urgences === true);
      }
      
      if (gardeOnly) {
        results = results.filter(e => e.garde_permanente === true);
      }

      setEtablissements(results);
      
      if (results.length === 0) {
        toast.info("Aucun établissement trouvé dans ce rayon");
      }
    } catch (error) {
      console.error('Error searching establishments:', error);
      toast.error("Erreur lors de la recherche des établissements");
    } finally {
      setLoading(false);
    }
  };

  // Re-rechercher quand les filtres changent
  useEffect(() => {
    if (userLocation) {
      searchNearbyEtablissements(userLocation.lat, userLocation.lon);
    }
  }, [typeFilter, radiusFilter, urgencesOnly, gardeOnly]);

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleDirections = (lat: number, lon: number) => {
    // Ouvrir dans Google Maps ou Plans selon la plateforme
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Sur mobile, essayer d'ouvrir l'app native
      window.open(`geo:${lat},${lon}?q=${lat},${lon}`, '_blank');
    } else {
      // Sur desktop, ouvrir Google Maps
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, '_blank');
    }
  };

  const renderSearchContent = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <GeolocationButton 
                onLocationFound={handleLocationFound}
                isLoading={loading}
              />
              
              <FilterSection
                typeFilter={typeFilter}
                onTypeFilterChange={setTypeFilter}
                radiusFilter={radiusFilter}
                onRadiusFilterChange={setRadiusFilter}
                urgencesOnly={urgencesOnly}
                onUrgencesOnlyChange={setUrgencesOnly}
                gardeOnly={gardeOnly}
                onGardeOnlyChange={setGardeOnly}
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            {loading && (
              <LoadingSkeleton type="list" count={3} />
            )}

            {!loading && !userLocation && (
              <EmptyState
                icon={MapPin}
                title="Localisation requise"
                description="Veuillez activer votre géolocalisation pour trouver les établissements de santé proches de vous."
              />
            )}

            {!loading && userLocation && etablissements.length === 0 && (
              <EmptyState
                icon={Heart}
                title="Aucun établissement trouvé"
                description="Aucun établissement de santé ne correspond à vos critères dans ce rayon. Essayez d'élargir votre recherche."
              />
            )}

            {!loading && etablissements.length > 0 && (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground mb-4">
                  {etablissements.length} établissement{etablissements.length > 1 ? 's' : ''} trouvé{etablissements.length > 1 ? 's' : ''} près de vous
                </div>

                {etablissements.map((etablissement) => (
                  <EtablissementCard
                    key={etablissement.id}
                    etablissement={etablissement}
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
    <PageLayout
      title="Santé de proximité"
      description="Trouvez rapidement les hôpitaux, pharmacies et centres de santé proches de votre position"
      icon={Heart}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      listContent={renderSearchContent()}
      hasData={true}
    />
  );
}