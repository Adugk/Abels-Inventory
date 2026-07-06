// ===== i18n — English & Amharic =====

window.TRANSLATIONS = {
  en: {
    appName: "Abel's CM",
    appFullName: "Abel's Construction Material",
    appTagline: 'Construction Material Inventory',

    // Auth
    signIn: 'Sign In', signUp: 'Sign Up', signOut: 'Sign Out',
    email: 'Email', password: 'Password', fullName: 'Full Name',
    noAccount: "Don't have an account?", haveAccount: 'Already have an account?',
    signingIn: 'Signing in…', signingUp: 'Creating account…',
    authError: 'Authentication failed. Check your credentials.',
    welcomeBack: 'Welcome back', createAccount: 'Create your account',

    // Nav
    dashboard: 'Dashboard', products: 'Products',
    recordSale: 'Record Sale', salesHistory: 'Sales History',
    employees: 'Employees', settings: 'Settings',
    costs: 'Purchase Costs', admin: 'Admin',

    // Dashboard
    totalRevenue: 'Total Revenue', totalProfit: 'Total Profit',
    inventoryValue: 'Inventory Value', lowStock: 'Low Stock',
    itemsNeedReorder: 'items need reorder', salesTotal: 'sales total',
    margin: 'margin', topProducts: 'Top Products by Revenue',
    recentSales: 'Recent Sales', viewAll: 'View all',
    noSalesYet: 'No sales recorded yet.', lowStockAlert: 'items low on stock',
    totalCosts: 'Total Purchase Costs',

    // Products
    productsTitle: 'Products', itemsInInventory: 'items in inventory',
    addProduct: 'Add Product', productName: 'Product Name',
    category: 'Category', costPrice: 'Cost Price ($)',
    sellingPrice: 'Selling Price ($)', quantity: 'Quantity in Stock',
    margin2: 'Margin', stock: 'Stock', actions: 'Actions',
    edit: 'Edit', remove: 'Remove', editProduct: 'Edit Product',
    saveChanges: 'Save Changes', cancel: 'Cancel',
    removeProduct: 'Remove Product',
    removeProductConfirm: 'Remove this product from inventory? This cannot be undone.',
    productAdded: 'Product added', productUpdated: 'Product updated',
    productRemoved: 'Product removed', fillAllFields: 'Please fill in all fields',
    priceError: 'Selling price should be ≥ cost', units: 'units',
    productNo: 'Product #', searchProducts: 'Search products…',

    // Record Sale
    recordSaleTitle: 'Record Sale', logNewSale: 'Log a new material sale',
    product: 'Product', selectProduct: '— Select product —',
    qty: 'Quantity', employee: 'Employee (Sales Rep)',
    selectEmployee: '— Select employee —', notes: 'Notes (optional)',
    notesPlaceholder: 'e.g. Customer: ABC Construction',
    confirmSale: 'Confirm Sale', unitPrice: 'Unit Price',
    revenue: 'Revenue', cost: 'Cost', profit: 'Profit',
    selectProductError: 'Select a product', selectEmployeeError: 'Select an employee',
    qtyError: 'Quantity must be at least 1', stockError: 'Not enough stock',
    saleRecorded: 'Sale recorded', inStock: 'in stock',
    discount: 'Discount ($)', discountPct: 'Discount (%)',
    discountType: 'Discount Type', noDiscount: 'No Discount',
    flatDiscount: 'Fixed Amount ($)', pctDiscount: 'Percentage (%)',
    afterDiscount: 'After Discount',

    // Sales History
    salesHistoryTitle: 'Sales History', transactions: 'transactions',
    avgSaleValue: 'Avg Sale Value', avgMargin: 'Avg Margin',
    date: 'Date', byEmployee: 'Employee', noSalesHistory: 'No sales recorded yet.',
    recordFirstSale: 'Record your first sale →',
    markRefunded: 'Mark Refunded', refundAmount: 'Refund Amount ($)',
    refundNote: 'Refund Note', confirmRefund: 'Confirm Refund',
    refunded: 'REFUNDED', refundRecorded: 'Refund recorded',
    editSale: 'Edit Sale', saleUpdated: 'Sale updated',
    discountApplied: 'Discount',

    // Employees
    employeesTitle: 'Employees', teamMembers: 'team members',
    addEmployee: 'Add Employee', role: 'Role / Title', phone: 'Phone (optional)',
    sales: 'Sales', editEmployee: 'Edit Employee', removeEmployee: 'Remove Employee',
    removeEmployeeConfirm: "Remove this employee? Their sales history will be kept.",
    employeeAdded: 'Employee added', employeeUpdated: 'Employee updated',
    employeeRemoved: 'Employee removed', nameRoleRequired: 'Name and role are required',

    // Costs
    costsTitle: 'Purchase Costs', addCost: 'Log Purchase',
    supplier: 'Supplier / Source', purchaseFrom: 'Purchased From (Name & Location)',
    purchasePrice: 'Purchase Price ($)', paymentMethod: 'Payment Method',
    paymentMethodPlaceholder: 'e.g. Cash, Bank Transfer, Credit',
    purchaseQty: 'Quantity Purchased', purchaseDate: 'Purchase Date',
    costAdded: 'Purchase logged', costUpdated: 'Purchase updated',
    costRemoved: 'Purchase removed', editCost: 'Edit Purchase',
    removeCost: 'Remove Purchase', removeCostConfirm: 'Remove this purchase record?',
    totalPurchased: 'Total Purchased', noCosts: 'No purchases logged yet.',
    purchasedProduct: 'Product Purchased',

    // Admin
    adminTitle: 'Admin Panel', adminDesc: 'Restricted — admin only',
    adminAccess: 'Admin Access', adminPin: 'Admin PIN',
    adminPinPlaceholder: 'Enter 4-digit PIN',
    adminPinHint: 'Default PIN: 1234 (change in Settings)',
    unlock: 'Unlock', wrongPin: 'Incorrect PIN',
    adminUnlocked: 'Admin access granted',

    // Settings
    settingsTitle: 'Settings', language: 'Language',
    english: 'English', amharic: 'አማርኛ (Amharic)',
    account: 'Account', loggedInAs: 'Logged in as',
    supabaseConfig: 'Supabase Configuration',
    supabaseUrl: 'Supabase Project URL', supabaseKey: 'Supabase Anon Key',
    saveConfig: 'Save & Reconnect', configSaved: 'Configuration saved',
    configInstructions: 'Get these values from your Supabase project → Settings → API.',
    adminPinSetting: 'Admin PIN', changeAdminPin: 'Change Admin PIN',
    newPin: 'New PIN (4 digits)', pinSaved: 'Admin PIN saved',

    // General
    loading: 'Loading…', syncing: 'Syncing…', syncError: 'Sync error',
    online: 'Live', offline: 'Offline', noData: 'No data yet',
    sales2: 'sales',
  },

  am: {
    appName: "Abel's CM",
    appFullName: "ያቤልስ የግንባታ ዕቃ",
    appTagline: 'የግንባታ ዕቃ ክምችት',
    signIn: 'ግባ', signUp: 'ምዝገባ', signOut: 'ውጣ',
    email: 'ኢሜይል', password: 'የሚስጥር ቁልፍ', fullName: 'ሙሉ ስም',
    noAccount: 'መለያ የለህም?', haveAccount: 'መለያ አለህ?',
    signingIn: 'እየገባ ነው…', signingUp: 'መለያ እየፈጠረ ነው…',
    authError: 'ማረጋገጫ አልተሳካም።', welcomeBack: 'እንኳን ተመለሱ',
    createAccount: 'መለያ ይፍጠሩ',
    dashboard: 'ዳሽቦርድ', products: 'ምርቶች',
    recordSale: 'ሽያጭ መዝግብ', salesHistory: 'የሽያጭ ታሪክ',
    employees: 'ሠራተኞች', settings: 'ቅንብሮች',
    costs: 'የግዢ ወጪዎች', admin: 'አስተዳዳሪ',
    totalRevenue: 'ጠቅላላ ገቢ', totalProfit: 'ጠቅላላ ትርፍ',
    inventoryValue: 'የክምችት ዋጋ', lowStock: 'አነስተኛ ክምችት',
    itemsNeedReorder: 'ዕቃዎች ዳግም ያስፈልጋቸዋል', salesTotal: 'ጠቅላላ ሽያጭ',
    margin: 'ትርፍ', topProducts: 'ምርጥ ምርቶች', recentSales: 'የቅርብ ሽያጮች',
    viewAll: 'ሁሉንም', noSalesYet: 'ሽያጭ አልተመዘገበም።',
    lowStockAlert: 'ዕቃዎች አነስተኛ', totalCosts: 'ጠቅላላ ግዢ',
    productsTitle: 'ምርቶች', itemsInInventory: 'ዕቃዎች',
    addProduct: 'ምርት ጨምር', productName: 'የምርት ስም',
    category: 'ምድብ', costPrice: 'ዋጋ (ብር)', sellingPrice: 'የሽያጭ ዋጋ (ብር)',
    quantity: 'ብዛት', margin2: 'ትርፍ', stock: 'ክምችት', actions: 'ድርጊቶች',
    edit: 'አርትዕ', remove: 'አስወግድ', editProduct: 'ምርት አርትዕ',
    saveChanges: 'ያስቀምጡ', cancel: 'ሰርዝ',
    removeProduct: 'ምርት አስወግድ', removeProductConfirm: 'ምርቱን ያስወግዱ?',
    productAdded: 'ተጨምሯል', productUpdated: 'ተዘምኗል', productRemoved: 'ተወግዷል',
    fillAllFields: 'ሁሉንም ይሙሉ', priceError: 'ዋጋ ከዋጋ ≥ መሆን አለበት', units: 'ክፍሎች',
    productNo: 'ምርት #', searchProducts: 'ምርቶች ፈልግ…',
    recordSaleTitle: 'ሽያጭ መዝግብ', logNewSale: 'አዲስ ሽያጭ ይዝግቡ',
    product: 'ምርት', selectProduct: '— ምርት ይምረጡ —',
    qty: 'ብዛት', employee: 'ሠራተኛ', selectEmployee: '— ሠራተኛ ይምረጡ —',
    notes: 'ማስታወሻ', notesPlaceholder: 'ለምሳሌ ደንበኛ: ABC',
    confirmSale: 'አረጋግጥ', unitPrice: 'የአሀድ ዋጋ',
    revenue: 'ገቢ', cost: 'ዋጋ', profit: 'ትርፍ',
    selectProductError: 'ምርት ይምረጡ', selectEmployeeError: 'ሠራተኛ ይምረጡ',
    qtyError: 'ቢያንስ 1', stockError: 'በቂ ክምችት የለም',
    saleRecorded: 'ተመዝግቧል', inStock: 'ክምችት',
    discount: 'ቅናሽ ($)', discountPct: 'ቅናሽ (%)', discountType: 'የቅናሽ አይነት',
    noDiscount: 'ቅናሽ የለም', flatDiscount: 'ቋሚ መጠን ($)', pctDiscount: 'መቶኛ (%)',
    afterDiscount: 'ቅናሽ በኋላ',
    salesHistoryTitle: 'የሽያጭ ታሪክ', transactions: 'ግብይቶች',
    avgSaleValue: 'አማካይ', avgMargin: 'አማካይ ትርፍ',
    date: 'ቀን', byEmployee: 'ሠራተኛ', noSalesHistory: 'ሽያጭ አልተመዘገበም።',
    recordFirstSale: 'ሽያጭ ይዝግቡ →',
    markRefunded: 'ተመላሽ ምልክት', refundAmount: 'የተመላሽ መጠን ($)',
    refundNote: 'ማስታወሻ', confirmRefund: 'አረጋግጥ',
    refunded: 'ተመላሽ', refundRecorded: 'ተመዝግቧል', editSale: 'ሽያጭ አርትዕ',
    saleUpdated: 'ሽያጭ ተዘምኗል', discountApplied: 'ቅናሽ',
    employeesTitle: 'ሠራተኞች', teamMembers: 'የቡድን አባላት',
    addEmployee: 'ሠራተኛ ጨምር', role: 'ሚና', phone: 'ስልክ',
    sales: 'ሽያጮች', editEmployee: 'ሠራተኛ አርትዕ', removeEmployee: 'አስወግድ',
    removeEmployeeConfirm: 'ሠራተኛ ያስወግዱ?',
    employeeAdded: 'ተጨምሯል', employeeUpdated: 'ተዘምኗል', employeeRemoved: 'ተወግዷል',
    nameRoleRequired: 'ስም እና ሚና ያስፈልጋሉ',
    costsTitle: 'የግዢ ወጪዎች', addCost: 'ግዢ ይዝግቡ',
    supplier: 'አቅራቢ', purchaseFrom: 'ከማን / የት ገዙ', purchasePrice: 'ዋጋ (ብር)',
    paymentMethod: 'የክፍያ ዘዴ', paymentMethodPlaceholder: 'ለምሳሌ ጥሬ ብር',
    purchaseQty: 'ብዛት', purchaseDate: 'ቀን',
    costAdded: 'ተመዝግቧል', costUpdated: 'ተዘምኗል', costRemoved: 'ተወግዷል',
    editCost: 'አርትዕ', removeCost: 'አስወግድ', removeCostConfirm: 'ይህን ያስወግዱ?',
    totalPurchased: 'ጠቅላላ ግዢ', noCosts: 'ምንም ግዢ አልተመዘገበም።',
    purchasedProduct: 'ምርት',
    adminTitle: 'አስተዳዳሪ', adminDesc: 'የተገደበ', adminAccess: 'ፈቃድ',
    adminPin: 'PIN', adminPinPlaceholder: '4 አሃዝ', adminPinHint: 'ነባሪ: 1234',
    unlock: 'ክፈት', wrongPin: 'ትክክለኛ PIN አይደለም', adminUnlocked: 'ተፈቅዷል',
    settingsTitle: 'ቅንብሮች', language: 'ቋንቋ', english: 'English', amharic: 'አማርኛ',
    account: 'መለያ', loggedInAs: 'የገቡት እንደ',
    supabaseConfig: 'Supabase ውቅር', supabaseUrl: 'URL', supabaseKey: 'Key',
    saveConfig: 'ያስቀምጡ', configSaved: 'ተቀምጧል',
    configInstructions: 'Supabase → Settings → API',
    adminPinSetting: 'የአስተዳዳሪ PIN', changeAdminPin: 'PIN ቀይር',
    newPin: 'አዲስ PIN (4 አሃዝ)', pinSaved: 'PIN ተቀምጧል',
    loading: 'እየጫነ…', syncing: 'እያመሳሰለ…', syncError: 'ስህተት',
    online: 'ቀጥታ', offline: 'ከመስመር', noData: 'ምንም ውሂብ',
    sales2: 'ሽያጮች',
  }
};

window.currentLang = localStorage.getItem('bs_lang') || 'en';

window.t = function(key) {
  return TRANSLATIONS[currentLang][key] || TRANSLATIONS['en'][key] || key;
};

window.setLang = function(lang) {
  currentLang = lang;
  localStorage.setItem('bs_lang', lang);
  // data-lang drives CSS font switching; lang drives screen reader language
  document.documentElement.setAttribute('data-lang', lang);
  document.documentElement.setAttribute('lang', lang === 'am' ? 'am' : 'en');
  if (window.APP && window.APP.rerender) window.APP.rerender();
};

document.documentElement.setAttribute('data-lang', window.currentLang);
document.documentElement.setAttribute('lang', window.currentLang === 'am' ? 'am' : 'en');
