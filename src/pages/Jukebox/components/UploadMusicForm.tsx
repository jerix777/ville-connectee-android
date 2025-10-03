import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Upload, Music } from 'lucide-react';
import { uploadMusic } from '@/services/jukeboxService';
import { toast } from '@/hooks/use-toast';
import type { Musique, MusiqueInsert } from '@/services/jukeboxService';

interface UploadMusicFormProps {
  onClose: () => void;
  onSuccess: (musique: Musique) => void;
}

export function UploadMusicForm({ onClose, onSuccess }: UploadMusicFormProps) {
  const [formData, setFormData] = useState<Partial<MusiqueInsert>>({
    titre: '',
    artiste: '',
    album: '',
    genre: '',
    annee: undefined,
    duree: undefined,
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !formData.titre || !formData.artiste) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires et sélectionner un fichier.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      setProgress(10);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const newMusic = await uploadMusic(formData as any, file) as unknown as Musique;
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        onSuccess(newMusic);
        resetForm();
        setUploading(false);
        setProgress(0);
      }, 500);
      
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'uploader la musique. Vérifiez le format du fichier.",
        variant: "destructive",
      });
      setUploading(false);
      setProgress(0);
    }
  };

  const resetForm = () => {
    setFormData({
      titre: '',
      artiste: '',
      album: '',
      genre: '',
      annee: undefined,
      duree: undefined,
    });
    setFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file type
      if (!selectedFile.type.startsWith('audio/')) {
        toast({
          title: "Format invalide",
          description: "Veuillez sélectionner un fichier audio valide.",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      
      // Try to extract metadata
      if (selectedFile.name) {
        const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
        if (!formData.titre) {
          setFormData(prev => ({ ...prev, titre: nameWithoutExt }));
        }
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="w-5 h-5" />
          Ajouter une Musique
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file">Fichier Audio *</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="flex-1"
              />
            </div>
            {file && (
              <p className="text-sm text-muted-foreground">
                Fichier: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titre">Titre *</Label>
              <Input
                id="titre"
                value={formData.titre || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, titre: e.target.value }))}
                placeholder="Titre de la chanson"
                disabled={uploading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="artiste">Artiste *</Label>
              <Input
                id="artiste"
                value={formData.artiste || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, artiste: e.target.value }))}
                placeholder="Nom de l'artiste"
                disabled={uploading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="album">Album</Label>
              <Input
                id="album"
                value={formData.album || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, album: e.target.value }))}
                placeholder="Nom de l'album"
                disabled={uploading}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="genre">Genre</Label>
                <Input
                  id="genre"
                  value={formData.genre || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                  placeholder="Rock, Pop, etc."
                  disabled={uploading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="annee">Année</Label>
                <Input
                  id="annee"
                  type="number"
                  value={formData.annee || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    annee: e.target.value ? parseInt(e.target.value) : undefined 
                  }))}
                  placeholder="2024"
                  disabled={uploading}
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-center text-muted-foreground">
                Upload en cours... {progress}%
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={uploading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="secondary"
              disabled={uploading || !file || !formData.titre || !formData.artiste}
            >
              {uploading ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-spin" />
                  Upload en cours...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Uploader
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
