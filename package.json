create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_name text not null,
  brand_name text,
  logo_url text,
  foreground text default '#111827',
  background text default '#ffffff',
  sample_url text default 'https://mptechnologyconsulting.com',
  plan text default 'free',
  created_at timestamptz default now()
);

create table if not exists public.qr_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null default 'url',
  destination_url text not null,
  payload text not null,
  short_code text unique,
  is_dynamic boolean default true,
  foreground text default '#111827',
  background text default '#ffffff',
  logo_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.qr_scans (
  id bigint generated always as identity primary key,
  qr_code_id uuid not null references public.qr_codes(id) on delete cascade,
  scanned_at timestamptz default now(),
  user_agent text,
  ip_address text
);

alter table public.profiles enable row level security;
alter table public.qr_codes enable row level security;
alter table public.qr_scans enable row level security;

drop policy if exists "Profiles are owner readable" on public.profiles;
create policy "Profiles are owner readable"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Profiles are owner writable" on public.profiles;
create policy "Profiles are owner writable"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Profiles are owner updateable" on public.profiles;
create policy "Profiles are owner updateable"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "QR codes are owner readable" on public.qr_codes;
create policy "QR codes are owner readable"
  on public.qr_codes for select
  using (auth.uid() = user_id);

drop policy if exists "QR codes are owner writable" on public.qr_codes;
create policy "QR codes are owner writable"
  on public.qr_codes for insert
  with check (auth.uid() = user_id);

drop policy if exists "QR codes are owner updateable" on public.qr_codes;
create policy "QR codes are owner updateable"
  on public.qr_codes for update
  using (auth.uid() = user_id);

drop policy if exists "QR scans are owner readable" on public.qr_scans;
create policy "QR scans are owner readable"
  on public.qr_scans for select
  using (
    exists (
      select 1 from public.qr_codes
      where qr_codes.id = qr_scans.qr_code_id
      and qr_codes.user_id = auth.uid()
    )
  );
