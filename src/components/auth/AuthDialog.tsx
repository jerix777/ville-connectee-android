import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { UserPlus, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthDialogProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
}

export function AuthDialog({ 
  children, 
  trigger, 
  open, 
  onOpenChange, 
  title, 
  description 
}: AuthDialogProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && !user) {
      // Si l'utilisateur n'est pas connecté, ne pas ouvrir le dialogue
      // mais plutôt rediriger vers la page de connexion
      navigate('/auth');
      return;
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : !user ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Lock className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Authentification requise
            </h3>
            <p className="text-gray-600 mb-4 text-center">
              Vous devez être connecté pour effectuer cette action.
            </p>
            <Button onClick={() => {
              onOpenChange(false);
              navigate('/auth');
            }}>
              <UserPlus className="mr-2 h-4 w-4" />
              Se connecter
            </Button>
          </div>
        ) : (
          children
        )}
      </DialogContent>
    </Dialog>
  );
}