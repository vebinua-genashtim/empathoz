import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, MessageSquare, User, Calendar, FileText, AlertTriangle, RefreshCw, Bell, DollarSign } from 'lucide-react';
import { ClaimApprovalStep, ClaimApprovalWorkflow, Claim, dataService } from '../../../services/dataService';

interface ClaimApprovalDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimsChange: () => void;
}

const ClaimApprovalDashboard: React.FC<ClaimApprovalDashboardProps> = ({
  isOpen,
  onClose,
  onClaimsChange
}) => {
  const [pendingApprovals, setPendingApprovals] = useState<ClaimApprovalStep[]>([]);
  const [workflows, setWorkflows] = useState<ClaimApprovalWorkflow[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [selectedApprover, setSelectedApprover] = useState('Finance Manager');
  const [actionComments, setActionComments] = useState<{ [stepId: string]: string }>({});

  const approvers = [
    'Finance Manager',
    'Finance Director',
    'HR Manager',
    'Engineering Head',
    'Marketing Head',
    'Sales Head',
    'Design Head',
    'Product Head',
    'Operations Head',
    'Direct Manager',
    'Department Head'
  ];

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen, selectedApprover]);

  const refreshData = () => {
    const allSteps = dataService.getClaimApprovalSteps();
    const allWorkflows = dataService.getClaimApprovalWorkflows();
    const allClaims = dataService.getClaims();
    
    setPendingApprovals(dataService.getPendingClaimApprovalsByApprover(selectedApprover));
    setWorkflows(allWorkflows);
    setClaims(allClaims);
  };

  const handleApprovalAction = (stepId: string, action: 'approve' | 'reject' | 'skip') => {
    const comments = actionComments[stepId] || '';
    const success = dataService.processClaimApprovalStep(stepId, action, comments, selectedApprover);
    
    if (success) {
      // Force immediate refresh of all data
      const allSteps = dataService.getClaimApprovalSteps();
      const allWorkflows = dataService.getClaimApprovalWorkflows();
      const allClaims = dataService.getClaims();
      
      setPendingApprovals(dataService.getPendingClaimApprovalsByApprover(selectedApprover));
      setWorkflows([...allWorkflows]); // Force new array reference
      setClaims([...allClaims]); // Force new array reference
      
      onClaimsChange();
      setActionComments(prev => ({ ...prev, [stepId]: '' }));
      
      const actionText = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'skipped';
      alert(`Claim ${actionText} successfully!`);
    } else {
      alert('Failed to process approval. Please try again.');
    }
  };

  const getClaimDetails = (claimId: string): Claim | undefined => {
    return claims.find(claim => claim.id === claimId);
  };

  const getWorkflowForClaim = (claimId: string): ClaimApprovalWorkflow | undefined => {
    return workflows.find(wf => wf.claimId === claimId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'skipped': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getClaimTypeColor = (type: string) => {
    switch (type) {
      case 'travel': return 'bg-blue-50 text-blue-700';
      case 'medical': return 'bg-red-50 text-red-700';
      case 'equipment': return 'bg-purple-50 text-purple-700';
      case 'training': return 'bg-green-50 text-green-700';
      case 'meal': return 'bg-orange-50 text-orange-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getApproverTypeIcon = (type: string) => {
    switch (type) {
      case 'direct-manager': return <User className="w-4 h-4" />;
      case 'department-head': return <User className="w-4 h-4" />;
      case 'finance': return <DollarSign className="w-4 h-4" />;
      case 'hr': return <FileText className="w-4 h-4" />;
      case 'specific-person': return <User className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Claim Approval Dashboard</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XCircle className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Approver Selection */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View as Approver
              </label>
              <select
                value={selectedApprover}
                onChange={(e) => setSelectedApprover(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {approvers.map(approver => (
                  <option key={approver} value={approver}>{approver}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={refreshData}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Pending Approvals for {selectedApprover} ({pendingApprovals.length})
            </h3>
            
            {pendingApprovals.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Pending Approvals</h4>
                <p className="text-gray-600">All claims requiring your approval have been processed.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingApprovals.map(step => {
                  const claim = getClaimDetails(step.claimId);
                  const workflow = getWorkflowForClaim(step.claimId);
                  
                  if (!claim || !workflow) return null;
                  
                  return (
                    <div key={step.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {claim.employeeName.split(' ').map(n => n.charAt(0)).join('')}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{claim.employeeName}</h4>
                            <p className="text-sm text-gray-600">Employee ID: {claim.employeeId}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getClaimTypeColor(claim.claimType)}`}>
                            {claim.claimType.charAt(0).toUpperCase() + claim.claimType.slice(1)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(claim.urgency)}`}>
                            {claim.urgency.charAt(0).toUpperCase() + claim.urgency.slice(1)}
                          </span>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>Level {step.level}/{workflow.totalLevels}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-semibold text-lg text-gray-900">
                              {claim.currency} {claim.amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Submitted: {new Date(claim.submissionDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FileText className="w-4 h-4" />
                            <span>Category: {claim.category}</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Description:</p>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{claim.description}</p>
                          {claim.receiptUrl && (
                            <a
                              href={claim.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-2"
                            >
                              <FileText className="w-4 h-4" />
                              View Receipt
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Workflow Progress */}
                      <div className="mb-6">
                        <p className="text-sm font-medium text-gray-700 mb-3">Approval Progress</p>
                        <div className="flex items-center gap-2">
                          {workflow.steps.map((workflowStep, index) => (
                            <React.Fragment key={workflowStep.id}>
                              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                                workflowStep.isCurrentStep ? 'bg-yellow-100 border-2 border-yellow-300' :
                                workflowStep.status === 'approved' ? 'bg-green-100' :
                                workflowStep.status === 'rejected' ? 'bg-red-100' :
                                workflowStep.status === 'skipped' ? 'bg-gray-100' :
                                'bg-gray-50'
                              }`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                  workflowStep.isCurrentStep ? 'bg-yellow-600 text-white' :
                                  workflowStep.status === 'approved' ? 'bg-green-600 text-white' :
                                  workflowStep.status === 'rejected' ? 'bg-red-600 text-white' :
                                  workflowStep.status === 'skipped' ? 'bg-gray-600 text-white' :
                                  'bg-gray-300 text-gray-600'
                                }`}>
                                  {workflowStep.level}
                                </div>
                                <div className="text-sm">
                                  <p className="font-medium text-gray-900">{workflowStep.approverName}</p>
                                  <p className="text-xs text-gray-600">
                                    {workflowStep.status === 'pending' ? 'Pending' :
                                     workflowStep.status === 'approved' ? 'Approved' :
                                     workflowStep.status === 'rejected' ? 'Rejected' :
                                     workflowStep.status === 'skipped' ? 'Skipped' : 'Waiting'}
                                  </p>
                                </div>
                              </div>
                              {index < workflow.steps.length - 1 && (
                                <div className="w-6 h-0.5 bg-gray-300"></div>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      {/* Action Area */}
                      {step.isCurrentStep && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-5 h-5 text-blue-600" />
                            <h5 className="font-medium text-blue-900">Action Required</h5>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Comments (optional)
                            </label>
                            <textarea
                              value={actionComments[step.id] || ''}
                              onChange={(e) => setActionComments(prev => ({ ...prev, [step.id]: e.target.value }))}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Add comments about your decision..."
                            />
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleApprovalAction(step.id, 'approve')}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleApprovalAction(step.id, 'reject')}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </button>
                            {step.level > 1 && step.canSkip && (
                              <button
                                onClick={() => handleApprovalAction(step.id, 'skip')}
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                              >
                                <Clock className="w-4 h-4" />
                                Skip
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* All Workflows Summary */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              All Active Workflows ({workflows.filter(w => w.status === 'pending').length})
            </h3>
            
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Claim Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Workflow
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Step
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {workflows.filter(w => w.status === 'pending').map(workflow => {
                      const claim = getClaimDetails(workflow.claimId);
                      const currentStep = workflow.steps.find(s => s.isCurrentStep);
                      
                      if (!claim) return null;
                      
                      return (
                        <tr key={workflow.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  {claim.employeeName.split(' ').map(n => n.charAt(0)).join('')}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {claim.employeeName}
                                </div>
                                <div className="text-sm text-gray-500">ID: {claim.employeeId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getClaimTypeColor(claim.claimType)}`}>
                                  {claim.claimType.charAt(0).toUpperCase() + claim.claimType.slice(1)}
                                </span>
                                <span className="font-semibold">{claim.currency} {claim.amount.toLocaleString()}</span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {claim.category} • {new Date(claim.submissionDate).toLocaleDateString()}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{workflow.ruleName}</div>
                            <div className="text-xs text-gray-500">
                              Level {workflow.currentLevel} of {workflow.totalLevels}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {currentStep && (
                              <div className="flex items-center gap-2">
                                {getApproverTypeIcon(currentStep.approverType)}
                                <div className="text-sm">
                                  <p className="font-medium text-gray-900">{currentStep.approverName}</p>
                                  <p className="text-xs text-gray-500">
                                    {currentStep.approverType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </p>
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(workflow.status)}`}>
                              {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimApprovalDashboard;