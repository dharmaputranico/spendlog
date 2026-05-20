/* =============================================
   spend.log — app.js  (multi-user edition)
   ============================================= */

'use strict';

// ── SUPABASE ───────────────────────────────────────────────────────────────

const SUPABASE_URL      = 'https://wpnsxvpjxfyevrdxqiln.supabase.co';
const SUPABASE_KEY      = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbnN4dnBqeGZ5ZXZyZHhxaWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MDA2MzMsImV4cCI6MjA5MzI3NjYzM30.zNKyyLipYPlCy82RRS66yy5ApqS8t_feNEx_xDnnWu0';
const SUPABASE_AUTH_URL = 'https://auth.spendlog.id';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'spendlog_auth',
    storage: window.localStorage,
    url: SUPABASE_AUTH_URL,
  }
});

// ── CURRENCIES ────────────────────────────────────────────────────────────

const CURRENCIES = [
  { code:'IDR', name:'Indonesian Rupiah',   symbol:'Rp',  flag:'🇮🇩', locale:'id-ID', decimals:0 },
  { code:'USD', name:'US Dollar',           symbol:'$',   flag:'🇺🇸', locale:'en-US', decimals:2 },
  { code:'SGD', name:'Singapore Dollar',    symbol:'S$',  flag:'🇸🇬', locale:'en-SG', decimals:2 },
  { code:'MYR', name:'Malaysian Ringgit',   symbol:'RM',  flag:'🇲🇾', locale:'ms-MY', decimals:2 },
  { code:'JPY', name:'Japanese Yen',        symbol:'¥',   flag:'🇯🇵', locale:'ja-JP', decimals:0 },
  { code:'KRW', name:'Korean Won',          symbol:'₩',   flag:'🇰🇷', locale:'ko-KR', decimals:0 },
  { code:'CNY', name:'Chinese Yuan',        symbol:'¥',   flag:'🇨🇳', locale:'zh-CN', decimals:2 },
  { code:'HKD', name:'Hong Kong Dollar',    symbol:'HK$', flag:'🇭🇰', locale:'zh-HK', decimals:2 },
  { code:'THB', name:'Thai Baht',           symbol:'฿',   flag:'🇹🇭', locale:'th-TH', decimals:2 },
  { code:'PHP', name:'Philippine Peso',     symbol:'₱',   flag:'🇵🇭', locale:'fil-PH',decimals:2 },
  { code:'VND', name:'Vietnamese Dong',     symbol:'₫',   flag:'🇻🇳', locale:'vi-VN', decimals:0 },
  { code:'INR', name:'Indian Rupee',        symbol:'₹',   flag:'🇮🇳', locale:'hi-IN', decimals:2 },
  { code:'AUD', name:'Australian Dollar',   symbol:'A$',  flag:'🇦🇺', locale:'en-AU', decimals:2 },
  { code:'EUR', name:'Euro',                symbol:'€',   flag:'🇪🇺', locale:'de-DE', decimals:2 },
  { code:'GBP', name:'British Pound',       symbol:'£',   flag:'🇬🇧', locale:'en-GB', decimals:2 },
  { code:'CAD', name:'Canadian Dollar',     symbol:'C$',  flag:'🇨🇦', locale:'en-CA', decimals:2 },
  { code:'CHF', name:'Swiss Franc',         symbol:'Fr',  flag:'🇨🇭', locale:'de-CH', decimals:2 },
  { code:'SAR', name:'Saudi Riyal',         symbol:'SR',  flag:'🇸🇦', locale:'ar-SA', decimals:2 },
  { code:'AED', name:'UAE Dirham',          symbol:'AED', flag:'🇦🇪', locale:'ar-AE', decimals:2 },
];

let userCurrency  = null; // set after profile load
let selectedCurCode = null; // for the setup screen picker

function getCur() {
  return CURRENCIES.find(c => c.code === (userCurrency || 'IDR')) || CURRENCIES[0];
}

// ── i18n ───────────────────────────────────────────────────────────────────

