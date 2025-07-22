import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MessageView } from '../MessageView';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ConversationModalProps {
  conversationId: string | null;
  onClose: () => void;
}

export const ConversationModal: React.FC<ConversationModalProps> = ({ conversationId, onClose }) => {
  if (!conversationId) return null;

  return (
    <Dialog open={!!conversationId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={onClose} className="mr-2 lg:hidden">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <DialogTitle>Conversation</DialogTitle>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <MessageView conversationId={conversationId} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
