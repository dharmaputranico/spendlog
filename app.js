/* =============================================
   spend.log — app.js
   Features: Supabase sync, EN/ID i18n,
             paginated ledger, delete confirm,
             19 categories incl. Groceries & Babies
   ============================================= */

'use strict';

// ── SUPABASE ───────────────────────────────────────────────────────────────

const SUPABASE_URL = 'https://wpnsxvpjxfyevrdxqiln.supabase.co';
const SUPABASE_KEY = 'sb_publishable_U6c6OJhIs9yem90wJAmHYg_E-VC4LMj';
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── i18n ───────────────────────────────────────────────────────────────────

const I18N = {
  en: {
    // Header / UI
    importExport:      '⇅ Import / Export',
    thisMonth:         'This month',
    thisWeek:          'This week',
    vsLastMonth:       'vs last month',
    vsLastWeek:        'vs last week',
    // Form
    name:              'Name',
    namePlaceholder:   'e.g. Nasi padang',
    amount:            'Amount (Rp)',
    category:          'Category',
    addBtn:            '+ Add',
    specifyCategory:   'Specify category',
    specifyPlaceholder:'e.g. Wedding gift, Pet food…',
    manualDate:        'Manual date (optional):',
    dateHint:          'Leave blank to use today',
    // Tabs
    tabLedger:         'Ledger',
    tabAnalytics:      'Analytics',
    tabTrends:         'Monthly Trends',
    tabYearly:         'Yearly',
    // Ledger
    date:              'Date',
    all:               'All',
    noEntries:         'No entries yet — add your first expense above!',
    seeMore:           'See more',
    showing:           'Showing',
    of:                'of',
    entries:           'entries',
    // Analytics
    byCategory:        'By category',
    dailySpend:        'Daily spend — this month',
    catBreakdown:      'Category breakdown',
    // Trends
    weeklySpend:       'Weekly spend this month',
    wowMomSummary:     'WoW & MoM summary',
    topCategories:     'Top categories',
    momChart:          'Month-over-month (last 6 months)',
    monthTotal:        'Month total',
    lastWeek:          'Last week',
    avgPerDay:         'Avg / day',
    lastMonth:         'Last month',
    noData:            'No data',
    // Yearly
    yearOverview:      'Year overview',
    prev:              'Prev',
    next:              'Next',
    yearStats:         'Year stats',
    yearOverYear:      'Year-over-year',
    yearlyCatBreakdown:'Yearly category breakdown',
    yearTotal:         'Year total',
    avgPerMonth:       'Avg / month',
    peakMonth:         'Peak month',
    lowestMonth:       'Lowest month',
    activeMonths:      'Active months',
    yoyChange:         'YoY change',
    noDataYear:        'No data for this year',
    // Modal
    importExportTitle: 'Import & Export',
    export:            'Export',
    exportDesc:        'Download all data as CSV — opens in Google Sheets via File → Import.',
    downloadCSV:       '⬇ Download CSV (all data)',
    copyTSV:           '⎘ Copy tab-separated (paste into Sheets)',
    copySuccess:       'Copied! Paste into Google Sheets cell A1.',
    import:            'Import from CSV',
    importDesc:        'Import a previously exported CSV. Merges with existing data (no duplicates).',
    chooseFile:        '⬆ Choose CSV file',
    importSuccess:     'Import successful!',
    cloudSync:         '☁ Cloud sync',
    cloudDesc:         'Your data syncs automatically to Supabase. Open on any device and your expenses will be up to date.',
    // Delete modal
    confirmDelete:     'Delete expense?',
    deleteWarning:     'This action cannot be undone.',
    cancel:            'Cancel',
    yesDelete:         'Yes, delete',
    // Sync
    loading:           'Loading…',
    connecting:        'Connecting to cloud…',
    synced:            'Synced',
    saving:            'Saving…',
    deleting:          'Deleting…',
    importing:         'Importing…',
    offline:           'Offline',
    saveFailed:        'Save failed',
    deleteFailed:      'Delete failed',
    syncFailed:        'Sync failed',
    // Toasts
    toastSaved:        '✓ Saved & synced',
    toastOffline:      '⚠ You are offline — changes saved locally',
    toastBackOnline:   '🌐 Back online — syncing…',
    toastSaveErr:      '⚠ Could not save to cloud',
    toastDeleteErr:    '⚠ Delete failed — refreshing',
    toastCached:       '⚠ Could not reach cloud — showing cached data',
    // Category groups
    groupFoodDrinks:   'Food & Drinks',
    groupLiving:       'Living',
    groupLifestyle:    'Lifestyle',
    groupFinance:      'Finance',
    // Categories
    catBreakfast:      'Breakfast',
    catLunch:          'Lunch',
    catDinner:         'Dinner',
    catCoffee:         'Coffee & Drinks',
    catSnack:          'Snack',
    catGroceries:      'Groceries',
    catBabies:         'Babies / Children',
    catUtilities:      'Utilities',
    catTransport:      'Transport',
    catHealth:         'Health & Medicine',
    catDaily:          'Daily necessities',
    catSports:         'Sports & Fitness',
    catShopping:       'Shopping',
    catEntertainment:  'Entertainment',
    catEducation:      'Education',
    catInstallment:    'Installment',
    catSubscription:   'Subscription',
    catSavings:        'Savings / Transfer',
    catOthers:         'Others (specify below)',
    catOthersShort:    'Others',
  },
  id: {
    importExport:      '⇅ Impor / Ekspor',
    thisMonth:         'Bulan ini',
    thisWeek:          'Minggu ini',
    vsLastMonth:       'vs bulan lalu',
    vsLastWeek:        'vs minggu lalu',
    name:              'Nama',
    namePlaceholder:   'cth. Nasi padang',
    amount:            'Jumlah (Rp)',
    category:          'Kategori',
    addBtn:            '+ Tambah',
    specifyCategory:   'Tulis kategori',
    specifyPlaceholder:'cth. Kado nikahan, Makanan kucing…',
    manualDate:        'Tanggal manual (opsional):',
    dateHint:          'Biarkan kosong untuk hari ini',
    tabLedger:         'Catatan',
    tabAnalytics:      'Analitik',
    tabTrends:         'Tren Bulanan',
    tabYearly:         'Tahunan',
    date:              'Tanggal',
    all:               'Semua',
    noEntries:         'Belum ada catatan — tambahkan pengeluaran pertamamu!',
    seeMore:           'Lihat lebih',
    showing:           'Menampilkan',
    of:                'dari',
    entries:           'catatan',
    byCategory:        'Per kategori',
    dailySpend:        'Pengeluaran harian — bulan ini',
    catBreakdown:      'Rincian kategori',
    weeklySpend:       'Pengeluaran mingguan bulan ini',
    wowMomSummary:     'Ringkasan WoW & MoM',
    topCategories:     'Kategori teratas',
    momChart:          'Perbandingan bulan (6 bulan terakhir)',
    monthTotal:        'Total bulan ini',
    lastWeek:          'Minggu lalu',
    avgPerDay:         'Rata-rata / hari',
    lastMonth:         'Bulan lalu',
    noData:            'Belum ada data',
    yearOverview:      'Ikhtisar tahun',
    prev:              'Sebelum',
    next:              'Berikut',
    yearStats:         'Statistik tahun',
    yearOverYear:      'Tahun ke tahun',
    yearlyCatBreakdown:'Rincian kategori tahunan',
    yearTotal:         'Total tahun',
    avgPerMonth:       'Rata-rata / bulan',
    peakMonth:         'Bulan tertinggi',
    lowestMonth:       'Bulan terendah',
    activeMonths:      'Bulan aktif',
    yoyChange:         'Perubahan YoY',
    noDataYear:        'Belum ada data tahun ini',
    importExportTitle: 'Impor & Ekspor',
    export:            'Ekspor',
    exportDesc:        'Unduh semua data sebagai CSV — buka di Google Sheets via File → Import.',
    downloadCSV:       '⬇ Unduh CSV (semua data)',
    copyTSV:           '⎘ Salin tab-separated (tempel ke Sheets)',
    copySuccess:       'Disalin! Tempel ke Google Sheets sel A1.',
    import:            'Impor dari CSV',
    importDesc:        'Impor CSV yang sudah diekspor. Digabung dengan data yang ada (tanpa duplikat).',
    chooseFile:        '⬆ Pilih file CSV',
    importSuccess:     'Impor berhasil!',
    cloudSync:         '☁ Sinkronisasi cloud',
    cloudDesc:         'Data kamu tersinkron otomatis ke Supabase. Buka di perangkat manapun, data akan selalu terkini.',
    confirmDelete:     'Hapus pengeluaran?',
    deleteWarning:     'Tindakan ini tidak bisa dibatalkan.',
    cancel:            'Batal',
    yesDelete:         'Ya, hapus',
    loading:           'Memuat…',
    connecting:        'Menghubungkan ke cloud…',
    synced:            'Tersinkron',
    saving:            'Menyimpan…',
    deleting:          'Menghapus…',
    importing:         'Mengimpor…',
    offline:           'Offline',
    saveFailed:        'Gagal simpan',
    deleteFailed:      'Gagal hapus',
    syncFailed:        'Sinkronisasi gagal',
    toastSaved:        '✓ Tersimpan & tersinkron',
    toastOffline:      '⚠ Kamu offline — perubahan disimpan lokal',
    toastBackOnline:   '🌐 Kembali online — menyinkronkan…',
    toastSaveErr:      '⚠ Gagal menyimpan ke cloud',
    toastDeleteErr:    '⚠ Gagal hapus — memuat ulang',
    toastCached:       '⚠ Tidak bisa terhubung ke cloud — menampilkan data cache',
    groupFoodDrinks:   'Makanan & Minuman',
    groupLiving:       'Kebutuhan Hidup',
    groupLifestyle:    'Gaya Hidup',
    groupFinance:      'Keuangan',
    catBreakfast:      'Sarapan',
    catLunch:          'Makan Siang',
    catDinner:         'Makan Malam',
    catCoffee:         'Kopi & Minuman',
    catSnack:          'Camilan',
    catGroceries:      'Belanja Dapur',
    catBabies:         'Bayi / Anak-anak',
    catUtilities:      'Utilitas',
    catTransport:      'Transportasi',
    catHealth:         'Kesehatan & Obat',
    catDaily:          'Kebutuhan sehari-hari',
    catSports:         'Olahraga & Kebugaran',
    catShopping:       'Belanja',
    catEntertainment:  'Hiburan',
    catEducation:      'Pendidikan',
    catInstallment:    'Cicilan',
    catSubscription:   'Langganan',
    catSavings:        'Tabungan / Transfer',
    catOthers:         'Lainnya (isi di bawah)',
    catOthersShort:    'Lainnya',
  }
};

