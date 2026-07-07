-- Planning schema only. Not applied by this frontend foundation.
-- Every business-owned query must include business_id.

create table users (
  id uuid primary key,
  email text not null unique,
  display_name text not null,
  created_at timestamptz not null default now()
);

create table business_profiles (
  id uuid primary key,
  name text not null,
  industry text not null,
  settings jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table business_memberships (
  business_id uuid not null references business_profiles(id),
  user_id uuid not null references users(id),
  role text not null check (role in ('owner','admin','member','helper')),
  primary key (business_id, user_id)
);

create table customers (
  id uuid primary key,
  business_id uuid not null references business_profiles(id),
  name text not null,
  contact jsonb not null default '{}',
  status text not null,
  created_at timestamptz not null default now()
);
create index customers_business_idx on customers(business_id, name);

create table estimates (
  id uuid primary key,
  business_id uuid not null references business_profiles(id),
  customer_id uuid not null references customers(id),
  estimate_number text not null,
  current_version integer not null default 1,
  status text not null,
  unique (business_id, estimate_number)
);

create table estimate_versions (
  id uuid primary key,
  estimate_id uuid not null references estimates(id),
  version integer not null,
  status text not null,
  content jsonb not null,
  total numeric(12,2) not null,
  customer_note text,
  customer_action text,
  client_view_snapshot jsonb not null default '{}',
  changed_by uuid references users(id),
  snapshot_object_key text, -- immutable official PDF/document version
  created_at timestamptz not null default now(),
  unique (estimate_id, version)
);

create table public_approval_links (
  id uuid primary key,
  business_id uuid not null references business_profiles(id),
  estimate_id uuid not null references estimates(id),
  token_hash text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table activity_log (
  id uuid primary key,
  business_id uuid not null references business_profiles(id),
  actor_user_id uuid references users(id),
  action text not null,
  record_type text not null,
  record_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index activity_business_time_idx on activity_log(business_id, created_at desc);

create table helper_access_grants (
  id uuid primary key,
  business_id uuid not null references business_profiles(id),
  project_id uuid not null,
  grantee_user_id uuid not null references users(id),
  permissions jsonb not null,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

-- Additional business-owned tables follow the same pattern: leads, invoices,
-- invoice_versions, payments, progress_invoices, change_orders, projects,
-- files, QR codes, promos, posts, designs, templates, applied_kits,
-- help_requests, help_quotes, integrations, sync_records, notifications,
-- and setup_tasks.
