-- ============================================================
-- Contador Coletivo — Supabase SQL Schema
-- RESET + RECREATE: seguro para rodar multiplas vezes.
-- Execute tudo no Supabase SQL Editor de uma vez.
-- ============================================================

-- 1. DROP TUDO (ordem inversa de dependencias)

drop policy if exists "logs_insert_members"              on public.counter_logs;
drop policy if exists "logs_select_members"              on public.counter_logs;
drop policy if exists "counters_delete_creator_or_owner" on public.counters;
drop policy if exists "counters_update_creator_or_owner" on public.counters;
drop policy if exists "counters_insert_members"          on public.counters;
drop policy if exists "counters_select_members"          on public.counters;
drop policy if exists "members_delete_self_or_owner"     on public.group_members;
drop policy if exists "members_insert_self"              on public.group_members;
drop policy if exists "members_select"                   on public.group_members;
drop policy if exists "groups_delete_owner"              on public.groups;
drop policy if exists "groups_update_owner"              on public.groups;
drop policy if exists "groups_insert_auth"               on public.groups;
drop policy if exists "groups_select_members"            on public.groups;
drop policy if exists "profiles_update_own"              on public.profiles;
drop policy if exists "profiles_insert_own"              on public.profiles;
drop policy if exists "profiles_select_all"              on public.profiles;

drop trigger if exists on_log_inserted         on public.counter_logs;
drop trigger if exists on_auth_user_created    on auth.users;
drop trigger if exists set_counters_updated_at on public.counters;
drop trigger if exists set_groups_updated_at   on public.groups;
drop trigger if exists set_profiles_updated_at on public.profiles;

drop function if exists public.handle_new_user()            cascade;
drop function if exists public.update_counter_value()       cascade;
drop function if exists public.set_updated_at()             cascade;
drop function if exists public.get_my_group_ids()           cascade;
drop function if exists public.get_group_by_invite_code(text) cascade;

drop view if exists public.my_group_ids cascade;

drop table if exists public.counter_logs  cascade;
drop table if exists public.counters      cascade;
drop table if exists public.group_members cascade;
drop table if exists public.groups        cascade;
drop table if exists public.profiles      cascade;

drop type if exists public.member_role cascade;

-- 2. EXTENSIONS
create extension if not exists "pgcrypto";

-- 3. TABLES

