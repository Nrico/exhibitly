-- Restrict SELECT access on artworks to public statuses ('available', 'sold') or own/admin items.

DROP POLICY IF EXISTS "Artworks are viewable by everyone." ON public.artworks;

CREATE POLICY "Artworks are viewable by everyone." ON public.artworks
    FOR SELECT USING (
        status IN ('available', 'sold') 
        OR auth.uid() = user_id 
        OR public.is_admin()
    );
