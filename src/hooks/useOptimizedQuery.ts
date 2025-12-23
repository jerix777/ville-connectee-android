import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

interface UseOptimizedQueryOptions<T> {
  queryKey: QueryKey;
  queryFn: () => Promise<T>;
  staleTime?: number;
  enabled?: boolean;
  onError?: (error: Error) => void;
}

interface UseOptimizedMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  queryKey?: QueryKey;
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

/**
 * Hook optimisé pour les requêtes avec gestion d'erreur intégrée
 */
export function useOptimizedQuery<T>({
  queryKey,
  queryFn,
  staleTime = 1000 * 60 * 5,
  enabled = true,
  onError,
}: UseOptimizedQueryOptions<T>) {
  return useQuery({
    queryKey,
    queryFn,
    staleTime,
    enabled,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook optimisé pour les mutations avec invalidation automatique
 */
export function useOptimizedMutation<TData, TVariables>({
  mutationFn,
  queryKey,
  onSuccess,
  onError,
  successMessage,
  errorMessage = "Une erreur est survenue",
}: UseOptimizedMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey });
      }
      if (successMessage) {
        toast({ title: "Succès", description: successMessage });
      }
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      onError?.(error);
    },
  });
}

/**
 * Hook pour le prefetching des données
 */
export function usePrefetch() {
  const queryClient = useQueryClient();

  return {
    prefetch: <T>(queryKey: QueryKey, queryFn: () => Promise<T>) => {
      queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime: 1000 * 60 * 5,
      });
    },
  };
}
