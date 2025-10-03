// Types locaux pour contourner les problèmes de types Supabase générés

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  read_at: string | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  created_at: string;
  updated_at: string;
  last_message_at: string | null;
}

export interface Musique {
  id: string;
  titre: string;
  artiste: string;
  album: string | null;
  genre: string | null;
  annee: number | null;
  duree: number | null;
  file_url: string;
  cover_url: string | null;
  uploaded_by: string | null;
  quartier_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Playlist {
  id: string;
  nom: string;
  description: string | null;
  created_by: string;
  is_public: boolean;
  quartier_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlaylistMusique {
  id: string;
  playlist_id: string;
  musique_id: string;
  position: number;
  added_at: string;
}

export interface JukeboxSession {
  id: string;
  nom: string;
  description: string | null;
  host_user_id: string;
  current_musique_id: string | null;
  current_position: number | null;
  is_playing: boolean;
  is_active: boolean;
  quartier_id: string | null;
  created_at: string;
  updated_at: string;
}
