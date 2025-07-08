import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  sendMessagePending: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  setNewMessage,
  onSendMessage,
  onKeyPress,
  sendMessagePending
}) => {
  return (
    <div className="p-4 border-t bg-background">
      <form onSubmit={onSendMessage} className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" type="button">
          <span className="text-xl">😊</span>
        </Button>
        <Button variant="ghost" size="sm" type="button">
          <span className="text-xl">📎</span>
        </Button>
        <Button variant="ghost" size="sm" type="button">
          <span className="text-xl">🖼️</span>
        </Button>
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Saisir un message"
          disabled={sendMessagePending}
          className="flex-1 rounded-full bg-muted/30 border-0 focus-visible:ring-1"
        />
        <Button
          type="submit"
          disabled={!newMessage.trim() || sendMessagePending}
          variant="ghost"
          size="sm"
          className="rounded-full"
        >
          <span className="text-xl">➤</span>
        </Button>
      </form>
    </div>
  );
};