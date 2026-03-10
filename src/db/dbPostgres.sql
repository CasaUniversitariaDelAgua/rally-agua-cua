-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.registrations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  team_name text NOT NULL,
  representative text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  members text NOT NULL,
  how_heard text NOT NULL,
  institution text NOT NULL,
  experience text NOT NULL,
  special_needs text NOT NULL,
  comments text,
  CONSTRAINT registrations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.scores (
  id integer NOT NULL DEFAULT nextval('scores_id_seq'::regclass),
  team_id integer,
  phase_id integer NOT NULL CHECK (phase_id >= 1 AND phase_id <= 5),
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'doing'::text, 'done'::text])),
  points integer NOT NULL DEFAULT 0,
  CONSTRAINT scores_pkey PRIMARY KEY (id),
  CONSTRAINT scores_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id)
);
CREATE TABLE public.teams (
  id integer NOT NULL DEFAULT nextval('teams_id_seq'::regclass),
  name text NOT NULL,
  color text NOT NULL DEFAULT '#C4A35A'::text,
  members ARRAY NOT NULL DEFAULT '{}'::text[],
  CONSTRAINT teams_pkey PRIMARY KEY (id)
);