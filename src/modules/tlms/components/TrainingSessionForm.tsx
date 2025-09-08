import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Users, Clock } from 'lucide-react';

interface TrainingSession {
  id: string;
  title: string;
  description: string;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  maxParticipants: number;
  enrolledCount: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  category: string;
  required: boolean;
}

interface TrainingSessionFormProps {
  trainingSession?: TrainingSession;
  onSave: (trainingSession: Omit<TrainingSession, 'id' | 'enrolledCount'> | TrainingSession) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const TrainingSessionForm: React.FC<TrainingSessionFormProps> = ({
  trainingSession,
  onSave,
  onCancel,
  isOpen
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    date: '',
    time: '',
    duration: '',
    location: '',
    maxParticipants: 25,
    status: 'scheduled' as const,
    category: '',
    required: false
  });

  const instructors = [
    'John Safety',
    'Sarah Leader',
    'Mike Compliance',
    'Emily Agile',
    'David Tech',
    'Lisa HR',
    'Robert Finance',
    'Jennifer Design',
    'Michael Engineering',
    'Amanda Marketing'
  ];

  const categories = [
    'Safety',
    'Leadership',
    'Compliance',
    'Project Management',
    'Technical Skills',
    'Soft Skills',
    'HR Policies',
    'Finance',
    'Marketing',
    'Design',
    'Engineering',
    'Customer Service',
    'Development',
    'Data Science',
    'Security'
  ];

  const locations = [
    'Conference Room A',
    'Conference Room B',
    'Training Center',
    'Main Auditorium',
    'Break Room',
    'Virtual',
    'Offsite Location',
    'Workshop Room',
    'Meeting Room 1',
    'Meeting Room 2'
  ];

  const statuses = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const durations = [
    '1 hour',
    '2 hours',
    '3 hours',
    '4 hours',
    '6 hours',
    '8 hours',
    '1 day',
    '2 days',
    '3 days',
    '1 week'
  ];

  useEffect(() => {
    if (trainingSession) {
      setFormData({
        title: trainingSession.title,
        description: trainingSession.description,
        instructor: trainingSession.instructor,
        date: trainingSession.date,
        time: trainingSession.time,
        duration: trainingSession.duration,
        location: trainingSession.location,
        maxParticipants: trainingSession.maxParticipants,
        status: trainingSession.status,
        category: trainingSession.category,
        required: trainingSession.required
      });
    } else {
      // Reset form with default values
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      setFormData({
        title: '',
        description: '',
        instructor: '',
        date: tomorrowStr,
        time: '09:00',
        duration: '4 hours',
        location: 'Conference Room A',
        maxParticipants: 25,
        status: 'scheduled',
        category: 'Safety',
        required: false
      });
    }
  }, [trainingSession, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (trainingSession) {
      onSave({
        ...trainingSession,
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
    } else if (name === 'maxParticipants') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
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
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {trainingSession ? 'Edit Training Session' : 'Schedule New Training'}
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
                Training Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter training session title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the training content and objectives..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructor *
                </label>
                <select
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Instructor</option>
                  {instructors.map(instructor => (
                    <option key={instructor} value={instructor}>{instructor}</option>
                  ))}
                </select>
              </div>
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
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Schedule & Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Schedule & Location</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Time *
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration *
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {durations.map(duration => (
                    <option key={duration} value={duration}>{duration}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Max Participants *
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  required
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="required"
                    checked={formData.required}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Required Training
                  </span>
                </label>
              </div>
            </div>
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {trainingSession ? 'Update' : 'Schedule'} Training
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainingSessionForm;