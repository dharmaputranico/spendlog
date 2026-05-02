/* =============================================
   spend.log — app.js  (Supabase edition)
   ============================================= */

'use strict';

// ── SUPABASE CONFIG ────────────────────────────────────────────────────────

const SUPABASE_URL = 'https://wpnsxvpjxfyevrdxqiln.supabase.co';
const SUPABASE_KEY = 'sb_publishable_U6c6OJhIs9yem90wJAmHYg_E-VC4LMj';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── CONSTANTS ──────────────────────────────────────────────────────────────

const CATS = [
  'Breakfast','Lunch','Dinner','Coffee','Snack',
  'Utilities','Transport','Health','Daily necessities',
  'Sports','Shopping','Entertainment','Education',
  'Installment','Subscription','Savings','Others'
];

const CAT_COLS = [
  '#EF9F27','#1D9E75','#639922','#9B4E00','#856404',
  '#378ADD','#0A6B6B','#7a2d9c','#888780',
  '#D85A30','#D4537E','#BF360C','#2E7D32',
  '#7F77DD','#3949AB','#1565C0','#6A1B9A'
];

const CAT_CLS = {
  'Breakfast':'cc-breakfast','Lunch':'cc-lunch','Dinner':'cc-dinner',
  'Coffee':'cc-coffee','Snack':'cc-snack','Utilities':'cc-utilities',
  'Transport':'cc-transport','Health':'cc-health',
  'Daily necessities':'cc-daily','Sports':'cc-sports',
  'Shopping':'cc-shopping','Entertainment':'cc-entertainment',
  'Education':'cc-education','Installment':'cc-installment',
  'Subscription':'cc-subscription','Savings':'cc-savings','Others':'cc-others'
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ── STATE ──────────────────────────────────────────────────────────────────

let allExpenses    = [];
let activeFilter   = 'All';
let viewYear       = new Date().getFullYear();
let isOnline       = true;

let catChartInst   = null;
let dailyChartInst = null;
let momChartInst   = null;
let yrChartInst    = null;

const now = new Date();

// ── SYNC STATUS UI ─────────────────────────────────────────────────────────

function setSyncStatus(state, label) {
  const dot = document.getElementById('sync-dot');
  const lbl = document.getElementById('sync-label');
  dot.className = 'sync-dot ' + state;
  lbl.textContent = label;
}

let toastTimer = null;
function showToast(msg, duration = 2500) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), duration);
}

// ── LOCAL CACHE (fallback when offline) ────────────────────────────────────

function cacheAll() {
  try { localStorage.setItem('spendlog_cache', JSON.stringify(allExpenses)); } catch (e) {}
}

function loadCache() {
  try { return JSON.parse(localStorage.getItem('spendlog_cache') || '[]'); } catch (e) { return []; }
}

// ── ROW MAPPING ────────────────────────────────────────────────────────────
// Supabase row  → local expense object

function rowToExp(row) {
  const d = new Date(row.ts);
  return {
    id:      row.id,
    name:    row.name,
    amount:  parseFloat(row.amount),
    cat:     row.cat,
    ts:      row.ts,
    date:    d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
    day:     d.toLocaleDateString('en', { weekday: 'short' }),
    dateKey: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
  };
}

// Local expense → Supabase insert payload
function expToRow(exp) {
  return {
    id:       String(exp.id),
    name:     exp.name,
    amount:   exp.amount,
    cat:      exp.cat,
    ts:       exp.ts,
    date:     exp.date,
    day:      exp.day,
    date_key: exp.dateKey
  };
}

// ── LOAD FROM SUPABASE ─────────────────────────────────────────────────────

async function loadFromSupabase() {
  setSyncStatus('syncing', 'Loading…');
  document.getElementById('loading-text').textContent = 'Loading your expenses…';

  const { data, error } = await db
    .from('expenses')
    .select('*')
    .order('ts', { ascending: false });

  if (error) {
    console.error('Supabase load error:', error);
    setSyncStatus('error', 'Offline');
    isOnline = false;
    allExpenses = loadCache();
    showToast('⚠ Could not reach cloud — showing cached data');
  } else {
    allExpenses = (data || []).map(rowToExp);
    cacheAll();
    setSyncStatus('synced', 'Synced');
    isOnline = true;
  }
}

