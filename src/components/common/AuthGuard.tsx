import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { UserPlus, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showLogin?: boolean;
  requiresAuth?: boolean;
}

export function AuthGuard({ 
  children, 
  fallback, 
  showLogin = true, 
  requiresAuth = true 
}: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (requiresAuth && !user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-center max-w-md">
          <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Authentification requise
          </h3>
          <p className="text-muted-foreground mb-6">
            Vous devez être connecté pour accéder à ce contenu. 
            Seuls les habitants authentifiés peuvent voir les informations de contact.
          </p>
          {showLogin && (
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/auth')}
                className="w-full"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Se connecter
              </Button>
              <p className="text-sm text-muted-foreground">
                Pas encore de compte ? Inscrivez-vous sur la page de connexion.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}