const I18N = {
  en: {
    importExport:'⇅ Import / Export', thisMonth:'This month', thisWeek:'This week',
    vsLastMonth:'vs last month', vsLastWeek:'vs last week',
    name:'Name', namePlaceholder:'e.g. Nasi padang', amount:'Amount',
    category:'Category', addBtn:'+ Add', specifyCategory:'Specify category',
    specifyPlaceholder:'e.g. Wedding gift, Pet food…',
    manualDate:'Manual date (optional):', dateHint:'Leave blank to use today',
    tabLedger:'Ledger', tabAnalytics:'Analytics', tabTrends:'Monthly Trends', tabYearly:'Yearly',
    date:'Date', all:'All', noEntries:'No entries yet — add your first expense above!',
    seeMore:'See more', showing:'Showing', of:'of', entries:'entries',
    byCategory:'By category', dailySpend:'Daily spend', catBreakdown:'Category breakdown',
    weeklySpend:'Weekly spend', wowMomSummary:'WoW & MoM summary',
    topCategories:'Top categories', momChart:'Month-over-month (last 6 months)',
    monthTotal:'Month total', lastWeek:'Last week', avgPerDay:'Avg / day',
    lastMonth:'Last month', noData:'No data',
    yearOverview:'Year overview', prev:'Prev', next:'Next',
    yearStats:'Year stats', yearOverYear:'Year-over-year', yearlyCatBreakdown:'Yearly category breakdown',
    yearTotal:'Year total', avgPerMonth:'Avg / month', peakMonth:'Peak month',
    lowestMonth:'Lowest month', activeMonths:'Active months', yoyChange:'YoY change',
    noDataYear:'No data for this year',
    importExportTitle:'Import & Export', export:'Export',
    exportDesc:'Download all data as CSV — opens in Google Sheets via File → Import.',
    downloadCSV:'⬇ Download CSV (all data)', copyTSV:'⎘ Copy tab-separated (paste into Sheets)',
    copySuccess:'Copied! Paste into Google Sheets cell A1.',
    import:'Import from CSV', importDesc:'Import a previously exported CSV. Merges with existing data.',
    chooseFile:'⬆ Choose CSV file', importSuccess:'Import successful!',
    cloudSync:'☁ Cloud sync', cloudDesc:'Your data is private and synced automatically. Only you can see your expenses.',
    confirmDelete:'Delete expense?', deleteWarning:'This action cannot be undone.',
    cancel:'Cancel', yesDelete:'Yes, delete',
    loading:'Loading…', connecting:'Connecting to cloud…',
    synced:'Synced', saving:'Saving…', deleting:'Deleting…',
    importing:'Importing…', offline:'Offline', saveFailed:'Save failed',
    deleteFailed:'Delete failed', syncFailed:'Sync failed',
    toastSaved:'✓ Saved & synced', toastOffline:'⚠ You are offline — changes saved locally',
    toastBackOnline:'🌐 Back online — syncing…', toastSaveErr:'⚠ Could not save to cloud',
    toastDeleteErr:'⚠ Delete failed — refreshing', toastCached:'⚠ Could not reach cloud — showing cached data',
    groupFoodDrinks:'Food & Drinks', groupLiving:'Living', groupLifestyle:'Lifestyle', groupFinance:'Finance',
    catBreakfast:'Breakfast', catLunch:'Lunch', catDinner:'Dinner',
    catCoffee:'Coffee & Drinks', catSnack:'Snack', catGroceries:'Groceries', catBabies:'Babies / Children',
    catUtilities:'Utilities', catTransport:'Transport', catHealth:'Health & Medicine',
    catDaily:'Daily necessities', catSports:'Sports & Fitness', catShopping:'Shopping',
    catEntertainment:'Entertainment', catEducation:'Education',
    catInstallment:'Installment', catSubscription:'Subscription', catSavings:'Savings / Transfer',
    catOthers:'Others (specify below)', catOthersShort:'Others',
    week:'Week', today:'today', thisWeekLabel:'This week',
    signIn:'Sign in', createAccount:'Create account', signOut:'Sign out',
    wt0title:"Track every rupiah", wt0desc:"Add expenses in seconds. Date and time are recorded automatically — just name, amount, category and you're done.",
    wt1title:"See where it all goes", wt1desc:"Beautiful charts break down spending by category. Spot patterns, cut waste, feel in control.",
    wt2title:"Trends that make sense", wt2desc:"Navigate month by month. Compare WoW and MoM changes. Know if you're spending more or less than last month.",
    wt3title:"Synced across all devices", wt3desc:"Your data lives in the cloud. Add on your phone, see it instantly on your laptop. Always in sync.",
    emailLabel:'Email', passwordLabel:'Password', confirmPasswordLabel:'Confirm password',
    orDivider:'or', continueGoogle:'Continue with Google',
    authFooter:'Your data is private and stored securely.',
    authTagline:'Your personal expense tracker',
    signingIn:'Signing in…', creatingAccount:'Creating account…',
    checkEmailMsg:'Account created! Check your email to confirm, then sign in.',
    errFillFields:'Please enter your email and password.',
    errPasswordShort:'Password must be at least 6 characters.',
    errPasswordMatch:'Passwords do not match.',
    manageCategories:'Manage categories',
    catManagerTitle:'Manage categories',
    addCategory:'Add category',
    catNamePlaceholder:'e.g. Bubble tea, Pet food…',
    groupLabel:'Group',
    deleteCat:'Delete category?',
    deleteCatWarning:"Expenses with this category will keep their label, but it won't appear in future entries.",
    whatsNewTitle:"What's new",
    whatsNewDesc:'3 updates just for you:',
    whatsNew1:'Customise categories — add or remove as needed',
    whatsNew2:'Add your own category to any group',
    whatsNew3:'Amount field now shows thousands separator',
    gotIt:'Got it!',
  },
  id: {
    importExport:'⇅ Impor / Ekspor', thisMonth:'Bulan ini', thisWeek:'Minggu ini',
    vsLastMonth:'vs bulan lalu', vsLastWeek:'vs minggu lalu',
    name:'Nama', namePlaceholder:'cth. Nasi padang', amount:'Jumlah',
    category:'Kategori', addBtn:'+ Tambah', specifyCategory:'Tulis kategori',
    specifyPlaceholder:'cth. Kado nikahan, Makanan kucing…',
    manualDate:'Tanggal manual (opsional):', dateHint:'Biarkan kosong untuk hari ini',
    tabLedger:'Catatan', tabAnalytics:'Analitik', tabTrends:'Tren Bulanan', tabYearly:'Tahunan',
    date:'Tanggal', all:'Semua', noEntries:'Belum ada catatan — tambahkan pengeluaran pertamamu!',
    seeMore:'Lihat lebih', showing:'Menampilkan', of:'dari', entries:'catatan',
    byCategory:'Per kategori', dailySpend:'Pengeluaran harian', catBreakdown:'Rincian kategori',
    weeklySpend:'Pengeluaran mingguan', wowMomSummary:'Ringkasan WoW & MoM',
    topCategories:'Kategori teratas', momChart:'Perbandingan bulan (6 bulan terakhir)',
    monthTotal:'Total bulan ini', lastWeek:'Minggu lalu', avgPerDay:'Rata-rata / hari',
    lastMonth:'Bulan lalu', noData:'Belum ada data',
    yearOverview:'Ikhtisar tahun', prev:'Sebelum', next:'Berikut',
    yearStats:'Statistik tahun', yearOverYear:'Tahun ke tahun', yearlyCatBreakdown:'Rincian kategori tahunan',
    yearTotal:'Total tahun', avgPerMonth:'Rata-rata / bulan', peakMonth:'Bulan tertinggi',
    lowestMonth:'Bulan terendah', activeMonths:'Bulan aktif', yoyChange:'Perubahan YoY',
    noDataYear:'Belum ada data tahun ini',
    importExportTitle:'Impor & Ekspor', export:'Ekspor',
    exportDesc:'Unduh semua data sebagai CSV — buka di Google Sheets via File → Import.',
    downloadCSV:'⬇ Unduh CSV (semua data)', copyTSV:'⎘ Salin tab-separated (tempel ke Sheets)',
    copySuccess:'Disalin! Tempel ke Google Sheets sel A1.',
    import:'Impor dari CSV', importDesc:'Impor CSV yang sudah diekspor. Digabung dengan data yang ada.',
    chooseFile:'⬆ Pilih file CSV', importSuccess:'Impor berhasil!',
    cloudSync:'☁ Sinkronisasi cloud', cloudDesc:'Data kamu privat dan tersinkron otomatis. Hanya kamu yang bisa melihatnya.',
    confirmDelete:'Hapus pengeluaran?', deleteWarning:'Tindakan ini tidak bisa dibatalkan.',
    cancel:'Batal', yesDelete:'Ya, hapus',
    loading:'Memuat…', connecting:'Menghubungkan ke cloud…',
    synced:'Tersinkron', saving:'Menyimpan…', deleting:'Menghapus…',
    importing:'Mengimpor…', offline:'Offline', saveFailed:'Gagal simpan',
    deleteFailed:'Gagal hapus', syncFailed:'Sinkronisasi gagal',
    toastSaved:'✓ Tersimpan & tersinkron', toastOffline:'⚠ Kamu offline — perubahan disimpan lokal',
    toastBackOnline:'🌐 Kembali online — menyinkronkan…', toastSaveErr:'⚠ Gagal menyimpan ke cloud',
    toastDeleteErr:'⚠ Gagal hapus — memuat ulang', toastCached:'⚠ Tidak bisa terhubung ke cloud — menampilkan data cache',
    groupFoodDrinks:'Makanan & Minuman', groupLiving:'Kebutuhan Hidup', groupLifestyle:'Gaya Hidup', groupFinance:'Keuangan',
    catBreakfast:'Sarapan', catLunch:'Makan Siang', catDinner:'Makan Malam',
    catCoffee:'Kopi & Minuman', catSnack:'Camilan', catGroceries:'Belanja Dapur', catBabies:'Bayi / Anak-anak',
    catUtilities:'Utilitas', catTransport:'Transportasi', catHealth:'Kesehatan & Obat',
    catDaily:'Kebutuhan sehari-hari', catSports:'Olahraga & Kebugaran', catShopping:'Belanja',
    catEntertainment:'Hiburan', catEducation:'Pendidikan',
    catInstallment:'Cicilan', catSubscription:'Langganan', catSavings:'Tabungan / Transfer',
    catOthers:'Lainnya (isi di bawah)', catOthersShort:'Lainnya',
    week:'Minggu', today:'hari ini', thisWeekLabel:'Minggu ini',
    signIn:'Masuk', createAccount:'Buat akun', signOut:'Keluar',
    wt0title:'Catat setiap pengeluaran', wt0desc:'Tambah pengeluaran dalam hitungan detik. Tanggal dan waktu otomatis tercatat — cukup nama, jumlah, dan kategori.',
    wt1title:'Lihat kemana uangmu pergi', wt1desc:'Grafik cantik memecah pengeluaranmu per kategori. Temukan pola, hemat lebih banyak, dan merasa lebih terkontrol.',
    wt2title:'Tren yang mudah dipahami', wt2desc:'Navigasi bulan per bulan. Bandingkan perubahan WoW dan MoM. Tahu apakah pengeluaranmu naik atau turun.',
    wt3title:'Tersinkron di semua perangkat', wt3desc:'Data kamu tersimpan di cloud. Tambah pengeluaran di HP, langsung terlihat di laptop. Selalu sinkron.',
    emailLabel:'Email', passwordLabel:'Kata sandi', confirmPasswordLabel:'Konfirmasi kata sandi',
    orDivider:'atau', continueGoogle:'Lanjutkan dengan Google',
    authFooter:'Data kamu bersifat privat dan disimpan dengan aman.',
    authTagline:'Pencatat pengeluaran pribadimu',
    signingIn:'Sedang masuk…', creatingAccount:'Membuat akun…',
    checkEmailMsg:'Akun dibuat! Cek emailmu untuk konfirmasi, lalu masuk.',
    errFillFields:'Masukkan email dan kata sandimu.',
    errPasswordShort:'Kata sandi minimal 6 karakter.',
    errPasswordMatch:'Kata sandi tidak cocok.',
    manageCategories:'Kelola kategori',
    catManagerTitle:'Kelola kategori',
    addCategory:'Tambah kategori',
    catNamePlaceholder:'cth. Bubble tea, Makanan kucing…',
    groupLabel:'Grup',
    deleteCat:'Hapus kategori?',
    deleteCatWarning:'Pengeluaran dengan kategori ini akan tetap ada, tapi tidak muncul di entri baru.',
    whatsNewTitle:'Yang baru',
    whatsNewDesc:'3 pembaruan untukmu:',
    whatsNew1:'Sesuaikan kategori — tambah atau hapus sesuai kebutuhan',
    whatsNew2:'Tambah kategori sendiri ke grup manapun',
    whatsNew3:'Kolom jumlah kini menampilkan pemisah ribuan',
    gotIt:'Mengerti!',
  }
};

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

// ── CUSTOM CATEGORIES (stored in localStorage per user) ───────────────────

// Default category groups — used to seed fresh installs
const DEFAULT_CAT_GROUPS = [
  { gKey:'groupFoodDrinks', cats:['catBreakfast','catLunch','catDinner','catCoffee','catSnack','catGroceries','catBabies'] },
  { gKey:'groupLiving',     cats:['catUtilities','catTransport','catHealth','catDaily'] },
  { gKey:'groupLifestyle',  cats:['catSports','catShopping','catEntertainment','catEducation'] },
  { gKey:'groupFinance',    cats:['catInstallment','catSubscription','catSavings'] },
];

// userCats: array of { id, gKey, enName }
// enName is the stored value (language-independent)
// id is 'cat_<timestamp>' for custom, or the CAT_KEY for defaults
let userCats = [];

function catStoreKey() { return `spendlog_cats_${currentUser?.id||'anon'}`; }

function loadUserCats() {
  try {
    const stored = localStorage.getItem(catStoreKey());
    if (stored) { userCats = JSON.parse(stored); return; }
  } catch(e) {}
  // Seed from defaults
  userCats = [];
  DEFAULT_CAT_GROUPS.forEach(g => {
    g.cats.forEach(key => {
      userCats.push({ id: key, gKey: g.gKey, enName: I18N.en[key] });
    });
  });
  saveUserCats();
}

function saveUserCats() {
  try { localStorage.setItem(catStoreKey(), JSON.stringify(userCats)); } catch(e) {}
}

// Get display name for a cat entry
function catEntryDisplay(cat) {
  // Try i18n key first, then fall back to enName
  const byKey = userCats.find(c => c.id === cat.id);
  if (!byKey) return cat.enName;
  const i18nKey = byKey.id; // for default cats, id IS the catKey
  return (I18N[lang]?.[i18nKey]) || byKey.enName;
}

// Override catENtoDisplay, catENtoColor, catENtoCSS to handle custom cats
function catENtoDisplay(enName) {
  const i = CAT_KEYS.findIndex(k => I18N.en[k] === enName);
  if (i >= 0) return t(CAT_KEYS[i]);
  return enName; // custom category — display as-is
}
function catENtoColor(enName) {
  const i = CAT_KEYS.findIndex(k => I18N.en[k] === enName);
  if (i >= 0) return CAT_COLS[i];
  // Custom cats get a deterministic color from a hash
  let h = 0; for (let c of enName) h = (h * 31 + c.charCodeAt(0)) & 0xFFFFFF;
  const palette = ['#5C6BC0','#26A69A','#EF7F1A','#EC407A','#7E57C2','#26C6DA','#66BB6A','#FFA726'];
  return palette[Math.abs(h) % palette.length];
}
function catENtoCSS(enName) {
  const i = CAT_KEYS.findIndex(k => I18N.en[k] === enName);
  if (i >= 0) return CAT_CSS[i];
  return 'cc-others'; // custom cats use the "others" style
}

const MONTHS_EN    = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_ID    = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const MONTHS_S_EN  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTHS_S_ID  = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

// ── STATE ──────────────────────────────────────────────────────────────────

