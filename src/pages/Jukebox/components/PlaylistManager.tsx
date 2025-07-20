import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton, EmptyState } from '@/components/common';
import { List, Plus, Music, User } from 'lucide-react';
import type { Playlist, Musique } from '@/services/jukeboxService';

interface PlaylistManagerProps {
  playlists: Playlist[];
  musiques: Musique[];
  loading: boolean;
  onRefresh: () => void;
}

export function PlaylistManager({ playlists, musiques, loading, onRefresh }: PlaylistManagerProps) {
  if (loading) {
    return <LoadingSkeleton count={4} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Mes Playlists</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Playlist
        </Button>
      </div>

      {playlists.length === 0 ? (
        <EmptyState
          icon={List}
          title="Aucune playlist"
          description="Créez votre première playlist pour organiser vos musiques."
        />
      ) : (
        <div className="grid gap-4">
          {playlists.map((playlist) => (
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
                      {(playlist as any).playlist_musiques?.length || 0} musiques
                    </Badge>
                    <Badge variant={playlist.is_public ? "default" : "outline"}>
                      {playlist.is_public ? "Publique" : "Privée"}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    Voir détails
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}