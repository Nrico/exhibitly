-- Add database secondary indexes on foreign key columns to prevent sequential table scans as records scale.

-- 1. Artworks user_id index
CREATE INDEX IF NOT EXISTS artworks_user_id_idx ON public.artworks (user_id);

-- 2. Profile Views profile_id index
CREATE INDEX IF NOT EXISTS profile_views_profile_id_idx ON public.profile_views (profile_id);

-- 3. Subscribers user_id index
CREATE INDEX IF NOT EXISTS subscribers_user_id_idx ON public.subscribers (user_id);

-- 4. Artists user_id index
CREATE INDEX IF NOT EXISTS artists_user_id_idx ON public.artists (user_id);

-- 5. Exhibitions user_id index
CREATE INDEX IF NOT EXISTS exhibitions_user_id_idx ON public.exhibitions (user_id);

-- 6. Viewing Rooms gallery_id index
CREATE INDEX IF NOT EXISTS viewing_rooms_gallery_id_idx ON public.viewing_rooms (gallery_id);

-- 7. Room Items room_id index
CREATE INDEX IF NOT EXISTS room_items_room_id_idx ON public.room_items (room_id);
