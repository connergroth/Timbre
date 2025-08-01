-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.album_compatibilities (
  id character varying NOT NULL,
  album_id character varying NOT NULL,
  compatibility_score integer NOT NULL,
  user_id_1 uuid NOT NULL,
  user_id_2 uuid NOT NULL,
  CONSTRAINT album_compatibilities_pkey PRIMARY KEY (id),
  CONSTRAINT album_compatibilities_user_id_1_fkey FOREIGN KEY (user_id_1) REFERENCES public.users(id),
  CONSTRAINT album_compatibilities_user_id_2_fkey FOREIGN KEY (user_id_2) REFERENCES public.users(id),
  CONSTRAINT album_compatibilities_album_id_fkey FOREIGN KEY (album_id) REFERENCES public.albums(id)
);
CREATE TABLE public.albums (
  id character varying NOT NULL,
  title character varying NOT NULL,
  artist character varying NOT NULL,
  release_date timestamp without time zone,
  genre character varying,
  aoty_score real,
  cover_url character varying,
  genres ARRAY DEFAULT '{}'::text[],
  duration_ms integer,
  total_tracks integer,
  spotify_url text,
  explicit boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT albums_pkey PRIMARY KEY (id)
);
CREATE TABLE public.alembic_version (
  version_num character varying NOT NULL,
  CONSTRAINT alembic_version_pkey PRIMARY KEY (version_num)
);
CREATE TABLE public.artist_compatibilities (
  id character varying NOT NULL,
  artist_id character varying NOT NULL,
  compatibility_score integer NOT NULL,
  user_id_1 uuid NOT NULL,
  user_id_2 uuid NOT NULL,
  CONSTRAINT artist_compatibilities_pkey PRIMARY KEY (id),
  CONSTRAINT artist_compatibilities_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.artists(id),
  CONSTRAINT artist_compatibilities_user_id_2_fkey FOREIGN KEY (user_id_2) REFERENCES public.users(id),
  CONSTRAINT artist_compatibilities_user_id_1_fkey FOREIGN KEY (user_id_1) REFERENCES public.users(id)
);
CREATE TABLE public.artists (
  id character varying NOT NULL,
  name character varying NOT NULL,
  genre character varying,
  popularity integer,
  aoty_score integer,
  CONSTRAINT artists_pkey PRIMARY KEY (id)
);
CREATE TABLE public.compatibilities (
  id character varying NOT NULL,
  compatibility_score integer NOT NULL,
  user_id_1 uuid NOT NULL,
  user_id_2 uuid NOT NULL,
  CONSTRAINT compatibilities_pkey PRIMARY KEY (id),
  CONSTRAINT compatibilities_user_id_2_fkey FOREIGN KEY (user_id_2) REFERENCES public.users(id),
  CONSTRAINT compatibilities_user_id_1_fkey FOREIGN KEY (user_id_1) REFERENCES public.users(id)
);
CREATE TABLE public.playlists (
  id integer NOT NULL DEFAULT nextval('playlists_id_seq'::regclass),
  name character varying NOT NULL,
  track_ids json NOT NULL,
  cover_url character varying,
  CONSTRAINT playlists_pkey PRIMARY KEY (id)
);
CREATE TABLE public.recommendations (
  id character varying NOT NULL,
  track_id character varying NOT NULL,
  album character varying NOT NULL,
  recommendation_score integer NOT NULL,
  user_id uuid NOT NULL,
  CONSTRAINT recommendations_pkey PRIMARY KEY (id),
  CONSTRAINT recommendations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT recommendations_track_id_fkey FOREIGN KEY (track_id) REFERENCES public.tracks(id),
  CONSTRAINT recommendations_album_fkey FOREIGN KEY (album) REFERENCES public.albums(id)
);
CREATE TABLE public.track_compatibilities (
  id character varying NOT NULL,
  track_id character varying NOT NULL,
  compatibility_score integer NOT NULL,
  user_id_1 uuid NOT NULL,
  user_id_2 uuid NOT NULL,
  CONSTRAINT track_compatibilities_pkey PRIMARY KEY (id),
  CONSTRAINT track_compatibilities_track_id_fkey FOREIGN KEY (track_id) REFERENCES public.tracks(id),
  CONSTRAINT track_compatibilities_user_id_1_fkey FOREIGN KEY (user_id_1) REFERENCES public.users(id),
  CONSTRAINT track_compatibilities_user_id_2_fkey FOREIGN KEY (user_id_2) REFERENCES public.users(id)
);
CREATE TABLE public.track_listening_histories (
  id character varying NOT NULL,
  track_id character varying NOT NULL,
  play_count integer NOT NULL,
  user_id uuid NOT NULL,
  CONSTRAINT track_listening_histories_pkey PRIMARY KEY (id),
  CONSTRAINT track_listening_histories_track_id_fkey FOREIGN KEY (track_id) REFERENCES public.tracks(id),
  CONSTRAINT track_listening_histories_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.tracks (
  id character varying NOT NULL,
  title character varying NOT NULL,
  artist character varying NOT NULL,
  album character varying,
  genre character varying,
  popularity integer,
  aoty_score real,
  audio_features json NOT NULL,
  cover_url character varying,
  release_date date,
  duration_ms integer,
  genres ARRAY DEFAULT '{}'::text[],
  moods ARRAY DEFAULT '{}'::text[],
  spotify_url text,
  explicit boolean DEFAULT false,
  track_number integer,
  album_total_tracks integer,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT tracks_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tracks_backup (
  id character varying,
  title character varying,
  artist character varying,
  album character varying,
  genre character varying,
  popularity integer,
  aoty_score integer,
  audio_features json,
  cover_url character varying
);
CREATE TABLE public.user_id_mapping (
  old_id integer NOT NULL,
  new_id uuid NOT NULL UNIQUE,
  CONSTRAINT user_id_mapping_pkey PRIMARY KEY (old_id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  username character varying NOT NULL UNIQUE,
  email character varying NOT NULL UNIQUE,
  password_hash character varying,
  provider character varying DEFAULT 'email'::character varying,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  display_name character varying,
  avatar_url character varying,
  bio text,
  location character varying,
  spotify_id character varying UNIQUE,
  lastfm_username character varying UNIQUE,
  aoty_username character varying UNIQUE,
  spotify_access_token text,
  spotify_refresh_token text,
  spotify_token_expires_at timestamp without time zone,
  lastfm_session_key text,
  public_profile boolean DEFAULT true,
  share_listening_history boolean DEFAULT false,
  email_notifications boolean DEFAULT true,
  is_active boolean DEFAULT true,
  email_verified boolean DEFAULT false,
  last_login timestamp without time zone,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);