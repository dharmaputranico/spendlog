# spend.log 💸 — Multi-user edition

Personal expense tracker with **per-user accounts**, cloud sync, EN/ID language toggle, month/week navigation, and Google Sheets export.

## What's in this version

- 🔐 **User accounts** — email + password or Google login
- ☁ **Per-user cloud sync** — data separated at the database level via Row Level Security. No one can see anyone else's data.
- 🌐 **EN / ID language toggle** — all UI, categories, months switch instantly
- 📅 **Month navigation** — browse any past month in Ledger, Analytics, and Trends
- 📆 **Week navigation** — drill into any week within a month in Trends
- 📋 **Paginated ledger** — 10 entries at a time with See more
- 🛡 **Delete confirmation** — modal preview before any delete
- 19 categories + free-text Others
- CSV export → Google Sheets, CSV import with merge
- Offline fallback with localStorage cache
- Dark mode + mobile responsive

---

## Setup (run once)

### 1. Run the SQL migration

Open **Supabase → SQL Editor**, paste and run `supabase_migration.sql`.

This adds a `user_id` column and enables Row Level Security so each user only ever sees their own expenses.

### 2. Configure redirect URLs in Supabase

After deploying to Vercel, go to **Supabase → Authentication → URL Configuration**:
- **Site URL** → `https://your-app.vercel.app`
- **Redirect URLs** → add `https://your-app.vercel.app/**`

### 3. (Optional) Enable Google login

**Supabase → Authentication → Providers → Google → Toggle ON**

Follow the Google OAuth setup guide (requires a Google Cloud project with OAuth credentials).

---

## Deploy to Vercel

```bash
# Push to GitHub
git add . && git commit -m "multi-user" && git push

# vercel.com → New Project → Import repo → Framework: Other → Deploy
```

---

## How data isolation works

Each expense row has a `user_id` (UUID from `auth.users`). Supabase Row Level Security enforces:

| Operation | Policy |
|-----------|--------|
| SELECT | only rows where `user_id = auth.uid()` |
| INSERT | only allowed when `user_id = auth.uid()` |
| DELETE | only rows where `user_id = auth.uid()` |

This is enforced **at the database level** — even with the anon key, a user cannot read another user's data.

---

## Sharing with friends

Just share the Vercel URL. Each person:
1. Opens the URL
2. Creates an account (email + password, or Google)
3. Gets their own completely private expense tracker

---

## File structure

```
spendlog/
├── index.html              # Auth screen + main app markup
├── style.css               # All styles (auth, app, dark mode)
├── app.js                  # All logic (auth, sync, charts, i18n, navigation)
├── supabase_migration.sql  # Run once in Supabase SQL Editor
├── favicon.svg             # App icon
└── README.md
```

## Tech stack

- Vanilla HTML / CSS / JS — no framework, no build step
- [Supabase JS v2](https://supabase.com/docs/reference/javascript) — auth + database + RLS
- [Chart.js 4.4](https://www.chartjs.org/) — charts
- [Google Fonts](https://fonts.google.com/) — Sora + DM Mono
