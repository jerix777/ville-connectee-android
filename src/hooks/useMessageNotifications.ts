import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import type { Message } from '@/types/database';

// Import supabase avec contournement des types
const getSupabase = () => import('@/integrations/supabase/client').then(m => m.supabase);

export function useMessageNotifications() {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  // Query pour récupérer le nombre de messages non lus
  const { data: unreadMessages, refetch } = useQuery({
    queryKey: ['unread-messages', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const supabase = await getSupabase();
      const { data, error } = await (supabase as any)
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
        .neq('sender_id', user.id);

      if (error) throw error;

      // Filtrer les messages des conversations où l'utilisateur participe
      return (data as any[])?.filter((message: any) => {
        const conversation = message.conversations;
        return conversation && (
          conversation.participant1_id === user.id || 
          conversation.participant2_id === user.id
        );
      }) || [];
    },
    enabled: !!user?.id,
    refetchInterval: 30000,
  });

  useEffect(() => {
    setUnreadCount(unreadMessages?.length || 0);
  }, [unreadMessages]);

  // Écouter les nouveaux messages en temps réel
  useEffect(() => {
    if (!user?.id) return;

    const setupChannel = async () => {
      const supabase = await getSupabase();
      const channel = (supabase as any)
        .channel('message-notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `sender_id=neq.${user.id}`
          },
          async (payload: any) => {
            const { data: conversation } = await (supabase as any)
              .from('conversations')
              .select('*')
              .eq('id', payload.new.conversation_id)
              .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
              .single();

            if (conversation) {
              refetch();
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
            refetch();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    setupChannel();
  }, [user?.id, refetch]);

  const markAllAsRead = async () => {
    if (!user?.id || !unreadMessages) return;

    const messageIds = unreadMessages.map((msg: any) => msg.id);
    
    const supabase = await getSupabase();
    const { error } = await (supabase as any)
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