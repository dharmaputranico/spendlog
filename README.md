# spend.log 💸

Personal expense tracker with Supabase cloud sync, EN/ID language toggle, paginated ledger, and delete confirmation.

## What's new in this version

- 🌐 **English / Bahasa Indonesia** toggle — all UI text, categories, and labels switch instantly. Language preference is saved.
- 🛒 **Groceries** and 👶 **Babies / Children** categories added (19 total)
- 📋 **Paginated ledger** — shows 10 entries at a time with "See more" button
- 🛡 **Delete confirmation** — a modal previews the item before deleting, preventing accidental loss
- ☁ **Supabase sync** — all data synced across devices in real time

## Deploy to Vercel

1. Push to GitHub
2. [vercel.com](https://vercel.com) → New Project → Import → Framework: **Other** → Deploy

## Supabase table

```sql
create table expenses (
  id          text primary key,
  name        text not null,
  amount      numeric not null,
  cat         text not null,
  ts          timestamptz not null,
  date        text, day text, date_key text,
  created_at  timestamptz default now()
);
alter table expenses enable row level security;
create policy "Allow all" on expenses for all using (true) with check (true);
```

## Categories (stored in English, displayed in selected language)

Food & Drinks: Breakfast, Lunch, Dinner, Coffee & Drinks, Snack, Groceries, Babies/Children  
Living: Utilities, Transport, Health & Medicine, Daily necessities  
Lifestyle: Sports & Fitness, Shopping, Entertainment, Education  
Finance: Installment, Subscription, Savings/Transfer  
+ Others (free text)

## File structure

```
spendlog/
├── index.html   # markup
├── style.css    # styles + dark mode
├── app.js       # all logic (i18n, sync, charts, pagination)
├── favicon.svg
└── README.md
```
