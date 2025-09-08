import React, { useState, useEffect } from 'react';
import { X, Save, FileText, DollarSign, AlertTriangle, Settings, Eye, EyeOff } from 'lucide-react';
import { dataService } from '../../../services/dataService';
import { Claim } from '../../../services/dataService';

interface ClaimFormProps {
  claim?: Claim;
  onSave: (claim: Omit<Claim, 'id' | 'submissionDate' | 'approvedBy'> | Claim) => void;
  onCancel: () => void;
  isOpen: boolean;
  isAdmin?: boolean;
}

export default function ClaimForm({
  claim,
  onSave,
  onCancel,
  isOpen,
  isAdmin = false
}: ClaimFormProps) {
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    claimType: 'travel' as const,
    amount: 0,
    currency: 'USD',
    description: '',
    status: 'pending' as const,
    receiptUrl: '',
    category: '',
    urgency: 'medium' as const
  });

  // Guidelines configuration state
  const [guidelinesConfig, setGuidelinesConfig] = useState({
    visible: true,
    title: 'Claim Submission Guidelines',
    content: [
      '• Attach receipts for all expenses over $25',
      '• Submit claims within 30 days of expense incurrence',
      '• Provide detailed descriptions for business justification',
      '• Travel claims require pre-approval for amounts over $500',
      '• Medical claims may require additional documentation'
    ]
  });
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

  const claimTypes = [
    { value: 'travel', label: 'Travel Expenses' },
    { value: 'medical', label: 'Medical Expenses' },
    { value: 'equipment', label: 'Equipment Purchase' },
    { value: 'training', label: 'Training & Education' },
    { value: 'meal', label: 'Meal Expenses' },
    { value: 'other', label: 'Other Expenses' }
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];

  // Country to currency mapping
  const countryToCurrencyMap: { [key: string]: string } = {
    'United States': 'USD',
    'USA': 'USD',
    'US': 'USD',
    'United Kingdom': 'GBP',
    'UK': 'GBP',
    'Britain': 'GBP',
    'England': 'GBP',
    'Scotland': 'GBP',
    'Wales': 'GBP',
    'Germany': 'EUR',
    'France': 'EUR',
    'Spain': 'EUR',
    'Italy': 'EUR',
    'Netherlands': 'EUR',
    'Belgium': 'EUR',
    'Austria': 'EUR',
    'Portugal': 'EUR',
    'Ireland': 'EUR',
    'Finland': 'EUR',
    'Greece': 'EUR',
    'Canada': 'CAD',
    'Australia': 'AUD'
  };

  // Browser locale to currency mapping
  const localeToCurrencyMap: { [key: string]: string } = {
    'US': 'USD',
    'GB': 'GBP',
    'DE': 'EUR',
    'FR': 'EUR',
    'ES': 'EUR',
    'IT': 'EUR',
    'NL': 'EUR',
    'BE': 'EUR',
    'AT': 'EUR',
    'PT': 'EUR',
    'IE': 'EUR',
    'FI': 'EUR',
    'GR': 'EUR',
    'CA': 'CAD',
    'AU': 'AUD'
  };

  const getDefaultCurrency = (employeeId?: string): string => {
    // Priority 1: Employee's registered country
    if (employeeId) {
      const employee = employees.find(emp => emp.id === employeeId);
      if (employee?.country) {
        const currencyFromCountry = countryToCurrencyMap[employee.country];
        if (currencyFromCountry && currencies.includes(currencyFromCountry)) {
          return currencyFromCountry;
        }
      }
    }

    // Priority 2: Browser locale
    try {
      const locale = navigator.language || 'en-US';
      const countryCode = locale.split('-')[1]?.toUpperCase();
      if (countryCode) {
        const currencyFromLocale = localeToCurrencyMap[countryCode];
        if (currencyFromLocale && currencies.includes(currencyFromLocale)) {
          return currencyFromLocale;
        }
      }
    } catch (error) {
      console.warn('Could not determine currency from browser locale:', error);
    }

    // Priority 3: Default to USD
    return 'USD';
  };

  const categories = [
    'Business Travel',
    'Client Entertainment',
    'Office Supplies',
    'Software & Tools',
    'Professional Development',
    'Health & Wellness',
    'Transportation',
    'Accommodation',
    'Conference & Events',
    'Miscellaneous'
  ];

  const statuses = [
    { value: 'pending', label: 'Pending Review' },
    { value: 'processing', label: 'Processing' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' }
  ];

  useEffect(() => {
    if (claim) {
      setFormData({
        employeeName: claim.employeeName,
        employeeId: claim.employeeId,
        claimType: claim.claimType,
        amount: claim.amount,
        currency: claim.currency,
        description: claim.description,
        status: claim.status,
        receiptUrl: claim.receiptUrl || '',
        category: claim.category,
        urgency: claim.urgency
      });
    } else {
      // Reset form with default values
      setFormData({
        employeeName: '',
        employeeId: '',
        claimType: 'travel',
        amount: 0,
        currency: getDefaultCurrency(),
        description: '',
        status: 'pending',
        receiptUrl: '',
        category: 'Business Travel',
        urgency: 'medium'
      });
    }
  }, [claim, isOpen]);

  // Update currency when employee changes
  useEffect(() => {
    if (!claim && formData.employeeId) {
      const newCurrency = getDefaultCurrency(formData.employeeId);
      if (newCurrency !== formData.currency) {
        setFormData(prev => ({
          ...prev,
          currency: newCurrency
        }));
      }
    }
  }, [formData.employeeId, claim]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (claim) {
      onSave({
        ...claim,
        ...formData
      });
    } else {
      // For new claims, always start with pending status
      onSave({
        ...formData,
        status: 'pending'
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: name === 'amount' ? parseFloat(value) || 0 : value };
      
      // Auto-fill employee name when employee ID is selected
      if (name === 'employeeId') {
        const selectedEmployee = employees.find(emp => emp.id === value);
        if (selectedEmployee) {
          updated.employeeName = selectedEmployee.name;
        }
      }
      
      return updated;
    });
  };

  const handleGuidelinesConfigSave = () => {
    setGuidelinesConfig(prev => ({
      ...prev,
      title: editingGuidelines.title,
      content: editingGuidelines.content.split('\n').filter(line => line.trim())
    }));
    setShowGuidelinesConfig(false);
  };

  const handleEditGuidelines = () => {
    setEditingGuidelines({
      title: guidelinesConfig.title,
      content: guidelinesConfig.content.join('\n')
    });
    setShowGuidelinesConfig(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {claim ? 'Edit Claim' : 'Submit New Claim'}
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
          </div>

          {/* Claim Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Claim Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Claim Type *
                </label>
                <select
                  name="claimType"
                  value={formData.claimType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {claimTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Amount *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency *
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency
                </label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {urgencyLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please provide detailed description of the expense..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Receipt URL
                </label>
                <input
                  type="url"
                  name="receiptUrl"
                  value={formData.receiptUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/receipt.pdf"
                />
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
          </div>

          {/* Claim Guidelines */}
          {guidelinesConfig.visible && (
            <div className="bg-blue-50 p-4 rounded-lg relative">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-blue-900">{guidelinesConfig.title}</h4>
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setGuidelinesConfig(prev => ({ ...prev, visible: false }))}
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
                {guidelinesConfig.content.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Admin: Show Guidelines if hidden */}
          {isAdmin && !guidelinesConfig.visible && (
            <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <EyeOff className="w-4 h-4" />
                <span className="text-sm">Claim Submission Guidelines (Hidden)</span>
                <button
                  type="button"
                  onClick={() => setGuidelinesConfig(prev => ({ ...prev, visible: true }))}
                  className="ml-2 p-1 text-blue-600 hover:text-blue-800 transition-colors"
                  title="Show Guidelines"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Approval Workflow Preview */}
          {formData.employeeId && formData.claimType && formData.amount > 0 && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-green-900 mb-3">Approval Workflow Preview</h4>
              <ClaimApprovalWorkflowPreview
                claimType={formData.claimType}
                amount={formData.amount}
                employeeId={formData.employeeId}
                category={formData.category}
                urgency={formData.urgency}
              />
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
              {claim ? 'Update' : 'Submit'} Claim
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
                <h2 className="text-xl font-semibold text-gray-900">Configure Claim Submission Guidelines</h2>
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
                  <strong>Preview:</strong> Changes will be applied immediately and visible to all users filling out claim forms.
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
}

// Claim Approval Workflow Preview Component
interface ClaimApprovalWorkflowPreviewProps {
  claimType: string;
  amount: number;
  employeeId: string;
  category: string;
  urgency: string;
}

const ClaimApprovalWorkflowPreview: React.FC<ClaimApprovalWorkflowPreviewProps> = ({
  claimType,
  amount,
  employeeId,
  category,
  urgency
}) => {
  const mockClaim = {
    employeeId,
    claimType: claimType as any,
    amount,
    category,
    urgency: urgency as any,
    employeeName: '',
    currency: 'USD',
    description: '',
    submissionDate: '',
    status: 'pending' as const
  };

  const applicableRule = dataService.findApplicableClaimApprovalRule(mockClaim);

  if (!applicableRule) {
    return (
      <div className="text-sm text-orange-700">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-medium">No approval rule found</span>
        </div>
        <p>This claim may require manual review or a new approval rule needs to be configured.</p>
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
                   level.approverType === 'finance' ? 'Finance' :
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
        This claim will require {applicableRule.approvalChain.length} approval{applicableRule.approvalChain.length !== 1 ? 's' : ''} before being processed.
      </p>
    </div>
  );
};