import React, { useRef, useEffect } from 'react';
import { Message } from '@/services/messageService';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: Message[] | undefined;
  isLoading: boolean;
  currentUserId: string | undefined;
  editingMessageId: string | null;
  editingContent: string;
  setEditingContent: (content: string) => void;
  onEditMessage: (message: Message) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDeleteMessage: (messageId: string) => void;
  editMessagePending: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  currentUserId,
  editingMessageId,
  editingContent,
  setEditingContent,
  onEditMessage,
  onSaveEdit,
  onCancelEdit,
  onDeleteMessage,
  editMessagePending
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  console.log('MessageList: messages=', messages, 'isLoading=', isLoading, 'messages.length=', messages?.length);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto py-2 bg-white">
        <div className="text-center py-8">
          <p className="text-[#5f6368]">Chargement des messages...</p>
        </div>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto py-2 bg-white">
        <div className="text-center py-8">
          <p className="text-[#5f6368]">Aucun message dans cette conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto py-2 bg-white">
      {messages.map((message) => {
        const isOwnMessage = message.sender_id === currentUserId;
        const isEditing = editingMessageId === message.id;
        
        return (
          <MessageBubble
            key={message.id}
            message={message}
            isOwnMessage={isOwnMessage}
            isEditing={isEditing}
            editingContent={editingContent}
            setEditingContent={setEditingContent}
            onEditMessage={onEditMessage}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
            onDeleteMessage={onDeleteMessage}
            editMessagePending={editMessagePending}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};