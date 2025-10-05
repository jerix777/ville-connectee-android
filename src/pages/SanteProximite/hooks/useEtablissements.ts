import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { EtablissementSante, santeService } from '@/services/santeService';
import { useDebounce } from '@/hooks';

export function useEtablissements() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<"liste" | "ajouter">("liste");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const queryClient = useQueryClient();

  // Précharger la liste complète
  useQuery<EtablissementSante[]>({
    queryKey: ["etablissements"],
    queryFn: () => santeService.getEtablissements(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query principale pour la recherche
  const { data: filteredEtablissements = [], isLoading, error } = useQuery<EtablissementSante[]>({
    queryKey: ["etablissements", "search", debouncedSearch],
    queryFn: () => debouncedSearch
      ? santeService.searchEtablissements(debouncedSearch)
      : santeService.getEtablissements(),
    staleTime: 30 * 1000, // 30 secondes
  });

  // Précharger les résultats de recherche au survol
  const prefetchSearch = async (query: string) => {
    await queryClient.prefetchQuery({
      queryKey: ["etablissements", "search", query],
      queryFn: () => santeService.searchEtablissements(query),
    });
  };

  return {
    etablissements,
    filteredEtablissements,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    activeView,
    setActiveView
  };
}