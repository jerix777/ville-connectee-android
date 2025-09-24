-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.actualites (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  contenu text NOT NULL,
  type character varying NOT NULL,
  auteur text,
  publie_le timestamp with time zone DEFAULT now(),
  image_url text,
  created_at timestamp with time zone DEFAULT now(),
  quartier_id uuid,
  CONSTRAINT actualites_pkey PRIMARY KEY (id),
  CONSTRAINT actualites_quartier_id_fkey FOREIGN KEY (quartier_id) REFERENCES public.quartiers(id)
);
CREATE TABLE public.annuaires (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  service_type text NOT NULL,
  name text NOT NULL UNIQUE,
  initials text,
  contact1 text NOT NULL,
  contact2 text,
  email text,
  quartier_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  is_verified boolean DEFAULT false,
  verification_method text,
  description text,
  address text,
  website text,
  owner_id uuid,
  CONSTRAINT annuaires_pkey PRIMARY KEY (id),
  CONSTRAINT annuaires_quartier_id_fkey FOREIGN KEY (quartier_id) REFERENCES public.quartiers(id),
  CONSTRAINT annuaires_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id)
);
CREATE TABLE public.association_annonces (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  association_id uuid NOT NULL,
  titre text NOT NULL,
  contenu text NOT NULL,
  auteur_id uuid NOT NULL,
  priorite text DEFAULT 'normale'::text,
  visible_jusqu date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT association_annonces_pkey PRIMARY KEY (id),
  CONSTRAINT association_annonces_association_id_fkey FOREIGN KEY (association_id) REFERENCES public.associations(id),
  CONSTRAINT association_annonces_auteur_id_fkey FOREIGN KEY (auteur_id) REFERENCES auth.users(id)
);
CREATE TABLE public.association_depenses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  association_id uuid NOT NULL,
  description text NOT NULL,
  montant numeric NOT NULL,
  categorie text NOT NULL,
  responsable_id uuid NOT NULL,
  justificatif_url text,
  date_depense date DEFAULT CURRENT_DATE,
  approuve boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT association_depenses_pkey PRIMARY KEY (id),
  CONSTRAINT association_depenses_association_id_fkey FOREIGN KEY (association_id) REFERENCES public.associations(id),
  CONSTRAINT association_depenses_responsable_id_fkey FOREIGN KEY (responsable_id) REFERENCES auth.users(id)
);
CREATE TABLE public.association_membres (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  association_id uuid NOT NULL,
  user_id uuid,
  nom text NOT NULL,
  prenom text NOT NULL,
  email text NOT NULL,
  telephone text,
  role text NOT NULL DEFAULT 'membre'::text,
  date_adhesion date DEFAULT CURRENT_DATE,
  date_arrivee date,
  cotisation_a_jour boolean DEFAULT false,
  dernier_paiement date,
  montant_cotisation numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT association_membres_pkey PRIMARY KEY (id),
  CONSTRAINT association_membres_association_id_fkey FOREIGN KEY (association_id) REFERENCES public.associations(id),
  CONSTRAINT association_membres_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.associations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  description text NOT NULL,
  contact text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  quartier_id uuid,
  logo_url text,
  nombre_membres integer DEFAULT 0,
  responsable_id uuid,
  statut text DEFAULT 'active'::text,
  date_creation date DEFAULT CURRENT_DATE,
  CONSTRAINT associations_pkey PRIMARY KEY (id),
  CONSTRAINT associations_quartier_id_fkey FOREIGN KEY (quartier_id) REFERENCES public.quartiers(id),
  CONSTRAINT associations_responsable_id_fkey FOREIGN KEY (responsable_id) REFERENCES auth.users(id)
);
CREATE TABLE public.audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.autorite_zones (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  zone_type text NOT NULL,
  zone_id uuid,
  zone_nom text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT autorite_zones_pkey PRIMARY KEY (id),
  CONSTRAINT autorite_zones_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.catalogue (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  description text,
  image_url text NOT NULL,
  categorie text NOT NULL,
  tags ARRAY DEFAULT '{}'::text[],
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  quartier_id uuid,
  created_by uuid,
  CONSTRAINT catalogue_pkey PRIMARY KEY (id),
  CONSTRAINT catalogue_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);
CREATE TABLE public.catalogue_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT catalogue_categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.catalogue_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  price numeric,
  image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  CONSTRAINT catalogue_items_pkey PRIMARY KEY (id),
  CONSTRAINT catalogue_items_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.catalogue_categories(id),
  CONSTRAINT catalogue_items_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);
