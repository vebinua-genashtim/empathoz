import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Calendar, User, AlertTriangle, Clock, FileText, Users, Settings, CheckCircle } from 'lucide-react';
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
  isRequired: boolean;
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

interface OnboardingTaskFormProps {
  newHire: NewHire;
  onSave: (tasks: OnboardingTask[]) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const OnboardingTaskForm: React.FC<OnboardingTaskFormProps> = ({
  newHire,
  onSave,
  onCancel,
  isOpen
}) => {
  const [tasks, setTasks] = useState<OnboardingTask[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [showTemplateWarning, setShowTemplateWarning] = useState(false);

  // Mock onboarding templates - in real app, these would come from dataService
  const onboardingTemplates: OnboardingTaskTemplate[] = [
    {
      id: 'engineering-template',
      name: 'Engineering Onboarding',
      description: 'Complete onboarding for engineering roles',
      applicablePositions: ['Software Engineer', 'Senior Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer'],
      applicableDepartments: ['Engineering'],
      estimatedDuration: '2 weeks',
      isDefault: true,
      tasks: [
        {
          title: 'Complete I-9 Form',
          description: 'Submit employment eligibility verification documents',
          category: 'documentation',
          priority: 'high',
          daysFromStart: 1,
          assignedTo: 'HR Team',
          isRequired: true
        },
        {
          title: 'IT Equipment Setup',
          description: 'Laptop, monitor, and development environment configuration',
          category: 'equipment',
          priority: 'high',
          daysFromStart: 1,
          assignedTo: 'IT Department',
          isRequired: true
        },
        {
          title: 'Setup Development Environment',
          description: 'Install necessary development tools and access repositories',
          category: 'equipment',
          priority: 'high',
          daysFromStart: 2,
          assignedTo: 'Tech Lead',
          isRequired: true
        },
        {
          title: 'Security Training',
          description: 'Complete mandatory cybersecurity awareness training',
          category: 'training',
          priority: 'medium',
          daysFromStart: 3,
          assignedTo: 'Security Team',
          isRequired: true
        },
        {
          title: 'Code Review Training',
          description: 'Learn company code review processes and standards',
          category: 'training',
          priority: 'medium',
          daysFromStart: 5,
          assignedTo: 'Tech Lead',
          isRequired: true
        },
        {
          title: 'Team Introduction Meeting',
          description: 'Meet with engineering team members and key stakeholders',
          category: 'meeting',
          priority: 'medium',
          daysFromStart: 2,
          assignedTo: 'Engineering Manager',
          isRequired: true
        },
        {
          title: 'Architecture Overview Session',
          description: 'Learn about system architecture and technical stack',
          category: 'training',
          priority: 'medium',
          daysFromStart: 7,
          assignedTo: 'Senior Engineer',
          isRequired: true
        },
        {
          title: 'First Code Commit',
          description: 'Make first code contribution to the codebase',
          category: 'training',
          priority: 'low',
          daysFromStart: 10,
          assignedTo: 'Tech Lead',
          isRequired: false
        },
        {
          title: '1-Week Check-in Meeting',
          description: 'Review progress, feedback, and address any concerns',
          category: 'meeting',
          priority: 'medium',
          daysFromStart: 7,
          assignedTo: 'Engineering Manager',
          isRequired: true
        },
        {
          title: '2-Week Review Meeting',
          description: 'Comprehensive review of onboarding progress and next steps',
          category: 'meeting',
          priority: 'high',
          daysFromStart: 14,
          assignedTo: 'Engineering Manager',
          isRequired: true
        }
      ]
    },
    {
      id: 'marketing-template',
      name: 'Marketing Onboarding',
      description: 'Complete onboarding for marketing roles',
      applicablePositions: ['Marketing Manager', 'Content Creator', 'Digital Marketing Specialist', 'Marketing Coordinator'],
      applicableDepartments: ['Marketing'],
      estimatedDuration: '1 week',
      isDefault: false,
      tasks: [
        {
          title: 'Complete I-9 Form',
          description: 'Submit employment eligibility verification documents',
          category: 'documentation',
          priority: 'high',
          daysFromStart: 1,
          assignedTo: 'HR Team',
          isRequired: true
        },
        {
          title: 'IT Equipment Setup',
          description: 'Laptop, monitor, and marketing tools access',
          category: 'equipment',
          priority: 'high',
          daysFromStart: 1,
          assignedTo: 'IT Department',
          isRequired: true
        },
        {
          title: 'Brand Guidelines Training',
          description: 'Learn company brand guidelines and marketing standards',
          category: 'training',
          priority: 'high',
          daysFromStart: 2,
          assignedTo: 'Marketing Director',
          isRequired: true
        },
        {
          title: 'Marketing Tools Access',
          description: 'Setup accounts for marketing automation, analytics, and design tools',
          category: 'access',
          priority: 'medium',
          daysFromStart: 2,
          assignedTo: 'IT Department',
          isRequired: true
        },
        {
          title: 'Team Introduction Meeting',
          description: 'Meet with marketing team members and key stakeholders',
          category: 'meeting',
          priority: 'medium',
          daysFromStart: 1,
          assignedTo: 'Marketing Director',
          isRequired: true
        },
        {
          title: 'Campaign Strategy Overview',
          description: 'Learn about current marketing campaigns and strategies',
          category: 'training',
          priority: 'medium',
          daysFromStart: 3,
          assignedTo: 'Marketing Manager',
          isRequired: true
        },
        {
          title: '1-Week Review Meeting',
          description: 'Review progress, feedback, and address any concerns',
          category: 'meeting',
          priority: 'high',
          daysFromStart: 7,
          assignedTo: 'Marketing Director',
          isRequired: true
        }
      ]
    },
    {
      id: 'sales-template',
      name: 'Sales Onboarding',
      description: 'Complete onboarding for sales roles',
      applicablePositions: ['Sales Representative', 'Account Manager', 'Sales Manager', 'Business Development'],
      applicableDepartments: ['Sales'],
      estimatedDuration: '10 days',
      isDefault: false,
      tasks: [
        {
          title: 'Complete I-9 Form',
          description: 'Submit employment eligibility verification documents',
          category: 'documentation',
          priority: 'high',
          daysFromStart: 1,
          assignedTo: 'HR Team',
          isRequired: true
        },
        {
          title: 'IT Equipment Setup',
          description: 'Laptop, monitor, and sales tools access',
          category: 'equipment',
          priority: 'high',
          daysFromStart: 1,
          assignedTo: 'IT Department',
          isRequired: true
        },
        {
          title: 'CRM Training',
          description: 'Learn to use company CRM system and sales processes',
          category: 'training',
          priority: 'high',
          daysFromStart: 2,
          assignedTo: 'Sales Manager',
          isRequired: true
        },
        {
          title: 'Product Knowledge Training',
          description: 'Comprehensive training on company products and services',
          category: 'training',
          priority: 'high',
          daysFromStart: 3,
          assignedTo: 'Product Team',
          isRequired: true
        },
        {
          title: 'Sales Tools Access',
          description: 'Setup accounts for sales analytics, communication, and proposal tools',
          category: 'access',
          priority: 'medium',
          daysFromStart: 2,
          assignedTo: 'IT Department',
          isRequired: true
        },
        {
          title: 'Team Introduction Meeting',
          description: 'Meet with sales team members and key stakeholders',
          category: 'meeting',
          priority: 'medium',
          daysFromStart: 1,
          assignedTo: 'Sales Manager',
          isRequired: true
        },
        {
          title: 'Shadow Senior Sales Rep',
          description: 'Observe sales calls and learn best practices',
          category: 'training',
          priority: 'medium',
          daysFromStart: 5,
          assignedTo: 'Senior Sales Rep',
          isRequired: true
        },
        {
          title: 'First Sales Call',
          description: 'Conduct first sales call with supervision',
          category: 'training',
          priority: 'low',
          daysFromStart: 10,
          assignedTo: 'Sales Manager',
          isRequired: false
        }
      ]
    },
    {
      id: 'hr-template',
      name: 'HR Onboarding',
      description: 'Complete onboarding for HR roles',
      applicablePositions: ['HR Specialist', 'HR Manager', 'Recruiter', 'HR Coordinator'],
      applicableDepartments: ['HR'],
      estimatedDuration: '1 week',
      isDefault: false,
      tasks: [
        {
          title: 'Complete I-9 Form',
          description: 'Submit employment eligibility verification documents',
          category: 'documentation',
          priority: 'high',
          daysFromStart: 1,
          assignedTo: 'HR Team',
          isRequired: true
        },
        {
          title: 'IT Equipment Setup',
          description: 'Laptop, monitor, and HR systems access',
          category: 'equipment',
          priority: 'high',
          daysFromStart: 1,
          assignedTo: 'IT Department',
          isRequired: true
        },
        {
          title: 'HR Systems Training',
          description: 'Training on HRIS, payroll, and employee management systems',
          category: 'training',
          priority: 'high',
          daysFromStart: 2,
          assignedTo: 'HR Manager',
          isRequired: true
        },
        {
          title: 'Employment Law Training',
          description: 'Learn about employment laws and compliance requirements',
          category: 'training',
          priority: 'high',
          daysFromStart: 3,
          assignedTo: 'Legal Team',
          isRequired: true
        },
        {
          title: 'Confidentiality Agreement',
          description: 'Sign confidentiality and data protection agreements',
          category: 'documentation',
          priority: 'high',
          daysFromStart: 1,
          assignedTo: 'HR Team',
          isRequired: true
        },
        {
          title: 'Team Introduction Meeting',
          description: 'Meet with HR team members and key stakeholders',
          category: 'meeting',
          priority: 'medium',
          daysFromStart: 1,
          assignedTo: 'HR Manager',
          isRequired: true
        }
      ]
    },
    {
      id: 'general-template',
      name: 'General Employee Onboarding',
      description: 'Standard onboarding for all roles',
      applicablePositions: [],
      applicableDepartments: [],
      estimatedDuration: '1 week',
      isDefault: false,
      tasks: [
        {
          title: 'Complete I-9 Form',
          description: 'Submit employment eligibility verification documents',
          category: 'documentation',
          priority: 'high',
          daysFromStart: 1,
          assignedTo: 'HR Team',
          isRequired: true
        },
        {
          title: 'IT Equipment Setup',
          description: 'Laptop, monitor, and basic system access',
          category: 'equipment',
          priority: 'high',
          daysFromStart: 1,
          assignedTo: 'IT Department',
          isRequired: true
        },
        {
          title: 'Security Training',
          description: 'Complete mandatory cybersecurity awareness training',
          category: 'training',
          priority: 'medium',
          daysFromStart: 3,
          assignedTo: 'Security Team',
          isRequired: true
        },
        {
          title: 'Company Orientation',
          description: 'Learn about company culture, values, and policies',
          category: 'training',
          priority: 'medium',
          daysFromStart: 2,
          assignedTo: 'HR Team',
          isRequired: true
        },
        {
          title: 'Team Introduction Meeting',
          description: 'Meet with team members and direct manager',
          category: 'meeting',
          priority: 'medium',
          daysFromStart: 1,
          assignedTo: 'Direct Manager',
          isRequired: true
        },
        {
          title: '1-Week Check-in Meeting',
          description: 'Review progress, feedback, and address any concerns',
          category: 'meeting',
          priority: 'medium',
          daysFromStart: 7,
          assignedTo: 'Direct Manager',
          isRequired: true
        }
      ]
    }
  ];

  const categories = [
    { value: 'documentation', label: 'Documentation', icon: FileText },
    { value: 'training', label: 'Training', icon: Users },
    { value: 'equipment', label: 'Equipment', icon: Settings },
    { value: 'access', label: 'Access', icon: CheckCircle },
    { value: 'meeting', label: 'Meeting', icon: Calendar }
  ];

  const priorities = [
    { value: 'low', label: 'Low Priority', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High Priority', color: 'bg-red-100 text-red-800' }
  ];

  const assignees = [
    'HR Team',
    'IT Department',
    'Security Team',
    'Direct Manager',
    'Department Head',
    'Tech Lead',
    'Senior Engineer',
    'Engineering Manager',
    'Marketing Director',
    'Marketing Manager',
    'Sales Manager',
    'Senior Sales Rep',
    'Product Team',
    'Legal Team',
    'Finance Team',
    'Training Team'
  ];

  useEffect(() => {
    if (isOpen) {
      setTasks([...newHire.onboardingTasks]);
      setSelectedTemplate('');
      setShowTemplateWarning(false);
    }
  }, [isOpen, newHire]);

  const generateTaskId = () => {
    return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const calculateDueDate = (daysFromStart: number) => {
    const startDate = new Date(newHire.startDate);
    const dueDate = new Date(startDate.getTime() + daysFromStart * 24 * 60 * 60 * 1000);
    return dueDate.toISOString().split('T')[0];
  };

  const getApplicableTemplates = () => {
    return onboardingTemplates.filter(template => {
      const matchesPosition = template.applicablePositions.length === 0 || 
        template.applicablePositions.some(pos => 
          newHire.position.toLowerCase().includes(pos.toLowerCase())
        );
      const matchesDepartment = template.applicableDepartments.length === 0 || 
        template.applicableDepartments.includes(newHire.department);
      
      return matchesPosition || matchesDepartment;
    });
  };

  const handleApplyTemplate = () => {
    if (!selectedTemplate) return;
    
    const template = onboardingTemplates.find(t => t.id === selectedTemplate);
    if (!template) return;

    if (tasks.length > 0) {
      setShowTemplateWarning(true);
      return;
    }

    applyTemplateToTasks(template);
  };

  const applyTemplateToTasks = (template: OnboardingTaskTemplate) => {
    const templateTasks: OnboardingTask[] = template.tasks.map(taskDef => ({
      id: generateTaskId(),
      title: taskDef.title,
      description: taskDef.description,
      category: taskDef.category,
      status: 'pending',
      dueDate: calculateDueDate(taskDef.daysFromStart),
      assignedTo: taskDef.assignedTo,
      priority: taskDef.priority,
      isRequired: taskDef.isRequired
    }));

    setTasks(templateTasks);
    setShowTemplateWarning(false);
  };

  const handleOverwriteWithTemplate = () => {
    const template = onboardingTemplates.find(t => t.id === selectedTemplate);
    if (template) {
      applyTemplateToTasks(template);
    }
  };

  const addCustomTask = () => {
    const newTask: OnboardingTask = {
      id: generateTaskId(),
      title: '',
      description: '',
      category: 'documentation',
      status: 'pending',
      dueDate: calculateDueDate(1),
      assignedTo: 'HR Team',
      priority: 'medium',
      isRequired: true
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (taskId: string, updates: Partial<OnboardingTask>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const removeTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that all tasks have required fields
    const invalidTasks = tasks.filter(task => !task.title.trim() || !task.description.trim());
    if (invalidTasks.length > 0) {
      alert('Please fill in all required fields for all tasks.');
      return;
    }

    onSave(tasks);
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.value === category);
    if (categoryData) {
      const Icon = categoryData.icon;
      return <Icon className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'documentation': return 'bg-blue-100 text-blue-800';
      case 'training': return 'bg-green-100 text-green-800';
      case 'equipment': return 'bg-purple-100 text-purple-800';
      case 'access': return 'bg-orange-100 text-orange-800';
      case 'meeting': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const required = tasks.filter(t => t.isRequired).length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const overdue = tasks.filter(t => t.status !== 'completed' && new Date(t.dueDate) < new Date()).length;
    
    return { total, required, completed, pending, overdue };
  };

  const taskStats = getTaskStats();
  const applicableTemplates = getApplicableTemplates();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Manage Onboarding Tasks</h2>
              <p className="text-sm text-gray-600">
                {newHire.firstName} {newHire.lastName} • {newHire.position} • {newHire.department}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-900">{taskStats.total}</div>
            <div className="text-sm text-blue-700">Total Tasks</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-900">{taskStats.required}</div>
            <div className="text-sm text-red-700">Required</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-900">{taskStats.completed}</div>
            <div className="text-sm text-green-700">Completed</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-900">{taskStats.pending}</div>
            <div className="text-sm text-yellow-700">Pending</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-900">{taskStats.overdue}</div>
            <div className="text-sm text-red-700">Overdue</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Template Selection */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Apply Onboarding Template</h3>
            <p className="text-sm text-gray-600 mb-4">
              Choose a pre-defined template to quickly populate onboarding tasks based on the role and department.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Template
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a template...</option>
                  {applicableTemplates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name} ({template.tasks.length} tasks, {template.estimatedDuration})
                      {template.isDefault && ' - Recommended'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleApplyTemplate}
                  disabled={!selectedTemplate}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Apply Template
                </button>
              </div>
            </div>

            {selectedTemplate && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  {onboardingTemplates.find(t => t.id === selectedTemplate)?.name}
                </h4>
                <p className="text-sm text-blue-800 mb-3">
                  {onboardingTemplates.find(t => t.id === selectedTemplate)?.description}
                </p>
                <div className="text-sm text-blue-700">
                  <p>• {onboardingTemplates.find(t => t.id === selectedTemplate)?.tasks.length} tasks included</p>
                  <p>• Estimated duration: {onboardingTemplates.find(t => t.id === selectedTemplate)?.estimatedDuration}</p>
                  <p>• Tasks will be scheduled based on start date: {new Date(newHire.startDate).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </div>

          {/* Individual Tasks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Onboarding Tasks ({tasks.length})</h3>
              <button
                type="button"
                onClick={addCustomTask}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Custom Task
              </button>
            </div>

            {tasks.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Tasks Assigned</h4>
                <p className="text-gray-600 mb-4">Apply a template or add custom tasks to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task, index) => (
                  <div key={task.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Task {index + 1}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                          {getCategoryIcon(task.category)}
                          <span className="ml-1">{categories.find(c => c.value === task.category)?.label}</span>
                        </span>
                        {task.isRequired && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            Required
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTask(task.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Task Title *
                          </label>
                          <input
                            type="text"
                            value={task.title}
                            onChange={(e) => updateTask(task.id, { title: e.target.value })}
                            placeholder="Enter task title..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Due Date *
                          </label>
                          <input
                            type="date"
                            value={task.dueDate}
                            onChange={(e) => updateTask(task.id, { dueDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description *
                        </label>
                        <textarea
                          value={task.description}
                          onChange={(e) => updateTask(task.id, { description: e.target.value })}
                          placeholder="Describe what needs to be done..."
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                          </label>
                          <select
                            value={task.category}
                            onChange={(e) => updateTask(task.id, { category: e.target.value as OnboardingTask['category'] })}
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
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Priority
                          </label>
                          <select
                            value={task.priority}
                            onChange={(e) => updateTask(task.id, { priority: e.target.value as OnboardingTask['priority'] })}
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
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Assigned To
                          </label>
                          <select
                            value={task.assignedTo}
                            onChange={(e) => updateTask(task.id, { assignedTo: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {assignees.map(assignee => (
                              <option key={assignee} value={assignee}>
                                {assignee}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                          </label>
                          <select
                            value={task.status}
                            onChange={(e) => updateTask(task.id, { status: e.target.value as OnboardingTask['status'] })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="overdue">Overdue</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={task.isRequired}
                            onChange={(e) => updateTask(task.id, { isRequired: e.target.checked })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Required Task</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              Save Tasks ({tasks.length})
            </button>
          </div>
        </form>
      </div>

      {/* Template Warning Modal */}
      {showTemplateWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Replace Existing Tasks?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              This new hire already has {tasks.length} task{tasks.length !== 1 ? 's' : ''} assigned. 
              Applying this template will replace all existing tasks. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowTemplateWarning(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleOverwriteWithTemplate}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Replace Tasks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingTaskForm;