import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { ConversationList } from './ConversationList';
import { MessageView } from './MessageView';
import { NewConversationModal } from './components/NewConversationModal';
import { messageService } from '@/services/messageService';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { MessageCircle, Edit, ArrowLeft } from 'lucide-react';
import { PageLayout } from '@/components/common/PageLayout';

const MessagesPage = () => {
  const { user } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);
  const [activeTab, setActiveTab] = useState('liste');
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
          // Nettoyer les paramètres URL
          setSearchParams({});
          toast({
            title: "Conversation ouverte",
            description: `Conversation avec ${decodeURIComponent(userName)}`
          });
        })
        .catch((error) => {
          console.error('Erreur création conversation:', error);
          toast({
            title: "Erreur",
            description: "Impossible d'ouvrir la conversation",
            variant: "destructive"
          });
        });
    }
  }, [searchParams, user, setSearchParams]);

  const { data: conversations = [], isLoading, error } = useQuery({
    queryKey: ['conversations'],
    queryFn: messageService.getConversations,
    enabled: !!user,
    retry: 3,
    staleTime: 30000, // 30 secondes
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
    onError: (error) => {
      console.error('Erreur suppression conversation:', error);
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

  const handleConversationCreated = (conversationId: string) => {
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
    setSelectedConversationId(conversationId);
    setShowNewConversationModal(false);
  };

  // Filtrer les conversations
  const filteredConversations = conversations.filter(conversation => {
    if (!searchTerm) return true;
    const lastMessage = conversation.messages?.[0];
    return lastMessage?.content.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (!user) {
    return (
      <PageLayout
        title="Messageries"
        description="Gérez vos conversations et échangez avec d'autres utilisateurs"
        icon={MessageCircle}
        activeTab="liste"
        onTabChange={() => {}}
        showSearchOnAllTabs={false}
        listContent={
          <Card className="p-6 text-center">
            <h2 className="text-lg font-semibold mb-2">Connexion requise</h2>
            <p className="text-muted-foreground">
              Veuillez vous connecter pour accéder à vos messages.
            </p>
          </Card>
        }
        addContent={<div />}
      />
    );
  }

  if (error) {
    return (
      <PageLayout
        title="Messageries"
        description="Gérez vos conversations et échangez avec d'autres utilisateurs"
        icon={MessageCircle}
        activeTab="liste"
        onTabChange={() => {}}
        listContent={
          <Card className="p-6 text-center">
            <h2 className="text-lg font-semibold mb-2 text-destructive">Erreur de chargement</h2>
            <p className="text-muted-foreground mb-4">
              Impossible de charger vos conversations.
            </p>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['conversations'] })}>
              Réessayer
            </Button>
          </Card>
        }
        addContent={<div />}
      />
    );
  }

  if (selectedConversationId) {
    return (
      <div>
        <PageLayout
          title="Messageries"
          description="Gérez vos conversations et échangez avec d'autres utilisateurs"
          icon={MessageCircle}
          activeTab="conversation"
          onTabChange={setActiveTab}
          showSearchOnAllTabs={false}
          listContent={
            <div className="h-[calc(100vh-12rem)] flex overflow-hidden bg-background rounded-lg border">
              {/* Liste des conversations - Desktop seulement */}
              <div className="hidden lg:block w-80 border-r">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Conversations</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowNewConversationModal(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Nouveau
                    </Button>
                  </div>
                </div>
                <div className="h-[calc(100%-5rem)] overflow-y-auto">
                  <ConversationList
                    conversations={conversations}
                    isLoading={isLoading}
                    selectedConversationId={selectedConversationId}
                    onSelectConversation={setSelectedConversationId}
                    onDeleteConversation={handleDeleteConversation}
                    searchTerm=""
                  />
                </div>
              </div>

              {/* Vue des messages */}
              <div className="flex-1 flex flex-col">
                {/* Header mobile pour retour */}
                <div className="lg:hidden p-3 border-b">
                  <div className="flex items-center space-x-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedConversationId(null)}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h3 className="font-semibold">Conversation</h3>
                  </div>
                </div>
                
                <div className="flex-1">
                  <MessageView conversationId={selectedConversationId} />
                </div>
              </div>
            </div>
          }
          addContent={<div />}
        />
        
        <NewConversationModal
          open={showNewConversationModal}
          onOpenChange={setShowNewConversationModal}
          onConversationCreated={handleConversationCreated}
        />
      </div>
    );
  }

  return (
    <div>
      <PageLayout
        title="Messageries"
        description="Gérez vos conversations et échangez avec d'autres utilisateurs"
        icon={MessageCircle}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Rechercher des conversations..."
        loading={isLoading}
        hasData={conversations.length > 0}
        emptyStateIcon={MessageCircle}
        emptyStateTitle="Aucune conversation"
        emptyStateDescription="Commencez une nouvelle conversation"
        onAddFirst={() => setShowNewConversationModal(true)}
        addFirstText="Nouvelle conversation"
        onAddClick={() => setShowNewConversationModal(true)}
        addButtonText="Nouvelle conversation"
        additionalOptions={
          <Button 
            variant="outline"
            onClick={() => setShowNewConversationModal(true)}
            size="sm"
          >
            <Edit className="h-4 w-4 mr-2" />
            Nouvelle conversation
          </Button>
        }
        listContent={
          <div className="space-y-2">
            <ConversationList
              conversations={filteredConversations}
              isLoading={isLoading}
              selectedConversationId={selectedConversationId}
              onSelectConversation={setSelectedConversationId}
              onDeleteConversation={handleDeleteConversation}
              searchTerm={searchTerm}
            />
          </div>
        }
        addContent={<div />}
        resultCount={filteredConversations.length}
      />
      
      <NewConversationModal
        open={showNewConversationModal}
        onOpenChange={setShowNewConversationModal}
        onConversationCreated={handleConversationCreated}
      />
    </div>
  );
};

export default MessagesPage;