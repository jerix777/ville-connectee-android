import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MoreVertical, Trash } from 'lucide-react';

interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  updated_at: string;
  messages?: Array<{
    content: string;
    created_at: string;
    sender_id: string;
  }>;
}

interface ConversationListProps {
  conversations: Conversation[];
  isLoading: boolean;
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  searchTerm?: string;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  isLoading,
  selectedConversationId,
  onSelectConversation,
  onDeleteConversation,
  searchTerm = ''
}) => {
  // Filtrer les conversations selon le terme de recherche
  const filteredConversations = conversations.filter(conversation => {
    const lastMessage = conversation.messages?.[0];
    const searchLower = searchTerm.toLowerCase();
    return (
      !searchTerm ||
      (lastMessage && lastMessage.content.toLowerCase().includes(searchLower))
    );
  });
  if (isLoading) {
    return (
      <div className="h-full p-4">
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 rounded-lg">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Créer un tableau d'avatars colorés pour chaque conversation
  const getAvatarColor = (conversationId: string) => {
    const colors = [
      'bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 
      'bg-orange-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-red-500'
    ];
    const index = conversationId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  return (
    <div className="h-full flex flex-col">
      {/* Section Récent */}
      <div className="p-4 border-b">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center">
          <span className="mr-2">▼</span> Récent
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {searchTerm ? 'Aucune conversation trouvée' : 'Aucune conversation'}
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const lastMessage = conversation.messages?.[0];
            const isSelected = selectedConversationId === conversation.id;
            const avatarColor = getAvatarColor(conversation.id);
            
            return (
              <div
                key={conversation.id}
                className={cn(
                  "flex items-center p-3 hover:bg-accent/50 transition-colors group border-l-4 border-transparent",
                  isSelected && "bg-accent border-l-primary"
                )}
              >
                <div 
                  className="flex items-center space-x-3 flex-1 cursor-pointer"
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <Avatar className="h-12 w-12">
                    <div className={cn("w-full h-full flex items-center justify-center text-white", avatarColor)}>
                      <span className="text-lg font-semibold">J</span>
                    </div>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold truncate">
                        Jacquie.orange
                      </p>
                      {lastMessage && (
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(lastMessage.created_at), {
                            addSuffix: true,
                            locale: fr
                          })}
                        </span>
                      )}
                    </div>
                    
                    {lastMessage && (
                      <p className="text-sm text-muted-foreground truncate">
                        {lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>

                {/* Menu d'actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Trash className="h-4 w-4 mr-2" />
                          Supprimer la conversation
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer la conversation</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cette conversation ? Tous les messages seront supprimés définitivement.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => onDeleteConversation(conversation.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};