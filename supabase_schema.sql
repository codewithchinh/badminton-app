-- ========================================================
-- BẢNG DỮ LIỆU KÈO VÃNG LAI CẦU LÔNG (BADMINTON HUB VN)
-- ========================================================

-- 1. Tạo bảng matches
create table if not exists public.matches (
  id text primary key,
  title text not null,
  court_name text not null,
  address text,
  district text not null,
  date text not null,
  start_time text not null,
  end_time text not null,
  court_number text default 'Sân 1',
  court_count int default 1,
  shuttle_type text default 'VinaStar Đỏ',
  total_slots int default 8,
  joined_players jsonb default '[]'::jsonb,
  min_level text default 'TB Yếu',
  max_level text default 'TB+',
  price_male int default 60000,
  price_female int default 40000,
  host_id text,
  host_name text,
  host_avatar text,
  host_phone text,
  host_badge text default 'Host uy tín ⭐ 5.0',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Bật tính năng Realtime (Ai vào slot là máy mọi người tự nhảy số)
alter publication supabase_realtime add table public.matches;

-- 3. Cấu hình quyền truy cập (Row Level Security)
alter table public.matches enable row level security;

-- Cho phép mọi người đọc danh sách kèo
create policy "Allow public read"
  on public.matches for select using (true);

-- Cho phép tạo kèo mới
create policy "Allow public insert"
  on public.matches for insert with check (true);

-- Cho phép cập nhật danh sách người vào kèo
create policy "Allow public update"
  on public.matches for update using (true);

-- Cho phép xóa kèo
create policy "Allow public delete"
  on public.matches for delete using (true);
