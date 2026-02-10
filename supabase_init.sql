-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Enum for User Roles
create type user_role as enum ('ACADEMIA', 'PERSONAL', 'ATLETA');

-- Create Profiles Table (Public User Data)
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  role user_role default 'ATLETA',
  avatar_url text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security
alter table profiles enable row level security;

-- Create Assessments Table
create table assessments (
  id uuid default uuid_generate_v4() primary key,
  athlete_id uuid references profiles(id) not null,
  professional_id uuid references profiles(id), -- Who performed it
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Basic Physical Data
  weight numeric, -- kg
  height numeric, -- cm
  age integer,
  gender text, -- 'MALE' or 'FEMALE'
  
  -- Metrics
  body_fat numeric, -- %
  body_fat_method text, -- 'NAVY', 'POLLOCK_7', etc
  
  -- Structured Data (JSONB is best for purely structural/complex measurements)
  -- This will store: ombros, peitoral, cintura, bracoD/E, coxaD/E, etc.
  measurements jsonb default '{}'::jsonb,
  
  -- Calculated Results (Snapshot)
  -- This will store: score total, classification, symmetry scores, etc.
  results jsonb default '{}'::jsonb,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security
alter table assessments enable row level security;

-- Create User Associations (Linking Academy -> Personal -> Athlete)
create table user_associations (
  id uuid default uuid_generate_v4() primary key,
  academy_id uuid references profiles(id),
  personal_id uuid references profiles(id),
  athlete_id uuid references profiles(id),
  status text default 'ACTIVE', -- 'ACTIVE', 'INACTIVE', 'PENDING'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security
alter table user_associations enable row level security;

-- DEVELOPMENT POLICIES (ALLOW ALL FOR TESTING)
-- WARNING: Replace these with strict policies before production!

create policy "Enable all access for authenticated users on profiles"
on profiles for all to authenticated using (true);

create policy "Enable all access for authenticated users on assessments"
on assessments for all to authenticated using (true);

create policy "Enable all access for authenticated users on user_associations"
on user_associations for all to authenticated using (true);

-- Function to handle new user signup automatically
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', (new.raw_user_meta_data->>'role')::user_role);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on sign up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
