import React, { useState } from 'react';
import { Trophy, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface LandingNavbarProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

export default function LandingNavbar({ onGetStarted, onLogin, onNavigate, currentPage }: LandingNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'activities', label: 'Activities' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate?.('home')}
            className="flex items-center gap-3 hover:opacity-80 transition"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold">
              <Trophy size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900 dark:text-white">Badminton Kenya</h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-widest">OS</p>
            </div>
          </button>

          {/* Nav Items */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate?.(item.id)}
                className={`font-semibold transition-colors text-sm ${
                  currentPage === item.id
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <button
              onClick={onLogin}
              className="hidden sm:block px-4 py-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg font-semibold transition text-sm"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="hidden sm:block px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition shadow-lg text-sm"
            >
              Get Started
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700 py-4 bg-white dark:bg-slate-800">
            <div className="flex flex-col gap-3 px-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate?.(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`font-semibold transition-colors text-left py-2 ${
                    currentPage === item.id
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex flex-col gap-2">
                <button
                  onClick={() => {
                    onLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg font-semibold transition text-sm"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onGetStarted();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition text-sm"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
