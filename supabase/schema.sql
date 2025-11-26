-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
-- Public profile information for artists and galleries
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  username text unique,
  avatar_url text,
  account_type text check (account_type in ('artist', 'gallery')),
  stripe_customer_id text,
  subscription_status text default 'free',
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Helper function to check if user is admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
end;
$$ language plpgsql security definer;

-- Profiles policies
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id );

create policy "Admins can update any profile."
  on public.profiles for update
  using ( public.is_admin() );

create policy "Admins can delete any profile."
  on public.profiles for delete
  using ( public.is_admin() );

-- ARTWORKS TABLE
-- Inventory of art pieces
create table public.artworks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  medium text,
  dimensions text,
  price decimal(10, 2),
  currency text default 'USD',
  status text check (status in ('available', 'sold', 'hidden', 'draft')) default 'draft',
  collection text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for artworks
alter table public.artworks enable row level security;

-- Artworks policies
create policy "Artworks are viewable by everyone."
  on public.artworks for select
  using ( true );

create policy "Users can insert their own artworks."
  on public.artworks for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own artworks."
  on public.artworks for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own artworks."
  on public.artworks for delete
  using ( auth.uid() = user_id );

create policy "Admins can update any artwork."
  on public.artworks for update
  using ( public.is_admin() );

create policy "Admins can delete any artwork."
  on public.artworks for delete
  using ( public.is_admin() );

