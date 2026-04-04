-- Migration: Enhanced Entry Schema Update
-- Adding 'feed_regimen' and aligning 'observation_notes' per Project 028 protocols.

ALTER TABLE public.bio_logs
RENAME COLUMN trainer_comments TO observation_notes;

ALTER TABLE public.bio_logs
ADD COLUMN feed_regimen TEXT;