// Category key → CSS class & chart color (language-independent)
const CAT_KEYS = [
  'catBreakfast','catLunch','catDinner','catCoffee','catSnack','catGroceries','catBabies',
  'catUtilities','catTransport','catHealth','catDaily',
  'catSports','catShopping','catEntertainment','catEducation',
  'catInstallment','catSubscription','catSavings','catOthers'
];

const CAT_COLS = [
  '#EF9F27','#1D9E75','#639922','#9B4E00','#856404','#D4860A','#E91E8C',
  '#378ADD','#0A6B6B','#7a2d9c','#888780',
  '#D85A30','#D4537E','#BF360C','#2E7D32',
  '#7F77DD','#3949AB','#1565C0','#6A1B9A'
];

const CAT_CSS = [
  'cc-breakfast','cc-lunch','cc-dinner','cc-coffee','cc-snack','cc-groceries','cc-babies',
  'cc-utilities','cc-transport','cc-health','cc-daily',
  'cc-sports','cc-shopping','cc-entertainment','cc-education',
  'cc-installment','cc-subscription','cc-savings','cc-others'
];

// ── STATE ──────────────────────────────────────────────────────────────────

let allExpenses    = [];
let activeFilter   = 'All';
let viewYear       = new Date().getFullYear();
let lang           = localStorage.getItem('spendlog_lang') || 'en';
let ledgerPage     = 1;
const PAGE_SIZE    = 10;
let pendingDeleteId = null;

