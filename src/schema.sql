-- ----
--
-- TANGELO WEDDING PLANNER SUPABASE SCHEMA
--
-- ----

-- ----
-- 1. Create Tables
-- ----

-- Profiles table to store user and partner information
-- This table is linked to Supabase's built-in `auth.users` table.
create table if not exists public.profiles (
  id uuid not null primary key, -- The user's UID from auth.users
  first_name text,
  last_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Weddings table to store the main details of the wedding plan
create table if not exists public.weddings (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  partner_id uuid null references public.profiles(id) on delete set null,
  location text,
  wedding_date timestamptz,
  primary_event text,
  additional_event text,
  budget numeric,
  guest_count_range text,
  kind_of_wedding text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tasks for the wedding checklist
create table if not exists public.tasks (
  id uuid not null default gen_random_uuid() primary key,
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  name text not null,
  description text,
  completed boolean not null default false,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Expenses for the budget tracker
create table if not exists public.expenses (
  id uuid not null default gen_random_uuid() primary key,
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  name text not null,
  category text not null,
  amount numeric not null,
  date timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Guests for the guest list
create table if not exists public.guests (
  id uuid not null default gen_random_uuid() primary key,
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  name text not null,
  rsvp_status text not null default 'Pending', -- 'Pending', 'Accepted', 'Declined'
  dietary_restrictions text,
  table_assignment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Vendors selected by the user
create table if not exists public.selected_vendors (
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  vendor_id text not null, -- The vendor's ID from the mock vendor list
  name text not null,
  category text,
  price_range text,
  location text,
  image_url text,
  rating numeric,
  description text,
  contact jsonb,
  data_ai_hint text,
  created_at timestamptz not null default now(),
  primary key (wedding_id, vendor_id)
);

-- Invitations sent to partners
create table if not exists public.wedding_invitations (
    id uuid not null default gen_random_uuid() primary key,
    wedding_id uuid not null references public.weddings(id) on delete cascade,
    email text not null,
    status text not null default 'pending', -- 'pending', 'accepted'
    created_at timestamptz not null default now(),
    unique (wedding_id, email)
);


-- ----
-- 2. Enable Row Level Security (RLS)
-- ----
alter table public.profiles enable row level security;
alter table public.weddings enable row level security;
alter table public.tasks enable row level security;
alter table public.expenses enable row level security;
alter table public.guests enable row level security;
alter table public.selected_vendors enable row level security;
alter table public.wedding_invitations enable row level security;


-- ----
-- 3. Create RLS Policies
-- ----

-- Profiles are visible to the user who owns them and their linked partner.
create policy "Users can view their own profile and their partner's profile"
  on public.profiles for select
  using (
    auth.uid() = id or -- User can see their own profile
    auth.uid() in ( -- User can see their partner's profile
      select user_id from weddings where partner_id = profiles.id
      union
      select partner_id from weddings where user_id = profiles.id
    )
  );

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);


-- Wedding data is visible to the user who created it or the linked partner.
create policy "Users can view their own wedding data"
  on public.weddings for select
  using (auth.uid() = user_id or auth.uid() = partner_id);

create policy "Users can update their own wedding data"
  on public.weddings for update
  using (auth.uid() = user_id or auth.uid() = partner_id);


-- Policies for other tables that link to a wedding. Access is granted if the user
-- has access to the wedding record itself.
create policy "Users can manage items linked to their wedding"
  on public.tasks for all
  using (
    exists (
      select 1 from public.weddings
      where weddings.id = tasks.wedding_id
      and (weddings.user_id = auth.uid() or weddings.partner_id = auth.uid())
    )
  );

create policy "Users can manage items linked to their wedding"
  on public.expenses for all
  using (
    exists (
      select 1 from public.weddings
      where weddings.id = expenses.wedding_id
      and (weddings.user_id = auth.uid() or weddings.partner_id = auth.uid())
    )
  );

create policy "Users can manage items linked to their wedding"
  on public.guests for all
  using (
    exists (
      select 1 from public.weddings
      where weddings.id = guests.wedding_id
      and (weddings.user_id = auth.uid() or weddings.partner_id = auth.uid())
    )
  );

create policy "Users can manage items linked to their wedding"
  on public.selected_vendors for all
  using (
    exists (
      select 1 from public.weddings
      where weddings.id = selected_vendors.wedding_id
      and (weddings.user_id = auth.uid() or weddings.partner_id = auth.uid())
    )
  );
  
create policy "Users can manage invitations for their wedding"
  on public.wedding_invitations for all
  using (
    exists (
      select 1 from public.weddings
      where weddings.id = wedding_invitations.wedding_id
      and (weddings.user_id = auth.uid() or weddings.partner_id = auth.uid())
    )
  );


-- ----
-- 4. Database Functions & Triggers
-- ----

-- Function to create a profile when a new user signs up in Supabase Auth.
create or replace function public.create_profile_for_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger that runs the function after a new user is inserted into auth.users.
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_profile_for_new_user();


-- Stored procedure to handle all the logic for the onboarding form.
create or replace function public.complete_onboarding(
    p_user_id uuid,
    p_user_first_name text,
    p_user_last_name text,
    p_partner_first_name text,
    p_partner_last_name text,
    p_wedding_kind text,
    p_primary_event text,
    p_additional_event text,
    p_location text,
    p_wedding_date timestamptz,
    p_guest_count text,
    p_budget numeric
)
returns void as $$
DECLARE
  v_partner_id uuid;
  v_wedding_id uuid;
BEGIN
  -- Update the user's own profile with their first and last name
  UPDATE public.profiles
  SET first_name = p_user_first_name, last_name = p_user_last_name
  WHERE id = p_user_id;

  -- Create a profile for the partner if their name is provided
  IF p_partner_first_name IS NOT NULL AND p_partner_first_name <> '' THEN
    INSERT INTO public.profiles (id, first_name, last_name)
    VALUES (gen_random_uuid(), p_partner_first_name, p_partner_last_name)
    RETURNING id INTO v_partner_id;
  ELSE
    v_partner_id := NULL;
  END IF;

  -- Create the wedding record
  INSERT INTO public.weddings (
    user_id,
    partner_id,
    kind_of_wedding,
    primary_event,
    additional_event,
    location,
    wedding_date,
    guest_count_range,
    budget
  )
  VALUES (
    p_user_id,
    v_partner_id,
    p_wedding_kind,
    p_primary_event,
    p_additional_event,
    p_location,
    p_wedding_date,
    p_guest_count,
    p_budget
  );

END;
$$ language plpgsql security definer;
