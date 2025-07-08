import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messageService, Message } from '@/services/messageService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { MessageHeader } from './components/MessageHeader';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';

interface MessageViewProps {
  conversationId: string;
}

export const MessageView: React.FC<MessageViewProps> = ({ conversationId }) => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
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
    <div className="h-full flex flex-col bg-background">
      <MessageHeader conversationId={conversationId} />
      
      <MessageList
        messages={messages}
        isLoading={isLoading}
        currentUserId={user?.id}
        editingMessageId={editingMessageId}
        editingContent={editingContent}
        setEditingContent={setEditingContent}
        onEditMessage={handleEditMessage}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={handleCancelEdit}
        onDeleteMessage={handleDeleteMessage}
        editMessagePending={editMessageMutation.isPending}
      />
      
      <MessageInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSendMessage={handleSendMessage}
        onKeyPress={handleKeyPress}
        sendMessagePending={sendMessageMutation.isPending}
      />
    </div>
  );
};