CREATE TABLE public.commune (
  nom text NOT NULL UNIQUE,
  latitude numeric,
  longitude numeric,
  superficie bigint,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT commune_pkey PRIMARY KEY (id)
);
CREATE TABLE public.commune_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id text NOT NULL UNIQUE,
  commune_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT commune_preferences_pkey PRIMARY KEY (id),
  CONSTRAINT commune_preferences_commune_id_fkey FOREIGN KEY (commune_id) REFERENCES public.commune(id)
);
CREATE TABLE public.conversations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  participant1_id uuid NOT NULL,
  participant2_id uuid NOT NULL,
  last_message_at timestamp with time zone,
  CONSTRAINT conversations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.data_access_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  resource_type text NOT NULL,
  resource_id text,
  action text NOT NULL,
  sensitive_data_accessed boolean DEFAULT false,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT data_access_logs_pkey PRIMARY KEY (id),
  CONSTRAINT data_access_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.directory_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text NOT NULL,
  service_type text NOT NULL,
  address text,
  phone1 text,
  phone2 text,
  email text,
  user_id uuid DEFAULT auth.uid(),
  village_id uuid,
  CONSTRAINT directory_entries_pkey PRIMARY KEY (id),
  CONSTRAINT directory_entries_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT directory_entries_village_id_fkey FOREIGN KEY (village_id) REFERENCES public.villages(id)
);
CREATE TABLE public.etablissements_sante (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['hopital'::text, 'pharmacie'::text, 'clinique'::text, 'centre_sante'::text])),
  adresse text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  telephone text,
  email text,
  horaires text,
  services ARRAY,
  urgences boolean DEFAULT false,
  garde_permanente boolean DEFAULT false,
  quartier_id uuid,
  image_url text,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT etablissements_sante_pkey PRIMARY KEY (id)
);
CREATE TABLE public.evenements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  type_id uuid NOT NULL,
  organisateur text NOT NULL,
  lieu text NOT NULL,
  date_debut date NOT NULL,
  heure_debut time without time zone NOT NULL,
  date_fin date NOT NULL,
  heure_fin time without time zone NOT NULL,
  contact1 text NOT NULL,
  contact2 text,
  created_at timestamp with time zone DEFAULT now(),
  quartier_id uuid,
  CONSTRAINT evenements_pkey PRIMARY KEY (id),
  CONSTRAINT evenements_quartier_id_fkey FOREIGN KEY (quartier_id) REFERENCES public.quartiers(id),
  CONSTRAINT evenements_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.event_types(id)
);
CREATE TABLE public.event_types (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  label text NOT NULL UNIQUE,
  CONSTRAINT event_types_pkey PRIMARY KEY (id)
);
CREATE TABLE public.hotels (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  type text NOT NULL,
  adresse text NOT NULL,
  contact1 text NOT NULL,
  contact2 text,
  email text,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT hotels_pkey PRIMARY KEY (id)
);
CREATE TABLE public.immobilier (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  type text NOT NULL,
  description text NOT NULL,
  prix numeric NOT NULL,
  surface numeric NOT NULL,
  pieces integer,
  chambres integer,
  adresse text NOT NULL,
  contact text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  is_for_sale boolean DEFAULT true,
  vendeur text NOT NULL,
  quartier_id uuid,
  CONSTRAINT immobilier_pkey PRIMARY KEY (id),
  CONSTRAINT immobilier_quartier_id_fkey FOREIGN KEY (quartier_id) REFERENCES public.quartiers(id)
);
CREATE TABLE public.jukebox_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  description text,
  host_user_id uuid NOT NULL,
  current_musique_id uuid,
  current_position integer DEFAULT 0,
  is_playing boolean DEFAULT false,
  is_active boolean DEFAULT true,
  quartier_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT jukebox_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT jukebox_sessions_current_musique_id_fkey FOREIGN KEY (current_musique_id) REFERENCES public.musiques(id),
  CONSTRAINT jukebox_sessions_host_user_id_fkey FOREIGN KEY (host_user_id) REFERENCES auth.users(id),
  CONSTRAINT jukebox_sessions_quartier_id_fkey FOREIGN KEY (quartier_id) REFERENCES public.quartiers(id)
);
CREATE TABLE public.marche (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  description text NOT NULL,
  vendeur text NOT NULL,
  prix numeric NOT NULL,
  contact1 text NOT NULL,
  contact2 text,
  is_for_sale boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  quartier_id uuid,
  CONSTRAINT marche_pkey PRIMARY KEY (id),
  CONSTRAINT marche_quartier_id_fkey FOREIGN KEY (quartier_id) REFERENCES public.quartiers(id)
);
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL,
  sender_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  read_at timestamp with time zone,
  message_type text NOT NULL DEFAULT 'text'::text,
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id)
);
CREATE TABLE public.metiers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nom text NOT NULL UNIQUE,
  CONSTRAINT metiers_pkey PRIMARY KEY (id)
);
CREATE TABLE public.module_visibility (
  id text NOT NULL,
  name text NOT NULL,
  is_public boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT module_visibility_pkey PRIMARY KEY (id)
);
CREATE TABLE public.musiques (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  artiste text NOT NULL,
  album text,
  duree integer,
  file_url text NOT NULL,
  cover_url text,
  uploaded_by uuid,
  quartier_id uuid,
  genre text,
  annee integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT musiques_pkey PRIMARY KEY (id),
  CONSTRAINT musiques_quartier_id_fkey FOREIGN KEY (quartier_id) REFERENCES public.quartiers(id),
  CONSTRAINT musiques_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES auth.users(id)
);
CREATE TABLE public.necrologie (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  prenom text NOT NULL,
  date_naissance date,
  date_deces date NOT NULL,
  lieu_deces text,
  message text,
  photo_url text,
  created_at timestamp with time zone DEFAULT now(),
  quartier_id uuid,
  CONSTRAINT necrologie_pkey PRIMARY KEY (id),
  CONSTRAINT necrologie_quartier_id_fkey FOREIGN KEY (quartier_id) REFERENCES public.quartiers(id)
);
CREATE TABLE public.offres_emploi (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  description text NOT NULL,
  employeur text NOT NULL,
  type_contrat text NOT NULL,
  localisation text NOT NULL,
  publie_le timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  quartier_id uuid,
  CONSTRAINT offres_emploi_pkey PRIMARY KEY (id),
  CONSTRAINT offres_emploi_quartier_id_fkey FOREIGN KEY (quartier_id) REFERENCES public.quartiers(id)
);
CREATE TABLE public.playlist_musiques (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  playlist_id uuid NOT NULL,
  musique_id uuid NOT NULL,
  position integer NOT NULL DEFAULT 1,
  added_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT playlist_musiques_pkey PRIMARY KEY (id),
  CONSTRAINT playlist_musiques_musique_id_fkey FOREIGN KEY (musique_id) REFERENCES public.musiques(id),
  CONSTRAINT playlist_musiques_playlist_id_fkey FOREIGN KEY (playlist_id) REFERENCES public.playlists(id)
);
CREATE TABLE public.playlists (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  description text,
  created_by uuid NOT NULL,
  is_public boolean NOT NULL DEFAULT true,
  quartier_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT playlists_pkey PRIMARY KEY (id),
  CONSTRAINT playlists_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT playlists_quartier_id_fkey FOREIGN KEY (quartier_id) REFERENCES public.quartiers(id)
);
CREATE TABLE public.professionals (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL UNIQUE,
  nom text NOT NULL,
  surnom text,
  metier_id uuid,
  base text,
  contact1 text NOT NULL,
  contact2 text,
  email text,
  phone text,
  is_verified boolean NOT NULL DEFAULT false,
  verification_code text,
  verification_code_expires_at timestamp with time zone,
  CONSTRAINT professionals_pkey PRIMARY KEY (id),
  CONSTRAINT professionals_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT professionals_metier_id_fkey FOREIGN KEY (metier_id) REFERENCES public.metiers(id)
);
CREATE TABLE public.professionnel_competences (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  domaine_competence text NOT NULL,
  niveau_competence text,
  certifications ARRAY,
  experience_annees integer,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT professionnel_competences_pkey PRIMARY KEY (id),
  CONSTRAINT professionnel_competences_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.professionnels (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  surnom text,
  metier_id uuid NOT NULL,
  contact1 text NOT NULL,
  contact2 text,
  base text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  quartier_id uuid,
  user_id uuid,
  email text,
  phone text,
  is_verified boolean DEFAULT false,
  verification_method text CHECK (verification_method = ANY (ARRAY['email'::text, 'phone'::text])),
  CONSTRAINT professionnels_pkey PRIMARY KEY (id),
  CONSTRAINT professionnels_metier_id_fkey FOREIGN KEY (metier_id) REFERENCES public.metiers(id),
  CONSTRAINT professionnels_quartier_id_fkey FOREIGN KEY (quartier_id) REFERENCES public.quartiers(id),
  CONSTRAINT professionnels_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.quartiers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  description text,
  village_id uuid NOT NULL,
  population integer,
  code_postal text,
  image_url text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quartiers_pkey PRIMARY KEY (id),
  CONSTRAINT quartiers_village_id_fkey FOREIGN KEY (village_id) REFERENCES public.villages(id)
);
CREATE TABLE public.radio_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  CONSTRAINT radio_categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.radios (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  description text,
  logo_url text,
  flux_url text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  category_id uuid,
  CONSTRAINT radios_pkey PRIMARY KEY (id),
  CONSTRAINT radios_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT radios_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.radio_categories(id)
);
CREATE TABLE public.restaurants_buvettes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['restaurant'::text, 'buvette'::text, 'maquis'::text])),
  description text,
  adresse text NOT NULL,
  telephone text,
  email text,
  horaires text,
  prix_moyen numeric,
  specialites ARRAY,
  image_url text,
  quartier_id uuid,
  latitude numeric,
  longitude numeric,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  services ARRAY DEFAULT '{}'::text[],
  CONSTRAINT restaurants_buvettes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.services_commerces (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  categorie text NOT NULL,
  description text NOT NULL,
  adresse text NOT NULL,
  contact text NOT NULL,
  horaires text,
  image_url text,
  quartier_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT services_commerces_pkey PRIMARY KEY (id),
  CONSTRAINT services_commerces_quartier_id_fkey FOREIGN KEY (quartier_id) REFERENCES public.quartiers(id)
);
CREATE TABLE public.session_participants (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL,
  user_id uuid NOT NULL,
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT session_participants_pkey PRIMARY KEY (id),
  CONSTRAINT session_participants_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.jukebox_sessions(id),
  CONSTRAINT session_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.session_queue (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL,
  musique_id uuid NOT NULL,
  added_by uuid NOT NULL,
  position integer NOT NULL,
  played boolean DEFAULT false,
  added_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT session_queue_pkey PRIMARY KEY (id),
  CONSTRAINT session_queue_added_by_fkey FOREIGN KEY (added_by) REFERENCES auth.users(id),
  CONSTRAINT session_queue_musique_id_fkey FOREIGN KEY (musique_id) REFERENCES public.musiques(id),
  CONSTRAINT session_queue_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.jukebox_sessions(id)
);
CREATE TABLE public.souvenirs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  description text NOT NULL,
  date_souvenir date NOT NULL,
  auteur text NOT NULL,
  photo_url text,
  quartier_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT souvenirs_pkey PRIMARY KEY (id),
  CONSTRAINT souvenirs_quartier_id_fkey FOREIGN KEY (quartier_id) REFERENCES public.quartiers(id)
);
CREATE TABLE public.stations_carburant (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  type text NOT NULL,
  adresse text NOT NULL,
  telephone text,
  email text,
  horaires text,
  services ARRAY,
  prix_essence numeric,
  prix_gasoil numeric,
  prix_gaz numeric,
  latitude numeric,
  longitude numeric,
  quartier_id uuid,
  image_url text,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT stations_carburant_pkey PRIMARY KEY (id)
);
CREATE TABLE public.suggestions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  contenu text NOT NULL,
  auteur text NOT NULL,
  status text DEFAULT 'en attente'::text,
  reponse text,
  image_url text,
  quartier_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT suggestions_pkey PRIMARY KEY (id),
  CONSTRAINT suggestions_quartier_id_fkey FOREIGN KEY (quartier_id) REFERENCES public.quartiers(id)
);
CREATE TABLE public.taxi_bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  driver_id uuid,
  pickup_location text NOT NULL,
  destination text NOT NULL,
  status text NOT NULL DEFAULT 'pending'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT taxi_bookings_pkey PRIMARY KEY (id),
  CONSTRAINT taxi_bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.taxi_drivers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact1 text NOT NULL,
  contact2 text,
  vehicle_type text NOT NULL,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT taxi_drivers_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tribune (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  contenu text NOT NULL,
  auteur text NOT NULL,
  image_url text,
  quartier_id uuid,
  approuve boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT tribune_pkey PRIMARY KEY (id),
  CONSTRAINT tribune_quartier_id_fkey FOREIGN KEY (quartier_id) REFERENCES public.quartiers(id)
);
CREATE TABLE public.user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role USER-DEFINED NOT NULL DEFAULT 'administre'::user_role_type,
  sub_role text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_roles_pkey PRIMARY KEY (id),
  CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.users_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  nom text,
  prenom text,
  commune_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  date_naissance date,
  lieu_naissance text,
  lieu_residence text,
  contact_telephone text,
  village_origine_id uuid,
  CONSTRAINT users_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT fk_village_origine FOREIGN KEY (village_origine_id) REFERENCES public.villages(id),
  CONSTRAINT users_profiles_commune_id_fkey FOREIGN KEY (commune_id) REFERENCES public.villages(id),
  CONSTRAINT users_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.villages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nom text NOT NULL UNIQUE,
  description text,
  population integer,
  code_postal text,
  image_url text,
  created_at timestamp with time zone DEFAULT now(),
  commune_id uuid,
  CONSTRAINT villages_pkey PRIMARY KEY (id),
  CONSTRAINT villages_commune_id_fkey FOREIGN KEY (commune_id) REFERENCES public.commune(id)
);