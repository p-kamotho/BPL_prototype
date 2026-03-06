import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar, CreditCard, Receipt, AlertCircle, CheckCircle, AlertTriangle, Plus, Trash2, Edit2 } from 'lucide-react';

export default function ClubFinancialOverview() {
  const [transactions, setTransactions] = useState([
    { id: 1, description: 'Tournament Registration Fee', amount: 15000, type: 'income', date: '2024-01-15' },
    { id: 2, description: 'Equipment Purchase', amount: -25000, type: 'expense', date: '2024-01-12' },
    { id: 3, description: 'Membership Fees', amount: 8000, type: 'income', date: '2024-01-10' },
    { id: 4, description: 'Court Rental', amount: -12000, type: 'expense', date: '2024-01-08' },
  ]);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ description: '', amount: 0, type: 'income' as const });

  const handleAddTransaction = () => {
    if (!formData.description.trim() || formData.amount === 0) {
      setMessage({ type: 'error', text: 'Please fill all fields' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    const newAmount = formData.type === 'expense' ? -formData.amount : formData.amount;
    setTransactions([...transactions, { id: Date.now(), description: formData.description, amount: newAmount, type: formData.type, date: new Date().toISOString().split('T')[0] }]);
    setFormData({ description: '', amount: 0, type: 'income' });
    setShowForm(false);
    setMessage({ type: 'success', text: 'Transaction added!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteTransaction = (id: number) => {
    if (confirm('Delete this transaction?')) {
      setTransactions(transactions.filter(t => t.id !== id));
      setMessage({ type: 'success', text: 'Transaction deleted!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const totalRevenue = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Financial Overview</h1>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
          <Plus size={18} />
          Add Transaction
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h3 className="text-lg font-bold">Add Transaction</h3>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="col-span-2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            <input type="number" placeholder="Amount" value={formData.amount || ''} onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})} className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value as any})} className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">Cancel</button>
            <button onClick={handleAddTransaction} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Add</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Revenue</p>
              <p className="text-2xl font-bold text-emerald-600">KES {totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">KES {totalExpenses.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Net Profit</p>
              <p className="text-2xl font-bold text-blue-600">KES {netProfit.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trend Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Monthly Financial Trend</h3>
        <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-500">Chart visualization would be implemented here</p>
            <p className="text-sm text-slate-400 mt-1">Revenue vs Expenses over time</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {transactions.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center`}>
                    {transaction.type === 'income' ? (
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{transaction.description}</p>
                    <p className="text-sm text-slate-500">{transaction.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className={`font-semibold ${
                    transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : ''}KES {Math.abs(transaction.amount).toLocaleString()}
                  </p>
                  <button onClick={() => handleDeleteTransaction(transaction.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Outstanding Payments */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Outstanding Payments</h3>
          <div className="space-y-4">
            {transactions.filter(t => t.type === 'expense').length > 0 ? (
              transactions.filter(t => t.type === 'expense').map(payment => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{payment.description}</p>
                      <p className="text-sm text-slate-500">Date: {payment.date}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-yellow-700">KES {Math.abs(payment.amount).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-500">No outstanding payments</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-center">
            <Receipt className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-900">Record Income</p>
          </button>
          <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-center">
            <CreditCard className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-900">Record Expense</p>
          </button>
          <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-center">
            <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-900">Schedule Payment</p>
          </button>
          <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-center">
            <DollarSign className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-900">Budget Planning</p>
          </button>
        </div>
      </div>
    </div>
  );
}