-- Create musiques table for storing music information
CREATE TABLE public.musiques (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    titre TEXT NOT NULL,
    artiste TEXT NOT NULL,
    album TEXT,
    duree INTEGER, -- durée en secondes
    file_url TEXT NOT NULL,
    cover_url TEXT,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    quartier_id UUID REFERENCES public.quartiers(id),
    genre TEXT,
    annee INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create playlists table
CREATE TABLE public.playlists (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nom TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT true,
    quartier_id UUID REFERENCES public.quartiers(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create playlist_musiques table for many-to-many relationship
CREATE TABLE public.playlist_musiques (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    playlist_id UUID REFERENCES public.playlists(id) ON DELETE CASCADE NOT NULL,
    musique_id UUID REFERENCES public.musiques(id) ON DELETE CASCADE NOT NULL,
    position INTEGER NOT NULL DEFAULT 1,
    added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(playlist_id, musique_id)
);

-- Create jukebox_sessions table for shared listening sessions
CREATE TABLE public.jukebox_sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nom TEXT NOT NULL,
    description TEXT,
    host_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    current_musique_id UUID REFERENCES public.musiques(id),
    current_position INTEGER DEFAULT 0, -- position dans la chanson en secondes
    is_playing BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    quartier_id UUID REFERENCES public.quartiers(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create session_participants table
CREATE TABLE public.session_participants (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.jukebox_sessions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(session_id, user_id)
);

-- Create session_queue table for music queue in sessions
CREATE TABLE public.session_queue (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.jukebox_sessions(id) ON DELETE CASCADE NOT NULL,
    musique_id UUID REFERENCES public.musiques(id) ON DELETE CASCADE NOT NULL,
    added_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    position INTEGER NOT NULL,
    played BOOLEAN DEFAULT false,
    added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.musiques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_musiques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jukebox_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies for musiques
CREATE POLICY "Public can view all music"
ON public.musiques
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can upload music"
ON public.musiques
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their own music"
ON public.musiques
FOR UPDATE
TO authenticated
USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete their own music"
ON public.musiques
FOR DELETE
TO authenticated
USING (auth.uid() = uploaded_by);

-- RLS Policies for playlists
CREATE POLICY "Public can view public playlists"
ON public.playlists
FOR SELECT
USING (is_public = true OR auth.uid() = created_by);

CREATE POLICY "Authenticated users can create playlists"
ON public.playlists
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own playlists"
ON public.playlists
FOR UPDATE
TO authenticated
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own playlists"
ON public.playlists
FOR DELETE
TO authenticated
USING (auth.uid() = created_by);

-- RLS Policies for playlist_musiques
CREATE POLICY "Users can view playlist music if they can see playlist"
ON public.playlist_musiques
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.playlists p 
        WHERE p.id = playlist_id 
        AND (p.is_public = true OR p.created_by = auth.uid())
    )
);

CREATE POLICY "Users can add music to their playlists"
ON public.playlist_musiques
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.playlists p 
        WHERE p.id = playlist_id 
        AND p.created_by = auth.uid()
    )
);

CREATE POLICY "Users can remove music from their playlists"
ON public.playlist_musiques
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.playlists p 
        WHERE p.id = playlist_id 
        AND p.created_by = auth.uid()
    )
);

-- RLS Policies for jukebox_sessions
CREATE POLICY "Public can view active sessions"
ON public.jukebox_sessions
FOR SELECT
USING (is_active = true);

CREATE POLICY "Authenticated users can create sessions"
ON public.jukebox_sessions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = host_user_id);

CREATE POLICY "Session hosts can update their sessions"
ON public.jukebox_sessions
FOR UPDATE
TO authenticated
USING (auth.uid() = host_user_id);

CREATE POLICY "Session hosts can delete their sessions"
ON public.jukebox_sessions
FOR DELETE
TO authenticated
USING (auth.uid() = host_user_id);

-- RLS Policies for session_participants
CREATE POLICY "Participants can view session participation"
ON public.session_participants
FOR SELECT
USING (
    auth.uid() = user_id OR 
    EXISTS (
        SELECT 1 FROM public.jukebox_sessions s 
        WHERE s.id = session_id 
        AND s.host_user_id = auth.uid()
    )
);

CREATE POLICY "Users can join sessions"
ON public.session_participants
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave sessions"
ON public.session_participants
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for session_queue
CREATE POLICY "Session participants can view queue"
ON public.session_queue
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.session_participants sp 
        WHERE sp.session_id = session_queue.session_id 
        AND sp.user_id = auth.uid()
    ) OR
    EXISTS (
        SELECT 1 FROM public.jukebox_sessions s 
        WHERE s.id = session_id 
        AND s.host_user_id = auth.uid()
    )
);

CREATE POLICY "Session participants can add to queue"
ON public.session_queue
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = added_by AND
    EXISTS (
        SELECT 1 FROM public.session_participants sp 
        WHERE sp.session_id = session_queue.session_id 
        AND sp.user_id = auth.uid()
    )
);

CREATE POLICY "Users can remove their own queue items"
ON public.session_queue
FOR DELETE
TO authenticated
USING (
    auth.uid() = added_by OR
    EXISTS (
        SELECT 1 FROM public.jukebox_sessions s 
        WHERE s.id = session_id 
        AND s.host_user_id = auth.uid()
    )
);

-- Create storage bucket for music files
INSERT INTO storage.buckets (id, name, public) VALUES ('music', 'music', true);

-- Create storage policies for music bucket
CREATE POLICY "Authenticated users can upload music files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'music');

CREATE POLICY "Public can view music files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'music');

CREATE POLICY "Users can update their own music files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'music' AND owner = auth.uid());

CREATE POLICY "Users can delete their own music files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'music' AND owner = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_musiques_artiste ON public.musiques(artiste);
CREATE INDEX idx_musiques_genre ON public.musiques(genre);
CREATE INDEX idx_musiques_quartier ON public.musiques(quartier_id);
CREATE INDEX idx_playlists_created_by ON public.playlists(created_by);
CREATE INDEX idx_jukebox_sessions_active ON public.jukebox_sessions(is_active);
CREATE INDEX idx_session_queue_position ON public.session_queue(session_id, position);