import React from 'react';
import { 
  Trophy, 
  UserCircle, 
  LogOut,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'motion/react';
import { moduleRegistry } from '../permissions/registry';

// Helper to check if active role has permission
const hasPermission = (activeRole: any, permission?: string) => {
  if (!permission) return true;
  return activeRole?.permissions?.includes(permission);
};

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const { user, activeRole, setActiveRole, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  if (!user) return <>{children}</>;

  const filteredNavItems = moduleRegistry.filter(item => 
    hasPermission(activeRole, item.permission)
  );

  const approvedRoles = user.roles.filter(r => r.status === 'approved');

  const SidebarContent = () => {
    const sections = filteredNavItems.reduce((acc: any, item) => {
      const sectionName = item.section || 'General';
      if (!acc[sectionName]) acc[sectionName] = [];
      acc[sectionName].push(item);
      return acc;
    }, {});

    const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>(() => {
      const initial: Record<string, boolean> = {};
      Object.keys(sections).forEach(section => {
        // Sections that should be collapsed by default
        if (section === 'Operations' || section === 'System Infrastructure') {
          initial[section] = false;
        } else {
          initial[section] = true;
        }
      });
      return initial;
    });

    const toggleSection = (section: string) => {
      setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
      <div className="h-full flex flex-col bg-white">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <Trophy size={24} />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">Badminton</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Kenya OS</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Role Switcher */}
        {approvedRoles.length > 1 && (
          <div className="px-4 py-4 border-b border-slate-100">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Acting As</label>
            <div className="relative group">
              <button className="w-full flex items-center justify-between px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all">
                <span className="capitalize">{activeRole?.role_name.replace('_', ' ')}</span>
                <ChevronDown size={16} className="text-slate-400" />
              </button>
              <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                {approvedRoles.map(role => (
                  <button
                    key={role.id}
                    onClick={() => {
                      setActiveRole(role);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 transition-colors capitalize ${
                      activeRole?.id === role.id ? 'text-emerald-600 font-bold bg-emerald-50' : 'text-slate-600'
                    }`}
                  >
                    {role.role_name.replace('_', ' ')}
                    {role.scope_id && <span className="text-[10px] block opacity-50">{role.scope_type} {role.scope_id}</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {Object.entries(sections).map(([sectionName, items]: [string, any]) => {
            const isCollapsible = sectionName === 'Operations' || sectionName === 'System Infrastructure';
            const isExpanded = expandedSections[sectionName];

            return (
              <div key={sectionName} className="space-y-1">
                {sectionName !== 'General' && sectionName !== 'Overview' && (
                  <button 
                    onClick={() => isCollapsible && toggleSection(sectionName)}
                    className={`w-full flex items-center justify-between px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors ${isCollapsible ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <span>{sectionName}</span>
                    {isCollapsible && (
                      <ChevronDown 
                        size={12} 
                        className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                      />
                    )}
                  </button>
                )}
                
                <AnimatePresence initial={false}>
                  {(!isCollapsible || isExpanded) && (
                    <motion.div
                      initial={isCollapsible ? { height: 0, opacity: 0 } : false}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden space-y-1"
                    >
                      {items.map((item: any) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setIsSidebarOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                            activeTab === item.id
                              ? 'bg-emerald-50 text-emerald-700 font-medium'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <item.icon size={18} />
                          <span className="text-sm">{item.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 lg:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-base lg:text-lg font-semibold text-slate-800 capitalize truncate max-w-[150px] lg:max-w-none">
              {activeTab.replace('-', ' ')}
            </h2>
          </div>
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 truncate max-w-[120px]">{user.full_name}</p>
              <p className="text-[10px] lg:text-xs text-slate-500 capitalize truncate max-w-[120px]">
                {activeRole?.role_name.replace('_', ' ')} 
              </p>
            </div>
            <div className="w-9 h-9 lg:w-10 lg:h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 border border-slate-200 shrink-0">
              <UserCircle size={24} />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
