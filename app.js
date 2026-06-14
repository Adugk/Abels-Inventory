// ===== ABEL'S CONSTRUCTION MATERIAL =====

const $ = id => document.getElementById(id);
const fmt = n => '$' + Math.round(n).toLocaleString();
const fmtSmall = n => n >= 1000000 ? '$' + (n/1000000).toFixed(1)+'M' : n >= 1000 ? '$' + Math.round(n/1000)+'K' : '$' + Math.round(n);
const initials = name => name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
const today = () => new Date().toISOString().split('T')[0];

// ===== STATE =====
let STATE = {
  page: 'dashboard',
  products: [],
  employees: [],
  sales: [],
  costs: [],
  loading: true,
  user: null,
  channel: null,
  adminUnlocked: false,
  productSearch: '',
};

// ===== APP CONTROLLER =====
window.APP = {
  rerender() { render(); },
};

// ===== RENDER ROOT =====
function render() {
  const root = $('root');
  if (!root) return;

  if (!DB.isConfigured()) {
    root.innerHTML = renderSetup();
    return;
  }

  if (!STATE.user) {
    root.innerHTML = renderAuth();
    attachAuthHandlers();
    return;
  }

  root.innerHTML = `
    ${renderSidebar()}
    ${renderBottomNav()}
    <main id="main-content">
      <div class="page-enter" id="page-container">
        ${renderPage()}
      </div>
    </main>
    <div id="modal-overlay" class="modal-overlay hidden"><div id="modal-box" class="modal-box"></div></div>
    <div id="toast" class="toast hidden"></div>
    <div id="sync-badge" class="sync-badge">${t('online')}</div>
  `;

  attachNavHandlers();
  attachPageHandlers();
}

function renderPage() {
  if (STATE.loading) return `<div class="loading-screen"><div class="spinner"></div><p>${t('loading')}</p></div>`;
  switch(STATE.page) {
    case 'dashboard':   return renderDashboard();
    case 'products':    return renderProducts();
    case 'record-sale': return renderRecordSale();
    case 'sales':       return renderSales();
    case 'employees':   return renderEmployees();
    case 'admin':       return renderAdmin();
    case 'settings':    return renderSettings();
    default:            return renderDashboard();
  }
}

// ===== SETUP SCREEN =====
function renderSetup() {
  return `
    <div class="auth-screen">
      <div class="auth-card" style="max-width:540px;">
        <div class="auth-logo">
          <div class="logo-icon">A</div>
          <span>Abel's Construction Material</span>
        </div>
        <h2 class="auth-title">Connect to Supabase</h2>
        <p style="color:var(--text2); font-size:13px; margin-bottom:20px;">
          Enter your Supabase project credentials to get started.
          <a href="https://supabase.com" target="_blank" style="color:var(--accent);">Create a free project →</a>
        </p>
        <div class="form-group">
          <label>Supabase Project URL</label>
          <input type="url" id="setup-url" placeholder="https://xxxxxxxxxxxx.supabase.co" />
        </div>
        <div class="form-group">
          <label>Supabase Anon Key</label>
          <input type="text" id="setup-key" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…" />
        </div>
        <button class="btn btn-primary" style="width:100%; margin-bottom:16px;" onclick="saveSupabaseConfig()">Connect</button>
        <details style="font-size:12px; color:var(--text3);">
          <summary style="cursor:pointer; color:var(--text2); margin-bottom:8px;">Database setup SQL (run in Supabase SQL Editor)</summary>
          <pre id="sql-block" style="background:var(--bg3); border:1px solid var(--border); border-radius:8px; padding:12px; overflow-x:auto; white-space:pre-wrap; font-size:11px; line-height:1.5;">${window.SUPABASE_SQL}</pre>
          <button class="btn btn-sm" style="margin-top:8px;" onclick="copySql()">Copy SQL</button>
        </details>
        <div style="margin-top:16px; text-align:center;">
          <button class="btn btn-sm" onclick="setLang(currentLang === 'en' ? 'am' : 'en')">
            ${currentLang === 'en' ? 'አማርኛ' : 'English'}
          </button>
        </div>
      </div>
    </div>
  `;
}

function saveSupabaseConfig() {
  const url = $('setup-url')?.value.trim();
  const key = $('setup-key')?.value.trim();
  if (!url || !key) { alert('Please enter both URL and key'); return; }
  localStorage.setItem('bs_supa_url', url);
  localStorage.setItem('bs_supa_key', key);
  DB.init();
  render();
}

function copySql() {
  navigator.clipboard?.writeText(window.SUPABASE_SQL);
  showToast('SQL copied!');
}

// ===== AUTH =====
let authMode = 'signin';

function renderAuth() {
  const isSign = authMode === 'signin';
  return `
    <div class="auth-screen">
      <div class="auth-card">
        <div class="auth-logo">
          <div class="logo-icon">A</div>
          <div>
            <div style="font-size:13px; font-weight:800;">Abel's Construction</div>
            <div style="font-size:11px; font-weight:500; color:var(--text2); margin-top:1px;">Material Inventory</div>
          </div>
        </div>
        <h2 class="auth-title">${isSign ? t('welcomeBack') : t('createAccount')}</h2>
        ${!isSign ? `<div class="form-group"><label>${t('fullName')}</label><input type="text" id="auth-name" placeholder="John Smith" /></div>` : ''}
        <div class="form-group"><label>${t('email')}</label><input type="email" id="auth-email" placeholder="you@example.com" /></div>
        <div class="form-group"><label>${t('password')}</label><input type="password" id="auth-pass" placeholder="••••••••" /></div>
        <div id="auth-error" class="alert alert-danger hidden"></div>
        <button class="btn btn-primary" style="width:100%; margin-bottom:16px;" id="auth-btn" onclick="submitAuth()">
          ${isSign ? t('signIn') : t('signUp')}
        </button>
        <p style="text-align:center; font-size:13px; color:var(--text2);">
          ${isSign ? t('noAccount') : t('haveAccount')}
          <a href="#" style="color:var(--accent);" onclick="toggleAuthMode()">${isSign ? t('signUp') : t('signIn')}</a>
        </p>
        <div style="margin-top:16px; text-align:center; display:flex; justify-content:center; gap:8px; flex-wrap:wrap;">
          <button class="btn btn-sm" onclick="setLang('en')">English</button>
          <button class="btn btn-sm" onclick="setLang('am')">አማርኛ</button>
          <button class="btn btn-sm" onclick="resetConfig()">⚙ Change DB</button>
        </div>
      </div>
    </div>
  `;
}

function attachAuthHandlers() {
  const passInput = $('auth-pass');
  if (passInput) passInput.addEventListener('keydown', e => { if(e.key==='Enter') submitAuth(); });
}

function toggleAuthMode() { authMode = authMode === 'signin' ? 'signup' : 'signin'; render(); }

function resetConfig() {
  localStorage.removeItem('bs_supa_url');
  localStorage.removeItem('bs_supa_key');
  DB.client = null;
  render();
}

