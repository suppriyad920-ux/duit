import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wallet, ArrowUpRight, ArrowDownRight, DollarSign, PieChart as PieChartIcon, 
  TrendingUp, TrendingDown, Calendar, Filter, Plus, Trash2, Edit3, Download, 
  Upload, Moon, Sun, Search, PiggyBank, Target, AlertTriangle, ShieldCheck, 
  CheckCircle2, RefreshCw, ChevronLeft, ChevronRight, Layers, Tag, CreditCard,
  Building, Globe, Settings, ArrowRight, BarChart3, HelpCircle, X, Sparkles, CheckSquare, Square, RotateCcw
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

// --- INITIAL DUMMY DATA ---
const INITIAL_ACCOUNTS = [
  { id: 'acc-1', name: 'Bank BCA', type: 'Bank', balance: 12500000, color: 'bg-blue-600', icon: 'Building' },
  { id: 'acc-2', name: 'Dompet Tunai', type: 'Cash', balance: 850000, color: 'bg-emerald-600', icon: 'Wallet' },
  { id: 'acc-3', name: 'GoPay', type: 'E-Wallet', balance: 450000, color: 'bg-cyan-500', icon: 'CreditCard' },
  { id: 'acc-4', name: 'OVO', type: 'E-Wallet', balance: 320000, color: 'bg-purple-600', icon: 'CreditCard' },
];

const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'Gaji & Pendapatan', type: 'income', color: '#10B981', icon: 'DollarSign' },
  { id: 'cat-2', name: 'Investasi & Bonus', type: 'income', color: '#3B82F6', icon: 'TrendingUp' },
  { id: 'cat-3', name: 'Makanan & Minuman', type: 'expense', color: '#EF4444', icon: 'Tag' },
  { id: 'cat-4', name: 'Belanja & Kebutuhan', type: 'expense', color: '#F59E0B', icon: 'Tag' },
  { id: 'cat-5', name: 'Transportasi', type: 'expense', color: '#8B5CF6', icon: 'Tag' },
  { id: 'cat-6', name: 'Tagihan & Utilitas', type: 'expense', color: '#EC4899', icon: 'Tag' },
  { id: 'cat-7', name: 'Hiburan & Hobi', type: 'expense', color: '#6366F1', icon: 'Tag' },
];

const INITIAL_TRANSACTIONS = [
  { id: 'tx-1', date: '2026-03-01', amount: 8500000, type: 'income', categoryId: 'cat-1', accountId: 'acc-1', note: 'Gaji Bulanan Maret', status: 'Completed' },
  { id: 'tx-2', date: '2026-03-02', amount: 150000, type: 'expense', categoryId: 'cat-3', accountId: 'acc-3', note: 'Makan Malam Restaurant', status: 'Completed' },
  { id: 'tx-3', date: '2026-03-03', amount: 450000, type: 'expense', categoryId: 'cat-4', accountId: 'acc-1', note: 'Belanja Bulanan Supermarket', status: 'Completed' },
  { id: 'tx-4', date: '2026-03-05', amount: 1200000, type: 'expense', categoryId: 'cat-6', accountId: 'acc-1', note: 'Bayar Listrik & WiFi', status: 'Completed' },
  { id: 'tx-5', date: '2026-03-08', amount: 1500000, type: 'income', categoryId: 'cat-2', accountId: 'acc-1', note: 'Dividen Saham', status: 'Completed' },
  { id: 'tx-6', date: '2026-03-10', amount: 250000, type: 'expense', categoryId: 'cat-5', accountId: 'acc-4', note: 'Bensin & Tol', status: 'Completed' },
  { id: 'tx-7', date: '2026-03-12', amount: 350000, type: 'expense', categoryId: 'cat-7', accountId: 'acc-3', note: 'Nonton Bioskop & Cafe', status: 'Completed' },
];

const INITIAL_BUDGETS = [
  { id: 'bud-1', categoryId: 'cat-3', amount: 2000000 },
  { id: 'bud-2', categoryId: 'cat-4', amount: 1500000 },
  { id: 'bud-3', categoryId: 'cat-6', amount: 1500000 },
];

const INITIAL_GOALS = [
  { id: 'goal-1', title: 'Beli Laptop Baru', targetAmount: 15000000, currentAmount: 8500000, deadline: '2026-12-31', color: 'bg-blue-500' },
  { id: 'goal-2', title: 'Dana Darurat 6 Bulan', targetAmount: 30000000, currentAmount: 18000000, deadline: '2027-06-30', color: 'bg-emerald-500' },
  { id: 'goal-3', title: 'Liburan Akhir Tahun', targetAmount: 7500000, currentAmount: 3000000, deadline: '2026-11-30', color: 'bg-purple-500' },
];

