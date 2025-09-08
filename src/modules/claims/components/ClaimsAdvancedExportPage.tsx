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
  DollarSign,
  XCircle,
  AlertTriangle
} from 'lucide-react';

interface Claim {
  id: string;
  employeeName: string;
  employeeId: string;
  claimType: 'travel' | 'medical' | 'equipment' | 'training' | 'meal' | 'other';
  amount: number;
  currency: string;
  description: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  approvedBy?: string;
  receiptUrl?: string;
  category: string;
  urgency: 'low' | 'medium' | 'high';
}

interface ClaimsAdvancedExportPageProps {
  onBack: () => void;
  claims: Claim[];
  employees: Array<{ id: string; name: string }>;
  claimTypes: string[];
  statuses: string[];
  categories: string[];
  currencies: string[];
}

interface ExportFilters {
  dateRange: {
    start: string;
    end: string;
    preset: 'custom' | 'last-30-days' | 'last-90-days' | 'this-year' | 'last-year' | 'all-time';
  };
  employees: string[];
  claimTypes: string[];
  statuses: string[];
  categories: string[];
  currencies: string[];
  urgencyLevels: string[];
  amountRange: {
    min: number | null;
    max: number | null;
  };
  includeReceipts: boolean;
  includeApprovers: boolean;
  includeDescriptions: boolean;
  onlyWithReceipts: boolean;
}

interface ExportFormat {
  type: 'csv' | 'excel' | 'pdf';
  name: string;
  description: string;
  icon: React.ComponentType<any>;
}

