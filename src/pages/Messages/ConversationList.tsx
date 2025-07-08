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
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  isLoading,
  selectedConversationId,
  onSelectConversation,
  onDeleteConversation
}) => {
  if (isLoading) {
    return (
      <Card className="h-full p-4">
        <h2 className="text-lg font-semibold mb-4">Conversations</h2>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 rounded-lg">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Conversations</h2>
      </div>
      
      <div className="p-2 space-y-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucune conversation</p>
          </div>
        ) : (
          conversations.map((conversation) => {
            const lastMessage = conversation.messages?.[0];
            const isSelected = selectedConversationId === conversation.id;
            
            return (
              <div
                key={conversation.id}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg transition-colors group",
                  "hover:bg-accent",
                  isSelected && "bg-accent"
                )}
              >
                <div 
                  className="flex items-center space-x-3 flex-1 cursor-pointer"
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <Avatar className="h-10 w-10">
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium">U</span>
                    </div>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">
                        Utilisateur
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
                  
                  {/* Badge pour les messages non lus (à implémenter plus tard) */}
                  <div className="flex-shrink-0">
                    <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                      2
                    </Badge>
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
    </Card>
  );
};