let catChartInst = null, dailyChartInst = null, momChartInst = null, yrChartInst = null;

const now = new Date();

// ── TRANSLATION HELPERS ────────────────────────────────────────────────────

function t(key) { return I18N[lang][key] || I18N['en'][key] || key; }

// Returns the EN display name for a given category key
// (used as the stable stored value in Supabase)
function catKeyToEN(key) { return I18N['en'][key] || key; }

// Returns the current-lang display name for a stored EN category name
function catENtoDisplay(enName) {
  const idx = CAT_KEYS.findIndex(k => I18N['en'][k] === enName);
  if (idx >= 0) return t(CAT_KEYS[idx]);
  return enName; // custom "Others" text
}

function catENtoColor(enName) {
  const idx = CAT_KEYS.findIndex(k => I18N['en'][k] === enName);
  return idx >= 0 ? CAT_COLS[idx] : '#888';
}

function catENtoCSS(enName) {
  const idx = CAT_KEYS.findIndex(k => I18N['en'][k] === enName);
  return idx >= 0 ? CAT_CSS[idx] : 'cc-others';
}

// ── APPLY LANGUAGE ─────────────────────────────────────────────────────────

function applyLanguage() {
  // Update all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = t(key);
    } else {
      el.textContent = t(key);
    }
  });

  // Placeholder inputs
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });

  // Language toggle button
  const isEN = lang === 'en';
  document.getElementById('lang-flag').textContent = isEN ? '🇮🇩' : '🇬🇧';
  document.getElementById('lang-label').textContent = isEN ? 'ID' : 'EN';

  // Rebuild category dropdown
  buildCategorySelect();

  // Re-render dynamic content
  const label = now.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { month: 'long', year: 'numeric' });
  document.getElementById('month-badge').textContent  = label;
  document.getElementById('ledger-title').textContent = label;

  buildFilterChips();
  renderLedger();

  const activeTab = document.querySelector('.tab.active');
  if (activeTab) {
    const tabMap = { tabLedger:'ledger', tabAnalytics:'analytics', tabTrends:'trends', tabYearly:'yearly' };
    const key2 = activeTab.getAttribute('data-i18n');
    const tabId = tabMap[key2];
    if (tabId === 'analytics') renderCharts();
    if (tabId === 'trends')    renderTrends();
    if (tabId === 'yearly')    renderYearly();
  }
}

function toggleLang() {
  lang = lang === 'en' ? 'id' : 'en';
  localStorage.setItem('spendlog_lang', lang);
  applyLanguage();
}

function buildCategorySelect() {
  const sel = document.getElementById('inp-cat');
  const currentVal = sel.value;

  const groups = [
    { labelKey: 'groupFoodDrinks', cats: ['catBreakfast','catLunch','catDinner','catCoffee','catSnack','catGroceries','catBabies'] },
    { labelKey: 'groupLiving',     cats: ['catUtilities','catTransport','catHealth','catDaily'] },
    { labelKey: 'groupLifestyle',  cats: ['catSports','catShopping','catEntertainment','catEducation'] },
    { labelKey: 'groupFinance',    cats: ['catInstallment','catSubscription','catSavings'] },
  ];

  sel.innerHTML = '';
  groups.forEach(g => {
    const og = document.createElement('optgroup');
    og.label = t(g.labelKey);
    g.cats.forEach(key => {
      const opt = document.createElement('option');
      opt.value = catKeyToEN(key); // always store EN name
      opt.textContent = t(key);
      // Default selection: Lunch
      if (key === 'catLunch') opt.selected = true;
      og.appendChild(opt);
    });
    sel.appendChild(og);
  });

  // Others option
  const othOpt = document.createElement('option');
  othOpt.value = catKeyToEN('catOthers');
  othOpt.textContent = t('catOthers');
  sel.appendChild(othOpt);

  // Restore previous selection if possible
  if (currentVal) sel.value = currentVal;
}

// ── SYNC UI ────────────────────────────────────────────────────────────────

function setSyncStatus(state, labelKey) {
  document.getElementById('sync-dot').className    = 'sync-dot ' + state;
  document.getElementById('sync-label').textContent = t(labelKey);
}

let toastTimer = null;
function showToast(msg, duration = 2800) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), duration);
}

// ── CACHE ──────────────────────────────────────────────────────────────────

function cacheAll()  { try { localStorage.setItem('spendlog_cache', JSON.stringify(allExpenses)); } catch(e) {} }
function loadCache() { try { return JSON.parse(localStorage.getItem('spendlog_cache') || '[]'); } catch(e) { return []; } }

// ── ROW MAPPING ────────────────────────────────────────────────────────────

function rowToExp(row) {
  const d = new Date(row.ts);
  return {
    id:      row.id,
    name:    row.name,
    amount:  parseFloat(row.amount),
    cat:     row.cat,   // stored in EN
    ts:      row.ts,
    date:    d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
    day:     d.toLocaleDateString('en', { weekday: 'short' }),
    dateKey: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
  };
}

function expToRow(exp) {
  return { id: String(exp.id), name: exp.name, amount: exp.amount,
    cat: exp.cat, ts: exp.ts, date: exp.date, day: exp.day, date_key: exp.dateKey };
}

// ── LOAD ───────────────────────────────────────────────────────────────────