let allExpenses     = [];
let activeFilter    = 'All';
let viewYear        = new Date().getFullYear();
let lang            = localStorage.getItem('spendlog_lang') || 'en';
let ledgerPage      = 1;
const PAGE_SIZE     = 10;
let pendingDeleteId = null;
let currentUser     = null;

const today     = new Date();
let viewYear_m  = today.getFullYear();
let viewMonth_m = today.getMonth();
let viewWeekOffset = 0;

let catChartInst = null, dailyChartInst = null, momChartInst = null, yrChartInst = null;
let dailyPage = 0; // which window of 10 days to show in daily chart
const DAILY_PAGE_SIZE = 10;

// ── TRANSLATION HELPERS ────────────────────────────────────────────────────

function t(key)          { return (I18N[lang]&&I18N[lang][key])||I18N.en[key]||key; }
function catKeyToEN(key) { return I18N.en[key]||key; }
function catENtoDisplay(n){ const i=CAT_KEYS.findIndex(k=>I18N.en[k]===n); return i>=0?t(CAT_KEYS[i]):n; }
function catENtoColor(n)  { const i=CAT_KEYS.findIndex(k=>I18N.en[k]===n); return i>=0?CAT_COLS[i]:'#888'; }
function catENtoCSS(n)    { const i=CAT_KEYS.findIndex(k=>I18N.en[k]===n); return i>=0?CAT_CSS[i]:'cc-others'; }
function monthsLong()     { return lang==='id'?MONTHS_ID:MONTHS_EN; }
function monthsShort()    { return lang==='id'?MONTHS_S_ID:MONTHS_S_EN; }

// ── WALKTHROUGH SLIDES ────────────────────────────────────────────────────

let _currentSlide = 0;
const SLIDE_COUNT  = 4;

function goToSlide(n) {
  _currentSlide = Math.max(0, Math.min(n, SLIDE_COUNT - 1));

  // Update slide visibility
  document.querySelectorAll('.wt-slide').forEach((el, i) => {
    el.classList.toggle('active', i === _currentSlide);
  });

  // Update dots
  document.querySelectorAll('.wt-dot').forEach((el, i) => {
    el.classList.toggle('active', i === _currentSlide);
  });
}

function applyWalkthroughLang() {
  for (let i = 0; i < SLIDE_COUNT; i++) {
    const titleEl = document.getElementById(`wt-title-${i}`);
    const descEl  = document.getElementById(`wt-desc-${i}`);
    if (titleEl) titleEl.textContent = t(`wt${i}title`);
    if (descEl)  descEl.textContent  = t(`wt${i}desc`);
  }
}

// Swipe support for mobile
(function initSwipe() {
  let startX = 0;
  document.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goToSlide(_currentSlide + (diff > 0 ? 1 : -1));
  }, { passive: true });
})();

// Auto-advance slides every 4 seconds (pauses when user interacts)
let _slideTimer = null;
function startSlideTimer() {
  stopSlideTimer();
  _slideTimer = setInterval(() => {
    goToSlide((_currentSlide + 1) % SLIDE_COUNT);
  }, 4000);
}
function stopSlideTimer() {
  if (_slideTimer) { clearInterval(_slideTimer); _slideTimer = null; }
}

document.querySelectorAll('.wt-dot').forEach(dot => {
  dot.addEventListener('click', stopSlideTimer);
});

// ── AUTH SCREEN ────────────────────────────────────────────────────────────

let authMode = 'login';

function showAuthTab(mode) {
  authMode = mode;
  document.getElementById('tab-login') .classList.toggle('active', mode==='login');
  document.getElementById('tab-signup').classList.toggle('active', mode==='signup');
  document.getElementById('auth-submit').textContent   = t(mode==='login'?'signIn':'createAccount');
  document.getElementById('field-confirm').style.display = mode==='signup'?'':'none';
  document.getElementById('auth-error').style.display   = 'none';
  document.getElementById('auth-success').style.display = 'none';
}

function showAuthError(msg)   { const e=document.getElementById('auth-error');   e.textContent=msg; e.style.display=''; document.getElementById('auth-success').style.display='none'; }
function showAuthSuccess(msg) { const e=document.getElementById('auth-success'); e.textContent=msg; e.style.display=''; document.getElementById('auth-error').style.display='none'; }

async function handleEmailAuth() {
  const email    = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  const confirm  = document.getElementById('auth-confirm').value;
  const btn      = document.getElementById('auth-submit');

  if (!email||!password) { showAuthError(t('errFillFields')); return; }
  if (authMode==='signup') {
    if (password.length<6)    { showAuthError(t('errPasswordShort')); return; }
    if (password!==confirm)   { showAuthError(t('errPasswordMatch')); return; }
  }

  btn.disabled    = true;
  btn.textContent = t(authMode==='login'?'signingIn':'creatingAccount');

  console.log('Attempting auth, mode:', authMode, 'email:', email);

  let error;
  if (authMode==='login') {
    try {
      const res = await db.auth.signInWithPassword({ email, password });
      console.log('signInWithPassword result:', JSON.stringify(res));
      error = res.error;
    } catch(e) {
      console.error('signInWithPassword threw:', e);
      btn.disabled=false; btn.textContent=t('signIn');
      showAuthError('Network error — check your connection and try again.');
      return;
    }
  } else {
    try {
      const res = await db.auth.signUp({ email, password });
      console.log('signUp result:', JSON.stringify(res));
      error = res.error;
      if (!error) {
        showAuthSuccess(t('checkEmailMsg'));
        btn.disabled=false; btn.textContent=t('createAccount');
        showAuthTab('login');
        return;
      }
    } catch(e) {
      console.error('signUp threw:', e);
      btn.disabled=false; btn.textContent=t('createAccount');
      showAuthError('Network error — check your connection and try again.');
      return;
    }
  }

  btn.disabled    = false;
  btn.textContent = t(authMode==='login'?'signIn':'createAccount');
  if (error) { console.error('Auth error:', error); showAuthError(error.message); }
}

async function handleGoogleAuth() {
  const { error } = await db.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + window.location.pathname }
  });
  if (error) showAuthError(error.message);
}

async function signOut() {
  await db.auth.signOut();
  currentUser = null; allExpenses = [];
  showScreen('auth');
  showToast(t('signOut'));
}

// ── SCREEN SWITCHING ───────────────────────────────────────────────────────

function showScreen(name) {
  document.getElementById('auth-screen').style.display     = name==='auth'     ? '' : 'none';
  document.getElementById('currency-screen').style.display = name==='currency' ? '' : 'none';
  document.getElementById('main-app').style.display        = name==='app'      ? '' : 'none';
  if (name === 'auth') {
    goToSlide(0);
    startSlideTimer();
  } else {
    stopSlideTimer();
  }
  if (name === 'currency') {
    buildCurrencyGrid();
    applyCurrencyI18n();
  }
}

function showLoading(msg) {
  document.getElementById('loading-text').textContent = msg||t('loading');
  const s = document.getElementById('loading-screen');
  s.style.display=''; s.classList.remove('fade-out');
}

function hideLoading() {
  const s = document.getElementById('loading-screen');
  s.classList.add('fade-out');
  setTimeout(()=>{ s.style.display='none'; }, 350);
}

// ── USER SESSION ───────────────────────────────────────────────────────────

function applyUser(user) {
  currentUser = user;
  const email = user.email || '';
  // null-check every element — main-app may still be hidden when this runs
  const avatarEl = document.getElementById('user-avatar');
  const emailEl  = document.getElementById('user-email-short');
  const pillEl   = document.getElementById('user-pill');
  const badgeEl  = document.getElementById('currency-badge');
  if (avatarEl) avatarEl.textContent = email.charAt(0).toUpperCase();
  if (emailEl)  emailEl.textContent  = email.split('@')[0];
  if (pillEl)   pillEl.title         = email;
  // currency badge removed — currency is permanent, no need to show it
}

// ── CACHE (per user) ───────────────────────────────────────────────────────

function cacheKey()  { return `spendlog_cache_${currentUser?.id||'anon'}`; }
function cacheAll()  { try { localStorage.setItem(cacheKey(), JSON.stringify(allExpenses)); } catch(e){} }
function loadCache() { try { return JSON.parse(localStorage.getItem(cacheKey())||'[]'); } catch(e){ return []; } }

// ── PROFILE ───────────────────────────────────────────────────────────────

async function loadProfile() {
  const { data, error } = await db.from('profiles').select('currency').eq('id', currentUser.id).single();
  if (!error && data?.currency) {
    userCurrency = data.currency;
    return true; // profile found
  }
  return false;
}

async function saveProfile(currencyCode) {
  userCurrency = currencyCode;
  const { error } = await db.from('profiles')
    .upsert({ id: currentUser.id, currency: currencyCode, updated_at: new Date().toISOString() }, { onConflict: 'id' });
  if (error) console.error('saveProfile error:', error);
}

// ── CURRENCY SETUP SCREEN ──────────────────────────────────────────────────

function buildCurrencyGrid() {
  const grid = document.getElementById('currency-grid');
  if (!grid) return;
  grid.innerHTML = CURRENCIES.map(c => `
    <div class="currency-option" id="cur-opt-${c.code}" onclick="selectCurrency('${c.code}')">
      <span class="cur-flag">${c.flag}</span>
      <div class="cur-info">
        <span class="cur-code">${c.code}</span>
        <span class="cur-name">${c.name}</span>
      </div>
      <span class="cur-symbol">${c.symbol}</span>
    </div>`).join('');
}

function selectCurrency(code) {
  selectedCurCode = code;
  document.querySelectorAll('.currency-option').forEach(el => el.classList.remove('selected'));
  const opt = document.getElementById(`cur-opt-${code}`);
  if (opt) opt.classList.add('selected');
  const btn = document.getElementById('currency-confirm');
  const lbl = document.getElementById('currency-confirm-label');
  const cur = CURRENCIES.find(c => c.code === code);
  if (btn) btn.disabled = false;
  if (lbl && cur) lbl.textContent = `Continue with ${cur.symbol} ${cur.code}`;
}

