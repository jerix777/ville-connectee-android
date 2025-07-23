import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton, EmptyState } from '@/components/common';
import { List, Plus, Music, User, Radio } from 'lucide-react';
import { CreatePlaylistForm } from './CreatePlaylistForm';
import { PlaylistDetails } from './PlaylistDetails';
import { addPlaylistToQueue } from '@/services/jukeboxService';
import { toast } from '@/hooks/use-toast';
import type { Playlist as BasePlaylist, Musique, JukeboxSession } from '@/services/jukeboxService';

interface Playlist extends BasePlaylist {
  playlist_musiques: {
    id: string;
    position: number;
    musiques: Musique;
  }[];
}

interface PlaylistManagerProps {
  playlists: Playlist[];
  musiques: Musique[];
  loading: boolean;
  onRefresh: () => void;
  currentSession: JukeboxSession | null;
}

export function PlaylistManager({ playlists, musiques, loading, onRefresh, currentSession }: PlaylistManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [localPlaylists, setLocalPlaylists] = useState(playlists);

  const handleAddPlaylistToQueue = async (playlistId: string) => {
    if (!currentSession) {
      toast({
        title: 'Aucune session active',
        description: 'Veuillez rejoindre ou créer une session pour y ajouter une playlist.',
        variant: 'destructive',
      });
      return;
    }
    try {
      const result = await addPlaylistToQueue(playlistId, currentSession.id);
      toast({
        title: 'Playlist ajoutée',
        description: `${result.count} musiques ont été ajoutées à la file d'attente.`,
      });
      onRefresh();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la playlist à la queue:", error);
      toast({
        title: 'Erreur',
        description: "Impossible d'ajouter la playlist.",
        variant: 'destructive',
      });
    }
  };

  React.useEffect(() => {
    setLocalPlaylists(playlists);
  }, [playlists]);

  const handlePlaylistCreated = (newPlaylist: BasePlaylist) => {
    // Assuming the newPlaylist object has the correct structure
    const formattedPlaylist = {
      ...newPlaylist,
      playlist_musiques: [], // Initialize with empty musiques
    };
    setLocalPlaylists(prev => [formattedPlaylist, ...prev]);
    onRefresh(); // Or just update state locally
  };

  if (loading) {
    return <LoadingSkeleton count={4} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Mes Playlists</h2>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Playlist
        </Button>
      </div>

      {localPlaylists.length === 0 ? (
        <EmptyState
          icon={List}
          title="Aucune playlist"
          description="Créez votre première playlist pour organiser vos musiques."
        />
      ) : (
        <div className="grid gap-4">
          {localPlaylists.map((playlist) => (
            <Card key={playlist.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <List className="w-5 h-5" />
                  {playlist.nom}
                </CardTitle>
                {playlist.description && (
                  <CardDescription>{playlist.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      <Music className="w-3 h-3 mr-1" />
                      {playlist.playlist_musiques?.length || 0} musiques
                    </Badge>
                    <Badge variant={playlist.is_public ? "default" : "outline"}>
                      {playlist.is_public ? "Publique" : "Privée"}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddPlaylistToQueue(playlist.id)}
                      disabled={!currentSession || playlist.playlist_musiques.length === 0}
                    >
                      <Radio className="w-4 h-4 mr-2" />
                      Ajouter à la session
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSelectedPlaylist(playlist)}>
                      Voir détails
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreatePlaylistForm
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        onSuccess={handlePlaylistCreated}
      />

      <PlaylistDetails
        playlist={selectedPlaylist}
        allMusiques={musiques}
        open={!!selectedPlaylist}
        onOpenChange={() => setSelectedPlaylist(null)}
        onPlaylistUpdate={() => {
          onRefresh();
          // Close the modal after an update
          setSelectedPlaylist(null);
        }}
      />
    </div>
  );
}
