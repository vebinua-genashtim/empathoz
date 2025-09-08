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
  UserCheck,
  Building2,
  MapPin,
  DollarSign,
  XCircle
} from 'lucide-react';
import { Candidate } from '../../../services/dataService';

interface ATSAdvancedExportPageProps {
  onBack: () => void;
  candidates: Candidate[];
  departments: string[];
  positions: string[];
  sources: string[];
}

interface ExportFilters {
  dateRange: {
    start: string;
    end: string;
    preset: 'custom' | 'last-30-days' | 'last-90-days' | 'this-year' | 'last-year' | 'all-time';
  };
  candidates: string[];
  departments: string[];
  positions: string[];
  statuses: string[];
  sources: string[];
  experienceRange: {
    min: number | null;
    max: number | null;
  };
  salaryRange: {
    min: number | null;
    max: number | null;
  };
  includeNotes: boolean;
  includeContactInfo: boolean;
  includeDocuments: boolean;
  includeSalaryInfo: boolean;
}

interface ExportFormat {
  type: 'csv' | 'excel' | 'pdf';
  name: string;
  description: string;
  icon: React.ComponentType<any>;
}

const ATSAdvancedExportPage: React.FC<ATSAdvancedExportPageProps> = ({ 
  onBack, 
  candidates, 
  departments, 
  positions, 
  sources 
}) => {
  const [filters, setFilters] = useState<ExportFilters>({
    dateRange: {
      start: '',
      end: '',
      preset: 'this-year'
    },
    candidates: [],
    departments: [],
    positions: [],
    statuses: [],
    sources: [],
    experienceRange: {
      min: null,
      max: null
    },
    salaryRange: {
      min: null,
      max: null
    },
    includeNotes: false,
    includeContactInfo: true,
    includeDocuments: true,
    includeSalaryInfo: false
  });

  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [previewData, setPreviewData] = useState<Candidate[]>([]);
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

  const statuses = ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'];

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
    return candidates.filter(candidate => {
      // Date range filter
      if (filters.dateRange.start && new Date(candidate.appliedDate) < new Date(filters.dateRange.start)) {
        return false;
      }
      if (filters.dateRange.end && new Date(candidate.appliedDate) > new Date(filters.dateRange.end)) {
        return false;
      }

      // Candidate filter
      if (filters.candidates.length > 0 && !filters.candidates.includes(candidate.id)) {
        return false;
      }

      // Department filter
      if (filters.departments.length > 0 && !filters.departments.includes(candidate.department)) {
        return false;
      }

      // Position filter
      if (filters.positions.length > 0 && !filters.positions.includes(candidate.position)) {
        return false;
      }

      // Status filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(candidate.status)) {
        return false;
      }

      // Source filter
      if (filters.sources.length > 0 && !filters.sources.includes(candidate.source)) {
        return false;
      }

      // Experience range filter
      if (filters.experienceRange.min !== null && candidate.experience < filters.experienceRange.min) {
        return false;
      }
      if (filters.experienceRange.max !== null && candidate.experience > filters.experienceRange.max) {
        return false;
      }

      // Salary range filter
      if (candidate.salary) {
        if (filters.salaryRange.min !== null && candidate.salary < filters.salaryRange.min) {
          return false;
        }
        if (filters.salaryRange.max !== null && candidate.salary > filters.salaryRange.max) {
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

  const exportToCSV = async (data: Candidate[]) => {
    const headers = [
      'First Name',
      'Last Name',
      'Email',
      'Position',
      'Department',
      'Status',
      'Source',
      'Experience (Years)',
      'Applied Date',
      'Last Updated'
    ];

    if (filters.includeContactInfo) {
      headers.splice(3, 0, 'Phone', 'City', 'Country');
    }

    if (filters.includeSalaryInfo) {
      headers.push('Expected Salary');
    }

    if (filters.includeDocuments) {
      headers.push('CV URL', 'Portfolio URL', 'Certifications URL', 'Resume URL');
    }

    if (filters.includeNotes) {
      headers.push('Notes');
    }

    const csvContent = [
      headers.join(','),
      ...data.map(candidate => {
        const row = [
          `"${candidate.firstName}"`,
          `"${candidate.lastName}"`,
          candidate.email,
          `"${candidate.position}"`,
          candidate.department,
          candidate.status,
          candidate.source,
          candidate.experience.toString(),
          candidate.appliedDate,
          candidate.lastUpdated
        ];

        if (filters.includeContactInfo) {
          row.splice(3, 0, 
            candidate.phone || '',
            candidate.city || '',
            candidate.country || ''
          );
        }

        if (filters.includeSalaryInfo) {
          row.push(candidate.salary ? candidate.salary.toString() : '');
        }

        if (filters.includeDocuments) {
          row.push(
            candidate.cvUrl || '',
            candidate.portfolioUrl || '',
            candidate.certificationsUrl || '',
            candidate.resumeUrl || ''
          );
        }

        if (filters.includeNotes) {
          row.push(candidate.notes ? `"${candidate.notes.replace(/"/g, '""')}"` : '');
        }

        return row.join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candidates-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToExcel = async (data: Candidate[]) => {
    // Simulate Excel export (in real app, would use a library like xlsx)
    alert('Excel export would be implemented with a library like xlsx in a real application');
  };

  const exportToPDF = async (data: Candidate[]) => {
    // Simulate PDF export (in real app, would use a library like jsPDF)
    alert('PDF export would be implemented with a library like jsPDF in a real application');
  };

  const handleFilterChange = (key: keyof ExportFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleArrayFilterChange = (key: keyof Pick<ExportFilters, 'candidates' | 'departments' | 'positions' | 'statuses' | 'sources'>, value: string) => {
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
      candidates: [],
      departments: [],
      positions: [],
      statuses: [],
      sources: [],
      experienceRange: {
        min: null,
        max: null
      },
      salaryRange: {
        min: null,
        max: null
      },
      includeNotes: false,
      includeContactInfo: true,
      includeDocuments: true,
      includeSalaryInfo: false
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
              <h1 className="text-2xl font-bold text-gray-900">Advanced Candidate Export</h1>
              <p className="text-gray-600 mt-1">Configure detailed filters and export candidate data</p>
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
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Date Range</h2>
                
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
                  {/* Candidates */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Candidates ({filters.candidates.length} selected)
                    </label>
                    <div className="border border-gray-300 rounded-lg p-3 max-h-32 overflow-y-auto">
                      <div className="space-y-2">
                        {candidates.map(candidate => (
                          <label key={candidate.id} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.candidates.includes(candidate.id)}
                              onChange={() => handleArrayFilterChange('candidates', candidate.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {candidate.firstName} {candidate.lastName} - {candidate.position}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    {filters.candidates.length === 0 && (
                      <p className="text-xs text-gray-500 mt-1">All candidates will be included</p>
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

                  {/* Positions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Positions ({filters.positions.length} selected)
                    </label>
                    <div className="border border-gray-300 rounded-lg p-3 max-h-24 overflow-y-auto">
                      <div className="space-y-2">
                        {positions.map(position => (
                          <label key={position} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.positions.includes(position)}
                              onChange={() => handleArrayFilterChange('positions', position)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{position}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    {filters.positions.length === 0 && (
                      <p className="text-xs text-gray-500 mt-1">All positions will be included</p>
                    )}
                  </div>

                  {/* Statuses */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Application Status ({filters.statuses.length} selected)
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
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </label>
                      ))}
                    </div>
                    {filters.statuses.length === 0 && (
                      <p className="text-xs text-gray-500 mt-1">All statuses will be included</p>
                    )}
                  </div>

                  {/* Sources */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Application Sources ({filters.sources.length} selected)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {sources.map(source => (
                        <label key={source} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.sources.includes(source)}
                            onChange={() => handleArrayFilterChange('sources', source)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {source.charAt(0).toUpperCase() + source.slice(1)}
                          </span>
                        </label>
                      ))}
                    </div>
                    {filters.sources.length === 0 && (
                      <p className="text-xs text-gray-500 mt-1">All sources will be included</p>
                    )}
                  </div>

                  {/* Experience Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Range (Years)
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input
                          type="number"
                          value={filters.experienceRange.min || ''}
                          onChange={(e) => handleFilterChange('experienceRange', {
                            ...filters.experienceRange,
                            min: e.target.value ? parseInt(e.target.value) : null
                          })}
                          placeholder="Min years"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={filters.experienceRange.max || ''}
                          onChange={(e) => handleFilterChange('experienceRange', {
                            ...filters.experienceRange,
                            max: e.target.value ? parseInt(e.target.value) : null
                          })}
                          placeholder="Max years"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Salary Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Salary Range (USD)
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input
                          type="number"
                          value={filters.salaryRange.min || ''}
                          onChange={(e) => handleFilterChange('salaryRange', {
                            ...filters.salaryRange,
                            min: e.target.value ? parseInt(e.target.value) : null
                          })}
                          placeholder="Min salary"
                          min="0"
                          step="1000"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={filters.salaryRange.max || ''}
                          onChange={(e) => handleFilterChange('salaryRange', {
                            ...filters.salaryRange,
                            max: e.target.value ? parseInt(e.target.value) : null
                          })}
                          placeholder="Max salary"
                          min="0"
                          step="1000"
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
                      checked={filters.includeContactInfo}
                      onChange={(e) => handleFilterChange('includeContactInfo', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Include Contact Information (Phone, City, Country)</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.includeSalaryInfo}
                      onChange={(e) => handleFilterChange('includeSalaryInfo', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Include Salary Information</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.includeDocuments}
                      onChange={(e) => handleFilterChange('includeDocuments', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Include Document URLs (CV, Portfolio, Certifications, Resume)</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.includeNotes}
                      onChange={(e) => handleFilterChange('includeNotes', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Include Notes & Comments</span>
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
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Candidates to Export</span>
                  </div>
                  <span className="text-xl font-bold text-blue-900">{filteredData.length}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Applied:</span>
                    <span className="font-medium">{filteredData.filter(c => c.status === 'applied').length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Screening:</span>
                    <span className="font-medium">{filteredData.filter(c => c.status === 'screening').length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Interview:</span>
                    <span className="font-medium">{filteredData.filter(c => c.status === 'interview').length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Hired:</span>
                    <span className="font-medium">{filteredData.filter(c => c.status === 'hired').length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Avg Experience:</span>
                    <span className="font-medium">
                      {filteredData.length > 0 
                        ? Math.round(filteredData.reduce((sum, c) => sum + c.experience, 0) / filteredData.length)
                        : 0
                      } years
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
                  <span className="text-gray-600">Candidates:</span>
                  <span className="font-medium">
                    {filters.candidates.length === 0 ? 'All' : `${filters.candidates.length} selected`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Departments:</span>
                  <span className="font-medium">
                    {filters.departments.length === 0 ? 'All' : `${filters.departments.length} selected`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Positions:</span>
                  <span className="font-medium">
                    {filters.positions.length === 0 ? 'All' : `${filters.positions.length} selected`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Statuses:</span>
                  <span className="font-medium">
                    {filters.statuses.length === 0 ? 'All' : `${filters.statuses.length} selected`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Sources:</span>
                  <span className="font-medium">
                    {filters.sources.length === 0 ? 'All' : `${filters.sources.length} selected`}
                  </span>
                </div>

                {(filters.experienceRange.min !== null || filters.experienceRange.max !== null) && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium">
                      {filters.experienceRange.min !== null && filters.experienceRange.max !== null
                        ? `${filters.experienceRange.min}-${filters.experienceRange.max} years`
                        : filters.experienceRange.min !== null
                        ? `≥${filters.experienceRange.min} years`
                        : `≤${filters.experienceRange.max} years`
                      }
                    </span>
                  </div>
                )}

                {(filters.salaryRange.min !== null || filters.salaryRange.max !== null) && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Salary:</span>
                    <span className="font-medium">
                      {filters.salaryRange.min !== null && filters.salaryRange.max !== null
                        ? `$${filters.salaryRange.min?.toLocaleString()}-$${filters.salaryRange.max?.toLocaleString()}`
                        : filters.salaryRange.min !== null
                        ? `≥$${filters.salaryRange.min?.toLocaleString()}`
                        : `≤$${filters.salaryRange.max?.toLocaleString()}`
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
                  <span className="text-gray-600">Contact Info:</span>
                  <span className="font-medium">{filters.includeContactInfo ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Salary Info:</span>
                  <span className="font-medium">{filters.includeSalaryInfo ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Documents:</span>
                  <span className="font-medium">{filters.includeDocuments ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Notes:</span>
                  <span className="font-medium">{filters.includeNotes ? 'Yes' : 'No'}</span>
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
                <p className="text-gray-600">Preview of {filteredData.length} candidates to be exported</p>
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
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Email</th>
                    {filters.includeContactInfo && (
                      <>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Phone</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Location</th>
                      </>
                    )}
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Position</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Department</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Experience</th>
                    {filters.includeSalaryInfo && (
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Salary</th>
                    )}
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Applied</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.slice(0, 50).map(candidate => (
                    <tr key={candidate.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{candidate.firstName} {candidate.lastName}</td>
                      <td className="px-4 py-2">{candidate.email}</td>
                      {filters.includeContactInfo && (
                        <>
                          <td className="px-4 py-2">{candidate.phone || '-'}</td>
                          <td className="px-4 py-2">{candidate.city && candidate.country ? `${candidate.city}, ${candidate.country}` : candidate.city || candidate.country || '-'}</td>
                        </>
                      )}
                      <td className="px-4 py-2">{candidate.position}</td>
                      <td className="px-4 py-2">{candidate.department}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          candidate.status === 'hired' ? 'bg-green-100 text-green-800' :
                          candidate.status === 'interview' ? 'bg-purple-100 text-purple-800' :
                          candidate.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                          candidate.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {candidate.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">{candidate.experience} years</td>
                      {filters.includeSalaryInfo && (
                        <td className="px-4 py-2">{candidate.salary ? `$${candidate.salary.toLocaleString()}` : '-'}</td>
                      )}
                      <td className="px-4 py-2">{new Date(candidate.appliedDate).toLocaleDateString()}</td>
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

export default ATSAdvancedExportPage;