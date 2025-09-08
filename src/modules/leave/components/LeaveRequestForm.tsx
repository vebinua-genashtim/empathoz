import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Settings, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { LeaveRequest, LeaveBalance, LeaveGuidelinesConfig, dataService } from '../../../services/dataService';

interface LeaveRequestFormProps {
  leaveRequest?: LeaveRequest;
  onSave: (leaveRequest: Omit<LeaveRequest, 'id' | 'appliedDate' | 'approvedBy'> | LeaveRequest) => void;
  onCancel: () => void;
  isOpen: boolean;
  isAdmin?: boolean;
  leaveBalances: LeaveBalance[];
  leaveGuidelinesConfig: LeaveGuidelinesConfig;
  onGuidelinesConfigChange: (config: LeaveGuidelinesConfig) => void;
}

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({
  leaveRequest,
  onSave,
  onCancel,
  isOpen,
  isAdmin = false,
  leaveBalances,
  leaveGuidelinesConfig,
  onGuidelinesConfigChange
}) => {
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    leaveType: 'vacation' as const,
    startDate: '',
    endDate: '',
    days: 1,
    status: 'pending' as const,
    reason: ''
  });

  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [showGuidelinesConfig, setShowGuidelinesConfig] = useState(false);
  const [editingGuidelines, setEditingGuidelines] = useState({
    title: '',
    content: ''
  });

  const employees = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Mike Johnson' },
    { id: '4', name: 'Sarah Wilson' },
    { id: '5', name: 'Emily Rodriguez' },
    { id: '6', name: 'David Kim' },
    { id: '7', name: 'Lisa Chen' },
    { id: '8', name: 'Robert Brown' }
  ];

  const leaveTypes = [
    { value: 'vacation', label: 'Vacation' },
    { value: 'sick', label: 'Sick Leave' },
    { value: 'personal', label: 'Personal Leave' },
    { value: 'maternity', label: 'Maternity Leave' },
    { value: 'paternity', label: 'Paternity Leave' }
  ];

  const statuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  useEffect(() => {
    if (leaveRequest) {
      setFormData({
        employeeName: leaveRequest.employeeName,
        employeeId: leaveRequest.employeeId,
        leaveType: leaveRequest.leaveType,
        startDate: leaveRequest.startDate,
        endDate: leaveRequest.endDate,
        days: leaveRequest.days,
        status: leaveRequest.status,
        reason: leaveRequest.reason
      });
    } else {
      // Reset form with default values
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        employeeName: '',
        employeeId: '',
        leaveType: 'vacation',
        startDate: today,
        endDate: today,
        days: 1,
        status: 'pending',
        reason: ''
      });
    }
    setFormErrors([]);
  }, [leaveRequest, isOpen]);

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 1;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
    return diffDays;
  };

  const getEmployeeLeaveBalance = (employeeId: string) => {
    return leaveBalances.find(balance => balance.employeeId === employeeId);
  };

  const getRemainingLeave = (employeeId: string, leaveType: keyof Omit<LeaveBalance, 'employeeId' | 'employeeName'>) => {
    const balance = getEmployeeLeaveBalance(employeeId);
    if (!balance) return 0;
    return balance[leaveType].total - balance[leaveType].used;
  };

  const validateLeaveRequest = () => {
    const errors: string[] = [];
    
    if (!formData.employeeId) {
      errors.push('Please select an employee');
      setFormErrors(errors);
      return false;
    }

    const remainingLeave = getRemainingLeave(formData.employeeId, formData.leaveType);
    
    if (formData.days > remainingLeave) {
      errors.push(`Insufficient ${formData.leaveType} leave balance. Only ${remainingLeave} days remaining.`);
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      errors.push('End date must be after start date');
    }

    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLeaveRequest()) {
      return;
    }
    
    if (leaveRequest) {
      onSave({
        ...leaveRequest,
        ...formData
      });
    } else {
      onSave(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-calculate days when dates change
      if (name === 'startDate' || name === 'endDate') {
        updated.days = calculateDays(
          name === 'startDate' ? value : prev.startDate,
          name === 'endDate' ? value : prev.endDate
        );
      }
      
      // Auto-fill employee name when employee ID is selected
      if (name === 'employeeId') {
        const selectedEmployee = employees.find(emp => emp.id === value);
        if (selectedEmployee) {
          updated.employeeName = selectedEmployee.name;
        }
      }
      
      return updated;
    });
    
    // Clear errors when user makes changes
    if (formErrors.length > 0) {
      setFormErrors([]);
    }
  };

  const handleGuidelinesConfigSave = () => {
    const newConfig: LeaveGuidelinesConfig = {
      ...leaveGuidelinesConfig,
      title: editingGuidelines.title,
      content: editingGuidelines.content.split('\n').filter(line => line.trim())
    };
    onGuidelinesConfigChange(newConfig);
    setShowGuidelinesConfig(false);
  };

  const handleEditGuidelines = () => {
    setEditingGuidelines({
      title: leaveGuidelinesConfig.title,
      content: leaveGuidelinesConfig.content.join('\n')
    });
    setShowGuidelinesConfig(true);
  };

  if (!isOpen) return null;

  const selectedEmployeeBalance = formData.employeeId ? getEmployeeLeaveBalance(formData.employeeId) : null;
  const remainingLeave = formData.employeeId ? getRemainingLeave(formData.employeeId, formData.leaveType) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {leaveRequest ? 'Edit Leave Request' : 'New Leave Request'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form Errors */}
        {formErrors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
            </div>
            <ul className="text-sm text-red-700 space-y-1">
              {formErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Employee Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Employee Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee *
                </label>
                <select
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Employee</option>
                  {employees.map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} (ID: {employee.id})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Name
                </label>
                <input
                  type="text"
                  name="employeeName"
                  value={formData.employeeName}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  placeholder="Auto-filled when employee is selected"
                />
              </div>
            </div>

            {/* Employee Leave Balance Display */}
            {selectedEmployeeBalance && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-3">Leave Balance for {selectedEmployeeBalance.employeeName}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(selectedEmployeeBalance).map(([key, value]) => {
                    if (key === 'employeeId' || key === 'employeeName') return null;
                    const leaveData = value as { used: number; total: number };
                    const remaining = leaveData.total - leaveData.used;
                    const isCurrentType = key === formData.leaveType;
                    
                    return (
                      <div key={key} className={`p-3 rounded-lg ${isCurrentType ? 'bg-blue-100 border-2 border-blue-300' : 'bg-white border border-gray-200'}`}>
                        <div className="text-xs font-medium text-gray-700 mb-1">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </div>
                        <div className="text-sm font-bold text-gray-900">
                          {remaining} days left
                        </div>
                        <div className="text-xs text-gray-500">
                          {leaveData.used}/{leaveData.total} used
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                          <div 
                            className={`h-1 rounded-full ${isCurrentType ? 'bg-blue-600' : 'bg-gray-400'}`}
                            style={{ width: `${(leaveData.used / leaveData.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {formData.employeeId && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Available {formData.leaveType} leave:
                      </span>
                      <span className={`text-sm font-bold ${remainingLeave > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {remainingLeave} days
                      </span>
                    </div>
                    {remainingLeave === 0 && (
                      <p className="text-xs text-red-600 mt-1">
                        No {formData.leaveType} leave remaining. Please select a different leave type.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Leave Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Leave Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Type *
                </label>
                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {leaveTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Days
                </label>
                <input
                  type="number"
                  name="days"
                  value={formData.days}
                  readOnly
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 ${
                    formData.employeeId && formData.days > remainingLeave ? 'text-red-600 border-red-300' : 'text-gray-600'
                  }`}
                />
                {formData.employeeId && formData.days > remainingLeave && (
                  <p className="text-xs text-red-600 mt-1">
                    Exceeds available leave by {formData.days - remainingLeave} days
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Leave *
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please provide a reason for your leave request..."
              />
            </div>
          </div>

          {/* Leave Request Guidelines */}
          {leaveGuidelinesConfig.visible && (
            <div className="bg-blue-50 p-4 rounded-lg relative">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-blue-900">{leaveGuidelinesConfig.title}</h4>
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onGuidelinesConfigChange({ ...leaveGuidelinesConfig, visible: false })}
                      className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                      title="Hide Guidelines"
                    >
                      <EyeOff className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleEditGuidelines}
                      className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                      title="Edit Guidelines"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <ul className="text-sm text-blue-800 space-y-1">
                {leaveGuidelinesConfig.content.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Approval Workflow Preview */}
          {formData.employeeId && formData.leaveType && formData.days > 0 && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-green-900 mb-3">Approval Workflow Preview</h4>
              <ApprovalWorkflowPreview
                leaveType={formData.leaveType}
                days={formData.days}
                employeeId={formData.employeeId}
              />
            </div>
          )}

          {/* Admin: Show Guidelines if hidden */}
          {isAdmin && !leaveGuidelinesConfig.visible && (
            <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <EyeOff className="w-4 h-4" />
                <span className="text-sm">Leave Request Guidelines (Hidden)</span>
                <button
                  type="button"
                  onClick={() => onGuidelinesConfigChange({ ...leaveGuidelinesConfig, visible: true })}
                  className="ml-2 p-1 text-blue-600 hover:text-blue-800 transition-colors"
                  title="Show Guidelines"
                >
                  <Eye className="w-4 h-4" />
                </button>
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
              disabled={formData.employeeId && formData.days > remainingLeave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {leaveRequest ? 'Update' : 'Submit'} Request
            </button>
          </div>
        </form>
      </div>

      {/* Guidelines Configuration Modal */}
      {showGuidelinesConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Configure Leave Request Guidelines</h2>
              </div>
              <button
                onClick={() => setShowGuidelinesConfig(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guidelines Title
                </label>
                <input
                  type="text"
                  value={editingGuidelines.title}
                  onChange={(e) => setEditingGuidelines(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter guidelines title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guidelines Content
                </label>
                <textarea
                  value={editingGuidelines.content}
                  onChange={(e) => setEditingGuidelines(prev => ({ ...prev, content: e.target.value }))}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter each guideline on a new line..."
                />
                <p className="text-xs text-gray-500 mt-1">Each line will be displayed as a separate bullet point</p>
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Preview:</strong> Changes will be applied immediately and visible to all users filling out leave requests.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowGuidelinesConfig(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGuidelinesConfigSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Guidelines
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Approval Workflow Preview Component
interface ApprovalWorkflowPreviewProps {
  leaveType: string;
  days: number;
  employeeId: string;
}

const ApprovalWorkflowPreview: React.FC<ApprovalWorkflowPreviewProps> = ({
  leaveType,
  days,
  employeeId
}) => {
  const mockRequest = {
    employeeId,
    leaveType: leaveType as any,
    days,
    employeeName: '',
    startDate: '',
    endDate: '',
    status: 'pending' as const,
    reason: ''
  };

  const applicableRule = dataService.findApplicableApprovalRule(mockRequest);

  if (!applicableRule) {
    return (
      <div className="text-sm text-orange-700">
        <p>⚠️ No approval rule found for this request. It may require manual review.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-green-800">
        <strong>Rule:</strong> {applicableRule.name}
      </p>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-green-800 font-medium">Approval Chain:</span>
        <div className="flex items-center gap-2">
          {applicableRule.approvalChain.map((level, index) => (
            <React.Fragment key={level.level}>
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-green-200">
                <div className="w-4 h-4 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {level.level}
                </div>
                <span className="text-xs text-gray-700">
                  {level.approverType === 'direct-manager' ? 'Manager' :
                   level.approverType === 'department-head' ? 'Dept Head' :
                   level.approverType === 'hr' ? 'HR' :
                   level.approverName || 'Specific'}
                </span>
              </div>
              {index < applicableRule.approvalChain.length - 1 && (
                <div className="w-3 h-0.5 bg-green-400"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <p className="text-xs text-green-700">
        This request will require {applicableRule.approvalChain.length} approval{applicableRule.approvalChain.length !== 1 ? 's' : ''} before being processed.
      </p>
    </div>
  );
};

export default LeaveRequestForm;