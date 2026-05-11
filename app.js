/* =============================================
   spend.log — app.js  (multi-user edition)
   ============================================= */

'use strict';

// ── SUPABASE ───────────────────────────────────────────────────────────────

const SUPABASE_URL = 'https://wpnsxvpjxfyevrdxqiln.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbnN4dnBqeGZ5ZXZyZHhxaWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MDA2MzMsImV4cCI6MjA5MzI3NjYzM30.zNKyyLipYPlCy82RRS66yy5ApqS8t_feNEx_xDnnWu0';
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true } });

// ── i18n ───────────────────────────────────────────────────────────────────

const I18N = {
  en: {
    importExport:'⇅ Import / Export', thisMonth:'This month', thisWeek:'This week',
    vsLastMonth:'vs last month', vsLastWeek:'vs last week',
    name:'Name', namePlaceholder:'e.g. Nasi padang', amount:'Amount (Rp)',
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
    emailLabel:'Email', passwordLabel:'Password', confirmPasswordLabel:'Confirm password',
    orDivider:'or', continueGoogle:'Continue with Google',
    authFooter:'By signing in you agree to keep your data awesome 🎉',
    authTagline:'Your personal expense tracker',
    signingIn:'Signing in…', creatingAccount:'Creating account…',
    checkEmailMsg:'Account created! Check your email to confirm, then sign in.',
    errFillFields:'Please enter your email and password.',
    errPasswordShort:'Password must be at least 6 characters.',
    errPasswordMatch:'Passwords do not match.',
  },
  id: {
    importExport:'⇅ Impor / Ekspor', thisMonth:'Bulan ini', thisWeek:'Minggu ini',
    vsLastMonth:'vs bulan lalu', vsLastWeek:'vs minggu lalu',
    name:'Nama', namePlaceholder:'cth. Nasi padang', amount:'Jumlah (Rp)',
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
    emailLabel:'Email', passwordLabel:'Kata sandi', confirmPasswordLabel:'Konfirmasi kata sandi',
    orDivider:'atau', continueGoogle:'Lanjutkan dengan Google',
    authFooter:'Dengan masuk, kamu setuju untuk menjaga datamu tetap keren 🎉',
    authTagline:'Pencatat pengeluaran pribadimu',
    signingIn:'Sedang masuk…', creatingAccount:'Membuat akun…',
    checkEmailMsg:'Akun dibuat! Cek emailmu untuk konfirmasi, lalu masuk.',
    errFillFields:'Masukkan email dan kata sandimu.',
    errPasswordShort:'Kata sandi minimal 6 karakter.',
    errPasswordMatch:'Kata sandi tidak cocok.',
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

// ── TRANSLATION HELPERS ────────────────────────────────────────────────────

function t(key)          { return (I18N[lang]&&I18N[lang][key])||I18N.en[key]||key; }
function catKeyToEN(key) { return I18N.en[key]||key; }
function catENtoDisplay(n){ const i=CAT_KEYS.findIndex(k=>I18N.en[k]===n); return i>=0?t(CAT_KEYS[i]):n; }
function catENtoColor(n)  { const i=CAT_KEYS.findIndex(k=>I18N.en[k]===n); return i>=0?CAT_COLS[i]:'#888'; }
function catENtoCSS(n)    { const i=CAT_KEYS.findIndex(k=>I18N.en[k]===n); return i>=0?CAT_CSS[i]:'cc-others'; }
function monthsLong()     { return lang==='id'?MONTHS_ID:MONTHS_EN; }
function monthsShort()    { return lang==='id'?MONTHS_S_ID:MONTHS_S_EN; }

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
  document.getElementById('auth-screen').style.display = name==='auth' ? '' : 'none';
  document.getElementById('main-app').style.display    = name==='app'  ? '' : 'none';
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
  const email  = user.email || '';
  document.getElementById('user-avatar').textContent      = email.charAt(0).toUpperCase();
  document.getElementById('user-email-short').textContent = email.split('@')[0];
  document.getElementById('user-pill').title              = email;
}

// ── CACHE (per user) ───────────────────────────────────────────────────────

function cacheKey()  { return `spendlog_cache_${currentUser?.id||'anon'}`; }
function cacheAll()  { try { localStorage.setItem(cacheKey(), JSON.stringify(allExpenses)); } catch(e){} }
function loadCache() { try { return JSON.parse(localStorage.getItem(cacheKey())||'[]'); } catch(e){ return []; } }

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

async function loadFromSupabase() {
  setSyncStatus('syncing','loading');
  const { data, error } = await db.from('expenses').select('*').order('ts',{ascending:false});
  if (error) {
    console.error(error); setSyncStatus('error','offline');
    allExpenses = loadCache(); showToast(t('toastCached'));
  } else {
    allExpenses = (data||[]).map(rowToExp);
    cacheAll(); setSyncStatus('synced','synced');
  }
}

// ── MONTH / WEEK NAVIGATION ────────────────────────────────────────────────

function isCurrentMonth() { return viewYear_m===today.getFullYear() && viewMonth_m===today.getMonth(); }

function changeViewMonth(delta) {
  viewMonth_m += delta;
  if (viewMonth_m<0)  { viewMonth_m=11; viewYear_m--; }
  if (viewMonth_m>11) { viewMonth_m=0;  viewYear_m++; }
  ledgerPage=1; activeFilter='All'; viewWeekOffset=0;
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
  document.getElementById('other-row').style.display =
    document.getElementById('inp-cat').value===catKeyToEN('catOthers')?'block':'none';
}

async function addExpense() {
  const name   = document.getElementById('inp-name').value.trim();
  const amount = parseFloat(document.getElementById('inp-amount').value);
  const selVal = document.getElementById('inp-cat').value;
  let cat = selVal;
  if (selVal===catKeyToEN('catOthers')) {
    const c=document.getElementById('inp-other-cat').value.trim();
    if (c) cat=c;
  }
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
  ['inp-name','inp-amount','inp-date','inp-other-cat'].forEach(id=>{document.getElementById(id).value='';});
  document.getElementById('other-row').style.display='none';
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
function fmt(n)  { return 'Rp '+Math.round(n).toLocaleString('id-ID'); }
function fmtS(n) {
  if(n>=1e9) return 'Rp '+(n/1e9).toFixed(1)+'M';
  if(n>=1e6) return 'Rp '+(n/1e6).toFixed(1)+(lang==='id'?'jt':'mio');
  return 'Rp '+Math.round(n/1000)+'k';
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

  const dMap={};monthly.forEach(e=>{dMap[e.dateKey]=(dMap[e.dateKey]||0)+e.amount;});
  const days=Object.keys(dMap).sort();
  if(dailyChartInst)dailyChartInst.destroy();
  dailyChartInst=new Chart(document.getElementById('daily-chart').getContext('2d'),{
    type:'bar',
    data:{labels:days.map(k=>k.split('-')[2]),datasets:[{data:days.map(k=>dMap[k]),backgroundColor:'#1D9E75',borderRadius:3,borderSkipped:false}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>` ${fmt(ctx.raw)}`}}},
      scales:{x:{grid:{display:false},ticks:{font:{size:10},color:'#888',autoSkip:true,maxTicksLimit:15}},
              y:{grid:{color:'rgba(0,0,0,0.05)'},ticks:{font:{size:10},color:'#888',callback:v=>'Rp'+Math.round(v/1000)+'k'}}}}
  });

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
  refreshAllNavBars();
  buildFilterChips();
  renderLedger();
  renderMetrics();
  const tab=document.querySelector('.tab.active')?.getAttribute('data-i18n');
  if(tab==='tabAnalytics') renderCharts();
  if(tab==='tabTrends')    renderTrends();
  if(tab==='tabYearly')    renderYearly();
}

