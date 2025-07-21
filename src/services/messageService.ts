import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Conversation = Tables<'conversations'>;
export type Message = Tables<'messages'>;
export type NewMessage = TablesInsert<'messages'>;

export const messageService = {
  // Get all conversations for current user
  async getConversations() {
    const currentUserId = (await supabase.auth.getUser()).data.user?.id;
    if (!currentUserId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        messages!messages_conversation_id_fkey (
          content,
          created_at,
          sender_id,
          read_at
        )
      `)
      .or(`participant1_id.eq.${currentUserId},participant2_id.eq.${currentUserId}`)
      .order('updated_at', { ascending: false })
      .limit(1, { referencedTable: 'messages' });

    if (error) throw error;
    return data;
  },

  // Get count of unread messages for current user
  async getUnreadCount() {
    const currentUserId = (await supabase.auth.getUser()).data.user?.id;
    if (!currentUserId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('messages')
      .select(`
        id,
        conversation_id,
        conversations!messages_conversation_id_fkey (
          participant1_id,
          participant2_id
        )
      `)
      .is('read_at', null)
      .neq('sender_id', currentUserId);

    if (error) throw error;

    // Filter messages from conversations where user participates
    const unreadMessages = data?.filter(message => {
      const conversation = message.conversations;
      return conversation && (
        conversation.participant1_id === currentUserId || 
        conversation.participant2_id === currentUserId
      );
    }) || [];

    return unreadMessages.length;
  },

  // Get messages for a specific conversation
  async getMessages(conversationId: string) {
    console.log('📥 [messageService] Getting messages for conversation:', conversationId);
    
    const currentUserId = (await supabase.auth.getUser()).data.user?.id;
    console.log('👤 [messageService] Current user ID:', currentUserId);
    
    if (!currentUserId) {
      console.error('❌ [messageService] User not authenticated');
      throw new Error('User not authenticated');
    }

    // First, check if user has access to this conversation
    console.log('🔍 [messageService] Checking conversation access...');
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('participant1_id, participant2_id')
      .eq('id', conversationId)
      .single();

    if (convError) {
      console.error('❌ [messageService] Error checking conversation:', convError);
      throw convError;
    }

    if (!conversation) {
      console.error('❌ [messageService] Conversation not found');
      throw new Error('Conversation not found');
    }

    const hasAccess = conversation.participant1_id === currentUserId || conversation.participant2_id === currentUserId;
    console.log('🔐 [messageService] User access to conversation:', hasAccess, 'participants:', conversation.participant1_id, conversation.participant2_id);

    if (!hasAccess) {
      console.error('❌ [messageService] User does not have access to this conversation');
      throw new Error('Access denied');
    }

    console.log('🔍 [messageService] Querying messages table...');
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ [messageService] Error fetching messages:', error);
      throw error;
    }
    
    console.log('✅ [messageService] Messages fetched successfully for conversation', conversationId, ':', data?.length, 'messages');
    console.log('📋 [messageService] Messages data:', data);
    return data || [];
  },

  // Create or get existing conversation between two users
  async getOrCreateConversation(otherUserId: string) {
    const currentUserId = (await supabase.auth.getUser()).data.user?.id;
    if (!currentUserId) throw new Error('User not authenticated');

    // Try to find existing conversation
    const { data: existing } = await supabase
      .from('conversations')
      .select('*')
      .or(`and(participant1_id.eq.${currentUserId},participant2_id.eq.${otherUserId}),and(participant1_id.eq.${otherUserId},participant2_id.eq.${currentUserId})`)
      .single();

    if (existing) return existing;

    // Create new conversation
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        participant1_id: currentUserId,
        participant2_id: otherUserId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Send a message
  async sendMessage(conversationId: string, content: string) {
    const currentUserId = (await supabase.auth.getUser()).data.user?.id;
    if (!currentUserId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: currentUserId,
        content
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Mark message as read
  async markAsRead(messageId: string) {
    const { error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('id', messageId);

    if (error) throw error;
  },

  // Mark all messages in a conversation as read for current user
  async markConversationAsRead(conversationId: string) {
    const currentUserId = (await supabase.auth.getUser()).data.user?.id;
    if (!currentUserId) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .neq('sender_id', currentUserId)
      .is('read_at', null);

    if (error) throw error;
  },

  // Delete a message
  async deleteMessage(messageId: string) {
    const currentUserId = (await supabase.auth.getUser()).data.user?.id;
    if (!currentUserId) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId)
      .eq('sender_id', currentUserId); // Only allow users to delete their own messages

    if (error) throw error;
  },

  // Edit a message
  async editMessage(messageId: string, newContent: string) {
    const currentUserId = (await supabase.auth.getUser()).data.user?.id;
    if (!currentUserId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('messages')
      .update({ content: newContent })
      .eq('id', messageId)
      .eq('sender_id', currentUserId) // Only allow users to edit their own messages
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a conversation
  async deleteConversation(conversationId: string) {
    const currentUserId = (await supabase.auth.getUser()).data.user?.id;
    if (!currentUserId) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId)
      .or(`participant1_id.eq.${currentUserId},participant2_id.eq.${currentUserId}`);

    if (error) throw error;
  },

  // Subscribe to new messages in a conversation
  subscribeToMessages(conversationId: string, onMessage: (message: Message) => void) {
    return supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => onMessage(payload.new as Message)
      )
      .subscribe();
  }
};