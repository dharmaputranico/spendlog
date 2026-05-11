-- =============================================
--  spend.log — Multi-user migration
--  Run this in: Supabase → SQL Editor → Run
-- =============================================

-- 1. Drop the old open policy
drop policy if exists "Allow all" on expenses;

-- 2. Add user_id column (links each row to an auth user)
alter table expenses
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- 3. Row Level Security — each user sees ONLY their own rows
create policy "select_own" on expenses
  for select using (auth.uid() = user_id);

create policy "insert_own" on expenses
  for insert with check (auth.uid() = user_id);

create policy "delete_own" on expenses
  for delete using (auth.uid() = user_id);

-- 4. Performance indexes
create index if not exists expenses_user_id_idx on expenses(user_id);
create index if not exists expenses_ts_idx       on expenses(ts desc);

-- =============================================
--  OPTIONAL: Enable Google login
--  Supabase Dashboard →
--  Authentication → Providers → Google → ON
--  Then add your Vercel URL to:
--  Authentication → URL Configuration → Redirect URLs
-- =============================================
