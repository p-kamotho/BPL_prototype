import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Eye,
  Search,
  CheckCircle,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const REVENUE_BY_COUNTY = [
  { name: 'Nairobi', value: 450000 },
  { name: 'Mombasa', value: 280000 },
  { name: 'Kisumu', value: 150000 },
  { name: 'Nakuru', value: 120000 },
  { name: 'Kiambu', value: 200000 },
];

const REVENUE_TREND = [
  { month: 'Jan', revenue: 850000 },
  { month: 'Feb', revenue: 1200000 },
  { month: 'Mar', revenue: 950000 },
  { month: 'Apr', revenue: 1100000 },
  { month: 'May', revenue: 1400000 },
  { month: 'Jun', revenue: 1300000 },
];

const COLORS = ['#059669', '#2563eb', '#d97706', '#7c3aed', '#db2777'];

export default function FinancialOverview() {
  const [activeView, setActiveView] = useState<'overview' | 'transactions'>('overview');
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ description: '', amount: '', type: 'income' });
  const [transactions, setTransactions] = useState<any[]>([]);

  const handleAddTransaction = () => {
    if (!formData.description || !formData.amount) {
      setMessage({type: 'error', text: 'Please fill all required fields'});
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    const newTx = { id: Date.now(), ...formData, amount: parseFloat(formData.amount), date: new Date().toISOString().split('T')[0] };
    setTransactions([...transactions, newTx]);
    setFormData({ description: '', amount: '', type: 'income' });
    setShowForm(false);
    setMessage({type: 'success', text: 'Transaction added!'});
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteTransaction = (id: number) => {
    if (confirm('Delete this transaction?')) {
      setTransactions(transactions.filter(t => t.id !== id));
      setMessage({type: 'success', text: 'Transaction deleted!'});
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleExportReport = () => {
    const dataStr = JSON.stringify({stats, transactions, generatedAt: new Date().toISOString()}, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'financial-report.json';
    link.click();
    setMessage({type: 'success', text: 'Report exported!'});
    setTimeout(() => setMessage(null), 3000);
  };

  const stats = [
    { label: 'Total Revenue', value: 'KES 5.2M', trend: '+12.5%', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Hosting Fees', value: 'KES 840K', trend: '+4.2%', icon: MapPin, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Sponsorship', value: 'KES 1.8M', trend: '+18.1%', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Pending', value: 'KES 320K', trend: '-2.4%', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8">
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Financial Management</h2>
          <p className="text-slate-500">System-wide revenue, fees, and sponsorship tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-slate-200 rounded-xl p-1">
            <button 
              onClick={() => setActiveView('overview')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeView === 'overview' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveView('transactions')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeView === 'transactions' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Transactions
            </button>
          </div>
          <button onClick={handleExportReport} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      {activeView === 'transactions' && (
        <div className="space-y-4">
          {showForm && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Add Transaction</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
                  <input type="text" placeholder="Transaction description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Amount *</label>
                    <input type="number" placeholder="0" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                    <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500">
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => { setShowForm(false); setFormData({ description: '', amount: '', type: 'income' }); }} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                  <button onClick={handleAddTransaction} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">Add</button>
                </div>
              </div>
            </div>
          )}
          
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
            <Plus size={18} /> Add Transaction
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Transactions ({transactions.length})</h3>
            </div>
            <div className="divide-y divide-slate-200">
              {transactions.length > 0 ? transactions.map(tx => (
                <div key={tx.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{tx.description}</p>
                    <p className="text-sm text-slate-500">{tx.date} • {tx.type}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className={`font-bold text-lg ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>KES {Math.abs(tx.amount).toLocaleString()}</p>
                    <button onClick={() => handleDeleteTransaction(tx.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )) : <div className="p-6 text-center text-slate-500">No transactions yet</div>}
            </div>
          </div>
        </div>
      )}

      {activeView === 'overview' ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-bold ${stat.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                    {stat.trend}
                    {stat.trend.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue Trend */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue Trend (6 Months)</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={REVENUE_TREND}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `KES ${value/1000}K`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [`KES ${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#059669" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#059669', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revenue by County */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue by County</h3>
              <div className="h-80 w-full flex flex-col md:flex-row items-center">
                <div className="flex-1 h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={REVENUE_BY_COUNTY}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {REVENUE_BY_COUNTY.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-48 space-y-3 mt-4 md:mt-0">
                  {REVENUE_BY_COUNTY.map((entry, index) => (
                    <div key={entry.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-sm font-medium text-slate-600">{entry.name}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{(entry.value / 1000).toFixed(0)}K</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pending Actions & Sponsorship */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pending Payments & Refunds */}
            <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Pending Payments & Refunds</h3>
                <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full">8 Actions Required</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <th className="px-6 py-4">Entity / User</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { name: 'Nairobi Open 2026', type: 'Hosting Fee', amount: 'KES 45,000', status: 'Pending', color: 'text-amber-600', bg: 'bg-amber-50' },
                      { name: 'John Kamau', type: 'Refund Request', amount: 'KES 2,500', status: 'Reviewing', color: 'text-blue-600', bg: 'bg-blue-50' },
                      { name: 'Coast Badminton Club', type: 'Affiliation', amount: 'KES 15,000', status: 'Overdue', color: 'text-red-600', bg: 'bg-red-50' },
                      { name: 'Junior Nationals', type: 'Sponsorship', amount: 'KES 250,000', status: 'Processing', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    ].map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-900">{item.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium text-slate-500">{item.type}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-900">{item.amount}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${item.bg} ${item.color}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sponsorship Metrics */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-6">Sponsorship Visibility</h3>
              <div className="space-y-6">
                {[
                  { brand: 'Safaricom', impressions: '1.2M', clicks: '45K', value: 'KES 800K' },
                  { brand: 'KCB Bank', impressions: '850K', clicks: '28K', value: 'KES 500K' },
                  { brand: 'SportPesa', impressions: '2.1M', clicks: '92K', value: 'KES 1.5M' },
                ].map((sponsor) => (
                  <div key={sponsor.brand} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-900">{sponsor.brand}</span>
                      <span className="text-xs font-bold text-emerald-600">{sponsor.value}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-3 rounded-xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Impressions</p>
                        <p className="text-sm font-bold text-slate-700">{sponsor.impressions}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Engagement</p>
                        <p className="text-sm font-bold text-slate-700">{sponsor.clicks}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="w-full py-3 mt-4 border border-emerald-600 text-emerald-600 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-all">
                  Manage Sponsors
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h3 className="font-bold text-slate-900">All System Transactions</h3>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search transactions..." 
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500"
                />
              </div>
              <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600">
                <Filter size={18} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Entity</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { id: 'TXN-9021', date: '2026-02-25', entity: 'Nairobi Smashers', cat: 'Affiliation', amount: 'KES 15,000', method: 'M-PESA', status: 'Completed' },
                  { id: 'TXN-9022', date: '2026-02-25', entity: 'John Doe', cat: 'Entry Fee', amount: 'KES 2,500', method: 'Card', status: 'Completed' },
                  { id: 'TXN-9023', date: '2026-02-24', entity: 'Mombasa Shuttle', cat: 'Hosting Fee', amount: 'KES 45,000', method: 'Bank Transfer', status: 'Pending' },
                  { id: 'TXN-9024', date: '2026-02-24', entity: 'Safaricom', cat: 'Sponsorship', amount: 'KES 800,000', method: 'Bank Transfer', status: 'Completed' },
                  { id: 'TXN-9025', date: '2026-02-23', entity: 'Jane Smith', cat: 'Refund', amount: 'KES 1,200', method: 'M-PESA', status: 'Processing' },
                ].map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-slate-500">{txn.id}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{txn.date}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{txn.entity}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-500">{txn.cat}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{txn.amount}</td>
                    <td className="px-6 py-4 text-xs text-slate-400">{txn.method}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        txn.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                        txn.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="w-full py-4 bg-slate-50 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all">
            Load More Transactions
          </button>
        </div>
      )}
    </div>
  );
}
