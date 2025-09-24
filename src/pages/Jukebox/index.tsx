import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Plus, Users, Radio, Upload, List } from 'lucide-react';
import { PageLayout } from '@/components/common/PageLayout';
import { toast } from '@/hooks/use-toast';
import { MusicLibrary } from './components/MusicLibrary';
import { PlaylistManager } from './components/PlaylistManager';
import { JukeboxPlayer } from './components/JukeboxPlayer';
import { SessionManager } from './components/SessionManager';
import { UploadMusicForm } from './components/UploadMusicForm';
import { CreateSessionForm } from './components/CreateSessionForm';
import { getMusicList, getPlaylists, getActiveSessions } from '@/services/jukeboxService';
import type { Musique, Playlist as BasePlaylist, JukeboxSession as BaseJukeboxSession } from '@/services/jukeboxService';

interface Playlist extends BasePlaylist {
  playlist_musiques: {
    id: string;
    position: number;
    musiques: Musique;
  }[];
}

interface JukeboxSession extends BaseJukeboxSession {
  session_participants: { count: number }[];
  musiques: Musique | null;
}

export function JukeboxPage() {
  const [activeTab, setActiveTab] = useState("library");
  const [activeViewTab, setActiveViewTab] = useState("liste");
  const [musiques, setMusiques] = useState<Musique[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [sessions, setSessions] = useState<JukeboxSession[]>([]);
  const [currentSession, setCurrentSession] = useState<JukeboxSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [musicsData, playlistsData, sessionsData] = await Promise.all([
        getMusicList(),
        getPlaylists(),
        getActiveSessions()
      ]);
      
      setMusiques(musicsData as Musique[]);
      setPlaylists(playlistsData as unknown as Playlist[]);
      setSessions(sessionsData as unknown as JukeboxSession[]);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du jukebox.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMusicUploaded = (newMusic: Musique) => {
    setMusiques(prev => [newMusic, ...prev]);
    setActiveViewTab("liste");
    toast({
      title: "Succès",
      description: "Musique uploadée avec succès!",
    });
  };

  const handleSessionCreated = (newSession: JukeboxSession) => {
    setSessions(prev => [newSession, ...prev]);
    setCurrentSession(newSession);
    setActiveViewTab("liste");
    setActiveTab("player");
    toast({
      title: "Succès",
      description: "Session créée avec succès!",
    });
  };

  const handleSessionJoined = (session: JukeboxSession) => {
    setCurrentSession(session);
    setActiveTab("player");
    toast({
      title: "Succès",
      description: `Vous avez rejoint la session "${session.nom}"`,
    });
  };

  const renderListContent = () => (
    <div className="space-y-6">
      {/* Current Session Info */}
      {currentSession && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Session Active</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentSession(null)}
              >
                Quitter
              </Button>
            </div>
            <CardDescription>
              {currentSession.nom} • {currentSession.description}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="library" className="flex items-center gap-2">
            <Music size={16} />
            Bibliothèque
          </TabsTrigger>
          <TabsTrigger value="playlists" className="flex items-center gap-2">
            <List size={16} />
            Playlists
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Users size={16} />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="player" className="flex items-center gap-2">
            <Radio size={16} />
            Lecteur
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-4">
          <MusicLibrary
            musiques={musiques}
            playlists={playlists}
            loading={loading}
            onRefresh={loadData}
          />
        </TabsContent>

        <TabsContent value="playlists" className="space-y-4">
          <PlaylistManager
            playlists={playlists}
            musiques={musiques}
            loading={loading}
            onRefresh={loadData}
            currentSession={currentSession}
          />
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <SessionManager
            sessions={sessions}
            loading={loading}
            onRefresh={loadData}
            onJoinSession={handleSessionJoined}
          />
        </TabsContent>

        <TabsContent value="player" className="space-y-4">
          <JukeboxPlayer
            session={currentSession}
            musiques={musiques}
            onSessionUpdate={loadData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderAddContent = () => {
    if (activeViewTab === "upload") {
      return (
        <UploadMusicForm
          onSuccess={handleMusicUploaded}
          onClose={() => setActiveViewTab("liste")}
        />
      );
    }
    if (activeViewTab === "create-session") {
      return (
        <CreateSessionForm
          onSuccess={handleSessionCreated}
          onClose={() => setActiveViewTab("liste")}
        />
      );
    }
    return null;
  };

  return (
    <PageLayout
      moduleId="jukebox"
      title="Ambiance baoulé"
      description="Ici on se détend en musique"
      icon={Music}
      activeTab={activeViewTab}
      onTabChange={setActiveViewTab}
      listContent={renderListContent()}
      addContent={renderAddContent()}
      customActions={
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            onClick={() => setActiveViewTab("upload")}
            size="sm"
            variant="outline"
            className="flex-1 sm:flex-none"
          >
            <Upload size={16} className="mr-2" />
            Ajouter Musique
          </Button>
          <Button
            onClick={() => setActiveViewTab("create-session")}
            size="sm"
            className="flex-1 sm:flex-none"
          >
            <Radio size={16} className="mr-2" />
            Créer Session
          </Button>
        </div>
      }
      loading={loading}
      hasData={musiques.length > 0 || sessions.length > 0}
    />
  );
}
