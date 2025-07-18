import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton, EmptyState } from '@/components/common';
import { Play, Plus, Search, Clock, User, Album } from 'lucide-react';
import { formatDuration } from '@/lib/formatters';
import { addToQueue } from '@/services/jukeboxService';
import { toast } from '@/hooks/use-toast';
import type { Musique, JukeboxSession } from '@/services/jukeboxService';

interface MusicLibraryProps {
  musiques: Musique[];
  loading: boolean;
  onRefresh: () => void;
  currentSession: JukeboxSession | null;
}

export function MusicLibrary({ musiques, loading, onRefresh, currentSession }: MusicLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");

  const filteredMusiques = musiques.filter(musique => {
    const matchesSearch = 
      musique.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      musique.artiste.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (musique.album && musique.album.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesGenre = !selectedGenre || musique.genre === selectedGenre;
    
    return matchesSearch && matchesGenre;
  });

  const genres = Array.from(new Set(musiques.map(m => m.genre).filter(Boolean)));

  const handleAddToQueue = async (musique: Musique) => {
    if (!currentSession) {
      toast({
        title: "Aucune session active",
        description: "Rejoignez ou créez une session pour ajouter de la musique.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addToQueue(currentSession.id, musique.id);
      toast({
        title: "Musique ajoutée",
        description: `"${musique.titre}" a été ajoutée à la file d'attente.`,
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout à la queue:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la musique à la file d'attente.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <LoadingSkeleton count={6} />;
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search size={20} />
            Recherche et Filtres
          </CardTitle>
        </CardHeader>
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
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Music List */}
      <div className="space-y-3">
        {filteredMusiques.length === 0 ? (
          <EmptyState
            icon={Album}
            title="Aucune musique trouvée"
            description="Essayez de modifier vos critères de recherche ou ajoutez de nouvelles musiques."
          />
        ) : (
          filteredMusiques.map((musique) => (
            <Card key={musique.id} className="hover:shadow-md transition-shadow">
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
                    
                    <div className="flex items-center justify-between">
                      <audio controls className="flex-1 max-w-md">
                        <source src={musique.file_url} type="audio/mpeg" />
                        Votre navigateur ne supporte pas l'audio.
                      </audio>
                      
                      <Button
                        onClick={() => handleAddToQueue(musique)}
                        disabled={!currentSession}
                        size="sm"
                        variant="outline"
                        className="ml-4"
                      >
                        <Plus size={16} />
                        {currentSession ? "Ajouter à la queue" : "Aucune session"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}