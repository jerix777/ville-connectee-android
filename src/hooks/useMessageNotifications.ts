import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useMessageNotifications() {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  // Query pour récupérer le nombre de messages non lus
  const { data: unreadMessages, refetch } = useQuery({
    queryKey: ['unread-messages', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          read_at,
          sender_id,
          conversation_id,
          conversations!messages_conversation_id_fkey (
            participant1_id,
            participant2_id
          )
        `)
        .is('read_at', null)
        .neq('sender_id', user.id); // Messages non envoyés par l'utilisateur actuel

      if (error) throw error;

      // Filtrer les messages des conversations où l'utilisateur participe
      return data?.filter(message => {
        const conversation = message.conversations;
        return conversation && (
          conversation.participant1_id === user.id || 
          conversation.participant2_id === user.id
        );
      }) || [];
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Refetch toutes les 30 secondes
  });

  useEffect(() => {
    setUnreadCount(unreadMessages?.length || 0);
  }, [unreadMessages]);

  // Écouter les nouveaux messages en temps réel
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('message-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=neq.${user.id}` // Messages non envoyés par l'utilisateur
        },
        async (payload) => {
          // Vérifier si le message est dans une conversation de l'utilisateur
          const { data: conversation } = await supabase
            .from('conversations')
            .select('*')
            .eq('id', payload.new.conversation_id)
            .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
            .single();

          if (conversation) {
            refetch(); // Recharger les messages non lus
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=neq.${user.id}`
        },
        () => {
          refetch(); // Recharger quand un message est marqué comme lu
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, refetch]);

  const markAllAsRead = async () => {
    if (!user?.id || !unreadMessages) return;

    const messageIds = unreadMessages.map(msg => msg.id);
    
    const { error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .in('id', messageIds);

    if (!error) {
      refetch();
    }
  };

  return {
    unreadCount,
    markAllAsRead,
    refetch
  };
}