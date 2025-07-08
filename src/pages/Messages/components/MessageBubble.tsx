import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Message } from '@/services/messageService';
import { cn } from '@/lib/utils';
import { Edit, Trash, MoreVertical } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  isEditing: boolean;
  editingContent: string;
  setEditingContent: (content: string) => void;
  onEditMessage: (message: Message) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDeleteMessage: (messageId: string) => void;
  editMessagePending: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  isEditing,
  editingContent,
  setEditingContent,
  onEditMessage,
  onSaveEdit,
  onCancelEdit,
  onDeleteMessage,
  editMessagePending
}) => {
  return (
    <div
      className={cn(
        "flex group mb-2",
        isOwnMessage ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-3 relative shadow-sm",
          isOwnMessage
            ? "bg-purple-500 text-white rounded-br-md"
            : "bg-white border rounded-bl-md"
        )}
      >
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              className="text-sm"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onSaveEdit();
                } else if (e.key === 'Escape') {
                  onCancelEdit();
                }
              }}
            />
            <div className="flex space-x-2">
              <Button size="sm" onClick={onSaveEdit} disabled={editMessagePending}>
                Sauvegarder
              </Button>
              <Button size="sm" variant="outline" onClick={onCancelEdit}>
                Annuler
              </Button>
            </div>
          </div>
        ) : (
          <p className={cn("text-sm", isOwnMessage ? "text-white" : "text-gray-800")}>
            {message.content}
          </p>
        )}

        {/* Menu d'actions pour les messages de l'utilisateur */}
        {isOwnMessage && !isEditing && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-white hover:bg-white/20"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEditMessage(message)}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash className="h-4 w-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer le message</AlertDialogTitle>
                    <AlertDialogDescription>
                      Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => onDeleteMessage(message.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};