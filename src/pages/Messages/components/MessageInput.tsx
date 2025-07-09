import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { EmojiPicker } from './EmojiPicker';
import { FileUpload } from './FileUpload';
import { VoiceRecorder } from './VoiceRecorder';
import { CameraCapture } from './CameraCapture';

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  sendMessagePending: boolean;
  onFileAttach?: (file: File, type: 'image' | 'document') => void;
  onVoiceMessage?: (audioBlob: Blob) => void;
  onPhotoCapture?: (photoBlob: Blob) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  setNewMessage,
  onSendMessage,
  onKeyPress,
  sendMessagePending,
  onFileAttach,
  onVoiceMessage,
  onPhotoCapture
}) => {
  const [attachedFiles, setAttachedFiles] = useState<Array<{file: File, type: 'image' | 'document', preview?: string}>>([]);

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(newMessage + emoji);
  };

  const handleFileSelect = (file: File, type: 'image' | 'document') => {
    if (onFileAttach) {
      onFileAttach(file, type);
    }
    
    // Créer un aperçu pour les images
    if (type === 'image') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        setAttachedFiles(prev => [...prev, { file, type, preview }]);
      };
      reader.readAsDataURL(file);
    } else {
      setAttachedFiles(prev => [...prev, { file, type }]);
    }

    toast({
      title: "Fichier attaché",
      description: `${file.name} a été ajouté au message`
    });
  };

  const handleVoiceRecord = (audioBlob: Blob) => {
    if (onVoiceMessage) {
      onVoiceMessage(audioBlob);
    }
    toast({
      title: "Message vocal",
      description: "L'enregistrement audio a été ajouté au message"
    });
  };

  const handlePhotoCapture = (photoBlob: Blob) => {
    if (onPhotoCapture) {
      onPhotoCapture(photoBlob);
    }
    // Créer un aperçu de la photo
    const photoUrl = URL.createObjectURL(photoBlob);
    const photoFile = new File([photoBlob], 'photo.jpg', { type: 'image/jpeg' });
    setAttachedFiles(prev => [...prev, { file: photoFile, type: 'image', preview: photoUrl }]);
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles(prev => {
      const newFiles = [...prev];
      const removed = newFiles.splice(index, 1)[0];
      if (removed.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      return newFiles;
    });
  };
  return (
    <div className="p-2 sm:p-3 bg-white border-t border-[#e8eaed] safe-area-bottom">
      {/* Aperçu des fichiers attachés */}
      {attachedFiles.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachedFiles.map((item, index) => (
            <div key={index} className="relative bg-gray-100 rounded-lg p-2 max-w-32">
              {item.type === 'image' && item.preview ? (
                <img src={item.preview} alt="Aperçu" className="w-16 h-16 object-cover rounded" />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-center">
                  {item.file.name}
                </div>
              )}
              <button
                type="button"
                onClick={() => removeAttachment(index)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={onSendMessage} className="flex items-end gap-1 sm:gap-2">
        <div className="hidden sm:flex items-center space-x-1">
          <EmojiPicker onEmojiSelect={handleEmojiSelect} />
        </div>
        <div className="flex-1 relative">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Tapez votre message..."
            disabled={sendMessagePending}
            className="rounded-[20px] sm:rounded-[24px] border border-[#dadce0] bg-white px-3 sm:px-4 py-2 text-sm min-h-[36px] sm:min-h-[40px] focus-visible:ring-2 focus-visible:ring-[#1976d2] focus-visible:border-[#1976d2] resize-none"
          />
        </div>
        {newMessage.trim() || attachedFiles.length > 0 ? (
          <Button
            type="submit"
            disabled={sendMessagePending}
            className="h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-full bg-[#1976d2] hover:bg-[#1565c0] text-white flex-shrink-0"
          >
            <span className="text-base sm:text-lg">→</span>
          </Button>
        ) : (
          <div className="flex items-center gap-1">
            <EmojiPicker onEmojiSelect={handleEmojiSelect} className="sm:hidden" />
            <FileUpload onFileSelect={handleFileSelect} />
            <CameraCapture onPhotoCapture={handlePhotoCapture} className="hidden sm:flex" />
            <VoiceRecorder onRecordingComplete={handleVoiceRecord} className="hidden sm:flex" />
          </div>
        )}
      </form>
    </div>
  );
};