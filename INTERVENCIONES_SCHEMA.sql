-- Esquema base para modulo Intervenciones (Supabase/PostgreSQL)

create table if not exists public.casos_intervencion (
  id uuid primary key default gen_random_uuid(),
  autor_id uuid not null references public.users(id) on delete cascade,
  iniciales_alumno text not null,
  centro_nombre text not null,
  slug_busqueda text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists casos_intervencion_unique_autor_alumno_centro
  on public.casos_intervencion (autor_id, iniciales_alumno, centro_nombre);

create index if not exists casos_intervencion_idx_autor_updated
  on public.casos_intervencion (autor_id, updated_at desc);

create table if not exists public.intervenciones (
  id uuid primary key default gen_random_uuid(),
  caso_id uuid not null references public.casos_intervencion(id) on delete cascade,
  autor_id uuid not null references public.users(id) on delete cascade,
  fecha_intervencion date not null,
  ambito text not null check (ambito in ('escolar', 'sociocultural')),
  subambito text not null check (subambito in ('familia', 'tutoria', 'profesorado', 'claustro', 'servicios_sociales', 'otros')),
  tipo_origen text not null default 'nota_manual',
  titulo text not null,
  texto_original text not null,
  texto_redactado_ia text not null,
  resumen_ia text null,
  archivo_url text null,
  archivo_nombre text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists intervenciones_idx_caso_fecha
  on public.intervenciones (caso_id, fecha_intervencion desc, created_at desc);

create index if not exists intervenciones_idx_autor_created
  on public.intervenciones (autor_id, created_at desc);

-- Opcional: trigger para updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_casos_intervencion_updated_at on public.casos_intervencion;
create trigger trg_casos_intervencion_updated_at
before update on public.casos_intervencion
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_intervenciones_updated_at on public.intervenciones;
create trigger trg_intervenciones_updated_at
before update on public.intervenciones
for each row execute procedure public.set_updated_at();

-- Ampliación de contextos permitidos en subámbito (idempotente).
do $$
declare
  existing_constraint_name text;
begin
  select c.conname
  into existing_constraint_name
  from pg_constraint c
  join pg_class t on t.oid = c.conrelid
  join pg_namespace n on n.oid = t.relnamespace
  where n.nspname = 'public'
    and t.relname = 'intervenciones'
    and c.contype = 'c'
    and pg_get_constraintdef(c.oid) like '%subambito%';

  if existing_constraint_name is not null then
    execute format(
      'alter table public.intervenciones drop constraint %I',
      existing_constraint_name
    );
  end if;

  alter table public.intervenciones
    add constraint intervenciones_subambito_check
    check (
      subambito in (
        'familia',
        'tutoria',
        'profesorado',
        'claustro',
        'equipo_directivo',
        'orientacion',
        'convivencia',
        'evaluacion',
        'servicios_sociales',
        'entorno_comunitario',
        'salud_mental',
        'proteccion_menor',
        'otros'
      )
    );
end $$;
