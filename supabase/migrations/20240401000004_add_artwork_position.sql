-- Add position column to artworks table for custom ordering
alter table public.artworks
add column position integer default 0;

-- Create an index for faster sorting
create index artworks_position_idx on public.artworks (position);
