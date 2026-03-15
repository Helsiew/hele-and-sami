-- =============================================
-- Helena & Sami App v2 — Supabase Schema
-- Paste into Supabase SQL Editor and run
-- =============================================

create table if not exists countdowns (
  id uuid default gen_random_uuid() primary key,
  label text not null,
  date timestamptz not null,
  emoji text default '✈️',
  created_at timestamptz default now()
);

create table if not exists todos (
  id uuid default gen_random_uuid() primary key,
  text text not null,
  completed boolean default false,
  added_by text default 'Helena',
  created_at timestamptz default now()
);

create table if not exists watchlist (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  type text default 'Movie',
  watched boolean default false,
  added_by text default 'Helena',
  created_at timestamptz default now()
);

create table if not exists bets (
  id uuid default gen_random_uuid() primary key,
  text text not null,
  won boolean default false,
  added_by text default 'Helena',
  created_at timestamptz default now()
);

create table if not exists pings (
  id uuid default gen_random_uuid() primary key,
  from_name text not null,
  created_at timestamptz default now()
);

create table if not exists settings (
  key text primary key,
  value text not null
);

insert into settings (key, value) values
  ('sami_timezone', 'Europe/Madrid'),
  ('sami_city', 'Spain')
on conflict (key) do nothing;

alter publication supabase_realtime add table countdowns;
alter publication supabase_realtime add table todos;
alter publication supabase_realtime add table watchlist;
alter publication supabase_realtime add table bets;
alter publication supabase_realtime add table pings;
alter publication supabase_realtime add table settings;
