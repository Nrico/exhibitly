-- Add analytics columns to viewing_rooms table
ALTER TABLE public.viewing_rooms 
ADD COLUMN IF NOT EXISTS views integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_viewed_at timestamp with time zone;

-- Create a function to increment views atomically
CREATE OR REPLACE FUNCTION public.increment_room_views(room_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.viewing_rooms
  SET 
    views = COALESCE(views, 0) + 1,
    last_viewed_at = now()
  WHERE id = room_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
