import React from 'react';
import { Trophy, Users, BarChart3, Shield, Calendar, DollarSign } from 'lucide-react';
import LandingNavbar from './LandingNavbar';
import LandingFooter from './LandingFooter';

interface AboutPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onNavigate?: (page: string) => void;
}

export default function AboutPageNew({ onGetStarted, onLogin, onNavigate }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col">
      <LandingNavbar onGetStarted={onGetStarted} onLogin={onLogin} onNavigate={onNavigate} currentPage="about" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 dark:from-slate-800 to-white dark:to-slate-900">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">About Badminton Kenya OS</h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              The comprehensive tournament management platform designed to revolutionize badminton operations across Kenya.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-emerald-600">Our Mission</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                To provide a unified, transparent, and efficient platform for managing badminton tournaments, registrations, and player rankings across Kenya. We aim to streamline operations for clubs, federation administrators, referees, and players alike.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4 text-emerald-600">Our Vision</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                To be the leading technological backbone of Kenyan badminton, fostering growth, fair competition, and excellence through innovative solutions that empower all stakeholders in the sport.
              </p>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Trophy, title: 'Tournament Management', desc: 'Complete lifecycle management from creation to completion' },
                { icon: Users, title: 'Player Management', desc: 'Profile tracking, rankings, and performance analytics' },
                { icon: BarChart3, title: 'Advanced Analytics', desc: 'Real-time insights and comprehensive reporting' },
                { icon: Shield, title: 'Referee Management', desc: 'Streamlined assignment and performance tracking' },
                { icon: Calendar, title: 'Calendar Integration', desc: 'Comprehensive event scheduling and notifications' },
                { icon: DollarSign, title: 'Payment Processing', desc: 'Secure registration fee and tournament payments' },
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-md hover:shadow-lg transition">
                    <Icon className="text-emerald-600 mb-4" size={32} />
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team & Credits */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Built by Experts</h2>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl p-8 text-center">
              <p className="text-lg mb-4">
                Badminton Kenya OS is developed and maintained with dedication to excellence by our professional team.
              </p>
              <p className="text-emerald-600 dark:text-emerald-400 font-bold text-xl">
                StarTech Group Solutions
              </p>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Innovating technology solutions for African sports organizations
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 to-emerald-500">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Join?</h2>
            <p className="text-xl mb-8 text-emerald-100">Experience the future of badminton tournament management</p>
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold text-lg hover:bg-emerald-50 transition shadow-lg"
            >
              Get Started Now
            </button>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
