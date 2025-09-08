import React, { useState } from 'react';
import { X, BarChart3, Users, TrendingUp, Download, Filter, Eye, CheckCircle } from 'lucide-react';

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
  questions: any[];
}

interface SurveyResultsProps {
  survey: Survey;
  onClose: () => void;
}

// Mock survey results data
const mockResults = {
  overallMetrics: {
    responseRate: 87,
    averageScore: 4.2,
    completionTime: 12.5,
    participationByDepartment: {
      'Engineering': 92,
      'Marketing': 85,
      'Sales': 78,
      'HR': 95,
      'Finance': 88,
      'Design': 90,
      'Product': 83
    }
  },
  categoryScores: {
    'job-satisfaction': {
      score: 4.1,
      responses: 87,
      trend: 'up',
      change: 0.3,
      distribution: [2, 5, 12, 35, 33] // 1-star to 5-star counts
    },
    'organizational-commitment': {
      score: 4.3,
      responses: 87,
      trend: 'up',
      change: 0.2,
      distribution: [1, 3, 8, 28, 47]
    },
    'work-engagement': {
      score: 4.0,
      responses: 87,
      trend: 'stable',
      change: 0.0,
      distribution: [3, 7, 15, 32, 30]
    }
  },
  topQuestions: [
    {
      question: 'I am proud to tell others that I am part of this organization',
      score: 4.6,
      category: 'organizational-commitment'
    },
    {
      question: 'I find real enjoyment in my work',
      score: 4.5,
      category: 'job-satisfaction'
    },
    {
      question: 'My job inspires me',
      score: 4.4,
      category: 'work-engagement'
    }
  ],
  bottomQuestions: [
    {
      question: 'Each day of work seems like it will never end',
      score: 2.1,
      category: 'job-satisfaction'
    },
    {
      question: 'I am often bored with my job',
      score: 2.3,
      category: 'job-satisfaction'
    },
    {
      question: 'It would take very little change in my present circumstances to cause me to leave this organization',
      score: 2.8,
      category: 'organizational-commitment'
    }
  ],
  comments: [
    {
      id: '1',
      comment: 'Great work environment and supportive colleagues. Management could improve communication about company direction.',
      department: 'Engineering',
      sentiment: 'positive'
    },
    {
      id: '2',
      comment: 'Love the flexibility and work-life balance. Would appreciate more career development opportunities.',
      department: 'Marketing',
      sentiment: 'positive'
    },
    {
      id: '3',
      comment: 'The team is amazing but sometimes the workload feels overwhelming. More resources would help.',
      department: 'Design',
      sentiment: 'mixed'
    },
    {
      id: '4',
      comment: 'Excellent company culture and values alignment. The remote work policy is fantastic.',
      department: 'Product',
      sentiment: 'positive'
    },
    {
      id: '5',
      comment: 'Good compensation and benefits. Could use better project management tools and processes.',
      department: 'Sales',
      sentiment: 'mixed'
    }
  ]
};

const SurveyResults: React.FC<SurveyResultsProps> = ({ survey, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'categories' | 'questions' | 'comments'>('overview');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 4.0) return 'text-blue-600';
    if (score >= 3.5) return 'text-yellow-600';
    if (score >= 3.0) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 4.5) return 'bg-green-100';
    if (score >= 4.0) return 'bg-blue-100';
    if (score >= 3.5) return 'bg-yellow-100';
    if (score >= 3.0) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const handleExportResults = () => {
    const csvContent = [
      ['Category', 'Score', 'Responses', 'Trend', 'Change'].join(','),
      ...Object.entries(mockResults.categoryScores).map(([category, data]) => [
        category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        data.score.toString(),
        data.responses.toString(),
        data.trend,
        data.change.toString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `survey-results-${survey.id}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Survey Results: {survey.title}</h2>
              <p className="text-sm text-gray-600">{survey.responses} responses • {mockResults.overallMetrics.responseRate}% response rate</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportResults}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Results
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'categories', label: 'Category Analysis', icon: TrendingUp },
              { id: 'questions', label: 'Question Analysis', icon: Eye },
              { id: 'comments', label: 'Comments', icon: Users }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600">Overall Score</p>
                    <p className="text-3xl font-bold text-blue-900">{mockResults.overallMetrics.averageScore}/5</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600">Response Rate</p>
                    <p className="text-3xl font-bold text-green-900">{mockResults.overallMetrics.responseRate}%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600">Avg. Completion Time</p>
                    <p className="text-3xl font-bold text-purple-900">{mockResults.overallMetrics.completionTime}min</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600">Total Responses</p>
                    <p className="text-3xl font-bold text-orange-900">{survey.responses}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Department Participation */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Participation by Department</h3>
              <div className="space-y-4">
                {Object.entries(mockResults.overallMetrics.participationByDepartment).map(([dept, rate]) => (
                  <div key={dept} className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">{dept}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${rate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12">{rate}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {Object.entries(mockResults.categoryScores).map(([category, data]) => (
                <div key={category} className={`rounded-xl p-6 border border-gray-200 ${getScoreBgColor(data.score)}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h3>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(data.trend)}
                      <span className={`text-sm font-medium ${data.change > 0 ? 'text-green-600' : data.change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        {data.change > 0 ? '+' : ''}{data.change}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-gray-900">{data.score}/5</span>
                      <span className="text-sm text-gray-600">{data.responses} responses</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(data.score / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Score Distribution */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Score Distribution</p>
                    <div className="flex items-center gap-1">
                      {data.distribution.map((count, index) => (
                        <div key={index} className="flex-1">
                          <div className="text-xs text-center text-gray-600 mb-1">{index + 1}</div>
                          <div className="bg-gray-200 rounded h-8 flex items-end">
                            <div 
                              className="bg-blue-600 rounded w-full" 
                              style={{ height: `${(count / Math.max(...data.distribution)) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-center text-gray-600 mt-1">{count}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className="space-y-6">
            {/* Top Performing Questions */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Questions</h3>
              <div className="space-y-4">
                {mockResults.topQuestions.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.question}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Category: {item.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{item.score}/5</p>
                      <p className="text-xs text-gray-600">Excellent</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Areas for Improvement</h3>
              <div className="space-y-4">
                {mockResults.bottomQuestions.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.question}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Category: {item.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">{item.score}/5</p>
                      <p className="text-xs text-gray-600">Needs Attention</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Employee Comments</h3>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                {Object.keys(mockResults.overallMetrics.participationByDepartment).map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              {mockResults.comments
                .filter(comment => selectedDepartment === 'all' || comment.department === selectedDepartment)
                .map(comment => (
                <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        comment.sentiment === 'positive' ? 'bg-green-500' :
                        comment.sentiment === 'negative' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-600">{comment.department}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      comment.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                      comment.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {comment.sentiment.charAt(0).toUpperCase() + comment.sentiment.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyResults;