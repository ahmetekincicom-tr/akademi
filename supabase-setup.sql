-- =============================================
-- AHMET EKİNCİ AKADEMİ — Veritabanı Kurulumu
-- Bu SQL'i Supabase Dashboard > SQL Editor'de çalıştır
-- =============================================

-- 1. PROFILES tablosu (Auth kullanıcılarına bağlı)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  role text default 'student' check (role in ('student', 'admin')),
  created_at timestamptz default now()
);

-- Yeni kullanıcı kayıt olduğunda otomatik profil oluştur
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. COURSES tablosu
create table public.courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  thumbnail_url text,
  status text default 'draft' check (status in ('draft', 'published')),
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 3. MODULES tablosu (kurs içindeki bölümler)
create table public.modules (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses on delete cascade not null,
  title text not null,
  sort_order int default 0
);

-- 4. LESSONS tablosu (modül içindeki dersler)
create table public.lessons (
  id uuid default gen_random_uuid() primary key,
  module_id uuid references public.modules on delete cascade not null,
  title text not null,
  bunny_video_id text,
  duration_seconds int default 0,
  sort_order int default 0,
  is_preview boolean default false
);

-- 5. ENROLLMENTS tablosu (öğrenci-kurs kaydı)
create table public.enrollments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  course_id uuid references public.courses on delete cascade not null,
  enrolled_at timestamptz default now(),
  unique(user_id, course_id)
);

-- 6. PROGRESS tablosu (ders izleme ilerleme)
create table public.progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  lesson_id uuid references public.lessons on delete cascade not null,
  watched_seconds int default 0,
  completed boolean default false,
  last_watched_at timestamptz default now(),
  unique(user_id, lesson_id)
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Profiles
alter table public.profiles enable row level security;

create policy "Herkes profilleri görebilir"
  on public.profiles for select
  using (true);

create policy "Kullanıcı kendi profilini düzenleyebilir"
  on public.profiles for update
  using (auth.uid() = id);

-- Courses
alter table public.courses enable row level security;

create policy "Yayınlanmış kursları herkes görebilir"
  on public.courses for select
  using (status = 'published' or exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

create policy "Admin kurs ekleyebilir"
  on public.courses for insert
  with check (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

create policy "Admin kurs düzenleyebilir"
  on public.courses for update
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

create policy "Admin kurs silebilir"
  on public.courses for delete
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

-- Modules
alter table public.modules enable row level security;

create policy "Modülleri herkes görebilir"
  on public.modules for select
  using (true);

create policy "Admin modül yönetebilir"
  on public.modules for all
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

-- Lessons
alter table public.lessons enable row level security;

create policy "Dersleri herkes görebilir"
  on public.lessons for select
  using (true);

create policy "Admin ders yönetebilir"
  on public.lessons for all
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

-- Enrollments
alter table public.enrollments enable row level security;

create policy "Kullanıcı kendi kayıtlarını görebilir"
  on public.enrollments for select
  using (auth.uid() = user_id);

create policy "Admin tüm kayıtları görebilir"
  on public.enrollments for select
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

create policy "Admin kayıt ekleyebilir"
  on public.enrollments for insert
  with check (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

-- Progress
alter table public.progress enable row level security;

create policy "Kullanıcı kendi ilerlemesini görebilir"
  on public.progress for select
  using (auth.uid() = user_id);

create policy "Kullanıcı kendi ilerlemesini güncelleyebilir"
  on public.progress for insert
  with check (auth.uid() = user_id);

create policy "Kullanıcı kendi ilerlemesini düzenleyebilir"
  on public.progress for update
  using (auth.uid() = user_id);

create policy "Admin tüm ilerlemeyi görebilir"
  on public.progress for select
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));
