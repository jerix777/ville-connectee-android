import type { 
  JukeboxSession as BaseJukeboxSession, 
  Musique, 
  Playlist as BasePlaylist 
} from '@/services/jukeboxService';

/**
 * Represents a JukeboxSession with additional details fetched from the database,
 * such as participant count and the currently playing music.
 * This type explicitly includes properties that might not be inferred correctly from the base type.
 */
export interface JukeboxSessionWithDetails extends BaseJukeboxSession {
  id: string;
  nom: string;
  description: string | null;
  is_playing: boolean;
  session_participants: { count: number }[];
  musiques: Pick<Musique, 'titre' | 'artiste'> | null;
}

/**
 * Represents a Playlist with its associated music tracks fully loaded.
 */
export interface PlaylistWithMusiques extends BasePlaylist {
  playlist_musiques: {
    id: string;
    position: number;
    musiques: Musique;
  }[];
}
