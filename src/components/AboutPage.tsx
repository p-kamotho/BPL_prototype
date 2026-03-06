import React from 'react';
import { Trophy, Users, Target, Globe, CheckCircle, ArrowRight, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface AboutPageProps {
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

export default function AboutPage({ onBack, onNavigate }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={onBack}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center text-slate-900 shadow-lg shadow-emerald-400/30">
              <Trophy size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="font-bold text-white leading-tight text-sm sm:text-base">Badminton Kenya</h1>
              <p className="text-[8px] sm:text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Pro Platform</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-8">
            <a href="#" onClick={(e) => { e.preventDefault(); onBack?.(); }} className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">Home</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate?.('contact'); }} className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">Contact</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate?.('blog'); }} className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">Blog</a>
          </div>
          <div>
            <button 
              onClick={onBack}
              className="text-white hover:text-emerald-400 font-bold transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6">About Badminton Kenya</h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              We're building Africa's most trusted badminton tournament platform, connecting players, clubs, and counties through transparency and innovation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <Target size={24} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Mission</h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                To democratize professional badminton in Kenya by providing tournament organizers and players with transparent, fair, and innovative tools that eliminate barriers and build trust across all levels of competition.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center mb-6">
                <Globe size={24} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Vision</h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                To create a unified national badminton ecosystem where every player, regardless of location or club size, can compete fairly, track their progress, and achieve their dreams on a world-class platform.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 text-center mb-16">Our Core Values</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: 'Transparency', desc: 'Every decision visible, every rule clear' },
              { title: 'Fairness', desc: 'Equal opportunity for all players' },
              { title: 'Innovation', desc: 'Technology that serves the sport' },
              { title: 'Community', desc: 'Built by players, for players' }
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 text-center hover:shadow-lg transition-all"
              >
                <h3 className="font-bold text-slate-900 mb-2 text-lg">{value.title}</h3>
                <p className="text-slate-600 text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-8">Our Story</h2>
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
              <p>
                Badminton Kenya was born from a simple observation: the sport we love deserved better. For years, tournament organizers struggled with manual bracket management, players waited days for results, and controversies arose from lack of transparency.
              </p>
              <p>
                In 2024, a small team of badminton enthusiasts and software engineers came together with a mission: to build a digital platform that would transform how badminton tournaments are organized and experienced across Kenya.
              </p>
              <p>
                Today, we're proud to power tournaments for over 500 clubs, organize matches for thousands of players, and maintain the most comprehensive badminton rankings in East Africa.
              </p>
              <p>
                But our journey is just beginning. We're committed to continuously innovating, expanding our platform, and working with the national federation to build a badminton ecosystem that the world looks up to.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 text-center mb-16">Built by Startech Group Solutions</h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-slate-200 p-8 text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
              SG
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Startech Group Solutions</h3>
            <p className="text-slate-600 mb-6">
              A team of passionate technologists, badminton enthusiasts, and innovation experts dedicated to transforming African sports through technology.
            </p>
            <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold">
              Learn more <ChevronRight size={18} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center text-slate-900">
                  <Trophy size={18} />
                </div>
                <span className="font-bold text-white">Badminton Kenya</span>
              </div>
              <p className="text-sm text-slate-400">Professional badminton tournaments, simplified.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Tournaments</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Rankings</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Players</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">© 2026 Badminton Kenya. Built for champions, by the community.</p>
            <p className="text-sm text-slate-500">Created by <span className="text-cyan-400 font-semibold">Startech Group Solutions</span></p>
            <div className="flex gap-6 text-slate-400">
              <a href="#" className="hover:text-emerald-400 transition-colors text-sm">Twitter</a>
              <a href="#" className="hover:text-emerald-400 transition-colors text-sm">Instagram</a>
              <a href="#" className="hover:text-emerald-400 transition-colors text-sm">Facebook</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
