# spend.log 💸

A clean, fast personal expense tracker — built as a single-page web app with zero backend required. All data lives in your browser's `localStorage`, with full CSV export/import for Google Sheets backup.

## Features

- ✅ Add expenses with auto-timestamp (or manual date)
- ✅ 17 categories across Food, Living, Lifestyle, Finance — plus free-text "Others"
- ✅ **Ledger** — filterable monthly record
- ✅ **Analytics** — donut chart, daily bar chart, category % breakdown
- ✅ **Monthly Trends** — WoW & MoM %, weekly breakdown, 6-month chart
- ✅ **Yearly** — 12-month grid, YoY comparison, year stats, navigate across years
- ✅ **Import / Export** — CSV download, tab-separated copy (paste into Google Sheets), CSV import with merge (no duplicates)
- ✅ Dark mode (follows OS preference)
- ✅ Mobile responsive

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Framework preset: **Other** (it's plain HTML/CSS/JS — no build step needed)
4. Click Deploy ✓

That's it. Vercel will auto-deploy on every push.

## Local development

No build step required. Just open `index.html` in your browser, or use any static file server:

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```

## Google Sheets sync

1. In the app: **Import / Export → Download CSV**
2. Google Sheets → **File → Import → Upload** the CSV
3. Choose "Replace spreadsheet" or "Append rows"

To restore data: **File → Download → CSV**, then use **Import** in the app.

## File structure

```
spendlog/
├── index.html    # markup & layout
├── style.css     # all styles + dark mode
├── app.js        # all logic (storage, charts, import/export)
├── favicon.svg   # app icon
└── README.md
```

## Data storage

All expenses are saved in `localStorage` keyed by year/month (`spendlog_v2_YYYY_M`). Data persists between sessions in the same browser. Use the CSV export regularly as a backup — especially before clearing browser data.

## Tech stack

- Vanilla HTML / CSS / JS (no framework, no build step)
- [Chart.js 4.4](https://www.chartjs.org/) via CDN — for charts
- [Google Fonts](https://fonts.google.com/) — Sora + DM Mono