const ClaimsAdvancedExportPage: React.FC<ClaimsAdvancedExportPageProps> = ({ 
  onBack, 
  claims, 
  employees, 
  claimTypes, 
  statuses, 
  categories, 
  currencies 
}) => {
  const [filters, setFilters] = useState<ExportFilters>({
    dateRange: {
      start: '',
      end: '',
      preset: 'this-year'
    },
    employees: [],
    claimTypes: [],
    statuses: [],
    categories: [],
    currencies: [],
    urgencyLevels: [],
    amountRange: {
      min: null,
      max: null
    },
    includeReceipts: true,
    includeApprovers: true,
    includeDescriptions: true,
    onlyWithReceipts: false
  });

  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [previewData, setPreviewData] = useState<Claim[]>([]);
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

  const urgencyLevels = ['low', 'medium', 'high'];

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
    return claims.filter(claim => {
      // Date range filter
      if (filters.dateRange.start && new Date(claim.submissionDate) < new Date(filters.dateRange.start)) {
        return false;
      }
      if (filters.dateRange.end && new Date(claim.submissionDate) > new Date(filters.dateRange.end)) {
        return false;
      }

      // Employee filter
      if (filters.employees.length > 0 && !filters.employees.includes(claim.employeeId)) {
        return false;
      }

      // Claim type filter
      if (filters.claimTypes.length > 0 && !filters.claimTypes.includes(claim.claimType)) {
        return false;
      }

      // Status filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(claim.status)) {
        return false;
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(claim.category)) {
        return false;
      }

      // Currency filter
      if (filters.currencies.length > 0 && !filters.currencies.includes(claim.currency)) {
        return false;
      }

      // Urgency filter
      if (filters.urgencyLevels.length > 0 && !filters.urgencyLevels.includes(claim.urgency)) {
        return false;
      }

      // Amount range filter
      if (filters.amountRange.min !== null && claim.amount < filters.amountRange.min) {
        return false;
      }
      if (filters.amountRange.max !== null && claim.amount > filters.amountRange.max) {
        return false;
      }

      // Receipt filter
      if (filters.onlyWithReceipts && !claim.receiptUrl) {
        return false;
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

  const exportToCSV = async (data: Claim[]) => {
    const headers = [
      'Employee Name',
      'Employee ID',
      'Claim Type',
      'Amount',
      'Currency',
      'Category',
      'Status',
      'Urgency',
      'Submission Date'
    ];

    if (filters.includeDescriptions) {
      headers.push('Description');
    }

    if (filters.includeApprovers) {
      headers.push('Approved By');
    }

    if (filters.includeReceipts) {
      headers.push('Receipt URL');
    }

    const csvContent = [
      headers.join(','),
      ...data.map(claim => {
        const row = [
          `"${claim.employeeName}"`,
          claim.employeeId,
          claim.claimType,
          claim.amount.toString(),
          claim.currency,
          `"${claim.category}"`,
          claim.status,
          claim.urgency,
          claim.submissionDate
        ];

        if (filters.includeDescriptions) {
          row.push(`"${claim.description.replace(/"/g, '""')}"`);
        }

        if (filters.includeApprovers) {
          row.push(claim.approvedBy ? `"${claim.approvedBy}"` : '');
        }

        if (filters.includeReceipts) {
          row.push(claim.receiptUrl || '');
        }

        return row.join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `claims-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToExcel = async (data: Claim[]) => {
    // Simulate Excel export (in real app, would use a library like xlsx)
    alert('Excel export would be implemented with a library like xlsx in a real application');
  };

  const exportToPDF = async (data: Claim[]) => {
    // Simulate PDF export (in real app, would use a library like jsPDF)
    alert('PDF export would be implemented with a library like jsPDF in a real application');
  };

  const handleFilterChange = (key: keyof ExportFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleArrayFilterChange = (key: keyof Pick<ExportFilters, 'employees' | 'claimTypes' | 'statuses' | 'categories' | 'currencies' | 'urgencyLevels'>, value: string) => {
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
      employees: [],
      claimTypes: [],
      statuses: [],
      categories: [],
      currencies: [],
      urgencyLevels: [],
      amountRange: {
        min: null,
        max: null
      },
      includeReceipts: true,
      includeApprovers: true,
      includeDescriptions: true,
      onlyWithReceipts: false
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
              <h1 className="text-2xl font-bold text-gray-900">Advanced Claims Export</h1>
              <p className="text-gray-600 mt-1">Configure detailed filters and export claims data</p>
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
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Date Range (Submission Date)</h2>
                
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
                  {/* Employees */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employees ({filters.employees.length} selected)
                    </label>
                    <div className="border border-gray-300 rounded-lg p-3 max-h-32 overflow-y-auto">
                      <div className="space-y-2">
                        {employees.map(employee => (
                          <label key={employee.id} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.employees.includes(employee.id)}
                              onChange={() => handleArrayFilterChange('employees', employee.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{employee.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    {filters.employees.length === 0 && (
                      <p className="text-xs text-gray-500 mt-1">All employees will be included</p>
                    )}
                  </div>

                  {/* Claim Types */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Claim Types ({filters.claimTypes.length} selected)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {claimTypes.map(type => (
                        <label key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.claimTypes.includes(type)}
                            onChange={() => handleArrayFilterChange('claimTypes', type)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </span>
                        </label>
                      ))}
                    </div>
                    {filters.claimTypes.length === 0 && (
                      <p className="text-xs text-gray-500 mt-1">All claim types will be included</p>
                    )}
                  </div>

                  {/* Statuses */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Claim Status ({filters.statuses.length} selected)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
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

                  {/* Categories */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categories ({filters.categories.length} selected)
                    </label>
                    <div className="border border-gray-300 rounded-lg p-3 max-h-24 overflow-y-auto">
                      <div className="space-y-2">
                        {categories.map(category => (
                          <label key={category} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.categories.includes(category)}
                              onChange={() => handleArrayFilterChange('categories', category)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{category}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    {filters.categories.length === 0 && (
                      <p className="text-xs text-gray-500 mt-1">All categories will be included</p>
                    )}
                  </div>

                  {/* Currencies */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currencies ({filters.currencies.length} selected)
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                      {currencies.map(currency => (
                        <label key={currency} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.currencies.includes(currency)}
                            onChange={() => handleArrayFilterChange('currencies', currency)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{currency}</span>
                        </label>
                      ))}
                    </div>
                    {filters.currencies.length === 0 && (
                      <p className="text-xs text-gray-500 mt-1">All currencies will be included</p>
                    )}
                  </div>

                  {/* Urgency Levels */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urgency Levels ({filters.urgencyLevels.length} selected)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {urgencyLevels.map(urgency => (
                        <label key={urgency} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.urgencyLevels.includes(urgency)}
                            onChange={() => handleArrayFilterChange('urgencyLevels', urgency)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
                          </span>
                        </label>
                      ))}
                    </div>
                    {filters.urgencyLevels.length === 0 && (
                      <p className="text-xs text-gray-500 mt-1">All urgency levels will be included</p>
                    )}
                  </div>

                  {/* Amount Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount Range
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input
                          type="number"
                          value={filters.amountRange.min || ''}
                          onChange={(e) => handleFilterChange('amountRange', {
                            ...filters.amountRange,
                            min: e.target.value ? parseFloat(e.target.value) : null
                          })}
                          placeholder="Min amount"
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={filters.amountRange.max || ''}
                          onChange={(e) => handleFilterChange('amountRange', {
                            ...filters.amountRange,
                            max: e.target.value ? parseFloat(e.target.value) : null
                          })}
                          placeholder="Max amount"
                          min="0"
                          step="0.01"
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
                      checked={filters.includeDescriptions}
                      onChange={(e) => handleFilterChange('includeDescriptions', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Include Claim Descriptions</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.includeApprovers}
                      onChange={(e) => handleFilterChange('includeApprovers', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Include Approver Information</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.includeReceipts}
                      onChange={(e) => handleFilterChange('includeReceipts', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Include Receipt URLs</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.onlyWithReceipts}
                      onChange={(e) => handleFilterChange('onlyWithReceipts', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Only Claims with Receipts</span>
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
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Claims to Export</span>
                  </div>
                  <span className="text-xl font-bold text-blue-900">{filteredData.length}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Pending:</span>
                    <span className="font-medium">{filteredData.filter(c => c.status === 'pending').length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Processing:</span>
                    <span className="font-medium">{filteredData.filter(c => c.status === 'processing').length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Approved:</span>
                    <span className="font-medium">{filteredData.filter(c => c.status === 'approved').length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Rejected:</span>
                    <span className="font-medium">{filteredData.filter(c => c.status === 'rejected').length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium">
                      ${filteredData.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
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
                  <span className="text-gray-600">Employees:</span>
                  <span className="font-medium">
                    {filters.employees.length === 0 ? 'All' : `${filters.employees.length} selected`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Claim Types:</span>
                  <span className="font-medium">
                    {filters.claimTypes.length === 0 ? 'All' : `${filters.claimTypes.length} selected`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Statuses:</span>
                  <span className="font-medium">
                    {filters.statuses.length === 0 ? 'All' : `${filters.statuses.length} selected`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Categories:</span>
                  <span className="font-medium">
                    {filters.categories.length === 0 ? 'All' : `${filters.categories.length} selected`}
                  </span>
                </div>

                {(filters.amountRange.min !== null || filters.amountRange.max !== null) && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">
                      {filters.amountRange.min !== null && filters.amountRange.max !== null
                        ? `$${filters.amountRange.min?.toLocaleString()}-$${filters.amountRange.max?.toLocaleString()}`
                        : filters.amountRange.min !== null
                        ? `≥$${filters.amountRange.min?.toLocaleString()}`
                        : `≤$${filters.amountRange.max?.toLocaleString()}`
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
                  <span className="text-gray-600">Descriptions:</span>
                  <span className="font-medium">{filters.includeDescriptions ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Approvers:</span>
                  <span className="font-medium">{filters.includeApprovers ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Receipts:</span>
                  <span className="font-medium">{filters.includeReceipts ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Only w/ Receipts:</span>
                  <span className="font-medium">{filters.onlyWithReceipts ? 'Yes' : 'No'}</span>
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
                <p className="text-gray-600">Preview of {filteredData.length} claims to be exported</p>
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
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Employee</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Type</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Amount</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Currency</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Category</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Urgency</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Submitted</th>
                    {filters.includeApprovers && (
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Approved By</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.slice(0, 50).map(claim => (
                    <tr key={claim.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{claim.employeeName}</td>
                      <td className="px-4 py-2">{claim.claimType}</td>
                      <td className="px-4 py-2">${claim.amount.toLocaleString()}</td>
                      <td className="px-4 py-2">{claim.currency}</td>
                      <td className="px-4 py-2">{claim.category}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                          claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          claim.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          claim.urgency === 'high' ? 'bg-red-100 text-red-800' :
                          claim.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {claim.urgency}
                        </span>
                      </td>
                      <td className="px-4 py-2">{new Date(claim.submissionDate).toLocaleDateString()}</td>
                      {filters.includeApprovers && (
                        <td className="px-4 py-2">{claim.approvedBy || '-'}</td>
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

export default ClaimsAdvancedExportPage;