async function confirmCurrency() {
  if (!selectedCurCode) return;
  const btn = document.getElementById('currency-confirm');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }
  await saveProfile(selectedCurCode);
  loadUserCats();
  showScreen('app');
  applyLanguage();
  updateAmountField();
  showWhatsNewBanner();
  refreshAllNavBars();
}

function applyCurrencyI18n() {
  // Update currency screen text based on language
  const titleEl = document.getElementById('cur-title');
  const descEl  = document.getElementById('cur-desc');
  const noteEl  = document.getElementById('cur-note');
  if (titleEl) titleEl.textContent = lang === 'id' ? 'Pilih mata uangmu' : 'Choose your currency';
  if (descEl)  descEl.textContent  = lang === 'id'
    ? 'Ini menentukan tampilan semua pengeluaranmu. Pilih dengan cermat — tidak bisa diubah setelah ini.'
    : 'This sets how all your expenses are displayed. Choose carefully — this cannot be changed later.';
  if (noteEl)  noteEl.textContent  = lang === 'id'
    ? '⚠ Pilihan mata uang bersifat permanen dan tidak bisa diubah.'
    : '⚠ Your currency choice is permanent and cannot be changed later.';
}

// ── ROW MAPPING ────────────────────────────────────────────────────────────

function rowToExp(row) {
  const d = new Date(row.ts);
  return {
    id:row.id, name:row.name, amount:parseFloat(row.amount), cat:row.cat, ts:row.ts,
    date:d.toLocaleDateString('id-ID',{day:'2-digit',month:'short'}),
    day:d.toLocaleDateString('en',{weekday:'short'}),
    dateKey:`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
  };
}

function expToRow(exp) {
  return { id:String(exp.id), name:exp.name, amount:exp.amount, cat:exp.cat,
    ts:exp.ts, date:exp.date, day:exp.day, date_key:exp.dateKey,
    user_id: currentUser.id };  // RLS enforced on server — still good practice
}

// ── LOAD FROM SUPABASE ─────────────────────────────────────────────────────

async function fetchExpenses() {
  // Ensure we have a fresh token before fetching
  const { data: { session } } = await db.auth.getSession();
  if (!session) throw new Error('No active session');

  const { data, error } = await db
    .from('expenses')
    .select('*')
    .order('ts', { ascending: false });

  if (error) throw error;
  return data;
}

async function loadFromSupabase() {
  setSyncStatus('syncing', 'loading');

  const MAX_RETRIES = 3;
  const RETRY_DELAY = [500, 1500, 3000]; // ms between retries

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`Retrying data fetch... attempt ${attempt + 1}/${MAX_RETRIES}`);
        await new Promise(r => setTimeout(r, RETRY_DELAY[attempt - 1]));
      }

      const data = await Promise.race([
        fetchExpenses(),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 8000))
      ]);

      // Success
      allExpenses = data.map(rowToExp);
      cacheAll();
      setSyncStatus('synced', 'synced');
      console.log(`Loaded ${allExpenses.length} expenses on attempt ${attempt + 1}`);
      return;

    } catch(e) {
      console.warn(`Fetch attempt ${attempt + 1} failed:`, e.message);

      if (attempt === MAX_RETRIES - 1) {
        // All retries exhausted — use cache
        console.error('All fetch attempts failed, falling back to cache');
        setSyncStatus('error', 'offline');
        allExpenses = loadCache();
        if (allExpenses.length > 0) {
          showToast(t('toastCached'));
        }
      }
    }
  }
}

// ── MONTH / WEEK NAVIGATION ────────────────────────────────────────────────

function isCurrentMonth() { return viewYear_m===today.getFullYear() && viewMonth_m===today.getMonth(); }

function changeViewMonth(delta) {
  viewMonth_m += delta;
  if (viewMonth_m<0)  { viewMonth_m=11; viewYear_m--; }
  if (viewMonth_m>11) { viewMonth_m=0;  viewYear_m++; }
  ledgerPage=1; activeFilter='All'; viewWeekOffset=0; dailyPage=0;
  refreshAllNavBars();
  const tab = document.querySelector('.tab.active')?.getAttribute('data-i18n');
  if (tab==='tabLedger')    { buildFilterChips(); renderLedger(); }
  if (tab==='tabAnalytics') renderCharts();
  if (tab==='tabTrends')    renderTrends();
  renderMetrics();
}

function changeViewWeek(delta) {
  viewWeekOffset+=delta; refreshWeekNav(); renderTrends();
}

function viewMonthExp() {
  return allExpenses.filter(e=>{
    const d=new Date(e.ts);
    return d.getFullYear()===viewYear_m && d.getMonth()===viewMonth_m;
  });
}

function weeksInViewMonth() {
  return [...new Set(viewMonthExp().map(e=>getWeekNum(new Date(e.ts))))].sort((a,b)=>a-b);
}

function navMonthLabel() {
  const label = monthsLong()[viewMonth_m]+' '+viewYear_m;
  return `<span>${label}</span>${isCurrentMonth()?`<span class="nav-today-badge">${t('today')}</span>`:''}`;
}

function refreshAllNavBars() {
  ['ledger-month-label','analytics-month-label','trends-month-label'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.innerHTML=navMonthLabel();
  });
  ['ledger-nav-next','analytics-nav-next','trends-nav-next'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.disabled=isCurrentMonth();
  });
  refreshWeekNav();
}

function refreshWeekNav() {
  const weeks=weeksInViewMonth();
  if (!weeks.length) { document.getElementById('week-nav').style.display='none'; return; }
  document.getElementById('week-nav').style.display='';
  const maxOff=-(weeks.length-1);
  viewWeekOffset=Math.max(viewWeekOffset,maxOff);
  viewWeekOffset=Math.min(viewWeekOffset,0);
  const wkIdx=weeks.length-1+viewWeekOffset;
  const wkNum=weeks[Math.max(0,wkIdx)];
  const isCurWk=isCurrentMonth()&&wkNum===getWeekNum(today);
  document.getElementById('week-label').innerHTML=
    `<span>${t('week')} ${wkNum}</span>${isCurWk?`<span class="nav-today-badge">${t('today')}</span>`:''}`;
  document.getElementById('week-nav-next').disabled=viewWeekOffset>=0;
  document.querySelector('#week-nav .nav-arrow:first-child').disabled=wkIdx<=0;
}

function selectedWeekNum() {
  const weeks=weeksInViewMonth(); if(!weeks.length) return null;
  return weeks[Math.max(0,weeks.length-1+viewWeekOffset)];
}

// ── SYNC UI ────────────────────────────────────────────────────────────────

function setSyncStatus(state,labelKey) {
  document.getElementById('sync-dot').className     = 'sync-dot '+state;
  document.getElementById('sync-label').textContent = t(labelKey);
}

let toastTimer=null;
function showToast(msg,dur=2800) {
  const el=document.getElementById('toast');
  el.textContent=msg; el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>el.classList.remove('show'),dur);
}

// ── FORM ───────────────────────────────────────────────────────────────────

function onCatChange() {
  // No more "specify below" — categories are fully managed
  const otherRow = document.getElementById('other-row');
  if (otherRow) otherRow.style.display = 'none';
}

async function addExpense() {
  const name   = document.getElementById('inp-name').value.trim();
  // Amount input may have thousands separators — strip them before parsing
  const rawAmt = document.getElementById('inp-amount').value.replace(/[^0-9.]/g,'');
  const amount = parseFloat(rawAmt);
  const cat    = document.getElementById('inp-cat').value;
  if (!name||isNaN(amount)||amount<=0) { document.getElementById('inp-name').focus(); return; }

  const manDate = document.getElementById('inp-date').value;
  const d = manDate?new Date(manDate+'T12:00:00'):new Date();

  const exp = {
    id:String(Date.now())+String(Math.random()).slice(2,7),
    name,amount,cat, ts:d.toISOString(),
    date:d.toLocaleDateString('id-ID',{day:'2-digit',month:'short'}),
    day:d.toLocaleDateString('en',{weekday:'short'}),
    dateKey:`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
  };

  allExpenses.unshift(exp); ledgerPage=1;
  buildFilterChips(); renderLedger(); renderMetrics();
  ['inp-name','inp-amount','inp-date'].forEach(id=>{document.getElementById(id).value=''});
  document.getElementById('inp-name').focus();

  const btn=document.getElementById('add-btn'); btn.disabled=true;
  setSyncStatus('syncing','saving');
  const{error}=await db.from('expenses').insert([expToRow(exp)]);
  btn.disabled=false;
  if(error){ console.error(error); setSyncStatus('error','saveFailed'); showToast(t('toastSaveErr')); cacheAll(); }
  else     { setSyncStatus('synced','synced'); cacheAll(); showToast(t('toastSaved')); }
}

// ── DELETE — two-step ──────────────────────────────────────────────────────

function deleteExpense(id) {
  const exp=allExpenses.find(e=>String(e.id)===String(id)); if(!exp) return;
  pendingDeleteId=String(id);
  document.getElementById('delete-preview').innerHTML=`
    <div class="dp-name">${exp.name}</div>
    <div class="dp-detail">
      <span>${exp.date}</span><span>${catENtoDisplay(exp.cat)}</span>
      <span style="font-family:'DM Mono',monospace;font-weight:500">${fmt(exp.amount)}</span>
    </div>`;
  document.getElementById('delete-modal').querySelectorAll('[data-i18n]').forEach(el=>{
    el.textContent=t(el.getAttribute('data-i18n'));
  });
  document.getElementById('delete-modal').classList.add('open');
}

function closeDeleteModal() { document.getElementById('delete-modal').classList.remove('open'); pendingDeleteId=null; }

async function confirmDelete() {
  if(!pendingDeleteId) return;
  const id=pendingDeleteId; closeDeleteModal();
  allExpenses=allExpenses.filter(e=>String(e.id)!==id);
  renderLedger(); renderMetrics();
  setSyncStatus('syncing','deleting');
  const{error}=await db.from('expenses').delete().eq('id',id);
  if(error){ console.error(error); setSyncStatus('error','deleteFailed'); showToast(t('toastDeleteErr')); await loadFromSupabase(); renderLedger(); renderMetrics(); }
  else     { setSyncStatus('synced','synced'); cacheAll(); }
}

