import React, { useState, useEffect, useMemo } from 'react';
import { X, Save, UserPlus } from 'lucide-react';
import { OnboardingTaskTemplate } from '../../../types';

interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  category: 'documentation' | 'training' | 'equipment' | 'access' | 'meeting';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  dueDate: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
}

interface NewHire {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  startDate: string;
  manager: string;
  status: 'pre-boarding' | 'first-day' | 'first-week' | 'first-month' | 'completed';
  completedTasks: number;
  totalTasks: number;
  onboardingTasks: OnboardingTask[];
}

interface NewHireFormProps {
  newHire?: NewHire;
  onSave: (newHire: Omit<NewHire, 'id' | 'completedTasks' | 'totalTasks' | 'onboardingTasks'> | NewHire) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const NewHireForm: React.FC<NewHireFormProps> = ({
  newHire,
  onSave,
  onCancel,
  isOpen
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    department: '',
    startDate: '',
    manager: '',
    status: 'pre-boarding' as const
  });

  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const onboardingTemplates: OnboardingTaskTemplate[] = [
    {
      id: 'engineering-template',
      name: 'Engineering Onboarding',
      description: 'Complete onboarding for engineering roles',
      applicablePositions: ['Software Engineer', 'Senior Software Engineer', 'Frontend Developer', 'Backend Developer'],
      applicableDepartments: ['Engineering'],
      estimatedDuration: '2 weeks',
      isDefault: true,
      tasks: [
        {
          title: 'Setup Development Environment',
          description: 'Install necessary development tools and access repositories',
          category: 'equipment',
          priority: 'high',
          daysFromStart: 1,
          assignedTo: 'IT Team',
          isRequired: true
        },
        {
          title: 'Code Review Training',
          description: 'Learn company code review processes and standards',
          category: 'training',
          priority: 'medium',
          daysFromStart: 3,
          assignedTo: 'Tech Lead',
          isRequired: true
        }
      ]
    },
    {
      id: 'marketing-template',
      name: 'Marketing Onboarding',
      description: 'Complete onboarding for marketing roles',
      applicablePositions: ['Marketing Manager', 'Content Creator', 'Digital Marketing Specialist'],
      applicableDepartments: ['Marketing'],
      estimatedDuration: '1 week',
      isDefault: false,
      tasks: [
        {
          title: 'Brand Guidelines Training',
          description: 'Learn company brand guidelines and marketing standards',
          category: 'training',
          priority: 'high',
          daysFromStart: 1,
          assignedTo: 'Marketing Director',
          isRequired: true
        }
      ]
    }
  ];

  const previewTasks = useMemo(() => {
    if (!selectedTemplate) return [];
    
    const template = onboardingTemplates.find(t => t.id === selectedTemplate);
    if (!template) return [];
    
    const startDate = new Date(formData.startDate || Date.now());
    
    return template.tasks.map(task => ({
      ...task,
      id: `preview-${task.title.toLowerCase().replace(/\s+/g, '-')}`,
      status: 'pending' as const,
      dueDate: new Date(startDate.getTime() + task.daysFromStart * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
  }, [selectedTemplate, formData.startDate]);
  const departments = [
    'Engineering',
    'Marketing', 
    'Sales',
    'HR',
    'Finance',
    'Design',
    'Product',
    'Operations',
    'Customer Support',
    'Legal'
  ];

  const managers = [
    'Sarah Wilson',
    'John Smith',
    'Emily Rodriguez',
    'Michael Chen',
    'David Kim',
    'Lisa Johnson',
    'Robert Brown',
    'Jennifer Davis'
  ];

  const statuses = [
    { value: 'pre-boarding', label: 'Pre-boarding' },
    { value: 'first-day', label: 'First Day' },
    { value: 'first-week', label: 'First Week' },
    { value: 'first-month', label: 'First Month' },
    { value: 'completed', label: 'Completed' }
  ];

  useEffect(() => {
    if (newHire) {
      setFormData({
        firstName: newHire.firstName,
        lastName: newHire.lastName,
        email: newHire.email,
        position: newHire.position,
        department: newHire.department,
        startDate: newHire.startDate,
        manager: newHire.manager,
        status: newHire.status
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        position: '',
        department: '',
        startDate: '',
        manager: '',
        status: 'pre-boarding'
      });
    }
  }, [newHire, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newHire) {
      onSave({
        ...newHire,
        ...formData
      });
    } else {
      onSave(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTemplate(e.target.value);
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {newHire ? 'Edit New Hire' : 'Add New Hire'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="employee@empathoz.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position *
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter job title"
              />
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
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manager *
              </label>
              <select
                name="manager"
                value={formData.manager}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Manager</option>
                {managers.map(manager => (
                  <option key={manager} value={manager}>{manager}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Onboarding Status
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

          {/* Onboarding Template Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Onboarding Template
            </label>
            <select
              name="template"
              value={selectedTemplate}
              onChange={handleTemplateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Auto-select based on position/department</option>
              {onboardingTemplates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name} ({template.estimatedDuration})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {selectedTemplate 
                ? `Selected template will generate ${previewTasks.length} onboarding tasks`
                : 'Best template will be automatically selected based on position and department'
              }
            </p>
          </div>

          {/* Template Preview */}
          {previewTasks.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-3">
                Onboarding Tasks Preview ({previewTasks.length} tasks)
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {previewTasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-blue-800">{task.title}</span>
                    <span className="text-blue-600">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

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
              {newHire ? 'Update' : 'Create'} New Hire
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewHireForm;