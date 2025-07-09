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
    <div className="p-3 bg-white border-t border-[#e8eaed]">
      <form onSubmit={onSendMessage} className="flex items-end space-x-2">
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" type="button" className="h-10 w-10 p-0 text-[#5f6368] hover:bg-[#f8f9fa] rounded-full">
            <span className="text-xl">😊</span>
          </Button>
        </div>
        <div className="flex-1 relative">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Message"
            disabled={sendMessagePending}
            className="rounded-[24px] border border-[#dadce0] bg-white px-4 py-2 text-[14px] min-h-[40px] focus-visible:ring-2 focus-visible:ring-[#1976d2] focus-visible:border-[#1976d2] resize-none"
          />
        </div>
        {newMessage.trim() ? (
          <Button
            type="submit"
            disabled={sendMessagePending}
            className="h-10 w-10 p-0 rounded-full bg-[#1976d2] hover:bg-[#1565c0] text-white"
          >
            <span className="text-lg">→</span>
          </Button>
        ) : (
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" type="button" className="h-10 w-10 p-0 text-[#5f6368] hover:bg-[#f8f9fa] rounded-full">
              <span className="text-xl">📎</span>
            </Button>
            <Button variant="ghost" size="sm" type="button" className="h-10 w-10 p-0 text-[#5f6368] hover:bg-[#f8f9fa] rounded-full">
              <span className="text-xl">📷</span>
            </Button>
            <Button variant="ghost" size="sm" type="button" className="h-10 w-10 p-0 text-[#5f6368] hover:bg-[#f8f9fa] rounded-full">
              <span className="text-xl">🎤</span>
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};