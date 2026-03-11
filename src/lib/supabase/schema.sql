-- Run this in the Supabase SQL editor to set up the database

-- Users table
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  email text,
  apple_id text,
  scan_credits integer default 1 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reports table
create table if not exists public.reports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  app_name text not null,
  approval_score integer not null,
  approval_category text not null,
  results_json jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.reports enable row level security;

-- Users policies
create policy "Users can view their own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);

-- Reports policies
create policy "Users can view their own reports"
  on public.reports for select
  using (auth.uid() = user_id);

create policy "Users can insert their own reports"
  on public.reports for insert
  with check (auth.uid() = user_id);

-- Auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, apple_id, scan_credits)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'sub',
    1
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes
create index if not exists reports_user_id_idx on public.reports (user_id);
create index if not exists reports_created_at_idx on public.reports (created_at desc);
