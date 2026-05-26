-- Alter artworks table to add instagram_media_id
ALTER TABLE public.artworks 
ADD COLUMN IF NOT EXISTS instagram_media_id TEXT UNIQUE;
