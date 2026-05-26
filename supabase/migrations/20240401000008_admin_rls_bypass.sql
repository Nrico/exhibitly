-- Add admin bypass policies to allow administrators to perform inserts and manage user resources directly when impersonating them.

-- 1. Artworks
create policy "Admins can insert any artworks."
  on public.artworks for insert
  with check ( public.is_admin() );

-- 2. Site Settings
create policy "Admins can insert any site settings."
  on public.site_settings for insert
  with check ( public.is_admin() );

-- 3. Viewing Rooms
create policy "Admins can view any viewing rooms."
  on public.viewing_rooms for select
  using ( public.is_admin() );

create policy "Admins can insert any viewing rooms."
  on public.viewing_rooms for insert
  with check ( public.is_admin() );

create policy "Admins can update any viewing rooms."
  on public.viewing_rooms for update
  using ( public.is_admin() );

create policy "Admins can delete any viewing rooms."
  on public.viewing_rooms for delete
  using ( public.is_admin() );

-- 4. Room Items
create policy "Admins can manage any room items."
  on public.room_items for all
  using ( public.is_admin() );

-- 5. Artists (for galleries)
create policy "Admins can insert any artists."
  on public.artists for insert
  with check ( public.is_admin() );

-- 6. Exhibitions
create policy "Admins can insert any exhibitions."
  on public.exhibitions for insert
  with check ( public.is_admin() );

-- 7. Subscribers
create policy "Admins can manage any subscribers."
  on public.subscribers for all
  using ( public.is_admin() );
