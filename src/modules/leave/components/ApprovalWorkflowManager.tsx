import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Edit, Users, Settings, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { ApprovalRule, ApprovalLevel, dataService } from '../../../services/dataService';

interface ApprovalWorkflowManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onRulesChange: () => void;
}

const ApprovalWorkflowManager: React.FC<ApprovalWorkflowManagerProps> = ({
  isOpen,
  onClose,
  onRulesChange
}) => {
  const [approvalRules, setApprovalRules] = useState<ApprovalRule[]>([]);
  const [editingRule, setEditingRule] = useState<ApprovalRule | null>(null);
  const [showRuleForm, setShowRuleForm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApprovalRules(dataService.getApprovalRules());
    }
  }, [isOpen]);

  const handleSaveRule = (ruleData: Omit<ApprovalRule, 'id'> | ApprovalRule) => {
    if ('id' in ruleData) {
      dataService.updateApprovalRule(ruleData.id, ruleData);
    } else {
      dataService.createApprovalRule(ruleData);
    }
    setApprovalRules(dataService.getApprovalRules());
    setShowRuleForm(false);
    setEditingRule(null);
    onRulesChange();
  };

  const handleEditRule = (rule: ApprovalRule) => {
    setEditingRule(rule);
    setShowRuleForm(true);
  };

  const handleDeleteRule = (id: string) => {
    if (window.confirm('Are you sure you want to delete this approval rule?')) {
      dataService.deleteApprovalRule(id);
      setApprovalRules(dataService.getApprovalRules());
      onRulesChange();
    }
  };

  const toggleRuleStatus = (id: string) => {
    const rule = approvalRules.find(r => r.id === id);
    if (rule) {
      dataService.updateApprovalRule(id, { isActive: !rule.isActive });
      setApprovalRules(dataService.getApprovalRules());
      onRulesChange();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Approval Workflow Manager</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingRule(null);
                setShowRuleForm(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Rule
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Rules List */}
        <div className="space-y-4">
          {approvalRules.map(rule => (
            <div key={rule.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Leave Types</p>
                      <p className="text-sm text-gray-600">
                        {rule.leaveTypes.map(type => type.charAt(0).toUpperCase() + type.slice(1)).join(', ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Conditions</p>
                      <div className="text-sm text-gray-600">
                        {rule.conditions.minDays && <p>Min: {rule.conditions.minDays} days</p>}
                        {rule.conditions.maxDays && <p>Max: {rule.conditions.maxDays} days</p>}
                        {rule.conditions.departments && rule.conditions.departments.length > 0 && (
                          <p>Depts: {rule.conditions.departments.join(', ')}</p>
                        )}
                        {rule.conditions.positions && rule.conditions.positions.length > 0 && (
                          <p>Positions: {rule.conditions.positions.join(', ')}</p>
                        )}
                        {!rule.conditions.minDays && !rule.conditions.maxDays && 
                         (!rule.conditions.departments || rule.conditions.departments.length === 0) &&
                         (!rule.conditions.positions || rule.conditions.positions.length === 0) && (
                          <p>No specific conditions</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Approval Levels</p>
                      <p className="text-sm text-gray-600">{rule.approvalChain.length} level{rule.approvalChain.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  {/* Approval Chain Visualization */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-3">Approval Chain</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {rule.approvalChain.map((level, index) => (
                        <React.Fragment key={level.level}>
                          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {level.level}
                            </div>
                            <div className="text-sm">
                              <p className="font-medium text-gray-900">
                                {level.approverType === 'direct-manager' ? 'Direct Manager' :
                                 level.approverType === 'department-head' ? 'Department Head' :
                                 level.approverType === 'hr' ? 'HR Manager' :
                                 level.approverName || 'Specific Person'}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                {level.isRequired ? (
                                  <span className="flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    Required
                                  </span>
                                ) : (
                                  <span>Optional</span>
                                )}
                                {level.canSkip && (
                                  <span className="text-blue-600">Can Skip</span>
                                )}
                              </div>
                            </div>
                          </div>
                          {index < rule.approvalChain.length - 1 && (
                            <div className="w-6 h-0.5 bg-gray-300"></div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleRuleStatus(rule.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      rule.isActive 
                        ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50' 
                        : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                    }`}
                    title={rule.isActive ? 'Deactivate Rule' : 'Activate Rule'}
                  >
                    {rule.isActive ? <Clock className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleEditRule(rule)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {approvalRules.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No approval rules configured</h3>
              <p className="text-gray-600">Create your first approval rule to get started</p>
            </div>
          )}
        </div>

        {/* Rule Form Modal */}
        {showRuleForm && (
          <ApprovalRuleForm
            rule={editingRule}
            onSave={handleSaveRule}
            onCancel={() => {
              setShowRuleForm(false);
              setEditingRule(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Approval Rule Form Component
interface ApprovalRuleFormProps {
  rule?: ApprovalRule | null;
  onSave: (rule: Omit<ApprovalRule, 'id'> | ApprovalRule) => void;
  onCancel: () => void;
}

const ApprovalRuleForm: React.FC<ApprovalRuleFormProps> = ({ rule, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    leaveTypes: [] as string[],
    conditions: {
      minDays: undefined as number | undefined,
      maxDays: undefined as number | undefined,
      departments: [] as string[],
      positions: [] as string[]
    },
    approvalChain: [] as ApprovalLevel[],
    isActive: true
  });

  const leaveTypes = ['vacation', 'sick', 'personal', 'maternity', 'paternity'];
  const departments = dataService.getDepartments();
  const positions = ['CEO', 'CTO', 'VP', 'Director', 'Manager', 'Senior', 'Junior', 'Intern'];
  const approverTypes = [
    { value: 'direct-manager', label: 'Direct Manager' },
    { value: 'department-head', label: 'Department Head' },
    { value: 'hr', label: 'HR Manager' },
    { value: 'specific-person', label: 'Specific Person' }
  ];

  useEffect(() => {
    if (rule) {
      setFormData({
        name: rule.name,
        leaveTypes: [...rule.leaveTypes],
        conditions: {
          minDays: rule.conditions.minDays,
          maxDays: rule.conditions.maxDays,
          departments: [...(rule.conditions.departments || [])],
          positions: [...(rule.conditions.positions || [])]
        },
        approvalChain: [...rule.approvalChain],
        isActive: rule.isActive
      });
    } else {
      setFormData({
        name: '',
        leaveTypes: [],
        conditions: {
          minDays: undefined,
          maxDays: undefined,
          departments: [],
          positions: []
        },
        approvalChain: [],
        isActive: true
      });
    }
  }, [rule]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rule) {
      onSave({
        ...rule,
        ...formData
      });
    } else {
      onSave(formData);
    }
  };

  const handleLeaveTypeChange = (leaveType: string) => {
    setFormData(prev => ({
      ...prev,
      leaveTypes: prev.leaveTypes.includes(leaveType)
        ? prev.leaveTypes.filter(t => t !== leaveType)
        : [...prev.leaveTypes, leaveType]
    }));
  };

  const handleDepartmentChange = (department: string) => {
    setFormData(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        departments: prev.conditions.departments.includes(department)
          ? prev.conditions.departments.filter(d => d !== department)
          : [...prev.conditions.departments, department]
      }
    }));
  };

  const handlePositionChange = (position: string) => {
    setFormData(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        positions: prev.conditions.positions.includes(position)
          ? prev.conditions.positions.filter(p => p !== position)
          : [...prev.conditions.positions, position]
      }
    }));
  };

  const addApprovalLevel = () => {
    const newLevel: ApprovalLevel = {
      level: formData.approvalChain.length + 1,
      approverType: 'direct-manager',
      isRequired: true,
      canSkip: false
    };
    setFormData(prev => ({
      ...prev,
      approvalChain: [...prev.approvalChain, newLevel]
    }));
  };

  const updateApprovalLevel = (index: number, updates: Partial<ApprovalLevel>) => {
    setFormData(prev => ({
      ...prev,
      approvalChain: prev.approvalChain.map((level, i) => 
        i === index ? { ...level, ...updates } : level
      )
    }));
  };

  const removeApprovalLevel = (index: number) => {
    setFormData(prev => ({
      ...prev,
      approvalChain: prev.approvalChain
        .filter((_, i) => i !== index)
        .map((level, i) => ({ ...level, level: i + 1 }))
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {rule ? 'Edit Approval Rule' : 'Create Approval Rule'}
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
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rule Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter rule name (e.g., Standard Vacation Approval)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Applicable Leave Types *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {leaveTypes.map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.leaveTypes.includes(type)}
                      onChange={() => handleLeaveTypeChange(type)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Active Rule</span>
              </label>
            </div>
          </div>

          {/* Conditions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Conditions</h3>
            <p className="text-sm text-gray-600">Define when this rule should apply (leave empty for no restrictions)</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Days
                </label>
                <input
                  type="number"
                  value={formData.conditions.minDays || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    conditions: {
                      ...prev.conditions,
                      minDays: e.target.value ? parseInt(e.target.value) : undefined
                    }
                  }))}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="No minimum"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Days
                </label>
                <input
                  type="number"
                  value={formData.conditions.maxDays || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    conditions: {
                      ...prev.conditions,
                      maxDays: e.target.value ? parseInt(e.target.value) : undefined
                    }
                  }))}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="No maximum"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specific Departments (optional)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {departments.map(dept => (
                  <label key={dept} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.conditions.departments.includes(dept)}
                      onChange={() => handleDepartmentChange(dept)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{dept}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specific Positions (optional)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {positions.map(position => (
                  <label key={position} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.conditions.positions.includes(position)}
                      onChange={() => handlePositionChange(position)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{position}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Approval Chain */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Approval Chain</h3>
              <button
                type="button"
                onClick={addApprovalLevel}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Level
              </button>
            </div>

            <div className="space-y-4">
              {formData.approvalChain.map((level, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {level.level}
                      </div>
                      <span className="text-sm font-medium text-gray-700">Approval Level {level.level}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeApprovalLevel(index)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Approver Type *
                      </label>
                      <select
                        value={level.approverType}
                        onChange={(e) => updateApprovalLevel(index, { 
                          approverType: e.target.value as ApprovalLevel['approverType'],
                          approverName: e.target.value === 'specific-person' ? '' : undefined
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {approverTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {level.approverType === 'specific-person' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Approver Name *
                        </label>
                        <input
                          type="text"
                          value={level.approverName || ''}
                          onChange={(e) => updateApprovalLevel(index, { approverName: e.target.value })}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter approver name"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-6 mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={level.isRequired}
                        onChange={(e) => updateApprovalLevel(index, { isRequired: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Required Approval</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={level.canSkip}
                        onChange={(e) => updateApprovalLevel(index, { canSkip: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Can Skip if Unavailable</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {formData.approvalChain.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No approval levels defined. Click "Add Level" to create the approval chain.</p>
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
              disabled={formData.leaveTypes.length === 0 || formData.approvalChain.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {rule ? 'Update' : 'Create'} Rule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApprovalWorkflowManager;