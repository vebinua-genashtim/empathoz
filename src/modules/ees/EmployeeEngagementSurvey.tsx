import React, { useState } from 'react';
import { BarChart3, Users, TrendingUp, AlertCircle, Plus, Eye, Play, CheckCircle, Clock, Search, X, Mail } from 'lucide-react';
import SurveyForm from './components/SurveyForm';
import SurveyTaker from './components/SurveyTaker';
import SurveyResults from './components/SurveyResults';
import EmailCampaignManager from './components/EmailCampaignManager';

interface SurveyResponse {
  id: string;
  surveyId: string;
  employeeId: string;
  employeeName: string;
  responses: { [questionId: string]: number | string };
  completedAt: string;
  overallScore: number;
  categoryScores: { [category: string]: number };
}

interface Survey {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'completed';
  responses: number;
  totalEmployees: number;
  startDate: string;
  endDate: string;
  avgScore: number;
  category: 'engagement' | 'satisfaction' | 'culture' | 'wellness' | 'feedback' | 'custom';
  isAnonymous: boolean;
  targetDepartments: string[];
  questions: SurveyQuestion[];
}

interface SurveyQuestion {
  id: string;
  question: string;
  type: 'rating' | 'multiple-choice' | 'text' | 'yes-no';
  required: boolean;
  options?: string[];
}

