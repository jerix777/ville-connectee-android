import type { JukeboxSession, Musique, Playlist } from '@/types/database';

export interface JukeboxSessionWithDetails extends JukeboxSession {
  session_participants: { count: number }[];
  musiques: Pick<Musique, 'titre' | 'artiste'> | null;
}

export interface PlaylistWithMusiques extends Playlist {
  playlist_musiques: {
    id: string;
    position: number;
    musiques: Musique;
  }[];
}
