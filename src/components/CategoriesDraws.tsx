import React, { useState } from 'react'; 
import { 
  ClipboardList, 
  Plus, 
  Users, 
  Play, 
  Settings, 
  ChevronRight,
  Search,
  Filter,
  MoreVertical,
  LayoutGrid,
  List as ListIcon,
  AlertCircle,
  CheckCircle2,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Edit2,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Category {
  id: string;
  name: string;
  players: number;
  status: 'Draft' | 'Published' | 'Ongoing' | 'Completed';
  drawType: 'Knockout' | 'Round Robin' | 'Group + Knockout';
  seeds: number;
}

const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: "Men's Singles - Elite", players: 32, status: 'Ongoing', drawType: 'Knockout', seeds: 8 },
  { id: '2', name: "Women's Singles - Elite", players: 16, status: 'Published', drawType: 'Knockout', seeds: 4 },
  { id: '3', name: "Men's Doubles - Open", players: 24, status: 'Draft', drawType: 'Group + Knockout', seeds: 4 },
  { id: '4', name: "Mixed Doubles - U19", players: 12, status: 'Draft', drawType: 'Round Robin', seeds: 2 },
];

export default function CategoriesDraws() {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [formData, setFormData] = useState({ name: '', players: 0, status: 'Draft' as const, drawType: 'Knockout' as const, seeds: 0 });

  const handleAddCategory = () => {
    if (!formData.name.trim() || formData.players <= 0 || formData.seeds <= 0) {
      setMessage({ type: 'error', text: 'Please fill all fields correctly' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    setCategories([...categories, { id: Date.now().toString(), ...formData }]);
    setFormData({ name: '', players: 0, status: 'Draft', drawType: 'Knockout', seeds: 0 });
    setShowForm(false);
    setMessage({ type: 'success', text: 'Category added successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEditCategory = () => {
    if (!formData.name.trim() || formData.players <= 0 || formData.seeds <= 0) {
      setMessage({ type: 'error', text: 'Please fill all fields correctly' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    setCategories(categories.map(c => c.id === editingId ? { ...c, ...formData } : c));
    setFormData({ name: '', players: 0, status: 'Draft', drawType: 'Knockout', seeds: 0 });
    setEditingId(null);
    setShowForm(false);
    setMessage({ type: 'success', text: 'Category updated successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Delete this category?')) {
      setCategories(categories.filter(c => c.id !== id));
      setMessage({ type: 'success', text: 'Category deleted!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handlePublish = (id: string) => {
    setCategories(categories.map(c => c.id === id ? { ...c, status: 'Published' } : c));
    setMessage({ type: 'success', text: 'Category published!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEditClick = (category: Category) => {
    setFormData(category);
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', players: 0, status: 'Draft', drawType: 'Knockout', seeds: 0 });
  };

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

      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Categories & Draws</h2>
          <p className="text-slate-500">Manage tournament brackets, seeding, and category configurations</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-slate-200 rounded-xl p-1">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-100 text-emerald-600' : 'text-slate-400'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-100 text-emerald-600' : 'text-slate-400'}`}
            >
              <ListIcon size={18} />
            </button>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
            <Plus size={18} />
            Add Category
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h3 className="text-lg font-bold">{editingId ? 'Edit Category' : 'Add New Category'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Category Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="col-span-2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            <input type="number" placeholder="Players" value={formData.players} onChange={(e) => setFormData({...formData, players: parseInt(e.target.value) || 0})} className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            <input type="number" placeholder="Seeds" value={formData.seeds} onChange={(e) => setFormData({...formData, seeds: parseInt(e.target.value) || 0})} className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            <select value={formData.drawType} onChange={(e) => setFormData({...formData, drawType: e.target.value as any})} className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600">
              <option value="Knockout">Knockout</option>
              <option value="Round Robin">Round Robin</option>
              <option value="Group + Knockout">Group + Knockout</option>
            </select>
            <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})} className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600">
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={handleCancel} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">Cancel</button>
            <button onClick={editingId ? handleEditCategory : handleAddCategory} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">{editingId ? 'Update' : 'Add'}</button>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 outline-none transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          <Filter size={18} />
          Filter
        </button>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {(() => {
            const filteredCategories = categories.filter(c => 
              c.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            return filteredCategories.map((category) => (
              <motion.div 
                key={category.id}
                layoutId={category.id}
                onClick={() => setSelectedCategory(category)}
                className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <ClipboardList size={24} />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    category.status === 'Ongoing' ? 'bg-blue-50 text-blue-600' :
                    category.status === 'Published' ? 'bg-emerald-50 text-emerald-600' :
                    category.status === 'Completed' ? 'bg-slate-50 text-slate-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {category.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{category.name}</h3>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-slate-50 p-3 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Players</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Users size={14} className="text-slate-400" />
                      <span className="text-sm font-bold text-slate-700">{category.players}</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Draw Type</p>
                    <p className="text-sm font-bold text-slate-700 mt-1">{category.drawType}</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                    <Settings size={14} />
                    {category.seeds} Seeds
                  </div>
                  <div className="flex gap-1">
                    <button onClick={(e) => { e.stopPropagation(); handleEditClick(category); }} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"><Edit2 size={16} /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory(category.id); }} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                  </div>
                </div>
              </motion.div>
            ));
          })()}
        </div>
      ) : (
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Draw Type</th>
                <th className="px-6 py-4">Players</th>
                <th className="px-6 py-4">Seeds</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(() => {
                const filteredCategories = categories.filter(c => 
                  c.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
                return filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedCategory(category)}>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{category.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        category.status === 'Ongoing' ? 'bg-blue-50 text-blue-600' :
                        category.status === 'Published' ? 'bg-emerald-50 text-emerald-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        {category.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-500">{category.drawType}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-700">{category.players}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-700">{category.seeds}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        {category.status === 'Draft' && <button onClick={(e) => { e.stopPropagation(); handlePublish(category.id); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded">Publish</button>}
                        <button onClick={(e) => { e.stopPropagation(); handleEditClick(category); }} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded"><Edit2 size={18} /></button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory(category.id); }} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      )}

      {/* Category Detail Modal (Simplified for demo) */}
      <AnimatePresence>
        {selectedCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-emerald-600 text-white">
                <div>
                  <h3 className="text-2xl font-bold">{selectedCategory.name}</h3>
                  <p className="text-emerald-100 text-sm">Draw Management & Seeding</p>
                </div>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    {/* Draw Visualization Placeholder */}
                    <div className="bg-slate-50 rounded-[32px] border border-slate-200 p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mb-4 border border-slate-200">
                        <Play size={32} />
                      </div>
                      <h4 className="font-bold text-slate-900 mb-2">Interactive Bracket View</h4>
                      <p className="text-sm text-slate-500 max-w-xs">Visual draw representation would be rendered here, allowing for drag-and-drop seed adjustments.</p>
                      <button className="mt-6 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all">
                        Generate Bracket
                      </button>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-900">Recent Match Assignments</h4>
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 font-bold text-xs">M{i}</div>
                              <div>
                                <p className="text-sm font-bold text-slate-900">Player A vs Player B</p>
                                <p className="text-[10px] text-slate-500">Round of 32 • Court {i}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase">Scheduled</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-4">Category Settings</h4>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Draw Type</label>
                          <select className="w-full px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm outline-none">
                            <option>Knockout</option>
                            <option>Round Robin</option>
                            <option>Group + Knockout</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Number of Seeds</label>
                          <input type="number" defaultValue={selectedCategory.seeds} className="w-full px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm outline-none" />
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-sm font-medium text-slate-600">Auto-Schedule</span>
                          <label className="relative inline-flex items-center cursor-pointer scale-75">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 p-6 rounded-[32px] border border-amber-100">
                      <div className="flex items-center gap-2 mb-2 text-amber-700">
                        <AlertCircle size={18} />
                        <h4 className="font-bold text-sm">Validation Warning</h4>
                      </div>
                      <p className="text-xs text-amber-600 leading-relaxed">
                        3 players in this category are currently unseeded despite having national rankings in the top 10.
                      </p>
                      <button className="w-full mt-4 py-2 bg-amber-600 text-white rounded-xl font-bold text-xs hover:bg-amber-700 transition-all">
                        Fix Seeding
                      </button>
                    </div>

                    <button className="w-full py-4 bg-slate-900 text-white rounded-[24px] font-bold text-sm shadow-xl hover:bg-slate-800 transition-all">
                      Publish Draws
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
