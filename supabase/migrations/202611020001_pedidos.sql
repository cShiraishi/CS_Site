-- Pedidos do Programa 90 Dias.
--
-- O pedido nasce ANTES de a pessoa ir pagar, com estado 'pendente', e é a
-- nossa referência do que foi pedido e por quanto. Quem o confirma é o
-- webhook do Mercado Pago, nunca o navegador: o retorno do checkout é só
-- uma página de "obrigado" e pode ser aberto, copiado ou forjado por
-- qualquer um. Dar acesso com base nele seria dar o produto a quem
-- souber o endereço.
--
-- O e-mail é a chave de acesso, não o user_id. A pessoa compra sem conta
-- — exigir cadastro antes do pagamento custa vendas — e entra depois com
-- o mesmo e-mail pelo código do /entrar. O pedido encontra o dono nesse
-- momento.

create table if not exists public.pedidos (
  id bigint generated always as identity primary key,

  -- A referência que mandamos ao provedor e que ele devolve no webhook.
  -- Opaca de propósito: não revela quantos pedidos existem.
  referencia uuid not null default gen_random_uuid() unique,

  produto text not null check (length(produto) between 2 and 60),

  email text not null check (length(email) between 5 and 160),
  -- Preenchido quando a compra parte de alguém já autenticado, ou quando
  -- a conta é criada depois com o mesmo e-mail.
  user_id uuid references auth.users(id) on delete set null,

  status text not null default 'pendente'
    check (status in ('pendente', 'pago', 'recusado', 'reembolsado', 'cancelado')),

  -- Em centavos, e decidido no servidor. O valor nunca chega do
  -- navegador: quem manda o preço na requisição manda o preço que quiser.
  valor_centavos integer not null check (valor_centavos > 0),
  moeda text not null default 'BRL' check (length(moeda) = 3),

  provedor text not null default 'mercadopago',
  -- id do pagamento no provedor, para conciliação e para evitar
  -- processar duas vezes a mesma notificação.
  provedor_pagamento_id text,
  -- 'pix', 'credit_card', 'bolbradesco'… como o provedor o nomeia.
  metodo text,

  -- O perfil que gerou a compra: é com ele que o plano entregue sai
  -- igual ao que a pessoa viu na tela antes de pagar.
  plano jsonb,

  created_at timestamptz not null default now(),
  pago_em timestamptz
);

create index if not exists pedidos_email_idx on public.pedidos(lower(email));
create index if not exists pedidos_user_idx on public.pedidos(user_id);
create index if not exists pedidos_created_at_idx on public.pedidos(created_at desc);

-- Uma notificação do provedor pode chegar repetida — é esperado, e o
-- índice garante que a repetição não vire um segundo pedido pago.
create unique index if not exists pedidos_provedor_pagamento_idx
  on public.pedidos(provedor, provedor_pagamento_id)
  where provedor_pagamento_id is not null;

alter table public.pedidos enable row level security;

-- Repare no que NÃO existe aqui: política de insert ou de update para
-- anon e authenticated. Criar pedido e confirmá-lo acontecem no servidor,
-- com a chave de serviço, que passa ao largo do RLS. Se o navegador
-- pudesse escrever nesta tabela, poderia escrever `status = 'pago'`.
drop policy if exists "le os proprios pedidos" on public.pedidos;
create policy "le os proprios pedidos"
  on public.pedidos for select to authenticated
  using (
    (select auth.uid()) = user_id
    or lower(email) = lower((select auth.jwt() ->> 'email'))
  );

drop policy if exists "administrador le os pedidos" on public.pedidos;
create policy "administrador le os pedidos"
  on public.pedidos for select to authenticated
  using (public.eh_admin());

drop policy if exists "administrador atualiza os pedidos" on public.pedidos;
create policy "administrador atualiza os pedidos"
  on public.pedidos for update to authenticated
  using (public.eh_admin()) with check (public.eh_admin());

-- Quando alguém entra pela primeira vez, as compras feitas antes da conta
-- passam a apontar para ela. Sem isto, quem comprou como visitante e
-- depois criou conta veria a área de cliente vazia — e abriria um
-- pedido de reembolso por um produto que tinha.
create or replace function public.vincular_pedidos()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.pedidos
     set user_id = new.id
   where user_id is null
     and lower(email) = lower(new.email);
  return new;
end;
$$;

drop trigger if exists vincula_pedidos_ao_entrar on auth.users;
create trigger vincula_pedidos_ao_entrar
  after insert on auth.users
  for each row execute function public.vincular_pedidos();
