import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { MoreVertical, Trash } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  searchTerm = "",
}) => {
  const { user } = useAuth();

  // Get user profiles for conversations
  const { data: userProfiles } = useQuery({
    queryKey: ["conversation-profiles", conversations.map((c) => c.id)],
    queryFn: async () => {
      if (!conversations.length || !user) return {};

      const otherUserIds = conversations.map((conv) =>
        conv.participant1_id === user.id
          ? conv.participant2_id
          : conv.participant1_id
      ).filter(Boolean);

      const { data, error } = await supabase
        .from("users_profiles")
        .select("user_id, nom, prenom")
        .in("user_id", otherUserIds);

      if (error) throw error;

      return data.reduce(
        (
          acc: Record<string, { user_id: string; nom: string; prenom: string }>,
          profile,
        ) => {
          acc[profile.user_id] = profile;
          return acc;
        },
        {},
      );
    },
    enabled: !!conversations.length && !!user,
  });

  // Filtrer les conversations selon le terme de recherche
  const filteredConversations = conversations.filter((conversation) => {
    const lastMessage = conversation.messages?.[0];
    const otherUserId = conversation.participant1_id === user?.id
      ? conversation.participant2_id
      : conversation.participant1_id;
    const profile = userProfiles?.[otherUserId];
    const displayName = profile
      ? `${profile.prenom || ""} ${profile.nom || ""}`.trim()
      : "Utilisateur";

    const searchLower = searchTerm.toLowerCase();
    return (
      !searchTerm ||
      displayName.toLowerCase().includes(searchLower) ||
      (lastMessage && lastMessage.content.toLowerCase().includes(searchLower))
    );
  });

  // Créer un tableau d'avatars colorés pour chaque conversation
  const getAvatarColor = (conversationId: string) => {
    const colors = [
      "bg-primary",
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-orange-500",
      "bg-cyan-500",
      "bg-indigo-500",
      "bg-red-500",
    ];
    const index = conversationId.split("").reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0,
    );
    return colors[index % colors.length];
  };

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

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Section Récent */}
      <div className="px-3 sm:px-4 py-2 bg-white border-b border-[#e8eaed]">
        <h3 className="text-sm font-medium text-[#5f6368]">
          Messages
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {filteredConversations.length === 0
          ? (
            <div className="text-center py-6 sm:py-8 px-4">
              <p className="text-sm sm:text-base text-[#5f6368]">
                {searchTerm
                  ? "Aucune conversation trouvée"
                  : "Aucune conversation"}
              </p>
            </div>
          )
          : (
            filteredConversations.map((conversation) => {
              const lastMessage = conversation.messages?.[0];
              const isSelected = selectedConversationId === conversation.id;
              const avatarColor = getAvatarColor(conversation.id);

              const otherUserId = conversation.participant1_id === user?.id
                ? conversation.participant2_id
                : conversation.participant1_id;
              const profile = userProfiles?.[otherUserId];
              const displayName = profile
                ? `${profile.prenom || ""} ${profile.nom || ""}`.trim() ||
                  "Utilisateur"
                : "Utilisateur";
              const initials = profile
                ? `${profile.prenom?.[0] || ""}${profile.nom?.[0] || ""}`
                  .toUpperCase() || "U"
                : "U";

              return (
                <div
                  key={conversation.id}
                  className={cn(
                    "flex items-center p-3 sm:p-4 hover:bg-[#f8f9fa] transition-colors group cursor-pointer touch-manipulation",
                    isSelected && "bg-[#e3f2fd]",
                  )}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                    <Avatar className="h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0">
                      <div className="w-full h-full flex items-center justify-center bg-[#1976d2] text-white">
                        <span className="text-sm font-medium">{initials}</span>
                      </div>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm sm:text-base font-medium text-[#202124] truncate pr-2">
                          {displayName}
                        </p>
                        {lastMessage && (
                          <span className="text-xs text-[#5f6368] flex-shrink-0">
                            {new Date(lastMessage.created_at)
                              .toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                          </span>
                        )}
                      </div>

                      {lastMessage && (
                        <p className="text-xs sm:text-sm text-[#5f6368] truncate">
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
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 sm:opacity-0 flex-shrink-0 ml-1"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Supprimer la conversation
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Supprimer la conversation
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer cette
                              conversation ? Tous les messages seront supprimés
                              définitivement.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                onDeleteConversation(conversation.id)}
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
