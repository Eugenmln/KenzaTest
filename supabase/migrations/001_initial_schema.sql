create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  price numeric(12,2) not null check (price >= 0),
  size text not null,
  color text not null,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_id, size, color)
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create type public.order_status as enum (
  'pending_whatsapp',
  'confirmed',
  'preparing',
  'completed',
  'cancelled'
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status public.order_status not null default 'pending_whatsapp',
  total numeric(12,2) not null default 0 check (total >= 0),
  customer_name text,
  customer_phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text,
  product_name text not null,
  unit_price numeric(12,2) not null check (unit_price >= 0),
  size text,
  color text,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.cart_items enable row level security;
alter table public.favorites enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Users can read own profile" on public.profiles
for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "Users manage own cart" on public.cart_items
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own favorites" on public.favorites
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users read own orders" on public.orders
for select using (auth.uid() = user_id);
create policy "Users create own orders" on public.orders
for insert with check (auth.uid() = user_id);

create policy "Users read own order items" on public.order_items
for select using (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
  )
);
create policy "Users create own order items" on public.order_items
for insert with check (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
  )
);

create index if not exists cart_items_user_id_idx on public.cart_items(user_id);
create index if not exists favorites_user_id_idx on public.favorites(user_id);
create index if not exists orders_user_id_created_at_idx on public.orders(user_id, created_at desc);
create index if not exists order_items_order_id_idx on public.order_items(order_id);
