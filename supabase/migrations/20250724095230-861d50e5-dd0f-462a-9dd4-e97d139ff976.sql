-- Restaurer toutes les tables manquantes pour l'application

-- Table des conversations de messages
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(participant1_id, participant2_id)
);

-- Table des messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'voice')),
  file_url TEXT,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des associations
CREATE TABLE IF NOT EXISTS public.associations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  description TEXT,
  type_association TEXT,
  contact_email TEXT,
  contact_telephone TEXT,
  adresse TEXT,
  quartier_id UUID,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des actualités
CREATE TABLE IF NOT EXISTS public.news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  contenu TEXT NOT NULL,
  image_url TEXT,
  quartier_id UUID,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des événements
CREATE TABLE IF NOT EXISTS public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  description TEXT NOT NULL,
  date_event TIMESTAMP WITH TIME ZONE NOT NULL,
  lieu TEXT NOT NULL,
  prix DECIMAL(10,2),
  image_url TEXT,
  quartier_id UUID,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table immobilier
CREATE TABLE IF NOT EXISTS public.immobilier (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  description TEXT NOT NULL,
  prix DECIMAL(15,2) NOT NULL,
  type_propriete TEXT NOT NULL,
  surface DECIMAL(10,2),
  pieces INTEGER,
  chambres INTEGER,
  sdb INTEGER,
  adresse TEXT NOT NULL,
  ville TEXT NOT NULL,
  quartier TEXT,
  contact_nom TEXT NOT NULL,
  contact_telephone TEXT NOT NULL,
  contact_email TEXT,
  images_urls TEXT[],
  quartier_id UUID,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des services/commerces
CREATE TABLE IF NOT EXISTS public.services_commerces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  description TEXT NOT NULL,
  categorie TEXT NOT NULL,
  adresse TEXT NOT NULL,
  telephone TEXT,
  email TEXT,
  horaires TEXT,
  image_url TEXT,
  quartier_id UUID,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table du marché
CREATE TABLE IF NOT EXISTS public.market_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  description TEXT NOT NULL,
  prix DECIMAL(10,2) NOT NULL,
  categorie TEXT NOT NULL,
  condition_item TEXT DEFAULT 'neuf',
  contact_nom TEXT NOT NULL,
  contact_telephone TEXT NOT NULL,
  contact_email TEXT,
  image_url TEXT,
  quartier_id UUID,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des musiques pour jukebox
CREATE TABLE IF NOT EXISTS public.musiques (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  artiste TEXT NOT NULL,
  album TEXT,
  duree INTEGER,
  file_url TEXT NOT NULL,
  image_url TEXT,
  quartier_id UUID,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des playlists
CREATE TABLE IF NOT EXISTS public.playlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  quartier_id UUID,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des sessions jukebox
CREATE TABLE IF NOT EXISTS public.jukebox_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  current_musique_id UUID REFERENCES public.musiques(id),
  current_position INTEGER DEFAULT 0,
  is_playing BOOLEAN DEFAULT false,
  quartier_id UUID,
  host_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS sur toutes les tables
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.associations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.immobilier ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_commerces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.musiques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jukebox_sessions ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les conversations
CREATE POLICY "Users can view their own conversations" ON public.conversations FOR SELECT USING (auth.uid() = participant1_id OR auth.uid() = participant2_id);
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = participant1_id OR auth.uid() = participant2_id);

-- Politiques RLS pour les messages
CREATE POLICY "Users can view messages in their conversations" ON public.messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (conversations.participant1_id = auth.uid() OR conversations.participant2_id = auth.uid())
  )
);
CREATE POLICY "Users can send messages in their conversations" ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE conversations.id = conversation_id 
    AND (conversations.participant1_id = auth.uid() OR conversations.participant2_id = auth.uid())
  )
);
CREATE POLICY "Users can update their own messages" ON public.messages FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (conversations.participant1_id = auth.uid() OR conversations.participant2_id = auth.uid())
  )
);

-- Politiques RLS génériques pour les autres tables
CREATE POLICY "Anyone can view" ON public.associations FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create" ON public.associations FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own" ON public.associations FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own" ON public.associations FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Anyone can view" ON public.news FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create" ON public.news FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own" ON public.news FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own" ON public.news FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Anyone can view" ON public.events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create" ON public.events FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own" ON public.events FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own" ON public.events FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Anyone can view" ON public.immobilier FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create" ON public.immobilier FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own" ON public.immobilier FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own" ON public.immobilier FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Anyone can view" ON public.services_commerces FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create" ON public.services_commerces FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own" ON public.services_commerces FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own" ON public.services_commerces FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Anyone can view" ON public.market_items FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create" ON public.market_items FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own" ON public.market_items FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own" ON public.market_items FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Anyone can view" ON public.musiques FOR SELECT USING (true);
CREATE POLICY "Authenticated users can upload" ON public.musiques FOR INSERT WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Users can delete their own" ON public.musiques FOR DELETE USING (auth.uid() = uploaded_by);

CREATE POLICY "Anyone can view public playlists" ON public.playlists FOR SELECT USING (is_public = true OR auth.uid() = created_by);
CREATE POLICY "Authenticated users can create" ON public.playlists FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own" ON public.playlists FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own" ON public.playlists FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Anyone can view active sessions" ON public.jukebox_sessions FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can create" ON public.jukebox_sessions FOR INSERT WITH CHECK (auth.uid() = host_user_id);
CREATE POLICY "Hosts can update their sessions" ON public.jukebox_sessions FOR UPDATE USING (auth.uid() = host_user_id);
CREATE POLICY "Hosts can delete their sessions" ON public.jukebox_sessions FOR DELETE USING (auth.uid() = host_user_id);