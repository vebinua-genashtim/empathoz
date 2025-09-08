import React, { useState } from 'react';
import { MessageSquare, Bell, Users, Calendar, Plus, Pin, Eye } from 'lucide-react';
import AnnouncementForm from './components/AnnouncementForm';

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  department: string;
  priority: 'low' | 'medium' | 'high';
  publishDate: string;
  isPinned: boolean;
  views: number;
  category: 'general' | 'hr' | 'it' | 'safety' | 'events';
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  attendees: number;
  maxAttendees?: number;
}

const InternalCommunications: React.FC = () => {
  const [announcements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'New Remote Work Policy Updates',
      content: 'We are excited to announce updates to our remote work policy, effective February 1st. All employees can now work remotely up to 3 days per week with manager approval.',
      author: 'HR Team',
      department: 'Human Resources',
      priority: 'high',
      publishDate: '2025-01-15',
      isPinned: true,
      views: 156,
      category: 'hr'
    },
    {
      id: '2',
      title: 'Q1 All-Hands Meeting Scheduled',
      content: 'Join us for our quarterly all-hands meeting on February 28th at 2:00 PM. We will discuss company performance, upcoming projects, and team achievements.',
      author: 'Leadership Team',
      department: 'Executive',
      priority: 'medium',
      publishDate: '2025-01-14',
      isPinned: true,
      views: 89,
      category: 'general'
    },
    {
      id: '3',
      title: 'IT System Maintenance Window',
      content: 'Scheduled maintenance on our internal systems will occur this Saturday from 2:00 AM to 6:00 AM. Some services may be temporarily unavailable.',
      author: 'IT Department',
      department: 'Information Technology',
      priority: 'medium',
      publishDate: '2025-01-13',
      isPinned: false,
      views: 67,
      category: 'it'
    },
    {
      id: '4',
      title: 'Employee Wellness Program Launch',
      content: 'We are launching a comprehensive wellness program including gym memberships, mental health resources, and wellness workshops. Sign-up begins next week.',
      author: 'HR Team',
      department: 'Human Resources',
      priority: 'low',
      publishDate: '2025-01-12',
      isPinned: false,
      views: 134,
      category: 'hr'
    }
  ]);

  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'Team Building Workshop',
      description: 'Interactive workshop focused on improving team collaboration and communication skills.',
      date: '2025-02-20',
      time: '14:00',
      location: 'Conference Room A',
      organizer: 'HR Team',
      attendees: 24,
      maxAttendees: 30
    },
    {
      id: '2',
      title: 'Lunch & Learn: AI in Business',
      description: 'Educational session about implementing AI solutions in business processes.',
      date: '2025-02-25',
      time: '12:00',
      location: 'Main Auditorium',
      organizer: 'Tech Team',
      attendees: 45,
      maxAttendees: 50
    },
    {
      id: '3',
      title: 'Monthly Birthday Celebration',
      description: 'Celebrating all February birthdays with cake and refreshments.',
      date: '2025-02-28',
      time: '15:30',
      location: 'Break Room',
      organizer: 'Social Committee',
      attendees: 18
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | undefined>();

  const categories = ['all', 'general', 'hr', 'it', 'safety', 'events'];

  const filteredAnnouncements = announcements.filter(announcement => {
    return selectedCategory === 'all' || announcement.category === selectedCategory;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'hr': return 'bg-blue-100 text-blue-800';
      case 'it': return 'bg-purple-100 text-purple-800';
      case 'safety': return 'bg-red-100 text-red-800';
      case 'events': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStats = () => {
    const totalAnnouncements = announcements.length;
    const pinnedAnnouncements = announcements.filter(a => a.isPinned).length;
    const totalViews = announcements.reduce((sum, a) => sum + a.views, 0);
    const upcomingEvents = events.length;
    return { totalAnnouncements, pinnedAnnouncements, totalViews, upcomingEvents };
  };

  const stats = getStats();

  const handleSaveAnnouncement = (announcementData: Omit<Announcement, 'id' | 'views'> | Announcement) => {
    // In a real app, this would save to the backend
    console.log('Saving announcement:', announcementData);
    setShowForm(false);
    setEditingAnnouncement(undefined);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setShowForm(true);
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Internal Communications</h1>
            <p className="text-gray-600 mt-1">Company news, announcements, and internal updates</p>
          </div>
          <button 
            onClick={() => {
              setEditingAnnouncement(undefined);
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Announcement
          </button>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Announcements</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAnnouncements}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pinned Posts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pinnedAnnouncements}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Pin className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingEvents}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Announcements */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Announcements</h2>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredAnnouncements.map(announcement => (
                  <div key={announcement.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {announcement.isPinned && <Pin className="w-4 h-4 text-yellow-600" />}
                          <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                            {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(announcement.category)}`}>
                            {announcement.category.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{announcement.content}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <span>By {announcement.author}</span>
                            <span>{announcement.department}</span>
                            <span>{new Date(announcement.publishDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{announcement.views}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEditAnnouncement(announcement)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {events.map(event => (
                  <div key={event.id} className="p-4 hover:bg-gray-50">
                    <h3 className="font-medium text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                      </div>
                      <p>📍 {event.location}</p>
                      <p>👤 {event.organizer}</p>
                      <p>👥 {event.attendees}{event.maxAttendees ? `/${event.maxAttendees}` : ''} attending</p>
                    </div>
                    {event.maxAttendees && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-blue-600 h-1 rounded-full" 
                            style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-4 space-y-3">
                <button className="w-full p-3 text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">Post Announcement</h3>
                      <p className="text-sm text-gray-600">Share company news</p>
                    </div>
                  </div>
                </button>
                <button className="w-full p-3 text-left rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">Create Event</h3>
                      <p className="text-sm text-gray-600">Schedule team events</p>
                    </div>
                  </div>
                </button>
                <button className="w-full p-3 text-left rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-purple-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">Send Notification</h3>
                      <p className="text-sm text-gray-600">Urgent updates</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Announcement Form Modal */}
      <AnnouncementForm
        announcement={editingAnnouncement}
        onSave={handleSaveAnnouncement}
        onCancel={() => {
          setShowForm(false);
          setEditingAnnouncement(undefined);
        }}
        isOpen={showForm}
      />
    </div>
  );
};

export default InternalCommunications;