// ===== SUPABASE CLIENT =====

window.DB = {
  client: null,
  user: null,

  getConfig() {
    return {
      url: localStorage.getItem('bs_supa_url') || '',
      key: localStorage.getItem('bs_supa_key') || '',
    };
  },

  init() {
    const { url, key } = this.getConfig();
    if (!url || !key) return false;
    try {
      this.client = supabase.createClient(url, key);
      return true;
    } catch(e) {
      console.error('Supabase init error:', e);
      return false;
    }
  },

  isConfigured() {
    const { url, key } = this.getConfig();
    return !!(url && key);
  },

  // ===== AUTH =====
  async signIn(email, password) {
    if (!this.client) throw new Error('Not configured');
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    this.user = data.user;
    return data.user;
  },

  async signUp(email, password, fullName) {
    if (!this.client) throw new Error('Not configured');
    const { data, error } = await this.client.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } }
    });
    if (error) throw error;
    this.user = data.user;
    return data.user;
  },

  async signOut() {
    if (!this.client) return;
    await this.client.auth.signOut();
    this.user = null;
  },

  async getSession() {
    if (!this.client) return null;
    const { data } = await this.client.auth.getSession();
    this.user = data?.session?.user || null;
    return data?.session;
  },

  onAuthChange(cb) {
    if (!this.client) return;
    this.client.auth.onAuthStateChange((event, session) => {
      this.user = session?.user || null;
      cb(event, session);
    });
  },

  // ===== PRODUCTS =====
  async getProducts() {
    const { data, error } = await this.client
      .from('products').select('*').order('product_number', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async addProduct(p) {
    const { data, error } = await this.client
      .from('products').insert([p]).select().single();
    if (error) throw error;
    return data;
  },

  async updateProduct(id, updates) {
    const { data, error } = await this.client
      .from('products').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteProduct(id) {
    const { error } = await this.client
      .from('products').delete().eq('id', id);
    if (error) throw error;
  },

  async getNextProductNumber() {
    const { data, error } = await this.client
      .from('products').select('product_number').order('product_number', { ascending: false }).limit(1);
    if (error || !data || data.length === 0) return 1001;
    return (data[0].product_number || 1000) + 1;
  },

  // ===== EMPLOYEES =====
  async getEmployees() {
    const { data, error } = await this.client
      .from('employees').select('*').order('name');
    if (error) throw error;
    return data || [];
  },

  async addEmployee(e) {
    const { data, error } = await this.client
      .from('employees').insert([e]).select().single();
    if (error) throw error;
    return data;
  },

  async updateEmployee(id, updates) {
    const { data, error } = await this.client
      .from('employees').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteEmployee(id) {
    const { error } = await this.client
      .from('employees').delete().eq('id', id);
    if (error) throw error;
  },

  // ===== SALES =====
  async getSales() {
    const { data, error } = await this.client
      .from('sales').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async addSale(sale) {
    const { data, error } = await this.client
      .from('sales').insert([sale]).select().single();
    if (error) throw error;
    return data;
  },

  async updateSale(id, updates) {
    const { data, error } = await this.client
      .from('sales').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  // ===== COSTS =====
  async getCosts() {
    const { data, error } = await this.client
      .from('costs').select('*').order('purchase_date', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async addCost(c) {
    const { data, error } = await this.client
      .from('costs').insert([c]).select().single();
    if (error) throw error;
    return data;
  },

  async updateCost(id, updates) {
    const { data, error } = await this.client
      .from('costs').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteCost(id) {
    const { error } = await this.client
      .from('costs').delete().eq('id', id);
    if (error) throw error;
  },

  // ===== REAL-TIME =====
  subscribeAll(onChange) {
    if (!this.client) return null;
    const channel = this.client
      .channel('acm-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, onChange)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'employees' }, onChange)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sales' }, onChange)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'costs' }, onChange)
      .subscribe();
    return channel;
  },
};

// ===== SQL SETUP =====
window.SUPABASE_SQL = `
-- Run this in Supabase SQL Editor:

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  product_number integer unique,
  name text not null,
  category text not null,
  cost numeric not null default 0,
  price numeric not null default 0,
  qty integer not null default 0,
  created_at timestamptz default now()
);

create table if not exists employees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  phone text,
  created_at timestamptz default now()
);

create table if not exists sales (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  product_name text,
  product_number integer,
  employee_id uuid references employees(id),
  employee_name text,
  qty integer not null,
  unit_price numeric not null default 0,
  discount_type text default 'none',
  discount_value numeric default 0,
  revenue numeric not null,
  profit numeric not null,
  notes text,
  refunded boolean default false,
  refund_amount numeric default 0,
  refund_note text,
  created_at timestamptz default now()
);

create table if not exists costs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  product_name text,
  purchased_from text not null,
  purchase_price numeric not null,
  payment_method text,
  qty integer not null default 1,
  purchase_date date not null,
  notes text,
  created_at timestamptz default now()
);

alter table products  enable row level security;
alter table employees enable row level security;
alter table sales     enable row level security;
alter table costs     enable row level security;

create policy "auth users" on products  for all using (auth.role() = 'authenticated');
create policy "auth users" on employees for all using (auth.role() = 'authenticated');
create policy "auth users" on sales     for all using (auth.role() = 'authenticated');
create policy "auth users" on costs     for all using (auth.role() = 'authenticated');
`.trim();