// ── ADD EXPENSE ────────────────────────────────────────────────────────────

function onCatChange() {
  const v = document.getElementById('inp-cat').value;
  document.getElementById('other-row').style.display = v === 'Others' ? 'block' : 'none';
}

async function addExpense() {
  const name   = document.getElementById('inp-name').value.trim();
  const amount = parseFloat(document.getElementById('inp-amount').value);
  let cat      = document.getElementById('inp-cat').value;

  if (cat === 'Others') {
    const oc = document.getElementById('inp-other-cat').value.trim();
    if (oc) cat = oc;
  }

  if (!name || isNaN(amount) || amount <= 0) {
    document.getElementById('inp-name').focus();
    return;
  }

  const manualDate = document.getElementById('inp-date').value;
  const d = manualDate ? new Date(manualDate + 'T12:00:00') : new Date();

  const exp = {
    id:      String(Date.now()) + String(Math.random()).slice(2, 7),
    name,
    amount,
    cat,
    ts:      d.toISOString(),
    date:    d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
    day:     d.toLocaleDateString('en', { weekday: 'short' }),
    dateKey: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
  };

  // Optimistic UI — show immediately
  allExpenses.unshift(exp);
  buildFilterChips();
  render();

  // Clear form
  document.getElementById('inp-name').value      = '';
  document.getElementById('inp-amount').value    = '';
  document.getElementById('inp-date').value      = '';
  document.getElementById('inp-other-cat').value = '';
  document.getElementById('other-row').style.display = 'none';
  document.getElementById('inp-name').focus();

  // Disable button while saving
  const btn = document.getElementById('add-btn');
  btn.disabled = true;
  setSyncStatus('syncing', 'Saving…');

  const { error } = await db.from('expenses').insert([expToRow(exp)]);

  btn.disabled = false;

  if (error) {
    console.error('Insert error:', error);
    setSyncStatus('error', 'Save failed');
    showToast('⚠ Could not save to cloud — stored locally');
    cacheAll();
  } else {
    setSyncStatus('synced', 'Synced');
    cacheAll();
    showToast('✓ Expense saved & synced');
  }
}

// ── DELETE EXPENSE ─────────────────────────────────────────────────────────

async function deleteExpense(id) {
  const strId = String(id);

  // Optimistic remove
  allExpenses = allExpenses.filter(e => String(e.id) !== strId);
  render();

  setSyncStatus('syncing', 'Deleting…');

  const { error } = await db.from('expenses').delete().eq('id', strId);

  if (error) {
    console.error('Delete error:', error);
    setSyncStatus('error', 'Delete failed');
    showToast('⚠ Could not delete from cloud');
    // Reload to restore state
    await loadFromSupabase();
    render();
  } else {
    setSyncStatus('synced', 'Synced');
    cacheAll();
  }
}

// ── FILTER CHIPS ───────────────────────────────────────────────────────────

function setFilter(f, el) {
  activeFilter = f;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  renderLedger();
}

