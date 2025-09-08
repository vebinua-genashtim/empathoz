import React, { useState, useEffect } from 'react';
import { Bell, X, Check, CheckCheck, Trash2, Clock, AlertCircle, Calendar, Settings, User } from 'lucide-react';
import { Notification, dataService } from '../services/dataService';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: string;
  onNavigateToPage?: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  currentUser,
  onNavigateToPage
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  useEffect(() => {
    if (isOpen) {
      refreshNotifications();
    }
  }, [isOpen, currentUser]);

  const refreshNotifications = () => {
    setNotifications(dataService.getNotifications(currentUser));
  };

  const handleMarkAsRead = (notificationId: string) => {
    dataService.markNotificationAsRead(notificationId);
    refreshNotifications();
  };

  const handleMarkAllAsRead = () => {
    dataService.markAllNotificationsAsRead(currentUser);
    refreshNotifications();
  };

  const handleDeleteNotification = (notificationId: string) => {
    dataService.deleteNotification(notificationId);
    refreshNotifications();
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

  const filteredNotifications = notifications.filter(notification => {
    const matchesCategory = selectedCategory === 'all' || notification.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || notification.priority === selectedPriority;
    return matchesCategory && matchesPriority;
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
  const categories = ['all', 'approval', 'leave', 'reminder', 'system'];
  const priorities = ['all', 'urgent', 'high', 'medium', 'low'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                <p className="text-sm text-gray-600">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>
                  {priority === 'all' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getNotificationColor(notification.type, notification.priority)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`}></div>
                          <span className="text-xs text-gray-500">{getTimeAgo(notification.createdAt)}</span>
                        </div>
                      </div>
                      
                      <p className={`text-sm ${!notification.isRead ? 'text-gray-700' : 'text-gray-600'} mb-2`}>
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
                          {!notification.isRead && (
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredNotifications.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span>
                  Showing {filteredNotifications.length} of {notifications.length} notifications
                </span>
                {onNavigateToPage && (
                  <button
                    onClick={() => {
                      onNavigateToPage();
                      onClose();
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All Notifications →
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span>{unreadCount} unread</span>
                <span>{notifications.filter(n => n.actionRequired && !n.isRead).length} require action</span>
                {onNavigateToPage && (
                  <button
                    onClick={() => {
                      onNavigateToPage();
                      onClose();
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All Notifications →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;