function toggleLang() {
  lang=lang==='en'?'id':'en';
  localStorage.setItem('spendlog_lang',lang);
  applyLanguage();
}

function buildCategorySelect() {
  const sel=document.getElementById('inp-cat');
  const cur=sel.value;
  const groups=[
    {lk:'groupFoodDrinks',cats:['catBreakfast','catLunch','catDinner','catCoffee','catSnack','catGroceries','catBabies']},
    {lk:'groupLiving',    cats:['catUtilities','catTransport','catHealth','catDaily']},
    {lk:'groupLifestyle', cats:['catSports','catShopping','catEntertainment','catEducation']},
    {lk:'groupFinance',   cats:['catInstallment','catSubscription','catSavings']},
  ];
  sel.innerHTML='';
  groups.forEach(g=>{
    const og=document.createElement('optgroup'); og.label=t(g.lk);
    g.cats.forEach(key=>{
      const opt=document.createElement('option');
      opt.value=catKeyToEN(key); opt.textContent=t(key);
      if(key==='catLunch') opt.selected=true;
      og.appendChild(opt);
    });
    sel.appendChild(og);
  });
  const oth=document.createElement('option');
  oth.value=catKeyToEN('catOthers'); oth.textContent=t('catOthers');
  sel.appendChild(oth);
  if(cur) sel.value=cur;
}

// ── IMPORT / EXPORT ────────────────────────────────────────────────────────

function openModal()  { document.getElementById('modal').classList.add('open'); }
function closeModal() { document.getElementById('modal').classList.remove('open'); }
document.getElementById('modal').addEventListener('click',e=>{if(e.target===document.getElementById('modal'))closeModal();});
document.getElementById('delete-modal').addEventListener('click',e=>{if(e.target===document.getElementById('delete-modal'))closeDeleteModal();});

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
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeDeleteModal();}});

window.addEventListener('online', async()=>{showToast(t('toastBackOnline'));await loadFromSupabase();renderLedger();renderMetrics();});
window.addEventListener('offline',()=>{setSyncStatus('error','offline');showToast(t('toastOffline'));});

// ── AUTH STATE + INIT ──────────────────────────────────────────────────────

db.auth.onAuthStateChange(async(event,session)=>{
  console.log('Auth state change:', event, session?.user?.email || 'no user');
  if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'){
    if(!session?.user) return;
    showLoading(t('connecting'));
    applyUser(session.user);
    buildCategorySelect();
    await loadFromSupabase();
    hideLoading();
    showScreen('app');
    applyLanguage();
    refreshAllNavBars();
  } else if(event==='SIGNED_OUT'){
    allExpenses=[];
    showScreen('auth');
  }
});

(async function init(){
  showLoading(t('loading'));

  // Apply auth screen language before anything renders
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key=el.getAttribute('data-i18n');
    if(el.tagName==='INPUT'||el.tagName==='TEXTAREA') el.placeholder=t(key);
    else el.textContent=t(key);
  });
  buildCategorySelect();

  // Safety net: if Supabase takes more than 5s, show auth screen anyway
  const timeout = setTimeout(()=>{
    console.warn('Supabase session check timed out — showing auth screen');
    hideLoading();
    showScreen('auth');
  }, 5000);

  try {
    const { data: { session }, error } = await db.auth.getSession();
    clearTimeout(timeout);
    if (error) {
      console.error('Session error:', error);
      hideLoading();
      showScreen('auth');
    } else if (!session) {
      hideLoading();
      showScreen('auth');
    }
    // If session exists, onAuthStateChange fires and handles the rest
  } catch(e) {
    clearTimeout(timeout);
    console.error('Init error:', e);
    hideLoading();
    showScreen('auth');
  }
})();
