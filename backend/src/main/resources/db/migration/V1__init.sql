create extension if not exists pgcrypto;

create table users (
    id uuid primary key default gen_random_uuid(),
    full_name varchar(120) not null,
    email varchar(255) not null unique,
    password_hash varchar(255) not null,
    phone varchar(40),
    role varchar(20) not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table categories (
    id uuid primary key default gen_random_uuid(),
    name varchar(80) not null unique,
    slug varchar(100) not null unique,
    sort_order integer not null default 0,
    visible boolean not null default true
);

create table products (
    id uuid primary key default gen_random_uuid(),
    slug varchar(140) not null unique,
    name varchar(140) not null,
    price numeric(12,2) not null check (price >= 0),
    short_description varchar(240),
    description text,
    category_id uuid not null references categories(id),
    featured boolean not null default false,
    is_new boolean not null default false,
    visible boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table product_images (
    product_id uuid not null references products(id) on delete cascade,
    position integer not null,
    image_url text not null,
    primary key (product_id, position)
);

create table product_variants (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references products(id) on delete cascade,
    size varchar(40) not null,
    color varchar(60) not null,
    stock integer not null default 0 check (stock >= 0),
    active boolean not null default true,
    unique (product_id, size, color)
);

create table cart_items (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references users(id) on delete cascade,
    variant_id uuid not null references product_variants(id),
    quantity integer not null check (quantity > 0),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (user_id, variant_id)
);

create table favorites (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references users(id) on delete cascade,
    product_id uuid not null references products(id) on delete cascade,
    created_at timestamptz not null default now(),
    unique (user_id, product_id)
);

create table orders (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references users(id),
    status varchar(30) not null,
    total numeric(12,2) not null default 0 check (total >= 0),
    customer_name varchar(120),
    customer_phone varchar(40),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references orders(id) on delete cascade,
    product_id uuid not null,
    variant_id uuid not null,
    product_name varchar(140) not null,
    size varchar(40) not null,
    color varchar(60) not null,
    unit_price numeric(12,2) not null check (unit_price >= 0),
    quantity integer not null check (quantity > 0)
);

create index idx_products_category on products(category_id);
create index idx_products_visible on products(visible);
create index idx_variants_product on product_variants(product_id);
create index idx_cart_user on cart_items(user_id);
create index idx_favorites_user on favorites(user_id);
create index idx_orders_user_created on orders(user_id, created_at desc);
create index idx_order_items_order on order_items(order_id);

insert into categories (name, slug, sort_order, visible) values
('Remeras', 'remeras', 10, true),
('Camisas', 'camisas', 20, true),
('Chombas', 'chombas', 30, true),
('Buzos', 'buzos', 40, true),
('Jeans', 'jeans', 50, true),
('Pantalones', 'pantalones', 60, true),
('Shorts', 'shorts', 70, true),
('Accesorios', 'accesorios', 80, true)
on conflict do nothing;
