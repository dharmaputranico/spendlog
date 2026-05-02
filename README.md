# spend.log 💸

A clean, fast personal expense tracker with **real-time cloud sync via Supabase**. Add expenses on your phone, instantly see them on your laptop — and vice versa.

## Features

- ☁ **Real-time sync** across all devices via Supabase
- ✅ Add expenses with auto-timestamp (or manual date)
- ✅ 17 categories across Food, Living, Lifestyle, Finance — plus free-text "Others"
- ✅ **Ledger** — filterable monthly record
- ✅ **Analytics** — donut chart, daily bar chart, category % breakdown
- ✅ **Monthly Trends** — WoW & MoM %, weekly breakdown, 6-month chart
- ✅ **Yearly** — 12-month grid, YoY comparison, year stats, navigate across years
- ✅ **Import / Export** — CSV download, paste into Google Sheets, CSV import
- ✅ **Offline fallback** — works offline with cached data, syncs when back online
- ✅ Dark mode (follows OS preference)
- ✅ Mobile responsive

## Supabase Setup

You only need to do this once.

### 1. Create a Supabase project
Go to [supabase.com](https://supabase.com) → New Project

### 2. Run this SQL in the SQL Editor

```sql
create table expenses (
  id          text primary key,
  name        text not null,
  amount      numeric not null,
  cat         text not null,
  ts          timestamptz not null,
  date        text,
  day         text,
  date_key    text,
  created_at  timestamptz default now()
);

alter table expenses enable row level security;

create policy "Allow all" on expenses
  for all using (true) with check (true);
```

### 3. Add your credentials to `app.js`

```js
const SUPABASE_URL = 'your-project-url';
const SUPABASE_KEY = 'your-anon-key';
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Framework preset: **Other** (no build step)
4. Click **Deploy** ✓

Vercel auto-deploys on every `git push`.

## Local development

```bash
# Python
python -m http.server 8080

# Node
npx serve .
```

> Note: open via `http://localhost:8080`, not `file://` — Supabase needs HTTP.

## Google Sheets sync

1. **Import / Export → Download CSV**
2. Google Sheets → **File → Import → Upload**
3. Choose "Replace spreadsheet" or "Append rows"

## File structure

```
spendlog/
├── index.html    # markup & layout
├── style.css     # all styles + dark mode + loading/toast
├── app.js        # all logic (Supabase sync, charts, import/export)
├── favicon.svg   # app icon
└── README.md
```

## How sync works

- On load: fetches all expenses from Supabase, caches locally
- On add: optimistically shows in UI, then saves to Supabase
- On delete: removes from UI immediately, then deletes from Supabase
- On import: upserts all new rows to Supabase
- Offline: uses localStorage cache, shows sync status indicator
- Back online: automatically re-fetches from Supabase

## Tech stack

- Vanilla HTML / CSS / JS — no framework, no build step
- [Supabase JS v2](https://supabase.com/docs/reference/javascript) — cloud database
- [Chart.js 4.4](https://www.chartjs.org/) — charts
- [Google Fonts](https://fonts.google.com/) — Sora + DM Mono
