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

  console.log('MessageView: conversationId=', conversationId, 'user=', user?.id);

  const { data: messages, isLoading, error } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      console.log('🔍 [MessageView] Fetching messages for conversation:', conversationId);
      try {
        const result = await messageService.getMessages(conversationId);
        console.log('✅ [MessageView] Messages fetched successfully:', result?.length, 'messages');
        return result;
      } catch (error) {
        console.error('❌ [MessageView] Error fetching messages:', error);
        throw error;
      }
    },
    enabled: !!conversationId && !!user,
    retry: 3,
    staleTime: 0, // Toujours refetch pour avoir les derniers messages
  });

  // Mark conversation as read when viewing it
  const markAsReadMutation = useMutation({
    mutationFn: () => messageService.markConversationAsRead(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unread-messages'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (conversationId && messages && messages.length > 0) {
      const unreadMessages = (messages as any[]).filter((msg: any) => 
        !msg.read_at && msg.sender_id !== user?.id
      );
      
      if (unreadMessages.length > 0) {
        markAsReadMutation.mutate();
      }
    }
  }, [conversationId, messages, user?.id]);

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

  const handleFileAttach = (file: File, type: 'image' | 'document') => {
    // Pour l'instant, on simule l'envoi de fichier en tant que message texte
    const fileName = file.name;
    const fileSize = (file.size / 1024).toFixed(1) + 'KB';
    const message = `📎 Fichier: ${fileName} (${fileSize})`;
    sendMessageMutation.mutate(message);
    
    toast({
      title: "Fichier envoyé",
      description: `${fileName} a été envoyé`
    });
  };

  const handleVoiceMessage = (audioBlob: Blob) => {
    // Pour l'instant, on simule l'envoi d'un message vocal
    const message = "🎤 Message vocal (" + (audioBlob.size / 1024).toFixed(1) + "KB)";
    sendMessageMutation.mutate(message);
    
    toast({
      title: "Message vocal envoyé",
      description: "Votre enregistrement a été envoyé"
    });
  };

  const handlePhotoCapture = (photoBlob: Blob) => {
    // Pour l'instant, on simule l'envoi d'une photo
    const message = "📷 Photo (" + (photoBlob.size / 1024).toFixed(1) + "KB)";
    sendMessageMutation.mutate(message);
    
    toast({
      title: "Photo envoyée",
      description: "Votre photo a été envoyée"
    });
  };

  if (error) {
    console.error('Erreur chargement messages:', error);
    return (
      <div className="h-full flex flex-col bg-background">
        <MessageHeader conversationId={conversationId} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-2">Erreur de chargement des messages</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-primary underline"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <MessageHeader conversationId={conversationId} />
      
      <MessageList
        messages={messages as any}
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
        onFileAttach={handleFileAttach}
        onVoiceMessage={handleVoiceMessage}
        onPhotoCapture={handlePhotoCapture}
      />
    </div>
  );
};