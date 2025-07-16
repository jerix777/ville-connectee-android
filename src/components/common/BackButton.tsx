import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  fallbackPath?: string;
}

export function BackButton({ 
  className, 
  variant = 'ghost', 
  size = 'icon',
  fallbackPath = '/' 
}: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // Vérifier s'il y a un historique de navigation
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Sinon, aller vers la page d'accueil ou le fallback
      navigate(fallbackPath);
    }
  };

  // Ne pas afficher le bouton sur la page d'accueil
  if (location.pathname === '/') {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBack}
      className={cn(
        "text-current hover:bg-white/10",
        className
      )}
      aria-label="Retour"
    >
      <ArrowLeft size={20} />
    </Button>
  );
}