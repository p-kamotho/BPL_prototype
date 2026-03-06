import React from 'react';
import { Trophy, Shield, Zap, BarChart3, ChevronRight, ArrowRight, Users, Flame, Award, Target, Wind, Globe } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onNavigate?: (page: 'about' | 'contact' | 'blog') => void;
}

export default function LandingPage({ onGetStarted, onLogin, onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center text-slate-900 shadow-lg shadow-emerald-400/30">
              <Trophy size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="font-bold text-white leading-tight text-sm sm:text-base">Badminton Kenya</h1>
              <p className="text-[8px] sm:text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Pro Platform</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-8">
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate?.('about'); }} className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">About</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate?.('contact'); }} className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">Contact</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate?.('blog'); }} className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">Blog</a>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={onLogin}
              className="text-xs sm:text-sm font-bold text-slate-300 hover:text-white px-2 sm:px-4 py-2"
            >
              Login
            </button>
            <button 
              onClick={onGetStarted}
              className="bg-emerald-500 text-slate-900 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/30"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50/10 text-emerald-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-8 border border-emerald-500/30 backdrop-blur-sm">
                <Flame size={16} />
                <span>Next Generation Tournament Platform</span>
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1] sm:leading-[0.9] mb-8 sm:mb-10">
                <span className="text-white">Smash, Serve, Score —</span> <br />
                <span className="text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text">Your Game, Your Court.</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 mb-10 sm:mb-12 max-w-lg leading-relaxed">
                Professional badminton tournaments made simple. Register instantly, compete fairly, and rise through the ranks with Kenya's most trusted platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={onGetStarted}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-2xl font-bold text-lg shadow-2xl shadow-emerald-500/40 transition-all hover:shadow-emerald-500/60 flex items-center justify-center gap-2"
                >
                  Register Now <ArrowRight size={22} />
                </button>
                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-lg transition-all border border-white/20 backdrop-blur-sm flex items-center justify-center gap-2">
                  Watch Demo <ChevronRight size={22} />
                </button>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square rounded-[40px] bg-slate-700 overflow-hidden relative shadow-2xl border border-slate-600">
                <img 
                  src="https://picsum.photos/seed/badminton-player/800/800" 
                  alt="Lee Zee Jia - Badminton Champion" 
                  className="object-cover w-full h-full"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 glass backdrop-blur-xl bg-slate-900/40 border border-white/10 p-6 rounded-3xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Live Tournament</span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-rose-400 animate-pulse">
                      <span className="w-2.5 h-2.5 bg-rose-400 rounded-full"></span> LIVE
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-center flex-1">
                      <p className="text-xs font-bold text-slate-300 uppercase">Alex</p>
                      <p className="text-3xl font-black text-white">21</p>
                    </div>
                    <div className="text-slate-400 font-bold text-sm">VS</div>
                    <div className="text-center flex-1">
                      <p className="text-xs font-bold text-slate-300 uppercase">Jordan</p>
                      <p className="text-3xl font-black text-white">18</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/30 rounded-full -z-10 blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-cyan-500/20 rounded-full -z-10 blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tournament Showcase Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Featured Tournaments</h2>
            <p className="text-slate-300 text-lg">See where the action is happening across Kenya</p>
          </div>

          {/* Completed Tournaments */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-emerald-400 mb-6 flex items-center gap-2">
              <Trophy size={24} /> Recently Completed
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { name: 'Kenya Open Championship', location: 'Nairobi', participants: 128, winner: 'Victor Kipchoge', status: 'completed' },
                { name: 'East Africa Regional Cup', location: 'Mombasa', participants: 96, winner: 'Sarah Mwangi', status: 'completed' }
              ].map((tournament, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-700/50 border border-slate-600 rounded-2xl p-6 hover:border-emerald-400/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">✓ Completed</p>
                      <h4 className="text-xl font-bold text-white">{tournament.name}</h4>
                    </div>
                    <Award className="text-amber-400" size={24} />
                  </div>
                  <div className="space-y-2 text-sm text-slate-300">
                    <p>📍 {tournament.location}</p>
                    <p>👥 {tournament.participants} Players</p>
                    <p>🏆 Winner: <span className="text-emerald-400 font-semibold">{tournament.winner}</span></p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Live Tournament */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-rose-400 mb-6 flex items-center gap-2">
              <Flame size={24} /> Live Now
            </h3>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-rose-900/20 to-orange-900/20 border border-rose-500/50 rounded-2xl p-8 relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-sm font-bold text-rose-400 animate-pulse">
                  <span className="w-3 h-3 bg-rose-400 rounded-full"></span> LIVE
                </span>
              </div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-xs text-rose-400 font-bold uppercase tracking-wider mb-2">🔴 In Progress</p>
                  <h4 className="text-2xl font-bold text-white">Nairobi Badminton Masters 2026</h4>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-slate-300 text-xs uppercase tracking-wider mb-4">Current Match</p>
                  <div className="flex items-center justify-between bg-slate-700/70 rounded-xl p-4 mb-4">
                    <div className="text-center">
                      <p className="text-slate-300 text-xs mb-1">Alex Johnson</p>
                      <p className="text-3xl font-black text-emerald-400">21</p>
                    </div>
                    <div className="text-slate-400 font-bold">VS</div>
                    <div className="text-center">
                      <p className="text-slate-300 text-xs mb-1">Jordan Smith</p>
                      <p className="text-3xl font-black text-slate-300">18</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-slate-300 text-sm">
                  <p>📍 Nairobi Sports Arena</p>
                  <p>👥 64 Participants</p>
                  <p>⏱️ Round: Quarter-Finals</p>
                  <p className="pt-2 text-emerald-400">→ Next match in 15 mins</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Upcoming Tournaments */}
          <div>
            <h3 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
              <Zap size={24} /> Upcoming Events
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: 'West Kenya League', date: 'Mar 15 - Mar 20', location: 'Kisumu', status: 'open' },
                { name: 'Central Region U19', date: 'Mar 22 - Mar 24', location: 'Murang\'a', status: 'open' },
                { name: 'Coast Championship', date: 'Mar 28 - Apr 02', location: 'Mombasa', status: 'open' },
                { name: 'Northern Kenya Cup', date: 'Apr 05 - Apr 10', location: 'Nakuru', status: 'coming' },
                { name: 'Rift Valley Masters', date: 'Apr 12 - Apr 17', location: 'Nakuru', status: 'coming' },
                { name: 'National Finals', date: 'May 01 - May 10', location: 'Nairobi', status: 'coming' }
              ].map((tournament, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i % 3) * 0.1 }}
                  className="bg-slate-700/50 border border-slate-600 rounded-xl p-4 hover:border-cyan-400/50 transition-all group cursor-pointer"
                >
                  <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${tournament.status === 'open' ? 'text-cyan-400' : 'text-slate-400'}`}>
                    {tournament.status === 'open' ? '📅 Registration Open' : '⏳ Coming Soon'}
                  </p>
                  <h4 className="font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{tournament.name}</h4>
                  <div className="space-y-1 text-xs text-slate-300">
                    <p>📅 {tournament.date}</p>
                    <p>📍 {tournament.location}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">Trusted by Thousands of Players</h2>
            <p className="text-slate-500 text-lg">Join thousands of athletes competing on Africa's leading badminton platform</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { name: 'Victor', role: 'Pro Player', testimonial: 'The platform made tournament registration seamless. Love the real-time rankings!' },
              { name: 'Sarah', role: 'Club Manager', testimonial: 'Managing our club tournaments is now effortless. Best investment we made.' },
              { name: 'James', role: 'Referee', testimonial: 'Score submission is instant and accurate. The system is incredibly user-friendly.' }
            ].map((player, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {player.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{player.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{player.role}</p>
                  </div>
                </div>
                <p className="text-slate-600 italic leading-relaxed">"{player.testimonial}"</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-amber-400">★</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 grayscale opacity-60 pt-12 border-t border-slate-200">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 w-full text-center mb-4">Featured in</p>
            {['Kenya Sports', 'Badminton Weekly', 'Digital Africa', 'Tech Innovation'].map((brand, i) => (
              <span key={i} className="font-black text-slate-400 text-sm">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Badminton Made Easy Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">Badminton Made Easy — For Every Player</h2>
            <p className="text-slate-600 text-lg">Whether you're a casual player or a pro, our platform adapts to your level</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { category: 'Individual Tournaments', icon: Users, description: 'Singles, doubles, and mixed competitions. Sign up, play, and climb the rankings.' },
              { category: 'Team Events', icon: Trophy, description: 'Club championships and inter-county leagues. Organize entire tournaments in minutes.' },
              { category: 'Live Scoring', icon: Flame, description: 'Real-time bracket updates and instant results. Everyone knows the standings.' },
              { category: 'Rankings & Stats', icon: BarChart3, description: 'Automated rating system. Track your progress across multiple tournaments.' }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-3xl border border-slate-200 hover:shadow-xl hover:border-emerald-400/50 transition-all group"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-2xl flex items-center justify-center text-emerald-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Icon size={32} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.category}</h3>
                      <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      

      {/* Features Grid */}
      <section id="features" className="py-20 sm:py-32 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6">Everything you need to run championship tournaments</h2>
            <p className="text-slate-600 text-lg leading-relaxed">From local club matches to national championships, our platform handles it all with transparency and ease.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'Instant Results', desc: 'Real-time score submission from referees. Brackets update automatically.' },
              { icon: Award, title: 'Fair Rankings', desc: 'Transparent point system. Everyone sees how ratings are calculated.' },
              { icon: Shield, title: 'Secure Payments', desc: 'Escrow system for tournament fees. Fair and transparent transactions.' },
              { icon: Target, title: 'Smart Seeding', desc: 'Algorithm-based player placement. Competitive and balanced matchups.' },
              { icon: Wind, title: 'Live Brackets', desc: 'Dynamic bracket updates. Winners advance automatically.' },
              { icon: Globe, title: 'Nationwide Coverage', desc: 'Connect with players across Kenya. Build the national community.' }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl border border-slate-200 hover:border-emerald-400/50 hover:shadow-xl transition-all group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-cyan-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Join Premier Tournaments CTA */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2"></div>
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 leading-tight">
              Join Premier Badminton Tournaments
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Register for upcoming tournaments, compete with players nationwide, and earn rankings that matter. The future of badminton starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={onGetStarted}
                className="px-8 py-4 bg-white text-emerald-600 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all shadow-2xl flex items-center justify-center gap-2 group"
              >
                Find Tournaments <ArrowRight className="group-hover:translate-x-1 transition-transform" size={22} />
              </button>
              <button className="px-8 py-4 bg-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white/30 transition-all border border-white/30 backdrop-blur-sm flex items-center justify-center gap-2">
                View Upcoming Events <ChevronRight size={22} />
              </button>
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
