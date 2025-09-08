import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BarChart3, AlertCircle, CheckCircle, Building2 } from 'lucide-react';
import SurveyTaker from '../modules/ees/components/SurveyTaker';

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

const PublicSurveyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const surveyId = searchParams.get('surveyId') || '1';
  const userId = searchParams.get('userid');
  const userName = searchParams.get('name');
  const token = searchParams.get('token');

  // Mock survey data - in real app, this would be fetched from API
  const mockSurvey: Survey = {
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
    questions: []
  };

  useEffect(() => {
    const loadSurvey = async () => {
      setLoading(true);
      try {
        // Simulate API call to validate survey access
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Validate survey exists and is active
        if (surveyId !== '1') {
          setError('Survey not found or no longer available.');
          return;
        }

        // Check if survey is still active
        const now = new Date();
        const endDate = new Date(mockSurvey.endDate);
        if (now > endDate && mockSurvey.status !== 'active') {
          setError('This survey has ended and is no longer accepting responses.');
          return;
        }

        // Check if user has already completed the survey (if not anonymous)
        if (!mockSurvey.isAnonymous && userId) {
          const hasCompleted = localStorage.getItem(`survey-completed-${surveyId}-${userId}`);
          if (hasCompleted) {
            setIsCompleted(true);
          }
        }

        setSurvey(mockSurvey);
      } catch (err) {
        setError('Failed to load survey. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadSurvey();
  }, [surveyId, userId, token]);

  const handleSurveyComplete = () => {
    // Mark survey as completed for this user
    if (userId) {
      localStorage.setItem(`survey-completed-${surveyId}-${userId}`, 'true');
    }
    setIsCompleted(true);
    setHasStarted(false);
  };

  const handleStartSurvey = () => {
    setHasStarted(true);
  };

  const handleCancelSurvey = () => {
    setHasStarted(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Survey</h2>
            <p className="text-gray-600">Please wait while we prepare your survey...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Survey Unavailable</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Survey Completed</h2>
            <p className="text-gray-600 mb-4">
              Thank you for your participation! You have already completed this survey.
            </p>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800">
                Your responses have been recorded and will contribute to improving our workplace.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (hasStarted && survey) {
    return (
      <SurveyTaker
        survey={survey}
        onComplete={handleSurveyComplete}
        onCancel={handleCancelSurvey}
        userId={userId}
        userName={userName}
      />
    );
  }

  if (!survey) {
    return null;
  }

  // Survey landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Empathoz</h1>
              <p className="text-sm text-gray-600">Employee Engagement Survey</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{survey.title}</h1>
            <p className="text-lg text-gray-600 leading-relaxed">{survey.description}</p>
          </div>

          {/* Survey Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Survey Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">Duration:</span>
                  <span className="font-medium text-blue-900">15-20 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">Questions:</span>
                  <span className="font-medium text-blue-900">50 + Part B sections</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">Anonymous:</span>
                  <span className="font-medium text-blue-900">{survey.isAnonymous ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">Deadline:</span>
                  <span className="font-medium text-blue-900">{new Date(survey.endDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Survey Structure</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">A</div>
                  <span className="text-green-700">50 engagement questions (1-9 rating scale)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">B1</div>
                  <span className="text-green-700">Ranking key priorities (select & rank up to 3)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">B2</div>
                  <span className="text-green-700">Areas for action (select up to 4)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          {survey.isAnonymous && (
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🔒</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Privacy & Confidentiality</h3>
              </div>
              <div className="text-sm text-gray-700 space-y-2">
                <p>• Your responses are completely anonymous and confidential</p>
                <p>• Individual responses cannot be traced back to specific employees</p>
                <p>• Results will only be reported in aggregate form</p>
                <p>• Your participation is voluntary and appreciated</p>
              </div>
            </div>
          )}

          {/* User Information */}
          {(userId || userName) && (
            <div className="bg-blue-50 p-4 rounded-lg mb-8">
              <div className="flex items-center gap-2 text-blue-800">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {userName ? `Welcome, ${decodeURIComponent(userName)}!` : `Survey link validated for User ID: ${userId}`}
                </span>
              </div>
            </div>
          )}

          {/* Start Survey Button */}
          <div className="text-center">
            <button
              onClick={handleStartSurvey}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-3 mx-auto text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <BarChart3 className="w-6 h-6" />
              Start Survey
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Your progress will be automatically saved as you complete the survey
            </p>
          </div>

          {/* Survey Progress */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Current participation: {survey.responses} of {survey.totalEmployees} employees</span>
              <span>{Math.round((survey.responses / survey.totalEmployees) * 100)}% response rate</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${(survey.responses / survey.totalEmployees) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicSurveyPage;