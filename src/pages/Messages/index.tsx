import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ConversationList } from './ConversationList';
import { MessageView } from './MessageView';
import { messageService } from '@/services/messageService';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Search, Edit, ArrowLeft } from 'lucide-react';

const MessagesPage = () => {
  const { user } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Gérer la création d'une nouvelle conversation depuis l'annuaire
  useEffect(() => {
    const userId = searchParams.get('userId');
    const userName = searchParams.get('userName');
    
    if (userId && userName && user) {
      // Créer ou récupérer une conversation avec cet utilisateur
      messageService.getOrCreateConversation(userId)
        .then((conversation) => {
          setSelectedConversationId(conversation.id);
          toast({
            title: "Conversation ouverte",
            description: `Conversation avec ${decodeURIComponent(userName)}`
          });
        })
        .catch(() => {
          toast({
            title: "Erreur",
            description: "Impossible d'ouvrir la conversation",
            variant: "destructive"
          });
        });
    }
  }, [searchParams, user]);

  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: messageService.getConversations,
    enabled: !!user
  });

  const deleteConversationMutation = useMutation({
    mutationFn: (conversationId: string) => messageService.deleteConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      if (selectedConversationId) {
        setSelectedConversationId(null);
      }
      toast({
        title: "Conversation supprimée",
        description: "La conversation a été supprimée avec succès"
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la conversation",
        variant: "destructive"
      });
    }
  });

  const handleDeleteConversation = (conversationId: string) => {
    deleteConversationMutation.mutate(conversationId);
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Card className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Connexion requise</h2>
            <p className="text-muted-foreground">
              Veuillez vous connecter pour accéder à vos messages.
            </p>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="h-screen flex flex-col bg-background">
        {/* Header avec titre et barre de recherche - Desktop uniquement */}
        <div className={`flex-shrink-0 p-4 border-b ${selectedConversationId ? 'hidden md:block' : 'block'}`}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Messages</h1>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Nouveau
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher des messages"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-muted/30"
            />
          </div>
        </div>

        {/* Header mobile pour conversation */}
        {selectedConversationId && (
          <div className="md:hidden flex-shrink-0 p-4 border-b bg-background">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedConversationId(null)}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold">Conversation</h1>
            </div>
          </div>
        )}

        {/* Contenu principal */}
        <div className="flex-1 flex overflow-hidden">
          {/* Liste des conversations - Masquée sur mobile quand une conversation est sélectionnée */}
          <div className={`w-full md:w-80 border-r bg-background ${selectedConversationId ? 'hidden md:block' : 'block'}`}>
            <ConversationList
              conversations={conversations || []}
              isLoading={isLoading}
              selectedConversationId={selectedConversationId}
              onSelectConversation={setSelectedConversationId}
              onDeleteConversation={handleDeleteConversation}
              searchTerm={searchTerm}
            />
          </div>

          {/* Vue des messages - Plein écran sur mobile */}
          <div className={`flex-1 ${selectedConversationId ? 'block' : 'hidden md:block'}`}>
            {selectedConversationId ? (
              <MessageView conversationId={selectedConversationId} />
            ) : (
              <div className="h-full flex items-center justify-center bg-muted/5">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Sélectionnez une conversation</h3>
                  <p className="text-muted-foreground">
                    Choisissez une conversation dans la liste pour commencer à échanger.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MessagesPage;