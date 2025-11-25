-- Add site_bio_long to site_settings
alter table public.site_settings 
add column if not exists site_bio_long text;
