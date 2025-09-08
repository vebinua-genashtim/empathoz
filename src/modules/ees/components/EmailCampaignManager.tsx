import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Send, 
  Users, 
  Search, 
  Settings, 
  Eye, 
  Edit, 
  Save, 
  Copy,
  CheckCircle,
  Clock,
  AlertTriangle,
  Filter,
  Download,
  RefreshCw,
  Plus
} from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  isDefault: boolean;
}

interface Employee {
  id: string;
  name: string;
  department: string;
  email: string;
}

interface EmailCampaign {
  id: string;
  name: string;
  templateId: string;
  surveyId: string;
  targetEmployees: string[];
  sentCount: number;
  totalCount: number;
  status: 'draft' | 'sending' | 'completed' | 'failed';
  createdAt: string;
  sentAt?: string;
}

interface EmailCampaignManagerProps {
  isOpen: boolean;
  onClose: () => void;
  surveyId: string;
  surveyTitle: string;
  employees: Employee[];
}

const EmailCampaignManager: React.FC<EmailCampaignManagerProps> = ({
  isOpen,
  onClose,
  surveyId,
  surveyTitle,
  employees
}) => {
  const [activeTab, setActiveTab] = useState<'send' | 'templates' | 'campaigns'>('send');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewEmployee, setPreviewEmployee] = useState<Employee | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sendingProgress, setSendingProgress] = useState(0);

  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([
    {
      id: 'default',
      name: 'Default Survey Invitation',
      subject: 'Your Input Matters: {{surveyTitle}}',
      content: `Hi {{employeeName}},

You're invited to participate in our {{surveyTitle}}. Your feedback is valuable and will help us improve our workplace.

Survey Details:
• Duration: 15-20 minutes
• Anonymous: Yes
• Deadline: {{deadline}}

Click here to start: {{surveyLink}}

Your participation is voluntary and all responses are completely confidential. Individual responses cannot be traced back to specific employees.

Thank you for your time and honest feedback!

Best regards,
HR Team
Empathoz`,
      isDefault: true
    },
    {
      id: 'reminder',
      name: 'Survey Reminder',
      subject: 'Reminder: {{surveyTitle}} - Your Voice Matters',
      content: `Hi {{employeeName}},

This is a friendly reminder that our {{surveyTitle}} is still open for responses.

We value your input and would appreciate your participation. The survey takes approximately 15-20 minutes to complete.

Survey Link: {{surveyLink}}

If you've already completed the survey, thank you! If not, please take a few minutes to share your thoughts.

Deadline: {{deadline}}

Best regards,
HR Team`,
      isDefault: false
    },
    {
      id: 'final-reminder',
      name: 'Final Reminder',
      subject: 'Final Call: {{surveyTitle}} Closes Soon',
      content: `Hi {{employeeName}},

This is the final reminder for our {{surveyTitle}}. The survey will close soon, and we don't want to miss your valuable input.

Quick Survey Link: {{surveyLink}}

• Takes only 15-20 minutes
• Completely anonymous
• Your feedback drives positive change

Please complete the survey by {{deadline}}.

Thank you for helping us create a better workplace!

Best regards,
HR Team`,
      isDefault: false
    }
  ]);

  const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[]>([
    {
      id: '1',
      name: 'Q1 2025 Initial Invitation',
      templateId: 'default',
      surveyId: '1',
      targetEmployees: ['EMP001', 'EMP002', 'EMP003'],
      sentCount: 3,
      totalCount: 3,
      status: 'completed',
      createdAt: '2025-01-15T10:00:00Z',
      sentAt: '2025-01-15T10:05:00Z'
    }
  ]);

  const departments = [...new Set(employees.map(emp => emp.department))];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  const handleEmployeeToggle = (employeeId: string) => {
    setSelectedEmployees(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(emp => emp.id));
    }
  };

  const handleSelectByDepartment = (department: string) => {
    const deptEmployees = employees.filter(emp => emp.department === department);
    const deptEmployeeIds = deptEmployees.map(emp => emp.id);
    const allSelected = deptEmployeeIds.every(id => selectedEmployees.includes(id));
    
    if (allSelected) {
      setSelectedEmployees(prev => prev.filter(id => !deptEmployeeIds.includes(id)));
    } else {
      setSelectedEmployees(prev => [...new Set([...prev, ...deptEmployeeIds])]);
    }
  };

  const generateSurveyLink = (employee: Employee) => {
    return `${window.location.origin}/survey?surveyId=${surveyId}&userid=${employee.id}&name=${encodeURIComponent(employee.name)}`;
  };

  const processTemplate = (template: EmailTemplate, employee: Employee) => {
    const surveyLink = generateSurveyLink(employee);
    const deadline = 'February 15, 2025'; // In real app, would come from survey data
    
    const processedSubject = template.subject
      .replace(/{{employeeName}}/g, employee.name)
      .replace(/{{surveyTitle}}/g, surveyTitle)
      .replace(/{{deadline}}/g, deadline);

    const processedContent = template.content
      .replace(/{{employeeName}}/g, employee.name)
      .replace(/{{surveyTitle}}/g, surveyTitle)
      .replace(/{{surveyLink}}/g, surveyLink)
      .replace(/{{deadline}}/g, deadline)
      .replace(/{{department}}/g, employee.department);

    return { subject: processedSubject, content: processedContent };
  };

  const handlePreview = (employee: Employee) => {
    setPreviewEmployee(employee);
    setShowPreview(true);
  };

  const handleSendEmails = async () => {
    if (selectedEmployees.length === 0) {
      alert('Please select at least one employee to send emails to.');
      return;
    }

    const template = emailTemplates.find(t => t.id === selectedTemplate);
    if (!template) {
      alert('Please select an email template.');
      return;
    }

    setIsSending(true);
    setSendingProgress(0);

    // Create new campaign
    const newCampaign: EmailCampaign = {
      id: Date.now().toString(),
      name: `${surveyTitle} - ${new Date().toLocaleDateString()}`,
      templateId: selectedTemplate,
      surveyId,
      targetEmployees: [...selectedEmployees],
      sentCount: 0,
      totalCount: selectedEmployees.length,
      status: 'sending',
      createdAt: new Date().toISOString()
    };

    setEmailCampaigns(prev => [newCampaign, ...prev]);

    // Simulate sending emails with progress
    for (let i = 0; i < selectedEmployees.length; i++) {
      const employee = employees.find(emp => emp.id === selectedEmployees[i]);
      if (employee) {
        const { subject, content } = processTemplate(template, employee);
        
        // In real app, would call email service API
        console.log(`Sending email to ${employee.email}:`, { subject, content });
        
        // Simulate email sending delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setSendingProgress(((i + 1) / selectedEmployees.length) * 100);
      }
    }

    // Update campaign status
    setEmailCampaigns(prev => prev.map(campaign => 
      campaign.id === newCampaign.id 
        ? { ...campaign, status: 'completed', sentCount: selectedEmployees.length, sentAt: new Date().toISOString() }
        : campaign
    ));

    setIsSending(false);
    setSendingProgress(0);
    setSelectedEmployees([]);
    alert(`Successfully sent ${selectedEmployees.length} personalized survey invitations!`);
  };

  const handleSaveTemplate = (templateData: Omit<EmailTemplate, 'id'> | EmailTemplate) => {
    if ('id' in templateData) {
      setEmailTemplates(prev => prev.map(t => t.id === templateData.id ? templateData : t));
    } else {
      const newTemplate: EmailTemplate = {
        ...templateData,
        id: Date.now().toString()
      };
      setEmailTemplates(prev => [...prev, newTemplate]);
    }
    setShowTemplateEditor(false);
    setEditingTemplate(null);
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setShowTemplateEditor(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (template?.isDefault) {
      alert('Cannot delete default template');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this template?')) {
      setEmailTemplates(prev => prev.filter(t => t.id !== templateId));
      if (selectedTemplate === templateId) {
        setSelectedTemplate('default');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Email Campaign Manager</h2>
              <p className="text-sm text-gray-600">Send personalized survey invitations to employees</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'send', label: 'Send Campaign', icon: Send },
              { id: 'templates', label: 'Email Templates', icon: Settings },
              { id: 'campaigns', label: 'Campaign History', icon: Clock }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Send Campaign Tab */}
        {activeTab === 'send' && (
          <div className="space-y-6">
            {/* Template Selection */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Template</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {emailTemplates.map(template => (
                  <label key={template.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="template"
                      value={template.id}
                      checked={selectedTemplate === template.id}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`p-4 rounded-lg border-2 transition-all ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className={`font-medium ${
                          selectedTemplate === template.id ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {template.name}
                        </h4>
                        {template.isDefault && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${
                        selectedTemplate === template.id ? 'text-blue-700' : 'text-gray-600'
                      }`}>
                        {template.subject}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Employee Selection */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Select Employees ({selectedEmployees.length} selected)
                  </h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSelectAll}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {selectedEmployees.length === filteredEmployees.length ? 'Deselect All' : 'Select All'}
                    </button>
                    {selectedEmployees.length > 0 && (
                      <button
                        onClick={() => {
                          const firstSelected = employees.find(emp => emp.id === selectedEmployees[0]);
                          if (firstSelected) handlePreview(firstSelected);
                        }}
                        className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
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
                </div>

                {/* Department Quick Select */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {departments.map(dept => {
                    const deptEmployees = employees.filter(emp => emp.department === dept);
                    const selectedInDept = deptEmployees.filter(emp => selectedEmployees.includes(emp.id)).length;
                    return (
                      <button
                        key={dept}
                        onClick={() => handleSelectByDepartment(dept)}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                          selectedInDept === deptEmployees.length && selectedInDept > 0
                            ? 'bg-blue-100 border-blue-300 text-blue-700'
                            : selectedInDept > 0
                            ? 'bg-yellow-100 border-yellow-300 text-yellow-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {dept} ({selectedInDept}/{deptEmployees.length})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Employee List */}
              <div className="max-h-64 overflow-y-auto">
                {filteredEmployees.map(employee => (
                  <label key={employee.id} className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(employee.id)}
                      onChange={() => handleEmployeeToggle(employee.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                          <p className="text-sm text-gray-500">{employee.department} • {employee.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handlePreview(employee);
                            }}
                            className="text-blue-600 hover:text-blue-700 p-1"
                            title="Preview email"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <span className="text-xs text-gray-400">ID: {employee.id}</span>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {filteredEmployees.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>No employees found matching your criteria</p>
                </div>
              )}
            </div>

            {/* Send Actions */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900">Ready to Send</h3>
                  <p className="text-sm text-blue-700">
                    {selectedEmployees.length} employee{selectedEmployees.length !== 1 ? 's' : ''} selected • 
                    Template: {emailTemplates.find(t => t.id === selectedTemplate)?.name}
                  </p>
                </div>
                <button
                  onClick={handleSendEmails}
                  disabled={selectedEmployees.length === 0 || isSending}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Sending... ({Math.round(sendingProgress)}%)
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Invitations
                    </>
                  )}
                </button>
              </div>
              
              {isSending && (
                <div className="mt-4">
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${sendingProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Email Templates</h3>
              <button
                onClick={() => {
                  setEditingTemplate(null);
                  setShowTemplateEditor(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Template
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {emailTemplates.map(template => (
                <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{template.name}</h4>
                        {template.isDefault && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Subject: {template.subject}</p>
                      <p className="text-sm text-gray-700 line-clamp-3">{template.content}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditTemplate(template)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {!template.isDefault && (
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Campaign History</h3>
            
            <div className="space-y-4">
              {emailCampaigns.map(campaign => (
                <div key={campaign.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{campaign.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          campaign.status === 'completed' ? 'bg-green-100 text-green-800' :
                          campaign.status === 'sending' ? 'bg-blue-100 text-blue-800' :
                          campaign.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Template:</span> {emailTemplates.find(t => t.id === campaign.templateId)?.name}
                        </div>
                        <div>
                          <span className="font-medium">Sent:</span> {campaign.sentCount}/{campaign.totalCount}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span> {new Date(campaign.createdAt).toLocaleDateString()}
                        </div>
                        {campaign.sentAt && (
                          <div>
                            <span className="font-medium">Completed:</span> {new Date(campaign.sentAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {campaign.status === 'completed' && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(campaign.sentCount / campaign.totalCount) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {emailCampaigns.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Mail className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Campaigns Yet</h4>
                <p>Email campaigns you send will appear here</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Template Editor Modal */}
      {showTemplateEditor && (
        <EmailTemplateEditor
          template={editingTemplate}
          onSave={handleSaveTemplate}
          onCancel={() => {
            setShowTemplateEditor(false);
            setEditingTemplate(null);
          }}
        />
      )}

      {/* Email Preview Modal */}
      {showPreview && previewEmployee && (
        <EmailPreviewModal
          employee={previewEmployee}
          template={emailTemplates.find(t => t.id === selectedTemplate)!}
          surveyTitle={surveyTitle}
          onClose={() => {
            setShowPreview(false);
            setPreviewEmployee(null);
          }}
          onSend={() => {
            setSelectedEmployees([previewEmployee.id]);
            setShowPreview(false);
            setPreviewEmployee(null);
            handleSendEmails();
          }}
        />
      )}
    </div>
  );
};

// Email Template Editor Component
interface EmailTemplateEditorProps {
  template?: EmailTemplate | null;
  onSave: (template: Omit<EmailTemplate, 'id'> | EmailTemplate) => void;
  onCancel: () => void;
}

const EmailTemplateEditor: React.FC<EmailTemplateEditorProps> = ({ template, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    isDefault: false
  });

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        subject: template.subject,
        content: template.content,
        isDefault: template.isDefault
      });
    } else {
      setFormData({
        name: '',
        subject: '',
        content: '',
        isDefault: false
      });
    }
  }, [template]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (template) {
      onSave({
        ...template,
        ...formData
      });
    } else {
      onSave(formData);
    }
  };

  const insertVariable = (variable: string) => {
    const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = formData.content.substring(0, start) + variable + formData.content.substring(end);
      setFormData(prev => ({ ...prev, content: newContent }));
      
      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    }
  };

  const variables = [
    { name: '{{employeeName}}', description: 'Employee\'s full name' },
    { name: '{{surveyTitle}}', description: 'Survey title' },
    { name: '{{surveyLink}}', description: 'Personalized survey link' },
    { name: '{{deadline}}', description: 'Survey deadline' },
    { name: '{{department}}', description: 'Employee\'s department' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {template ? 'Edit Email Template' : 'Create Email Template'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter template name"
              />
            </div>
            <div className="flex items-center justify-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Set as Default Template</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Subject *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email subject"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                required
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="Enter email content..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Variables
              </label>
              <div className="space-y-2">
                {variables.map(variable => (
                  <button
                    key={variable.name}
                    type="button"
                    onClick={() => insertVariable(variable.name)}
                    className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="font-mono text-sm text-blue-600 mb-1">{variable.name}</div>
                    <div className="text-xs text-gray-600">{variable.description}</div>
                  </button>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>Tip:</strong> Click on variables above to insert them at your cursor position in the email content.
                </p>
              </div>
            </div>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {template ? 'Update' : 'Create'} Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Email Preview Modal Component
interface EmailPreviewModalProps {
  employee: Employee;
  template: EmailTemplate;
  surveyTitle: string;
  onClose: () => void;
  onSend: () => void;
}

const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({
  employee,
  template,
  surveyTitle,
  onClose,
  onSend
}) => {
  const surveyLink = `${window.location.origin}/survey?surveyId=1&userid=${employee.id}&name=${encodeURIComponent(employee.name)}`;
  const deadline = 'February 15, 2025';
  
  const processedSubject = template.subject
    .replace(/{{employeeName}}/g, employee.name)
    .replace(/{{surveyTitle}}/g, surveyTitle)
    .replace(/{{deadline}}/g, deadline);

  const processedContent = template.content
    .replace(/{{employeeName}}/g, employee.name)
    .replace(/{{surveyTitle}}/g, surveyTitle)
    .replace(/{{surveyLink}}/g, surveyLink)
    .replace(/{{deadline}}/g, deadline)
    .replace(/{{department}}/g, employee.department);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(surveyLink);
    alert('Survey link copied to clipboard!');
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(processedSubject);
    const body = encodeURIComponent(processedContent);
    window.open(`mailto:${employee.email}?subject=${subject}&body=${body}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Email Preview</h2>
              <p className="text-sm text-gray-600">Preview for {employee.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Email Preview */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="border-b border-gray-200 pb-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">To:</span> {employee.email}
                </div>
                <div>
                  <span className="font-medium text-gray-700">From:</span> hr@empathoz.com
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-700">Subject:</span> {processedSubject}
                </div>
              </div>
            </div>
            
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {processedContent}
            </div>
          </div>
        </div>

        {/* Survey Link */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900">Generated Survey Link</h4>
              <p className="text-sm text-blue-700 break-all">{surveyLink}</p>
            </div>
            <button
              onClick={handleCopyLink}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors order-2 sm:order-1"
          >
            Close Preview
          </button>
          <button
            onClick={handleSendEmail}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 order-1 sm:order-2"
          >
            <Mail className="w-4 h-4" />
            Open in Email Client
          </button>
          <button
            onClick={onSend}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 order-1 sm:order-3"
          >
            <Send className="w-4 h-4" />
            Send via Campaign
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailCampaignManager;