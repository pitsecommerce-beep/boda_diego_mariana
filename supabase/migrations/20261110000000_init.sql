-- ============================================================
--  Migración inicial · Boda Diego & Mariana
--  Aplicar con: supabase db push  (o pegar en el SQL Editor)
-- ============================================================


-- ─── Configuración de la boda (una sola fila, id = 1) ───────────────────────
create table if not exists public.wedding_config (
  id                   integer primary key default 1 check (id = 1),
  bride_name           text not null default 'Mariana',
  groom_name           text not null default 'Diego',
  wedding_date         timestamptz,
  hero_phrase          text default 'Nos casamos',
  cover_photo_url      text,
  music_url            text,

  parents_phrase       text default 'Con la bendición de Dios y de nuestros padres',
  bride_father         text,
  bride_mother         text,
  groom_father         text,
  groom_mother         text,

  ceremony_name        text,
  ceremony_time        text,
  ceremony_address     text,
  ceremony_maps_url    text,
  reception_name       text,
  reception_time       text,
  reception_address    text,
  reception_maps_url   text,

  dress_code_title     text default 'Formal',
  dress_code_text      text,
  dress_code_photos    text[] not null default '{}',

  gallery_urls         text[] not null default '{}',

  rsvp_deadline        text,
  rsvp_message         text,

  gift_message         text,
  gift_registries      jsonb  not null default '[]',
  bank_details         text,

  farewell_message     text,
  farewell_photo_url   text,

  updated_at           timestamptz not null default now()
);

insert into public.wedding_config (id) values (1) on conflict (id) do nothing;

-- ─── Invitados ──────────────────────────────────────────────────────────────
-- Cada fila es una invitación (persona o familia) con su número de pases.
create table if not exists public.guests (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  slug             text not null unique,
  phone            text,
  seats            integer not null default 1 check (seats >= 1),
  side             text check (side in ('novia', 'novio', 'ambos')),
  group_name       text,
  notes            text,
  invitation_sent  boolean not null default false,
  rsvp_status      text not null default 'pendiente'
                   check (rsvp_status in ('pendiente', 'si', 'no', 'quizas')),
  attending_count  integer not null default 0,
  rsvp_message     text,
  responded_at     timestamptz,
  created_at       timestamptz not null default now()
);

create index if not exists guests_slug_idx on public.guests (slug);

-- ─── Seguridad (RLS) ────────────────────────────────────────────────────────
-- Sólo se usan la URL y la anon key de Supabase (sin usuarios ni login),
-- así que el panel /admin escribe con la anon key, como en un proyecto simple.
alter table public.wedding_config enable row level security;
alter table public.guests         enable row level security;

drop policy if exists "config public read" on public.wedding_config;
create policy "config public read" on public.wedding_config
  for select using (true);

drop policy if exists "config public write" on public.wedding_config;
create policy "config public write" on public.wedding_config
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "guests public all" on public.guests;
create policy "guests public all" on public.guests
  for all to anon, authenticated using (true) with check (true);

-- ─── Funciones públicas para la invitación ─────────────────────────────────
-- La invitación usa estas funciones: sólo leen/actualizan al invitado del enlace
-- y validan la respuesta (estado y número de asistentes dentro de sus pases).
create or replace function public.get_guest(p_slug text)
returns table (
  id uuid, name text, seats integer, rsvp_status text,
  attending_count integer, rsvp_message text
)
language sql security definer set search_path = public as $$
  select g.id, g.name, g.seats, g.rsvp_status, g.attending_count, g.rsvp_message
  from public.guests g where g.slug = p_slug limit 1;
$$;

create or replace function public.submit_rsvp(
  p_slug text, p_status text, p_count integer, p_message text default null
) returns void
language plpgsql security definer set search_path = public as $$
declare v_seats integer;
begin
  if p_status not in ('si', 'no', 'quizas') then
    raise exception 'Estado inválido';
  end if;
  select seats into v_seats from public.guests where slug = p_slug;
  if v_seats is null then
    raise exception 'Invitado no encontrado';
  end if;
  update public.guests set
    rsvp_status     = p_status,
    attending_count = case when p_status = 'si'
                        then greatest(1, least(coalesce(p_count, 1), v_seats))
                        else 0 end,
    rsvp_message    = nullif(trim(coalesce(p_message, '')), ''),
    responded_at    = now()
  where slug = p_slug;
end;
$$;

grant execute on function public.get_guest(text) to anon, authenticated;
grant execute on function public.submit_rsvp(text, text, integer, text) to anon, authenticated;

-- ─── updated_at automático ──────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists wedding_config_updated_at on public.wedding_config;
create trigger wedding_config_updated_at
  before update on public.wedding_config
  for each row execute procedure public.set_updated_at();

-- ─── Storage: bucket público "boda" para fotos y música ────────────────────
insert into storage.buckets (id, name, public)
values ('boda', 'boda', true)
on conflict (id) do update set public = true;

drop policy if exists "boda public read" on storage.objects;
create policy "boda public read" on storage.objects
  for select using (bucket_id = 'boda');

drop policy if exists "boda admin insert" on storage.objects;
create policy "boda admin insert" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'boda');

drop policy if exists "boda admin update" on storage.objects;
create policy "boda admin update" on storage.objects
  for update to anon, authenticated using (bucket_id = 'boda');

drop policy if exists "boda admin delete" on storage.objects;
create policy "boda admin delete" on storage.objects
  for delete to anon, authenticated using (bucket_id = 'boda');
