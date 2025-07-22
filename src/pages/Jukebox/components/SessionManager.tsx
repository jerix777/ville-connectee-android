import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton, EmptyState } from '@/components/common';
import { Users, Radio, Play, Pause } from 'lucide-react';
import { joinSession } from '@/services/jukeboxService';
import { toast } from '@/hooks/use-toast';
import type { JukeboxSession as BaseJukeboxSession, Musique } from '@/services/jukeboxService';

interface JukeboxSession extends BaseJukeboxSession {
  session_participants: { count: number }[];
  musiques: Musique | null;
}

interface SessionManagerProps {
  sessions: JukeboxSession[];
  loading: boolean;
  onRefresh: () => void;
  onJoinSession: (session: JukeboxSession) => void;
}

export function SessionManager({ sessions, loading, onRefresh, onJoinSession }: SessionManagerProps) {
  const handleJoinSession = async (session: JukeboxSession) => {
    try {
      await joinSession(session.id);
      onJoinSession(session);
    } catch (error) {
      console.error('Erreur lors de la connexion à la session:', error);
      toast({
        title: "Erreur",
        description: "Impossible de rejoindre la session.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <LoadingSkeleton count={4} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Sessions Actives</h2>
        <Button onClick={onRefresh} variant="outline">
          Actualiser
        </Button>
      </div>

      {sessions.length === 0 ? (
        <EmptyState
          icon={Radio}
          title="Aucune session active"
          description="Créez une nouvelle session ou attendez qu'une session soit créée."
        />
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <Card key={session.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="w-5 h-5" />
                  {session.nom}
                </CardTitle>
                {session.description && (
                  <CardDescription>{session.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {session.session_participants?.[0]?.count || 0} participants
                    </Badge>
                    
                    <Badge variant={session.is_playing ? "default" : "secondary"}>
                      {session.is_playing ? (
                        <>
                          <Play className="w-3 h-3 mr-1" />
                          En cours
                        </>
                      ) : (
                        <>
                          <Pause className="w-3 h-3 mr-1" />
                          En pause
                        </>
                      )}
                    </Badge>

                    {session.musiques && (
                      <Badge variant="outline">
                        🎵 {session.musiques.titre}
                      </Badge>
                    )}
                  </div>

                  <Button
                    onClick={() => handleJoinSession(session)}
                    size="sm"
                  >
                    Rejoindre
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