async function loadFromSupabase() {
  setSyncStatus('syncing', 'loading');
  document.getElementById('loading-text').textContent = t('connecting');

  const { data, error } = await db.from('expenses').select('*').order('ts', { ascending: false });

  if (error) {
    console.error(error);
    setSyncStatus('error', 'offline');
    allExpenses = loadCache();
    showToast(t('toastCached'));
  } else {
    allExpenses = (data || []).map(rowToExp);
    cacheAll();
    setSyncStatus('synced', 'synced');
  }
}

// ── ADD EXPENSE ────────────────────────────────────────────────────────────

function onCatChange() {
  const v = document.getElementById('inp-cat').value;
  const othersEN = catKeyToEN('catOthers');
  document.getElementById('other-row').style.display = v === othersEN ? 'block' : 'none';
}

async function addExpense() {
  const name   = document.getElementById('inp-name').value.trim();
  const amount = parseFloat(document.getElementById('inp-amount').value);
  const selVal = document.getElementById('inp-cat').value;
  const othersEN = catKeyToEN('catOthers');
  let cat = selVal;
  if (selVal === othersEN) {
    const custom = document.getElementById('inp-other-cat').value.trim();
    if (custom) cat = custom;
  }

  if (!name || isNaN(amount) || amount <= 0) { document.getElementById('inp-name').focus(); return; }

  const manualDate = document.getElementById('inp-date').value;
  const d = manualDate ? new Date(manualDate + 'T12:00:00') : new Date();

  const exp = {
    id:      String(Date.now()) + String(Math.random()).slice(2, 7),
    name, amount, cat,
    ts:      d.toISOString(),
    date:    d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
    day:     d.toLocaleDateString('en', { weekday: 'short' }),
    dateKey: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
  };

  // Optimistic
  allExpenses.unshift(exp);
  ledgerPage = 1;
  buildFilterChips(); render();

  ['inp-name','inp-amount','inp-date','inp-other-cat'].forEach(id => { document.getElementById(id).value = ''; });
  document.getElementById('other-row').style.display = 'none';
  document.getElementById('inp-name').focus();

  const btn = document.getElementById('add-btn');
  btn.disabled = true;
  setSyncStatus('syncing', 'saving');

  const { error } = await db.from('expenses').insert([expToRow(exp)]);
  btn.disabled = false;

  if (error) {
    console.error(error);
    setSyncStatus('error', 'saveFailed');
    showToast(t('toastSaveErr'));
    cacheAll();
  } else {
    setSyncStatus('synced', 'synced');
    cacheAll();
    showToast(t('toastSaved'));
  }
}

// ── DELETE — two-step ──────────────────────────────────────────────────────

function deleteExpense(id) {
  const exp = allExpenses.find(e => String(e.id) === String(id));
  if (!exp) return;
  pendingDeleteId = String(id);

  // Show confirm modal
  const preview = document.getElementById('delete-preview');
  preview.innerHTML = `
    <div class="dp-name">${exp.name}</div>
    <div class="dp-detail">
      <span>${exp.date}</span>
      <span>${catENtoDisplay(exp.cat)}</span>
      <span style="font-family:'DM Mono',monospace;font-weight:500">${fmt(exp.amount)}</span>
    </div>`;

  // Re-apply i18n to modal buttons
  document.getElementById('delete-modal').querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });

  document.getElementById('delete-modal').classList.add('open');
}

function closeDeleteModal() {
  document.getElementById('delete-modal').classList.remove('open');
  pendingDeleteId = null;
}

async function confirmDelete() {
  if (!pendingDeleteId) return;
  const id = pendingDeleteId;
  closeDeleteModal();

  allExpenses = allExpenses.filter(e => String(e.id) !== id);
  render();
  setSyncStatus('syncing', 'deleting');

  const { error } = await db.from('expenses').delete().eq('id', id);
  if (error) {
    console.error(error);
    setSyncStatus('error', 'deleteFailed');
    showToast(t('toastDeleteErr'));
    await loadFromSupabase(); render();
  } else {
    setSyncStatus('synced', 'synced');
    cacheAll();
  }
}

// ── PAGINATION ─────────────────────────────────────────────────────────────

function seeMore() {
  ledgerPage++;
  renderLedger();
}

// ── FILTER CHIPS ───────────────────────────────────────────────────────────

function setFilter(f, el) {
  activeFilter = f;
  ledgerPage   = 1;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  renderLedger();
}

function buildFilterChips() {
  const usedCats = [...new Set(thisMonthExp().map(e => e.cat))];
  const row = document.getElementById('filter-chips');
  row.innerHTML = `<div class="chip${activeFilter === 'All' ? ' active' : ''}" onclick="setFilter('All',this)">${t('all')}</div>`;
  usedCats.forEach(c => {
    const el = document.createElement('div');
    el.className  = 'chip' + (activeFilter === c ? ' active' : '');
    el.textContent = catENtoDisplay(c);
    el.onclick = function () { setFilter(c, this); };
    row.appendChild(el);
  });
}

// ── TABS ───────────────────────────────────────────────────────────────────

function switchTab(tab, el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + tab).classList.add('active');
  if (tab === 'analytics') renderCharts();
  if (tab === 'trends')    renderTrends();
  if (tab === 'yearly')    renderYearly();
}

// ── HELPERS ────────────────────────────────────────────────────────────────

function thisMonthExp() {
  return allExpenses.filter(e => {
    const d = new Date(e.ts);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });
}

function getWeekNum(d) {
  const jan1 = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
}

function fmt(n)  { return 'Rp ' + Math.round(n).toLocaleString('id-ID'); }
function fmtS(n) {
  if (n >= 1e9) return 'Rp ' + (n / 1e9).toFixed(1) + 'M';
  if (n >= 1e6) return 'Rp ' + (n / 1e6).toFixed(1) + 'jt';
  return 'Rp ' + Math.round(n / 1000) + 'k';
}

