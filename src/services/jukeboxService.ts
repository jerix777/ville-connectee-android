import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Musique = Tables<"musiques">;
export type MusiqueInsert = TablesInsert<"musiques">;
export type Playlist = Tables<"playlists">;
export type PlaylistInsert = TablesInsert<"playlists">;
export type JukeboxSession = Tables<"jukebox_sessions">;
export type JukeboxSessionInsert = TablesInsert<"jukebox_sessions">;

// Music Management
export const getMusicList = async (quartier_id?: string) => {
  let query = supabase
    .from("musiques")
    .select("*")
    .order("created_at", { ascending: false });

  if (quartier_id) {
    query = query.eq("quartier_id", quartier_id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const addPlaylistToQueue = async (playlistId: string, sessionId: string) => {
  // Get all musiques from the playlist
  const { data: playlistMusiques, error: playlistError } = await supabase
    .from('playlist_musiques')
    .select('musique_id')
    .eq('playlist_id', playlistId);

  if (playlistError) throw playlistError;
  if (!playlistMusiques || playlistMusiques.length === 0) {
    throw new Error('Playlist is empty or not found.');
  }

  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Utilisateur non connecté');

  // Get current max position in queue
  const { data: queueItems } = await supabase
    .from('session_queue')
    .select('position')
    .eq('session_id', sessionId)
    .order('position', { ascending: false })
    .limit(1);

  let nextPosition =
    queueItems && queueItems.length > 0 ? queueItems[0].position + 1 : 1;

  const newQueueItems = playlistMusiques.map((pm, index) => ({
    session_id: sessionId,
    musique_id: pm.musique_id,
    added_by: user.id,
    position: nextPosition + index,
  }));

  const { error: insertError } = await supabase
    .from('session_queue')
    .insert(newQueueItems);

  if (insertError) throw insertError;

  return { success: true, count: newQueueItems.length };
};

export const removeFromPlaylist = async (playlistMusiqueId: string) => {
  const { error } = await supabase
    .from("playlist_musiques")
    .delete()
    .eq("id", playlistMusiqueId);

  if (error) throw error;
};

export const uploadMusic = async (musicData: MusiqueInsert, file: File) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Utilisateur non connecté");

  // Upload file to storage
  const fileName = `${Date.now()}_${file.name}`;
  const { data: fileData, error: fileError } = await supabase.storage
    .from("music")
    .upload(fileName, file);

  if (fileError) throw fileError;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from("music")
    .getPublicUrl(fileName);

  // Save music data
  const { data, error } = await supabase
    .from("musiques")
    .insert({
      ...musicData,
      file_url: publicUrl,
      uploaded_by: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteMusic = async (id: string) => {
  const { error } = await supabase
    .from("musiques")
    .delete()
    .eq("id", id);

  if (error) throw error;
};

// Playlist Management
export const getPlaylists = async () => {
  const { data, error } = await supabase
    .from("playlists")
    .select(`
      *,
      playlist_musiques(
        position,
        musiques(*)
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const createPlaylist = async (playlistData: Omit<PlaylistInsert, 'created_by' | 'id' | 'created_at' | 'updated_at' | 'quartier_id'>) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Utilisateur non connecté");

  const { data, error } = await supabase
    .from("playlists")
    .insert({
      ...playlistData,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const addToPlaylist = async (playlistId: string, musiqueId: string) => {
  // Get next position
  const { data: existingItems } = await supabase
    .from("playlist_musiques")
    .select("position")
    .eq("playlist_id", playlistId)
    .order("position", { ascending: false })
    .limit(1);

  const nextPosition = existingItems && existingItems.length > 0 
    ? existingItems[0].position + 1 
    : 1;

  const { data, error } = await supabase
    .from("playlist_musiques")
    .insert({
      playlist_id: playlistId,
      musique_id: musiqueId,
      position: nextPosition,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Jukebox Sessions
export const getActiveSessions = async () => {
  const { data, error } = await supabase
    .from("jukebox_sessions")
    .select(`
      *,
      session_participants(count),
      musiques(titre, artiste)
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const createSession = async (sessionData: JukeboxSessionInsert) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Utilisateur non connecté");

  const { data, error } = await supabase
    .from("jukebox_sessions")
    .insert({
      ...sessionData,
      host_user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const joinSession = async (sessionId: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Utilisateur non connecté");

  const { data, error } = await supabase
    .from("session_participants")
    .insert({
      session_id: sessionId,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const addToQueue = async (sessionId: string, musiqueId: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Utilisateur non connecté");

  // Get next position in queue
  const { data: queueItems } = await supabase
    .from("session_queue")
    .select("position")
    .eq("session_id", sessionId)
    .order("position", { ascending: false })
    .limit(1);

  const nextPosition = queueItems && queueItems.length > 0 
    ? queueItems[0].position + 1 
    : 1;

  const { data, error } = await supabase
    .from("session_queue")
    .insert({
      session_id: sessionId,
      musique_id: musiqueId,
      added_by: user.id,
      position: nextPosition,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getSessionQueue = async (sessionId: string) => {
  const { data, error } = await supabase
    .from("session_queue")
    .select(`
      *,
      musiques(*),
      users_profiles(nom, prenom)
    `)
    .eq("session_id", sessionId)
    .eq("played", false)
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
};

export const updateSessionState = async (
  sessionId: string, 
  updates: { 
    current_musique_id?: string; 
    current_position?: number; 
    is_playing?: boolean; 
  }
) => {
  const { data, error } = await supabase
    .from("jukebox_sessions")
    .update(updates)
    .eq("id", sessionId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
