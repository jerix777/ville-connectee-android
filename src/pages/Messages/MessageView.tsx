import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { messageService, Message } from '@/services/messageService';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';
import { Edit, Trash, MoreVertical } from 'lucide-react';

interface MessageViewProps {
  conversationId: string;
}

export const MessageView: React.FC<MessageViewProps> = ({ conversationId }) => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => messageService.getMessages(conversationId),
    enabled: !!conversationId
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => messageService.sendMessage(conversationId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setNewMessage('');
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive"
      });
    }
  });

  const deleteMessageMutation = useMutation({
    mutationFn: (messageId: string) => messageService.deleteMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      toast({
        title: "Message supprimé",
        description: "Le message a été supprimé avec succès"
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le message",
        variant: "destructive"
      });
    }
  });

  const editMessageMutation = useMutation({
    mutationFn: ({ messageId, content }: { messageId: string; content: string }) => 
      messageService.editMessage(messageId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      setEditingMessageId(null);
      setEditingContent('');
      toast({
        title: "Message modifié",
        description: "Le message a été modifié avec succès"
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le message",
        variant: "destructive"
      });
    }
  });

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = messageService.subscribeToMessages(conversationId, (newMessage) => {
      queryClient.setQueryData(
        ['messages', conversationId],
        (oldMessages: Message[] = []) => [...oldMessages, newMessage]
      );
    });

    return () => {
      channel.unsubscribe();
    };
  }, [conversationId, queryClient]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    sendMessageMutation.mutate(newMessage.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleEditMessage = (message: Message) => {
    setEditingMessageId(message.id);
    setEditingContent(message.content);
  };

  const handleSaveEdit = () => {
    if (!editingMessageId || !editingContent.trim()) return;
    editMessageMutation.mutate({ messageId: editingMessageId, content: editingContent.trim() });
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingContent('');
  };

  const handleDeleteMessage = (messageId: string) => {
    deleteMessageMutation.mutate(messageId);
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium">U</span>
            </div>
          </Avatar>
          <div>
            <h3 className="font-medium">Utilisateur</h3>
            <p className="text-xs text-muted-foreground">En ligne</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Chargement des messages...</p>
          </div>
        ) : messages?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucun message dans cette conversation</p>
          </div>
        ) : (
          messages?.map((message) => {
            const isOwnMessage = message.sender_id === user?.id;
            const isEditing = editingMessageId === message.id;
            
            return (
              <div
                key={message.id}
                className={cn(
                  "flex group",
                  isOwnMessage ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[70%] rounded-lg px-4 py-2 relative",
                    isOwnMessage
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSaveEdit();
                          } else if (e.key === 'Escape') {
                            handleCancelEdit();
                          }
                        }}
                      />
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={handleSaveEdit} disabled={editMessageMutation.isPending}>
                          Sauvegarder
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={cn(
                          "text-xs mt-1",
                          isOwnMessage
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        )}
                      >
                        {format(new Date(message.created_at), 'HH:mm', { locale: fr })}
                      </p>
                    </>
                  )}

                  {/* Menu d'actions pour les messages de l'utilisateur */}
                  {isOwnMessage && !isEditing && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100",
                            isOwnMessage ? "text-primary-foreground hover:bg-primary-foreground/20" : ""
                          )}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditMessage(message)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Trash className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer le message</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteMessage(message.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tapez votre message..."
            disabled={sendMessageMutation.isPending}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || sendMessageMutation.isPending}
          >
            Envoyer
          </Button>
        </form>
      </div>
    </Card>
  );
};