// ── FILTER ─────────────────────────────────────────────────────────────────

function setFilter(f,el) {
  activeFilter=f; ledgerPage=1;
  document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active'); renderLedger();
}

function buildFilterChips() {
  const cats=[...new Set(viewMonthExp().map(e=>e.cat))];
  const row=document.getElementById('filter-chips');
  row.innerHTML=`<div class="chip${activeFilter==='All'?' active':''}" onclick="setFilter('All',this)">${t('all')}</div>`;
  cats.forEach(c=>{
    const el=document.createElement('div');
    el.className='chip'+(activeFilter===c?' active':'');
    el.textContent=catENtoDisplay(c);
    el.onclick=function(){setFilter(c,this);};
    row.appendChild(el);
  });
}

// ── TABS ───────────────────────────────────────────────────────────────────

function switchTab(tab,el) {
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById('view-'+tab).classList.add('active');
  if(tab==='ledger')    { buildFilterChips(); renderLedger(); }
  if(tab==='analytics') renderCharts();
  if(tab==='trends')    renderTrends();
  if(tab==='yearly')    renderYearly();
}

// ── HELPERS ────────────────────────────────────────────────────────────────

function getWeekNum(d) {
  const j=new Date(d.getFullYear(),0,1);
  return Math.ceil(((d-j)/86400000+j.getDay()+1)/7);
}
function fmt(n) {
  const c = getCur();
  const rounded = c.decimals === 0 ? Math.round(n) : parseFloat(n.toFixed(c.decimals));
  return c.symbol + ' ' + rounded.toLocaleString(c.locale, {
    minimumFractionDigits: c.decimals,
    maximumFractionDigits: c.decimals
  });
}
function fmtS(n) {
  const c = getCur();
  const sym = c.symbol;
  if (c.decimals === 0) {
    if (n >= 1e12) return sym + (n/1e12).toFixed(1) + 'T';
    if (n >= 1e9)  return sym + (n/1e9).toFixed(1) + 'B';
    if (n >= 1e6)  return sym + (n/1e6).toFixed(1) + (c.code === 'IDR' ? (lang === 'id' ? 'jt' : 'mio') : 'M');
    if (n >= 1e3)  return sym + Math.round(n/1e3) + 'k';
    return sym + ' ' + Math.round(n).toLocaleString(c.locale);
  } else {
    if (n >= 1e9) return sym + (n/1e9).toFixed(1) + 'B';
    if (n >= 1e6) return sym + (n/1e6).toFixed(1) + 'M';
    if (n >= 1e3) return sym + (n/1e3).toFixed(1) + 'k';
    return sym + ' ' + n.toFixed(c.decimals);
  }
}
function pctBadge(pct) {
  if(pct===null) return `<span class="badge b-neu">—</span>`;
  return `<span class="badge ${pct>0?'b-up':'b-dn'}">${pct>0?'+':''}${pct.toFixed(1)}%</span>`;
}

// ── METRICS ────────────────────────────────────────────────────────────────

function renderMetrics() {
  const cur=allExpenses.filter(e=>{const d=new Date(e.ts);return d.getFullYear()===today.getFullYear()&&d.getMonth()===today.getMonth();});
  const total=cur.reduce((s,e)=>s+e.amount,0);
  const thisWk=getWeekNum(today);
  const wkTotal =cur.filter(e=>getWeekNum(new Date(e.ts))===thisWk).reduce((s,e)=>s+e.amount,0);
  const prevWkT =cur.filter(e=>getWeekNum(new Date(e.ts))===thisWk-1).reduce((s,e)=>s+e.amount,0);

  document.getElementById('m-total').textContent=fmtS(total);
  document.getElementById('m-count').textContent=`${cur.length} ${t('entries')}`;
  document.getElementById('m-week').textContent =fmtS(wkTotal);
  document.getElementById('m-week-sub').textContent=`${t('week')} ${thisWk}`;

  const wowEl=document.getElementById('m-wow');
  if(prevWkT>0){const p=(wkTotal-prevWkT)/prevWkT*100;wowEl.textContent=(p>0?'+':'')+p.toFixed(1)+'%';wowEl.className='mval '+(p>0?'up':'down');}
  else{wowEl.textContent='—';wowEl.className='mval neu';}

  const pm=new Date(today.getFullYear(),today.getMonth()-1,1);
  const pmT=allExpenses.filter(e=>{const d=new Date(e.ts);return d.getFullYear()===pm.getFullYear()&&d.getMonth()===pm.getMonth();}).reduce((s,e)=>s+e.amount,0);
  const momEl=document.getElementById('m-mom');
  if(pmT>0){const p=(total-pmT)/pmT*100;momEl.textContent=(p>0?'+':'')+p.toFixed(1)+'%';momEl.className='mval '+(p>0?'up':'down');document.getElementById('m-mom-sub').textContent=fmtS(pmT)+' '+t('lastMonth').toLowerCase();}
  else{momEl.textContent='—';momEl.className='mval neu';document.getElementById('m-mom-sub').textContent=t('vsLastMonth');}
}

// ── LEDGER ─────────────────────────────────────────────────────────────────

function renderLedger() {
  const monthly =viewMonthExp().sort((a,b)=>new Date(b.ts)-new Date(a.ts));
  const filtered=activeFilter==='All'?monthly:monthly.filter(e=>e.cat===activeFilter);
  const tbody=document.getElementById('ledger-body');
  const empty =document.getElementById('ledger-empty');
  const pag   =document.getElementById('pagination');

  const total=monthly.reduce((s,e)=>s+e.amount,0);
  const totEl=document.getElementById('ledger-total-line');
  totEl.innerHTML=monthly.length?`${t('monthTotal')}: <strong>${fmt(total)}</strong>`:'';

  if(!filtered.length){tbody.innerHTML='';empty.style.display='';pag.style.display='none';return;}
  empty.style.display='none';

  const shown=Math.min(ledgerPage*PAGE_SIZE,filtered.length);
  tbody.innerHTML=filtered.slice(0,shown).map(e=>`
    <tr>
      <td><div class="day-lbl">${e.day}</div><div style="font-size:11px;color:var(--muted)">${e.date}</div></td>
      <td>${e.name}</td>
      <td class="col-cat"><span class="cat-pill ${catENtoCSS(e.cat)}">${catENtoDisplay(e.cat)}</span></td>
      <td style="text-align:right;font-family:'DM Mono',monospace;font-size:12px">${fmt(e.amount)}</td>
      <td><button class="del-btn" onclick="deleteExpense('${e.id}')" title="${t('confirmDelete')}">×</button></td>
    </tr>`).join('');

  if(filtered.length<=PAGE_SIZE){pag.style.display='none';}
  else{
    pag.style.display='flex';
    document.getElementById('page-info').textContent=`${t('showing')} ${shown} ${t('of')} ${filtered.length} ${t('entries')}`;
    const btn=document.getElementById('btn-see-more');
    btn.textContent=t('seeMore'); btn.disabled=shown>=filtered.length; btn.style.display=shown>=filtered.length?'none':'';
  }
}

function seeMore(){ledgerPage++;renderLedger();}

// ── ANALYTICS ──────────────────────────────────────────────────────────────

