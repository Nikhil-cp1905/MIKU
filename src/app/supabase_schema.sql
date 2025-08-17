-- Registrations table
create table if not exists registrations (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null unique,
  ra_number text not null,
  phone text not null,
  created_at timestamp default now()
);

-- Submissions table
create table if not exists submissions (
  id bigint generated always as identity primary key,
  email text not null references registrations(email) on delete cascade,
  score int not null,
  duration int not null,
  created_at timestamp default now()
);

-- Quiz status table
create table if not exists quiz_status (
  id int primary key,
  is_active boolean not null default false
);

insert into quiz_status (id, is_active)
values (1, false)
on conflict (id) do nothing;

