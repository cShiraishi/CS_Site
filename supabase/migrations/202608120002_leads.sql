-- Leads dos formulários públicos.
--
-- Antes desta tabela, quem preenchia o formulário lia "Respondo em até 24
-- horas" enquanto o contato ia apenas para o log da função na Vercel, que é
-- descartado em pouco tempo. O e-mail deixa de ser o sistema de registro e
-- passa a ser aviso: o lead fica gravado mesmo que o envio falhe.

create table if not exists public.leads (
  id bigint generated always as identity primary key,
  -- 'avaliacao' = formulário de contato; 'plano' = captura da calculadora
  tipo text not null check (tipo in ('avaliacao', 'plano')),
  nome text not null check (length(nome) between 2 and 80),
  email text not null check (length(email) between 5 and 160),
  whatsapp text not null check (length(whatsapp) between 8 and 32),
  objetivo text check (length(objetivo) <= 60),
  experiencia text check (length(experiencia) <= 100),
  frequencia text check (length(frequencia) <= 40),
  inicio text check (length(inicio) <= 60),
  mensagem text check (length(mensagem) <= 1500),
  -- Os números que a pessoa viu na tela, quando o lead vem da calculadora.
  plano jsonb,
  -- Preenchido quando a pessoa já estava autenticada; nulo para visitante.
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads(created_at desc);
create index if not exists leads_email_idx on public.leads(email);

alter table public.leads enable row level security;

-- Quem administra o site. Sem linhas aqui, ninguém lê os leads pela API —
-- que é o padrão desejado: a leitura acontece no painel do Supabase.
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Uma política que consultasse public.admins diretamente esbarraria no RLS
-- da própria tabela e devolveria sempre falso. `security definer` executa a
-- consulta com os direitos do dono, que é justamente o caso de uso previsto.
create or replace function public.eh_admin()
returns boolean language sql security definer stable set search_path = '' as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

-- O formulário é público, então o visitante anônimo precisa poder gravar.
-- Repare que existe apenas política de INSERT: sem SELECT, quem tiver a chave
-- publicável (que vai ao navegador de propósito) escreve o próprio contato e
-- não consegue baixar a lista de nomes, e-mails e telefones de mais ninguém.
drop policy if exists "registra o proprio contato" on public.leads;
create policy "registra o proprio contato"
  on public.leads for insert to anon, authenticated
  with check (true);

drop policy if exists "administrador le os leads" on public.leads;
create policy "administrador le os leads"
  on public.leads for select to authenticated
  using (public.eh_admin());

drop policy if exists "administrador atualiza os leads" on public.leads;
create policy "administrador atualiza os leads"
  on public.leads for update to authenticated
  using (public.eh_admin()) with check (public.eh_admin());

-- Para se tornar administrador, rodar no SQL Editor do Supabase depois de
-- ter entrado uma vez pelo /entrar:
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'seu@email.com';