async function submitAuth() {
  const email = $('auth-email')?.value.trim();
  const pass = $('auth-pass')?.value;
  const name = $('auth-name')?.value.trim();
  const errEl = $('auth-error');
  const btn = $('auth-btn');
  if (!email || !pass) return;
  if (btn) { btn.disabled = true; btn.textContent = authMode === 'signin' ? t('signingIn') : t('signingUp'); }
  if (errEl) errEl.classList.add('hidden');
  try {
    if (authMode === 'signin') { await DB.signIn(email, pass); }
    else { await DB.signUp(email, pass, name); }
    STATE.user = DB.user;
    await loadAllData();
    render();
  } catch(e) {
    if (errEl) { errEl.textContent = e.message || t('authError'); errEl.classList.remove('hidden'); }
    if (btn) { btn.disabled = false; btn.textContent = authMode === 'signin' ? t('signIn') : t('signUp'); }
  }
}

// ===== SIDEBAR =====
function renderSidebar() {
  const mainLinks = [
    { page: 'dashboard',   icon: dashIcon(),   label: t('dashboard') },
    { page: 'products',    icon: boxIcon(),    label: t('products') },
    { page: 'record-sale', icon: cartIcon(),   label: t('recordSale') },
    { page: 'sales',       icon: fileIcon(),   label: t('salesHistory') },
    { page: 'employees',   icon: usersIcon(),  label: t('employees') },
  ];
  const adminLinks = [
    { page: 'admin',    icon: shieldIcon(), label: t('admin') },
    { page: 'settings', icon: settingsIcon(), label: t('settings') },
  ];
  return `
    <nav id="sidebar">
      <div class="logo">
        <div class="logo-icon-sm">A</div>
        <div style="line-height:1.2;">
          <div>Abel's CM</div>
          <div style="font-size:10px; font-weight:500; color:var(--text3);">Construction Material</div>
        </div>
      </div>
      <ul class="nav-links">
        ${mainLinks.map(l => `
          <li><a href="#" class="nav-link ${STATE.page === l.page ? 'active' : ''}" data-page="${l.page}">
            ${l.icon} ${l.label}
          </a></li>
        `).join('')}
        <div class="nav-section-label">System</div>
        ${adminLinks.map(l => `
          <li><a href="#" class="nav-link ${STATE.page === l.page ? 'active' : ''}" data-page="${l.page}">
            ${l.icon} ${l.label}
            ${l.page === 'admin' ? `<span class="admin-badge">Admin</span>` : ''}
          </a></li>
        `).join('')}
      </ul>
      <div class="sidebar-bottom">
        <div style="font-size:11px; color:var(--text3); padding:4px 8px; margin-bottom:6px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${STATE.user?.email || ''}</div>
        <button class="btn btn-sm" style="width:100%;" onclick="doSignOut()">${t('signOut')}</button>
      </div>
    </nav>
  `;
}

function renderBottomNav() {
  const links = [
    { page: 'dashboard',   icon: dashIcon(),   label: t('dashboard') },
    { page: 'products',    icon: boxIcon(),    label: t('products') },
    { page: 'record-sale', icon: cartIcon(),   label: t('recordSale') },
    { page: 'sales',       icon: fileIcon(),   label: t('salesHistory') },
    { page: 'admin',       icon: shieldIcon(), label: t('admin') },
    { page: 'settings',    icon: settingsIcon(), label: t('settings') },
  ];
  return `
    <nav id="bottom-nav">
      ${links.map(l => `
        <a href="#" class="bottom-link ${STATE.page === l.page ? 'active' : ''}" data-page="${l.page}">
          ${l.icon} <span>${l.label}</span>
        </a>
      `).join('')}
    </nav>
  `;
}

// ===== NAV HANDLERS =====
function attachNavHandlers() {
  document.addEventListener('click', handleNavClick, { once: true });
}

function handleNavClick(e) {
  const link = e.target.closest('[data-page]');
  if (link) {
    e.preventDefault();
    navigate(link.dataset.page);
    return;
  }
  document.addEventListener('click', handleNavClick, { once: true });
}

function navigate(page) {
  STATE.page = page;
  const container = $('page-container');
  if (container) {
    container.style.opacity = '0';
    setTimeout(() => {
      container.innerHTML = renderPage();
      container.style.opacity = '1';
      attachPageHandlers();
    }, 100);
  }
  document.querySelectorAll('[data-page]').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });
  document.addEventListener('click', handleNavClick, { once: true });
}

function attachPageHandlers() {
  if (STATE.page === 'record-sale') setTimeout(updateSalePreview, 50);
  const overlay = $('modal-overlay');
  if (overlay) overlay.onclick = e => { if(e.target === overlay) closeModal(); };
}

// ===== DATA =====
async function loadAllData() {
  STATE.loading = true;
  try {
    const [products, employees, sales, costs] = await Promise.all([
      DB.getProducts(),
      DB.getEmployees(),
      DB.getSales(),
      DB.getCosts().catch(() => []),
    ]);
    STATE.products  = products;
    STATE.employees = employees;
    STATE.sales     = sales;
    STATE.costs     = costs;
  } catch(e) {
    console.error('Load error:', e);
  }
  STATE.loading = false;
}

function getProduct(id)  { return STATE.products.find(p => p.id === id); }
function getEmployee(id) { return STATE.employees.find(e => e.id === id); }

function getStats() {
  const { products, sales, costs } = STATE;
  const activeSales  = sales.filter(s => !s.refunded);
  const totalRevenue = activeSales.reduce((s,x) => s + Number(x.revenue), 0);
  const totalProfit  = activeSales.reduce((s,x) => s + Number(x.profit), 0);
  const inventoryValue = products.reduce((s,p) => s + Number(p.cost) * Number(p.qty), 0);
  const lowStock       = products.filter(p => p.qty <= 5).length;
  const totalCosts     = costs.reduce((s,c) => s + Number(c.purchase_price) * Number(c.qty), 0);
  return { totalRevenue, totalProfit, inventoryValue, lowStock, totalCosts };
}

// ===== TOAST =====
function showToast(msg, type = 'success') {
  const el = $('toast');
  if (!el) return;
  el.textContent = msg;
  el.className = `toast ${type}`;
  clearTimeout(el._timer);
  el._timer = setTimeout(() => { if(el) el.className = 'toast hidden'; }, 2500);
}

// ===== MODAL =====
function openModal(html, wide = false) {
  const overlay = $('modal-overlay');
  const box = $('modal-box');
  if (!overlay || !box) return;
  box.className = 'modal-box' + (wide ? ' modal-box-wide' : '');
  box.innerHTML = html;
  overlay.classList.remove('hidden');
  overlay.onclick = e => { if(e.target === overlay) closeModal(); };
}

function closeModal() {
  const overlay = $('modal-overlay');
  if (overlay) overlay.classList.add('hidden');
}

// ===== SIGN OUT =====
async function doSignOut() {
  await DB.signOut();
  STATE.user = null;
  STATE.products = []; STATE.employees = []; STATE.sales = []; STATE.costs = [];
  STATE.adminUnlocked = false;
  render();
}