create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.groups (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  description  text,
  invite_code  text not null unique default upper(substring(gen_random_uuid()::text from 1 for 6)),
  owner_id     uuid not null references public.profiles(id) on delete cascade,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create type public.member_role as enum ('owner', 'member');

create table public.group_members (
  id         uuid primary key default gen_random_uuid(),
  group_id   uuid not null references public.groups(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  role       public.member_role not null default 'member',
  joined_at  timestamptz not null default now(),
  unique (group_id, user_id)
);

create table public.counters (
  id             uuid primary key default gen_random_uuid(),
  group_id       uuid not null references public.groups(id) on delete cascade,
  name           text not null,
  unit           text not null default 'un',
  description    text,
  goal           numeric,
  deadline       date,
  current_value  numeric not null default 0,
  created_by     uuid not null references public.profiles(id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.counter_logs (
  id          uuid primary key default gen_random_uuid(),
  counter_id  uuid not null references public.counters(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  amount      numeric not null check (amount > 0),
  note        text,
  created_at  timestamptz not null default now()
);

-- 4. INDEXES
create index idx_group_members_group on public.group_members(group_id);
create index idx_group_members_user  on public.group_members(user_id);
create index idx_counters_group      on public.counters(group_id);
create index idx_logs_counter        on public.counter_logs(counter_id);
create index idx_logs_user           on public.counter_logs(user_id);

-- 5. HELPER FUNCTION (security definer)
-- Roda com privilegios do owner, fora do contexto de RLS.
-- Retorna os group_ids do usuario autenticado sem acionar nenhuma policy.
-- SECURITY DEFINER garante que auth.uid() funciona corretamente e que
-- a consulta a group_members bypassa RLS (sem recursao).
create or replace function public.get_my_group_ids()
returns setof uuid
language sql
security definer
stable
set search_path = public
as $$
  select group_id
  from public.group_members
  where user_id = auth.uid();
$$;

grant execute on function public.get_my_group_ids() to authenticated;

-- Retorna um grupo pelo invite_code ignorando RLS.
-- Necessário para que um usuário possa entrar num grupo antes de ser membro.
create or replace function public.get_group_by_invite_code(p_invite_code text)
returns setof public.groups
language sql
security definer
stable
set search_path = public
as $$
  select * from public.groups
  where invite_code = upper(p_invite_code)
  limit 1;
$$;

grant execute on function public.get_group_by_invite_code(text) to authenticated;

-- 6. FUNCTIONS E TRIGGERS

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.update_counter_value()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  update public.counters
  set current_value = current_value + new.amount, updated_at = now()
  where id = new.counter_id;
  return new;
end;
$$;

create trigger on_log_inserted
  after insert on public.counter_logs
  for each row execute procedure public.update_counter_value();

create or replace function public.set_updated_at()
returns trigger language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
create trigger set_groups_updated_at   before update on public.groups   for each row execute procedure public.set_updated_at();
create trigger set_counters_updated_at before update on public.counters for each row execute procedure public.set_updated_at();

-- 7. RLS
alter table public.profiles      enable row level security;
alter table public.groups        enable row level security;
alter table public.group_members enable row level security;
alter table public.counters      enable row level security;
alter table public.counter_logs  enable row level security;

-- 8. POLICIES

-- profiles
create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- groups
-- SELECT: membro do grupo OU dono (owner_id direto, sem subconsulta em group_members)
create policy "groups_select_members"
  on public.groups for select
  using (
    owner_id = auth.uid()
    or id in (select public.get_my_group_ids())
  );

create policy "groups_insert_auth"
  on public.groups for insert
  with check (auth.uid() = owner_id);

create policy "groups_update_owner"
  on public.groups for update
  using (auth.uid() = owner_id);

create policy "groups_delete_owner"
  on public.groups for delete
  using (auth.uid() = owner_id);

-- group_members
-- SELECT: propria linha (comparacao direta) + membros de grupos que o user eh dono
create policy "members_select"
  on public.group_members for select
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.groups
      where id = group_members.group_id and owner_id = auth.uid()
    )
  );

create policy "members_insert_self"
  on public.group_members for insert
  with check (auth.uid() = user_id);

create policy "members_delete_self_or_owner"
  on public.group_members for delete
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.groups
      where id = group_members.group_id and owner_id = auth.uid()
    )
  );

-- counters (via view my_group_ids)
create policy "counters_select_members"
  on public.counters for select
  using (group_id in (select public.get_my_group_ids()));

create policy "counters_insert_members"
  on public.counters for insert
  with check (
    auth.uid() = created_by
    and group_id in (select public.get_my_group_ids())
  );

create policy "counters_update_creator_or_owner"
  on public.counters for update
  using (
    auth.uid() = created_by
    or exists (select 1 from public.groups where id = counters.group_id and owner_id = auth.uid())
  );

create policy "counters_delete_creator_or_owner"
  on public.counters for delete
  using (
    auth.uid() = created_by
    or exists (select 1 from public.groups where id = counters.group_id and owner_id = auth.uid())
  );

-- counter_logs (via view my_group_ids)
create policy "logs_select_members"
  on public.counter_logs for select
  using (
    exists (
      select 1 from public.counters c
      where c.id = counter_logs.counter_id
        and c.group_id in (select public.get_my_group_ids())
    )
  );

create policy "logs_insert_members"
  on public.counter_logs for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.counters c
      where c.id = counter_logs.counter_id
        and c.group_id in (select public.get_my_group_ids())
    )
  );

-- 9. REALTIME
do $$ begin
  alter publication supabase_realtime add table public.counters;
exception when others then null;
end $$;

do $$ begin
  alter publication supabase_realtime add table public.counter_logs;
exception when others then null;
end $$;

-- 10. SINCRONIZA PERFIS JA EXISTENTES
insert into public.profiles (id, full_name, avatar_url)
select id, raw_user_meta_data->>'full_name', raw_user_meta_data->>'avatar_url'
from auth.users
on conflict (id) do nothing;

