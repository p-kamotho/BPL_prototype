import React, { useState } from 'react';
import { Trophy, Mail, Phone, MapPin, MessageSquare, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface ContactPageProps {
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

export default function ContactPage({ onBack, onNavigate }: ContactPageProps) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitMessage, setSubmitMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setSubmitMessage({type: 'error', text: 'Please fill all fields'});
      setTimeout(() => setSubmitMessage(null), 3000);
      return;
    }
    setSubmitMessage({type: 'success', text: 'Message sent successfully! We\'ll get back to you soon.'});
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitMessage(null), 5000);
  };

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
            <a href="#" onClick={(e) => { e.preventDefault(); onBack?.(); }} className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">Home</a>
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
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6">Get In Touch</h1>
            <p className="text-xl text-slate-300">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Mail, title: 'Email', contact: 'support@badmintokenya.com', desc: 'Send us an email' },
              { icon: Phone, title: 'Phone', contact: '+254 (0) 123 456 789', desc: 'Give us a call' },
              { icon: MapPin, title: 'Location', contact: 'Nairobi, Kenya', desc: 'Visit our office' }
            ].map((method, i) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{method.title}</h3>
                  <p className="font-semibold text-emerald-600 mb-1">{method.contact}</p>
                  <p className="text-slate-600 text-sm">{method.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Send us a Message</h2>
            
            {submitMessage && (
              <div className={`p-4 rounded-lg flex items-center gap-3 mb-6 ${submitMessage.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                {submitMessage.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                <p className="font-medium">{submitMessage.text}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Full Name</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Email Address</label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Subject</label>
                <input 
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="What is this about?"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Message</label>
                <textarea 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={6}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="Your message..."
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-all"
              >
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'How do I register for a tournament?', a: 'Sign up on our platform, browse available tournaments, and register through the tournament details page. Payment is made securely through our escrow system.' },
              { q: 'How are rankings calculated?', a: 'Rankings are calculated based on tournament level, number of participants, and your performance. Higher tier tournaments award more points.' },
              { q: 'Can I request a refund?', a: 'Tournament cancellations are refunded within 7 business days. Please contact our support team for specific inquiries.' },
              { q: 'How do I report a match result?', a: 'Referees can submit scores directly from the match venue through our mobile app or web platform.' }
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-slate-50 rounded-lg border border-slate-200 p-6"
              >
                <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <MessageSquare size={18} className="text-emerald-600" />
                  {faq.q}
                </h3>
                <p className="text-slate-600">{faq.a}</p>
              </motion.div>
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