function pctBadge(pct) {
  if (pct === null) return `<span class="badge b-neu">—</span>`;
  return `<span class="badge ${pct > 0 ? 'b-up' : 'b-dn'}">${pct > 0 ? '+' : ''}${pct.toFixed(1)}%</span>`;
}

// ── RENDER ─────────────────────────────────────────────────────────────────

function render() { renderMetrics(); buildFilterChips(); renderLedger(); }

function renderMetrics() {
  const monthly     = thisMonthExp();
  const total       = monthly.reduce((s, e) => s + e.amount, 0);
  const thisWk      = getWeekNum(now);
  const wkTotal     = monthly.filter(e => getWeekNum(new Date(e.ts)) === thisWk).reduce((s,e)=>s+e.amount,0);
  const prevWkTotal = monthly.filter(e => getWeekNum(new Date(e.ts)) === thisWk-1).reduce((s,e)=>s+e.amount,0);

  document.getElementById('m-total').textContent = fmtS(total);
  document.getElementById('m-count').textContent = `${monthly.length} ${t('entries')}`;
  document.getElementById('m-week').textContent  = fmtS(wkTotal);
  document.getElementById('m-week-sub').textContent = `week ${thisWk}`;

  const wowEl = document.getElementById('m-wow');
  if (prevWkTotal > 0) {
    const pct = (wkTotal - prevWkTotal) / prevWkTotal * 100;
    wowEl.textContent = (pct > 0 ? '+' : '') + pct.toFixed(1) + '%';
    wowEl.className   = 'mval ' + (pct > 0 ? 'up' : 'down');
  } else { wowEl.textContent = '—'; wowEl.className = 'mval neu'; }

  const prevMo      = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMoTotal = allExpenses
    .filter(e => { const d = new Date(e.ts); return d.getFullYear() === prevMo.getFullYear() && d.getMonth() === prevMo.getMonth(); })
    .reduce((s,e)=>s+e.amount,0);

  const momEl = document.getElementById('m-mom');
  if (prevMoTotal > 0) {
    const pct = (total - prevMoTotal) / prevMoTotal * 100;
    momEl.textContent = (pct > 0 ? '+' : '') + pct.toFixed(1) + '%';
    momEl.className   = 'mval ' + (pct > 0 ? 'up' : 'down');
    document.getElementById('m-mom-sub').textContent = fmtS(prevMoTotal) + ' ' + t('lastMonth').toLowerCase();
  } else { momEl.textContent = '—'; momEl.className = 'mval neu'; document.getElementById('m-mom-sub').textContent = t('vsLastMonth'); }
}

function renderLedger() {
  const monthly  = thisMonthExp().sort((a, b) => new Date(b.ts) - new Date(a.ts));
  const filtered = activeFilter === 'All' ? monthly : monthly.filter(e => e.cat === activeFilter);
  const tbody    = document.getElementById('ledger-body');
  const empty    = document.getElementById('ledger-empty');
  const pagination = document.getElementById('pagination');

  if (!filtered.length) {
    tbody.innerHTML = '';
    empty.style.display  = '';
    pagination.style.display = 'none';
    return;
  }
  empty.style.display = 'none';

  const total   = filtered.length;
  const visible = ledgerPage * PAGE_SIZE;
  const shown   = Math.min(visible, total);
  const slice   = filtered.slice(0, shown);

  tbody.innerHTML = slice.map(e => `
    <tr>
      <td><div class="day-lbl">${e.day}</div><div style="font-size:11px;color:var(--muted)">${e.date}</div></td>
      <td>${e.name}</td>
      <td class="col-cat"><span class="cat-pill ${catENtoCSS(e.cat)}">${catENtoDisplay(e.cat)}</span></td>
      <td style="text-align:right;font-family:'DM Mono',monospace;font-size:12px">${fmt(e.amount)}</td>
      <td><button class="del-btn" onclick="deleteExpense('${e.id}')" title="${t('confirmDelete')}">×</button></td>
    </tr>`).join('');

  // Pagination
  if (total <= PAGE_SIZE) {
    pagination.style.display = 'none';
  } else {
    pagination.style.display = 'flex';
    document.getElementById('page-info').textContent =
      `${t('showing')} ${shown} ${t('of')} ${total} ${t('entries')}`;
    const btn = document.getElementById('btn-see-more');
    btn.textContent = t('seeMore');
    btn.disabled = shown >= total;
    btn.style.display = shown >= total ? 'none' : '';
  }
}

// ── ANALYTICS ──────────────────────────────────────────────────────────────

