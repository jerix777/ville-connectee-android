import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from '@/components/common';
import { Play, Pause, SkipForward, Radio, Music, Users, Clock } from 'lucide-react';
import { getSessionQueue, updateSessionState } from '@/services/jukeboxService';
import { formatDuration } from '@/lib/formatters';
import { toast } from '@/hooks/use-toast';
import type { JukeboxSession, Musique } from '@/services/jukeboxService';

interface QueueItem {
  id: string;
  musiques: Musique;
  users_profiles: {
    nom: string;
    prenom: string;
  } | null | { error: boolean };
}

interface JukeboxPlayerProps {
  session: JukeboxSession | null;
  musiques: Musique[];
  onSessionUpdate: () => void;
}

export function JukeboxPlayer({ session, musiques, onSessionUpdate }: JukeboxPlayerProps) {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const loadQueue = async () => {
    if (!session) return;
    
    try {
      setLoading(true);
      const queueData = await getSessionQueue(session.id);
      setQueue(queueData as unknown as QueueItem[]);
    } catch (error) {
      console.error('Erreur lors du chargement de la queue:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadQueue();
      setIsPlaying(session.is_playing || false);
    }
  }, [session]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Erreur de lecture audio:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handlePlayPause = async () => {
    if (!session) return;

    try {
      const newPlayingState = !isPlaying;
      await updateSessionState(session.id, { is_playing: newPlayingState });
      setIsPlaying(newPlayingState);
      
      toast({
        title: newPlayingState ? "Lecture démarrée" : "Lecture mise en pause",
        description: `La session "${session.nom}" est maintenant ${newPlayingState ? "en cours" : "en pause"}.`,
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'état de lecture.",
        variant: "destructive",
      });
    }
  };

  const handleNext = async () => {
    if (!session || queue.length === 0) return;

    try {
      const nextTrack = queue[0];
      await updateSessionState(session.id, { 
        current_musique_id: nextTrack.musiques.id,
        current_position: 0
      });
      
      // Refresh queue and session data
      await loadQueue();
      onSessionUpdate();
      
      toast({
        title: "Piste suivante",
        description: `Lecture de "${nextTrack.musiques.titre}".`,
      });
    } catch (error) {
      console.error('Erreur lors du passage à la piste suivante:', error);
      toast({
        title: "Erreur",
        description: "Impossible de passer à la piste suivante.",
        variant: "destructive",
      });
    }
  };

  if (!session) {
    return (
      <EmptyState
        icon={Radio}
        title="Aucune session active"
        description="Rejoignez ou créez une session pour commencer à écouter de la musique ensemble."
      />
    );
  }

  const currentTrack = session.current_musique_id 
    ? musiques.find(m => m.id === session.current_musique_id)
    : null;

  return (
    <div className="space-y-6">
      {/* Current Track */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="w-5 h-5" />
            Lecture en Cours
          </CardTitle>
          <CardDescription>Session: {session.nom}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentTrack ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{currentTrack.titre}</h3>
                  <p className="text-muted-foreground">{currentTrack.artiste}</p>
                  {currentTrack.album && (
                    <p className="text-sm text-muted-foreground">{currentTrack.album}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {currentTrack.duree && (
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDuration(currentTrack.duree)}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  onClick={handlePlayPause}
                  size="lg"
                  className="flex items-center gap-2"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                  {isPlaying ? "Pause" : "Play"}
                </Button>
                
                <Button
                  onClick={handleNext}
                  variant="outline"
                  disabled={queue.length === 0}
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              <audio
                ref={audioRef}
                src={currentTrack.file_url}
                onEnded={handleNext}
                onTimeUpdate={() => {
                  if (audioRef.current) {
                    setCurrentTime(audioRef.current.currentTime);
                  }
                }}
                className="w-full"
              >
                Votre navigateur ne supporte pas l'élément audio.
              </audio>
            </div>
          ) : (
            <EmptyState
              icon={Music}
              title="Aucune musique sélectionnée"
              description="Ajoutez des musiques à la file d'attente pour commencer."
            />
          )}
        </CardContent>
      </Card>

      {/* Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            File d'Attente
            <Badge variant="secondary">{queue.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {queue.length === 0 ? (
            <EmptyState
              icon={Music}
              title="File d'attente vide"
              description="Ajoutez des musiques depuis la bibliothèque pour les écouter."
            />
          ) : (
            <div className="space-y-3">
              {queue.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{index + 1}</Badge>
                    <div>
                      <h4 className="font-medium">{item.musiques.titre}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.musiques.artiste}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-3 h-3" />
                    {item.users_profiles && 'nom' in item.users_profiles ? `${item.users_profiles.nom} ${item.users_profiles.prenom}` : 'Utilisateur'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
