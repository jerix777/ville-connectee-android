import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

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
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  isLoading,
  selectedConversationId,
  onSelectConversation
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
                  "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors",
                  "hover:bg-accent",
                  isSelected && "bg-accent"
                )}
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
            );
          })
        )}
      </div>
    </Card>
  );
};