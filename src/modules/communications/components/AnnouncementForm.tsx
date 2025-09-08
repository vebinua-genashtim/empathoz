import React, { useState, useEffect } from 'react';
import { X, Save, MessageSquare, Pin } from 'lucide-react';

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

interface AnnouncementFormProps {
  announcement?: Announcement;
  onSave: (announcement: Omit<Announcement, 'id' | 'views'> | Announcement) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  announcement,
  onSave,
  onCancel,
  isOpen
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    department: '',
    priority: 'medium' as const,
    publishDate: '',
    isPinned: false,
    category: 'general' as const
  });

  const departments = [
    'Executive',
    'Human Resources',
    'Information Technology',
    'Engineering',
    'Marketing',
    'Sales',
    'Finance',
    'Design',
    'Product',
    'Operations',
    'Customer Support',
    'Legal'
  ];

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'hr', label: 'HR' },
    { value: 'it', label: 'IT' },
    { value: 'safety', label: 'Safety' },
    { value: 'events', label: 'Events' }
  ];

  const priorities = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' }
  ];

  const authors = [
    'HR Team',
    'Leadership Team',
    'IT Department',
    'Sarah Wilson',
    'John Smith',
    'Emily Rodriguez',
    'Michael Chen',
    'David Kim',
    'Lisa Johnson'
  ];

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title,
        content: announcement.content,
        author: announcement.author,
        department: announcement.department,
        priority: announcement.priority,
        publishDate: announcement.publishDate,
        isPinned: announcement.isPinned,
        category: announcement.category
      });
    } else {
      // Reset form with default values
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        title: '',
        content: '',
        author: 'HR Team',
        department: 'Human Resources',
        priority: 'medium',
        publishDate: today,
        isPinned: false,
        category: 'general'
      });
    }
  }, [announcement, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (announcement) {
      onSave({
        ...announcement,
        ...formData
      });
    } else {
      onSave(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {announcement ? 'Edit Announcement' : 'Create New Announcement'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Announcement Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter announcement title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Write your announcement content here..."
              />
            </div>
          </div>

          {/* Publishing Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Publishing Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author *
                </label>
                <select
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {authors.map(author => (
                    <option key={author} value={author}>{author}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority *
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publish Date *
                </label>
                <input
                  type="date"
                  name="publishDate"
                  value={formData.publishDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Options</h3>
            
            <div className="flex items-center gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isPinned"
                  checked={formData.isPinned}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center gap-1">
                  <Pin className="w-4 h-4" />
                  Pin this announcement
                </span>
              </label>
            </div>
            <p className="text-xs text-gray-500">
              Pinned announcements will appear at the top of the announcements list and be highlighted for better visibility.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {announcement ? 'Update' : 'Publish'} Announcement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementForm;