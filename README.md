# Rally CUA

Sistema creado para el Rally CUA 2026

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```markdown
- `public/`: Contiene recursos estáticos como imágenes y fuentes.
- `src/`: Directorio principal con el código fuente del proyecto.
  - `components/`: Componentes de UI reutilizables.
  - `layouts/`: Plantillas base para las páginas.
  - `pages/`: Define las rutas y vistas del sitio.
- `astro.config.mjs`: Archivo de configuración central de Astro.
- `package.json`: Definición de dependencias y scripts de ejecución.

## 🛠️ Comandos

Todos los comandos se ejecutan desde la raíz del proyecto:

| Comando | Acción |
| :--- | :--- |
| `npm install` | Instala las dependencias necesarias. |
| `npm run dev` | Inicia el servidor de desarrollo en `localhost:4321`. |
| `npm run build` | Compila el sitio para producción en `./dist/`. |
| `npm run preview` | Previsualiza la compilación de producción localmente. |
| `npm run astro ...` | Ejecuta comandos directos de la CLI de Astro. |

## 📦 Despliegue

Este proyecto está optimizado para ser desplegado en plataformas como Vercel, Netlify o GitHub Pages mediante procesos de CI/CD automáticos.
```
## Todos los derechos reservados a la Casa Universitaria del Agua.

# Colaboradores:

>[ManuelPrg](https://github.com/ManuelPrg)

## Configuración de la base de datos en supabase

```
nombre de la BB: rally-cua
las tablas score y teams tienen el realtime activado para ver en tiempo real los resultados de cada equipo en cada fase. deberas investigar como activar el realtime en cada tabla en supabase :v
para las tablas de la bd:
create table public.registrations (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz default now(),
  team_name       text not null,
  representative  text not null,
  phone           text not null,
  email           text not null,
  members         text not null,
  how_heard       text not null,
  institution     text not null,
  experience      text not null,
  special_needs   text not null,
  comments        text
);

-- Allow public inserts (no auth required for registration)
alter table public.registrations enable row level security;
create policy "Anyone can register" on public.registrations
  for insert with check (true);

-- Equipos
create table public.teams (
  id         serial primary key,
  name       text not null,
  color      text not null default '#C4A35A',
  members    text[] not null default '{}'
);

-- Puntajes por fase
create table public.scores (
  id       serial primary key,
  team_id  int references public.teams(id) on delete cascade,
  phase_id int not null check (phase_id between 1 and 5),
  status   text not null default 'pending' check (status in ('pending','doing','done')),
  points   int  not null default 0,
  unique (team_id, phase_id)
);

-- Habilitar RLS + lectura pública (el marcador es público)
alter table public.teams  enable row level security;
alter table public.scores enable row level security;

create policy "Public read teams"  on public.teams  for select using (true);
create policy "Public read scores" on public.scores for select using (true);


```

```
Politicas de RLS:
-- Escribir desde server (usa la service key)
--create policy "Allow all inserts equipos"      on public.equipos      for insert with check (true);
--create policy "Allow all updates equipos"      on public.equipos      for update using (true);
--create policy "Allow all inserts puntuaciones" on public.puntuaciones for insert with check (true);
--create policy "Allow all updates puntuaciones" on public.puntuaciones for update using (true);

-- Leer registrations (para mostrar pendientes en el admin)
create policy "Allow select registrations"
  on public.registrations for select using (true);

-- Insertar en teams (al aprobar)
create policy "Allow insert teams"
  on public.teams for insert with check (true);

-- Insertar en scores (al inicializar fases)
create policy "Allow insert scores"
  on public.scores for insert with check (true);

alter table public.registrations
  add column approved_at timestamptz default null;
```

