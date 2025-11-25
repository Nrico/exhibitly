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
