import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, BarChart3, Clock, User, Building2, AlertTriangle } from 'lucide-react';

interface SurveyQuestion {
  id: string;
  question: string;
  type: 'rating' | 'multiple-choice' | 'text' | 'yes-no';
  required: boolean;
  options?: string[];
  category?: string;
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

interface SurveyTakerProps {
  survey: Survey;
  onComplete: () => void;
  onCancel: () => void;
  userId?: string | null;
  userName?: string;
}

const SurveyTaker: React.FC<SurveyTakerProps> = ({ 
  survey, 
  onComplete, 
  onCancel, 
  userId, 
  userName 
}) => {
  const [currentSection, setCurrentSection] = useState<'intro' | 'part-a' | 'part-b' | 'complete'>('intro');
  const [currentPage, setCurrentPage] = useState(0);
  const [responses, setResponses] = useState<{ [questionId: string]: number | string }>({});
  const [partBPriorities, setPartBPriorities] = useState<string[]>([]);
  const [partBActionAreas, setPartBActionAreas] = useState<string[]>([]);
  const [startTime] = useState(new Date());
  const [sectionStartTime, setSectionStartTime] = useState(new Date());
  const [hasExistingProgress, setHasExistingProgress] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(false);

  const storageKey = `survey-progress-${survey.id}-${userId || 'anonymous'}`;

  // Load saved progress on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(storageKey);
    if (savedProgress) {
      try {
        const progressData = JSON.parse(savedProgress);
        const savedDate = new Date(progressData.savedAt);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        // Check if saved progress is within 1 week
        if (savedDate > oneWeekAgo) {
          setHasExistingProgress(true);
          setShowResumePrompt(true);
        } else {
          // Remove expired progress
          localStorage.removeItem(storageKey);
        }
      } catch (error) {
        console.error('Error loading saved progress:', error);
        localStorage.removeItem(storageKey);
      }
    } else {
      // No saved progress, start directly with Part A
      setCurrentSection('part-a');
    }
  }, [storageKey]);

  // Save progress whenever responses change
  useEffect(() => {
    if (currentSection !== 'intro' && currentSection !== 'complete' && (Object.keys(responses).length > 0 || partBPriorities.length > 0 || partBActionAreas.length > 0)) {
      const progressData = {
        currentSection,
        currentPage,
        responses,
        partBPriorities,
        partBActionAreas,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(storageKey, JSON.stringify(progressData));
    }
  }, [currentSection, currentPage, responses, partBPriorities, partBActionAreas, storageKey]);

  const loadSavedProgress = () => {
    const savedProgress = localStorage.getItem(storageKey);
    if (savedProgress) {
      try {
        const progressData = JSON.parse(savedProgress);
        setCurrentSection(progressData.currentSection);
        setCurrentPage(progressData.currentPage || 0);
        setResponses(progressData.responses || {});
        setPartBPriorities(progressData.partBPriorities || []);
        setPartBActionAreas(progressData.partBActionAreas || []);
        setShowResumePrompt(false);
      } catch (error) {
        console.error('Error loading saved progress:', error);
        setShowResumePrompt(false);
      }
    } else {
      // No saved progress, start with Part A
      setCurrentSection('part-a');
      setShowResumePrompt(false);
    }
  };

  const startFresh = () => {
    localStorage.removeItem(storageKey);
    setShowResumePrompt(false);
    setCurrentSection('part-a');
    setCurrentPage(0);
    setResponses({});
    setPartBPriorities([]);
    setPartBActionAreas([]);
  };

  const clearSavedProgress = () => {
    localStorage.removeItem(storageKey);
  };

  // Comprehensive engagement survey questions (50 questions)
  const engagementQuestions: SurveyQuestion[] = [
    // Organizational Performance (5 questions)
    { id: 'q1', question: 'My organization quickly resolves customers\' problems', type: 'rating', required: true, category: 'organizational-performance' },
    { id: 'q2', question: 'My organisation is responsive to customers\' needs', type: 'rating', required: true, category: 'organizational-performance' },
    { id: 'q3', question: 'My organisation provides high quality products and services', type: 'rating', required: true, category: 'organizational-performance' },
    { id: 'q4', question: 'My organisation has a good reputation in the community', type: 'rating', required: true, category: 'organizational-performance' },
    { id: 'q5', question: 'My organisation is financially stable', type: 'rating', required: true, category: 'organizational-performance' },

    // Leadership (4 questions)
    { id: 'q6', question: 'Senior management provides clear direction for the organisation', type: 'rating', required: true, category: 'leadership' },
    { id: 'q7', question: 'Senior management has communicated a clear vision for the organisation', type: 'rating', required: true, category: 'leadership' },
    { id: 'q8', question: 'Senior management is approachable', type: 'rating', required: true, category: 'leadership' },
    { id: 'q9', question: 'I have confidence in senior management', type: 'rating', required: true, category: 'leadership' },

    // Supervision (5 questions)
    { id: 'q10', question: 'My immediate supervisor treats me with respect', type: 'rating', required: true, category: 'supervision' },
    { id: 'q11', question: 'My immediate supervisor is available when I need guidance', type: 'rating', required: true, category: 'supervision' },
    { id: 'q12', question: 'My immediate supervisor provides me with constructive feedback', type: 'rating', required: true, category: 'supervision' },
    { id: 'q13', question: 'My immediate supervisor recognises when I do good work', type: 'rating', required: true, category: 'supervision' },
    { id: 'q14', question: 'My immediate supervisor supports my efforts to develop my skills', type: 'rating', required: true, category: 'supervision' },

    // Work Environment (6 questions)
    { id: 'q15', question: 'I have the resources I need to do my job well', type: 'rating', required: true, category: 'work-environment' },
    { id: 'q16', question: 'My organisation has efficient work processes', type: 'rating', required: true, category: 'work-environment' },
    { id: 'q17', question: 'My organisation encourages innovation', type: 'rating', required: true, category: 'work-environment' },
    { id: 'q18', question: 'My organisation supports a diverse workforce', type: 'rating', required: true, category: 'work-environment' },
    { id: 'q19', question: 'My organisation treats employees fairly regardless of their background', type: 'rating', required: true, category: 'work-environment' },
    { id: 'q20', question: 'My organisation has a positive culture', type: 'rating', required: true, category: 'work-environment' },

    // Teamwork (4 questions)
    { id: 'q21', question: 'I can rely on my colleagues to help me when I need it', type: 'rating', required: true, category: 'teamwork' },
    { id: 'q22', question: 'My colleagues and I work well together', type: 'rating', required: true, category: 'teamwork' },
    { id: 'q23', question: 'My colleagues treat me with respect', type: 'rating', required: true, category: 'teamwork' },
    { id: 'q24', question: 'I feel like I am part of a team', type: 'rating', required: true, category: 'teamwork' },

    // Work-Life Balance (5 questions)
    { id: 'q25', question: 'I am able to manage my workload', type: 'rating', required: true, category: 'work-life-balance' },
    { id: 'q26', question: 'I am satisfied with my work-life balance', type: 'rating', required: true, category: 'work-life-balance' },
    { id: 'q27', question: 'I feel stressed at work', type: 'rating', required: true, category: 'work-life-balance' },
    { id: 'q28', question: 'I worry about losing my job', type: 'rating', required: true, category: 'work-life-balance' },
    { id: 'q29', question: 'My job allows me to maintain a healthy lifestyle', type: 'rating', required: true, category: 'work-life-balance' },

    // Performance Management (1 question)
    { id: 'q30', question: 'My performance is evaluated fairly', type: 'rating', required: true, category: 'performance-management' },

    // Career Development (4 questions)
    { id: 'q31', question: 'I have opportunities to develop my skills in my current role', type: 'rating', required: true, category: 'career-development' },
    { id: 'q32', question: 'I have opportunities for promotion in my organisation', type: 'rating', required: true, category: 'career-development' },
    { id: 'q33', question: 'My organisation provides opportunities for me to develop my career', type: 'rating', required: true, category: 'career-development' },
    { id: 'q34', question: 'I am encouraged to develop my skills', type: 'rating', required: true, category: 'career-development' },

    // Empowerment (6 questions)
    { id: 'q35', question: 'I am encouraged to come up with new and better ways of doing things', type: 'rating', required: true, category: 'empowerment' },
    { id: 'q36', question: 'My suggestions are taken seriously', type: 'rating', required: true, category: 'empowerment' },
    { id: 'q37', question: 'I have a say in decisions that affect my work', type: 'rating', required: true, category: 'empowerment' },
    { id: 'q38', question: 'I am able to make decisions about how to do my job', type: 'rating', required: true, category: 'empowerment' },
    { id: 'q39', question: 'I feel that my job makes good use of my skills and abilities', type: 'rating', required: true, category: 'empowerment' },
    { id: 'q40', question: 'I understand how my role contributes to the organisation\'s objectives', type: 'rating', required: true, category: 'empowerment' },

    // Job Satisfaction (6 questions)
    { id: 'q41', question: 'I find real enjoyment in my work', type: 'rating', required: true, category: 'job-satisfaction' },
    { id: 'q42', question: 'I like the kind of work I do', type: 'rating', required: true, category: 'job-satisfaction' },
    { id: 'q43', question: 'Each day of work seems like it will never end', type: 'rating', required: true, category: 'job-satisfaction' },
    { id: 'q44', question: 'I am often bored with my job', type: 'rating', required: true, category: 'job-satisfaction' },
    { id: 'q45', question: 'My job inspires me', type: 'rating', required: true, category: 'job-satisfaction' },
    { id: 'q46', question: 'Most days I am enthusiastic about my work', type: 'rating', required: true, category: 'job-satisfaction' },

    // Organizational Commitment (4 questions)
    { id: 'q47', question: 'I am proud to tell others that I am part of this organisation', type: 'rating', required: true, category: 'organizational-commitment' },
    { id: 'q48', question: 'I would recommend this organisation as a great place to work', type: 'rating', required: true, category: 'organizational-commitment' },
    { id: 'q49', question: 'It would take very little change in my present circumstances to cause me to leave this organisation', type: 'rating', required: true, category: 'organizational-commitment' },
    { id: 'q50', question: 'I intend to continue working for this organisation for the next 12 months', type: 'rating', required: true, category: 'organizational-commitment' }
  ];

  // Part B1 Priority Areas
  const priorityAreas = [
    'Organisational Performance',
    'Leadership',
    'Supervision',
    'Work Environment',
    'Teamwork',
    'Work-Life Balance',
    'Performance Management',
    'Career Development',
    'Empowerment',
    'Job Satisfaction',
    'Organisational Commitment'
  ];

  // Part B2 Action Areas
  const actionAreas = [
    'Improve communication between management and employees',
    'Provide more opportunities for career development',
    'Enhance work-life balance initiatives',
    'Strengthen team collaboration and support',
    'Improve recognition and reward systems',
    'Enhance workplace facilities and resources',
    'Provide better training and development programs',
    'Improve performance management processes',
    'Strengthen organizational culture and values',
    'Enhance employee wellness programs',
    'Improve diversity and inclusion initiatives',
    'Better change management and communication',
    'Enhance leadership development programs',
    'Improve compensation and benefits',
    'Strengthen customer service focus',
    'Enhance innovation and creativity support'
  ];

  const questions = survey.category === 'engagement' ? engagementQuestions : survey.questions;

  const questionsPerPage = 3;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const currentPageQuestions = questions.slice(currentPage * questionsPerPage, (currentPage + 1) * questionsPerPage);

  useEffect(() => {
    setSectionStartTime(new Date());
  }, [currentSection]);

  const handleResponse = (questionId: string, value: number | string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentSection === 'part-a') {
      if (currentPage < totalPages - 1) {
        setCurrentPage(prev => prev + 1);
      } else {
        setCurrentSection('part-b');
      }
    } else if (currentSection === 'part-b') {
      setCurrentSection('complete');
    }
  };

  const handlePrevious = () => {
    if (currentSection === 'part-a') {
      if (currentPage > 0) {
        setCurrentPage(prev => prev - 1);
      }
    } else if (currentSection === 'part-b') {
      setCurrentPage(totalPages - 1);
      setCurrentSection('part-a');
    } else if (currentSection === 'complete') {
      setCurrentSection('part-b');
    }
  };

  const handleComplete = () => {
    // Calculate completion time
    const completionTime = Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60);
    
    // Clear saved progress on completion
    clearSavedProgress();
    
    // In a real app, would submit responses to backend
    const surveyResponse = {
      surveyId: survey.id,
      userId: userId || 'anonymous',
      userName: userName || 'Anonymous User',
      responses,
      partBPriorities,
      partBActionAreas,
      completedAt: new Date().toISOString(),
      completionTimeMinutes: completionTime
    };
    
    console.log('Survey completed:', surveyResponse);
    onComplete();
  };

  const handlePriorityToggle = (priority: string) => {
    setPartBPriorities(prev => {
      if (prev.includes(priority)) {
        return prev.filter(p => p !== priority);
      } else if (prev.length < 3) {
        return [...prev, priority];
      }
      return prev;
    });
  };

  const handleActionAreaToggle = (area: string) => {
    setPartBActionAreas(prev => {
      if (prev.includes(area)) {
        return prev.filter(a => a !== area);
      } else if (prev.length < 4) {
        return [...prev, area];
      }
      return prev;
    });
  };

  const getProgress = () => {
    if (currentSection === 'part-a') {
      return Math.round(((currentPage + 1) / totalPages) * 70); // Part A is 70% of survey
    }
    if (currentSection === 'part-b') return 85;
    return 100;
  };

  const canProceed = () => {
    if (currentSection === 'part-a') {
      return currentPageQuestions.every(q => responses[q.id] !== undefined);
    }
    if (currentSection === 'part-b') {
      return partBPriorities.length >= 1 && partBActionAreas.length >= 1; // At least 1 of each selected
    }
    return true;
  };

  const renderRatingScale = (questionId: string, currentValue?: number) => {
    // Enhanced rating scale with gradient hover effects and improved visual feedback
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between text-sm font-medium text-gray-700 px-4">
          <span>Strongly Disagree</span>
          <span>Neither Disagree or Agree</span>
          <span>Strongly Agree</span>
        </div>
        <div className="flex items-center justify-center gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(value => {
            const isSelected = currentValue === value;
            const isExtreme = value === 1 || value === 9;
            
            // Dynamic gradient classes based on value position
            const getHoverGradient = (val: number) => {
              if (val <= 3) return 'hover:bg-gradient-to-br hover:from-red-500 hover:to-orange-500';
              if (val <= 6) return 'hover:bg-gradient-to-br hover:from-yellow-500 hover:to-orange-500';
              return 'hover:bg-gradient-to-br hover:from-green-500 hover:to-blue-500';
            };
            
            // Selected state colors based on value
            const getSelectedColor = (val: number) => {
              if (val <= 3) return 'bg-gradient-to-br from-red-600 to-red-500 border-red-600';
              if (val <= 6) return 'bg-gradient-to-br from-yellow-600 to-orange-500 border-yellow-600';
              return 'bg-gradient-to-br from-green-600 to-blue-500 border-green-600';
            };
            
            return (
              <button
                key={value}
                onClick={() => handleResponse(questionId, value)}
                className={`${
                  isExtreme ? 'w-16 h-16 text-xl' : 'w-14 h-14 text-lg'
                } rounded-xl border-2 font-bold transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-xl ${
                  isSelected
                    ? `${getSelectedColor(value)} text-white shadow-xl scale-110 ring-4 ring-opacity-30 ${
                        value <= 3 ? 'ring-red-300' : value <= 6 ? 'ring-yellow-300' : 'ring-green-300'
                      }`
                    : `bg-white border-gray-300 text-gray-700 hover:border-transparent hover:text-white ${getHoverGradient(value)}`
                } ${isExtreme ? 'ring-2 ring-gray-200' : ''}`}
              >
                {value}
              </button>
            );
          })}
        </div>
        
        {/* Enhanced Gradient Progress Line */}
        <div className="relative px-4">
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                currentValue 
                  ? currentValue <= 3 
                    ? 'bg-gradient-to-r from-red-500 via-red-400 to-orange-400 shadow-lg'
                    : currentValue <= 6
                    ? 'bg-gradient-to-r from-yellow-500 via-yellow-400 to-orange-400 shadow-lg'
                    : 'bg-gradient-to-r from-green-500 via-green-400 to-blue-400 shadow-lg'
                  : 'bg-gray-300'
              }`}
              style={{ 
                width: currentValue ? `${(currentValue / 9) * 100}%` : '0%' 
              }}
            >
              {currentValue && (
                <div className="h-full w-full bg-gradient-to-r from-white/20 to-transparent"></div>
              )}
            </div>
          </div>
          
          {/* Value markers with enhanced styling */}
          <div className="flex justify-between mt-3 px-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(value => (
              <div key={value} className={`${
                value === 1 || value === 9 ? 'w-16' : 'w-14'
              } text-center`}>
                <span className={`text-xs font-bold transition-all duration-300 ${
                  currentValue === value 
                    ? value <= 3 
                      ? 'text-red-600 scale-110' 
                      : value <= 6 
                      ? 'text-yellow-600 scale-110' 
                      : 'text-green-600 scale-110'
                    : 'text-gray-400'
                }`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Enhanced Selected Value Display */}
        {currentValue && (
          <div className="text-center">
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-semibold shadow-lg transform transition-all duration-300 ${
              currentValue <= 3 
                ? 'bg-gradient-to-r from-red-100 to-orange-100 text-red-800 border-2 border-red-200'
                : currentValue <= 6
                ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-2 border-yellow-200'
                : 'bg-gradient-to-r from-green-100 to-blue-100 text-green-800 border-2 border-green-200'
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                currentValue <= 3 ? 'bg-red-600' : currentValue <= 6 ? 'bg-yellow-600' : 'bg-green-600'
              }`}>
                {currentValue}
              </div>
              <span>
                {currentValue === 1 ? 'Strongly Disagree' :
                 currentValue === 2 ? 'Disagree' :
                 currentValue === 3 ? 'Somewhat Disagree' :
                 currentValue === 4 ? 'Slightly Disagree' :
                 currentValue === 5 ? 'Neither Disagree or Agree' :
                 currentValue === 6 ? 'Slightly Agree' :
                 currentValue === 7 ? 'Somewhat Agree' :
                 currentValue === 8 ? 'Agree' :
                 'Strongly Agree'}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // BACKUP: Original rating scale implementation (commented out for easy reversion)
  const renderRatingScale_original = (questionId: string, currentValue?: number) => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between text-sm font-medium text-gray-700 px-4">
          <span>Strongly Disagree</span>
          <span>Neither Disagree or Agree</span>
          <span>Strongly Agree</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(value => (
            <button
              key={value}
              onClick={() => handleResponse(questionId, value)}
              className={`${
                value === 1 || value === 9 ? 'w-16 h-16 text-xl' : 'w-12 h-12 text-lg'
              } rounded-lg border-2 font-bold transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md ${
                currentValue === value
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        
        {/* Gradient Line */}
        <div className="relative">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                currentValue 
                  ? currentValue <= 3 
                    ? 'bg-gradient-to-r from-red-500 to-red-400'
                    : currentValue <= 6
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-400'
                    : 'bg-gradient-to-r from-green-500 to-green-400'
                  : 'bg-gray-300'
              }`}
              style={{ 
                width: currentValue ? `${(currentValue / 9) * 100}%` : '0%' 
              }}
            ></div>
          </div>
          {/* Value markers */}
          <div className="flex justify-between mt-2 px-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(value => (
              <div key={value} className={`${
                value === 1 || value === 9 ? 'w-16' : 'w-12'
              } text-center`}>
                <span className={`text-xs font-medium ${
                  currentValue === value ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {currentValue && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <span>Selected: {currentValue}</span>
              <span>•</span>
              <span>
                {currentValue === 1 ? 'Strongly Disagree' :
                 currentValue === 2 ? 'Disagree' :
                 currentValue === 3 ? 'Somewhat Disagree' :
                 currentValue === 4 ? 'Slightly Disagree' :
                 currentValue === 5 ? 'Neither Disagree or Agree' :
                 currentValue === 6 ? 'Slightly Agree' :
                 currentValue === 7 ? 'Somewhat Agree' :
                 currentValue === 8 ? 'Agree' :
                 'Strongly Agree'}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Show resume prompt if there's existing progress
  if (showResumePrompt && hasExistingProgress) {
    const savedProgress = localStorage.getItem(storageKey);
    let progressSummary = '';
    let actualProgress = 0;
    
    if (savedProgress) {
      try {
        const progressData = JSON.parse(savedProgress);
        const answeredQuestions = Object.keys(progressData.responses || {}).length;
        const selectedPriorities = (progressData.partBPriorities || []).length;
        const selectedActions = (progressData.partBActionAreas || []).length;
        
        progressSummary = `${answeredQuestions} questions answered, ${selectedPriorities} priorities selected, ${selectedActions} action areas selected`;
        
        // Calculate actual progress based on saved state
        if (progressData.currentSection === 'part-a') {
          // Part A progress: based on answered questions (70% of total survey)
          actualProgress = Math.round((answeredQuestions / questions.length) * 70);
        } else if (progressData.currentSection === 'part-b') {
          // Part B progress: Part A complete (70%) + Part B progress (15%)
          const partBProgress = Math.min((selectedPriorities + selectedActions) / 7, 1) * 15; // 3 priorities + 4 actions = 7 total
          actualProgress = 70 + Math.round(partBProgress);
        } else if (progressData.currentSection === 'complete') {
          actualProgress = 100;
        }
      } catch (error) {
        progressSummary = 'Previous progress found';
        actualProgress = 0;
      }
    }

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

        {/* Resume Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-10 h-10 text-yellow-600" />
              </div>
              {userName && (
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {userName}!</h1>
              )}
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Resume Your Survey</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We found your previous progress on this survey. You can continue where you left off or start fresh.
              </p>
            </div>

            {/* Progress Summary */}
            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Your Progress</h3>
              <p className="text-blue-800 mb-4">{progressSummary}</p>
              <div className="w-full bg-blue-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${actualProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-blue-700 mt-2">{actualProgress}% completed</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={loadSavedProgress}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-3 justify-center text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Clock className="w-6 h-6" />
                Continue Survey
              </button>
              <button
                onClick={startFresh}
                className="bg-gray-600 text-white px-8 py-4 rounded-xl hover:bg-gray-700 transition-all duration-200 flex items-center gap-3 justify-center text-lg font-semibold"
              >
                <ArrowRight className="w-6 h-6" />
                Start Fresh
              </button>
            </div>

            <p className="text-sm text-gray-500 text-center mt-4">
              Your progress is automatically saved and will be kept for 1 week
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentSection === 'complete') {
    const completionTime = Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Empathoz</h1>
                <p className="text-sm text-gray-600">Survey Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Completion Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              
              {userName && (
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank you, {userName}!</h1>
              )}
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Survey Completed Successfully</h2>
              
              <div className="bg-green-50 p-6 rounded-lg mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-900">{questions.length}</div>
                    <div className="text-sm text-green-700">Questions Answered</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-900">{partBPriorities.length}</div>
                    <div className="text-sm text-green-700">Priorities Ranked</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-900">{completionTime}</div>
                    <div className="text-sm text-green-700">Minutes Taken</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-gray-600">
                <p className="text-lg">Your responses have been recorded and will contribute to improving our workplace.</p>
                <p>All responses are anonymous and will only be reported in aggregate form.</p>
                <p>Results will be shared with the organization once the survey period ends.</p>
              </div>

              <button
                onClick={handleComplete}
                className="mt-8 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <CheckCircle className="w-5 h-5" />
                Finish
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progress = getProgress();

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
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>
                {currentSection === 'part-a' && `Page ${currentPage + 1} of ${totalPages} (Questions ${currentPage * questionsPerPage + 1}-${Math.min((currentPage + 1) * questionsPerPage, questions.length)})`}
                {currentSection === 'part-b' && 'Part B: Priorities & Action Areas'}
              </span>
              <span>{progress}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Cancel Button */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={onCancel}
              className="text-gray-600 hover:text-gray-800 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Surveys
            </button>
            <div className="text-xs text-gray-500 mt-1 text-right">
              Progress automatically saved
            </div>
          </div>

          {/* Part A: Core Questions */}
          {currentSection === 'part-a' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Part A: Core Questions</span>
                </div>
                {userName && (
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {userName}!</h1>
                )}
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Page {currentPage + 1} of {totalPages}
                </h2>
                <p className="text-gray-600">Please rate your agreement with each statement (1 = Strongly Disagree, 9 = Strongly Agree)</p>
              </div>

              <div className="space-y-8">
                {currentPageQuestions.map((question, index) => (
                  <div key={question.id} className="bg-gray-50 p-6 rounded-lg">
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {currentPage * questionsPerPage + index + 1}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900">{question.question}</h3>
                      </div>
                      {question.category && (
                        <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full ml-11">
                          {question.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      )}
                    </div>
                    {renderRatingScale(question.id, responses[question.id] as number)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Part B: Combined Priorities and Action Areas */}
          {currentSection === 'part-b' && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full mb-4">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Part B: Priorities & Action Areas</span>
                </div>
              </div>

              {/* Priority Ranking Section */}
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Priority Ranking
                </h3>
                <p className="text-gray-600 mb-6">What are the most important areas for your organization to focus on? Select and rank up to 3 priorities (1 = highest priority)</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {priorityAreas.map((area, index) => {
                    const priorityIndex = partBPriorities.indexOf(area);
                    const isSelected = priorityIndex !== -1;
                    
                    return (
                      <button
                        key={area}
                        onClick={() => handlePriorityToggle(area)}
                        disabled={!isSelected && partBPriorities.length >= 3}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          isSelected
                            ? 'border-purple-500 bg-purple-100'
                            : partBPriorities.length >= 3
                            ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                            : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-medium ${isSelected ? 'text-purple-900' : 'text-gray-900'}`}>
                            {area}
                          </span>
                          {isSelected && (
                            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {priorityIndex + 1}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="text-center text-sm text-gray-600 mt-4">
                  Selected: {partBPriorities.length}/3 priorities
                </div>
              </div>

              {/* Action Areas Section */}
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Action Areas
                </h3>
                <p className="text-gray-600 mb-6">Which areas should the organization take action on? Select up to 4 areas where you believe action is most needed</p>
                
                <div className="grid grid-cols-1 gap-3">
                  {actionAreas.map((area, index) => {
                    const isSelected = partBActionAreas.includes(area);
                    
                    return (
                      <button
                        key={area}
                        onClick={() => handleActionAreaToggle(area)}
                        disabled={!isSelected && partBActionAreas.length >= 4}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          isSelected
                            ? 'border-green-500 bg-green-100'
                            : partBActionAreas.length >= 4
                            ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                            : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`${isSelected ? 'text-green-900' : 'text-gray-900'}`}>
                            {area}
                          </span>
                          {isSelected && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="text-center text-sm text-gray-600 mt-4">
                  Selected: {partBActionAreas.length}/4 action areas
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentSection === 'part-a' && currentPage === 0}
              className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="text-center">
              <div className="text-sm text-gray-600">
                {currentSection === 'part-a' && `Page ${currentPage + 1} of ${totalPages}`}
                {currentSection === 'part-b' && `${partBPriorities.length}/3 priorities, ${partBActionAreas.length}/4 action areas`}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Progress automatically saved
              </div>
            </div>

            {currentSection === 'part-b' ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Complete Survey
                <CheckCircle className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Required field warning */}
          {currentSection === 'part-a' && !canProceed() && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">Please provide a rating to continue</span>
              </div>
            </div>
          )}

          {/* Part B requirements warning */}
          {currentSection === 'part-b' && !canProceed() && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">
                  Please select at least 1 priority and 1 action area to continue
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyTaker;