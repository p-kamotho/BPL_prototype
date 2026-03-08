import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import LandingNavbar from './LandingNavbar';
import LandingFooter from './LandingFooter';

interface ContactPageNewProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onNavigate?: (page: string) => void;
}

export default function ContactPageNew({ onGetStarted, onLogin, onNavigate }: ContactPageNewProps) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col">
      <LandingNavbar onGetStarted={onGetStarted} onLogin={onLogin} onNavigate={onNavigate} currentPage="contact" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 dark:from-slate-800 to-white dark:to-slate-900">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">Get in Touch</h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-8 text-center">
                <Mail className="text-emerald-600 mx-auto mb-4" size={32} />
                <h3 className="text-xl font-bold mb-2">Email</h3>
                <a href="mailto:info@badmintonkenya.org" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                  info@badmintonkenya.org
                </a>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-8 text-center">
                <Phone className="text-emerald-600 mx-auto mb-4" size={32} />
                <h3 className="text-xl font-bold mb-2">Phone</h3>
                <a href="tel:+254712345678" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                  +254 (0) 712 345 678
                </a>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-8 text-center">
                <MapPin className="text-emerald-600 mx-auto mb-4" size={32} />
                <h3 className="text-xl font-bold mb-2">Location</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Nairobi, Kenya
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
                
                {submitted ? (
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-400 dark:border-emerald-600 text-emerald-700 dark:text-emerald-300 p-4 rounded-lg text-center">
                    <p className="font-semibold">Thank you! Your message has been sent successfully.</p>
                    <p className="text-sm mt-2">We'll get back to you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Email</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Subject</label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                        placeholder="Message subject"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Message</label>
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={5}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                        placeholder="Your message..."
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition flex items-center justify-center gap-2"
                    >
                      <Send size={20} /> Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: 'How do I create a tournament?', a: 'Log in to your admin account, navigate to the Tournaments section, and click "Create New Tournament". Fill in the required details and submit.' },
                { q: 'How can I register players?', a: 'Players can register themselves through the platform, or club managers can register them in bulk through the Players management section.' },
                { q: 'What payment methods are accepted?', a: 'We accept M-Pesa, card payments, and bank transfers. Payment options vary by tournament.' },
                { q: 'How do I report an issue?', a: 'Contact us through this form or email us at support@badmintonkenya.org with details of your issue.' },
              ].map((faq, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-lg mb-2 text-emerald-600">{faq.q}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