function buildFilterChips() {
  const usedCats = [...new Set(thisMonthExp().map(e => e.cat))];
  const row = document.getElementById('filter-chips');
  row.innerHTML = `<div class="chip${activeFilter === 'All' ? ' active' : ''}" onclick="setFilter('All',this)">All</div>`;
  usedCats.forEach(c => {
    const el = document.createElement('div');
    el.className  = 'chip' + (activeFilter === c ? ' active' : '');
    el.textContent = c;
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

function catColor(cat) { return CAT_COLS[CATS.indexOf(cat)] || '#888'; }
function catCls(cat)   { return CAT_CLS[cat] || 'cc-others'; }

function pctBadge(pct) {
  if (pct === null) return `<span class="badge b-neu">—</span>`;
  const cls = pct > 0 ? 'b-up' : 'b-dn';
  return `<span class="badge ${cls}">${pct > 0 ? '+' : ''}${pct.toFixed(1)}%</span>`;
}

// ── RENDER ─────────────────────────────────────────────────────────────────

function render() {
  renderMetrics();
  buildFilterChips();
  renderLedger();
}

function renderMetrics() {
  const monthly     = thisMonthExp();
  const total       = monthly.reduce((s, e) => s + e.amount, 0);
  const thisWk      = getWeekNum(now);
  const wkTotal     = monthly.filter(e => getWeekNum(new Date(e.ts)) === thisWk).reduce((s, e) => s + e.amount, 0);
  const prevWkTotal = monthly.filter(e => getWeekNum(new Date(e.ts)) === thisWk - 1).reduce((s, e) => s + e.amount, 0);

  document.getElementById('m-total').textContent = fmtS(total);
  document.getElementById('m-count').textContent = `${monthly.length} entries`;
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
    .reduce((s, e) => s + e.amount, 0);

  const momEl = document.getElementById('m-mom');
  if (prevMoTotal > 0) {
    const pct = (total - prevMoTotal) / prevMoTotal * 100;
    momEl.textContent = (pct > 0 ? '+' : '') + pct.toFixed(1) + '%';
    momEl.className   = 'mval ' + (pct > 0 ? 'up' : 'down');
    document.getElementById('m-mom-sub').textContent = fmtS(prevMoTotal) + ' last mo';
  } else { momEl.textContent = '—'; momEl.className = 'mval neu'; }
}

function renderLedger() {
  const monthly  = thisMonthExp().sort((a, b) => new Date(b.ts) - new Date(a.ts));
  const filtered = activeFilter === 'All' ? monthly : monthly.filter(e => e.cat === activeFilter);
  const tbody    = document.getElementById('ledger-body');
  const empty    = document.getElementById('ledger-empty');

  if (!filtered.length) { tbody.innerHTML = ''; empty.style.display = ''; return; }
  empty.style.display = 'none';

  tbody.innerHTML = filtered.map(e => `
    <tr>
      <td>
        <div class="day-lbl">${e.day}</div>
        <div style="font-size:11px;color:var(--muted)">${e.date}</div>
      </td>
      <td>${e.name}</td>
      <td class="col-cat"><span class="cat-pill ${catCls(e.cat)}">${e.cat}</span></td>
      <td style="text-align:right;font-family:'DM Mono',monospace;font-size:12px">${fmt(e.amount)}</td>
      <td><button class="del-btn" onclick="deleteExpense('${e.id}')">×</button></td>
    </tr>
  `).join('');
}

// ── ANALYTICS ──────────────────────────────────────────────────────────────

function renderCharts() {
  const monthly   = thisMonthExp();
  const catTotals = {};
  CATS.forEach(c => { catTotals[c] = 0; });
  monthly.forEach(e => { catTotals[e.cat] = (catTotals[e.cat] || 0) + e.amount; });
  const total = monthly.reduce((s, e) => s + e.amount, 0);

  const activeCats = Object.keys(catTotals).filter(c => catTotals[c] > 0).sort((a, b) => catTotals[b] - catTotals[a]);
  const aColors    = activeCats.map(c => catColor(c));

  document.getElementById('cat-legend').innerHTML = activeCats.map((c, i) =>
    `<span style="display:inline-flex;align-items:center;gap:3px;margin:2px 5px 2px 0;font-size:10px;color:var(--muted)">
      <span style="width:8px;height:8px;border-radius:2px;background:${aColors[i]};display:inline-block"></span>${c}
    </span>`
  ).join('');

  if (catChartInst) catChartInst.destroy();
  catChartInst = new Chart(document.getElementById('cat-chart').getContext('2d'), {
    type: 'doughnut',
    data: { labels: activeCats, datasets: [{ data: activeCats.map(c => catTotals[c]), backgroundColor: aColors, borderWidth: 2, borderColor: '#ffffff' }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${fmt(ctx.raw)} (${((ctx.raw / total) * 100).toFixed(1)}%)` } } },
      cutout: '60%'
    }
  });

  const dailyMap  = {};
  monthly.forEach(e => { dailyMap[e.dateKey] = (dailyMap[e.dateKey] || 0) + e.amount; });
  const days      = Object.keys(dailyMap).sort();
  const dayLabels = days.map(k => k.split('-')[2]);

  if (dailyChartInst) dailyChartInst.destroy();
  dailyChartInst = new Chart(document.getElementById('daily-chart').getContext('2d'), {
    type: 'bar',
    data: { labels: dayLabels, datasets: [{ data: days.map(k => dailyMap[k]), backgroundColor: '#1D9E75', borderRadius: 3, borderSkipped: false }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${fmt(ctx.raw)}` } } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#888', autoSkip: true, maxTicksLimit: 15 } },
        y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 10 }, color: '#888', callback: v => 'Rp' + Math.round(v / 1000) + 'k' } }
      }
    }
  });

  const bd = document.getElementById('cat-breakdown');
  if (!total) { bd.innerHTML = '<div class="empty">Add expenses to see breakdown</div>'; return; }
  bd.innerHTML = activeCats.map(c => {
    const pct = ((catTotals[c] / total) * 100).toFixed(1);
    return `<div class="bar-row">
      <div class="bar-top"><span>${c}</span>
        <span style="font-family:'DM Mono',monospace;color:var(--muted)">${fmt(catTotals[c])} <span style="color:var(--hint)">${pct}%</span></span>
      </div>
      <div class="bar-bg"><div class="bar-fill" style="width:${pct}%;background:${catColor(c)}"></div></div>
    </div>`;
  }).join('');
}

