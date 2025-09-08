import React, { useState } from 'react';
import { 
  Download, 
  Calendar, 
  Filter, 
  FileText, 
  Users, 
  Clock, 
  CheckCircle, 
  Settings,
  Eye,
  RefreshCw,
  ArrowLeft,
  Database,
  BarChart3,
  UserPlus,
  Building2,
  XCircle
} from 'lucide-react';

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

interface OnboardingAdvancedExportPageProps {
  onBack: () => void;
  newHires: NewHire[];
  departments: string[];
  statuses: string[];
  managers: string[];
}

interface ExportFilters {
  dateRange: {
    start: string;
    end: string;
    preset: 'custom' | 'last-30-days' | 'last-90-days' | 'this-year' | 'last-year' | 'all-time';
  };
  newHires: string[];
  departments: string[];
  statuses: string[];
  managers: string[];
  progressRange: {
    min: number | null;
    max: number | null;
  };
  includeTaskDetails: boolean;
  includeManagerInfo: boolean;
  includeContactInfo: boolean;
  onlyOverdueTasks: boolean;
}

interface ExportFormat {
  type: 'csv' | 'excel' | 'pdf';
  name: string;
  description: string;
  icon: React.ComponentType<any>;
}

const OnboardingAdvancedExportPage: React.FC<OnboardingAdvancedExportPageProps> = ({ 
  onBack, 
  newHires, 
  departments, 
  statuses, 
  managers 
}) => {
  const [filters, setFilters] = useState<ExportFilters>({
    dateRange: {
      start: '',
      end: '',
      preset: 'this-year'
    },
    newHires: [],
    departments: [],
    statuses: [],
    managers: [],
    progressRange: {
      min: null,
      max: null
    },
    includeTaskDetails: true,
    includeManagerInfo: true,
    includeContactInfo: true,
    onlyOverdueTasks: false
  });

  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [previewData, setPreviewData] = useState<NewHire[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Hide body overflow when component mounts, restore when unmounts
  React.useEffect(() => {
    document.body.style.overflowY = 'hidden';
    
    return () => {
      document.body.style.overflowY = 'auto';
    };
  }, []);

  React.useEffect(() => {
    applyDatePreset('this-year');
  }, []);

  const exportFormats: ExportFormat[] = [
    {
      type: 'csv',
      name: 'CSV File',
      description: 'Comma-separated values for spreadsheet applications',
      icon: FileText
    },
    {
      type: 'excel',
      name: 'Excel Workbook',
      description: 'Microsoft Excel format with multiple sheets',
      icon: BarChart3
    },
    {
      type: 'pdf',
      name: 'PDF Report',
      description: 'Formatted report for printing and sharing',
      icon: Database
    }
  ];

  const datePresets = [
    { value: 'last-30-days', label: 'Last 30 Days' },
    { value: 'last-90-days', label: 'Last 90 Days' },
    { value: 'this-year', label: 'This Year' },
    { value: 'last-year', label: 'Last Year' },
    { value: 'all-time', label: 'All Time' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const applyDatePreset = (preset: string) => {
    const today = new Date();
    let start = '';
    let end = today.toISOString().split('T')[0];

    switch (preset) {
      case 'last-30-days':
        start = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case 'last-90-days':
        start = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case 'this-year':
        start = `${today.getFullYear()}-01-01`;
        break;
      case 'last-year':
        start = `${today.getFullYear() - 1}-01-01`;
        end = `${today.getFullYear() - 1}-12-31`;
        break;
      case 'all-time':
        start = '';
        end = '';
        break;
      case 'custom':
        // Keep existing dates
        return;
    }

    setFilters(prev => ({
      ...prev,
      dateRange: { ...prev.dateRange, start, end, preset: preset as any }
    }));
  };

  const getFilteredData = () => {
    return newHires.filter(hire => {
      // Date range filter (based on start date)
      if (filters.dateRange.start && new Date(hire.startDate) < new Date(filters.dateRange.start)) {
        return false;
      }
      if (filters.dateRange.end && new Date(hire.startDate) > new Date(filters.dateRange.end)) {
        return false;
      }

      // New hire filter
      if (filters.newHires.length > 0 && !filters.newHires.includes(hire.id)) {
        return false;
      }

      // Department filter
      if (filters.departments.length > 0 && !filters.departments.includes(hire.department)) {
        return false;
      }

      // Status filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(hire.status)) {
        return false;
      }

      // Manager filter
      if (filters.managers.length > 0 && !filters.managers.includes(hire.manager)) {
        return false;
      }

      // Progress range filter
      const progressPercentage = (hire.completedTasks / hire.totalTasks) * 100;
      if (filters.progressRange.min !== null && progressPercentage < filters.progressRange.min) {
        return false;
      }
      if (filters.progressRange.max !== null && progressPercentage > filters.progressRange.max) {
        return false;
      }

      // Overdue tasks filter
      if (filters.onlyOverdueTasks) {
        const hasOverdueTasks = hire.onboardingTasks.some(task => 
          task.status !== 'completed' && new Date(task.dueDate) < new Date()
        );
        if (!hasOverdueTasks) {
          return false;
        }
      }

      return true;
    });
  };

  const handlePreview = () => {
    const filtered = getFilteredData();
    setPreviewData(filtered);
    setShowPreview(true);
  };

  const handleExport = async () => {
    setIsGenerating(true);
    
    try {
      const filteredData = getFilteredData();
      
      if (selectedFormat === 'csv') {
        await exportToCSV(filteredData);
      } else if (selectedFormat === 'excel') {
        await exportToExcel(filteredData);
      } else if (selectedFormat === 'pdf') {
        await exportToPDF(filteredData);
      }
    } catch (error) {
      alert('Export failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const exportToCSV = async (data: NewHire[]) => {
    const headers = [
      'First Name',
      'Last Name',
      'Email',
      'Position',
      'Department',
      'Start Date',
      'Status',
      'Progress %',
      'Completed Tasks',
      'Total Tasks'
    ];

    if (filters.includeManagerInfo) {
      headers.push('Manager');
    }

    if (filters.includeContactInfo) {
      headers.push('Phone', 'Emergency Contact');
    }

    if (filters.includeTaskDetails) {
      headers.push('Pending Tasks', 'Overdue Tasks', 'Next Due Date');
    }

    const csvContent = [
      headers.join(','),
      ...data.map(hire => {
        const progressPercentage = Math.round((hire.completedTasks / hire.totalTasks) * 100);
        const pendingTasks = hire.onboardingTasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length;
        const overdueTasks = hire.onboardingTasks.filter(t => 
          t.status !== 'completed' && new Date(t.dueDate) < new Date()
        ).length;
        const nextDueDate = hire.onboardingTasks
          .filter(t => t.status !== 'completed')
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]?.dueDate || '';

        const row = [
          `"${hire.firstName}"`,
          `"${hire.lastName}"`,
          hire.email,
          `"${hire.position}"`,
          hire.department,
          hire.startDate,
          hire.status,
          progressPercentage.toString(),
          hire.completedTasks.toString(),
          hire.totalTasks.toString()
        ];

        if (filters.includeManagerInfo) {
          row.push(`"${hire.manager}"`);
        }

        if (filters.includeContactInfo) {
          row.push('', ''); // Placeholder for phone and emergency contact
        }

        if (filters.includeTaskDetails) {
          row.push(
            pendingTasks.toString(),
            overdueTasks.toString(),
            nextDueDate
          );
        }

        return row.join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `onboarding-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToExcel = async (data: NewHire[]) => {
    // Simulate Excel export (in real app, would use a library like xlsx)
    alert('Excel export would be implemented with a library like xlsx in a real application');
  };

  const exportToPDF = async (data: NewHire[]) => {
    // Simulate PDF export (in real app, would use a library like jsPDF)
    alert('PDF export would be implemented with a library like jsPDF in a real application');
  };

  const handleFilterChange = (key: keyof ExportFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleArrayFilterChange = (key: keyof Pick<ExportFilters, 'newHires' | 'departments' | 'statuses' | 'managers'>, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      dateRange: {
        start: '',
        end: '',
        preset: 'this-year'
      },
      newHires: [],
      departments: [],
      statuses: [],
      managers: [],
      progressRange: {
        min: null,
        max: null
      },
      includeTaskDetails: true,
      includeManagerInfo: true,
      includeContactInfo: true,
      onlyOverdueTasks: false
    });
    applyDatePreset('this-year');
  };

  const filteredData = getFilteredData();

  return (
    <div className="flex-1 bg-gray-50 max-h-screen overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Advanced Onboarding Export</h1>
              <p className="text-gray-600 mt-1">Configure detailed filters and export onboarding data</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePreview}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview ({filteredData.length})
            </button>
            <button
              onClick={handleExport}
              disabled={isGenerating || filteredData.length === 0}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isGenerating ? 'Generating...' : 'Export'}
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 pb-12">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Filters Panel */}
          <div className="xl:col-span-3">
            <div className="space-y-6">
              {/* Export Format Selection */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Format</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {exportFormats.map(format => {
                    const Icon = format.icon;
                    return (
                      <label key={format.type} className="cursor-pointer">
                        <input
                          type="radio"
                          name="exportFormat"
                          value={format.type}
                          checked={selectedFormat === format.type}
                          onChange={(e) => setSelectedFormat(e.target.value as any)}
                          className="sr-only"
                        />
                        <div className={`p-4 rounded-lg border-2 transition-all ${
                          selectedFormat === format.type
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <div className="flex items-center gap-3 mb-2">
                            <Icon className={`w-6 h-6 ${
                              selectedFormat === format.type ? 'text-blue-600' : 'text-gray-600'
                            }`} />
                            <h3 className={`font-medium ${
                              selectedFormat === format.type ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {format.name}
                            </h3>
                          </div>
                          <p className={`text-sm ${
                            selectedFormat === format.type ? 'text-blue-700' : 'text-gray-600'
                          }`}>
                            {format.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Date Range (Start Date)</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quick Presets
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {datePresets.map(preset => (
                        <button
                          key={preset.value}
                          onClick={() => {
                            setFilters(prev => ({
                              ...prev,
                              dateRange: { ...prev.dateRange, preset: preset.value as any }
                            }));
                            applyDatePreset(preset.value);
                          }}
                          className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                            filters.dateRange.preset === preset.value
                              ? 'bg-blue-50 border-blue-300 text-blue-700'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filters.dateRange.preset === 'custom' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={filters.dateRange.start}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            dateRange: { ...prev.dateRange, start: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={filters.dateRange.end}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            dateRange: { ...prev.dateRange, end: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Filters */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Filters</h2>
                
                <div className="space-y-6">
                  {/* New Hires */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Hires ({filters.newHires.length} selected)
                    </label>
                    <div className="border border-gray-300 rounded-lg p-3 max-h-32 overflow-y-auto">
                      <div className="space-y-2">
                        {newHires.map(hire => (
                          <label key={hire.id} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.newHires.includes(hire.id)}
                              onChange={() => handleArrayFilterChange('newHires', hire.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {hire.firstName} {hire.lastName} - {hire.position}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    {filters.newHires.length === 0 && (
                      <p className="text-xs text-gray-500 mt-1">All new hires will be included</p>
                    )}
                  </div>

                  {/* Departments */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departments ({filters.departments.length} selected)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {departments.map(dept => (
                        <label key={dept} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.departments.includes(dept)}
                            onChange={() => handleArrayFilterChange('departments', dept)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{dept}</span>
                        </label>
                      ))}
                    </div>
                    {filters.departments.length === 0 && (
                      <p className="text-xs text-gray-500 mt-1">All departments will be included</p>
                    )}
                  </div>

                  {/* Statuses */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Onboarding Status ({filters.statuses.length} selected)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {statuses.map(status => (
                        <label key={status} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.statuses.includes(status)}
                            onChange={() => handleArrayFilterChange('statuses', status)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </span>
                        </label>
                      ))}
                    </div>
                    {filters.statuses.length === 0 && (
                      <p className="text-xs text-gray-500 mt-1">All statuses will be included</p>
                    )}
                  </div>

                  {/* Managers */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Managers ({filters.managers.length} selected)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {managers.map(manager => (
                        <label key={manager} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.managers.includes(manager)}
                            onChange={() => handleArrayFilterChange('managers', manager)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{manager}</span>
                        </label>
                      ))}
                    </div>
                    {filters.managers.length === 0 && (
                      <p className="text-xs text-gray-500 mt-1">All managers will be included</p>
                    )}
                  </div>

                  {/* Progress Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Progress Range (%)
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input
                          type="number"
                          value={filters.progressRange.min || ''}
                          onChange={(e) => handleFilterChange('progressRange', {
                            ...filters.progressRange,
                            min: e.target.value ? parseInt(e.target.value) : null
                          })}
                          placeholder="Min %"
                          min="0"
                          max="100"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={filters.progressRange.max || ''}
                          onChange={(e) => handleFilterChange('progressRange', {
                            ...filters.progressRange,
                            max: e.target.value ? parseInt(e.target.value) : null
                          })}
                          placeholder="Max %"
                          min="0"
                          max="100"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Export Options */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h2>
                
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.includeTaskDetails}
                      onChange={(e) => handleFilterChange('includeTaskDetails', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Include Task Details (Pending, Overdue, Next Due Date)</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.includeManagerInfo}
                      onChange={(e) => handleFilterChange('includeManagerInfo', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Include Manager Information</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.includeContactInfo}
                      onChange={(e) => handleFilterChange('includeContactInfo', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Include Contact Information</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.onlyOverdueTasks}
                      onChange={(e) => handleFilterChange('onlyOverdueTasks', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Only New Hires with Overdue Tasks</span>
                  </label>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Reset Filters</h3>
                    <p className="text-sm text-gray-600">Clear all applied filters and return to defaults</p>
                  </div>
                  <button
                    onClick={clearAllFilters}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Panel */}
          <div className="xl:col-span-1 space-y-6">
            {/* Export Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Summary</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">New Hires to Export</span>
                  </div>
                  <span className="text-xl font-bold text-blue-900">{filteredData.length}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Pre-boarding:</span>
                    <span className="font-medium">{filteredData.filter(h => h.status === 'pre-boarding').length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">First Day:</span>
                    <span className="font-medium">{filteredData.filter(h => h.status === 'first-day').length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">First Week:</span>
                    <span className="font-medium">{filteredData.filter(h => h.status === 'first-week').length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">First Month:</span>
                    <span className="font-medium">{filteredData.filter(h => h.status === 'first-month').length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Completed:</span>
                    <span className="font-medium">{filteredData.filter(h => h.status === 'completed').length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Avg Progress:</span>
                    <span className="font-medium">
                      {filteredData.length > 0 
                        ? Math.round(filteredData.reduce((sum, h) => sum + (h.completedTasks / h.totalTasks * 100), 0) / filteredData.length)
                        : 0
                      }%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Filters</h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Date Range:</span>
                  <span className="font-medium">
                    {filters.dateRange.preset === 'custom' 
                      ? `${filters.dateRange.start || 'Start'} to ${filters.dateRange.end || 'End'}`
                      : datePresets.find(p => p.value === filters.dateRange.preset)?.label
                    }
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">New Hires:</span>
                  <span className="font-medium">
                    {filters.newHires.length === 0 ? 'All' : `${filters.newHires.length} selected`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Departments:</span>
                  <span className="font-medium">
                    {filters.departments.length === 0 ? 'All' : `${filters.departments.length} selected`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Statuses:</span>
                  <span className="font-medium">
                    {filters.statuses.length === 0 ? 'All' : `${filters.statuses.length} selected`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Managers:</span>
                  <span className="font-medium">
                    {filters.managers.length === 0 ? 'All' : `${filters.managers.length} selected`}
                  </span>
                </div>

                {(filters.progressRange.min !== null || filters.progressRange.max !== null) && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress:</span>
                    <span className="font-medium">
                      {filters.progressRange.min !== null && filters.progressRange.max !== null
                        ? `${filters.progressRange.min}-${filters.progressRange.max}%`
                        : filters.progressRange.min !== null
                        ? `≥${filters.progressRange.min}%`
                        : `≤${filters.progressRange.max}%`
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Export Configuration */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Configuration</h2>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Format:</span>
                  <span className="font-medium">{exportFormats.find(f => f.type === selectedFormat)?.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Task Details:</span>
                  <span className="font-medium">{filters.includeTaskDetails ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Manager Info:</span>
                  <span className="font-medium">{filters.includeManagerInfo ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Contact Info:</span>
                  <span className="font-medium">{filters.includeContactInfo ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Only Overdue:</span>
                  <span className="font-medium">{filters.onlyOverdueTasks ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        
      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto m-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Export Preview</h2>
                <p className="text-gray-600">Preview of {filteredData.length} new hires to be exported</p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="overflow-x-auto max-h-96 border border-gray-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Name</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Position</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Department</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Start Date</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Progress</th>
                    {filters.includeManagerInfo && (
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Manager</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.slice(0, 50).map(hire => (
                    <tr key={hire.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{hire.firstName} {hire.lastName}</td>
                      <td className="px-4 py-2">{hire.position}</td>
                      <td className="px-4 py-2">{hire.department}</td>
                      <td className="px-4 py-2">{new Date(hire.startDate).toLocaleDateString()}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          hire.status === 'completed' ? 'bg-green-100 text-green-800' :
                          hire.status === 'first-month' ? 'bg-purple-100 text-purple-800' :
                          hire.status === 'first-week' ? 'bg-yellow-100 text-yellow-800' :
                          hire.status === 'first-day' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {hire.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {Math.round((hire.completedTasks / hire.totalTasks) * 100)}% ({hire.completedTasks}/{hire.totalTasks})
                      </td>
                      {filters.includeManagerInfo && (
                        <td className="px-4 py-2">{hire.manager}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredData.length > 50 && (
                <div className="p-4 text-center text-gray-500 bg-gray-50">
                  Showing first 50 records. Full export will include all {filteredData.length} records.
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors order-2 sm:order-1"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  setShowPreview(false);
                  handleExport();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 order-1 sm:order-2"
              >
                <Download className="w-4 h-4" />
                Export {filteredData.length} Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingAdvancedExportPage;