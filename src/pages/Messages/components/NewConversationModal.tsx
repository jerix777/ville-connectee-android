import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Search, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  user_id: string;
  nom: string | null;
  prenom: string | null;
}

interface NewConversationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConversationCreated: (conversationId: string) => void;
}

export const NewConversationModal: React.FC<NewConversationModalProps> = ({
  open,
  onOpenChange,
  onConversationCreated
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users', searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];
      
      const { data, error } = await (supabase as any)
        .from('users_profiles')
        .select('*')
        .or(`nom.ilike.%${searchTerm}%,prenom.ilike.%${searchTerm}%`)
        .limit(10);
      
      if (error) throw error;
      return data as any[];
    },
    enabled: searchTerm.length > 2
  });

  const handleCreateConversation = async (otherUserId: string) => {
    try {
      const currentUserId = (await supabase.auth.getUser()).data.user?.id;
      if (!currentUserId) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour créer une conversation",
          variant: "destructive"
        });
        return;
      }

      // Vérifier si une conversation existe déjà
      const { data: existing } = await (supabase as any)
        .from('conversations')
        .select('id')
        .or(`and(participant1_id.eq.${currentUserId},participant2_id.eq.${otherUserId}),and(participant1_id.eq.${otherUserId},participant2_id.eq.${currentUserId})`)
        .single();

      if (existing) {
        onConversationCreated(existing.id);
        onOpenChange(false);
        toast({
          title: "Conversation existante",
          description: "Une conversation avec cet utilisateur existe déjà"
        });
        return;
      }

      // Créer une nouvelle conversation
      const { data: newConversation, error } = await (supabase as any)
        .from('conversations')
        .insert({
          participant1_id: currentUserId,
          participant2_id: otherUserId
        })
        .select()
        .single();

      if (error) throw error;

      onConversationCreated(newConversation.id);
      onOpenChange(false);
      setSearchTerm('');
      
      toast({
        title: "Conversation créée",
        description: "Nouvelle conversation créée avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de la création de la conversation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la conversation",
        variant: "destructive"
      });
    }
  };

  const getDisplayName = (user: UserProfile) => {
    if (user.prenom && user.nom) {
      return `${user.prenom} ${user.nom}`;
    }
    return user.nom || user.prenom || 'Utilisateur anonyme';
  };

  const getInitials = (user: UserProfile) => {
    const displayName = getDisplayName(user);
    return displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle conversation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="max-h-64 overflow-y-auto">
            {searchTerm.length <= 2 ? (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Tapez au moins 3 caractères pour rechercher</p>
              </div>
            ) : isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Recherche en cours...
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Aucun utilisateur trouvé</p>
              </div>
            ) : (
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => handleCreateConversation(user.user_id)}
                  >
                    <Avatar className="h-10 w-10">
                      <div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground">
                        <span className="text-sm font-semibold">
                          {getInitials(user)}
                        </span>
                      </div>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {getDisplayName(user)}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Créer
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};