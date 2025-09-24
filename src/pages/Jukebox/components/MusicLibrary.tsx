import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState, LoadingSkeleton } from "@/components/common";
import { Album, Clock, Plus, Search, User } from "lucide-react";
import { formatDuration } from "@/lib/formatters";
import { AddToPlaylistDialog } from "./AddToPlaylistDialog";
import type { Musique, Playlist } from "@/services/jukeboxService";

interface MusicLibraryProps {
  musiques: Musique[];
  playlists: Playlist[];
  loading: boolean;
  onRefresh: () => void;
}

export function MusicLibrary(
  { musiques, playlists, loading, onRefresh }: MusicLibraryProps,
) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedMusique, setSelectedMusique] = useState<Musique | null>(null);

  const filteredMusiques = musiques.filter((musique) => {
    const matchesSearch =
      musique.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      musique.artiste.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (musique.album &&
        musique.album.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesGenre = !selectedGenre || musique.genre === selectedGenre;

    return matchesSearch && matchesGenre;
  });

  const genres = Array.from(
    new Set(musiques.map((m) => m.genre).filter(Boolean)),
  );

  if (loading) {
    return <LoadingSkeleton count={6} />;
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <Card>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher par titre, artiste ou album..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-3 py-2 border rounded-md min-w-[150px]"
            >
              <option value="">Tous les genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Music List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredMusiques.length === 0
          ? (
            <EmptyState
              icon={Album}
              title="Aucune musique trouvée"
              description="Essayez de modifier vos critères de recherche ou ajoutez de nouvelles musiques."
            />
          )
          : (
            filteredMusiques.map((musique) => (
              <Card
                key={musique.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate">
                            {musique.titre}
                          </h3>
                          <div className="flex items-center gap-4 text-muted-foreground text-sm">
                            <span className="flex items-center gap-1">
                              <User size={14} />
                              {musique.artiste}
                            </span>
                            {musique.album && (
                              <span className="flex items-center gap-1">
                                <Album size={14} />
                                {musique.album}
                              </span>
                            )}
                            {musique.duree && (
                              <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {formatDuration(musique.duree)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          {musique.genre && (
                            <Badge variant="secondary">{musique.genre}</Badge>
                          )}
                          {musique.annee && (
                            <Badge variant="outline">{musique.annee}</Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <audio
                          controls
                          src={musique.file_url}
                          className="w-full max-w-xs"
                        >
                          Votre navigateur ne supporte pas l'élément audio.
                        </audio>
                        <Button
                          onClick={() => setSelectedMusique(musique)}
                          size="sm"
                          variant="outline"
                        >
                          <Plus size={16} className="mr-2" />
                          Ajouter à une playlist
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
      </div>
      <AddToPlaylistDialog
        musique={selectedMusique}
        playlists={playlists}
        open={!!selectedMusique}
        onOpenChange={() => setSelectedMusique(null)}
        onSuccess={onRefresh}
      />
    </div>
  );
}
