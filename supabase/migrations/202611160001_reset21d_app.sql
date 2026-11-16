-- Ligação do app Reset Metabólico 21D (carlosseiti.com/resetmetabolico) ao site.
--
-- O app e o site usam o MESMO Supabase (projeto xeszfwjcruntyqvzxysn,
-- Frankfurt): uma conta só para comprar e para usar a plataforma. As tabelas
-- do app (staff, purchases, days, materials, progress, checkins…) vêm das
-- migrações do próprio app (reset-metabolico-21d/supabase/migrations) e já
-- estão aplicadas. Aqui só se liga uma coisa à outra:
--
-- * has_access(): quem comprou no site (pedido 'pago' do programa, pelo
--   e-mail da conta) entra no app. purchases continua valendo para
--   concessões manuais (teste, cortesia).
-- * is_admin(): admin do site (eh_admin) também administra o app.

begin;

-- purchases deixa de ser só "1990 eur" do antigo checkout Stripe do app.
alter table public.purchases drop constraint if exists purchases_amount_check;
alter table public.purchases add constraint purchases_amount_check check (amount >= 0);
alter table public.purchases drop constraint if exists purchases_currency_check;
alter table public.purchases add constraint purchases_currency_check check (length(currency) = 3);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists(select 1 from public.staff where user_id = (select auth.uid()))
      or coalesce(public.eh_admin(), false);
$$;

create or replace function public.has_access() returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists(
    select 1 from public.purchases p
    where p.user_id = (select auth.uid())
      and not exists(select 1 from public.revoked_payments r where r.payment_intent = p.payment_intent)
  ) or exists(
    -- Compra feita no site (Mercado Pago), confirmada pelo webhook.
    select 1 from public.pedidos o
    where o.produto = 'programa-90-dias' and o.status = 'pago'
      and (o.user_id = (select auth.uid())
           or lower(o.email) = lower((select auth.jwt()) ->> 'email'))
  );
$$;

revoke execute on function public.is_admin(), public.has_access() from public, anon, authenticated;
grant execute on function public.is_admin(), public.has_access() to authenticated;

commit;
