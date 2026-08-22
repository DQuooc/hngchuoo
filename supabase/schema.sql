create table if not exists gifts (
  id uuid primary key default gen_random_uuid(),
  title text,
  song_url text,
  created_at timestamptz default now()
);

create table if not exists gift_photos (
  id uuid primary key default gen_random_uuid(),
  gift_id uuid references gifts(id) on delete cascade,
  photo_url text not null,
  order_index int default 0,
  caption text
);

create table if not exists gift_songs (
  id uuid primary key default gen_random_uuid(),
  gift_id uuid references gifts(id) on delete cascade,
  title text not null,
  artist text,
  song_url text not null,
  cover_url text,
  order_index int default 0
);

alter table gifts enable row level security;
alter table gift_photos enable row level security;
alter table gift_songs enable row level security;

create policy "public read gifts"
  on gifts for select
  using (true);

create policy "public read gift_photos"
  on gift_photos for select
  using (true);

create policy "public read gift_songs"
  on gift_songs for select
  using (true);

-- Create public Storage buckets named `photos` and `songs` in Supabase.
-- Uploads should be performed by an authenticated admin with narrow insert/update
-- policies; do not expose a service-role key in this frontend.
