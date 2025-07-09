import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Paperclip, Image, File } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File, type: 'image' | 'document') => void;
  className?: string;
  acceptImages?: boolean;
  acceptDocuments?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  className = "",
  acceptImages = true,
  acceptDocuments = true
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier la taille du fichier (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "Le fichier ne doit pas dépasser 10MB",
        variant: "destructive"
      });
      return;
    }

    // Déterminer le type de fichier
    const isImage = file.type.startsWith('image/');
    const isDocument = !isImage;

    if (isImage && !acceptImages) {
      toast({
        title: "Type de fichier non autorisé",
        description: "Les images ne sont pas autorisées",
        variant: "destructive"
      });
      return;
    }

    if (isDocument && !acceptDocuments) {
      toast({
        title: "Type de fichier non autorisé",
        description: "Les documents ne sont pas autorisés",
        variant: "destructive"
      });
      return;
    }

    onFileSelect(file, isImage ? 'image' : 'document');
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getAcceptTypes = () => {
    const types = [];
    if (acceptImages) types.push('image/*');
    if (acceptDocuments) types.push('.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx');
    return types.join(',');
  };

  const getIcon = () => {
    if (acceptImages && acceptDocuments) return <Paperclip className="w-4 h-4" />;
    if (acceptImages) return <Image className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        type="button" 
        onClick={handleButtonClick}
        className={`h-8 w-8 sm:h-10 sm:w-10 p-0 text-[#5f6368] hover:bg-[#f8f9fa] rounded-full ${className}`}
      >
        {getIcon()}
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptTypes()}
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
};