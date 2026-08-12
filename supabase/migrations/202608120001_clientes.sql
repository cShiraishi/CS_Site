create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  nome text,
  whatsapp text,
  nascimento date,
  altura_cm numeric(5,2),
  sexo text check (sexo in ('masculino', 'feminino')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.measurements (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  weight_kg numeric(5,2) not null,
  body_fat_pct numeric(5,2),
  measured_at timestamptz not null default now()
);

create table if not exists public.calculator_results (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  bmr integer not null,
  daily_expenditure integer not null,
  target_calories integer not null,
  direction text not null check (direction in ('perder', 'ganhar', 'manter')),
  protein_g integer not null,
  carbohydrate_g integer not null,
  fat_g integer not null,
  target_weight_kg numeric(5,2),
  activity text,
  formula text,
  meals_per_day smallint check (meals_per_day between 2 and 6),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.measurements enable row level security;
alter table public.calculator_results enable row level security;

create policy "perfil proprio" on public.profiles for all to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "medicoes proprias" on public.measurements for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "resultados proprios" on public.calculator_results for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create index if not exists measurements_user_id_idx on public.measurements(user_id, measured_at desc);
create index if not exists calculator_results_user_id_idx on public.calculator_results(user_id, created_at desc);

create or replace function public.create_new_profile()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.create_new_profile();