interface EngagementMetric {
  category: string;
  score: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

const EmployeeEngagementSurvey: React.FC = () => {
  const [surveys] = useState<Survey[]>([
    {
      id: '1',
      title: 'Q1 2025 Employee Engagement Survey',
      description: 'Comprehensive quarterly assessment of employee engagement across all key organizational areas. This survey includes 50 validated questions plus priority ranking and action area identification.',
      status: 'active',
      responses: 23,
      totalEmployees: 120,
      startDate: '2025-01-15',
      endDate: '2025-02-15',
      avgScore: 0,
      category: 'engagement',
      isAnonymous: true,
      targetDepartments: [],
      questions: [
        {
          id: '1',
          question: 'My organization quickly resolves customers\' problems',
          type: 'rating',
          required: true,
          category: 'organizational-performance'
        },
        {
          id: '2',
          question: 'My organisation is responsive to customers\' needs',
          type: 'rating',
          required: true,
          category: 'organizational-performance'
        }
      ]
    }
  ]);

  const [metrics] = useState<EngagementMetric[]>([
    { category: 'Job Satisfaction', score: 4.2, change: 0.3, trend: 'up' },
    { category: 'Work-Life Balance', score: 3.9, change: -0.1, trend: 'down' },
    { category: 'Career Development', score: 3.7, change: 0.2, trend: 'up' },
    { category: 'Management Support', score: 4.1, change: 0.0, trend: 'stable' },
    { category: 'Team Collaboration', score: 4.3, change: 0.4, trend: 'up' },
    { category: 'Company Culture', score: 4.0, change: 0.1, trend: 'up' }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<Survey | undefined>();
  const [activeSurvey, setActiveSurvey] = useState<Survey | undefined>();
  const [showResults, setShowResults] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showEmailCampaign, setShowEmailCampaign] = useState(false);

  // Mock employee data - in real app, this would come from the employee database
  const employees = [
    { id: 'EMP001', name: 'John Doe', department: 'Engineering', email: 'john.doe@empathoz.com' },
    { id: 'EMP002', name: 'Jane Smith', department: 'Marketing', email: 'jane.smith@empathoz.com' },
    { id: 'EMP003', name: 'Mike Johnson', department: 'Sales', email: 'mike.johnson@empathoz.com' },
    { id: 'EMP004', name: 'Sarah Wilson', department: 'HR', email: 'sarah.wilson@empathoz.com' },
    { id: 'EMP005', name: 'Emily Rodriguez', department: 'Finance', email: 'emily.rodriguez@empathoz.com' },
    { id: 'EMP006', name: 'David Kim', department: 'Design', email: 'david.kim@empathoz.com' },
    { id: 'EMP007', name: 'Lisa Chen', department: 'Product', email: 'lisa.chen@empathoz.com' },
    { id: 'EMP008', name: 'Robert Brown', department: 'Operations', email: 'robert.brown@empathoz.com' },
    { id: 'EMP009', name: 'Jennifer Davis', department: 'Customer Support', email: 'jennifer.davis@empathoz.com' },
    { id: 'EMP010', name: 'Michael Chen', department: 'Engineering', email: 'michael.chen@empathoz.com' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const getResponseRate = (survey: Survey) => {
    return Math.round((survey.responses / survey.totalEmployees) * 100);
  };

  const handleSaveSurvey = (surveyData: Omit<Survey, 'id' | 'responses' | 'avgScore'> | Survey) => {
    // In a real app, this would save to the backend
    console.log('Saving survey:', surveyData);
    setShowForm(false);
    setEditingSurvey(undefined);
  };

  const handleEditSurvey = (survey: Survey) => {
    setEditingSurvey(survey);
    setShowForm(true);
  };

  const handleTakeSurvey = (survey: Survey) => {
    // Auto-assign to current logged in user and use public survey flow
    const currentUser = { id: 'EMP001', name: 'John Doe' }; // In real app, would come from auth context
    const surveyUrl = `${window.location.origin}/survey?surveyId=${survey.id}&userid=${currentUser.id}&name=${encodeURIComponent(currentUser.name)}`;
    window.open(surveyUrl, '_blank');
  };

  const handleViewResults = (survey: Survey) => {
    setActiveSurvey(survey);
    setShowResults(true);
  };

  const handleSurveyComplete = () => {
    setActiveSurvey(undefined);
    // In real app, would refresh survey data to show updated response count
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employee Engagement Survey</h1>
            <p className="text-gray-600 mt-1">Monitor employee satisfaction and engagement metrics</p>
          </div>
          <button 
            onClick={() => {
              setEditingSurvey(undefined);
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Survey
          </button>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Surveys</p>
                <p className="text-2xl font-bold text-gray-900">{surveys.filter(s => s.status === 'active').length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Responses</p>
                <p className="text-2xl font-bold text-gray-900">{surveys.reduce((sum, survey) => sum + survey.responses, 0)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Engagement</p>
                <p className="text-2xl font-bold text-gray-900">4.1/5</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-gray-900">73%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Engagement Metrics */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Engagement Metrics</h2>
            <div className="space-y-4">
              {metrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900">{metric.category}</span>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(metric.trend)}
                      <span className="text-sm font-bold text-gray-900">{metric.score}/5</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 max-w-32">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(metric.score / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Feedback */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Feedback</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">"Great work-life balance and supportive team environment."</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Anonymous • Engineering</span>
                  <span>2 days ago</span>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">"Love the new remote work policies and flexible hours."</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Anonymous • Marketing</span>
                  <span>3 days ago</span>
                </div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">"Would appreciate more career development opportunities."</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Anonymous • Sales</span>
                  <span>5 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Surveys List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Surveys</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const generalLink = `${window.location.origin}/survey?surveyId=1`;
                    navigator.clipboard.writeText(generalLink);
                    alert('General survey link copied to clipboard!');
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Copy Public Link
                </button>
                <button
                  onClick={() => {
                    setShowEmployeeModal(true);
                  }}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Generate Employee Link
                </button>
                <button
                  onClick={() => setShowEmailCampaign(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email Campaign
                </button>
                <button
                  onClick={() => {
                    handleTakeSurvey(surveys[0]);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Take Survey
                </button>
                <button
                  onClick={() => {
                    handleViewResults(surveys[0]);
                  }}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Results
                </button>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {surveys.map(survey => (
              <div key={survey.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{survey.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(survey.status)}`}>
                        {survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{survey.description}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span>Responses: {survey.responses}/{survey.totalEmployees} ({getResponseRate(survey)}%)</span>
                      <span>Period: {new Date(survey.startDate).toLocaleDateString()} - {new Date(survey.endDate).toLocaleDateString()}</span>
                      {survey.avgScore > 0 && <span>Avg Score: {survey.avgScore}/5</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {survey.status === 'active' && (
                      <button 
                        onClick={() => handleTakeSurvey(survey)}
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                        title="Take Survey"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                    {(survey.status === 'completed' || survey.responses > 0) && (
                      <button 
                        onClick={() => handleViewResults(survey)}
                        className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                        title="View Results"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleEditSurvey(survey)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Survey"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {survey.status === 'active' && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${getResponseRate(survey)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Survey Form Modal */}
      <SurveyForm
        survey={editingSurvey}
        onSave={handleSaveSurvey}
        onCancel={() => {
          setShowForm(false);
          setEditingSurvey(undefined);
        }}
        isOpen={showForm}
      />

      {/* Survey Taker Modal */}
      {activeSurvey && !showResults && (
        <SurveyTaker
          survey={activeSurvey}
          onComplete={handleSurveyComplete}
          onCancel={() => setActiveSurvey(undefined)}
          userId="EMP001"
          userName="John Doe"
        />
      )}

      {/* Survey Results Modal */}
      {activeSurvey && showResults && (
        <SurveyResults
          survey={activeSurvey}
          onClose={() => {
            setActiveSurvey(undefined);
            setShowResults(false);
          }}
        />
      )}

      {/* Employee Selection Modal */}
      <EmployeeSelectionModal
        isOpen={showEmployeeModal}
        onClose={() => setShowEmployeeModal(false)}
        employees={employees}
        surveyId="1"
      />

      {/* Email Campaign Manager */}
      <EmailCampaignManager
        isOpen={showEmailCampaign}
        onClose={() => setShowEmailCampaign(false)}
        surveyId="1"
        surveyTitle={surveys[0]?.title || 'Employee Survey'}
        employees={employees}
      />
    </div>
  );
};

// Employee Selection Modal Component
interface EmployeeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Array<{ id: string; name: string; department: string; email: string }>;
  surveyId: string;
}

const EmployeeSelectionModal: React.FC<EmployeeSelectionModalProps> = ({
  isOpen,
  onClose,
  employees,
  surveyId
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const [showLink, setShowLink] = useState(false);

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateLink = () => {
    if (!selectedEmployee) return;
    
    const employee = employees.find(emp => emp.id === selectedEmployee);
    if (!employee) return;

    const link = `${window.location.origin}/survey?surveyId=${surveyId}&userid=${employee.id}&name=${encodeURIComponent(employee.name)}`;
    setGeneratedLink(link);
    setShowLink(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    alert('Personalized survey link copied to clipboard!');
  };

  const handleSendEmail = () => {
    const employee = employees.find(emp => emp.id === selectedEmployee);
    if (!employee) return;

    const subject = encodeURIComponent('Q1 2025 Employee Engagement Survey');
    const body = encodeURIComponent(`Hi ${employee.name},

You're invited to participate in our Q1 2025 Employee Engagement Survey. Your feedback is valuable and will help us improve our workplace.

Survey Link: ${generatedLink}

The survey takes approximately 15-20 minutes to complete and is completely anonymous.

Thank you for your participation!

Best regards,
HR Team`);

    window.open(`mailto:${employee.email}?subject=${subject}&body=${body}`);
  };

  const handleReset = () => {
    setSelectedEmployee('');
    setSearchTerm('');
    setGeneratedLink('');
    setShowLink(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Generate Employee Survey Link</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {!showLink ? (
          <div className="space-y-6">
            <div>
              <p className="text-gray-600 mb-4">
                Select an employee to generate a personalized survey link. The employee's name will appear in the survey for a better experience.
              </p>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Employees
              </label>
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, department, or email..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Employee Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Employee ({filteredEmployees.length} found)
              </label>
              <div className="border border-gray-300 rounded-lg max-h-64 overflow-y-auto">
                {filteredEmployees.map(employee => (
                  <label key={employee.id} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
                    <input
                      type="radio"
                      name="selectedEmployee"
                      value={employee.id}
                      checked={selectedEmployee === employee.id}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                          <p className="text-sm text-gray-500">{employee.department} • {employee.email}</p>
                        </div>
                        <span className="text-xs text-gray-400">ID: {employee.id}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {filteredEmployees.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>No employees found matching your search</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateLink}
                disabled={!selectedEmployee}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Generate Link
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Selected Employee Info */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {employees.find(emp => emp.id === selectedEmployee)?.name.split(' ').map(n => n.charAt(0)).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-orange-900">
                    {employees.find(emp => emp.id === selectedEmployee)?.name}
                  </h3>
                  <p className="text-sm text-orange-700">
                    {employees.find(emp => emp.id === selectedEmployee)?.department} • {employees.find(emp => emp.id === selectedEmployee)?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Generated Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personalized Survey Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={generatedLink}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm"
                />
                <button
                  onClick={handleCopyLink}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Copy
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Survey Preview</h4>
              <p className="text-sm text-blue-800">
                When {employees.find(emp => emp.id === selectedEmployee)?.name} opens this link, they will see:
                "Welcome, {employees.find(emp => emp.id === selectedEmployee)?.name}! Thank you for participating in our Q1 2025 Employee Engagement Survey."
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors order-2 sm:order-1"
              >
                Select Different Employee
              </button>
              <button
                onClick={handleSendEmail}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 order-1 sm:order-2"
              >
                <Mail className="w-4 h-4" />
                Send Email Invitation
              </button>
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 order-1 sm:order-3"
              >
                <Eye className="w-4 h-4" />
                Copy Link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeEngagementSurvey;