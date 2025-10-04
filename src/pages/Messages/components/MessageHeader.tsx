import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface MessageHeaderProps {
  conversationId: string;
}

export const MessageHeader: React.FC<MessageHeaderProps> = ({ conversationId }) => {
  const { user } = useAuth();

  const { data: conversation } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('conversations')
        .select('participant1_id, participant2_id')
        .eq('id', conversationId)
        .single();
      
      if (error) throw error;
      return data as any;
    },
    enabled: !!conversationId
  });

  const otherParticipantId = conversation 
    ? (conversation.participant1_id === user?.id ? conversation.participant2_id : conversation.participant1_id)
    : null;

  const { data: otherParticipant } = useQuery({
    queryKey: ['user-profile', otherParticipantId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('users_profiles')
        .select('nom, prenom')
        .eq('user_id', otherParticipantId)
        .single();
      
      if (error) throw error;
      return data as any;
    },
    enabled: !!otherParticipantId
  });

  const displayName = otherParticipant 
    ? `${otherParticipant.prenom || ''} ${otherParticipant.nom || ''}`.trim() || 'Utilisateur'
    : 'Chargement...';
  
  const initials = otherParticipant 
    ? `${otherParticipant.prenom?.[0] || ''}${otherParticipant.nom?.[0] || ''}`.toUpperCase() || 'U'
    : 'U';

  return (
    <div className="px-4 py-3 border-b border-[#e8eaed] bg-white shadow-sm">
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          <div className="w-full h-full bg-[#1976d2] flex items-center justify-center">
            <span className="text-white font-medium text-sm">{initials}</span>
          </div>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-[16px] font-medium text-[#202124]">{displayName}</h3>
          <p className="text-[12px] text-[#5f6368]">Actif maintenant</p>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 text-[#5f6368] hover:bg-[#f8f9fa] rounded-full">
            <span className="text-lg">📞</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 text-[#5f6368] hover:bg-[#f8f9fa] rounded-full">
            <span className="text-lg">📹</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 text-[#5f6368] hover:bg-[#f8f9fa] rounded-full">
            <span className="text-lg">ℹ️</span>
          </Button>
        </div>
      </div>
    </div>
  );
};