import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Trash2, Check, AlertCircle, Trophy, Calendar, Clock, CheckCircle } from 'lucide-react';

export default function PlayerNotifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'score-update',
      title: 'Match Reminder: Nairobi Sports Club',
      message: 'Your match starts in 2 hours. Match details and lineups available.',
      timestamp: '2024-02-25T08:30:00',
      read: false,
      channel: 'in-app',
      icon: Calendar
    },
    {
      id: 2,
      type: 'tournament-alert',
      title: 'Tournament Registration Open',
      message: 'National Junior Championship registration is now open. Early bird discount ends in 3 days.',
      timestamp: '2024-02-24T14:15:00',
      read: false,
      channel: 'email',
      icon: Trophy
    },
    {
      id: 3,
      type: 'schedule-change',
      title: 'Schedule Change Notification',
      message: 'Your match on Feb 22 has been rescheduled to 3:00 PM.',
      timestamp: '2024-02-24T10:00:00',
      read: true,
      channel: 'sms',
      icon: AlertCircle
    },
    {
      id: 4,
      type: 'performance-update',
      title: 'Performance Analysis Available',
      message: 'Your detailed performance report for the Coast Region Championship is ready.',
      timestamp: '2024-02-23T16:45:00',
      read: true,
      channel: 'in-app',
      icon: Trophy
    },
    {
      id: 5,
      type: 'reminder',
      title: 'Club Membership Renewal Reminder',
      message: 'Your club membership expires on March 1st. Please renew to maintain your player status.',
      timestamp: '2024-02-23T09:00:00',
      read: true,
      channel: 'email',
      icon: AlertCircle
    },
    {
      id: 6,
      type: 'achievement',
      title: 'Achievement Unlocked',
      message: "You've reached Rank #1 in Men's Singles! Congratulations!",
      timestamp: '2024-02-22T18:30:00',
      read: true,
      channel: 'in-app',
      icon: Trophy
    },
  ]);

  const [filterType, setFilterType] = useState('all');
  const [filterRead, setFilterRead] = useState('all');
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const getTypeColor = (type) => {
    switch(type) {
      case 'score-update': return 'bg-blue-100 text-blue-800';
      case 'tournament-alert': return 'bg-purple-100 text-purple-800';
      case 'schedule-change': return 'bg-orange-100 text-orange-800';
      case 'performance-update': return 'bg-green-100 text-green-800';
      case 'reminder': return 'bg-yellow-100 text-yellow-800';
      case 'achievement': return 'bg-pink-100 text-pink-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getChannelIcon = (channel) => {
    switch(channel) {
      case 'email': return Mail;
      case 'sms': return MessageSquare;
      case 'in-app': return Bell;
      default: return Bell;
    }
  };

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    setMessage({ type: 'success', text: 'Notification marked as read!' });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setMessage({ type: 'success', text: 'All notifications marked as read!' });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    setMessage({ type: 'success', text: 'Notification deleted!' });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleDeleteAllRead = () => {
    if (confirm('Delete all read notifications?')) {
      setNotifications(notifications.filter(n => !n.read));
      setMessage({ type: 'success', text: 'Read notifications cleared!' });
      setTimeout(() => setMessage(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">
          Notifications
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="ml-3 inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold">
              {notifications.filter(n => !n.read).length}
            </span>
          )}
        </h1>
        <div className="flex gap-2">
          <button onClick={handleMarkAllAsRead} className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded hover:bg-slate-200">
            Mark All Read
          </button>
          <button onClick={handleDeleteAllRead} className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100">
            Clear Read
          </button>
        </div>
      </div>

      {/* Notification Settings Preview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4">
        <p className="text-sm text-slate-700 mb-2">
          <span className="font-semibold">Multi-channel Delivery:</span> You're receiving notifications via In-App, Email, and SMS
        </p>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Manage Notification Preferences</button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Filter by Type:</p>
          <div className="flex gap-2 flex-wrap">
            {['all', 'score-update', 'tournament-alert', 'schedule-change', 'performance-update', 'reminder', 'achievement'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${
                  filterType === type
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {type.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Filter by Status:</p>
          <div className="flex gap-2">
            {['all', 'unread', 'read'].map(status => (
              <button
                key={status}
                onClick={() => setFilterRead(status)}
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${
                  filterRead === status
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {(() => {
          const filteredNotifications = notifications.filter(n => {
            const typeMatch = filterType === 'all' || n.type === filterType;
            const readMatch = filterRead === 'all' || (filterRead === 'unread' ? !n.read : n.read);
            return typeMatch && readMatch;
          });

          const formatTime = (timestamp) => {
            const date = new Date(timestamp);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays < 7) return `${diffDays}d ago`;
            
            return date.toLocaleDateString();
          };

          return filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => {
              const IconComponent = notification.icon;
              const ChannelIcon = getChannelIcon(notification.channel);

              return (
                <div
                  key={notification.id}
                  className={`rounded-xl border p-4 transition-all ${
                    notification.read
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-blue-50 border-blue-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${getTypeColor(notification.type)}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900">{notification.title}</h3>
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-red-600 mt-2 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{notification.message}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(notification.timestamp)}
                        </div>
                        <div className="flex items-center gap-1">
                          <ChannelIcon className="w-3 h-3" />
                          {notification.channel.replace('-', ' ')}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 hover:bg-white rounded-lg transition-colors text-slate-600 hover:text-emerald-600"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="p-2 hover:bg-white rounded-lg transition-colors text-slate-600 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
              <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">No notifications match your filters</p>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
