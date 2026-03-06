import React, { useState } from 'react';
import { Send, Bell, MessageSquare, Users, Pin, Trash2, Plus, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ClubCommunications() {
  const [activeTab, setActiveTab] = useState('announcements');
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'March Tournament Registration Open',
      content: 'Registration for the National Championship 2024 is now open. Early bird discount available until March 15th. Register your team now!',
      date: '2024-03-04',
      pinned: true,
      readBy: 24,
      totalMembers: 28
    },
    {
      id: 2,
      title: 'Training Schedule Updated',
      content: 'Weekly training sessions have been updated. New timings: Mon/Wed 6:00 PM - 7:30 PM. Venue: Main Court A. All members welcome!',
      date: '2024-03-02',
      pinned: false,
      readBy: 18,
      totalMembers: 28
    },
    {
      id: 3,
      title: 'Congratulations to Our Champions',
      content: 'Huge congratulations to John & Jane for winning the Coastal Region Championship! Excellent performance. The club is proud of you!',
      date: '2024-02-28',
      pinned: false,
      readBy: 28,
      totalMembers: 28
    }
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'Club Coach David',
      subject: 'Training Session Confirmation',
      preview: 'Hi all, just confirming the training session for tomorrow...',
      date: '2024-03-04T14:30:00',
      unread: true,
      recipient: 'All Members'
    },
    {
      id: 2,
      from: 'Tournament Admin Sarah',
      subject: 'Match Results Posted',
      preview: 'The results for last weekend\'s matches have been posted in the rankings...',
      date: '2024-03-03T10:15:00',
      unread: false,
      recipient: 'All Members'
    },
    {
      id: 3,
      from: 'Club President',
      subject: 'Club Membership Renewal',
      preview: 'Reminder: Annual membership renewal is due by end of March...',
      date: '2024-03-01T09:00:00',
      unread: false,
      recipient: 'All Members'
    }
  ]);

  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [messageRecipient, setMessageRecipient] = useState('All Members');
  const [messageSubject, setMessageSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [groups, setGroups] = useState([
    { id: 1, name: 'All Members', count: 28, color: 'emerald' },
    { id: 2, name: 'Active Players', count: 18, color: 'blue' },
    { id: 3, name: 'Coaches & Staff', count: 4, color: 'purple' },
    { id: 4, name: 'Club Committee', count: 6, color: 'orange' },
    { id: 5, name: 'Tournament Group', count: 12, color: 'pink' }
  ]);

  const handlePostAnnouncement = () => {
    if (!announcementTitle.trim() || !announcementContent.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const newAnnouncement = {
      id: Math.max(...announcements.map(a => a.id), 0) + 1,
      title: announcementTitle,
      content: announcementContent,
      date: new Date().toISOString().split('T')[0],
      pinned: false,
      readBy: 1,
      totalMembers: 28
    };

    setAnnouncements([...announcements, newAnnouncement]);
    setAnnouncementTitle('');
    setAnnouncementContent('');
    setShowAnnouncementForm(false);
    setMessage({ type: 'success', text: 'Announcement posted successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSendMessage = () => {
    if (!messageSubject.trim() || !messageContent.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const newMessage = {
      id: Math.max(...messages.map(m => m.id), 0) + 1,
      from: 'You',
      subject: messageSubject,
      preview: messageContent.substring(0, 60) + '...',
      date: new Date().toISOString(),
      unread: false,
      recipient: messageRecipient
    };

    setMessages([newMessage, ...messages]);
    setMessageSubject('');
    setMessageContent('');
    setShowMessageForm(false);
    setMessage({ type: 'success', text: `Message sent to ${messageRecipient}!` });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleMarkMessageAsRead = (id: number) => {
    setMessages(messages.map(m => 
      m.id === id ? { ...m, unread: false } : m
    ));
  };

  const handleDeleteMessage = (id: number) => {
    setMessages(messages.filter(m => m.id !== id));
    setMessage({ type: 'success', text: 'Message deleted!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSendGroupMessage = (groupName: string) => {
    alert(`Message form would open for sending to: ${groupName}`);
  };

  const togglePin = (id) => {
    setAnnouncements(announcements.map(a => 
      a.id === id ? { ...a, pinned: !a.pinned } : a
    ));
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
    setMessage({ type: 'success', text: 'Announcement deleted!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.pinned === b.pinned) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return a.pinned ? -1 : 1;
  });

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
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Club Communications</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        {[
          { id: 'announcements', label: 'Announcements', icon: Bell },
          { id: 'messages', label: 'Messages', icon: MessageSquare },
          { id: 'subscribers', label: 'Distribution Lists', icon: Users }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-b-2 border-emerald-600 text-emerald-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Announcements Tab */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Post Announcement
            </button>
          </div>

          {showAnnouncementForm && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
              <h3 className="font-bold text-lg">New Announcement</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                <input
                  type="text"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="Announcement title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
                <textarea
                  rows={4}
                  value={announcementContent}
                  onChange={(e) => setAnnouncementContent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="Write your announcement here..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowAnnouncementForm(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button onClick={handlePostAnnouncement} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Post
                </button>
              </div>
            </div>
          )}

          {sortedAnnouncements.map(announcement => (
            <div key={announcement.id} className={`rounded-xl border p-6 ${
              announcement.pinned ? 'bg-yellow-50 border-yellow-300 shadow-sm' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  {announcement.pinned && (
                    <Pin className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-slate-900">{announcement.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{announcement.date}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => togglePin(announcement.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      announcement.pinned 
                        ? 'bg-yellow-100 text-yellow-700' 
                        : 'hover:bg-slate-100 text-slate-600'
                    }`}
                    title="Pin announcement"
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteAnnouncement(announcement.id)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-slate-700 mb-4">{announcement.content}</p>

              <div className="flex items-center justify-between text-xs text-slate-600 p-3 bg-slate-50 rounded-lg">
                <span>Read by {announcement.readBy} of {announcement.totalMembers} members</span>
                <div className="w-24 bg-slate-200 rounded-full h-1.5">
                  <div 
                    className="bg-emerald-600 h-1.5 rounded-full"
                    style={{ width: `${(announcement.readBy / announcement.totalMembers) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowMessageForm(!showMessageForm)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Send Message
            </button>
          </div>

          {showMessageForm && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
              <h3 className="font-bold text-lg">Compose Message</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Recipients</label>
                <select 
                  value={messageRecipient}
                  onChange={(e) => setMessageRecipient(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600">
                  <option>All Members</option>
                  <option>Coaches Only</option>
                  <option>Players</option>
                  <option>Committee</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="Message subject..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                <textarea
                  rows={4}
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="Type your message..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowMessageForm(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button onClick={handleSendMessage} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>
          )}

          {messages.map(message => (
            <div key={message.id} onClick={() => handleMarkMessageAsRead(message.id)} className={`rounded-xl border p-4 cursor-pointer hover:shadow-md transition-shadow ${
              message.unread ? 'bg-blue-50 border-blue-200 font-semibold' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-slate-900">{message.from}</h3>
                    {message.unread && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                  </div>
                  <p className="font-semibold text-slate-900 mb-1">{message.subject}</p>
                  <p className="text-sm text-slate-600 mb-2">{message.preview}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Users className="w-3 h-3" />
                    <span>To: {message.recipient}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 flex-shrink-0 ml-2">{message.date}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMessage(message.id);
                    }}
                    className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-600 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Distribution Lists Tab */}
      {activeTab === 'subscribers' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-lg mb-4">Communication Groups</h3>
            
            <div className="space-y-3">
              {groups.map((group) => (
                <div key={group.id} className={`p-4 rounded-lg border-2 border-${group.color}-200 bg-${group.color}-50`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-semibold text-${group.color}-900`}>{group.name}</h4>
                    <button onClick={() => handleSendGroupMessage(group.name)} className="px-3 py-1 bg-white text-slate-700 rounded border border-slate-300 text-xs font-medium hover:bg-slate-50">
                      Send Message
                    </button>
                  </div>
                  <p className={`text-sm text-${group.color}-700`}>{group.count} members</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Create New Group</h3>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm">
                <Plus className="w-4 h-4 inline mr-2" />
                New Group
              </button>
            </div>
            <p className="text-slate-600 text-sm">Create custom distribution lists for targeted communications</p>
          </div>
        </div>
      )}
    </div>
  );
}
