-- ============================================================================
--  ALEBRIJES DE OAXACA TEOTIHUACÁN — MIGRACIÓN FIREBASE → SUPABASE
--  Esquema completo para los 3 proyectos (main site, webvisorias, IAFE)
--
--  Aplicar en orden en Supabase SQL Editor (https://supabase.com/dashboard)
--  Proyecto: jreixcvqsrrngmbwvyof
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- PARTE 1: MAIN SITE (metricasalebrijes) — esquema `public`
-- ────────────────────────────────────────────────────────────────────────────

-- =========================================================================
-- TABLA: profesores
-- =========================================================================
create table if not exists public.profesores (
    id uuid primary key references auth.users(id) on delete cascade,
    nombre text not null,
    email text not null unique,
    rol text not null default 'profesor' check (rol in ('admin', 'profesor')),
    equipo_restringido text,
    evaluador_global boolean default false,
    categorias_permitidas text[] default '{}',
    creado_en timestamptz default now()
);

-- =========================================================================
-- TABLA: jugadores
-- =========================================================================
create table if not exists public.jugadores (
    id uuid primary key references auth.users(id) on delete cascade,
    nombre text not null,
    apellido text not null,
    email text not null,
    fecha_nacimiento date,
    categoria text,
    posicion text,
    numero_camiseta integer,
    equipo text,
    rol text default 'jugador',
    fecha_registro timestamptz default now(),
    registrado_por uuid references auth.users(id)
);

-- =========================================================================
-- TABLA: evaluaciones
-- =========================================================================
create table if not exists public.evaluaciones (
    id uuid default gen_random_uuid() primary key,
    jugador_id uuid not null references public.jugadores(id) on delete cascade,
    evaluador_id uuid not null references auth.users(id),
    evaluador_nombre text,
    fecha timestamptz default now(),
    semana text,
    fecha_inicio date,
    fecha_fin date,
    tecnico numeric(3,1),
    tactico numeric(3,1),
    fisico numeric(3,1),
    mental numeric(3,1),
    disciplina_cancha numeric(3,1),
    disciplina_casa_club numeric(3,1),
    inasistencias integer default 0,
    rendimiento_cancha numeric(3,1),
    minutos_jugados integer default 0,
    promedio_general numeric(3,1),
    observaciones text,
    tipo text default 'semanal'
);

-- =========================================================================
-- ÍNDICES
-- =========================================================================
create index if not exists idx_evaluaciones_jugador on public.evaluaciones(jugador_id);
create index if not exists idx_evaluaciones_evaluador on public.evaluaciones(evaluador_id);
create index if not exists idx_evaluaciones_semana on public.evaluaciones(semana);
create index if not exists idx_evaluaciones_fecha on public.evaluaciones(fecha desc);
create index if not exists idx_jugadores_registrado_por on public.jugadores(registrado_por);
create index if not exists idx_jugadores_categoria on public.jugadores(categoria);

-- ────────────────────────────────────────────────────────────────────────────
-- PARTE 2: WEBVISORIAS (sistemadevisorias) — esquema `webvisorias`
-- ────────────────────────────────────────────────────────────────────────────

create schema if not exists webvisorias;

create table if not exists webvisorias.registros (
    id uuid default gen_random_uuid() primary key,
    folio text unique,
    nombre text not null,
    apellido_paterno text,
    apellido_materno text,
    fecha_nacimiento date,
    email text,
    telefono text,
    posicion text,
    equipo_anterior text,
    experiencia text,
    foto_url text,
    foto_guardada boolean default false,
    timestamp_creacion timestamptz default now()
);

-- ────────────────────────────────────────────────────────────────────────────
-- PARTE 3: IAFE DASHBOARD (sistemainstitutoazteca) — esquema `iafe`
-- ────────────────────────────────────────────────────────────────────────────

create schema if not exists iafe;

-- Usuarios (estudiantes y docentes)
create table if not exists iafe.usuarios (
    id uuid primary key references auth.users(id) on delete cascade,
    tipo text not null check (tipo in ('estudiante', 'docente')),
    nombre text not null,
    apellidos text,
    email text not null,
    curp text,
    telefono text,
    nivel_academico text,
    grupo_id uuid,
    pago_verificado boolean default false,
    activo boolean default true,
    fecha_registro timestamptz default now()
);

-- Grupos
create table if not exists iafe.grupos (
    id uuid default gen_random_uuid() primary key,
    nombre text not null,
    nivel_academico text,
    docente_id uuid references iafe.usuarios(id),
    fecha_creacion timestamptz default now()
);

-- Tareas
create table if not exists iafe.tareas (
    id uuid default gen_random_uuid() primary key,
    titulo text not null,
    descripcion text,
    grupo_id uuid references iafe.grupos(id) on delete cascade,
    docente_id uuid references iafe.usuarios(id),
    fecha_limite timestamptz,
    fecha_creacion timestamptz default now()
);

-- Calificaciones
create table if not exists iafe.calificaciones (
    id uuid default gen_random_uuid() primary key,
    estudiante_id uuid references iafe.usuarios(id) on delete cascade,
    tarea_id uuid references iafe.tareas(id) on delete cascade,
    nota numeric(4,2),
    observaciones text,
    fecha_calificacion timestamptz default now()
);

-- Mensajes
create table if not exists iafe.mensajes (
    id uuid default gen_random_uuid() primary key,
    grupo_id uuid references iafe.grupos(id) on delete cascade,
    usuario_id uuid references iafe.usuarios(id),
    nombre_usuario text,
    texto text not null,
    es_privado boolean default false,
    destinatario_id uuid,
    timestamp timestamptz default now()
);

-- FK usuario.grupo_id → grupos.id (después de crear ambas)
do $$
begin
    if not exists (
        select 1 from information_schema.table_constraints
        where constraint_name = 'fk_usuario_grupo'
        and table_name = 'usuarios'
        and table_schema = 'iafe'
    ) then
        alter table iafe.usuarios
            add constraint fk_usuario_grupo
            foreign key (grupo_id) references iafe.grupos(id);
    end if;
end $$;

-- =========================================================================
-- ÍNDICES IAFE
-- =========================================================================
create index if not exists idx_usuarios_grupo on iafe.usuarios(grupo_id);
create index if not exists idx_usuarios_tipo on iafe.usuarios(tipo);
create index if not exists idx_grupos_docente on iafe.grupos(docente_id);
create index if not exists idx_tareas_grupo on iafe.tareas(grupo_id);
create index if not exists idx_calificaciones_estudiante on iafe.calificaciones(estudiante_id);
create index if not exists idx_mensajes_grupo on iafe.mensajes(grupo_id);
create index if not exists idx_mensajes_timestamp on iafe.mensajes(timestamp desc);

-- ────────────────────────────────────────────────────────────────────────────
-- PARTE 4: ROW-LEVEL SECURITY (RLS)
-- ────────────────────────────────────────────────────────────────────────────

-- =========================================================================
-- MAIN SITE — RLS
-- =========================================================================

-- PROFESORES
alter table public.profesores enable row level security;

drop policy if exists "profesores_admin_all" on public.profesores;
drop policy if exists "profesores_own_read" on public.profesores;

create policy "profesores_admin_all" on public.profesores
    for all to authenticated
    using (
        exists (select 1 from public.profesores p where p.id = auth.uid() and p.rol = 'admin')
    )
    with check (
        exists (select 1 from public.profesores p where p.id = auth.uid() and p.rol = 'admin')
    );

create policy "profesores_own_read" on public.profesores
    for select to authenticated
    using (id = auth.uid());

-- JUGADORES
alter table public.jugadores enable row level security;

drop policy if exists "jugadores_admin_prof_read" on public.jugadores;
drop policy if exists "jugadores_own_read" on public.jugadores;
drop policy if exists "jugadores_admin_prof_write" on public.jugadores;

create policy "jugadores_admin_prof_read" on public.jugadores
    for select to authenticated
    using (
        exists (select 1 from public.profesores p where p.id = auth.uid())
    );

create policy "jugadores_own_read" on public.jugadores
    for select to authenticated
    using (id = auth.uid());

create policy "jugadores_admin_prof_write" on public.jugadores
    for all to authenticated
    using (
        exists (select 1 from public.profesores p where p.id = auth.uid())
    )
    with check (
        exists (select 1 from public.profesores p where p.id = auth.uid())
    );

-- EVALUACIONES
alter table public.evaluaciones enable row level security;

drop policy if exists "evaluaciones_prof_read" on public.evaluaciones;
drop policy if exists "evaluaciones_prof_insert" on public.evaluaciones;
drop policy if exists "evaluaciones_jugador_read" on public.evaluaciones;

create policy "evaluaciones_prof_read" on public.evaluaciones
    for select to authenticated
    using (
        evaluador_id = auth.uid()
        or exists (select 1 from public.profesores p where p.id = auth.uid() and p.rol = 'admin')
    );

create policy "evaluaciones_prof_insert" on public.evaluaciones
    for insert to authenticated
    with check (
        evaluador_id = auth.uid()
        and exists (select 1 from public.profesores p where p.id = auth.uid())
    );

create policy "evaluaciones_prof_update" on public.evaluaciones
    for update to authenticated
    using (
        evaluador_id = auth.uid()
        or exists (select 1 from public.profesores p where p.id = auth.uid() and p.rol = 'admin')
    )
    with check (
        evaluador_id = auth.uid()
        or exists (select 1 from public.profesores p where p.id = auth.uid() and p.rol = 'admin')
    );

create policy "evaluaciones_jugador_read" on public.evaluaciones
    for select to authenticated
    using (jugador_id = auth.uid());

-- =========================================================================
-- WEBVISORIAS — RLS (público, formulario de registro)
-- =========================================================================

alter table webvisorias.registros enable row level security;

drop policy if exists "registros_public_read" on webvisorias.registros;
drop policy if exists "registros_public_insert" on webvisorias.registros;

create policy "registros_public_insert" on webvisorias.registros
    for insert to anon, authenticated
    with check (true);

create policy "registros_authenticated_read" on webvisorias.registros
    for select to authenticated
    using (true);

-- =========================================================================
-- IAFE — RLS
-- =========================================================================

alter table iafe.usuarios enable row level security;
alter table iafe.grupos enable row level security;
alter table iafe.tareas enable row level security;
alter table iafe.calificaciones enable row level security;
alter table iafe.mensajes enable row level security;

drop policy if exists "iafe_usuarios_own" on iafe.usuarios;
drop policy if exists "iafe_usuarios_docente_read" on iafe.usuarios;

create policy "iafe_usuarios_own" on iafe.usuarios
    for all to authenticated
    using (id = auth.uid())
    with check (id = auth.uid());

create policy "iafe_usuarios_docente_read" on iafe.usuarios
    for select to authenticated
    using (
        exists (
            select 1 from iafe.usuarios u
            where u.id = auth.uid() and u.tipo = 'docente'
        )
    );

drop policy if exists "iafe_docente_grupos" on iafe.grupos;
drop policy if exists "iafe_estudiante_grupo" on iafe.grupos;

create policy "iafe_docente_grupos" on iafe.grupos
    for all to authenticated
    using (
        docente_id = auth.uid()
        or exists (
            select 1 from iafe.usuarios u
            where u.id = auth.uid() and u.tipo = 'docente'
        )
    )
    with check (
        docente_id = auth.uid()
        or exists (
            select 1 from iafe.usuarios u
            where u.id = auth.uid() and u.tipo = 'docente'
        )
    );

create policy "iafe_estudiante_grupo" on iafe.grupos
    for select to authenticated
    using (
        id in (select grupo_id from iafe.usuarios where id = auth.uid())
    );

drop policy if exists "iafe_tareas_docente" on iafe.tareas;
drop policy if exists "iafe_tareas_estudiante" on iafe.tareas;

create policy "iafe_tareas_docente" on iafe.tareas
    for all to authenticated
    using (docente_id = auth.uid())
    with check (docente_id = auth.uid());

create policy "iafe_tareas_estudiante" on iafe.tareas
    for select to authenticated
    using (
        grupo_id in (select grupo_id from iafe.usuarios where id = auth.uid())
    );

drop policy if exists "iafe_calificaciones_estudiante" on iafe.calificaciones;
drop policy if exists "iafe_calificaciones_docente" on iafe.calificaciones;

create policy "iafe_calificaciones_estudiante" on iafe.calificaciones
    for select to authenticated
    using (estudiante_id = auth.uid());

create policy "iafe_calificaciones_docente" on iafe.calificaciones
    for all to authenticated
    using (
        exists (
            select 1 from iafe.tareas t
            where t.id = tarea_id and t.docente_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1 from iafe.tareas t
            where t.id = tarea_id and t.docente_id = auth.uid()
        )
    );

drop policy if exists "iafe_mensajes_read" on iafe.mensajes;
drop policy if exists "iafe_mensajes_insert" on iafe.mensajes;

create policy "iafe_mensajes_read" on iafe.mensajes
    for select to authenticated
    using (
        usuario_id = auth.uid()
        or destinatario_id = auth.uid()
        or (
            es_privado = false
            and grupo_id in (select grupo_id from iafe.usuarios where id = auth.uid())
        )
    );

create policy "iafe_mensajes_insert" on iafe.mensajes
    for insert to authenticated
    with check (usuario_id = auth.uid());

-- =========================================================================
-- FIN DE LA MIGRACIÓN
-- =========================================================================
