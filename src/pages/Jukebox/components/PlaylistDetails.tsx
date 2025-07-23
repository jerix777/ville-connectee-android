import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common';
import { Music, Trash2, Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { addToPlaylist, removeFromPlaylist } from '@/services/jukeboxService';
import { toast } from '@/hooks/use-toast';
import type { Playlist as BasePlaylist, Musique } from '@/services/jukeboxService';

interface Playlist extends BasePlaylist {
  playlist_musiques: {
    id: string;
    position: number;
    musiques: Musique;
  }[];
}

interface PlaylistDetailsProps {
  playlist: Playlist | null;
  allMusiques: Musique[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlaylistUpdate: () => void;
}

export function PlaylistDetails({ playlist, allMusiques, open, onOpenChange, onPlaylistUpdate }: PlaylistDetailsProps) {
  const [musiques, setMusiques] = useState(playlist?.playlist_musiques || []);

  React.useEffect(() => {
    setMusiques(playlist?.playlist_musiques || []);
  }, [playlist]);

  if (!playlist) return null;

  const handleAddMusic = async (musiqueId: string) => {
    try {
      await addToPlaylist(playlist.id, musiqueId);
      toast({ title: "Musique ajoutée", description: "La musique a été ajoutée à la playlist." });
      onPlaylistUpdate();
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      toast({ title: "Erreur", description: "Impossible d'ajouter la musique.", variant: "destructive" });
    }
  };

  const handleRemoveMusic = async (playlistMusiqueId: string) => {
    try {
      // The ID to pass is the one from the playlist_musiques join table
      const itemToRemove = musiques.find(pm => pm.id === playlistMusiqueId);
      if (!itemToRemove) return;

      await removeFromPlaylist(itemToRemove.id);
      toast({ title: "Musique retirée", description: "La musique a été retirée de la playlist." });
      
      // Optimistic update
      setMusiques(currentMusiques => currentMusiques.filter(m => m.id !== playlistMusiqueId));
      
      onPlaylistUpdate(); // To refetch data from parent
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({ title: "Erreur", description: "Impossible de retirer la musique.", variant: "destructive" });
    }
  };

  const availableMusiques = allMusiques.filter(
    (m) => !musiques.some((pm) => pm.musiques.id === m.id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{playlist.nom}</DialogTitle>
          <DialogDescription>{playlist.description}</DialogDescription>
        </DialogHeader>
        
        <div className="my-4">
          <h3 className="text-lg font-semibold mb-2">Musiques ({musiques.length})</h3>
          <ScrollArea className="h-64">
            {musiques.length === 0 ? (
              <EmptyState icon={Music} title="Playlist vide" description="Ajoutez des musiques à cette playlist." />
            ) : (
              <div className="space-y-2">
                {musiques.map((pm) => (
                  <div key={pm.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <p className="font-medium">{pm.musiques.titre}</p>
                      <p className="text-sm text-muted-foreground">{pm.musiques.artiste}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveMusic(pm.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une musique
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Rechercher une musique..." />
                <CommandList>
                  <CommandEmpty>Aucune musique trouvée.</CommandEmpty>
                  <CommandGroup>
                    {availableMusiques.map((musique) => (
                      <CommandItem
                        key={musique.id}
                        onSelect={() => handleAddMusic(musique.id)}
                      >
                        {musique.titre} - {musique.artiste}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Button onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