function renderCharts() {
  const monthly   = thisMonthExp();
  const catMap    = {};
  monthly.forEach(e => { catMap[e.cat] = (catMap[e.cat] || 0) + e.amount; });
  const total     = monthly.reduce((s,e)=>s+e.amount,0);
  const actCats   = Object.keys(catMap).sort((a,b)=>catMap[b]-catMap[a]);
  const aColors   = actCats.map(c => catENtoColor(c));

  document.getElementById('cat-legend').innerHTML = actCats.map((c,i) =>
    `<span style="display:inline-flex;align-items:center;gap:3px;margin:2px 5px 2px 0;font-size:10px;color:var(--muted)">
      <span style="width:8px;height:8px;border-radius:2px;background:${aColors[i]};display:inline-block"></span>
      ${catENtoDisplay(c)}</span>`).join('');

  if (catChartInst) catChartInst.destroy();
  catChartInst = new Chart(document.getElementById('cat-chart').getContext('2d'),{
    type:'doughnut',
    data:{labels:actCats.map(c=>catENtoDisplay(c)),datasets:[{data:actCats.map(c=>catMap[c]),backgroundColor:aColors,borderWidth:2,borderColor:'#ffffff'}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},
      tooltip:{callbacks:{label:ctx=>` ${fmt(ctx.raw)} (${((ctx.raw/total)*100).toFixed(1)}%)`}}},cutout:'60%'}
  });

  const dailyMap = {};
  monthly.forEach(e=>{dailyMap[e.dateKey]=(dailyMap[e.dateKey]||0)+e.amount;});
  const days = Object.keys(dailyMap).sort();
  if (dailyChartInst) dailyChartInst.destroy();
  dailyChartInst = new Chart(document.getElementById('daily-chart').getContext('2d'),{
    type:'bar',
    data:{labels:days.map(k=>k.split('-')[2]),datasets:[{data:days.map(k=>dailyMap[k]),backgroundColor:'#1D9E75',borderRadius:3,borderSkipped:false}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},
      tooltip:{callbacks:{label:ctx=>` ${fmt(ctx.raw)}`}}},
      scales:{x:{grid:{display:false},ticks:{font:{size:10},color:'#888',autoSkip:true,maxTicksLimit:15}},
              y:{grid:{color:'rgba(0,0,0,0.05)'},ticks:{font:{size:10},color:'#888',callback:v=>'Rp'+Math.round(v/1000)+'k'}}}}
  });

  const bd = document.getElementById('cat-breakdown');
  if (!total) { bd.innerHTML=`<div class="empty">${t('noData')}</div>`; return; }
  bd.innerHTML = actCats.map(c=>{
    const pct=((catMap[c]/total)*100).toFixed(1);
    return `<div class="bar-row"><div class="bar-top"><span>${catENtoDisplay(c)}</span>
      <span style="font-family:'DM Mono',monospace;color:var(--muted)">${fmt(catMap[c])} <span style="color:var(--hint)">${pct}%</span></span></div>
      <div class="bar-bg"><div class="bar-fill" style="width:${pct}%;background:${catENtoColor(c)}"></div></div></div>`;
  }).join('');
}

// ── TRENDS ─────────────────────────────────────────────────────────────────

function renderTrends() {
  const monthly  = thisMonthExp();
  const thisWk   = getWeekNum(now);
  const weekMap  = {};
  monthly.forEach(e=>{const wk=getWeekNum(new Date(e.ts));weekMap[wk]=(weekMap[wk]||0)+e.amount;});
  const weeks = Object.keys(weekMap).map(Number).sort((a,b)=>a-b);
  const maxW  = Math.max(...Object.values(weekMap),1);

  document.getElementById('weekly-rows').innerHTML = weeks.length
    ? weeks.map(wk=>`<div class="bar-row"><div class="bar-top">
        <span style="color:var(--muted)">Week ${wk}${wk===thisWk?' <span style="font-size:9px;background:var(--accent-l);color:var(--accent-d);padding:1px 5px;border-radius:99px">now</span>':''}</span>
        <span style="font-family:\'DM Mono\',monospace">${fmt(weekMap[wk])}</span></div>
        <div class="bar-bg"><div class="bar-fill" style="width:${((weekMap[wk]/maxW)*100).toFixed(1)}%;background:var(--accent)"></div></div></div>`).join('')
    : `<div class="empty">${t('noData')}</div>`;

  const total       = monthly.reduce((s,e)=>s+e.amount,0);
  const wkTotal     = weekMap[thisWk]   || 0;
  const prevWkTotal = weekMap[thisWk-1] || 0;
  const prevMo      = new Date(now.getFullYear(), now.getMonth()-1, 1);
  const prevMoTotal = allExpenses
    .filter(e=>{const d=new Date(e.ts);return d.getFullYear()===prevMo.getFullYear()&&d.getMonth()===prevMo.getMonth();})
    .reduce((s,e)=>s+e.amount,0);
  const wowPct = prevWkTotal>0 ? (wkTotal-prevWkTotal)/prevWkTotal*100 : null;
  const momPct = prevMoTotal>0 ? (total-prevMoTotal)/prevMoTotal*100   : null;

  document.getElementById('mom-rows').innerHTML=`
    <div class="trow"><span class="tlabel">${t('monthTotal')}</span><span class="tval">${fmt(total)}</span></div>
    <div class="trow"><span class="tlabel">${t('thisWeek')}</span><span class="tval">${fmt(wkTotal)}</span></div>
    <div class="trow"><span class="tlabel">${t('lastWeek')}</span><span class="tval">${fmt(prevWkTotal)}</span></div>
    <div class="trow"><span class="tlabel">WoW</span>${pctBadge(wowPct)}</div>
    <div class="trow"><span class="tlabel">MoM</span>${pctBadge(momPct)}</div>
    <div class="trow"><span class="tlabel">${t('avgPerDay')}</span><span class="tval">${now.getDate()?fmt(total/now.getDate()):'—'}</span></div>
    <div class="trow"><span class="tlabel">${t('lastMonth')}</span><span class="tval">${fmt(prevMoTotal)}</span></div>`;

  const catMap = {};
  monthly.forEach(e=>{catMap[e.cat]=(catMap[e.cat]||0)+e.amount;});
  const sorted = Object.keys(catMap).filter(c=>catMap[c]>0).sort((a,b)=>catMap[b]-catMap[a]).slice(0,6);

  document.getElementById('top-cats').innerHTML = sorted.length
    ? sorted.map((c,i)=>{
        const pct=((catMap[c]/(total||1))*100).toFixed(1);
        return `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:.5px solid var(--bdr);${i===sorted.length-1?'border-bottom:none':''}">
          <div style="width:10px;height:10px;border-radius:50%;background:${catENtoColor(c)};flex-shrink:0"></div>
          <div style="flex:1;font-size:12px">${catENtoDisplay(c)}</div>
          <div style="font-size:10px;color:var(--muted)">${pct}%</div>
          <div style="font-family:'DM Mono',monospace;font-size:12px">${fmt(catMap[c])}</div></div>`;
      }).join('')
    : `<div class="empty">${t('noData')}</div>`;

  const moTotals=[];
  const MONTHS_SHORT = lang === 'id'
    ? ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
    : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  for(let i=5;i>=0;i--){
    const d=new Date(now.getFullYear(),now.getMonth()-i,1);
    moTotals.push({label:MONTHS_SHORT[d.getMonth()]+'\''+String(d.getFullYear()).slice(2),
      total:allExpenses.filter(e=>{const ed=new Date(e.ts);return ed.getFullYear()===d.getFullYear()&&ed.getMonth()===d.getMonth();}).reduce((s,e)=>s+e.amount,0)});
  }
  if(momChartInst) momChartInst.destroy();
  momChartInst=new Chart(document.getElementById('mom-chart').getContext('2d'),{
    type:'bar',data:{labels:moTotals.map(m=>m.label),datasets:[{data:moTotals.map(m=>m.total),backgroundColor:moTotals.map((_,i)=>i===5?'#1D9E75':'#9FE1CB'),borderRadius:4,borderSkipped:false}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>` ${fmt(ctx.raw)}`}}},
      scales:{x:{grid:{display:false},ticks:{font:{size:11},color:'#888'}},y:{grid:{color:'rgba(0,0,0,0.05)'},ticks:{font:{size:10},color:'#888',callback:v=>'Rp'+Math.round(v/1000)+'k'}}}}
  });
}

