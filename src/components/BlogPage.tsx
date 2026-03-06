import React, { useState } from 'react';
import { Trophy, Calendar, User, ArrowRight, Search } from 'lucide-react';
import { motion } from 'motion/react';

interface BlogPageProps {
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

export default function BlogPage({ onBack, onNavigate }: BlogPageProps) {
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const blogPosts = [
    {
      id: 1,
      title: "How Transparent Scoring is Changing Kenya's Badminton Scene",
      author: 'Jane Kipchoge',
      date: '2026-03-01',
      category: 'Features',
      excerpt: 'Discover how real-time scoring updates are revolutionizing tournament management and player experience.',
      content: 'Transparent scoring has been a game-changer for Kenyan badminton. By implementing real-time updates through our platform, we\'ve eliminated controversies and built trust among players, organizers, and fans. This shift towards transparency is not just about technology—it\'s about respecting the sport and the athletes who dedicate their lives to it.\n\nTournament organizers have reported 40% faster tournament completions, while player engagement has increased by 60%. The data speaks for itself.'
    },
    {
      id: 2,
      title: "From Local Clubs to National Rankings: The Lee Zee Jia Story",
      author: 'David Mwangi',
      date: '2026-02-28',
      category: 'Profiles',
      excerpt: 'An exclusive interview with Kenya\'s rising badminton star about his journey through regional tournaments.',
      content: 'Lee Zee Jia\'s rise through the ranks is nothing short of inspiring. What started as a passion at his local Nairobi club transformed into a professional career spanning the East African circuit. His consistent performance across multiple tournament categories has earned him a top 3 national ranking.\n\n"The platform made it easier to find tournaments and compete fairly," Lee mentions. "Knowing that rankings are calculated transparently gives me confidence to pursue my dreams." His story is one of many that showcases the power of organized, transparent competition.'
    },
    {
      id: 3,
      title: "5 Tips for Tournament Organizers to Maximize Engagement",
      author: 'Sarah Kiplagat',
      date: '2026-02-25',
      category: 'Guides',
      excerpt: 'Learn proven strategies to attract more players and create memorable tournament experiences.',
      content: 'As a tournament organizer, you want your events to stand out. Here are 5 proven strategies:\n\n1. **Early Registration Incentives**: Offer discounted fees for early registrations to build momentum.\n2. **Live Updates**: Keep spectators engaged with real-time bracket updates and match notifications.\n3. **Player Testimonials**: Share success stories and rankings improvements from past participants.\n4. **Social Media Engagement**: Create tournaments hashtags and encourage participants to share their experiences.\n5. **Fair Seeding**: Use data-driven seeding to ensure exciting matchups that keep audiences engaged.\n\nOur platform handles most of these elements automatically, allowing you to focus on creating great tournaments.'
    },
    {
      id: 4,
      title: "The Future of African Badminton: Interview with the Federation President",
      author: 'Peter Ochieng',
      date: '2026-02-20',
      category: 'News',
      excerpt: 'What\'s next for badminton in Kenya? We sit down with federation leadership for exclusive insights.',
      content: 'In an exclusive interview, the Badminton Federation President shares his vision for the sport in Kenya and beyond. "We\'re at an inflection point," he states. "With platforms like Badminton Kenya providing transparency and accessibility, we have the tools to grow the sport exponentially."\n\nKey initiatives include expanding tournaments to underserved regions, implementing coaching academies, and creating a clear pathway for young players to reach the national team. The federation is committed to making badminton Kenya\'s sport of choice.'
    },
    {
      id: 5,
      title: "Understanding Badminton Ratings: A Complete Guide",
      author: 'Michael Kipchoge',
      date: '2026-02-15',
      category: 'Guides',
      excerpt: 'Demystify the rating calculation system and understand how wins and losses affect your ranking.',
      content: 'Our rating system is based on the ELO model, adapted for badminton tournaments. Here\'s how it works:\n\n**Base Points**: You earn points based on tournament tier (1-5 stars).\n**Opponent Strength**: Beating higher-rated players earns more points.\n**Performance Multiplier**: Winning all matches in a tournament awards bonus points.\n**Decay Factor**: Inactive players see gradual rating decay to maintain fresh rankings.\n\nThe system incentivizes consistent participation and performance at higher tournament levels. Understanding these mechanics helps you strategize your tournament participation for maximum rating growth.'
    },
    {
      id: 6,
      title: "Badminton Technique: Perfecting Your Smash Shot",
      author: 'Maria Kiplagat',
      date: '2026-02-10',
      category: 'Technique',
      excerpt: 'Master the most powerful shot in badminton with our step-by-step guide and expert tips.',
      content: 'The smash shot is every badminton player\'s favorite attacking weapon. Here\'s how to execute it perfectly:\n\n**Positioning**: Move to court center, keeping your eyes on the shuttle.\n**Footwork**: Step back and to the side to create power.\n**Grip**: Hold the racket with a firm but relaxed grip.\n**Swing**: In one fluid motion, bring your racket back and overhead.\n**Contact**: Strike the shuttle at its highest point, just in front of your body.\n**Follow Through**: Complete your swing across your body.\n\nPractice this shot regularly, and you\'ll develop the consistency needed to dominate matches.'
    }
  ];

  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedPost !== null) {
    const post = blogPosts.find(p => p.id === selectedPost);
    if (!post) return null;

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
            <button 
              onClick={() => setSelectedPost(null)}
              className="text-white hover:text-emerald-400 font-bold transition-colors"
            >
              ← Back to Blog
            </button>
          </div>
        </nav>

        {/* Article Content */}
        <article className="pt-32 pb-16 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold mb-4">
                {post.category}
              </span>
              <h1 className="text-5xl font-extrabold text-slate-900 mb-6">{post.title}</h1>
              
              <div className="flex items-center gap-6 text-slate-600 mb-8 pb-8 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <User size={18} />
                  <span className="font-semibold">{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                {post.content.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-slate-600 text-lg leading-relaxed mb-6">
                    {paragraph.split('\n').map((line, j) => (
                      <span key={j}>
                        {line.match(/\*\*(.*?)\*\*/) ? (
                          <>
                            {line.split(/(\*\*.*?\*\*)/).map((part, k) => 
                              part.match(/\*\*(.*?)\*\*/) ? (
                                <strong key={k}>{part.replace(/\*\*/g, '')}</strong>
                              ) : (
                                part
                              )
                            )}
                          </>
                        ) : (
                          line
                        )}
                        {j < line.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                ))}
              </div>
            </motion.div>
          </div>
        </article>

        {/* Footer */}
        <footer className="py-16 px-4 sm:px-6 bg-slate-900 border-t border-slate-800">
          <div className="max-w-7xl mx-auto">
            <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-slate-400">© 2026 Badminton Kenya. Built for champions, by the community.</p>
              <p className="text-sm text-slate-500">Created by <span className="text-cyan-400 font-semibold">Startech Group Solutions</span></p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

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
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate?.('about'); }} className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">About</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate?.('contact'); }} className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">Contact</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onBack?.(); }} className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">Home</a>
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
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6">Badminton Insights & Stories</h1>
            <p className="text-xl text-slate-300">Expert tips, player profiles, and industry news all in one place</p>
          </motion.div>
        </div>
      </section>

      {/* Search */}
      <section className="py-8 px-4 sm:px-6 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-3 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {filteredPosts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedPost(post.id)}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:border-emerald-400/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                    {post.category}
                  </span>
                  <ArrowRight className="text-slate-400 group-hover:text-emerald-600 transition-colors" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-600 text-lg mb-4 leading-relaxed">{post.excerpt}</p>
                <div className="flex items-center gap-6 text-slate-500 text-sm">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
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
