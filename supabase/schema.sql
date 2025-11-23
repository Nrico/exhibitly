-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
-- Public profile information for artists and galleries
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  account_type text check (account_type in ('artist', 'gallery')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

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

-- SITE SETTINGS TABLE
-- Configuration for the public portfolio site
create table public.site_settings (
  user_id uuid references public.profiles(id) on delete cascade not null primary key,
  site_title text,
  site_bio text,
  theme text check (theme in ('white', 'dark', 'archive')) default 'white',
  custom_domain text unique,
  contact_email text,
  show_sold_items boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for site_settings
alter table public.site_settings enable row level security;

-- Site Settings policies
create policy "Site settings are viewable by everyone."
  on public.site_settings for select
  using ( true );

create policy "Users can insert their own site settings."
  on public.site_settings for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own site settings."
  on public.site_settings for update
  using ( auth.uid() = user_id );

-- TRIGGER FOR NEW USERS
-- Automatically create a profile entry when a new user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, account_type)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'account_type');
  
  -- Also initialize site settings
  insert into public.site_settings (user_id, site_title)
  values (new.id, new.raw_user_meta_data->>'full_name');
  
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