// ── YEARLY ─────────────────────────────────────────────────────────────────

function changeYear(d){viewYear+=d;renderYearly();}

function renderYearly(){
  document.getElementById('yr-label').textContent=viewYear;
  document.getElementById('yr-stats-label').textContent=viewYear;

  const MONTHS_SHORT = lang === 'id'
    ? ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
    : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const yrExps=allExpenses.filter(e=>new Date(e.ts).getFullYear()===viewYear);
  const moTotals=Array.from({length:12},(_,m)=>yrExps.filter(e=>new Date(e.ts).getMonth()===m).reduce((s,e)=>s+e.amount,0));
  const maxMo=Math.max(...moTotals,1);
  const thisM=now.getFullYear()===viewYear?now.getMonth():-1;

  document.getElementById('yr-grid').innerHTML=MONTHS_SHORT.map((mo,i)=>`
    <div class="yr-mo${i===thisM?' active-mo':''}">
      <div class="yr-mo-label">${mo}</div>
      <div class="yr-mo-val">${moTotals[i]>0?fmtS(moTotals[i]):'—'}</div>
      <div class="yr-mo-bar" style="width:${((moTotals[i]/maxMo)*100).toFixed(0)}%;min-width:${moTotals[i]>0?'8px':'0'}"></div>
    </div>`).join('');

  if(yrChartInst) yrChartInst.destroy();
  yrChartInst=new Chart(document.getElementById('yr-chart').getContext('2d'),{
    type:'bar',data:{labels:MONTHS_SHORT,datasets:[{data:moTotals,backgroundColor:MONTHS_SHORT.map((_,i)=>i===thisM?'#1D9E75':'#9FE1CB'),borderRadius:4,borderSkipped:false}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>` ${fmt(ctx.raw)}`}}},
      scales:{x:{grid:{display:false},ticks:{font:{size:11},color:'#888'}},y:{grid:{color:'rgba(0,0,0,0.05)'},ticks:{font:{size:10},color:'#888',callback:v=>'Rp'+Math.round(v/1000)+'k'}}}}
  });

  const yrTotal=yrExps.reduce((s,e)=>s+e.amount,0);
  const activeMo=moTotals.filter(t=>t>0);
  const yrAvg=activeMo.length?yrTotal/activeMo.length:0;
  const peakM=moTotals.indexOf(Math.max(...moTotals));
  const lowM=activeMo.length?moTotals.indexOf(Math.min(...activeMo)):-1;

  document.getElementById('yr-stats').innerHTML=`
    <div class="trow"><span class="tlabel">${t('yearTotal')}</span><span class="tval">${fmt(yrTotal)}</span></div>
    <div class="trow"><span class="tlabel">${t('entries')}</span><span class="tval">${yrExps.length}</span></div>
    <div class="trow"><span class="tlabel">${t('avgPerMonth')}</span><span class="tval">${yrAvg?fmt(yrAvg):'—'}</span></div>
    <div class="trow"><span class="tlabel">${t('peakMonth')}</span><span class="tval">${peakM>=0&&moTotals[peakM]>0?MONTHS_SHORT[peakM]:'—'}</span></div>
    <div class="trow"><span class="tlabel">${t('lowestMonth')}</span><span class="tval">${lowM>=0?MONTHS_SHORT[lowM]:'—'}</span></div>
    <div class="trow"><span class="tlabel">${t('activeMonths')}</span><span class="tval">${activeMo.length} / 12</span></div>`;

  const prevYrExp=allExpenses.filter(e=>new Date(e.ts).getFullYear()===viewYear-1);
  const prevYrTotal=prevYrExp.reduce((s,e)=>s+e.amount,0);
  const prevMoTotals=Array.from({length:12},(_,m)=>prevYrExp.filter(e=>new Date(e.ts).getMonth()===m).reduce((s,e)=>s+e.amount,0));
  const yoyPct=prevYrTotal>0?(yrTotal-prevYrTotal)/prevYrTotal*100:null;

  document.getElementById('yoy-rows').innerHTML=`
    <div class="trow"><span class="tlabel">${viewYear}</span><span class="tval">${fmt(yrTotal)}</span></div>
    <div class="trow"><span class="tlabel">${viewYear-1}</span><span class="tval">${fmt(prevYrTotal)}</span></div>
    <div class="trow"><span class="tlabel">${t('yoyChange')}</span>${pctBadge(yoyPct)}</div>
    `+MONTHS_SHORT.map((mo,i)=>`<div class="trow"><span class="tlabel">${mo}</span>
    <span class="tval" style="font-size:11px">${fmt(moTotals[i])}
    ${prevMoTotals[i]>0?`<span style="color:var(--hint);font-size:9px"> was ${fmtS(prevMoTotals[i])}</span>`:''}</span></div>`).join('');

  const catMap={};
  yrExps.forEach(e=>{catMap[e.cat]=(catMap[e.cat]||0)+e.amount;});
  const sortedCats=Object.keys(catMap).sort((a,b)=>catMap[b]-catMap[a]);
  document.getElementById('yr-cat-breakdown').innerHTML=sortedCats.length
    ?sortedCats.map(c=>{const pct=((catMap[c]/yrTotal)*100).toFixed(1);
      return `<div class="bar-row"><div class="bar-top"><span>${catENtoDisplay(c)}</span>
        <span style="font-family:'DM Mono',monospace;color:var(--muted)">${fmt(catMap[c])} <span style="color:var(--hint)">${pct}%</span></span></div>
        <div class="bar-bg"><div class="bar-fill" style="width:${pct}%;background:${catENtoColor(c)}"></div></div></div>`;}).join('')
    :`<div class="empty">${t('noDataYear')}</div>`;
}