// ── MONTHLY TRENDS ─────────────────────────────────────────────────────────

function renderTrends() {
  const monthly     = thisMonthExp();
  const thisWk      = getWeekNum(now);
  const weekMap     = {};
  monthly.forEach(e => { const wk = getWeekNum(new Date(e.ts)); weekMap[wk] = (weekMap[wk] || 0) + e.amount; });
  const weeks = Object.keys(weekMap).map(Number).sort((a, b) => a - b);
  const maxW  = Math.max(...Object.values(weekMap), 1);

  document.getElementById('weekly-rows').innerHTML = weeks.length
    ? weeks.map(wk => `
        <div class="bar-row">
          <div class="bar-top">
            <span style="color:var(--muted)">Week ${wk}${wk === thisWk
              ? ' <span style="font-size:9px;background:var(--accent-l);color:var(--accent-d);padding:1px 5px;border-radius:99px">now</span>' : ''
            }</span>
            <span style="font-family:'DM Mono',monospace">${fmt(weekMap[wk])}</span>
          </div>
          <div class="bar-bg"><div class="bar-fill" style="width:${((weekMap[wk] / maxW) * 100).toFixed(1)}%;background:var(--accent)"></div></div>
        </div>`).join('')
    : '<div class="empty">No data</div>';

  const total       = monthly.reduce((s, e) => s + e.amount, 0);
  const wkTotal     = weekMap[thisWk]  || 0;
  const prevWkTotal = weekMap[thisWk - 1] || 0;
  const prevMo      = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMoTotal = allExpenses
    .filter(e => { const d = new Date(e.ts); return d.getFullYear() === prevMo.getFullYear() && d.getMonth() === prevMo.getMonth(); })
    .reduce((s, e) => s + e.amount, 0);
  const wowPct = prevWkTotal > 0 ? (wkTotal - prevWkTotal) / prevWkTotal * 100 : null;
  const momPct = prevMoTotal > 0 ? (total - prevMoTotal) / prevMoTotal * 100 : null;
  const days   = now.getDate();

  document.getElementById('mom-rows').innerHTML = `
    <div class="trow"><span class="tlabel">Month total</span><span class="tval">${fmt(total)}</span></div>
    <div class="trow"><span class="tlabel">This week</span><span class="tval">${fmt(wkTotal)}</span></div>
    <div class="trow"><span class="tlabel">Last week</span><span class="tval">${fmt(prevWkTotal)}</span></div>
    <div class="trow"><span class="tlabel">WoW</span>${pctBadge(wowPct)}</div>
    <div class="trow"><span class="tlabel">MoM</span>${pctBadge(momPct)}</div>
    <div class="trow"><span class="tlabel">Avg / day</span><span class="tval">${days ? fmt(total / days) : '—'}</span></div>
    <div class="trow"><span class="tlabel">Last month</span><span class="tval">${fmt(prevMoTotal)}</span></div>`;

  const catTotals  = {};
  monthly.forEach(e => { catTotals[e.cat] = (catTotals[e.cat] || 0) + e.amount; });
  const sorted     = Object.keys(catTotals).filter(c => catTotals[c] > 0).sort((a, b) => catTotals[b] - catTotals[a]).slice(0, 6);
  const grandTotal = total || 1;

  document.getElementById('top-cats').innerHTML = sorted.length
    ? sorted.map((c, i) => {
        const pct = ((catTotals[c] / grandTotal) * 100).toFixed(1);
        return `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:.5px solid var(--bdr);${i === sorted.length - 1 ? 'border-bottom:none' : ''}">
          <div style="width:10px;height:10px;border-radius:50%;background:${catColor(c)};flex-shrink:0"></div>
          <div style="flex:1;font-size:12px">${c}</div>
          <div style="font-size:10px;color:var(--muted)">${pct}%</div>
          <div style="font-family:'DM Mono',monospace;font-size:12px">${fmt(catTotals[c])}</div>
        </div>`;
      }).join('')
    : '<div class="empty">No data</div>';

  // 6-month MoM chart
  const moTotals = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    moTotals.push({
      label: MONTHS[d.getMonth()] + ' \'' + String(d.getFullYear()).slice(2),
      total: allExpenses
        .filter(e => { const ed = new Date(e.ts); return ed.getFullYear() === d.getFullYear() && ed.getMonth() === d.getMonth(); })
        .reduce((s, e) => s + e.amount, 0)
    });
  }
  if (momChartInst) momChartInst.destroy();
  momChartInst = new Chart(document.getElementById('mom-chart').getContext('2d'), {
    type: 'bar',
    data: {
      labels: moTotals.map(m => m.label),
      datasets: [{ data: moTotals.map(m => m.total), backgroundColor: moTotals.map((_, i) => i === 5 ? '#1D9E75' : '#9FE1CB'), borderRadius: 4, borderSkipped: false }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${fmt(ctx.raw)}` } } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#888' } },
        y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 10 }, color: '#888', callback: v => 'Rp' + Math.round(v / 1000) + 'k' } }
      }
    }
  });
}

// ── YEARLY ─────────────────────────────────────────────────────────────────

function changeYear(d) { viewYear += d; renderYearly(); }

function renderYearly() {
  document.getElementById('yr-label').textContent       = viewYear;
  document.getElementById('yr-stats-label').textContent = viewYear;

  const yrExps   = allExpenses.filter(e => new Date(e.ts).getFullYear() === viewYear);
  const moTotals = Array.from({ length: 12 }, (_, m) =>
    yrExps.filter(e => new Date(e.ts).getMonth() === m).reduce((s, e) => s + e.amount, 0)
  );
  const maxMo = Math.max(...moTotals, 1);
  const thisM = now.getFullYear() === viewYear ? now.getMonth() : -1;

  document.getElementById('yr-grid').innerHTML = MONTHS.map((mo, i) => `
    <div class="yr-mo${i === thisM ? ' active-mo' : ''}">
      <div class="yr-mo-label">${mo}</div>
      <div class="yr-mo-val">${moTotals[i] > 0 ? fmtS(moTotals[i]) : '—'}</div>
      <div class="yr-mo-bar" style="width:${((moTotals[i] / maxMo) * 100).toFixed(0)}%;min-width:${moTotals[i] > 0 ? '8px' : '0'}"></div>
    </div>`
  ).join('');

  if (yrChartInst) yrChartInst.destroy();
  yrChartInst = new Chart(document.getElementById('yr-chart').getContext('2d'), {
    type: 'bar',
    data: {
      labels: MONTHS,
      datasets: [{ data: moTotals, backgroundColor: MONTHS.map((_, i) => i === thisM ? '#1D9E75' : '#9FE1CB'), borderRadius: 4, borderSkipped: false }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${fmt(ctx.raw)}` } } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#888' } },
        y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 10 }, color: '#888', callback: v => 'Rp' + Math.round(v / 1000) + 'k' } }
      }
    }
  });

  const yrTotal  = yrExps.reduce((s, e) => s + e.amount, 0);
  const activeMo = moTotals.filter(t => t > 0);
  const yrAvg    = activeMo.length ? yrTotal / activeMo.length : 0;
  const peakM    = moTotals.indexOf(Math.max(...moTotals));
  const lowM     = activeMo.length ? moTotals.indexOf(Math.min(...activeMo)) : -1;

  document.getElementById('yr-stats').innerHTML = `
    <div class="trow"><span class="tlabel">Year total</span><span class="tval">${fmt(yrTotal)}</span></div>
    <div class="trow"><span class="tlabel">Entries</span><span class="tval">${yrExps.length}</span></div>
    <div class="trow"><span class="tlabel">Avg / month</span><span class="tval">${yrAvg ? fmt(yrAvg) : '—'}</span></div>
    <div class="trow"><span class="tlabel">Peak month</span><span class="tval">${peakM >= 0 && moTotals[peakM] > 0 ? MONTHS[peakM] : '—'}</span></div>
    <div class="trow"><span class="tlabel">Lowest month</span><span class="tval">${lowM >= 0 ? MONTHS[lowM] : '—'}</span></div>
    <div class="trow"><span class="tlabel">Active months</span><span class="tval">${activeMo.length} / 12</span></div>`;

  const prevYrExp    = allExpenses.filter(e => new Date(e.ts).getFullYear() === viewYear - 1);
  const prevYrTotal  = prevYrExp.reduce((s, e) => s + e.amount, 0);
  const prevMoTotals = Array.from({ length: 12 }, (_, m) =>
    prevYrExp.filter(e => new Date(e.ts).getMonth() === m).reduce((s, e) => s + e.amount, 0)
  );
  const yoyPct = prevYrTotal > 0 ? (yrTotal - prevYrTotal) / prevYrTotal * 100 : null;

  document.getElementById('yoy-rows').innerHTML = `
    <div class="trow"><span class="tlabel">${viewYear} total</span><span class="tval">${fmt(yrTotal)}</span></div>
    <div class="trow"><span class="tlabel">${viewYear - 1} total</span><span class="tval">${fmt(prevYrTotal)}</span></div>
    <div class="trow"><span class="tlabel">YoY change</span>${pctBadge(yoyPct)}</div>
    ` + MONTHS.map((mo, i) => `
    <div class="trow">
      <span class="tlabel">${mo}</span>
      <span class="tval" style="font-size:11px">${fmt(moTotals[i])}
        ${prevMoTotals[i] > 0 ? `<span style="color:var(--hint);font-size:9px"> was ${fmtS(prevMoTotals[i])}</span>` : ''}
      </span>
    </div>`).join('');

  const catTotals  = {};
  yrExps.forEach(e => { catTotals[e.cat] = (catTotals[e.cat] || 0) + e.amount; });
  const sortedCats = Object.keys(catTotals).sort((a, b) => catTotals[b] - catTotals[a]);

  document.getElementById('yr-cat-breakdown').innerHTML = sortedCats.length
    ? sortedCats.map(c => {
        const pct = ((catTotals[c] / yrTotal) * 100).toFixed(1);
        return `<div class="bar-row">
          <div class="bar-top"><span>${c}</span>
            <span style="font-family:'DM Mono',monospace;color:var(--muted)">${fmt(catTotals[c])} <span style="color:var(--hint)">${pct}%</span></span>
          </div>
          <div class="bar-bg"><div class="bar-fill" style="width:${pct}%;background:${catColor(c)}"></div></div>
        </div>`;
      }).join('')
    : '<div class="empty">No data for this year</div>';
}

