import React from 'react';

export default function LandingFooter() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          <div>
            <h4 className="font-bold text-white mb-4">About</h4>
            <p className="text-sm">The official tournament management platform for Badminton Kenya</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Features</h4>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="hover:text-white transition">Tournaments</a></li>
              <li><a href="#" className="hover:text-white transition">Players</a></li>
              <li><a href="#" className="hover:text-white transition">Analytics</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Support</h4>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="hover:text-white transition">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="hover:text-white transition">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm border-t border-slate-800 pt-8">
          <p className="mb-2">&copy; 2026 Badminton Kenya OS. All rights reserved.</p>
          <p className="text-emerald-500">
            Created and maintained by <a href="#" className="hover:text-emerald-400 font-semibold transition">StarTech Group Solutions</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