function renderDailyChart(days, dMap) {
  const total = days.length;
  const maxPage = Math.max(0, Math.ceil(total / DAILY_PAGE_SIZE) - 1);
  dailyPage = Math.max(0, Math.min(dailyPage, maxPage));

  const start  = dailyPage * DAILY_PAGE_SIZE;
  const slice  = days.slice(start, start + DAILY_PAGE_SIZE);
  const labels = slice.map(k => parseInt(k.split('-')[2])); // numeric day labels
  const values = slice.map(k => dMap[k]);

  // Update nav bar
  const navEl   = document.getElementById('daily-nav');
  const prevBtn = document.getElementById('daily-prev');
  const nextBtn = document.getElementById('daily-next');
  const infoEl  = document.getElementById('daily-nav-info');

  if (total <= DAILY_PAGE_SIZE) {
    if (navEl) navEl.style.display = 'none';
  } else {
    if (navEl) navEl.style.display = 'flex';
    if (prevBtn) prevBtn.disabled = dailyPage === 0;
    if (nextBtn) nextBtn.disabled = dailyPage >= maxPage;
    if (infoEl) {
      const from = start + 1;
      const to   = Math.min(start + DAILY_PAGE_SIZE, total);
      infoEl.textContent = `${from}–${to} / ${total}`;
    }
  }

  if (dailyChartInst) dailyChartInst.destroy();
  dailyChartInst = new Chart(document.getElementById('daily-chart').getContext('2d'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{ data: values, backgroundColor: '#1D9E75', borderRadius: 3, borderSkipped: false }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${fmt(ctx.raw)}` } } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#888' } },
        y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 10 }, color: '#888', callback: v => 'Rp' + Math.round(v/1000) + 'k' } }
      }
    }
  });
}

function changeDailyPage(delta) {
  dailyPage += delta;
  // Re-run renderCharts to rebuild the dMap and re-render
  renderCharts();
}

function renderCharts() {
  document.getElementById('daily-chart-title').textContent=`${t('dailySpend')} — ${monthsLong()[viewMonth_m]} ${viewYear_m}`;
  const monthly=viewMonthExp();
  const catMap={};monthly.forEach(e=>{catMap[e.cat]=(catMap[e.cat]||0)+e.amount;});
  const total=monthly.reduce((s,e)=>s+e.amount,0);
  const actCats=Object.keys(catMap).sort((a,b)=>catMap[b]-catMap[a]);
  const aColors=actCats.map(c=>catENtoColor(c));

  document.getElementById('cat-legend').innerHTML=actCats.map((c,i)=>
    `<span style="display:inline-flex;align-items:center;gap:3px;margin:2px 5px 2px 0;font-size:10px;color:var(--muted)">
      <span style="width:8px;height:8px;border-radius:2px;background:${aColors[i]};display:inline-block"></span>
      ${catENtoDisplay(c)}</span>`).join('');

  if(catChartInst)catChartInst.destroy();
  catChartInst=new Chart(document.getElementById('cat-chart').getContext('2d'),{
    type:'doughnut',
    data:{labels:actCats.map(c=>catENtoDisplay(c)),datasets:[{data:actCats.map(c=>catMap[c]),backgroundColor:aColors,borderWidth:2,borderColor:'#ffffff'}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>` ${fmt(ctx.raw)} (${((ctx.raw/total)*100).toFixed(1)}%)`}}},cutout:'60%'}
  });

  // Build daily map and sort chronologically by actual date number
  const dMap={};monthly.forEach(e=>{dMap[e.dateKey]=(dMap[e.dateKey]||0)+e.amount;});
  const days=Object.keys(dMap).sort((a,b)=>{
    // dateKey format: "YYYY-M-D" — sort by actual day number
    const dayA=parseInt(a.split('-')[2]);
    const dayB=parseInt(b.split('-')[2]);
    return dayA-dayB;
  });
  renderDailyChart(days, dMap);

  const bd=document.getElementById('cat-breakdown');
  if(!total){bd.innerHTML=`<div class="empty">${t('noData')}</div>`;return;}
  bd.innerHTML=actCats.map(c=>{const pct=((catMap[c]/total)*100).toFixed(1);
    return`<div class="bar-row"><div class="bar-top"><span>${catENtoDisplay(c)}</span>
      <span style="font-family:'DM Mono',monospace;color:var(--muted)">${fmt(catMap[c])} <span style="color:var(--hint)">${pct}%</span></span></div>
      <div class="bar-bg"><div class="bar-fill" style="width:${pct}%;background:${catENtoColor(c)}"></div></div></div>`;}).join('');
}

// ── TRENDS ─────────────────────────────────────────────────────────────────

function renderTrends() {
  refreshWeekNav();
  const monthly=viewMonthExp();
  const weekMap={};monthly.forEach(e=>{const wk=getWeekNum(new Date(e.ts));weekMap[wk]=(weekMap[wk]||0)+e.amount;});
  const weeks=Object.keys(weekMap).map(Number).sort((a,b)=>a-b);
  const maxW=Math.max(...Object.values(weekMap),1);
  const selWk=selectedWeekNum();
  const curWk=getWeekNum(today);

  document.getElementById('weekly-rows').innerHTML=weeks.length
    ?weeks.map(wk=>{
      const isSel=wk===selWk,isCur=isCurrentMonth()&&wk===curWk;
      return`<div class="bar-row" style="${isSel?'background:var(--accent-l);border-radius:6px;padding:2px 6px;margin-left:-6px;margin-right:-6px;':''}">
        <div class="bar-top">
          <span style="color:var(--muted)">${t('week')} ${wk}
            ${isCur?`<span style="font-size:9px;background:var(--accent-l);color:var(--accent-d);padding:1px 5px;border-radius:99px;margin-left:4px">${t('today')}</span>`:''}
            ${isSel&&!isCur?`<span style="font-size:9px;background:var(--surf);color:var(--muted);padding:1px 5px;border-radius:99px;margin-left:4px">▶</span>`:''}
          </span>
          <span style="font-family:'DM Mono',monospace">${fmt(weekMap[wk])}</span>
        </div>
        <div class="bar-bg"><div class="bar-fill" style="width:${((weekMap[wk]/maxW)*100).toFixed(1)}%;background:${isSel?'var(--accent)':'var(--hint)'}"></div></div>
      </div>`}).join('')
    :`<div class="empty">${t('noData')}</div>`;

  const wkExp=selWk?monthly.filter(e=>getWeekNum(new Date(e.ts))===selWk):[];
  const wkTotal=wkExp.reduce((s,e)=>s+e.amount,0);
  const monthTotal=monthly.reduce((s,e)=>s+e.amount,0);
  const prevWkNum=selWk?selWk-1:null;
  const prevWkTotal=prevWkNum?(weekMap[prevWkNum]||0):0;
  const pm=new Date(viewYear_m,viewMonth_m-1,1);
  const pmT=allExpenses.filter(e=>{const d=new Date(e.ts);return d.getFullYear()===pm.getFullYear()&&d.getMonth()===pm.getMonth();}).reduce((s,e)=>s+e.amount,0);
  const wowPct=prevWkTotal>0?(wkTotal-prevWkTotal)/prevWkTotal*100:null;
  const momPct=pmT>0?(monthTotal-pmT)/pmT*100:null;
  const daysInMo=new Date(viewYear_m,viewMonth_m+1,0).getDate();
  const daysEl=isCurrentMonth()?today.getDate():daysInMo;

  document.getElementById('mom-rows').innerHTML=`
    <div class="trow"><span class="tlabel">${t('monthTotal')}</span><span class="tval">${fmt(monthTotal)}</span></div>
    <div class="trow" style="background:var(--accent-l);border-radius:4px;padding:4px 6px;margin:2px -4px">
      <span class="tlabel" style="color:var(--accent-d)">${t('week')} ${selWk||'—'}</span>
      <span class="tval" style="color:var(--accent-d)">${fmt(wkTotal)}</span>
    </div>
    <div class="trow"><span class="tlabel">${t('week')} ${prevWkNum||'—'}</span><span class="tval">${fmt(prevWkTotal)}</span></div>
    <div class="trow"><span class="tlabel">WoW</span>${pctBadge(wowPct)}</div>
    <div class="trow"><span class="tlabel">MoM</span>${pctBadge(momPct)}</div>
    <div class="trow"><span class="tlabel">${t('avgPerDay')}</span><span class="tval">${daysEl?fmt(monthTotal/daysEl):'—'}</span></div>
    <div class="trow"><span class="tlabel">${t('lastMonth')}</span><span class="tval">${fmt(pmT)}</span></div>`;

  const catMap={};monthly.forEach(e=>{catMap[e.cat]=(catMap[e.cat]||0)+e.amount;});
  const sorted=Object.keys(catMap).filter(c=>catMap[c]>0).sort((a,b)=>catMap[b]-catMap[a]).slice(0,6);
  document.getElementById('top-cats').innerHTML=sorted.length
    ?sorted.map((c,i)=>{const pct=((catMap[c]/(monthTotal||1))*100).toFixed(1);
      return`<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:.5px solid var(--bdr);${i===sorted.length-1?'border-bottom:none':''}">
        <div style="width:10px;height:10px;border-radius:50%;background:${catENtoColor(c)};flex-shrink:0"></div>
        <div style="flex:1;font-size:12px">${catENtoDisplay(c)}</div>
        <div style="font-size:10px;color:var(--muted)">${pct}%</div>
        <div style="font-family:'DM Mono',monospace;font-size:12px">${fmt(catMap[c])}</div></div>`;}).join('')
    :`<div class="empty">${t('noData')}</div>`;

  const moTots=[];
  for(let i=5;i>=0;i--){
    const d=new Date(viewYear_m,viewMonth_m-i,1);
    moTots.push({label:monthsShort()[d.getMonth()]+'\''+String(d.getFullYear()).slice(2),
      total:allExpenses.filter(e=>{const ed=new Date(e.ts);return ed.getFullYear()===d.getFullYear()&&ed.getMonth()===d.getMonth();}).reduce((s,e)=>s+e.amount,0)});
  }
  if(momChartInst)momChartInst.destroy();
  momChartInst=new Chart(document.getElementById('mom-chart').getContext('2d'),{
    type:'bar',data:{labels:moTots.map(m=>m.label),datasets:[{data:moTots.map(m=>m.total),backgroundColor:moTots.map((_,i)=>i===5?'#1D9E75':'#9FE1CB'),borderRadius:4,borderSkipped:false}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>` ${fmt(ctx.raw)}`}}},
      scales:{x:{grid:{display:false},ticks:{font:{size:11},color:'#888'}},y:{grid:{color:'rgba(0,0,0,0.05)'},ticks:{font:{size:10},color:'#888',callback:v=>'Rp'+Math.round(v/1000)+'k'}}}}
  });
}

// ── YEARLY ─────────────────────────────────────────────────────────────────

function changeYear(d){viewYear+=d;renderYearly();}

function renderYearly() {
  const yrOvEl=document.getElementById('yr-overview-title');
  if(yrOvEl) yrOvEl.innerHTML=`${t('yearOverview')} &mdash; <span id="yr-label">${viewYear}</span>`;
  const yrStEl=document.getElementById('yr-stats-title');
  if(yrStEl) yrStEl.innerHTML=`${t('yearStats')} &mdash; <span id="yr-stats-label">${viewYear}</span>`;

  const MS=monthsShort();
  const yrExp=allExpenses.filter(e=>new Date(e.ts).getFullYear()===viewYear);
  const moT=Array.from({length:12},(_,m)=>yrExp.filter(e=>new Date(e.ts).getMonth()===m).reduce((s,e)=>s+e.amount,0));
  const maxMo=Math.max(...moT,1);
  const thisM=today.getFullYear()===viewYear?today.getMonth():-1;

  document.getElementById('yr-grid').innerHTML=MS.map((mo,i)=>`
    <div class="yr-mo${i===thisM?' active-mo':''}">
      <div class="yr-mo-label">${mo}</div>
      <div class="yr-mo-val">${moT[i]>0?fmtS(moT[i]):'—'}</div>
      <div class="yr-mo-bar" style="width:${((moT[i]/maxMo)*100).toFixed(0)}%;min-width:${moT[i]>0?'8px':'0'}"></div>
    </div>`).join('');

  if(yrChartInst)yrChartInst.destroy();
  yrChartInst=new Chart(document.getElementById('yr-chart').getContext('2d'),{
    type:'bar',data:{labels:MS,datasets:[{data:moT,backgroundColor:MS.map((_,i)=>i===thisM?'#1D9E75':'#9FE1CB'),borderRadius:4,borderSkipped:false}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>` ${fmt(ctx.raw)}`}}},
      scales:{x:{grid:{display:false},ticks:{font:{size:11},color:'#888'}},y:{grid:{color:'rgba(0,0,0,0.05)'},ticks:{font:{size:10},color:'#888',callback:v=>'Rp'+Math.round(v/1000)+'k'}}}}
  });

  const yrTotal=yrExp.reduce((s,e)=>s+e.amount,0);
  const actMo=moT.filter(v=>v>0);
  const yrAvg=actMo.length?yrTotal/actMo.length:0;
  const peakM=moT.indexOf(Math.max(...moT));
  const lowM=actMo.length?moT.indexOf(Math.min(...actMo)):-1;

  document.getElementById('yr-stats').innerHTML=`
    <div class="trow"><span class="tlabel">${t('yearTotal')}</span><span class="tval">${fmt(yrTotal)}</span></div>
    <div class="trow"><span class="tlabel">${t('entries')}</span><span class="tval">${yrExp.length}</span></div>
    <div class="trow"><span class="tlabel">${t('avgPerMonth')}</span><span class="tval">${yrAvg?fmt(yrAvg):'—'}</span></div>
    <div class="trow"><span class="tlabel">${t('peakMonth')}</span><span class="tval">${peakM>=0&&moT[peakM]>0?MS[peakM]:'—'}</span></div>
    <div class="trow"><span class="tlabel">${t('lowestMonth')}</span><span class="tval">${lowM>=0?MS[lowM]:'—'}</span></div>
    <div class="trow"><span class="tlabel">${t('activeMonths')}</span><span class="tval">${actMo.length} / 12</span></div>`;

  const prevYrExp=allExpenses.filter(e=>new Date(e.ts).getFullYear()===viewYear-1);
  const prevYrT  =prevYrExp.reduce((s,e)=>s+e.amount,0);
  const prevMoT  =Array.from({length:12},(_,m)=>prevYrExp.filter(e=>new Date(e.ts).getMonth()===m).reduce((s,e)=>s+e.amount,0));
  const yoyPct   =prevYrT>0?(yrTotal-prevYrT)/prevYrT*100:null;

  document.getElementById('yoy-rows').innerHTML=`
    <div class="trow"><span class="tlabel">${viewYear}</span><span class="tval">${fmt(yrTotal)}</span></div>
    <div class="trow"><span class="tlabel">${viewYear-1}</span><span class="tval">${fmt(prevYrT)}</span></div>
    <div class="trow"><span class="tlabel">${t('yoyChange')}</span>${pctBadge(yoyPct)}</div>
    `+MS.map((mo,i)=>`<div class="trow"><span class="tlabel">${mo}</span>
      <span class="tval" style="font-size:11px">${fmt(moT[i])}
      ${prevMoT[i]>0?`<span style="color:var(--hint);font-size:9px"> was ${fmtS(prevMoT[i])}</span>`:''}</span></div>`).join('');

  const catMap={};yrExp.forEach(e=>{catMap[e.cat]=(catMap[e.cat]||0)+e.amount;});
  const sC=Object.keys(catMap).sort((a,b)=>catMap[b]-catMap[a]);
  document.getElementById('yr-cat-breakdown').innerHTML=sC.length
    ?sC.map(c=>{const pct=((catMap[c]/yrTotal)*100).toFixed(1);
      return`<div class="bar-row"><div class="bar-top"><span>${catENtoDisplay(c)}</span>
        <span style="font-family:'DM Mono',monospace;color:var(--muted)">${fmt(catMap[c])} <span style="color:var(--hint)">${pct}%</span></span></div>
        <div class="bar-bg"><div class="bar-fill" style="width:${pct}%;background:${catENtoColor(c)}"></div></div></div>`;}).join('')
    :`<div class="empty">${t('noDataYear')}</div>`;
}

// ── LANGUAGE ───────────────────────────────────────────────────────────────

function applyLanguage() {
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key=el.getAttribute('data-i18n');
    if(el.tagName==='INPUT'||el.tagName==='TEXTAREA') el.placeholder=t(key);
    else el.textContent=t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{el.placeholder=t(el.getAttribute('data-i18n-placeholder'));});
  const isEN=lang==='en';
  document.getElementById('lang-flag').textContent=isEN?'🇮🇩':'🇬🇧';
  document.getElementById('lang-label').textContent=isEN?'ID':'EN';
  buildCategorySelect();
  applyWalkthroughLang();
  applyCurrencyI18n();
  applyBannerLang();
  refreshAllNavBars();
  buildFilterChips();
  renderLedger();
  renderMetrics();
  updateAmountField();
  const tab=document.querySelector('.tab.active')?.getAttribute('data-i18n');
  if(tab==='tabAnalytics') renderCharts();
  if(tab==='tabTrends')    renderTrends();
  if(tab==='tabYearly')    renderYearly();
}

function updateAmountField() {
  const c = getCur();
  // Update the amount label to show the actual currency symbol
  const amountLabel = document.querySelector('label[data-i18n="amount"]');
  if (amountLabel) amountLabel.textContent = `${t('amount').replace('(Rp)', '').trim()} (${c.symbol})`;
  // Update amount input: allow decimals for decimal currencies, integers for IDR/JPY etc
  const amountInput = document.getElementById('inp-amount');
  if (amountInput) {
    if (c.decimals > 0) {
      amountInput.step = '0.01';
      amountInput.placeholder = '10.00';
    } else {
      amountInput.step = '1';
      amountInput.placeholder = '25000';
    }
  }
}

function toggleLang() {
  lang=lang==='en'?'id':'en';
  localStorage.setItem('spendlog_lang',lang);
  applyLanguage();
}

function buildCategorySelect() {
  const sel = document.getElementById('inp-cat');
  const cur = sel.value;
  sel.innerHTML = '';

  // Group cats from userCats by gKey
  const groupKeys = ['groupFoodDrinks','groupLiving','groupLifestyle','groupFinance'];
  groupKeys.forEach(gKey => {
    const groupCats = userCats.filter(c => c.gKey === gKey);
    if (!groupCats.length) return;
    const og = document.createElement('optgroup');
    og.label = t(gKey);
    groupCats.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.enName;
      opt.textContent = catENtoDisplay(cat.enName);
      og.appendChild(opt);
    });
    sel.appendChild(og);
  });

  // Default to first option if nothing selected or previous selection removed
  if (cur && [...sel.options].some(o => o.value === cur)) {
    sel.value = cur;
  } else {
    sel.selectedIndex = 0;
  }
}

// ── AMOUNT THOUSANDS SEPARATOR ────────────────────────────────────────────

function formatAmountInput(el) {
  // While typing: only strip non-numeric chars, do NOT reformat
  // (reformatting mid-type moves cursor and drops digits)
  const c = getCur();
  const pos = el.selectionStart;
  const raw = el.value.replace(/[^0-9.]/g, '');
  if (el.value !== raw) {
    el.value = raw;
    el.setSelectionRange(pos, pos);
  }
}

function formatAmountBlur(el) {
  // On blur: apply thousands separator for display
  const c = getCur();
  const raw = el.value.replace(/[^0-9.]/g, '');
  if (!raw) return;
  if (c.decimals === 0) {
    const num = parseInt(raw) || 0;
    if (num > 0) el.value = num.toLocaleString(c.locale);
  }
}

function formatAmountFocus(el) {
  // On focus: strip thousands separator so user can type freely
  const raw = el.value.replace(/[^0-9.]/g, '');
  el.value = raw;
}

// ── WHAT'S NEW BANNER ──────────────────────────────────────────────────────

const BANNER_KEY = 'spendlog_banner_v3';

function showWhatsNewBanner() {
  if (localStorage.getItem(BANNER_KEY)) return; // already dismissed
  const el = document.getElementById('whats-new-banner');
  if (el) el.style.display = '';
}

function dismissBanner() {
  localStorage.setItem(BANNER_KEY, '1');
  const el = document.getElementById('whats-new-banner');
  if (el) el.style.display = 'none';
}

function applyBannerLang() {
  const el = document.getElementById('whats-new-banner');
  if (!el) return;
  const titleEl = el.querySelector('.banner-title');
  const descEl  = el.querySelector('.banner-desc');
  const item1   = el.querySelector('.banner-item-1');
  const item2   = el.querySelector('.banner-item-2');
  const item3   = el.querySelector('.banner-item-3');
  const btnEl   = el.querySelector('.banner-gotit');
  if (titleEl) titleEl.textContent = t('whatsNewTitle');
  if (descEl)  descEl.textContent  = t('whatsNewDesc');
  if (item1)   item1.textContent   = t('whatsNew1');
  if (item2)   item2.textContent   = t('whatsNew2');
  if (item3)   item3.textContent   = t('whatsNew3');
  if (btnEl)   btnEl.textContent   = t('gotIt');
}

// ── CATEGORY MANAGER ──────────────────────────────────────────────────────

let pendingDeleteCat = null; // enName of cat pending deletion

function openCatManager() {
  renderCatManager();
  document.getElementById('cat-modal').classList.add('open');
}

function closeCatManager() {
  document.getElementById('cat-modal').classList.remove('open');
}

function renderCatManager() {
  const body = document.getElementById('cat-manager-body');
  const groupKeys = ['groupFoodDrinks','groupLiving','groupLifestyle','groupFinance'];
  body.innerHTML = groupKeys.map(gKey => {
    const cats = userCats.filter(c => c.gKey === gKey);
    if (!cats.length) return '';
    return `<div class="cm-group">
      <div class="cm-group-label">${t(gKey)}</div>
      <div class="cm-cat-list">
        ${cats.map(cat => `
          <div class="cm-cat-row">
            <span class="cat-pill ${catENtoCSS(cat.enName)}">${catENtoDisplay(cat.enName)}</span>
            <button class="del-btn" onclick="confirmDeleteCat('${cat.enName.replace(/'/g,"\'")}')">×</button>
          </div>`).join('')}
      </div>
    </div>`;
  }).join('');

  // Update add form labels
  const groupSel = document.getElementById('cm-group-sel');
  if (groupSel) {
    const curVal = groupSel.value;
    groupSel.innerHTML = groupKeys.map(gk =>
      `<option value="${gk}">${t(gk)}</option>`).join('');
    if (curVal) groupSel.value = curVal;
  }

  applyBannerLang();
}

function confirmDeleteCat(enName) {
  pendingDeleteCat = enName;
  const modal = document.getElementById('delete-cat-modal');
  const preview = document.getElementById('delete-cat-preview');
  if (preview) preview.textContent = catENtoDisplay(enName);
  // Apply i18n
  modal.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  modal.classList.add('open');
}

function closeDeleteCatModal() {
  document.getElementById('delete-cat-modal').classList.remove('open');
  pendingDeleteCat = null;
}

function doDeleteCat() {
  if (!pendingDeleteCat) return;
  userCats = userCats.filter(c => c.enName !== pendingDeleteCat);
  saveUserCats();
  closeDeleteCatModal();
  buildCategorySelect();
  renderCatManager();
  showToast(`✓ Category removed`);
}

function addNewCategory() {
  const nameInput = document.getElementById('cm-new-name');
  const groupSel  = document.getElementById('cm-group-sel');
  const name = nameInput?.value.trim();
  const gKey = groupSel?.value;
  if (!name || !gKey) return;
  // Check for duplicate
  if (userCats.some(c => c.enName.toLowerCase() === name.toLowerCase())) {
    showToast('⚠ Category already exists');
    return;
  }
  const newCat = { id: 'cat_' + Date.now(), gKey, enName: name };
  userCats.push(newCat);
  saveUserCats();
  if (nameInput) nameInput.value = '';
  buildCategorySelect();
  renderCatManager();
  showToast(`✓ "${name}" added`);
}

// ── IMPORT / EXPORT ────────────────────────────────────────────────────────

function openModal()  { document.getElementById('modal').classList.add('open'); }
function closeModal() { document.getElementById('modal').classList.remove('open'); }
document.getElementById('modal').addEventListener('click',e=>{if(e.target===document.getElementById('modal'))closeModal();});
document.getElementById('delete-modal').addEventListener('click',e=>{if(e.target===document.getElementById('delete-modal'))closeDeleteModal();});
document.getElementById('cat-modal').addEventListener('click',e=>{if(e.target===document.getElementById('cat-modal'))closeCatManager();});
document.getElementById('delete-cat-modal').addEventListener('click',e=>{if(e.target===document.getElementById('delete-cat-modal'))closeDeleteCatModal();});
// Thousands separator on amount input
document.getElementById('inp-amount').addEventListener('input', function(){ formatAmountInput(this); });
document.getElementById('inp-amount').addEventListener('blur',  function(){ formatAmountBlur(this); });
document.getElementById('inp-amount').addEventListener('focus', function(){ formatAmountFocus(this); });

function toCSVRow(f){return f.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',');}

function exportCSV() {
  const s=[...allExpenses].sort((a,b)=>new Date(a.ts)-new Date(b.ts));
  const blob=new Blob(['ID,Date,Day,Name,Category,Amount,Timestamp\n'+s.map(e=>toCSVRow([e.id,e.date,e.day,e.name,e.cat,e.amount,e.ts])).join('\n')],{type:'text/csv'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download=`spendlog_export_${new Date().toISOString().slice(0,10)}.csv`;a.click();
}

function copyTSV() {
  const s=[...allExpenses].sort((a,b)=>new Date(a.ts)-new Date(b.ts));
  navigator.clipboard.writeText('Date\tDay\tName\tCategory\tAmount\tTimestamp\n'+s.map(e=>[e.date,e.day,e.name,e.cat,e.amount,e.ts].join('\t')).join('\n'))
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
    const toIns=[];let imported=0;
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
      allExpenses.unshift(exp);toIns.push(expToRow(exp));existingIds.add(id);imported++;
    }
    input.value='';
    if(toIns.length>0){
      setSyncStatus('syncing','importing');
      const{error}=await db.from('expenses').upsert(toIns,{onConflict:'id'});
      if(error){setSyncStatus('error','syncFailed');showToast(`⚠ ${imported} rows imported locally but cloud sync failed`);cacheAll();}
      else{setSyncStatus('synced','synced');cacheAll();showToast(`✓ ${imported} ${t('entries')} imported & synced`);}
    }
    const m=document.getElementById('import-msg');m.textContent=`${t('importSuccess')} (${imported})`;m.style.display='block';
    setTimeout(()=>m.style.display='none',3000);
    ledgerPage=1;buildFilterChips();renderLedger();renderMetrics();
  };
  reader.readAsText(file);
}

// ── KEYBOARD + CONNECTIVITY ────────────────────────────────────────────────

document.getElementById('inp-name').addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('inp-amount').focus();});
document.getElementById('inp-amount').addEventListener('keydown',e=>{if(e.key==='Enter')addExpense();});
document.getElementById('auth-email').addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('auth-password').focus();});
document.getElementById('auth-password').addEventListener('keydown',e=>{if(e.key==='Enter')handleEmailAuth();});
document.getElementById('auth-confirm').addEventListener('keydown',e=>{if(e.key==='Enter')handleEmailAuth();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeDeleteModal();closeCatManager();closeDeleteCatModal();}});

window.addEventListener('online', async()=>{showToast(t('toastBackOnline'));await loadFromSupabase();renderLedger();renderMetrics();});
window.addEventListener('offline',()=>{setSyncStatus('error','offline');showToast(t('toastOffline'));});

// ── AUTH STATE + INIT ──────────────────────────────────────────────────────

// ── AUTH STATE + INIT ──────────────────────────────────────────────────────
// Simple approach: check session once on load, then listen for changes.
// onAuthStateChange only handles post-init events (sign in / sign out actions).

let _appReady = false;

async function bootApp(user) {
  if (_appReady) return; // prevent double-boot
  console.log('bootApp started for:', user?.email);
  try {
    await _bootApp(user);
  } catch(e) {
    console.error('bootApp crashed:', e);
    // Last resort — show the app anyway so user is never stuck
    hideLoading();
    showScreen('app');
    applyLanguage();
    refreshAllNavBars();
    backgroundSync();
  }
}

async function _bootApp(user) {
  _appReady = true;
  applyUser(user);
  buildCategorySelect();

  // Show cached data immediately — never block on profile/network
  allExpenses = loadCache();
  hideLoading();

  // Load profile with a timeout so it never hangs
  let profileExists = false;
  try {
    const profilePromise = loadProfile();
    const timeoutPromise = new Promise(r => setTimeout(() => r(false), 4000));
    profileExists = await Promise.race([profilePromise, timeoutPromise]);
  } catch(e) {
    console.warn('_bootApp: profile load failed:', e.message);
  }

  if (!profileExists) {
    const hasCachedData = allExpenses.length > 0;

    if (hasCachedData) {
      userCurrency = 'IDR';
      saveProfile('IDR').catch(e => console.warn('saveProfile failed:', e.message));
    } else {
      let hasDbData = false;
      try {
        const checkPromise = db.from('expenses').select('id', { count: 'exact', head: true });
        const t = new Promise(r => setTimeout(() => r({ count: 0, data: null, error: null }), 3000));
        const result = await Promise.race([checkPromise, t]);
        hasDbData = (result?.count || 0) > 0;
      } catch(e) {
        console.warn('_bootApp: DB check failed:', e.message);
      }

      if (hasDbData) {
        userCurrency = 'IDR';
        saveProfile('IDR').catch(e => console.warn('saveProfile failed:', e.message));
      } else {
        showScreen('currency');
        return;
      }
    }
  }

  loadUserCats();
  showScreen('app');
  applyLanguage();
  updateAmountField();
  showWhatsNewBanner();
  refreshAllNavBars();
  backgroundSync();
}

async function backgroundSync() {
  setSyncStatus('syncing', 'loading');

  // Small delay to let the UI settle first
  await new Promise(r => setTimeout(r, 300));

  // Update currency badge
  const badge = document.getElementById('currency-badge');
  if (badge && userCurrency) badge.textContent = getCur().symbol + ' ' + userCurrency;

  // Fetch fresh data (token is managed automatically by Supabase client)
  await loadFromSupabase();

  // Re-render everything with fresh data
  buildFilterChips();
  renderLedger();
  renderMetrics();

  const activeTab = document.querySelector('.tab.active')?.getAttribute('data-i18n');
  if (activeTab === 'tabAnalytics') renderCharts();
  if (activeTab === 'tabTrends')    renderTrends();
  if (activeTab === 'tabYearly')    renderYearly();
}

db.auth.onAuthStateChange(async(event, session) => {
  console.log('onAuthStateChange:', event, session?.user?.email || 'no user');

  if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
    if (session?.user && !_appReady) {
      await bootApp(session.user);
    }
  } else if (event === 'TOKEN_REFRESHED') {
    // Token silently auto-refreshed by Supabase — just update user, do NOT re-sync
    // (re-syncing here caused an infinite loop → 429 Too Many Requests → forced logout)
    if (session?.user) applyUser(session.user);
  } else if (event === 'SIGNED_OUT') {
    _appReady = false;
    allExpenses = [];
    showScreen('auth');
  }
});

(async function init(){
  showLoading(t('loading'));

  // Apply i18n to auth screen elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (el.tagName==='INPUT' || el.tagName==='TEXTAREA') el.placeholder = t(key);
    else el.textContent = t(key);
  });
  buildCategorySelect();
  applyWalkthroughLang();
  goToSlide(0);

  // Give onAuthStateChange a chance to fire INITIAL_SESSION first (Supabase v2)
  // If it fires within 2s, bootApp handles everything.
  // If not, we fall back to getSession() manually.
  const sessionHandled = await new Promise(resolve => {
    const timer = setTimeout(() => resolve(false), 2000);
    const unsub = db.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') {
        clearTimeout(timer);
        unsub.data?.subscription?.unsubscribe();
        resolve(!!session);
      }
    });
  });

  if (sessionHandled) {
    // onAuthStateChange already called bootApp via INITIAL_SESSION
    console.log('Session handled by INITIAL_SESSION event');
    return;
  }

  // Fallback: check session manually
  try {
    const { data: { session }, error } = await db.auth.getSession();
    console.log('getSession fallback:', error ? 'error:'+error.message : (session ? 'found' : 'none'));
    if (error || !session) {
      hideLoading();
      showScreen('auth');
    } else {
      await bootApp(session.user);
    }
  } catch(e) {
    console.error('Init failed:', e);
    hideLoading();
    showScreen('auth');
  }
})();
