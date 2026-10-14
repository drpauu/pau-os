-- PAU.OS only. No existing application resources are changed.
-- Content writes are restricted to project owners using Supabase Studio / SQL.
-- Public and signed-in application clients have SELECT access only.
create table if not exists public.portfolio_projects (
 id uuid primary key default gen_random_uuid(),
 slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 title text not null check (length(title) between 1 and 80),
 subtitle text not null default '', description text not null default '',
 content jsonb not null default '{}'::jsonb check (jsonb_typeof(content) = 'object'),
 technologies text[] not null default '{}', category text not null default '',
 repository_url text not null check (repository_url ~ '^https://'),
 live_url text check (live_url ~ '^https://'),
 cover_image text not null check (cover_image ~ '^/images/[a-z0-9-]+\.(webp|png|jpg)$'),
 gallery jsonb not null default '[]'::jsonb check (jsonb_typeof(gallery) = 'array'),
 featured boolean not null default false, published boolean not null default false,
 sort_order integer not null default 0,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists portfolio_projects_published_sort on public.portfolio_projects(sort_order) where published;
create table if not exists public.portfolio_experience (
 id uuid primary key default gen_random_uuid(), organization text not null,
 role text not null, location text, start_date date, end_date date,
 description text not null default '', sort_order integer not null default 0,
 published boolean not null default false,
 check (end_date is null or start_date is null or end_date >= start_date)
);
create table if not exists public.portfolio_content (
 id uuid primary key default gen_random_uuid(), section text not null unique,
 content jsonb not null default '{}'::jsonb check (jsonb_typeof(content)='object'),
 published boolean not null default false,
 updated_at timestamptz not null default now()
);
alter table public.portfolio_projects enable row level security;
alter table public.portfolio_experience enable row level security;
alter table public.portfolio_content enable row level security;
-- Drop/recreate only our own policies to make the migration repeatable.
drop policy if exists portfolio_public_projects on public.portfolio_projects;
create policy portfolio_public_projects on public.portfolio_projects for select to anon, authenticated using (published = true);
drop policy if exists portfolio_public_experience on public.portfolio_experience;
create policy portfolio_public_experience on public.portfolio_experience for select to anon, authenticated using (published = true);
drop policy if exists portfolio_public_content on public.portfolio_content;
create policy portfolio_public_content on public.portfolio_content for select to anon, authenticated using (published = true);
revoke all on public.portfolio_projects, public.portfolio_experience, public.portfolio_content from anon, authenticated;
grant select on public.portfolio_projects, public.portfolio_experience, public.portfolio_content to anon, authenticated;
comment on table public.portfolio_projects is 'PAU.OS public editorial content. Owner-managed in Supabase Studio. Never store private data here.';
comment on table public.portfolio_experience is 'PAU.OS optional verified professional experience. Dates may be unknown.';
comment on table public.portfolio_content is 'PAU.OS optional published section content.';
