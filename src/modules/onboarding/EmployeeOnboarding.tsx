import React, { useState } from 'react';
import { UserPlus, CheckCircle, Clock, AlertCircle, Users, TrendingUp, FileText, Calendar, User, Search, Grid, List, Download, Settings, Filter } from 'lucide-react';
import NewHireForm from './components/NewHireForm';
import NewHireTable from './components/NewHireTable';
import OnboardingAdvancedExportPage from './components/OnboardingAdvancedExportPage';
import OnboardingTaskForm from './components/OnboardingTaskForm';

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

const EmployeeOnboarding: React.FC = () => {
  const [newHires, setNewHires] = useState<NewHire[]>([
    {
      id: 'NH001',
      firstName: 'Emma',
      lastName: 'Johnson',
      email: 'emma.johnson@empathoz.com',
      position: 'Software Engineer',
      department: 'Engineering',
      startDate: '2025-01-15',
      manager: 'Sarah Wilson',
      status: 'first-week',
      completedTasks: 8,
      totalTasks: 12,
      onboardingTasks: [
        {
          id: 'T001',
          title: 'Complete I-9 Form',
          description: 'Submit employment eligibility verification documents',
          category: 'documentation',
          status: 'completed',
          dueDate: '2025-01-20',
          assignedTo: 'HR Team',
          priority: 'high'
        },
        {
          id: 'T002',
          title: 'IT Equipment Setup',
          description: 'Laptop, monitor, and access credentials configuration',
          category: 'equipment',
          status: 'completed',
          dueDate: '2025-01-18',
          assignedTo: 'IT Department',
          priority: 'high'
        },
        {
          id: 'T003',
          title: 'Security Training',
          description: 'Complete mandatory cybersecurity awareness training',
          category: 'training',
          status: 'completed',
          dueDate: '2025-01-25',
          assignedTo: 'Security Team',
          priority: 'medium'
        }
      ]
    },
    {
      id: 'NH002',
      firstName: 'James',
      lastName: 'Rodriguez',
      email: 'james.rodriguez@empathoz.com',
      position: 'Marketing Manager',
      department: 'Marketing',
      startDate: '2025-02-01',
      manager: 'John Smith',
      status: 'pre-boarding',
      completedTasks: 4,
      totalTasks: 12,
      onboardingTasks: [
        {
          id: 'T004',
          title: 'Complete I-9 Form',
          description: 'Submit employment eligibility verification documents',
          category: 'documentation',
          status: 'completed',
          dueDate: '2025-01-28',
          assignedTo: 'HR Team',
          priority: 'high'
        },
        {
          id: 'T005',
          title: 'IT Equipment Setup',
          description: 'Laptop, monitor, and access credentials configuration',
          category: 'equipment',
          status: 'in-progress',
          dueDate: '2025-01-30',
          assignedTo: 'IT Department',
          priority: 'high'
        },
        {
          id: 'T006',
          title: 'Security Training',
          description: 'Complete mandatory cybersecurity awareness training',
          category: 'training',
          status: 'pending',
          dueDate: '2025-02-05',
          assignedTo: 'Security Team',
          priority: 'medium'
        }
      ]
    },
    {
      id: 'NH003',
      firstName: 'Sophia',
      lastName: 'Chen',
      email: 'sophia.chen@empathoz.com',
      position: 'UX Designer',
      department: 'Design',
      startDate: '2025-01-08',
      manager: 'Emily Rodriguez',
      status: 'first-month',
      completedTasks: 11,
      totalTasks: 12,
      onboardingTasks: [
        {
          id: 'T007',
          title: '30-Day Check-in Meeting',
          description: 'Review progress, feedback, and address any concerns',
          category: 'meeting',
          status: 'pending',
          dueDate: '2025-02-08',
          assignedTo: 'Emily Rodriguez',
          priority: 'medium'
        }
      ]
    },
    {
      id: 'NH004',
      firstName: 'Michael',
      lastName: 'Thompson',
      email: 'michael.thompson@empathoz.com',
      position: 'Sales Representative',
      department: 'Sales',
      startDate: '2025-01-22',
      manager: 'Mike Johnson',
      status: 'first-day',
      completedTasks: 6,
      totalTasks: 12,
      onboardingTasks: [
        {
          id: 'T008',
          title: 'Team Introduction Meeting',
          description: 'Meet with sales team members and key stakeholders',
          category: 'meeting',
          status: 'completed',
          dueDate: '2025-01-23',
          assignedTo: 'Mike Johnson',
          priority: 'medium'
        },
        {
          id: 'T009',
          title: 'Access to Sales Tools',
          description: 'Setup accounts for CRM, sales analytics, and communication tools',
          category: 'access',
          status: 'in-progress',
          dueDate: '2025-01-25',
          assignedTo: 'IT Department',
          priority: 'high'
        }
      ]
    },
    {
      id: 'NH005',
      firstName: 'David',
      lastName: 'Kim',
      email: 'david.kim@empathoz.com',
      position: 'Product Manager',
      department: 'Product',
      startDate: '2025-01-08',
      manager: 'Emily Rodriguez',
      status: 'completed',
      completedTasks: 12,
      totalTasks: 12,
      onboardingTasks: [
        {
          id: 'T010',
          title: '30-Day Check-in Meeting',
          description: 'Review progress, feedback, and address any concerns',
          category: 'meeting',
          status: 'completed',
          dueDate: '2025-02-08',
          assignedTo: 'Emily Rodriguez',
          priority: 'medium'
        },
        {
          id: 'T011',
          title: 'Design System Training',
          description: 'Complete advanced training on company design system',
          category: 'training',
          status: 'completed',
          dueDate: '2025-01-25',
          assignedTo: 'Design Team',
          priority: 'medium'
        }
      ]
    },
    {
      id: 'NH006',
      firstName: 'Rachel',
      lastName: 'Green',
      email: 'rachel.green@empathoz.com',
      position: 'HR Specialist',
      department: 'HR',
      startDate: '2025-01-29',
      manager: 'Lisa Chen',
      status: 'first-day',
      completedTasks: 3,
      totalTasks: 12,
      onboardingTasks: [
        {
          id: 'T012',
          title: 'Complete I-9 Form',
          description: 'Submit employment eligibility verification documents',
          category: 'documentation',
          status: 'completed',
          dueDate: '2025-02-03',
          assignedTo: 'HR Team',
          priority: 'high'
        },
        {
          id: 'T013',
          title: 'IT Equipment Setup',
          description: 'Laptop, monitor, and access credentials configuration',
          category: 'equipment',
          status: 'completed',
          dueDate: '2025-01-31',
          assignedTo: 'IT Department',
          priority: 'high'
        },
        {
          id: 'T014',
          title: 'HR Systems Training',
          description: 'Training on HRIS, payroll, and employee management systems',
          category: 'training',
          status: 'in-progress',
          dueDate: '2025-02-05',
          assignedTo: 'HR Team',
          priority: 'high'
        }
      ]
    },
    {
      id: 'NH007',
      firstName: 'Alex',
      lastName: 'Turner',
      email: 'alex.turner@empathoz.com',
      position: 'Finance Analyst',
      department: 'Finance',
      startDate: '2025-01-20',
      manager: 'David Kim',
      status: 'first-week',
      completedTasks: 7,
      totalTasks: 12,
      onboardingTasks: [
        {
          id: 'T015',
          title: 'Financial Systems Access',
          description: 'Setup access to SAP, QuickBooks, and financial reporting tools',
          category: 'access',
          status: 'completed',
          dueDate: '2025-01-25',
          assignedTo: 'IT Department',
          priority: 'high'
        },
        {
          id: 'T016',
          title: 'Compliance Training',
          description: 'Complete SOX compliance and financial regulations training',
          category: 'training',
          status: 'in-progress',
          dueDate: '2025-02-01',
          assignedTo: 'Finance Team',
          priority: 'high'
        }
      ]
    },
    {
      id: 'NH008',
      firstName: 'Maria',
      lastName: 'Garcia',
      email: 'maria.garcia@empathoz.com',
      position: 'Customer Success Manager',
      department: 'Customer Support',
      startDate: '2025-02-05',
      manager: 'Robert Brown',
      status: 'pre-boarding',
      completedTasks: 2,
      totalTasks: 12,
      onboardingTasks: [
        {
          id: 'T017',
          title: 'Background Check Completion',
          description: 'Complete background verification process',
          category: 'documentation',
          status: 'completed',
          dueDate: '2025-02-01',
          assignedTo: 'HR Team',
          priority: 'high'
        },
        {
          id: 'T018',
          title: 'Customer Support Tools Training',
          description: 'Training on Zendesk, Intercom, and customer management systems',
          category: 'training',
          status: 'pending',
          dueDate: '2025-02-10',
          assignedTo: 'Customer Support Team',
          priority: 'medium'
        }
      ]
    }
  ]);
  const [showAdvancedExport, setShowAdvancedExport] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [showForm, setShowForm] = useState(false);
  const [editingNewHire, setEditingNewHire] = useState<NewHire | undefined>();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [managingTasksForHire, setManagingTasksForHire] = useState<NewHire | undefined>();

  const departments = [...new Set(newHires.map(hire => hire.department))];
  const managers = [...new Set(newHires.map(hire => hire.manager))];

  const filteredHires = newHires.filter(hire => {
    const matchesSearch = 
      hire.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hire.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hire.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hire.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'active-only' && hire.status !== 'completed') ||
      (selectedStatus !== 'active-only' && hire.status === selectedStatus);
    const matchesDepartment = selectedDepartment === 'all' || hire.department === selectedDepartment;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const handleSaveNewHire = (newHireData: Omit<NewHire, 'id' | 'completedTasks' | 'totalTasks' | 'onboardingTasks'> | NewHire) => {
    if ('id' in newHireData) {
      // Update existing new hire
      const updatedHires = newHires.map(hire => 
        hire.id === newHireData.id ? newHireData : hire
      );
      setNewHires(updatedHires);
    } else {
      // Add new hire with default onboarding tasks
      const defaultTasks: OnboardingTask[] = [
        {
          id: '1',
          title: 'Complete I-9 Form',
          description: 'Submit employment eligibility verification documents',
          category: 'documentation',
          status: 'pending',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
          assignedTo: 'HR Team',
          priority: 'high'
        },
        {
          id: '2',
          title: 'IT Equipment Setup',
          description: 'Laptop, monitor, and access credentials configuration',
          category: 'equipment',
          status: 'pending',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
          assignedTo: 'IT Department',
          priority: 'high'
        },
        {
          id: '3',
          title: 'Security Training',
          description: 'Complete mandatory cybersecurity awareness training',
          category: 'training',
          status: 'pending',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
          assignedTo: 'Security Team',
          priority: 'medium'
        }
      ];

      const newHire: NewHire = {
        ...newHireData,
        id: Date.now().toString(),
        completedTasks: 0,
        totalTasks: defaultTasks.length,
        onboardingTasks: defaultTasks
      };
      setNewHires([...newHires, newHire]);
    }
    setShowForm(false);
    setEditingNewHire(undefined);
  };

  const handleStatsCardClick = (filterType: 'total' | 'active' | 'completed', filterValue?: string) => {
    if (filterType === 'total') {
      // Clear all filters to show all new hires
      setSelectedStatus('all');
      setSelectedDepartment('all');
    } else if (filterType === 'active') {
      // Filter to show only active onboarding (less than 100% progress)
      setSelectedStatus('all');
      setSelectedDepartment('all');
      setSelectedStatus('active-only');
    } else if (filterType === 'completed') {
      // Filter to show only completed onboarding
      setSelectedStatus('completed');
      setSelectedDepartment('all');
    }
    // Clear search term when applying filter from stats
    setSearchTerm('');
  };

  const handleExportNewHires = () => {
    const csvContent = [
      ['First Name', 'Last Name', 'Email', 'Position', 'Department', 'Start Date', 'Manager', 'Status', 'Completed Tasks', 'Total Tasks', 'Progress %'].join(','),
      ...filteredHires.map(hire => [
        `"${hire.firstName}"`,
        `"${hire.lastName}"`,
        hire.email,
        `"${hire.position}"`,
        hire.department,
        hire.startDate,
        `"${hire.manager}"`,
        hire.status,
        hire.completedTasks.toString(),
        hire.totalTasks.toString(),
        Math.round((hire.completedTasks / hire.totalTasks) * 100).toString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `onboarding-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleEditNewHire = (hire: NewHire) => {
    setEditingNewHire(hire);
    setShowForm(true);
  };

  const handleDeleteNewHire = (id: string) => {
    if (window.confirm('Are you sure you want to delete this new hire?')) {
      setNewHires(newHires.filter(hire => hire.id !== id));
    }
  };

  const handleManageTasks = (hire: NewHire) => {
    setManagingTasksForHire(hire);
    setShowTaskForm(true);
  };

  const handleSaveTasks = (tasks: OnboardingTask[]) => {
    if (!managingTasksForHire) return;
    
    const updatedHires = newHires.map(hire => 
      hire.id === managingTasksForHire.id 
        ? { 
            ...hire, 
            onboardingTasks: tasks,
            totalTasks: tasks.length,
            completedTasks: tasks.filter(t => t.status === 'completed').length
          }
        : hire
    );
    setNewHires(updatedHires);
    setShowTaskForm(false);
    setManagingTasksForHire(undefined);
  };

  const handleCreateEmployeeProfile = async (hire: NewHire) => {
    try {
      // Create employee profile from new hire data
      const employeeData = {
        firstName: hire.firstName,
        lastName: hire.lastName,
        email: hire.email,
        position: hire.position,
        department: hire.department,
        manager: hire.manager,
        startDate: hire.startDate,
        status: 'active' as const,
        employeeId: `EMP${Date.now()}`,
        phone: '',
        address: '',
        salary: 0,
        benefits: [],
        performanceReviews: [],
        documents: []
      };
      
      await dataService.addEmployee(employeeData);
      
      // Update new hire status to indicate profile created
      const updatedHires = newHires.map(h => 
        h.id === hire.id 
          ? { ...h, status: 'first-week' as const }
          : h
      );
      setNewHires(updatedHires);
      
      alert('Employee profile created successfully!');
    } catch (error) {
      console.error('Error creating employee profile:', error);
      alert('Failed to create employee profile. Please try again.');
    }
  };

  const handleEnrollInTraining = async (hire: NewHire) => {
    try {
      // Find corresponding employee record
      const employees = await dataService.getEmployees();
      const employee = employees.find(emp => emp.email === hire.email);
      
      if (!employee) {
        alert('Employee profile not found. Please create an employee profile first.');
        return;
      }
      
      // Enroll in mandatory training for their department
      await dataService.enrollEmployeeInMandatoryTraining(employee.id, employee.department);
      
      // Update new hire to reflect training enrollment
      const updatedHires = newHires.map(h => 
        h.id === hire.id 
          ? { 
              ...h, 
              onboardingTasks: [
                ...h.onboardingTasks,
                {
                  id: `training-${Date.now()}`,
                  title: 'Complete Onboarding Training',
                  description: 'Complete the mandatory onboarding training course',
                  category: 'training' as const,
                  status: 'in-progress' as const,
                  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  assignedTo: 'Training Team',
                  priority: 'medium' as const
                }
              ],
              totalTasks: h.totalTasks + 1
            }
          : h
      );
      setNewHires(updatedHires);
      
      alert('Successfully enrolled in onboarding training!');
    } catch (error) {
      console.error('Error enrolling in training:', error);
      alert('Failed to enroll in training. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pre-boarding': return 'bg-blue-100 text-blue-800';
      case 'first-day': return 'bg-green-100 text-green-800';
      case 'first-week': return 'bg-yellow-100 text-yellow-800';
      case 'first-month': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'documentation': return <FileText className="w-4 h-4" />;
      case 'training': return <Users className="w-4 h-4" />;
      case 'equipment': return <UserPlus className="w-4 h-4" />;
      case 'access': return <CheckCircle className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getStats = () => {
    const totalHires = newHires.length;
    const activeOnboarding = newHires.filter(h => h.status !== 'completed').length;
    const completedTasks = newHires.reduce((sum, hire) => sum + hire.completedTasks, 0);
    const totalTasks = newHires.reduce((sum, hire) => sum + hire.totalTasks, 0);
    const avgCompletion = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return { totalHires, activeOnboarding, completedTasks, totalTasks, avgCompletion };
  };

  const stats = getStats();

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employee Onboarding</h1>
            <p className="text-gray-600 mt-1">Streamline new hire processes and track onboarding progress</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search new hires..."
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
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            <button 
              onClick={() => {
                setEditingNewHire(undefined);
                setShowForm(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add New Hire
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div 
            onClick={() => handleStatsCardClick('total')}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 group-hover:text-blue-700">Total New Hires</p>
                <p className="text-2xl font-bold text-gray-900 group-hover:text-blue-800">{stats.totalHires}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <UserPlus className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 group-hover:text-blue-600">
              Click to show all new hires
            </div>
          </div>
          <div 
            onClick={() => handleStatsCardClick('active')}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-yellow-300 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 group-hover:text-yellow-700">Active Onboarding</p>
                <p className="text-2xl font-bold text-gray-900 group-hover:text-yellow-800">{stats.activeOnboarding}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                <Clock className="w-6 h-6 text-yellow-600 group-hover:text-yellow-700" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 group-hover:text-yellow-600">
              Click to filter active onboarding
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tasks Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedTasks}/{stats.totalTasks}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div 
            onClick={() => handleStatsCardClick('completed')}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-green-300 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 group-hover:text-green-700">Completed Onboarding</p>
                <p className="text-2xl font-bold text-gray-900 group-hover:text-green-800">{newHires.filter(h => h.status === 'completed').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <CheckCircle className="w-6 h-6 text-green-600 group-hover:text-green-700" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 group-hover:text-green-600">
              Click to filter completed onboarding
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search new hires..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pre-boarding">Pre-boarding</option>
              <option value="first-day">First Day</option>
              <option value="first-week">First Week</option>
              <option value="first-month">First Month</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
              <button 
                onClick={handleExportNewHires}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                title="Export filtered candidates to CSV"
              >
                <TrendingUp className="w-4 h-4" />
                Export
              </button>
              <button 
                onClick={() => setShowAdvancedFilters(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                title="Advanced filtering and export options"
              >
                <Settings className="w-4 h-4" />
                Advanced Filters
              </button>
             
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredHires.map(hire => (
            <div key={hire.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {hire.firstName.charAt(0)}{hire.lastName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {hire.firstName} {hire.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{hire.position}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(hire.status)}`}>
                  {hire.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditNewHire(hire)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Department: {hire.department}</span>
                  <span>Manager: {hire.manager}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Start Date: {new Date(hire.startDate).toLocaleDateString()}</span>
                  <span>Progress: {hire.completedTasks}/{hire.totalTasks}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Onboarding Progress</span>
                  <span className="font-medium">{Math.round((hire.completedTasks / hire.totalTasks) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(hire.completedTasks / hire.totalTasks) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900">Recent Tasks</h4>
                {hire.onboardingTasks.slice(0, 3).map(task => (
                  <div key={task.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    {getCategoryIcon(task.category)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                        <span className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => handleManageTasks(hire)}
                  className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Manage Onboarding Tasks
                </button>
              </div>
            </div>
          ))}
          </div>
        ) : (
          <NewHireTable
            newHires={filteredHires}
            onEdit={handleEditNewHire}
            onDelete={handleDeleteNewHire}
            onCreateEmployeeProfile={handleCreateEmployeeProfile}
            onEnrollInTraining={handleEnrollInTraining}
            onManageTasks={handleManageTasks}
          />
        )}

        {filteredHires.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No new hires found</h3>
            <p className="text-gray-600">Try adjusting your filter criteria</p>
          </div>
        )}
      </div>

      {/* New Hire Form Modal */}
      <NewHireForm
        newHire={editingNewHire}
        onSave={handleSaveNewHire}
        onCancel={() => {
          setShowForm(false);
          setEditingNewHire(undefined);
        }}
        isOpen={showForm}
      />

      {/* Onboarding Task Form Modal */}
      {managingTasksForHire && (
        <OnboardingTaskForm
          newHire={managingTasksForHire}
          onSave={handleSaveTasks}
          onCancel={() => {
            setShowTaskForm(false);
            setManagingTasksForHire(undefined);
          }}
          isOpen={showTaskForm}
        />
      )}

      {/* Advanced Filters Page */}
      {showAdvancedFilters && (
        <div className="fixed inset-0 bg-white z-50">
          <OnboardingAdvancedExportPage 
            onBack={() => setShowAdvancedFilters(false)}
            newHires={newHires}
            departments={departments}
            statuses={['pre-boarding', 'first-day', 'first-week', 'first-month', 'completed']}
            managers={managers}
          />
        </div>
      )}
    </div>
  );
};

export default EmployeeOnboarding;