-- Add contact and social fields to site_settings
alter table public.site_settings 
add column if not exists contact_email text,
add column if not exists phone text,
add column if not exists address text,
add column if not exists social_instagram text,
add column if not exists social_twitter text,
add column if not exists social_facebook text;
