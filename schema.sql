
-- 1. PROFILES TABLE
-- Stores user information. Links to auth.users table.
create table if not exists public.profiles (
    id uuid not null,
    first_name text,
    last_name text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    
    primary key (id)
);

-- Row Level Security for profiles
alter table public.profiles enable row level security;

create policy "Users can view their own profile."
    on public.profiles for select
    using ( auth.uid() = id );
    
create policy "Users can update their own profile."
    on public.profiles for update
    using ( auth.uid() = id );

-- Function to create a profile for a new user. This is a standard Supabase setup.
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function when a new user signs up in Supabase Auth.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. WEDDINGS TABLE
-- Central table linking all wedding-related data to a user.
create table if not exists public.weddings (
    id uuid not null default gen_random_uuid(),
    user_id uuid not null references public.profiles on delete cascade,
    partner_id uuid null references public.profiles on delete set null,
    location text,
    wedding_date timestamptz,
    primary_event text,
    additional_event text,
    budget numeric,
    guest_count_range text,
    kind_of_wedding text default 'christian',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    
    primary key (id)
);

-- Row Level Security for weddings
alter table public.weddings enable row level security;

create policy "Users can view their own wedding data."
    on public.weddings for select
    using ( auth.uid() = user_id or auth.uid() = partner_id );

create policy "Users can create their own wedding record."
    on public.weddings for insert
    with check ( auth.uid() = user_id );

create policy "Users can update their own wedding data."
    on public.weddings for update
    using ( auth.uid() = user_id or auth.uid() = partner_id );


-- 3. TASKS TABLE
-- Stores wedding checklist items.
create table if not exists public.tasks (
    id uuid not null default gen_random_uuid(),
    wedding_id uuid not null references public.weddings on delete cascade,
    name text not null,
    description text,
    completed boolean not null default false,
    due_date date,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    
    primary key (id)
);

-- Row Level Security for tasks
alter table public.tasks enable row level security;

create policy "Users can manage tasks for their own wedding."
    on public.tasks for all
    using ( wedding_id in (select id from public.weddings where user_id = auth.uid() or partner_id = auth.uid()) );


-- 4. EXPENSES TABLE
-- Stores budget line items.
create table if not exists public.expenses (
    id uuid not null default gen_random_uuid(),
    wedding_id uuid not null references public.weddings on delete cascade,
    name text not null,
    category text not null,
    amount numeric not null,
    date date not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    
    primary key (id)
);

-- Row Level Security for expenses
alter table public.expenses enable row level security;

create policy "Users can manage expenses for their own wedding."
    on public.expenses for all
    using ( wedding_id in (select id from public.weddings where user_id = auth.uid() or partner_id = auth.uid()) );


-- 5. GUESTS TABLE
-- Stores guest list information.
create table if not exists public.guests (
    id uuid not null default gen_random_uuid(),
    wedding_id uuid not null references public.weddings on delete cascade,
    name text not null,
    rsvp_status text not null default 'Pending', -- 'Pending', 'Accepted', 'Declined'
    dietary_restrictions text,
    table_assignment text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    
    primary key (id)
);

-- Row Level Security for guests
alter table public.guests enable row level security;

create policy "Users can manage guests for their own wedding."
    on public.guests for all
    using ( wedding_id in (select id from public.weddings where user_id = auth.uid() or partner_id = auth.uid()) );


-- 6. SELECTED_VENDORS TABLE
-- Stores vendors that a user has saved.
create table if not exists public.selected_vendors (
    wedding_id uuid not null references public.weddings on delete cascade,
    vendor_id text not null, -- Corresponds to the mock vendor ID
    name text not null,
    category text not null,
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

-- Row Level Security for selected_vendors
alter table public.selected_vendors enable row level security;

create policy "Users can manage their selected vendors."
    on public.selected_vendors for all
    using ( wedding_id in (select id from public.weddings where user_id = auth.uid() or partner_id = auth.uid()) );


-- 7. WEDDING_INVITATIONS TABLE
-- Stores invitations sent to partners.
create table if not exists public.wedding_invitations (
    id uuid not null default gen_random_uuid(),
    wedding_id uuid not null references public.weddings on delete cascade,
    email text not null,
    status text not null default 'pending', -- 'pending', 'accepted'
    created_at timestamptz not null default now(),
    
    primary key (id),
    unique (wedding_id, email)
);

-- Row Level Security for wedding_invitations
alter table public.wedding_invitations enable row level security;

create policy "Users can manage invitations for their own wedding."
    on public.wedding_invitations for all
    using ( wedding_id in (select id from public.weddings where user_id = auth.uid() or partner_id = auth.uid()) );


-- 8. COMPLETE ONBOARDING FUNCTION (for RPC)
-- This transactionally completes the onboarding process.
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
declare
    v_partner_id uuid;
    v_wedding_id uuid;
begin
    -- Update the current user's profile information (created by the trigger)
    update public.profiles
    set first_name = p_user_first_name, last_name = p_user_last_name
    where id = p_user_id;

    -- If partner information is provided, create a profile for them.
    -- This partner is not an authenticated user yet.
    if p_partner_first_name is not null and p_partner_first_name != '' then
        insert into public.profiles (id, first_name, last_name)
        values (gen_random_uuid(), p_partner_first_name, p_partner_last_name)
        returning id into v_partner_id;
    else
        v_partner_id := null;
    end if;

    -- Create the wedding record, linking the user and optionally the partner
    insert into public.weddings (
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
    values (
        p_user_id,
        v_partner_id,
        p_wedding_kind,
        p_primary_event,
        p_additional_event,
        p_location,
        p_wedding_date,
        p_guest_count,
        p_budget
    )
    returning id into v_wedding_id;
end;
$$ language plpgsql security definer;
