import { useState, useEffect } from 'react';
import { santeService, EtablissementSante } from '@/services/santeService';
import { toast } from 'sonner';

interface Location {
  lat: number;
  lon: number;
}

interface UseSanteProximiteFiltersOptions {
  onResultsFound?: (results: EtablissementSante[]) => void;
}

export function useSanteProximiteFilters(options?: UseSanteProximiteFiltersOptions) {
  const [etablissements, setEtablissements] = useState<EtablissementSante[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filtres
  const [typeFilter, setTypeFilter] = useState<string>("tous");
  const [radiusFilter, setRadiusFilter] = useState<number>(10);
  const [urgencesOnly, setUrgencesOnly] = useState(false);
  const [gardeOnly, setGardeOnly] = useState(false);

  const loadAllEtablissements = async () => {
    setLoading(true);
    try {
      let results = await santeService.getEtablissements();

      // Appliquer les filtres
      results = applyFilters(results);

      setEtablissements(results);
      options?.onResultsFound?.(results);

      if (results.length === 0) {
        toast.info("Aucun établissement trouvé avec ces critères");
      }
    } catch (error) {
      console.error("Error loading establishments:", error);
      toast.error("Erreur lors du chargement des établissements");
    } finally {
      setLoading(false);
    }
  };

  const searchNearbyEtablissements = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      let results = await santeService.getEtablissements();
      
      // Le filtrage par proximité sera fait côté client après récupération des résultats

      // Appliquer les autres filtres
      results = applyFilters(results);

      setEtablissements(results);
      options?.onResultsFound?.(results);

      if (results.length === 0) {
        toast.info("Aucun établissement trouvé à proximité");
      }
    } catch (error) {
      console.error("Error searching nearby establishments:", error);
      toast.error("Erreur lors de la recherche des établissements à proximité");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (results: EtablissementSante[]) => {
    let filtered = [...results];

    if (typeFilter && typeFilter !== "tous") {
      filtered = filtered.filter((e) => e.type === typeFilter);
    }

    if (urgencesOnly) {
      filtered = filtered.filter((e) => e.urgences === true);
    }

    if (gardeOnly) {
      filtered = filtered.filter((e) => e.garde_permanente === true);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.nom.toLowerCase().includes(query) ||
          e.description?.toLowerCase().includes(query) ||
          e.adresse?.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  useEffect(() => {
    loadAllEtablissements();
  }, []);

  useEffect(() => {
    if (userLocation) {
      searchNearbyEtablissements(userLocation.lat, userLocation.lon);
    } else {
      loadAllEtablissements();
    }
  }, [typeFilter, urgencesOnly, gardeOnly, searchQuery]);

  useEffect(() => {
    if (userLocation) {
      searchNearbyEtablissements(userLocation.lat, userLocation.lon);
    }
  }, [radiusFilter]);

  return {
    etablissements,
    loading,
    userLocation,
    setUserLocation,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    radiusFilter,
    setRadiusFilter,
    urgencesOnly,
    setUrgencesOnly,
    gardeOnly,
    setGardeOnly,
    refreshData: loadAllEtablissements,
    searchNearbyEtablissements,
  };
}