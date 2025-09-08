import React, { useState } from 'react';
import { FileText, DollarSign, Clock, CheckCircle, XCircle, Plus, Search, Grid, List } from 'lucide-react';
import { Download, Settings } from 'lucide-react';
import { dataService, Claim } from '../../services/dataService';
import ClaimForm from './components/ClaimForm';
import ClaimCard from './components/ClaimCard';
import ClaimTable from './components/ClaimTable';
import ClaimsAdvancedExportPage from './components/ClaimsAdvancedExportPage';
import ClaimApprovalDashboard from './components/ClaimApprovalDashboard';
import ClaimApprovalWorkflowManager from './components/ClaimApprovalWorkflowManager';

const ClaimsManagement: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>(dataService.getClaims());

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [showForm, setShowForm] = useState(false);
  const [editingClaim, setEditingClaim] = useState<Claim | undefined>();
  const [showAdvancedExport, setShowAdvancedExport] = useState(false);
  const [showApprovalDashboard, setShowApprovalDashboard] = useState(false);
  const [showWorkflowManager, setShowWorkflowManager] = useState(false);

  const claimTypes = ['travel', 'medical', 'equipment', 'training', 'meal', 'other'];
  const statuses = ['pending', 'processing', 'approved', 'rejected'];
  const categories = [...new Set(claims.map(claim => claim.category))];

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = 
      claim.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || claim.status === selectedStatus;
    const matchesType = selectedType === 'all' || claim.claimType === selectedType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleSaveClaim = (claimData: Omit<Claim, 'id' | 'submissionDate' | 'approvedBy'> | Claim) => {
    if ('id' in claimData) {
      // Update existing claim
      dataService.updateClaim(claimData.id, claimData);
    } else {
      // Add new claim
      dataService.createClaim(claimData);
    }
    setClaims(dataService.getClaims());
    setShowForm(false);
    setEditingClaim(undefined);
  };

  const handleEditClaim = (claim: Claim) => {
    setEditingClaim(claim);
    setShowForm(true);
  };

  const handleDeleteClaim = (id: string) => {
    if (window.confirm('Are you sure you want to delete this claim?')) {
      dataService.deleteClaim(id);
      setClaims(dataService.getClaims());
    }
  };

  const handleStatsCardClick = (filterType: 'status' | 'total', filterValue: string) => {
    if (filterType === 'total') {
      // Clear all filters to show all claims
      setSelectedStatus('all');
      setSelectedType('all');
    } else if (filterType === 'status') {
      setSelectedStatus(filterValue);
    }
    // Clear search term when applying filter from stats
    setSearchTerm('');
  };

  const handleExportClaims = () => {
    const csvContent = [
      ['Employee Name', 'Employee ID', 'Claim Type', 'Amount', 'Currency', 'Category', 'Status', 'Urgency', 'Description', 'Submission Date', 'Approved By', 'Receipt URL'].join(','),
      ...filteredClaims.map(claim => [
        `"${claim.employeeName}"`,
        claim.employeeId,
        claim.claimType,
        claim.amount.toString(),
        claim.currency,
        `"${claim.category}"`,
        claim.status,
        claim.urgency,
        `"${claim.description.replace(/"/g, '""')}"`, // Escape quotes in description
        claim.submissionDate,
        claim.approvedBy ? `"${claim.approvedBy}"` : '',
        claim.receiptUrl || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `claims-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStats = () => {
    const pending = claims.filter(claim => claim.status === 'pending').length;
    const approved = claims.filter(claim => claim.status === 'approved').length;
    const processing = claims.filter(claim => claim.status === 'processing').length;
    const totalAmount = claims
      .filter(claim => claim.status === 'approved')
      .reduce((sum, claim) => sum + claim.amount, 0);
    
    return { pending, approved, processing, totalAmount };
  };

  const stats = getStats();

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Claims Management</h1>
            <p className="text-gray-600 mt-1">Process employee claims, reimbursements, and expense management</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search claims..."
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
                setEditingClaim(undefined);
                setShowForm(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Submit Claim
            </button>
            
            <button
              onClick={() => setShowApprovalDashboard(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Approvals
            </button>
            
            <button
              onClick={() => setShowWorkflowManager(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Workflow Rules
            </button>
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
                <p className="text-sm text-gray-600 group-hover:text-yellow-700">Pending Claims</p>
                <p className="text-2xl font-bold text-gray-900 group-hover:text-yellow-800">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                <Clock className="w-6 h-6 text-yellow-600 group-hover:text-yellow-700" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 group-hover:text-yellow-600">
              Click to filter pending claims
            </div>
          </div>
          <div 
            onClick={() => handleStatsCardClick('status', 'processing')}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 group-hover:text-blue-700">Processing</p>
                <p className="text-2xl font-bold text-gray-900 group-hover:text-blue-800">{stats.processing}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <FileText className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 group-hover:text-blue-600">
              Click to filter processing claims
            </div>
          </div>
          <div 
            onClick={() => handleStatsCardClick('status', 'approved')}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-green-300 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 group-hover:text-green-700">Approved Claims</p>
                <p className="text-2xl font-bold text-gray-900 group-hover:text-green-800">{stats.approved}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <CheckCircle className="w-6 h-6 text-green-600 group-hover:text-green-700" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 group-hover:text-green-600">
              Click to filter approved claims
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Approved</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalAmount.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Total approved amount
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
                  placeholder="Search claims..."
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
                {claimTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              <button 
                onClick={handleExportClaims}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                title="Export filtered claims to CSV"
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

        {/* Claims Display */}
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredClaims.map(claim => (
              <ClaimCard
                key={claim.id}
                claim={claim}
                onEdit={handleEditClaim}
                onDelete={handleDeleteClaim}
              />
            ))}
          </div>
        ) : (
          <ClaimTable
            claims={filteredClaims}
            onEdit={handleEditClaim}
            onDelete={handleDeleteClaim}
          />
        )}

        {filteredClaims.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No claims found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Claim Form Modal */}
      <ClaimForm
        claim={editingClaim}
        onSave={handleSaveClaim}
        onCancel={() => {
          setShowForm(false);
          setEditingClaim(undefined);
        }}
        isOpen={showForm}
        isAdmin={true}
      />

      {/* Advanced Export Page */}
      {showAdvancedExport && (
        <div className="fixed inset-0 bg-white z-50">
          <ClaimsAdvancedExportPage 
            onBack={() => setShowAdvancedExport(false)}
            claims={claims}
            employees={claims.map(c => ({ id: c.employeeId, name: c.employeeName }))}
            claimTypes={claimTypes}
            statuses={statuses}
            categories={categories}
            currencies={['USD', 'EUR', 'GBP', 'CAD', 'AUD']}
          />
        </div>
      )}

      {/* Claim Approval Dashboard Modal */}
      <ClaimApprovalDashboard
        isOpen={showApprovalDashboard}
        onClose={() => setShowApprovalDashboard(false)}
        onClaimsChange={() => setClaims(dataService.getClaims())}
      />

      {/* Claim Approval Workflow Manager Modal */}
      <ClaimApprovalWorkflowManager
        isOpen={showWorkflowManager}
        onClose={() => setShowWorkflowManager(false)}
        onRulesChange={() => setClaims(dataService.getClaims())}
      />
    </div>
  );
};

export default ClaimsManagement;