const formatCurrency = (val, currency = 'IDR') => {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val / 15500);
  }
  if (currency === 'EUR') {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(val / 16800);
  }
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
};

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [currency, setCurrency] = useState('IDR');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Core Data States with LocalStorage
  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem('fin_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('fin_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('fin_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('fin_budgets');
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('fin_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  // Bulk Delete State & Modals State
  const [selectedTxIds, setSelectedTxIds] = useState([]);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [isAccModalOpen, setIsAccModalOpen] = useState(false);
  const [editingAcc, setEditingAcc] = useState(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  // Confirmation Modals State
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({ isOpen: false, type: null, targetId: null });
  const [deleteAccModal, setDeleteAccModal] = useState({ isOpen: false, targetId: null });
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  
  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Form States
  const [txForm, setTxForm] = useState({
    type: 'expense',
    amount: '',
    categoryId: '',
    accountId: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
    status: 'Completed'
  });

  const [accForm, setAccForm] = useState({ name: '', type: 'Bank', balance: '', color: 'bg-blue-600' });
  const [goalForm, setGoalForm] = useState({ title: '', targetAmount: '', currentAmount: '', deadline: '', color: 'bg-blue-500' });

  const COLOR_OPTIONS = [
    { label: 'Blue', value: 'bg-blue-600' },
    { label: 'Emerald', value: 'bg-emerald-600' },
    { label: 'Cyan', value: 'bg-cyan-500' },
    { label: 'Purple', value: 'bg-purple-600' },
    { label: 'Amber', value: 'bg-amber-600' },
    { label: 'Rose', value: 'bg-rose-600' },
    { label: 'Indigo', value: 'bg-indigo-600' },
  ];

  const handleEditAccountClick = (acc) => {
    setEditingAcc(acc.id);
    setAccForm({
      name: acc.name,
      type: acc.type,
      balance: acc.balance.toString(),
      color: acc.color || 'bg-blue-600'
    });
    setIsAccModalOpen(true);
  };

  const handleSaveAccount = (e) => {
    e.preventDefault();
    if (!accForm.name || accForm.balance === '') return;
    
    const balanceNum = parseFloat(accForm.balance) || 0;

    if (editingAcc) {
      setAccounts(prev => prev.map(acc => {
        if (acc.id === editingAcc) {
          return {
            ...acc,
            name: accForm.name,
            type: accForm.type,
            balance: balanceNum,
            color: accForm.color,
            icon: accForm.type === 'Bank' ? 'Building' : accForm.type === 'Cash' ? 'Wallet' : 'CreditCard'
          };
        }
        return acc;
      }));
      showToast('Rekening berhasil diperbarui!');
    } else {
      const newAcc = {
        id: `acc-${Date.now()}`,
        name: accForm.name,
        type: accForm.type,
        balance: balanceNum,
        color: accForm.color,
        icon: accForm.type === 'Bank' ? 'Building' : accForm.type === 'Cash' ? 'Wallet' : 'CreditCard'
      };
      setAccounts(prev => [...prev, newAcc]);
      showToast('Rekening baru berhasil ditambahkan');
    }

    setIsAccModalOpen(false);
    setEditingAcc(null);
    setAccForm({ name: '', type: 'Bank', balance: '', color: 'bg-blue-600' });
  };

  const promptDeleteAccount = (id) => {
    if (accounts.length <= 1) {
      showToast('Minimal harus ada 1 rekening tersisa!', 'info');
      return;
    }
    setDeleteAccModal({ isOpen: true, targetId: id });
  };

  const executeDeleteAccount = () => {
    const id = deleteAccModal.targetId;
    if (!id) return;

    // Remove transactions related to this account
    const relatedTxCount = transactions.filter(t => t.accountId === id).length;
    setTransactions(prev => prev.filter(t => t.accountId !== id));

    // Remove account
    setAccounts(prev => prev.filter(a => a.id !== id));
    
    setDeleteAccModal({ isOpen: false, targetId: null });
    showToast(`Rekening dan ${relatedTxCount} transaksi terkait telah dihapus`);
  };
    });
  }, [transactions, categories]);

  const monthlyTrendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
    return months.map(m => ({
      name: m,
      Pemasukan: Math.floor(Math.random() * 5000000) + 5000000,
      Pengeluaran: Math.floor(Math.random() * 4000000) + 2000000,
    }));
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.note.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      const matchesCat = filterCategory === 'all' || t.categoryId === filterCategory;
      const matchesAcc = filterAccount === 'all' || t.accountId === filterAccount;
      const matchesStart = !dateRange.start || new Date(t.date) >= new Date(dateRange.start);
      const matchesEnd = !dateRange.end || new Date(t.date) <= new Date(dateRange.end);

      return matchesSearch && matchesType && matchesCat && matchesAcc && matchesStart && matchesEnd;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, searchTerm, filterType, filterCategory, filterAccount, dateRange]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const handleSaveTransaction = (e) => {
    e.preventDefault();
    if (!txForm.amount || !txForm.categoryId || !txForm.accountId) return;

    const amt = parseFloat(txForm.amount);
    
    if (editingTx) {
      // Revert old transaction's impact on account balance
      const oldTx = transactions.find(t => t.id === editingTx);
      if (oldTx) {
        setAccounts(prev => prev.map(acc => {
          if (acc.id === oldTx.accountId) {
            const revertAmt = oldTx.type === 'income' ? -oldTx.amount : oldTx.amount;
            return { ...acc, balance: acc.balance + revertAmt };
          }
          return acc;
        }));
      }

      setTransactions(prev => prev.map(t => t.id === editingTx ? { ...txForm, amount: amt, id: editingTx } : t));
      showToast('Transaksi berhasil diperbarui!');
    } else {
      const newTx = { ...txForm, amount: amt, id: `tx-${Date.now()}` };
      setTransactions(prev => [newTx, ...prev]);
      showToast('Transaksi baru berhasil ditambahkan!');
    }

    setAccounts(prev => prev.map(acc => {
      if (acc.id === txForm.accountId) {
        const change = txForm.type === 'income' ? amt : -amt;
        return { ...acc, balance: acc.balance + change };
      }
      return acc;
    }));

    setIsTxModalOpen(false);
    setEditingTx(null);
    setTxForm({
      type: 'expense',
      amount: '',
      categoryId: '',
      accountId: '',
      date: new Date().toISOString().split('T')[0],
      note: '',
      status: 'Completed'
    });
  };

  // Hapus single transaksi
  const executeDeleteSingleTx = (id) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    // Revert account balance
    setAccounts(prev => prev.map(acc => {
      if (acc.id === tx.accountId) {
        const change = tx.type === 'income' ? -tx.amount : tx.amount;
        return { ...acc, balance: acc.balance + change };
      }
      return acc;
    }));

    setTransactions(prev => prev.filter(t => t.id !== id));
    setSelectedTxIds(prev => prev.filter(selectedId => selectedId !== id));
    showToast('Transaksi berhasil dihapus');
  };

  // Hapus massal / bulk delete
  const executeDeleteBulkTx = () => {
    if (selectedTxIds.length === 0) return;

    // Adjust balance for all selected transactions
    const updatedAccounts = [...accounts];
    selectedTxIds.forEach(id => {
      const tx = transactions.find(t => t.id === id);
      if (tx) {
        const accIdx = updatedAccounts.findIndex(a => a.id === tx.accountId);
        if (accIdx !== -1) {
          const change = tx.type === 'income' ? -tx.amount : tx.amount;
          updatedAccounts[accIdx].balance += change;
        }
      }
    });

    setAccounts(updatedAccounts);
    setTransactions(prev => prev.filter(t => !selectedTxIds.includes(t.id)));
    showToast(`${selectedTxIds.length} transaksi berhasil dihapus`);
    setSelectedTxIds([]);
  };

  // Confirm delete triggers
  const promptDeleteTx = (id) => {
    setDeleteConfirmModal({ isOpen: true, type: 'single', targetId: id });
  };

  const promptBulkDelete = () => {
    setDeleteConfirmModal({ isOpen: true, type: 'bulk', targetId: null });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmModal.type === 'single') {
      executeDeleteSingleTx(deleteConfirmModal.targetId);
    } else if (deleteConfirmModal.type === 'bulk') {
      executeDeleteBulkTx();
    }
    setDeleteConfirmModal({ isOpen: false, type: null, targetId: null });
  };

  // Checkbox select handlers
  const handleSelectAllOnPage = (e) => {
    if (e.target.checked) {
      const pageIds = paginatedTransactions.map(t => t.id);
      setSelectedTxIds(prev => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = paginatedTransactions.map(t => t.id);
      setSelectedTxIds(prev => prev.filter(id => !pageIds.includes(id)));
    }
  };

  const handleSelectTx = (id) => {
    setSelectedTxIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Reset Seluruh Data (Factory Reset)
  const handleFactoryReset = (type = 'sample') => {
    if (type === 'sample') {
      setAccounts(INITIAL_ACCOUNTS);
      setCategories(INITIAL_CATEGORIES);
      setTransactions(INITIAL_TRANSACTIONS);
      setBudgets(INITIAL_BUDGETS);
      setGoals(INITIAL_GOALS);
      showToast('Aplikasi berhasil di-reset ke Data Sampel awal');
    } else {
      setAccounts([]);
      setCategories(INITIAL_CATEGORIES);
      setTransactions([]);
      setBudgets([]);
      setGoals([]);
      showToast('Seluruh data aplikasi telah dibersihkan total', 'info');
    }
    setSelectedTxIds([]);
    setIsResetModalOpen(false);
  };

  const handleEditTxClick = (tx) => {
    setEditingTx(tx.id);
    setTxForm({ ...tx });
    setIsTxModalOpen(true);
  };

  const handleAddAccount = (e) => {
    e.preventDefault();
    if (!accForm.name || !accForm.balance) return;
    const newAcc = {
      id: `acc-${Date.now()}`,
      name: accForm.name,
      type: accForm.type,
      balance: parseFloat(accForm.balance),
      color: accForm.color,
      icon: accForm.type === 'Bank' ? 'Building' : 'Wallet'
    };
    setAccounts(prev => [...prev, newAcc]);
    setIsAccModalOpen(false);
    setAccForm({ name: '', type: 'Bank', balance: '', color: 'bg-blue-600' });
    showToast('Rekening baru berhasil ditambahkan');
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!goalForm.title || !goalForm.targetAmount) return;
    const newGoal = {
      id: `goal-${Date.now()}`,
      title: goalForm.title,
      targetAmount: parseFloat(goalForm.targetAmount),
      currentAmount: parseFloat(goalForm.currentAmount || 0),
      deadline: goalForm.deadline,
      color: goalForm.color
    };
    setGoals(prev => [...prev, newGoal]);
    setIsGoalModalOpen(false);
    setGoalForm({ title: '', targetAmount: '', currentAmount: '', deadline: '', color: 'bg-blue-500' });
    showToast('Target tabungan berhasil ditambahkan');
  };

  const exportToCSV = () => {
    const headers = ['ID,Tanggal,Tipe,Jumlah,Kategori,Rekening,Catatan,Status\n'];
    const rows = transactions.map(t => {
      const cat = categories.find(c => c.id === t.categoryId)?.name || '';
      const acc = accounts.find(a => a.id === t.accountId)?.name || '';
      return `"${t.id}","${t.date}","${t.type}",${t.amount},"${cat}","${acc}","${t.note}","${t.status}"\n`;
    });

    const blob = new Blob([...headers, ...rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `laporan-keuangan-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Data transaksi berhasil diekspor ke CSV');
  };

  const insights = useMemo(() => {
    const list = [];
    if (netCashflow > 0) {
      list.push({
        type: 'success',
        title: 'Arus Kas Positif!',
        desc: `Anda menghemat ${formatCurrency(netCashflow, currency)} bulan ini. Pertahankan tren positif ini!`
      });
    } else if (netCashflow < 0) {
      list.push({
        type: 'warning',
        title: 'Defisit Anggaran Detected',
        desc: `Pengeluaran Anda melebihi pemasukan sebesar ${formatCurrency(Math.abs(netCashflow), currency)}. Evaluasi pos pengeluaran opsional Anda.`
      });
    }

    if (categoryExpenses.length > 0) {
      const highestExpense = [...categoryExpenses].sort((a, b) => b.value - a.value)[0];
      const pct = Math.round((highestExpense.value / totalExpense) * 100) || 0;
      list.push({
        type: 'info',
        title: `Pengeluaran Terbesar: ${highestExpense.name}`,
        desc: `Kategori ${highestExpense.name} memakan ${pct}% dari total pengeluaran Anda bulan ini.`
      });
    }

    return list;
  }, [netCashflow, categoryExpenses, totalExpense, currency]);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex items-center space-x-2 px-4 py-3 rounded-xl shadow-2xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* HEADER / NAVIGATION */}
      <header className={`sticky top-0 z-30 border-b backdrop-blur-md ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/30">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                FinManager
              </h1>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">Smart Financial Management</p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'transactions', label: 'Transaksi', icon: ArrowUpRight },
              { id: 'budgets', label: 'Anggaran & Target', icon: Target },
              { id: 'accounts', label: 'Rekening', icon: CreditCard },
              { id: 'reports', label: 'Laporan', icon: PieChartIcon },
              { id: 'settings', label: 'Pengaturan', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Controls */}
          <div className="flex items-center space-x-3">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={`text-sm rounded-lg border px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none ${
                darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'
              }`}
            >
              <option value="IDR">IDR (Rp)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg border transition ${
                darkMode ? 'bg-slate-800 border-slate-700 text-yellow-400' : 'bg-white border-slate-300 text-slate-600'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => {
                setEditingTx(null);
                setIsTxModalOpen(true);
              }}
              className="flex items-center space-x-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm shadow-lg shadow-indigo-600/30 transition transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah Transaksi</span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE NAV BOTTOM BAR */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 border-t z-30 px-2 py-2 flex justify-around ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        {[
          { id: 'dashboard', label: 'Dash', icon: BarChart3 },
          { id: 'transactions', label: 'Tx', icon: ArrowUpRight },
          { id: 'budgets', label: 'Target', icon: Target },
          { id: 'accounts', label: 'Akun', icon: CreditCard },
          { id: 'settings', label: 'Setel', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center p-2 rounded-lg text-xs font-medium ${
                activeTab === tab.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-16 md:mb-0">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className={`p-5 rounded-2xl border shadow-sm transition hover:shadow-md ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total Saldo</span>
                  <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <Wallet className="w-5 h-5" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mt-3">{formatCurrency(totalBalance, currency)}</h2>
                <p className="text-xs text-slate-400 mt-1 flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 mr-1" /> Terhubung ke {accounts.length} rekening
                </p>
              </div>

              <div className={`p-5 rounded-2xl border shadow-sm transition hover:shadow-md ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Pemasukan</span>
                  <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mt-3 text-emerald-600 dark:text-emerald-400">{formatCurrency(totalIncome, currency)}</h2>
                <p className="text-xs text-emerald-500 mt-1 flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" /> Multi-sumber aktif
                </p>
              </div>

              <div className={`p-5 rounded-2xl border shadow-sm transition hover:shadow-md ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Pengeluaran</span>
                  <div className="p-2.5 bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-xl">
                    <ArrowDownRight className="w-5 h-5" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mt-3 text-rose-600 dark:text-rose-400">{formatCurrency(totalExpense, currency)}</h2>
                <p className="text-xs text-rose-500 mt-1 flex items-center">
                  <TrendingDown className="w-3.5 h-3.5 mr-1" /> Total pengeluaran tercatat
                </p>
              </div>

              <div className={`p-5 rounded-2xl border shadow-sm transition hover:shadow-md ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Cashflow Bersih</span>
                  <div className={`p-2.5 rounded-xl ${netCashflow >= 0 ? 'bg-cyan-100 text-cyan-600' : 'bg-amber-100 text-amber-600'}`}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
                <h2 className={`text-2xl font-bold mt-3 ${netCashflow >= 0 ? 'text-cyan-600 dark:text-cyan-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {formatCurrency(netCashflow, currency)}
                </h2>
                <p className="text-xs text-slate-400 mt-1">Pemasukan minus Pengeluaran</p>
              </div>

            </div>

            {/* Smart Insights Banner */}
            {insights.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.map((ins, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border flex items-start space-x-3 ${
                    ins.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300' :
                    ins.type === 'warning' ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300' :
                    'bg-indigo-500/10 border-indigo-500/30 text-indigo-700 dark:text-indigo-300'
                  }`}>
                    <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">{ins.title}</h4>
                      <p className="text-xs opacity-90 mt-0.5">{ins.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Visual Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className={`lg:col-span-2 p-6 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">Tren Arus Kas Bulanan</h3>
                  <span className="text-xs text-slate-400">6 Bulan Terakhir</span>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrendData}>
                      <defs>
                        <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#334155' : '#E2E8F0'} />
                      <XAxis dataKey="name" stroke={darkMode ? '#94A3B8' : '#64748B'} />
                      <YAxis stroke={darkMode ? '#94A3B8' : '#64748B'} tickFormatter={(v) => `Rp${v/1000000}M`} />
                      <Tooltip formatter={(value) => formatCurrency(value, currency)} />
                      <Legend />
                      <Area type="monotone" dataKey="Pemasukan" stroke="#10B981" fillOpacity={1} fill="url(#colorInc)" />
                      <Area type="monotone" dataKey="Pengeluaran" stroke="#EF4444" fillOpacity={1} fill="url(#colorExp)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">Distribusi Pengeluaran</h3>
                </div>
                <div className="h-72 w-full flex items-center justify-center">
                  {categoryExpenses.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryExpenses}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={85}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryExpenses.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value, currency)} />
                        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-slate-400">Belum ada data pengeluaran</p>
                  )}
                </div>
              </div>

            </div>

            {/* Recent Transactions List on Dashboard */}
            <div className={`p-6 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Transaksi Terakhir</h3>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-sm text-indigo-500 hover:text-indigo-600 font-medium flex items-center"
                >
                  Lihat Semua <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {transactions.slice(0, 5).map((t) => {
                  const cat = categories.find(c => c.id === t.categoryId);
                  const acc = accounts.find(a => a.id === t.accountId);
                  return (
                    <div key={t.id} className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl px-2 transition">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                          style={{ backgroundColor: cat ? cat.color : '#6B7280' }}
                        >
                          {t.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{t.note || cat?.name}</p>
                          <p className="text-xs text-slate-400">{t.date} • {acc?.name}</p>
                        </div>
                      </div>
                      <span className={`font-semibold text-sm ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, currency)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: TRANSACTIONS MANAGEMENT WITH BULK DELETE & DELETE PER ITEM */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            
            {/* Header Controls & Filters */}
            <div className={`p-5 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                
                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari transaksi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-9 pr-4 py-2 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className={`text-sm rounded-xl border px-3 py-2 outline-none ${
                      darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <option value="all">Semua Tipe</option>
                    <option value="income">Pemasukan</option>
                    <option value="expense">Pengeluaran</option>
                  </select>

                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className={`text-sm rounded-xl border px-3 py-2 outline-none ${
                      darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <option value="all">Semua Kategori</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>

                  <select
                    value={filterAccount}
                    onChange={(e) => setFilterAccount(e.target.value)}
                    className={`text-sm rounded-xl border px-3 py-2 outline-none ${
                      darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <option value="all">Semua Rekening</option>
                    {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>

                  <button
                    onClick={exportToCSV}
                    className="flex items-center space-x-1 px-3 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-xl text-sm font-medium transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Ekspor CSV</span>
                  </button>
                </div>

              </div>
            </div>

            {/* FLOATING ACTION BAR FOR BULK DELETE */}
            {selectedTxIds.length > 0 && (
              <div className="flex items-center justify-between p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-600 dark:text-rose-400 transition animate-fadeIn">
                <div className="flex items-center space-x-2">
                  <CheckSquare className="w-5 h-5" />
                  <span className="font-semibold text-sm">
                    {selectedTxIds.length} transaksi terpilih
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedTxIds([])}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 transition"
                  >
                    Batal Pilihan
                  </button>
                  <button
                    onClick={promptBulkDelete}
                    className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition shadow"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus Massal ({selectedTxIds.length})</span>
                  </button>
                </div>
              </div>
            )}

            {/* Transactions Table */}
            <div className={`rounded-2xl border shadow-sm overflow-hidden ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className={`border-b font-semibold text-slate-500 dark:text-slate-400 ${darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <tr>
                      <th className="p-4 w-10 text-center">
                        <input
                          type="checkbox"
                          onChange={handleSelectAllOnPage}
                          checked={
                            paginatedTransactions.length > 0 &&
                            paginatedTransactions.every(t => selectedTxIds.includes(t.id))
                          }
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                        />
                      </th>
                      <th className="p-4">Tanggal</th>
                      <th className="p-4">Kategori & Catatan</th>
                      <th className="p-4">Rekening</th>
                      <th className="p-4">Tipe</th>
                      <th className="p-4 text-right">Jumlah</th>
                      <th className="p-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {paginatedTransactions.length > 0 ? (
                      paginatedTransactions.map((t) => {
                        const cat = categories.find(c => c.id === t.categoryId);
                        const acc = accounts.find(a => a.id === t.accountId);
                        const isSelected = selectedTxIds.includes(t.id);

                        return (
                          <tr key={t.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/40 transition ${isSelected ? 'bg-indigo-500/5 dark:bg-indigo-500/10' : ''}`}>
                            <td className="p-4 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleSelectTx(t.id)}
                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                              />
                            </td>
                            <td className="p-4 whitespace-nowrap text-slate-400">{t.date}</td>
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                                  style={{ backgroundColor: cat ? cat.color : '#9CA3AF' }}
                                >
                                  {cat?.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-semibold">{t.note || '-'}</p>
                                  <p className="text-xs text-slate-400">{cat?.name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 whitespace-nowrap font-medium text-slate-600 dark:text-slate-300">{acc?.name}</td>
                            <td className="p-4 whitespace-nowrap">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                t.type === 'income'
                                  ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400'
                              }`}>
                                {t.type === 'income' ? 'Masuk' : 'Keluar'}
                              </span>
                            </td>
                            <td className={`p-4 text-right font-bold whitespace-nowrap ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, currency)}
                            </td>
                            <td className="p-4 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center space-x-2">
                                <button
                                  onClick={() => handleEditTxClick(t)}
                                  className="p-1.5 text-slate-400 hover:text-indigo-500 rounded-lg transition"
                                  title="Edit Transaksi"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => promptDeleteTx(t.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition"
                                  title="Hapus Transaksi"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-slate-400">
                          Tidak ada transaksi yang ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className={`p-4 border-t flex items-center justify-between ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <span className="text-xs text-slate-400">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="p-1.5 rounded-lg border text-slate-500 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="p-1.5 rounded-lg border text-slate-500 disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: BUDGETS & FINANCIAL GOALS */}
        {activeTab === 'budgets' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Anggaran Bulanan per Kategori</h3>
                  <p className="text-xs text-slate-400">Pantau batas pengeluaran Anda agar tidak membeludak.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {budgets.map((b) => {
                  const cat = categories.find(c => c.id === b.categoryId);
                  const used = transactions
                    .filter(t => t.categoryId === b.categoryId && t.type === 'expense')
                    .reduce((acc, t) => acc + Number(t.amount), 0);
                  const pct = Math.min(100, Math.round((used / b.amount) * 100));
                  const isOver = used > b.amount;

                  return (
                    <div key={b.id} className={`p-5 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-sm">{cat?.name}</span>
                        {isOver && (
                          <span className="flex items-center text-xs font-semibold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3 mr-1" /> Overbudget
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline justify-between mb-2">
                        <span className="text-xl font-extrabold">{formatCurrency(used, currency)}</span>
                        <span className="text-xs text-slate-400">dari {formatCurrency(b.amount, currency)}</span>
                      </div>

                      <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${isOver ? 'bg-rose-500' : pct > 80 ? 'bg-amber-500' : 'bg-indigo-600'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center mt-2 text-xs text-slate-400">
                        <span>Terpakai {pct}%</span>
                        <span>Sisa: {formatCurrency(Math.max(0, b.amount - used), currency)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Target Tabungan (Financial Goals)</h3>
                  <p className="text-xs text-slate-400">Rencanakan pencapaian finansial impian Anda.</p>
                </div>
                <button
                  onClick={() => setIsGoalModalOpen(true)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium shadow transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Target</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {goals.map((g) => {
                  const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
                  return (
                    <div key={g.id} className={`p-5 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <PiggyBank className="w-5 h-5 text-indigo-500" />
                          <span className="font-bold text-sm">{g.title}</span>
                        </div>
                        <span className="text-xs text-slate-400">{g.deadline}</span>
                      </div>

                      <div className="my-3">
                        <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                          {formatCurrency(g.currentAmount, currency)}
                        </span>
                        <span className="text-xs text-slate-400 block mt-0.5">
                          Target: {formatCurrency(g.targetAmount, currency)}
                        </span>
                      </div>

                      <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-500 mt-2 block text-right">
                        {pct}% Tercapai
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ACCOUNTS MANAGEMENT */}
        {activeTab === 'accounts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Daftar Rekening & Dompet</h3>
                <p className="text-xs text-slate-400">Kelola rekening bank, cash, dan e-wallet Anda.</p>
              </div>
              <button
                onClick={() => {
                  setEditingAcc(null);
                  setAccForm({ name: '', type: 'Bank', balance: '', color: 'bg-blue-600' });
                  setIsAccModalOpen(true);
                }}
                className="flex items-center space-x-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium shadow transition"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Rekening</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {accounts.map((acc) => {
                const txCount = transactions.filter(t => t.accountId === acc.id).length;
                return (
                  <div key={acc.id} className={`p-5 rounded-2xl border shadow-sm relative overflow-hidden flex flex-col justify-between ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div className={`absolute top-0 left-0 right-0 h-1.5 ${acc.color || 'bg-blue-600'}`} />
                    
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300">
                          {acc.type}
                        </span>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleEditAccountClick(acc)}
                            className="p-1.5 text-slate-400 hover:text-indigo-500 rounded-lg transition"
                            title="Edit Rekening"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => promptDeleteAccount(acc.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition"
                            title="Hapus Rekening"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-bold text-base">{acc.name}</h4>
                      <p className="text-2xl font-extrabold mt-2 text-indigo-600 dark:text-indigo-400">
                        {formatCurrency(acc.balance, currency)}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                      <span>{txCount} Transaksi</span>
                      <span className="flex items-center">
                        <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Aktif
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: REPORTS & ANALYTICS */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className="font-bold text-lg mb-4">Laporan Arus Kas Bulanan</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#E2E8F0'} />
                    <XAxis dataKey="name" stroke={darkMode ? '#94A3B8' : '#64748B'} />
                    <YAxis stroke={darkMode ? '#94A3B8' : '#64748B'} />
                    <Tooltip formatter={(v) => formatCurrency(v, currency)} />
                    <Legend />
                    <Bar dataKey="Pemasukan" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Pengeluaran" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS & DANGER ZONE (RESET DATABASE) */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className={`p-6 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className="font-bold text-lg mb-2 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-indigo-500" /> Pengaturan Umum
              </h3>
              <p className="text-xs text-slate-400 mb-6">Atur preferensi aplikasi Anda di sini.</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <h4 className="font-semibold text-sm">Mode Tampilan</h4>
                    <p className="text-xs text-slate-400">Pilih antara mode terang dan mode gelap.</p>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition"
                  >
                    {darkMode ? 'Aktifkan Light Mode' : 'Aktifkan Dark Mode'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <h4 className="font-semibold text-sm">Mata Uang</h4>
                    <p className="text-xs text-slate-400">Ubah format mata uang tampilan secara global.</p>
                  </div>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className={`text-sm rounded-xl border px-3 py-2 outline-none ${
                      darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <option value="IDR">IDR (Rupiah)</option>
                    <option value="USD">USD (Dolar US)</option>
                    <option value="EUR">EUR (Euro)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="p-6 rounded-2xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/10">
              <div className="flex items-center space-x-3 mb-3">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
                <h3 className="font-bold text-lg text-rose-600 dark:text-rose-400">Zona Bahaya (Reset Database)</h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Kembalikan seluruh aplikasi ke kondisi awal sampel bawaan atau hapus seluruh data secara permanen dari browser.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setIsResetModalOpen(true)}
                  className="flex items-center justify-center space-x-2 px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition shadow-lg shadow-rose-600/30 text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Seluruh Data Aplikasi</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODAL: DELETE CONFIRMATION (SINGLE & BULK) */}
      {deleteConfirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-sm p-6 rounded-2xl shadow-xl ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
            <div className="flex items-center space-x-3 text-rose-500 mb-4">
              <div className="p-3 bg-rose-500/10 rounded-xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">
                {deleteConfirmModal.type === 'single' ? 'Hapus Transaksi?' : 'Hapus Transaksi Massal?'}
              </h3>
            </div>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              {deleteConfirmModal.type === 'single' 
                ? 'Apakah Anda yakin ingin menghapus transaksi ini? Saldo rekening Anda akan otomatis disesuaikan.' 
                : `Apakah Anda yakin ingin menghapus ${selectedTxIds.length} transaksi terpilih? Tindakan ini tidak dapat dibatalkan.`}
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteConfirmModal({ isOpen: false, type: null, targetId: null })}
                className="w-1/2 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition shadow"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: FACTORY RESET CONFIRMATION */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-md p-6 rounded-2xl shadow-xl ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
            <div className="flex items-center space-x-3 text-rose-500 mb-4">
              <div className="p-3 bg-rose-500/10 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">Reset Seluruh Data Aplikasi</h3>
            </div>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Pilih tindakan reset yang ingin Anda lakukan. Semua data disimpan secara lokal di browser Anda.
            </p>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleFactoryReset('sample')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-sm transition"
              >
                <span>Reset ke Data Sampel Awal</span>
                <RotateCcw className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => handleFactoryReset('clean')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold text-sm transition"
              >
                <span>Bersihkan Total (Kosongkan Semua Data)</span>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setIsResetModalOpen(false)}
              className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              Batal
            </button>
          </div>
        </div>
      )}
      {/* MODAL: CONFIRM DELETE ACCOUNT */}
      {deleteAccModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-sm p-6 rounded-2xl shadow-xl ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
            <div className="flex items-center space-x-3 text-rose-500 mb-4">
              <div className="p-3 bg-rose-500/10 rounded-xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">Hapus Rekening?</h3>
            </div>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Apakah Anda yakin ingin menghapus rekening ini? Seluruh transaksi yang terhubung dengan rekening ini juga akan ikut terhapus.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteAccModal({ isOpen: false, targetId: null })}
                className="w-1/2 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                Batal
              </button>
              <button
                onClick={executeDeleteAccount}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition shadow"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT ACCOUNT */}
      {isAccModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-md p-6 rounded-2xl shadow-xl ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">{editingAcc ? 'Edit Rekening / Dompet' : 'Tambah Rekening / Dompet'}</h3>
              <button onClick={() => { setIsAccModalOpen(false); setEditingAcc(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAccount} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400">Nama Rekening / Akun</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bank Mandiri / GoPay"
                  value={accForm.name}
                  onChange={(e) => setAccForm({ ...accForm, name: e.target.value })}
                  className={`w-full mt-1 p-2.5 rounded-xl border outline-none text-sm ${
                    darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Jenis Akun</label>
                <select
                  value={accForm.type}
                  onChange={(e) => setAccForm({ ...accForm, type: e.target.value })}
                  className={`w-full mt-1 p-2.5 rounded-xl border outline-none text-sm ${
                    darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-300'
                  }`}
                >
                  <option value="Bank">Bank</option>
                  <option value="E-Wallet">E-Wallet</option>
                  <option value="Cash">Cash / Tunai</option>
                  <option value="Investment">Investasi</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Saldo Rekening</label>
                <input
                  type="number"
                  required
                  placeholder="0"
                  value={accForm.balance}
                  onChange={(e) => setAccForm({ ...accForm, balance: e.target.value })}
                  className={`w-full mt-1 p-2.5 rounded-xl border outline-none text-sm ${
                    darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Warna Tema Rekening</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setAccForm({ ...accForm, color: c.value })}
                      className={`w-8 h-8 rounded-full ${c.value} flex items-center justify-center text-white transition transform ${
                        accForm.color === c.value ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'opacity-80'
                      }`}
                    >
                      {accForm.color === c.value && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-600/30 mt-2"
              >
                {editingAcc ? 'Simpan Perubahan' : 'Tambah Rekening'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD ACCOUNT */}
      {isAccModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-md p-6 rounded-2xl shadow-xl ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Tambah Rekening / Dompet</h3>
              <button onClick={() => setIsAccModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAccount} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400">Nama Rekening / Akun</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bank Mandiri"
                  value={accForm.name}
                  onChange={(e) => setAccForm({ ...accForm, name: e.target.value })}
                  className={`w-full mt-1 p-2.5 rounded-xl border outline-none text-sm ${
                    darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Jenis Akun</label>
                <select
                  value={accForm.type}
                  onChange={(e) => setAccForm({ ...accForm, type: e.target.value })}
                  className={`w-full mt-1 p-2.5 rounded-xl border outline-none text-sm ${
                    darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-300'
                  }`}
                >
                  <option value="Bank">Bank</option>
                  <option value="E-Wallet">E-Wallet</option>
                  <option value="Cash">Cash / Tunai</option>
                  <option value="Investment">Investasi</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Saldo Awal</label>
                <input
                  type="number"
                  required
                  placeholder="0"
                  value={accForm.balance}
                  onChange={(e) => setAccForm({ ...accForm, balance: e.target.value })}
                  className={`w-full mt-1 p-2.5 rounded-xl border outline-none text-sm ${
                    darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-600/30 mt-2"
              >
                Tambah Rekening
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD GOAL */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-md p-6 rounded-2xl shadow-xl ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Tambah Target Tabungan</h3>
              <button onClick={() => setIsGoalModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400">Nama Target</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Beli Motor"
                  value={goalForm.title}
                  onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                  className={`w-full mt-1 p-2.5 rounded-xl border outline-none text-sm ${
                    darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400">Target Nominal</label>
                  <input
                    type="number"
                    required
                    placeholder="0"
                    value={goalForm.targetAmount}
                    onChange={(e) => setGoalForm({ ...goalForm, targetAmount: e.target.value })}
                    className={`w-full mt-1 p-2.5 rounded-xl border outline-none text-sm ${
                      darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400">Terkumpul Saat Ini</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={goalForm.currentAmount}
                    onChange={(e) => setGoalForm({ ...goalForm, currentAmount: e.target.value })}
                    className={`w-full mt-1 p-2.5 rounded-xl border outline-none text-sm ${
                      darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Tenggat Waktu (Deadline)</label>
                <input
                  type="date"
                  required
                  value={goalForm.deadline}
                  onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })}
                  className={`w-full mt-1 p-2.5 rounded-xl border outline-none text-sm ${
                    darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-600/30 mt-2"
              >
                Tambah Target Tabungan
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}