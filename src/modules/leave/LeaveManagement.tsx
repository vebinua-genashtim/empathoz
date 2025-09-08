import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, Plus, Search, Grid, List, Settings, Users, TrendingUp, Download, ChevronDown, MoreHorizontal } from 'lucide-react';
import { dataService, LeaveRequest, LeaveBalance, LeaveGuidelinesConfig } from '../../services/dataService';
import LeaveRequestForm from './components/LeaveRequestForm';
import LeaveConfiguration from './components/LeaveConfiguration';
import LeaveCalendar from './components/LeaveCalendar';
import ApprovalWorkflowManager from './components/ApprovalWorkflowManager';
import ApprovalDashboard from './components/ApprovalDashboard';
import AdvancedExportPage from './components/AdvancedExportPage';

const LeaveManagement: React.FC = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(dataService.getLeaveRequests());
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>(dataService.getLeaveBalances());
  const [leaveGuidelinesConfig, setLeaveGuidelinesConfig] = useState<LeaveGuidelinesConfig>(dataService.getLeaveGuidelinesConfig());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table' | 'calendar'>('cards');
  const [showForm, setShowForm] = useState(false);
  const [showConfiguration, setShowConfiguration] = useState(false);
  const [editingRequest, setEditingRequest] = useState<LeaveRequest | undefined>();
  const [showWorkflowManager, setShowWorkflowManager] = useState(false);
  const [showApprovalDashboard, setShowApprovalDashboard] = useState(false);
  const [showManageDropdown, setShowManageDropdown] = useState(false);
  const [showAdvancedExport, setShowAdvancedExport] = useState(false);

  const leaveTypes = ['vacation', 'sick', 'personal', 'maternity', 'paternity'];
  const statuses = ['pending', 'approved', 'rejected'];

  const filteredRequests = leaveRequests.filter(request => {
    const matchesSearch = 
      request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus;
    const matchesType = selectedType === 'all' || request.leaveType === selectedType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleSaveRequest = (requestData: Omit<LeaveRequest, 'id' | 'appliedDate' | 'approvedBy'> | LeaveRequest) => {
    if ('id' in requestData) {
      // Update existing request
      dataService.updateLeaveRequest(requestData.id, requestData);
    } else {
      // Add new request
      dataService.createLeaveRequest(requestData);
    }
    setLeaveRequests(dataService.getLeaveRequests());
    setShowForm(false);
    setEditingRequest(undefined);
  };

  const handleEditRequest = (request: LeaveRequest) => {
    setEditingRequest(request);
    setShowForm(true);
  };

  const handleDeleteRequest = (id: string) => {
    if (window.confirm('Are you sure you want to delete this leave request?')) {
      dataService.deleteLeaveRequest(id);
      setLeaveRequests(dataService.getLeaveRequests());
    }
  };

  const handleGuidelinesConfigChange = (config: LeaveGuidelinesConfig) => {
    dataService.updateLeaveGuidelinesConfig(config);
    setLeaveGuidelinesConfig(config);
  };

  const handleConfigurationChange = () => {
    setLeaveBalances(dataService.getLeaveBalances());
  };

  const handleWorkflowRulesChange = () => {
    // Refresh data when approval rules change
    setLeaveRequests(dataService.getLeaveRequests());
  };

  const handleExportLeaveRequests = () => {
    const csvContent = [
      ['Employee Name', 'Employee ID', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Reason', 'Applied Date', 'Approved By'].join(','),
      ...filteredRequests.map(request => [
        `"${request.employeeName}"`,
        request.employeeId,
        request.leaveType,
        request.startDate,
        request.endDate,
        request.days.toString(),
        request.status,
        `"${request.reason.replace(/"/g, '""')}"`, // Escape quotes in reason
        request.appliedDate,
        request.approvedBy ? `"${request.approvedBy}"` : ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leave-requests-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };
  const handleStatsCardClick = (filterType: 'status' | 'type', filterValue: string) => {
    if (filterType === 'status') {
      setSelectedStatus(filterValue);
    } else if (filterType === 'type') {
      setSelectedType(filterValue);
    }
    // Clear search term when applying filter from stats
    setSearchTerm('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'vacation': return 'bg-blue-50 text-blue-700';
      case 'sick': return 'bg-red-50 text-red-700';
      case 'personal': return 'bg-purple-50 text-purple-700';
      case 'maternity': return 'bg-pink-50 text-pink-700';
      case 'paternity': return 'bg-indigo-50 text-indigo-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getStats = () => {
    const pending = leaveRequests.filter(request => request.status === 'pending').length;
    const approved = leaveRequests.filter(request => request.status === 'approved').length;
    const rejected = leaveRequests.filter(request => request.status === 'rejected').length;
    const totalDays = leaveRequests
      .filter(request => request.status === 'approved')
      .reduce((sum, request) => sum + request.days, 0);
    
    return { pending, approved, rejected, totalDays };
  };

  const stats = getStats();

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
            <p className="text-gray-600 mt-1">Manage employee leave requests, approvals, and leave balances</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-4">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search leave requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1 flex-shrink-0">
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
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'calendar' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                }`}
              >
                <Calendar className="w-4 h-4" />
              </button>
            </div>
            
            {/* Action Buttons - Responsive Grid */}
            <div className="flex items-center gap-2 lg:gap-3 w-full sm:w-auto">
              {/* Desktop (≥1180px): Show all buttons individually */}
              <div className="hidden xl:flex items-center gap-3">
                <button 
                  onClick={() => setShowConfiguration(true)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Configure
                </button>
                
                <button 
                  onClick={() => setShowWorkflowManager(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Rules
                </button>
                
                <button 
                  onClick={() => setShowApprovalDashboard(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approvals
                </button>
                
                <button 
                  onClick={() => {
                    setEditingRequest(undefined);
                    setShowForm(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Request
                </button>
              </div>

              {/* Mobile/Tablet (<1180px): Manage dropdown with all actions */}
              <div className="relative xl:hidden">
                <button
                  onClick={() => setShowManageDropdown(!showManageDropdown)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <MoreHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline">Actions</span>
                  <span className="sm:hidden">Menu</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showManageDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Menu */}
                {showManageDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                    <button
                      onClick={() => {
                        setEditingRequest(undefined);
                        setShowForm(true);
                        setShowManageDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <Plus className="w-4 h-4 text-blue-600" />
                      New Leave Request
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        setShowConfiguration(true);
                        setShowManageDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <Settings className="w-4 h-4 text-gray-600" />
                      Configure Leave Settings
                    </button>
                    <button
                      onClick={() => {
                        setShowWorkflowManager(true);
                        setShowManageDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <Users className="w-4 h-4 text-purple-600" />
                      Approval Rules
                    </button>
                    <button
                      onClick={() => {
                        setShowApprovalDashboard(true);
                        setShowManageDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Approval Dashboard
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        setShowAdvancedExport(true);
                        setShowManageDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <Settings className="w-4 h-4 text-indigo-600" />
                      Advanced Export
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div 
            onClick={() => handleStatsCardClick('status', 'pending')}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-yellow-300 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 group-hover:text-yellow-700">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900 group-hover:text-yellow-800">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                <Clock className="w-6 h-6 text-yellow-600 group-hover:text-yellow-700" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 group-hover:text-yellow-600">
              Click to filter pending requests
            </div>
          </div>
          <div 
            onClick={() => handleStatsCardClick('status', 'approved')}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-green-300 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 group-hover:text-green-700">Approved Requests</p>
                <p className="text-2xl font-bold text-gray-900 group-hover:text-green-800">{stats.approved}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <CheckCircle className="w-6 h-6 text-green-600 group-hover:text-green-700" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 group-hover:text-green-600">
              Click to filter approved requests
            </div>
          </div>
          <div 
            onClick={() => handleStatsCardClick('status', 'rejected')}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-red-300 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 group-hover:text-red-700">Rejected Requests</p>
                <p className="text-2xl font-bold text-gray-900 group-hover:text-red-800">{stats.rejected}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                <XCircle className="w-6 h-6 text-red-600 group-hover:text-red-700" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 group-hover:text-red-600">
              Click to filter rejected requests
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Days Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDays}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Total approved leave days
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search leave requests..."
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
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                {leaveTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              <button 
                onClick={handleExportLeaveRequests}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                title="Export filtered leave requests to CSV"
              >
                <Download className="w-4 h-4" />
                Export
               </button>
               <button 
                 onClick={() => setShowAdvancedExport(true)}
                 className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                 title="Advanced export with detailed filtering"
               >
                 <Settings className="w-4 h-4" />
                 Advanced Export
               </button>
            </div>
          </div>
        </div>

        {/* Leave Requests Display */}
        {viewMode === 'calendar' ? (
          <LeaveCalendar
            leaveRequests={filteredRequests}
            onEditRequest={handleEditRequest}
          />
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRequests.map(request => (
              <div key={request.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {request.employeeName.split(' ').map(n => n.charAt(0)).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.employeeName}
                      </h3>
                      <p className="text-sm text-gray-600">ID: {request.employeeId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditRequest(request)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLeaveTypeColor(request.leaveType)}`}>
                      {request.leaveType.charAt(0).toUpperCase() + request.leaveType.slice(1)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p><strong>Duration:</strong> {request.days} day{request.days !== 1 ? 's' : ''}</p>
                    <p><strong>From:</strong> {new Date(request.startDate).toLocaleDateString()}</p>
                    <p><strong>To:</strong> {new Date(request.endDate).toLocaleDateString()}</p>
                    <p><strong>Applied:</strong> {new Date(request.appliedDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-sm text-gray-700">
                    <p><strong>Reason:</strong> {request.reason}</p>
                  </div>
                  {request.approvedBy && (
                    <div className="text-sm text-gray-600">
                      <p><strong>Approved by:</strong> {request.approvedBy}</p>
                    </div>
                  )}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Leave Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {request.employeeName.split(' ').map(n => n.charAt(0)).join('')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {request.employeeName}
                            </div>
                            <div className="text-sm text-gray-500">ID: {request.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getLeaveTypeColor(request.leaveType)}`}>
                          {request.leaveType.charAt(0).toUpperCase() + request.leaveType.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.days} day{request.days !== 1 ? 's' : ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(request.appliedDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditRequest(request)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                          >
                            <Calendar className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRequest(request.id)}
                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No leave requests found</p>
              </div>
            )}
          </div>
        )}

        {filteredRequests.length === 0 && viewMode !== 'calendar' && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leave requests found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Leave Request Form Modal */}
      <LeaveRequestForm
        leaveRequest={editingRequest}
        onSave={handleSaveRequest}
        onCancel={() => {
          setShowForm(false);
          setEditingRequest(undefined);
        }}
        isOpen={showForm}
        isAdmin={true}
        leaveBalances={leaveBalances}
        leaveGuidelinesConfig={leaveGuidelinesConfig}
        onGuidelinesConfigChange={handleGuidelinesConfigChange}
      />

      {/* Leave Configuration Modal */}
      <LeaveConfiguration
        isOpen={showConfiguration}
        onClose={() => setShowConfiguration(false)}
        onConfigurationChange={handleConfigurationChange}
      />

      {/* Approval Workflow Manager Modal */}
      <ApprovalWorkflowManager
        isOpen={showWorkflowManager}
        onClose={() => setShowWorkflowManager(false)}
        onRulesChange={handleWorkflowRulesChange}
      />

      {/* Approval Dashboard Modal */}
      <ApprovalDashboard
        isOpen={showApprovalDashboard}
        onClose={() => setShowApprovalDashboard(false)}
        onRequestsChange={() => setLeaveRequests(dataService.getLeaveRequests())}
      />

      {/* Advanced Export Page */}
      {showAdvancedExport && (
        <div className="fixed inset-0 bg-white z-50">
          <AdvancedExportPage onBack={() => setShowAdvancedExport(false)} />
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;