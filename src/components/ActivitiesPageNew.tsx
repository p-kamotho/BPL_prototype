import React from 'react';
import { Trophy, Users, Award, Calendar, Target, TrendingUp } from 'lucide-react';
import LandingNavbar from './LandingNavbar';
import LandingFooter from './LandingFooter';

interface ActivitiesPageNewProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onNavigate?: (page: string) => void;
}

export default function ActivitiesPageNew({ onGetStarted, onLogin, onNavigate }: ActivitiesPageNewProps) {
  const activities = [
    {
      icon: Trophy,
      title: 'National Championships',
      date: 'March 15-20, 2026',
      location: 'Nairobi, Kenya',
      participants: '128 Players',
      desc: 'The annual national badminton championships featuring the best players from across the country.'
    },
    {
      icon: Users,
      title: 'Badminton Campus Series',
      date: 'April 5-8, 2026',
      location: 'Multiple Universities',
      participants: '64 Teams',
      desc: 'University-level badminton tournament bringing together students from across major campuses.'
    },
    {
      icon: Award,
      title: 'Referee Certification Training',
      date: 'March 10-12, 2026',
      location: 'Nairobi Sports Complex',
      participants: '32 Referees',
      desc: 'Professional training program for emerging and experienced referees to maintain officiating standards.'
    },
    {
      icon: Calendar,
      title: 'Regional Club League',
      date: 'Monthly Series',
      location: 'Various Venues',
      participants: '48 Clubs',
      desc: 'Ongoing regional club competitions providing consistent competitive opportunities throughout the year.'
    },
    {
      icon: Target,
      title: 'Battle of Sevens',
      date: 'May 1-3, 2026',
      location: 'Nairobi Arena',
      participants: '32 Teams',
      desc: 'Fast-paced team badminton tournament featuring 7-a-side format across different regions.'
    },
    {
      icon: TrendingUp,
      title: 'Rankings & Season Tour',
      date: 'Ongoing',
      location: 'All Venues',
      participants: 'Open to All',
      desc: 'Continuous ranking updates and seasonal tour events enabling players to earn points and climb rankings.'
    },
  ];

  const upcomingEvents = [
    { date: 'March 10', event: 'Referee Certification Begins' },
    { date: 'March 15', event: 'National Championships Start' },
    { date: 'April 5', event: 'Badminton Campus Series Launch' },
    { date: 'May 1', event: 'Battle of Sevens Begins' },
    { date: 'June 15', event: 'Mid-Season Ranking Update' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col">
      <LandingNavbar onGetStarted={onGetStarted} onLogin={onLogin} onNavigate={onNavigate} currentPage="activities" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 dark:from-slate-800 to-white dark:to-slate-900">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">Our Activities & Events</h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Explore the comprehensive calendar of badminton tournaments, trainings, and events happening across Kenya.
            </p>
          </div>
        </section>

        {/* Main Activities Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Featured Activities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities.map((activity, i) => {
                const Icon = activity.icon;
                return (
                  <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden hover:shadow-lg transition">
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 flex items-center justify-center">
                      <Icon className="text-white" size={40} />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{activity.desc}</p>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2">
                          <span className="font-semibold text-emerald-600">Date:</span> {activity.date}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold text-emerald-600">Location:</span> {activity.location}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold text-emerald-600">Participants:</span> {activity.participants}
                        </p>
                      </div>
                      <button className="mt-4 w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition">
                        Learn More
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Upcoming Events Timeline */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Upcoming Events Timeline</h2>
            <div className="space-y-4">
              {upcomingEvents.map((event, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-600">
                      <Calendar className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="flex-1 bg-white dark:bg-slate-900 rounded-lg p-4 md:p-6">
                    <p className="font-bold text-lg">{event.event}</p>
                    <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">By The Numbers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: '128+', label: 'Tournaments Annually' },
                { number: '2,500+', label: 'Active Players' },
                { number: '48+', label: 'Registered Clubs' },
                { number: '250+', label: 'Certified Referees' },
              ].map((stat, i) => (
                <div key={i} className="bg-gradient-to-br from-emerald-600 to-emerald-500 text-white rounded-xl p-8 text-center">
                  <p className="text-5xl font-bold mb-2">{stat.number}</p>
                  <p className="text-emerald-100">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
              Participate in tournaments, connect with other badminton enthusiasts, and grow your skills.
            </p>
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg transition shadow-lg"
            >
              Get Started Today
            </button>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