// ── IMPORT / EXPORT ────────────────────────────────────────────────────────

function openModal()  { document.getElementById('modal').classList.add('open'); }
function closeModal() { document.getElementById('modal').classList.remove('open'); }

document.getElementById('modal').addEventListener('click', e=>{if(e.target===document.getElementById('modal'))closeModal();});
document.getElementById('delete-modal').addEventListener('click', e=>{if(e.target===document.getElementById('delete-modal'))closeDeleteModal();});

function toCSVRow(fields) { return fields.map(f=>`"${String(f).replace(/"/g,'""')}"`).join(','); }

function exportCSV() {
  const sorted=[...allExpenses].sort((a,b)=>new Date(a.ts)-new Date(b.ts));
  const blob=new Blob(['ID,Date,Day,Name,Category,Amount,Timestamp\n'+sorted.map(e=>toCSVRow([e.id,e.date,e.day,e.name,e.cat,e.amount,e.ts])).join('\n')],{type:'text/csv'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download=`spendlog_export_${new Date().toISOString().slice(0,10)}.csv`;a.click();
}

function copyTSV() {
  const sorted=[...allExpenses].sort((a,b)=>new Date(a.ts)-new Date(b.ts));
  navigator.clipboard.writeText('Date\tDay\tName\tCategory\tAmount\tTimestamp\n'+sorted.map(e=>[e.date,e.day,e.name,e.cat,e.amount,e.ts].join('\t')).join('\n'))
    .then(()=>{const m=document.getElementById('copy-msg');m.style.display='block';setTimeout(()=>m.style.display='none',3000);});
}

async function importCSV(input) {
  const file=input.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=async e=>{
    const lines=e.target.result.split('\n').filter(l=>l.trim());
    if(!lines.length)return;
    const isCSV=lines[0].includes(',');
    const existingIds=new Set(allExpenses.map(e=>String(e.id)));
    const toInsert=[];let imported=0;
    for(let i=1;i<lines.length;i++){
      const line=lines[i].trim();if(!line)continue;
      let fields;
      if(isCSV){fields=[];let cur='',inQ=false;
        for(const c of line){if(c==='"')inQ=!inQ;else if(c===','&&!inQ){fields.push(cur);cur='';}else cur+=c;}
        fields.push(cur);fields=fields.map(f=>f.replace(/^"|"$/g,'').replace(/""/g,'"'));
      }else{fields=line.split('\t');}
      if(fields.length<5)continue;
      const id=String(fields[0]||Date.now()+Math.random());
      if(existingIds.has(id))continue;
      const ts=fields[6]||fields[5]||new Date().toISOString();
      const d=new Date(ts);
      const exp={id,name:fields[3]||fields[2],amount:parseFloat(fields[5]||fields[4])||0,cat:fields[4]||fields[3]||'Others',ts,
        date:fields[1]||d.toLocaleDateString('id-ID',{day:'2-digit',month:'short'}),
        day:fields[2]||d.toLocaleDateString('en',{weekday:'short'}),dateKey:`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`};
      if(!exp.name||!exp.amount)continue;
      allExpenses.unshift(exp);toInsert.push(expToRow(exp));existingIds.add(id);imported++;
    }
    input.value='';
    if(toInsert.length>0){
      setSyncStatus('syncing','importing');
      const{error}=await db.from('expenses').upsert(toInsert,{onConflict:'id'});
      if(error){setSyncStatus('error','syncFailed');showToast(`⚠ ${imported} rows imported locally but cloud sync failed`);cacheAll();}
      else{setSyncStatus('synced','synced');cacheAll();showToast(`✓ ${imported} ${t('entries')} imported & synced`);}
    }
    const m=document.getElementById('import-msg');m.textContent=`${t('importSuccess')} (${imported})`;m.style.display='block';
    setTimeout(()=>m.style.display='none',3000);
    ledgerPage=1;buildFilterChips();render();
  };
  reader.readAsText(file);
}

// ── KEYBOARD + ONLINE/OFFLINE ──────────────────────────────────────────────

document.getElementById('inp-name').addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('inp-amount').focus();});
document.getElementById('inp-amount').addEventListener('keydown',e=>{if(e.key==='Enter')addExpense();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeDeleteModal();}});

window.addEventListener('online', async()=>{showToast(t('toastBackOnline'));await loadFromSupabase();render();});
window.addEventListener('offline',()=>{setSyncStatus('error','offline');showToast(t('toastOffline'));});

// ── INIT ───────────────────────────────────────────────────────────────────

(async function init() {
  document.getElementById('loading-text').textContent = t('connecting');

  // Apply saved language first (before any render)
  buildCategorySelect();
  applyLanguage();

  await loadFromSupabase();

  // Hide loading
  const screen = document.getElementById('loading-screen');
  screen.classList.add('fade-out');
  setTimeout(()=>{ screen.style.display='none'; }, 350);
  document.getElementById('main-app').style.display = '';

  buildFilterChips();
  render();
})();
