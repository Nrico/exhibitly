-- Improve handle_new_user trigger to be more robust
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
