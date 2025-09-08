import React, { useState, useEffect } from 'react';
import { X, Save, BarChart3, Plus, Trash2 } from 'lucide-react';

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

interface SurveyFormProps {
  survey?: Survey;
  onSave: (survey: Omit<Survey, 'id' | 'responses' | 'avgScore'> | Survey) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const SurveyForm: React.FC<SurveyFormProps> = ({
  survey,
  onSave,
  onCancel,
  isOpen
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'draft' as const,
    totalEmployees: 120,
    startDate: '',
    endDate: '',
    category: 'engagement' as const,
    isAnonymous: true,
    targetDepartments: [] as string[],
    questions: [] as SurveyQuestion[]
  });

  const departments = [
    'Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 
    'Design', 'Product', 'Operations', 'Customer Support'
  ];

  const categories = [
    { value: 'engagement', label: 'Employee Engagement' },
    { value: 'satisfaction', label: 'Job Satisfaction' },
    { value: 'culture', label: 'Company Culture' },
    { value: 'wellness', label: 'Employee Wellness' },
    { value: 'feedback', label: 'General Feedback' },
    { value: 'custom', label: 'Custom Survey' }
  ];

  const questionTypes = [
    { value: 'rating', label: 'Rating Scale (1-5)' },
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'text', label: 'Text Response' },
    { value: 'yes-no', label: 'Yes/No' }
  ];

  useEffect(() => {
    if (survey) {
      setFormData({
        title: survey.title,
        description: survey.description,
        status: survey.status,
        totalEmployees: survey.totalEmployees,
        startDate: survey.startDate,
        endDate: survey.endDate,
        category: survey.category,
        isAnonymous: survey.isAnonymous,
        targetDepartments: survey.targetDepartments,
        questions: survey.questions
      });
    } else {
      // Reset form with default questions
      setFormData({
        title: '',
        description: '',
        status: 'draft',
        totalEmployees: 120,
        startDate: '',
        endDate: '',
        category: 'engagement',
        isAnonymous: true,
        targetDepartments: [],
        questions: []
      });
    }
  }, [survey, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (survey) {
      onSave({
        ...survey,
        ...formData
      });
    } else {
      onSave(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDepartmentChange = (department: string) => {
    setFormData(prev => ({
      ...prev,
      targetDepartments: prev.targetDepartments.includes(department)
        ? prev.targetDepartments.filter(d => d !== department)
        : [...prev.targetDepartments, department]
    }));
  };

  const addQuestion = () => {
    const newQuestion: SurveyQuestion = {
      id: Date.now().toString(),
      question: '',
      type: 'rating',
      required: false
    };
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (questionId: string, updates: Partial<SurveyQuestion>) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    }));
  };

  const removeQuestion = (questionId: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const addOption = (questionId: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId 
          ? { ...q, options: [...(q.options || []), ''] }
          : q
      )
    }));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId 
          ? { 
              ...q, 
              options: q.options?.map((opt, idx) => idx === optionIndex ? value : opt) 
            }
          : q
      )
    }));
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId 
          ? { 
              ...q, 
              options: q.options?.filter((_, idx) => idx !== optionIndex) 
            }
          : q
      )
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {survey ? 'Edit Survey' : 'Create New Survey'}
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Survey Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter survey title"
                />
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
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
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
                placeholder="Describe the purpose and scope of this survey..."
              />
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
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Anonymous Survey</span>
              </label>
            </div>
          </div>

          {/* Target Departments */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Target Departments</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {departments.map(department => (
                <label key={department} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.targetDepartments.includes(department)}
                    onChange={() => handleDepartmentChange(department)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{department}</span>
                </label>
              ))}
            </div>
            {formData.targetDepartments.length === 0 && (
              <p className="text-sm text-gray-500">No departments selected - survey will be sent to all employees</p>
            )}
          </div>

          {/* Survey Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Survey Questions</h3>
              <div className="flex items-center gap-2">
                {formData.category === 'engagement' && (
                  <div className="bg-green-50 px-3 py-2 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Note:</strong> Engagement surveys use pre-defined validated questions (50 questions total)
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={addQuestion}
                  disabled={formData.category === 'engagement'}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </button>
              </div>
            </div>

            {formData.category === 'engagement' && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Pre-defined Engagement Questions</h4>
                <p className="text-sm text-blue-800 mb-3">
                  This survey uses 50 comprehensive engagement questions covering:
                </p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>Organizational Performance</strong> (5 questions) - Customer focus and service quality</li>
                  <li>• <strong>Leadership</strong> (4 questions) - Leadership effectiveness and direction</li>
                  <li>• <strong>Supervision</strong> (5 questions) - Direct supervisor support and guidance</li>
                  <li>• <strong>Work Environment</strong> (6 questions) - Resources, processes, and workplace culture</li>
                  <li>• <strong>Teamwork</strong> (4 questions) - Collaboration and colleague relationships</li>
                  <li>• <strong>Work-Life Balance</strong> (5 questions) - Workload, stress, and job security</li>
                  <li>• <strong>Performance Management</strong> (1 question) - Fairness of performance processes</li>
                  <li>• <strong>Career Development</strong> (4 questions) - Growth opportunities and skill development</li>
                  <li>• <strong>Empowerment</strong> (6 questions) - Ability to make impact and contribute</li>
                  <li>• <strong>Job Satisfaction</strong> (6 questions) - Overall satisfaction and engagement</li>
                  <li>• <strong>Organizational Commitment</strong> (4 questions) - Loyalty and retention factors</li>
                </ul>
                <p className="text-sm text-blue-800 mt-3">
                  Questions cover all key aspects of employee engagement and organizational effectiveness.
                </p>
              </div>
            )}

            {formData.category !== 'engagement' && (
              <div className="space-y-4">
              {formData.questions.map((question, index) => (
                <div key={question.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Question {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        value={question.question}
                        onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                        placeholder="Enter your question..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={question.type}
                        onChange={(e) => updateQuestion(question.id, { 
                          type: e.target.value as SurveyQuestion['type'],
                          options: e.target.value === 'multiple-choice' ? [''] : undefined
                        })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {questionTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={question.required}
                          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Required</span>
                      </label>
                    </div>

                    {question.type === 'multiple-choice' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Options</span>
                          <button
                            type="button"
                            onClick={() => addOption(question.id)}
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            + Add Option
                          </button>
                        </div>
                        {question.options?.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                              placeholder={`Option ${optionIndex + 1}`}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => removeOption(question.id, optionIndex)}
                              className="text-red-600 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              </div>
            )}

            {formData.category !== 'engagement' && formData.questions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No questions added yet. Click "Add Question" to get started.</p>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
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
              {survey ? 'Update' : 'Create'} Survey
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SurveyForm;