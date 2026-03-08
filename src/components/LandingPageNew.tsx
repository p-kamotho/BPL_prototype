import React from 'react';
import { Trophy, Users, BarChart3, Shield, Calendar, DollarSign, ArrowRight, Zap } from 'lucide-react';
import LandingNavbar from './LandingNavbar';
import LandingFooter from './LandingFooter';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onNavigate?: (page: string) => void;
}

export default function LandingPageNew({ onGetStarted, onLogin, onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white overflow-x-hidden flex flex-col">
      <LandingNavbar onGetStarted={onGetStarted} onLogin={onLogin} onNavigate={onNavigate} currentPage="home" />

      <main className="flex-1">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 dark:from-slate-800 to-white dark:to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
                The Official Tournament <span className="text-emerald-600">Management</span> Platform
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
                Smash, Serve, Score — Manage your badminton tournaments with precision and ease. Streamlined operations for players, clubs, and federation administrators.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onGetStarted}
                  className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg transition shadow-lg flex items-center justify-center gap-2"
                >
                  Start Now <ArrowRight size={24} />
                </button>
                <button
                  onClick={onLogin}
                  className="px-8 py-4 border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl font-bold text-lg transition"
                >
                  Sign In
                </button>
              </div>
            </div>
            
            {/* Dashboard Preview */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-emerald-400/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-1 shadow-2xl">
                <div className="bg-slate-900 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold">Admin Dashboard</h3>
                    <Zap size={20} className="text-amber-400" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-500/20 rounded-lg p-3">
                      <p className="text-blue-300 text-xs">Total Users</p>
                      <p className="text-white text-2xl font-bold">1,238</p>
                    </div>
                    <div className="bg-emerald-500/20 rounded-lg p-3">
                      <p className="text-emerald-300 text-xs">Tournaments</p>
                      <p className="text-white text-2xl font-bold">238</p>
                    </div>
                    <div className="bg-amber-500/20 rounded-lg p-3">
                      <p className="text-amber-300 text-xs">Rating</p>
                      <p className="text-white text-2xl font-bold">2.6</p>
                    </div>
                    <div className="bg-purple-500/20 rounded-lg p-3">
                      <p className="text-purple-300 text-xs">Revenue</p>
                      <p className="text-white text-2xl font-bold">$56K</p>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-3 h-16 flex items-end justify-between gap-2">
                    {[40, 60, 45, 70, 55, 80, 65].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t opacity-70"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Powerful Features for Every Role</h3>
            <p className="text-xl text-slate-600 dark:text-slate-400">Tailored management tools for players, clubs, referees, and federation administrators</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Trophy,
                title: "Tournament Management",
                description: "Create, manage, and track tournaments with automatic bracket generation"
              },
              {
                icon: Users,
                title: "Team Registration",
                description: "Easy club and team registration with seamless player management"
              },
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                description: "Real-time performance metrics and player rankings"
              },
              {
                icon: Shield,
                title: "Referee Management",
                description: "Streamlined referee assignment and match scoring"
              },
              {
                icon: Calendar,
                title: "Tournament Calendar",
                description: "Comprehensive calendar view of all events and tournaments"
              },
              {
                icon: DollarSign,
                title: "Payment Processing",
                description: "Integrated payment system for tournament fees and registrations"
              }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 hover:shadow-lg transition">
                  <Icon className="text-emerald-600 mb-4" size={32} />
                  <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                  <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Built for Every Role</h3>
            <p className="text-xl text-slate-600 dark:text-slate-400">Specialized portals and permissions for all stakeholders</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Players",
                features: ["Register for tournaments", "View rankings", "Track match history", "Edit profile with photos"]
              },
              {
                title: "Club Managers",
                features: ["Manage team registrations", "View club activities", "Track financials", "Manage announcements"]
              },
              {
                title: "Referees",
                features: ["View assigned matches", "Score matches", "Performance reviews", "Certification tracking"]
              },
              {
                title: "Tournament Admin",
                features: ["Create tournaments", "Manage brackets", "Assign referees", "View live results"]
              },
              {
                title: "Federation Admin",
                features: ["National oversight", "Policy management", "Compliance tracking", "Financial reports"]
              },
              {
                title: "Super Admin",
                features: ["Full system access", "User management", "System settings", "Audit logs"]
              }
            ].map((role, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition">
                <h4 className="text-2xl font-bold mb-6 text-emerald-600">{role.title}</h4>
                <ul className="space-y-3">
                  {role.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                      <span className="text-slate-600 dark:text-slate-400">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Showcase */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Modern Interface Design</h3>
            <p className="text-xl text-slate-600 dark:text-slate-400">Clean, intuitive dashboards with dark mode support</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Manager Dashboard */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-400/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-3xl p-6 shadow-2xl">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-bold">Club Dashboard</h4>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full font-semibold">Manager</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <p className="text-blue-600 dark:text-blue-400 text-xs mb-1">Members</p>
                      <p className="text-2xl font-bold">45</p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
                      <p className="text-emerald-600 dark:text-emerald-400 text-xs mb-1">Matches</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Recent Activity</p>
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-slate-900 dark:text-white">Team registered</p>
                            <p className="text-slate-500 dark:text-slate-400 text-xs">2 hours ago</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Dashboard */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-emerald-400/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-3xl p-6 shadow-2xl">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-bold">Analytics</h4>
                    <BarChart3 className="text-emerald-600" size={24} />
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { label: "Tournaments", value: "85%", color: "from-emerald-400 to-emerald-600" },
                      { label: "Players", value: "72%", color: "from-blue-400 to-blue-600" },
                      { label: "Revenue", value: "91%", color: "from-purple-400 to-purple-600" }
                    ].map((stat, i) => (
                      <div key={i}>
                        <div className="flex justify-between mb-2">
                          <p className="text-sm font-semibold">{stat.label}</p>
                          <p className="text-sm text-emerald-600 font-bold">{stat.value}</p>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div 
                            className={`bg-gradient-to-r ${stat.color} h-2 rounded-full`}
                            style={{ width: stat.value }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 to-emerald-500">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Platform?</h3>
          <p className="text-xl text-emerald-100 mb-8">Join Badminton Kenya OS and revolutionize tournament management</p>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-white hover:bg-slate-100 text-emerald-600 rounded-xl font-bold text-lg transition shadow-lg"
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
