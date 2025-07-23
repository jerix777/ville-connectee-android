import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { addToPlaylist } from '@/services/jukeboxService';
import type { Musique, Playlist } from '@/services/jukeboxService';
import { List } from 'lucide-react';

interface AddToPlaylistDialogProps {
  musique: Musique | null;
  playlists: Playlist[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddToPlaylistDialog({
  musique,
  playlists,
  open,
  onOpenChange,
  onSuccess,
}: AddToPlaylistDialogProps) {
  if (!musique) return null;

  const handleSelectPlaylist = async (playlistId: string) => {
    try {
      await addToPlaylist(playlistId, musique.id);
      toast({
        title: 'Succès',
        description: `"${musique.titre}" a été ajoutée à la playlist.`,
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout à la playlist:", error);
      toast({
        title: 'Erreur',
        description: "Impossible d'ajouter la musique à la playlist.",
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter "{musique.titre}" à une playlist</DialogTitle>
          <DialogDescription>
            Sélectionnez la playlist dans laquelle vous souhaitez ajouter cette musique.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-64 mt-4">
          <div className="space-y-2">
            {playlists.length > 0 ? (
              playlists.map((playlist) => (
                <Button
                  key={playlist.id}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleSelectPlaylist(playlist.id)}
                >
                  <List className="mr-2 h-4 w-4" />
                  {playlist.nom}
                </Button>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Vous n'avez aucune playlist. Créez-en une d'abord.
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