// ===== DASHBOARD =====
function renderDashboard() {
  const s = getStats();
  const { products, sales } = STATE;
  const activeSales = sales.filter(x => !x.refunded);
  const lowProds = products.filter(p => p.qty <= 5);

  const prodRevMap = {};
  activeSales.forEach(sale => { prodRevMap[sale.product_id] = (prodRevMap[sale.product_id]||0) + Number(sale.revenue); });
  const topProds = Object.entries(prodRevMap).sort((a,b)=>b[1]-a[1]).slice(0,5)
    .map(([id, rev]) => ({ prod: getProduct(id), rev })).filter(x=>x.prod);
  const maxRev = topProds.length ? Math.max(...topProds.map(x=>x.rev)) : 1;
  const recent = activeSales.slice(0,6);

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Abel's Construction Material</h1>
        <p class="page-subtitle">${new Date().toLocaleDateString(currentLang === 'am' ? 'am-ET' : 'en-CA', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}</p>
      </div>
    </div>

    ${lowProds.length ? `<div class="alert alert-warning">⚠ ${lowProds.length} ${t('lowStockAlert')}: ${lowProds.map(p=>p.name).join(', ')}</div>` : ''}

    <div class="stats-grid">
      <div class="stat-card"><div class="stat-label">${t('totalRevenue')}</div><div class="stat-value accent">${fmtSmall(s.totalRevenue)}</div><div class="stat-sub">${activeSales.length} ${t('salesTotal')}</div></div>
      <div class="stat-card"><div class="stat-label">${t('totalProfit')}</div><div class="stat-value green">${fmtSmall(s.totalProfit)}</div><div class="stat-sub">${s.totalRevenue > 0 ? Math.round(s.totalProfit/s.totalRevenue*100) : 0}% ${t('margin')}</div></div>
      <div class="stat-card"><div class="stat-label">${t('inventoryValue')}</div><div class="stat-value">${fmtSmall(s.inventoryValue)}</div><div class="stat-sub">${products.length} ${t('products')}</div></div>
      <div class="stat-card"><div class="stat-label">${t('lowStock')}</div><div class="stat-value ${s.lowStock > 0 ? 'red' : 'green'}">${s.lowStock}</div><div class="stat-sub">${t('itemsNeedReorder')}</div></div>
    </div>

    <div class="dash-grid">
      <div class="card">
        <div class="card-header"><span class="card-title">${t('topProducts')}</span></div>
        ${topProds.length ? `<div class="chart-bars">${topProds.map(x=>`
          <div class="chart-bar-wrap">
            <div class="chart-bar" style="height:${Math.round(x.rev/maxRev*100)}%" title="${x.prod.name}: ${fmt(x.rev)}"></div>
            <div class="chart-label">${x.prod.name.split(' ').slice(-1)[0]}</div>
          </div>`).join('')}</div>` : `<div class="empty-state"><p>${t('noSalesYet')}</p></div>`}
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">${t('recentSales')}</span><a href="#" class="btn btn-sm" data-page="sales">${t('viewAll')}</a></div>
        ${recent.length ? recent.map(sale => {
          const prod = getProduct(sale.product_id);
          const emp = getEmployee(sale.employee_id);
          return `<div class="recent-sale-row">
            <div><div class="fw-600">${prod ? prod.name : sale.product_name||'—'}</div><div class="sub-text">${emp ? emp.name : sale.employee_name||'—'} · ${new Date(sale.created_at).toLocaleDateString()}</div></div>
            <div style="text-align:right;"><div style="color:var(--accent);font-weight:600;">${fmt(sale.revenue)}</div><div style="color:var(--green);font-size:12px;">+${fmt(sale.profit)}</div></div>
          </div>`;
        }).join('') : `<div class="empty-state"><p>${t('noSalesYet')}</p></div>`}
      </div>
    </div>
  `;
}

// ===== PRODUCTS =====
function renderProducts() {
  const search = STATE.productSearch.toLowerCase();
  const products = STATE.products.filter(p =>
    !search ||
    p.name.toLowerCase().includes(search) ||
    p.category.toLowerCase().includes(search) ||
    String(p.product_number).includes(search)
  );
  return `
    <div class="page-header">
      <div><h1 class="page-title">${t('productsTitle')}</h1><p class="page-subtitle">${STATE.products.length} ${t('itemsInInventory')}</p></div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
        <div class="search-bar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="${t('searchProducts')}" value="${STATE.productSearch}" oninput="STATE.productSearch=this.value; refreshPage()" />
        </div>
        <button class="btn btn-primary" onclick="openAddProduct()">+ ${t('addProduct')}</button>
      </div>
    </div>
    <div class="card" style="padding:0;">
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>${t('productNo')}</th>
            <th>${t('productName')}</th><th>${t('category')}</th>
            <th>${t('costPrice')}</th><th>${t('sellingPrice')}</th>
            <th>${t('margin2')}</th><th>${t('stock')}</th><th>${t('actions')}</th>
          </tr></thead>
          <tbody>
            ${products.length ? products.map(p => {
              const margin = p.price > 0 ? Math.round((p.price - p.cost) / p.price * 100) : 0;
              return `<tr>
                <td class="prod-num">#${p.product_number || '—'}</td>
                <td class="fw-600">${p.name}</td>
                <td><span class="badge badge-blue">${p.category}</span></td>
                <td>${fmt(p.cost)}</td>
                <td class="fw-600">${fmt(p.price)}</td>
                <td><span style="color:var(--green)">${margin}%</span></td>
                <td class="${p.qty <= 5 ? 'stock-low' : 'stock-ok'}">${p.qty} ${t('units')}${p.qty <= 5 ? ' ⚠' : ''}</td>
                <td><div style="display:flex;gap:6px;">
                  <button class="btn btn-sm" onclick="openEditProduct('${p.id}')">${t('edit')}</button>
                  <button class="btn btn-sm btn-danger" onclick="confirmDeleteProduct('${p.id}')">${t('remove')}</button>
                </div></td>
              </tr>`;
            }).join('') : `<tr><td colspan="8"><div class="empty-state"><p>${search ? 'No products found.' : t('noData')}</p></div></td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function refreshPage() {
  const container = $('page-container');
  if (container) { container.innerHTML = renderPage(); attachPageHandlers(); }
}

function productFormHTML(p = {}) {
  return `
    <div class="form-group"><label>${t('productName')}</label><input type="text" id="f-name" value="${p.name||''}" /></div>
    <div class="form-group"><label>${t('category')}</label><input type="text" id="f-cat" value="${p.category||''}" /></div>
    <div class="form-row">
      <div class="form-group"><label>${t('costPrice')}</label><input type="number" id="f-cost" value="${p.cost||''}" min="0" step="0.01" /></div>
      <div class="form-group"><label>${t('sellingPrice')}</label><input type="number" id="f-price" value="${p.price||''}" min="0" step="0.01" /></div>
    </div>
    <div class="form-group"><label>${t('quantity')}</label><input type="number" id="f-qty" value="${p.qty!==undefined?p.qty:''}" min="0" /></div>
  `;
}

function openAddProduct() {
  openModal(`<div class="modal-header"><h2 class="modal-title">${t('addProduct')}</h2><button class="modal-close" onclick="closeModal()">✕</button></div>${productFormHTML()}<div class="form-actions"><button class="btn" onclick="closeModal()">${t('cancel')}</button><button class="btn btn-primary" onclick="submitProduct()">+ ${t('addProduct')}</button></div>`);
}

function openEditProduct(id) {
  const p = getProduct(id);
  if (!p) return;
  openModal(`<div class="modal-header"><h2 class="modal-title">${t('editProduct')}</h2><button class="modal-close" onclick="closeModal()">✕</button></div>${productFormHTML(p)}<div class="form-actions"><button class="btn" onclick="closeModal()">${t('cancel')}</button><button class="btn btn-primary" onclick="submitProduct('${id}')">${t('saveChanges')}</button></div>`);
}

async function submitProduct(id) {
  const name     = $('f-name')?.value.trim();
  const category = $('f-cat')?.value.trim();
  const cost     = parseFloat($('f-cost')?.value);
  const price    = parseFloat($('f-price')?.value);
  const qty      = parseInt($('f-qty')?.value);
  if (!name || !category || isNaN(cost) || isNaN(price) || isNaN(qty)) { showToast(t('fillAllFields'), 'error'); return; }
  if (price < cost) { showToast(t('priceError'), 'error'); return; }
  try {
    if (id) {
      const updated = await DB.updateProduct(id, { name, category, cost, price, qty });
      STATE.products = STATE.products.map(p => p.id === id ? updated : p);
      showToast(t('productUpdated'));
    } else {
      const product_number = await DB.getNextProductNumber();
      const added = await DB.addProduct({ name, category, cost, price, qty, product_number });
      STATE.products.push(added);
      showToast(t('productAdded'));
    }
    closeModal(); navigate('products');
  } catch(e) { showToast(e.message, 'error'); }
}

function confirmDeleteProduct(id) {
  const p = getProduct(id);
  if (!p) return;
  openModal(`<div class="modal-header"><h2 class="modal-title">${t('removeProduct')}</h2><button class="modal-close" onclick="closeModal()">✕</button></div><p style="color:var(--text2);margin-bottom:20px;">${t('removeProductConfirm')}</p><div class="form-actions"><button class="btn" onclick="closeModal()">${t('cancel')}</button><button class="btn btn-danger" onclick="doDeleteProduct('${id}')">${t('remove')}</button></div>`);
}

async function doDeleteProduct(id) {
  try {
    await DB.deleteProduct(id);
    STATE.products = STATE.products.filter(p => p.id !== id);
    closeModal(); showToast(t('productRemoved')); navigate('products');
  } catch(e) { showToast(e.message, 'error'); }
}

// ===== RECORD SALE =====
function renderRecordSale() {
  const inStock = STATE.products.filter(p => p.qty > 0);
  return `
    <div class="page-header">
      <div><h1 class="page-title">${t('recordSaleTitle')}</h1><p class="page-subtitle">${t('logNewSale')}</p></div>
    </div>
    <div style="max-width:560px;">
      <div class="card">
        <div class="form-group"><label>${t('product')}</label>
          <select id="sale-product" onchange="updateSalePreview()">
            <option value="">${t('selectProduct')}</option>
            ${inStock.map(p=>`<option value="${p.id}">#${p.product_number||'?'} — ${p.name} (${p.qty} ${t('inStock')}) ${fmt(p.price)}</option>`).join('')}
          </select>
        </div>
        <div class="form-row">
          <div class="form-group"><label>${t('qty')}</label><input type="number" id="sale-qty" value="1" min="1" oninput="updateSalePreview()" /></div>
          <div class="form-group"><label>${t('discountType')}</label>
            <select id="sale-disc-type" onchange="updateSalePreview()">
              <option value="none">${t('noDiscount')}</option>
              <option value="flat">${t('flatDiscount')}</option>
              <option value="pct">${t('pctDiscount')}</option>
            </select>
          </div>
        </div>
        <div class="form-group" id="disc-val-group" style="display:none;">
          <label id="disc-val-label">${t('discount')}</label>
          <input type="number" id="sale-disc-val" value="0" min="0" step="0.01" oninput="updateSalePreview()" />
        </div>
        <div class="form-group"><label>${t('employee')}</label>
          <select id="sale-emp">
            <option value="">${t('selectEmployee')}</option>
            ${STATE.employees.map(e=>`<option value="${e.id}">${e.name} — ${e.role}</option>`).join('')}
          </select>
        </div>
        <div class="form-group"><label>${t('notes')}</label><input type="text" id="sale-notes" placeholder="${t('notesPlaceholder')}" /></div>
        <div id="sale-preview" style="display:none;" class="sale-preview"></div>
        <div style="margin-top:20px;"><button class="btn btn-primary" style="width:100%;" onclick="submitSale()">${t('confirmSale')}</button></div>
      </div>
    </div>
  `;
}

function updateSalePreview() {
  const prodId   = $('sale-product')?.value;
  const qty      = parseInt($('sale-qty')?.value) || 0;
  const discType = $('sale-disc-type')?.value || 'none';
  const discVal  = parseFloat($('sale-disc-val')?.value) || 0;
  const preview  = $('sale-preview');
  const discGroup = $('disc-val-group');
  const discLabel = $('disc-val-label');

  // Show/hide discount value input
  if (discGroup) discGroup.style.display = discType === 'none' ? 'none' : 'block';
  if (discLabel && discType === 'flat') discLabel.textContent = t('discount');
  if (discLabel && discType === 'pct')  discLabel.textContent = t('discountPct');

  if (!preview) return;
  const prod = getProduct(prodId);
  if (!prod || qty < 1) { preview.style.display = 'none'; return; }
  if (qty > prod.qty) { $('sale-qty').value = prod.qty; return updateSalePreview(); }

  const baseRevenue  = prod.price * qty;
  const costTotal    = prod.cost * qty;
  let discountAmt    = 0;
  if (discType === 'flat') discountAmt = Math.min(discVal, baseRevenue);
  if (discType === 'pct')  discountAmt = Math.min(discVal / 100 * baseRevenue, baseRevenue);

  const revenue = baseRevenue - discountAmt;
  const profit  = revenue - costTotal;
  const margin  = revenue > 0 ? Math.round(profit / revenue * 100) : 0;

  preview.style.display = 'block';
  preview.innerHTML = `
    <div class="sale-preview-row"><span>${t('unitPrice')}</span><span>${fmt(prod.price)}</span></div>
    <div class="sale-preview-row"><span>${t('qty')}</span><span>${qty}</span></div>
    ${discountAmt > 0 ? `<div class="sale-preview-row"><span>${t('discountApplied')}</span><span class="discount-val">-${fmt(discountAmt)}</span></div>` : ''}
    <div class="sale-preview-row"><span>${t('revenue')}</span><span>${fmt(revenue)}</span></div>
    <div class="sale-preview-row"><span>${t('cost')}</span><span>${fmt(costTotal)}</span></div>
    <div class="sale-preview-row total"><span>${t('profit')}</span><span class="profit">${fmt(profit)} (${margin}%)</span></div>
  `;
}

async function submitSale() {
  const product_id  = $('sale-product')?.value;
  const qty         = parseInt($('sale-qty')?.value) || 0;
  const employee_id = $('sale-emp')?.value;
  const notes       = $('sale-notes')?.value.trim();
  const discType    = $('sale-disc-type')?.value || 'none';
  const discVal     = parseFloat($('sale-disc-val')?.value) || 0;

  if (!product_id) { showToast(t('selectProductError'), 'error'); return; }
  if (!employee_id) { showToast(t('selectEmployeeError'), 'error'); return; }
  if (qty < 1) { showToast(t('qtyError'), 'error'); return; }
  const prod = getProduct(product_id);
  if (!prod || qty > prod.qty) { showToast(t('stockError'), 'error'); return; }
  const emp = getEmployee(employee_id);

  const baseRevenue = prod.price * qty;
  let discountAmt = 0;
  if (discType === 'flat') discountAmt = Math.min(discVal, baseRevenue);
  if (discType === 'pct')  discountAmt = Math.min(discVal / 100 * baseRevenue, baseRevenue);

  const revenue = baseRevenue - discountAmt;
  const profit  = revenue - prod.cost * qty;

  try {
    const sale = await DB.addSale({
      product_id, product_name: prod.name, product_number: prod.product_number,
      employee_id, employee_name: emp ? emp.name : '',
      qty, unit_price: prod.price,
      discount_type: discType, discount_value: discountAmt,
      revenue, profit, notes,
      refunded: false, refund_amount: 0, refund_note: '',
    });
    STATE.sales.unshift(sale);
    const updated = await DB.updateProduct(product_id, { qty: prod.qty - qty });
    STATE.products = STATE.products.map(p => p.id === product_id ? updated : p);
    showToast(`${t('saleRecorded')} — ${fmt(revenue)}`);
    navigate('dashboard');
  } catch(e) { showToast(e.message, 'error'); }
}

// ===== SALES HISTORY =====
function renderSales() {
  const { sales } = STATE;
  const activeSales = sales.filter(s => !s.refunded);
  const totalRev    = activeSales.reduce((s,x)=>s+Number(x.revenue),0);
  const totalProfit = activeSales.reduce((s,x)=>s+Number(x.profit),0);
  const refundedCount = sales.filter(s=>s.refunded).length;

  return `
    <div class="page-header">
      <div><h1 class="page-title">${t('salesHistoryTitle')}</h1>
        <p class="page-subtitle">${sales.length} ${t('transactions')} · ${fmt(totalRev)}</p>
      </div>
    </div>
    ${sales.length ? `<div class="stats-grid" style="margin-bottom:20px;">
      <div class="stat-card"><div class="stat-label">${t('totalRevenue')}</div><div class="stat-value accent">${fmtSmall(totalRev)}</div></div>
      <div class="stat-card"><div class="stat-label">${t('totalProfit')}</div><div class="stat-value green">${fmtSmall(totalProfit)}</div></div>
      <div class="stat-card"><div class="stat-label">${t('avgSaleValue')}</div><div class="stat-value">${activeSales.length > 0 ? fmtSmall(totalRev/activeSales.length) : '$0'}</div></div>
      <div class="stat-card"><div class="stat-label">${t('avgMargin')}</div><div class="stat-value">${totalRev > 0 ? Math.round(totalProfit/totalRev*100) : 0}%</div></div>
    </div>` : ''}
    <div class="card" style="padding:0;"><div class="table-wrap"><table>
      <thead><tr>
        <th>${t('date')}</th>
        <th>#</th>
        <th>${t('productName')}</th>
        <th>${t('qty')}</th>
        <th>${t('byEmployee')}</th>
        <th>${t('discountApplied')}</th>
        <th>${t('revenue')}</th>
        <th>${t('profit')}</th>
        <th>${t('notes')}</th>
        <th>Actions</th>
      </tr></thead>
      <tbody>
        ${sales.length ? sales.map(s => {
          const emp = getEmployee(s.employee_id);
          const empName = emp ? emp.name : (s.employee_name || '—');
          const margin = s.revenue > 0 ? Math.round(s.profit/s.revenue*100) : 0;
          const discAmt = Number(s.discount_value) || 0;
          return `<tr class="${s.refunded ? 'row-refunded' : ''}">
            <td style="color:var(--text2);white-space:nowrap;">${new Date(s.created_at).toLocaleDateString()}</td>
            <td class="prod-num">${s.product_number ? '#'+s.product_number : '—'}</td>
            <td class="fw-600">${s.product_name||'—'} ${s.refunded ? `<span class="badge badge-red">${t('refunded')}</span>` : ''}</td>
            <td>${s.qty}</td>
            <td>${empName !== '—' ? `<span class="badge badge-blue">${empName}</span>` : '—'}</td>
            <td>${discAmt > 0 ? `<span style="color:var(--red);">-${fmt(discAmt)}</span>` : '—'}</td>
            <td style="font-weight:600;color:var(--accent);">${fmt(s.revenue)}</td>
            <td style="color:var(--green);">+${fmt(s.profit)} <span style="color:var(--text3);font-size:11px;">(${margin}%)</span></td>
            <td style="color:var(--text2);font-size:12px;">${s.notes||'—'}</td>
            <td>
              <div style="display:flex;gap:5px;">
                <button class="btn btn-sm" onclick="openEditSale('${s.id}')">${t('edit')}</button>
                ${!s.refunded ? `<button class="btn btn-sm btn-danger" onclick="openRefundModal('${s.id}')">${t('markRefunded')}</button>` : ''}
              </div>
            </td>
          </tr>`;
        }).join('') : `<tr><td colspan="10"><div class="empty-state"><p>${t('noSalesHistory')} <a href="#" data-page="record-sale" style="color:var(--accent);">${t('recordFirstSale')}</a></p></div></td></tr>`}
      </tbody>
    </table></div></div>
  `;
}

function openRefundModal(id) {
  const sale = STATE.sales.find(s => s.id === id);
  if (!sale) return;
  openModal(`
    <div class="modal-header"><h2 class="modal-title">${t('markRefunded')}</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
    <p style="color:var(--text2); font-size:13px; margin-bottom:16px;">Sale: <strong style="color:var(--text)">${sale.product_name}</strong> — ${fmt(sale.revenue)}</p>
    <div class="form-group"><label>${t('refundAmount')}</label><input type="number" id="refund-amt" value="${sale.revenue}" min="0" step="0.01" /></div>
    <div class="form-group"><label>${t('refundNote')}</label><input type="text" id="refund-note" placeholder="Reason for refund…" /></div>
    <div class="form-actions">
      <button class="btn" onclick="closeModal()">${t('cancel')}</button>
      <button class="btn btn-danger" onclick="submitRefund('${id}')">${t('confirmRefund')}</button>
    </div>
  `);
}

async function submitRefund(id) {
  const refund_amount = parseFloat($('refund-amt')?.value) || 0;
  const refund_note   = $('refund-note')?.value.trim();
  try {
    const updated = await DB.updateSale(id, { refunded: true, refund_amount, refund_note });
    STATE.sales = STATE.sales.map(s => s.id === id ? updated : s);
    closeModal(); showToast(t('refundRecorded')); navigate('sales');
  } catch(e) { showToast(e.message, 'error'); }
}

function openEditSale(id) {
  const sale = STATE.sales.find(s => s.id === id);
  if (!sale) return;
  openModal(`
    <div class="modal-header"><h2 class="modal-title">${t('editSale')}</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
    <div class="form-group"><label>${t('notes')}</label><input type="text" id="edit-sale-notes" value="${sale.notes||''}" placeholder="${t('notesPlaceholder')}" /></div>
    <div class="form-group"><label>${t('revenue')} ($)</label><input type="number" id="edit-sale-revenue" value="${sale.revenue}" min="0" step="0.01" /></div>
    <div class="form-group"><label>${t('profit')} ($)</label><input type="number" id="edit-sale-profit" value="${sale.profit}" step="0.01" /></div>
    <div class="alert alert-info" style="font-size:12px;">Note: Editing revenue/profit manually does not update inventory stock.</div>
    <div class="form-actions">
      <button class="btn" onclick="closeModal()">${t('cancel')}</button>
      <button class="btn btn-primary" onclick="submitEditSale('${id}')">${t('saveChanges')}</button>
    </div>
  `);
}

async function submitEditSale(id) {
  const notes   = $('edit-sale-notes')?.value.trim();
  const revenue = parseFloat($('edit-sale-revenue')?.value);
  const profit  = parseFloat($('edit-sale-profit')?.value);
  if (isNaN(revenue) || isNaN(profit)) { showToast(t('fillAllFields'), 'error'); return; }
  try {
    const updated = await DB.updateSale(id, { notes, revenue, profit });
    STATE.sales = STATE.sales.map(s => s.id === id ? updated : s);
    closeModal(); showToast(t('saleUpdated')); navigate('sales');
  } catch(e) { showToast(e.message, 'error'); }
}

// ===== EMPLOYEES =====
function renderEmployees() {
  const { employees, sales } = STATE;
  return `
    <div class="page-header">
      <div><h1 class="page-title">${t('employeesTitle')}</h1><p class="page-subtitle">${employees.length} ${t('teamMembers')}</p></div>
      <button class="btn btn-primary" onclick="openAddEmployee()">+ ${t('addEmployee')}</button>
    </div>
    <div class="emp-grid">
      ${employees.map(emp => {
        const empSales  = sales.filter(s => s.employee_id === emp.id && !s.refunded);
        const empRev    = empSales.reduce((s,x)=>s+Number(x.revenue),0);
        const empProfit = empSales.reduce((s,x)=>s+Number(x.profit),0);
        return `<div class="emp-card">
          <div class="emp-avatar">${initials(emp.name)}</div>
          <div class="emp-name">${emp.name}</div>
          <div class="emp-role">${emp.role}</div>
          ${emp.phone ? `<div style="font-size:12px;color:var(--text3);margin-bottom:8px;">${emp.phone}</div>` : ''}
          <div class="emp-stats">
            <div><div class="emp-stat-val">${empSales.length}</div><div class="emp-stat-lbl">${t('sales')}</div></div>
            <div><div class="emp-stat-val">${fmtSmall(empRev)}</div><div class="emp-stat-lbl">${t('totalRevenue')}</div></div>
            <div><div class="emp-stat-val">${fmtSmall(empProfit)}</div><div class="emp-stat-lbl">${t('profit')}</div></div>
          </div>
          <div class="emp-actions">
            <button class="btn btn-sm" onclick="openEditEmployee('${emp.id}')">${t('edit')}</button>
            <button class="btn btn-sm btn-danger" onclick="confirmRemoveEmployee('${emp.id}')">${t('remove')}</button>
          </div>
        </div>`;
      }).join('')}
    </div>
  `;
}

function employeeFormHTML(e = {}) {
  return `
    <div class="form-group"><label>${t('fullName')}</label><input type="text" id="ef-name" value="${e.name||''}" /></div>
    <div class="form-group"><label>${t('role')}</label><input type="text" id="ef-role" value="${e.role||''}" /></div>
    <div class="form-group"><label>${t('phone')}</label><input type="tel" id="ef-phone" value="${e.phone||''}" /></div>
  `;
}

function openAddEmployee() {
  openModal(`<div class="modal-header"><h2 class="modal-title">${t('addEmployee')}</h2><button class="modal-close" onclick="closeModal()">✕</button></div>${employeeFormHTML()}<div class="form-actions"><button class="btn" onclick="closeModal()">${t('cancel')}</button><button class="btn btn-primary" onclick="submitEmployee()">+ ${t('addEmployee')}</button></div>`);
}

function openEditEmployee(id) {
  const emp = getEmployee(id);
  if (!emp) return;
  openModal(`<div class="modal-header"><h2 class="modal-title">${t('editEmployee')}</h2><button class="modal-close" onclick="closeModal()">✕</button></div>${employeeFormHTML(emp)}<div class="form-actions"><button class="btn" onclick="closeModal()">${t('cancel')}</button><button class="btn btn-primary" onclick="submitEmployee('${id}')">${t('saveChanges')}</button></div>`);
}

async function submitEmployee(id) {
  const name  = $('ef-name')?.value.trim();
  const role  = $('ef-role')?.value.trim();
  const phone = $('ef-phone')?.value.trim();
  if (!name || !role) { showToast(t('nameRoleRequired'), 'error'); return; }
  try {
    if (id) {
      const updated = await DB.updateEmployee(id, { name, role, phone });
      STATE.employees = STATE.employees.map(e => e.id === id ? updated : e);
      showToast(t('employeeUpdated'));
    } else {
      const added = await DB.addEmployee({ name, role, phone });
      STATE.employees.push(added);
      showToast(t('employeeAdded'));
    }
    closeModal(); navigate('employees');
  } catch(e) { showToast(e.message, 'error'); }
}

function confirmRemoveEmployee(id) {
  const emp = getEmployee(id);
  if (!emp) return;
  openModal(`<div class="modal-header"><h2 class="modal-title">${t('removeEmployee')}</h2><button class="modal-close" onclick="closeModal()">✕</button></div><p style="color:var(--text2);margin-bottom:20px;">${t('removeEmployeeConfirm')}</p><div class="form-actions"><button class="btn" onclick="closeModal()">${t('cancel')}</button><button class="btn btn-danger" onclick="doRemoveEmployee('${id}')">${t('remove')}</button></div>`);
}

async function doRemoveEmployee(id) {
  try {
    await DB.deleteEmployee(id);
    STATE.employees = STATE.employees.filter(e => e.id !== id);
    closeModal(); showToast(t('employeeRemoved')); navigate('employees');
  } catch(e) { showToast(e.message, 'error'); }
}

// ===== ADMIN PAGE =====
function renderAdmin() {
  if (!STATE.adminUnlocked) return renderAdminGate();
  return renderAdminPanel();
}

function renderAdminGate() {
  return `
    <div class="page-header">
      <div><h1 class="page-title">${t('adminTitle')}</h1><p class="page-subtitle">${t('adminDesc')}</p></div>
    </div>
    <div class="admin-gate">
      <div class="lock-icon">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>
      <div>
        <div style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:6px;">${t('adminAccess')}</div>
        <div style="font-size:13px;color:var(--text2);">${t('adminPinHint')}</div>
      </div>
      <div style="width:100%;max-width:300px;">
        <div class="form-group">
          <label>${t('adminPin')}</label>
          <input type="password" id="admin-pin-input" placeholder="${t('adminPinPlaceholder')}" maxlength="8"
            onkeydown="if(event.key==='Enter') submitAdminPin()" />
        </div>
        <div id="admin-pin-error" class="alert alert-danger hidden" style="margin-bottom:12px;">${t('wrongPin')}</div>
        <button class="btn btn-primary" style="width:100%;" onclick="submitAdminPin()">${t('unlock')}</button>
      </div>
    </div>
  `;
}

function submitAdminPin() {
  const pin = $('admin-pin-input')?.value;
  const storedPin = localStorage.getItem('acm_admin_pin') || '1234';
  if (pin === storedPin) {
    STATE.adminUnlocked = true;
    showToast(t('adminUnlocked'));
    refreshPage();
  } else {
    const err = $('admin-pin-error');
    if (err) err.classList.remove('hidden');
  }
}

function renderAdminPanel() {
  const { sales, employees, costs } = STATE;
  const totalCostVal = costs.reduce((s,c) => s + Number(c.purchase_price) * Number(c.qty), 0);

  return `
    <div class="page-header">
      <div><h1 class="page-title">${t('adminTitle')}</h1><p class="page-subtitle">${t('adminDesc')}</p></div>
      <span class="badge badge-purple" style="font-size:12px;padding:6px 12px;">🔓 Admin</span>
    </div>

    <!-- Costs Section -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">🛒 ${t('costsTitle')}</span>
        <button class="btn btn-primary btn-sm" onclick="openAddCost()">+ ${t('addCost')}</button>
      </div>
      <div style="display:flex;gap:14px;margin-bottom:16px;flex-wrap:wrap;">
        <div class="stat-card" style="flex:1;min-width:140px;">
          <div class="stat-label">${t('totalPurchased')}</div>
          <div class="stat-value amber">${fmtSmall(totalCostVal)}</div>
          <div class="stat-sub">${costs.length} purchases</div>
        </div>
      </div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>${t('purchaseDate')}</th>
          <th>${t('purchasedProduct')}</th>
          <th>${t('purchaseFrom')}</th>
          <th>${t('paymentMethod')}</th>
          <th>${t('purchaseQty')}</th>
          <th>${t('purchasePrice')}</th>
          <th>${t('actions')}</th>
        </tr></thead>
        <tbody>
          ${costs.length ? costs.map(c => `<tr>
            <td style="color:var(--text2);white-space:nowrap;">${c.purchase_date}</td>
            <td class="fw-600">${c.product_name || '—'}</td>
            <td style="color:var(--text2);">${c.purchased_from}</td>
            <td>${c.payment_method ? `<span class="badge badge-amber">${c.payment_method}</span>` : '—'}</td>
            <td>${c.qty}</td>
            <td style="font-weight:600;color:var(--amber);">${fmt(Number(c.purchase_price)*Number(c.qty))}</td>
            <td><div style="display:flex;gap:5px;">
              <button class="btn btn-sm" onclick="openEditCost('${c.id}')">${t('edit')}</button>
              <button class="btn btn-sm btn-danger" onclick="confirmRemoveCost('${c.id}')">${t('remove')}</button>
            </div></td>
          </tr>`).join('') : `<tr><td colspan="7"><div class="empty-state"><p>${t('noCosts')}</p></div></td></tr>`}
        </tbody>
      </table></div>
    </div>

    <!-- Sales Management (admin edit) -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">📋 ${t('salesHistoryTitle')} (Admin)</span>
      </div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>${t('date')}</th><th>${t('productName')}</th><th>${t('byEmployee')}</th>
          <th>${t('revenue')}</th><th>Status</th><th>${t('actions')}</th>
        </tr></thead>
        <tbody>
          ${sales.slice(0,20).map(s => `<tr class="${s.refunded ? 'row-refunded' : ''}">
            <td style="color:var(--text2);white-space:nowrap;">${new Date(s.created_at).toLocaleDateString()}</td>
            <td class="fw-600">${s.product_name||'—'}</td>
            <td>${s.employee_name || '—'}</td>
            <td style="color:var(--accent);font-weight:600;">${fmt(s.revenue)}</td>
            <td>${s.refunded ? `<span class="badge badge-red">${t('refunded')}</span>` : '<span class="badge badge-green">Active</span>'}</td>
            <td><div style="display:flex;gap:5px;">
              <button class="btn btn-sm" onclick="openEditSale('${s.id}')">${t('edit')}</button>
              ${!s.refunded ? `<button class="btn btn-sm btn-danger" onclick="openRefundModal('${s.id}')">${t('markRefunded')}</button>` : ''}
            </div></td>
          </tr>`).join('')}
        </tbody>
      </table></div>
    </div>

    <!-- Employee Management (admin) -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">👥 ${t('employeesTitle')} (Admin)</span>
        <button class="btn btn-primary btn-sm" onclick="openAddEmployee()">+ ${t('addEmployee')}</button>
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>${t('fullName')}</th><th>${t('role')}</th><th>${t('phone')}</th><th>${t('sales')}</th><th>${t('actions')}</th></tr></thead>
        <tbody>
          ${employees.map(emp => {
            const empSales = sales.filter(s => s.employee_id === emp.id && !s.refunded).length;
            return `<tr>
              <td class="fw-600">${emp.name}</td>
              <td><span class="badge badge-blue">${emp.role}</span></td>
              <td style="color:var(--text2);">${emp.phone || '—'}</td>
              <td>${empSales}</td>
              <td><div style="display:flex;gap:5px;">
                <button class="btn btn-sm" onclick="openEditEmployee('${emp.id}')">${t('edit')}</button>
                <button class="btn btn-sm btn-danger" onclick="confirmRemoveEmployee('${emp.id}')">${t('remove')}</button>
              </div></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table></div>
    </div>

    <div style="text-align:center; margin-top:10px;">
      <button class="btn btn-sm" onclick="STATE.adminUnlocked=false; refreshPage()">🔒 Lock Admin</button>
    </div>
  `;
}

// ===== COSTS CRUD =====
function costFormHTML(c = {}) {
  const productOptions = STATE.products.map(p =>
    `<option value="${p.id}" data-name="${p.name}" ${c.product_id === p.id ? 'selected' : ''}>#${p.product_number||'?'} — ${p.name}</option>`
  ).join('');
  return `
    <div class="form-group"><label>${t('purchasedProduct')}</label>
      <select id="cf-product">
        <option value="">— Select product (optional) —</option>
        ${productOptions}
      </select>
    </div>
    <div class="form-group"><label>${t('purchaseFrom')}</label>
      <textarea id="cf-from" rows="2" placeholder="${t('purchaseFrom')}">${c.purchased_from||''}</textarea>
    </div>
    <div class="form-row">
      <div class="form-group"><label>${t('purchasePrice')} (per unit)</label><input type="number" id="cf-price" value="${c.purchase_price||''}" min="0" step="0.01" /></div>
      <div class="form-group"><label>${t('purchaseQty')}</label><input type="number" id="cf-qty" value="${c.qty||1}" min="1" /></div>
    </div>
    <div class="form-group"><label>${t('paymentMethod')}</label>
      <input type="text" id="cf-pay" value="${c.payment_method||''}" placeholder="${t('paymentMethodPlaceholder')}" />
    </div>
    <div class="form-group"><label>${t('purchaseDate')}</label>
      <input type="date" id="cf-date" value="${c.purchase_date||today()}" />
    </div>
    <div class="form-group"><label>${t('notes')}</label>
      <input type="text" id="cf-notes" value="${c.notes||''}" placeholder="Optional notes…" />
    </div>
  `;
}

function openAddCost() {
  openModal(`<div class="modal-header"><h2 class="modal-title">${t('addCost')}</h2><button class="modal-close" onclick="closeModal()">✕</button></div>${costFormHTML()}<div class="form-actions"><button class="btn" onclick="closeModal()">${t('cancel')}</button><button class="btn btn-primary" onclick="submitCost()">+ ${t('addCost')}</button></div>`);
}

function openEditCost(id) {
  const c = STATE.costs.find(x => x.id === id);
  if (!c) return;
  openModal(`<div class="modal-header"><h2 class="modal-title">${t('editCost')}</h2><button class="modal-close" onclick="closeModal()">✕</button></div>${costFormHTML(c)}<div class="form-actions"><button class="btn" onclick="closeModal()">${t('cancel')}</button><button class="btn btn-primary" onclick="submitCost('${id}')">${t('saveChanges')}</button></div>`);
}

async function submitCost(id) {
  const productSel   = $('cf-product');
  const product_id   = productSel?.value || null;
  const product_name = product_id ? (productSel.options[productSel.selectedIndex].dataset.name || '') : '';
  const purchased_from = $('cf-from')?.value.trim();
  const purchase_price = parseFloat($('cf-price')?.value);
  const qty            = parseInt($('cf-qty')?.value) || 1;
  const payment_method = $('cf-pay')?.value.trim();
  const purchase_date  = $('cf-date')?.value;
  const notes          = $('cf-notes')?.value.trim();

  if (!purchased_from || isNaN(purchase_price) || !purchase_date) { showToast(t('fillAllFields'), 'error'); return; }
  try {
    if (id) {
      const updated = await DB.updateCost(id, { product_id, product_name, purchased_from, purchase_price, qty, payment_method, purchase_date, notes });
      STATE.costs = STATE.costs.map(c => c.id === id ? updated : c);
      showToast(t('costUpdated'));
    } else {
      const added = await DB.addCost({ product_id, product_name, purchased_from, purchase_price, qty, payment_method, purchase_date, notes });
      STATE.costs.unshift(added);
      showToast(t('costAdded'));
    }
    closeModal(); navigate('admin');
  } catch(e) { showToast(e.message, 'error'); }
}

function confirmRemoveCost(id) {
  openModal(`<div class="modal-header"><h2 class="modal-title">${t('removeCost')}</h2><button class="modal-close" onclick="closeModal()">✕</button></div><p style="color:var(--text2);margin-bottom:20px;">${t('removeCostConfirm')}</p><div class="form-actions"><button class="btn" onclick="closeModal()">${t('cancel')}</button><button class="btn btn-danger" onclick="doRemoveCost('${id}')">${t('remove')}</button></div>`);
}

async function doRemoveCost(id) {
  try {
    await DB.deleteCost(id);
    STATE.costs = STATE.costs.filter(c => c.id !== id);
    closeModal(); showToast(t('costRemoved')); navigate('admin');
  } catch(e) { showToast(e.message, 'error'); }
}

// ===== SETTINGS =====
function renderSettings() {
  const { url, key } = DB.getConfig();
  return `
    <div class="page-header">
      <div><h1 class="page-title">${t('settingsTitle')}</h1></div>
    </div>
    <div style="max-width:540px; display:flex; flex-direction:column; gap:20px;">

      <div class="card">
        <div class="card-title" style="margin-bottom:16px;">${t('language')}</div>
        <div style="display:flex; gap:10px;">
          <button class="btn ${currentLang === 'en' ? 'btn-primary' : ''}" onclick="setLang('en')">${t('english')}</button>
          <button class="btn ${currentLang === 'am' ? 'btn-primary' : ''}" onclick="setLang('am')">${t('amharic')}</button>
        </div>
      </div>

      <div class="card">
        <div class="card-title" style="margin-bottom:16px;">${t('account')}</div>
        <p style="font-size:13px; color:var(--text2); margin-bottom:12px;">${t('loggedInAs')}: <strong style="color:var(--text);">${STATE.user?.email || '—'}</strong></p>
        <button class="btn btn-danger btn-sm" onclick="doSignOut()">${t('signOut')}</button>
      </div>

      <div class="card">
        <div class="card-title" style="margin-bottom:8px;">${t('adminPinSetting')}</div>
        <p style="font-size:12px; color:var(--text3); margin-bottom:12px;">Default PIN is 1234. Change it here.</p>
        <div class="form-group"><label>${t('newPin')}</label><input type="password" id="new-pin" placeholder="e.g. 5678" maxlength="8" /></div>
        <button class="btn btn-primary btn-sm" onclick="saveAdminPin()">${t('changeAdminPin')}</button>
      </div>

      <div class="card">
        <div class="card-title" style="margin-bottom:8px;">${t('supabaseConfig')}</div>
        <p style="font-size:12px; color:var(--text3); margin-bottom:16px;">${t('configInstructions')}</p>
        <div class="form-group"><label>${t('supabaseUrl')}</label><input type="url" id="cfg-url" value="${url}" placeholder="https://xxx.supabase.co" /></div>
        <div class="form-group"><label>${t('supabaseKey')}</label><input type="text" id="cfg-key" value="${key}" placeholder="eyJ…" /></div>
        <button class="btn btn-primary" onclick="saveConfig()">${t('saveConfig')}</button>
      </div>

      <div class="card">
        <div class="card-title" style="margin-bottom:8px;">Database SQL Setup</div>
        <p style="font-size:12px; color:var(--text3); margin-bottom:10px;">Run this in Supabase → SQL Editor:</p>
        <pre style="background:var(--bg3); border:1px solid var(--border); border-radius:8px; padding:12px; overflow-x:auto; white-space:pre-wrap; font-size:11px; line-height:1.5;">${window.SUPABASE_SQL}</pre>
        <button class="btn btn-sm" style="margin-top:8px;" onclick="copySql()">Copy SQL</button>
      </div>
    </div>
  `;
}

function saveAdminPin() {
  const pin = $('new-pin')?.value.trim();
  if (!pin || pin.length < 4) { showToast('PIN must be at least 4 characters', 'error'); return; }
  localStorage.setItem('acm_admin_pin', pin);
  showToast(t('pinSaved'));
}

async function saveConfig() {
  const url = $('cfg-url')?.value.trim();
  const key = $('cfg-key')?.value.trim();
  if (!url || !key) return;
  localStorage.setItem('bs_supa_url', url);
  localStorage.setItem('bs_supa_key', key);
  DB.init();
  showToast(t('configSaved'));
  const session = await DB.getSession();
  if (session) { STATE.user = DB.user; await loadAllData(); }
  render();
}

// ===== ICONS =====
const ico = (d, extra='') => `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ${extra}>${d}</svg>`;
function dashIcon()    { return ico('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'); }
function boxIcon()     { return ico('<path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3"/><rect x="1" y="8" width="22" height="13" rx="2"/>'); }
function cartIcon()    { return ico('<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>'); }
function fileIcon()    { return ico('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/>'); }
function usersIcon()   { return ico('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'); }
function settingsIcon(){ return ico('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>'); }
function shieldIcon()  { return ico('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'); }

// ===== INIT =====
async function init() {
  DB.init();

  if (DB.isConfigured()) {
    const session = await DB.getSession();
    if (session) {
      STATE.user = DB.user;
      await loadAllData();

      STATE.channel = DB.subscribeAll(async () => {
        await loadAllData();
        const container = $('page-container');
        if (container) { container.innerHTML = renderPage(); attachPageHandlers(); }
        const badge = $('sync-badge');
        if (badge) {
          badge.textContent = t('syncing');
          badge.classList.add('syncing');
          setTimeout(()=>{ badge.textContent = t('online'); badge.classList.remove('syncing'); }, 1200);
        }
      });
    }
  }

  DB.onAuthChange(async (event, session) => {
    STATE.user = session?.user || null;
    if (STATE.user) { await loadAllData(); }
    render();
  });

  render();
}

init();