// ── IMPORT / EXPORT ────────────────────────────────────────────────────────

function openModal()  { document.getElementById('modal').classList.add('open'); }
function closeModal() { document.getElementById('modal').classList.remove('open'); }

document.getElementById('modal').addEventListener('click', e => {
  if (e.target === document.getElementById('modal')) closeModal();
});

function toCSVRow(fields) {
  return fields.map(f => `"${String(f).replace(/"/g, '""')}"`).join(',');
}

function exportCSV() {
  const sorted = [...allExpenses].sort((a, b) => new Date(a.ts) - new Date(b.ts));
  const header = 'ID,Date,Day,Name,Category,Amount,Timestamp\n';
  const rows   = sorted.map(e => toCSVRow([e.id, e.date, e.day, e.name, e.cat, e.amount, e.ts])).join('\n');
  const blob   = new Blob([header + rows], { type: 'text/csv' });
  const url    = URL.createObjectURL(blob);
  const a      = document.createElement('a');
  a.href       = url;
  a.download   = `spendlog_export_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function copyTSV() {
  const sorted = [...allExpenses].sort((a, b) => new Date(a.ts) - new Date(b.ts));
  const header = 'Date\tDay\tName\tCategory\tAmount\tTimestamp';
  const rows   = sorted.map(e => [e.date, e.day, e.name, e.cat, e.amount, e.ts].join('\t')).join('\n');
  navigator.clipboard.writeText(header + '\n' + rows).then(() => {
    const msg = document.getElementById('copy-msg');
    msg.style.display = 'block';
    setTimeout(() => { msg.style.display = 'none'; }, 3000);
  });
}

async function importCSV(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async e => {
    const text  = e.target.result;
    const lines = text.split('\n').filter(l => l.trim());
    if (!lines.length) return;

    const isCSV = lines[0].includes(',');
    const existingIds = new Set(allExpenses.map(e => String(e.id)));
    const toInsert    = [];
    let imported      = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      let fields;
      if (isCSV) {
        fields = [];
        let cur = '', inQ = false;
        for (const c of line) {
          if (c === '"') inQ = !inQ;
          else if (c === ',' && !inQ) { fields.push(cur); cur = ''; }
          else cur += c;
        }
        fields.push(cur);
        fields = fields.map(f => f.replace(/^"|"$/g, '').replace(/""/g, '"'));
      } else {
        fields = line.split('\t');
      }

      if (fields.length < 5) continue;
      const id = String(fields[0] || Date.now() + Math.random());
      if (existingIds.has(id)) continue;

      const ts = fields[6] || fields[5] || new Date().toISOString();
      const d  = new Date(ts);
      const exp = {
        id,
        name:    fields[3] || fields[2],
        amount:  parseFloat(fields[5] || fields[4]) || 0,
        cat:     fields[4] || fields[3] || 'Others',
        ts,
        date:    fields[1] || d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
        day:     fields[2] || d.toLocaleDateString('en', { weekday: 'short' }),
        dateKey: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      };

      if (!exp.name || !exp.amount) continue;
      allExpenses.unshift(exp);
      toInsert.push(expToRow(exp));
      existingIds.add(id);
      imported++;
    }

    input.value = '';

    if (toInsert.length > 0) {
      setSyncStatus('syncing', 'Importing…');
      const { error } = await db.from('expenses').upsert(toInsert, { onConflict: 'id' });
      if (error) {
        console.error('Import sync error:', error);
        setSyncStatus('error', 'Sync failed');
        showToast(`⚠ ${imported} rows imported locally but cloud sync failed`);
        cacheAll();
      } else {
        setSyncStatus('synced', 'Synced');
        cacheAll();
        showToast(`✓ ${imported} entries imported & synced`);
      }
    }

    const msg = document.getElementById('import-msg');
    msg.textContent   = `Imported ${imported} new entries!`;
    msg.style.display = 'block';
    setTimeout(() => { msg.style.display = 'none'; }, 3000);

    buildFilterChips();
    render();
  };
  reader.readAsText(file);
}

// ── KEYBOARD SHORTCUTS ─────────────────────────────────────────────────────

document.getElementById('inp-name').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('inp-amount').focus();
});
document.getElementById('inp-amount').addEventListener('keydown', e => {
  if (e.key === 'Enter') addExpense();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ── ONLINE / OFFLINE DETECTION ─────────────────────────────────────────────

window.addEventListener('online', async () => {
  showToast('🌐 Back online — syncing…');
  await loadFromSupabase();
  render();
});
window.addEventListener('offline', () => {
  isOnline = false;
  setSyncStatus('error', 'Offline');
  showToast('⚠ You are offline — changes saved locally');
});

// ── INIT ───────────────────────────────────────────────────────────────────

(async function init() {
  document.getElementById('month-badge').textContent =
    now.toLocaleDateString('en', { month: 'long', year: 'numeric' });
  document.getElementById('ledger-title').textContent =
    now.toLocaleDateString('en', { month: 'long', year: 'numeric' });

  await loadFromSupabase();

  // Hide loading, show app
  const screen = document.getElementById('loading-screen');
  screen.classList.add('fade-out');
  setTimeout(() => { screen.style.display = 'none'; }, 350);
  document.getElementById('main-app').style.display = '';

  buildFilterChips();
  render();
})();