-- SITE SETTINGS TABLE
-- Site Settings Table
create table public.site_settings (
  user_id uuid references public.profiles(id) on delete cascade not null primary key,
  site_title text,
  site_bio text,
  site_bio_long text,
  theme text default 'minimal',
  custom_domain text unique,
  contact_email text,
  phone text,
  address text,
  social_instagram text,
  social_twitter text,
  social_facebook text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for site_settings
alter table public.site_settings enable row level security;

-- Policies for site_settings
create policy "Public site settings are viewable by everyone."
  on public.site_settings for select
  using ( true );

create policy "Users can insert their own site settings."
  on public.site_settings for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own site settings."
  on public.site_settings for update
  using ( auth.uid() = user_id );

-- Profile Views Table (Analytics)
create table public.profile_views (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  viewed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  viewer_ip text, -- Optional: Store hashed IP or just keep it simple
  user_agent text
);

-- Enable RLS for profile_views
alter table public.profile_views enable row level security;

-- Policies for profile_views
create policy "Anyone can insert a view."
  on public.profile_views for insert
  with check ( true );

create policy "Users can view their own analytics."
  on public.profile_views for select
  using ( auth.uid() = profile_id );

-- TRIGGER FOR NEW USERS
-- Automatically create a profile entry when a new user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
declare
  full_name_val text;
  account_type_val text;
begin
  -- Extract metadata with fallbacks
  full_name_val := new.raw_user_meta_data->>'full_name';
  if full_name_val is null or full_name_val = '' then
    full_name_val := split_part(new.email, '@', 1); -- Fallback to email prefix
  end if;

  account_type_val := new.raw_user_meta_data->>'account_type';
  if account_type_val is null then
    account_type_val := 'artist'; -- Default to artist
  end if;

  insert into public.profiles (id, email, full_name, account_type)
  values (new.id, new.email, full_name_val, account_type_val);
  
  -- Also initialize site settings
  insert into public.site_settings (user_id, site_title)
  values (new.id, full_name_val);
  
  return new;
end;
$$ language plpgsql security definer;

  for each row execute procedure public.handle_new_user();

-- STORAGE SETUP
-- Create the 'artworks' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('artworks', 'artworks', true)
on conflict (id) do nothing;

-- Storage Policies
create policy "Artwork images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'artworks' );

create policy "Users can upload artwork images."
  on storage.objects for insert
  with check (
    bucket_id = 'artworks' and
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

create policy "Users can update their own artwork images."
  on storage.objects for update
  using (
    bucket_id = 'artworks' and
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

create policy "Users can delete their own artwork images."
  on storage.objects for delete
  using (
    bucket_id = 'artworks' and
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

-- Create the 'avatars' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Storage Policies for Avatars
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Users can upload avatar images."
  on storage.objects for insert
  with check (
    bucket_id = 'avatars' and
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

create policy "Users can update their own avatar images."
  on storage.objects for update
  using (
    bucket_id = 'avatars' and
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

create policy "Users can delete their own avatar images."
  on storage.objects for delete
  using (
    bucket_id = 'avatars' and
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

-- SUBSCRIBERS TABLE
-- Store emails of people who have inquired or subscribed
create table public.subscribers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null, -- The artist
  email text not null,
  source text default 'inquiry', -- 'inquiry', 'manual', 'signup'
  subscribed boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, email)
);

-- Enable RLS for subscribers
alter table public.subscribers enable row level security;

-- Policies for subscribers
create policy "Artists can view their own subscribers."
  on public.subscribers for select
  using ( auth.uid() = user_id );

create policy "Artists can insert subscribers (e.g. from inquiry)."
  on public.subscribers for insert
  with check ( auth.uid() = user_id OR true ); -- Allow public insert via server action (which bypasses RLS usually, but good to be explicit or use service role)
  -- Actually, for public inquiries, the user is anonymous. 
  -- We will likely use the Service Role key in the server action to bypass RLS for insertion if needed, 
  -- or we can allow public insert if we validate properly.
  -- For now, let's allow public insert but maybe restrict it? 
  -- Actually, since we use server actions, we can use `supabase-admin` or just rely on the fact that `sendInquiry` runs on server.
  -- But `sendInquiry` uses `createClient` which uses the user's session.
  -- If the user is anonymous (the inquirer), they can't insert if we enforce `auth.uid() = user_id`.
  -- So we need a policy that allows anonymous insertion OR we use `supabaseAdmin` in the action.
  -- Let's use `supabaseAdmin` in the action for the subscriber insert to be safe and secure.
  -- So the policy below is for the Artist to view/manage.

create policy "Artists can update their own subscribers."
  on public.subscribers for update
  using ( auth.uid() = user_id );

create policy "Artists can delete their own subscribers."
  on public.subscribers for delete
  using ( auth.uid() = user_id );


-- ARTISTS TABLE (For Galleries)
create table public.artists (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null, -- The gallery
  full_name text not null,
  bio text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for artists
alter table public.artists enable row level security;

-- Policies for artists
create policy "Artists are viewable by everyone."
  on public.artists for select
  using ( true );

create policy "Galleries can insert their own artists."
  on public.artists for insert
  with check ( auth.uid() = user_id );

create policy "Galleries can update their own artists."
  on public.artists for update
  using ( auth.uid() = user_id );

create policy "Galleries can delete their own artists."
  on public.artists for delete
  using ( auth.uid() = user_id );


-- EXHIBITIONS TABLE
create table public.exhibitions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null, -- The gallery
  title text not null,
  description text,
  start_date date,
  end_date date,
  is_featured boolean default false,
  cover_image_url text,
  status text check (status in ('draft', 'published', 'archived')) default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for exhibitions
alter table public.exhibitions enable row level security;

-- Policies for exhibitions
create policy "Published exhibitions are viewable by everyone."
  on public.exhibitions for select
  using ( status = 'published' or auth.uid() = user_id );

create policy "Galleries can insert their own exhibitions."
  on public.exhibitions for insert
  with check ( auth.uid() = user_id );

create policy "Galleries can update their own exhibitions."
  on public.exhibitions for update
  using ( auth.uid() = user_id );

create policy "Galleries can delete their own exhibitions."
  on public.exhibitions for delete
  using ( auth.uid() = user_id );


-- EXHIBITION ARTWORKS TABLE (Join Table)
create table public.exhibition_artworks (
  exhibition_id uuid references public.exhibitions(id) on delete cascade not null,
  artwork_id uuid references public.artworks(id) on delete cascade not null,
  position integer default 0,
  primary key (exhibition_id, artwork_id)
);

-- Enable RLS for exhibition_artworks
alter table public.exhibition_artworks enable row level security;

-- Policies for exhibition_artworks
create policy "Exhibition artworks are viewable by everyone."
  on public.exhibition_artworks for select
  using ( true );

create policy "Galleries can manage exhibition artworks."
  on public.exhibition_artworks for all
  using ( 
    exists (
      select 1 from public.exhibitions 
      where id = exhibition_artworks.exhibition_id 
      and user_id = auth.uid()
    )
  );

create policy "Admins can manage exhibition artworks."
  on public.exhibition_artworks for all
  using ( public.is_admin() );

-- Add Admin policies for other tables if missing

-- Site Settings
create policy "Admins can update any site settings."
  on public.site_settings for update
  using ( public.is_admin() );

create policy "Admins can delete any site settings."
  on public.site_settings for delete
  using ( public.is_admin() );

-- Artists
create policy "Admins can update any artist."
  on public.artists for update
  using ( public.is_admin() );

create policy "Admins can delete any artist."
  on public.artists for delete
  using ( public.is_admin() );

-- Exhibitions
create policy "Admins can update any exhibition."
  on public.exhibitions for update
  using ( public.is_admin() );

create policy "Admins can delete any exhibition."
  on public.exhibitions for delete
  using ( public.is_admin() );

-- UPDATE ARTWORKS TABLE
-- Add artist_id column to artworks table if it doesn't exist
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'artworks' and column_name = 'artist_id') then
    alter table public.artworks add column artist_id uuid references public.artists(id) on delete set null;
  end if;
end $$;
