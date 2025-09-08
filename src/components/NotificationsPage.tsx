import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Filter, 
  Check, 
  CheckCheck, 
  Trash2, 
  Clock, 
  AlertCircle, 
  Calendar, 
  Settings, 
  User,
  Eye,
  EyeOff,
  Archive,
  RefreshCw,
  Download,
  Grid,
  List
} from 'lucide-react';
import { Notification, dataService } from '../services/dataService';

interface NotificationsPageProps {
  currentUser: string;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ currentUser }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    refreshNotifications();
  }, [currentUser]);

  const refreshNotifications = () => {
    setNotifications(dataService.getNotifications(currentUser));
  };

  const handleMarkAsRead = (notificationId: string) => {
    dataService.markNotificationAsRead(notificationId);
    refreshNotifications();
  };

  const handleMarkAsUnread = (notificationId: string) => {
    dataService.markNotificationAsUnread(notificationId);
    refreshNotifications();
  };

  const handleMarkAllAsRead = () => {
    dataService.markAllNotificationsAsRead(currentUser);
    refreshNotifications();
    setSelectedNotifications([]);
  };

  const handleDeleteNotification = (notificationId: string) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      dataService.deleteNotification(notificationId);
      refreshNotifications();
      setSelectedNotifications(prev => prev.filter(id => id !== notificationId));
    }
  };

  const handleBulkAction = (action: 'read' | 'unread' | 'delete') => {
    if (selectedNotifications.length === 0) return;

    const confirmMessage = action === 'delete' 
      ? `Are you sure you want to delete ${selectedNotifications.length} notification${selectedNotifications.length !== 1 ? 's' : ''}?`
      : `Mark ${selectedNotifications.length} notification${selectedNotifications.length !== 1 ? 's' : ''} as ${action}?`;

    if (window.confirm(confirmMessage)) {
      selectedNotifications.forEach(id => {
        if (action === 'read') {
          dataService.markNotificationAsRead(id);
        } else if (action === 'unread') {
          dataService.markNotificationAsUnread(id);
        } else if (action === 'delete') {
          dataService.deleteNotification(id);
        }
      });
      refreshNotifications();
      setSelectedNotifications([]);
    }
  };

  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      // In a real app, this would navigate to the specified URL
      console.log(`Navigate to: ${notification.actionUrl}`);
    }
  };

  const handleExportNotifications = () => {
    const csvContent = [
      ['Date', 'Type', 'Priority', 'Title', 'Message', 'Status', 'Action Required'].join(','),
      ...filteredNotifications.map(n => [
        new Date(n.createdAt).toLocaleDateString(),
        n.type,
        n.priority,
        `"${n.title}"`,
        `"${n.message}"`,
        n.isRead ? 'Read' : 'Unread',
        n.actionRequired ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notifications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Filter and sort notifications
  const filteredNotifications = notifications
    .filter(notification => {
      const matchesSearch = 
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || notification.category === selectedCategory;
      const matchesPriority = selectedPriority === 'all' || notification.priority === selectedPriority;
      const matchesStatus = selectedStatus === 'all' || 
        (selectedStatus === 'read' && notification.isRead) ||
        (selectedStatus === 'unread' && !notification.isRead);

      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'approval-request':
      case 'approval-approved':
      case 'approval-rejected':
        return <User className="w-5 h-5" />;
      case 'leave-approved':
      case 'leave-rejected':
        return <Calendar className="w-5 h-5" />;
      case 'reminder':
        return <Clock className="w-5 h-5" />;
      case 'deadline':
        return <AlertCircle className="w-5 h-5" />;
      case 'system':
        return <Settings className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'urgent') return 'bg-red-50 border-red-200 text-red-800';
    if (priority === 'high') return 'bg-orange-50 border-orange-200 text-orange-800';
    
    switch (type) {
      case 'approval-request':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'leave-approved':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'leave-rejected':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'reminder':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'deadline':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'system':
        return 'bg-gray-50 border-gray-200 text-gray-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return notificationDate.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired && !n.isRead).length;
  const categories = ['all', 'approval', 'leave', 'reminder', 'system'];
  const priorities = ['all', 'urgent', 'high', 'medium', 'low'];

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">
              {unreadCount} unread • {actionRequiredCount} require action • {notifications.length} total
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'cards' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              
              <button
                onClick={refreshNotifications}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              
              <button
                onClick={handleExportNotifications}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Notifications</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <EyeOff className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Action Required</p>
                <p className="text-2xl font-bold text-gray-900">{actionRequiredCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(n.createdAt) >= weekAgo;
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>
                      {priority === 'all' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'priority' | 'category')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="date">Date</option>
                    <option value="priority">Priority</option>
                    <option value="category">Category</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedNotifications.length > 0 && (
          <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-blue-900">
                  {selectedNotifications.length} notification{selectedNotifications.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkAction('read')}
                  className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                >
                  <Check className="w-4 h-4" />
                  Mark Read
                </button>
                <button
                  onClick={() => handleBulkAction('unread')}
                  className="bg-yellow-600 text-white px-3 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2 text-sm"
                >
                  <EyeOff className="w-4 h-4" />
                  Mark Unread
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                <button
                  onClick={() => setSelectedNotifications([])}
                  className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <CheckCheck className="w-4 h-4" />
                {selectedNotifications.length === filteredNotifications.length ? 'Deselect All' : 'Select All'}
              </button>
              
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  Mark All Read
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Showing {filteredNotifications.length} of {notifications.length}</span>
            </div>
          </div>
        </div>

        {/* Notifications Display */}
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredNotifications.map(notification => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white rounded-xl border p-6 hover:shadow-lg transition-all duration-200 cursor-pointer ${
                  !notification.isRead ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                } ${selectedNotifications.includes(notification.id) ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getNotificationColor(notification.type, notification.priority)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-sm font-medium truncate ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`}></div>
                        <span className="text-xs text-gray-500">{getTimeAgo(notification.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectNotification(notification.id);
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <p className={`text-sm mb-4 ${!notification.isRead ? 'text-gray-700' : 'text-gray-600'}`}>
                  {notification.message}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNotificationColor(notification.type, notification.priority)}`}>
                      {notification.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    {notification.actionRequired && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        Action Required
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {!notification.isRead ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsUnread(notification.id);
                        }}
                        className="p-1 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                        title="Mark as unread"
                      >
                        <EyeOff className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification.id);
                      }}
                      className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notification
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredNotifications.map((notification) => (
                    <tr 
                      key={notification.id} 
                      onClick={() => handleNotificationClick(notification)}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      } ${selectedNotifications.includes(notification.id) ? 'bg-blue-100' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(notification.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectNotification(notification.id);
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getNotificationColor(notification.type, notification.priority)}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm font-medium truncate ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                {notification.title}
                              </p>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                              )}
                            </div>
                            <p className={`text-sm truncate ${!notification.isRead ? 'text-gray-700' : 'text-gray-600'}`}>
                              {notification.message}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getNotificationColor(notification.type, notification.priority)}`}>
                          {notification.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(notification.priority)}`}></div>
                          <span className="text-sm text-gray-900 capitalize">{notification.priority}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div>{new Date(notification.createdAt).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">{getTimeAgo(notification.createdAt)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            notification.isRead ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {notification.isRead ? 'Read' : 'Unread'}
                          </span>
                          {notification.actionRequired && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              Action Required
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          {!notification.isRead ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsUnread(notification.id);
                              }}
                              className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded"
                              title="Mark as unread"
                            >
                              <EyeOff className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotification(notification.id);
                            }}
                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                            title="Delete notification"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== 'all' || selectedPriority !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : "You're all caught up! No notifications to display."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;