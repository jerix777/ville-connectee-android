
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  AuthState, 
  getUserProfile, 
  getOrCreateSessionId, 
  getSessionCommune, 
  getLocalCommuneId 
} from "@/services/authService";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType extends AuthState {
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    isLoading: true,
    communeId: null,
    sessionId: getOrCreateSessionId(),
  });

  // Récupérer le profil utilisateur actuel
  const refreshProfile = async () => {
    if (!state.user) return;
    
    const profile = await getUserProfile(state.user.id);
    
    setState((current) => ({
      ...current,
      profile,
      communeId: profile?.commune_id || current.communeId,
    }));
  };

  // Initialisation: vérifier la session et configurer l'écouteur de changements d'authentification
  useEffect(() => {
    // Récupérer la commune localement
    const localCommuneId = getLocalCommuneId();
    
    // Fonction pour vérifier la session active
    const initAuth = async () => {
      try {
        // Vérifier si une session existe
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && session.user) {
          // L'utilisateur est connecté
          const profile = await getUserProfile(session.user.id);
          
          setState({
            user: session.user,
            session,
            profile,
            isLoading: false,
            communeId: profile?.commune_id || localCommuneId,
            sessionId: getOrCreateSessionId(),
          });
        } else {
          // L'utilisateur n'est pas connecté
          // Récupérer la préférence de commune pour la session actuelle
          const sessionId = getOrCreateSessionId();
          let communeId = localCommuneId;
          
          if (!communeId) {
            communeId = await getSessionCommune(sessionId) || null;
          }
          
          setState({
            user: null,
            session: null,
            profile: null,
            isLoading: false,
            communeId,
            sessionId,
          });
        }
      } catch (error) {
        console.error("Erreur initialisation auth:", error);
        setState((current) => ({
          ...current,
          isLoading: false,
        }));
        toast({
          title: "Erreur d'initialisation",
          description: "Impossible de récupérer votre session",
          variant: "destructive",
        });
      }
    };

    // Configurer l'écouteur pour les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (session && session.user) {
          // L'utilisateur vient de se connecter ou sa session a été mise à jour
          const profile = await getUserProfile(session.user.id);
          
          setState({
            user: session.user,
            session,
            profile,
            isLoading: false,
            communeId: profile?.commune_id || getLocalCommuneId(),
            sessionId: getOrCreateSessionId(),
          });
          
          if (event === 'SIGNED_IN') {
            toast({
              title: "Connecté",
              description: "Vous êtes maintenant connecté",
            });
          }
        } else if (event === 'SIGNED_OUT') {
          // L'utilisateur s'est déconnecté
          setState({
            user: null,
            session: null,
            profile: null,
            isLoading: false,
            communeId: getLocalCommuneId(),
            sessionId: getOrCreateSessionId(),
          });
          
          toast({
            title: "Déconnecté",
            description: "Vous avez été déconnecté",
          });
        }
      }
    );

    // Initialiser l'authentification
    initAuth();

    // Nettoyage de l'écouteur
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <AuthContext.Provider value={{ ...state, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};
