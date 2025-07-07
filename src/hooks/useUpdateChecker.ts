import { useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export const useUpdateChecker = () => {
  const checkForUpdates = useCallback(async () => {
    try {
      // Récupérer la version actuelle du cache
      const currentVersion = localStorage.getItem('app-version');
      
      // Faire une requête pour obtenir l'index.html avec un timestamp pour éviter le cache
      const response = await fetch(`/index.html?t=${Date.now()}`, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) return;
      
      const html = await response.text();
      
      // Extraire les scripts et CSS pour créer un hash simple
      const scriptMatches = html.match(/<script[^>]*src="[^"]*"[^>]*>/g) || [];
      const cssMatches = html.match(/<link[^>]*href="[^"]*\.css"[^>]*>/g) || [];
      
      // Créer une signature basée sur les ressources
      const signature = [...scriptMatches, ...cssMatches].join('');
      const newVersion = btoa(signature).substring(0, 16);
      
      if (currentVersion && currentVersion !== newVersion) {
        // Une nouvelle version est disponible
        const updateApp = () => {
          localStorage.setItem('app-version', newVersion);
          window.location.reload();
        };
        
        toast({
          title: "Mise à jour disponible",
          description: "Une nouvelle version de l'application est disponible. Rechargez la page pour l'obtenir.",
          duration: 10000,
        });
        
        // Proposer de recharger automatiquement après 3 secondes
        setTimeout(() => {
          if (confirm('Une nouvelle version est disponible. Voulez-vous recharger maintenant ?')) {
            updateApp();
          }
        }, 3000);
      } else if (!currentVersion) {
        // Première visite, enregistrer la version
        localStorage.setItem('app-version', newVersion);
      }
    } catch (error) {
      console.warn('Erreur lors de la vérification des mises à jour:', error);
    }
  }, []);

  useEffect(() => {
    // Vérifier immédiatement au chargement
    checkForUpdates();
    
    // Vérifier toutes les 5 minutes
    const interval = setInterval(checkForUpdates, 5 * 60 * 1000);
    
    // Vérifier quand la fenêtre reprend le focus
    const handleFocus = () => {
      checkForUpdates();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkForUpdates]);

  return { checkForUpdates };
};