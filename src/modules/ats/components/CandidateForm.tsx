import React, { useState, useEffect } from 'react';
import { X, Save, User, Settings, Eye, EyeOff } from 'lucide-react';
import { Candidate } from '../../../services/dataService';

interface CandidateFormProps {
  candidate?: Candidate;
  onSave: (candidate: Omit<Candidate, 'id'> | Candidate) => void;
  onCancel: () => void;
  isOpen: boolean;
  isAdmin?: boolean;
}

const CandidateForm: React.FC<CandidateFormProps> = ({
  candidate,
  onSave,
  onCancel,
  isOpen,
  isAdmin = false
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    status: 'applied' as const,
    experience: 0,
    resumeUrl: '',
    notes: '',
    salary: 0,
    source: 'website' as const,
    city: '',
    country: '',
    cvUrl: '',
    certificationsUrl: '',
    portfolioUrl: ''
  });

  // Guidelines configuration state
  const [guidelinesConfig, setGuidelinesConfig] = useState({
    visible: true,
    title: 'File Upload Guidelines',
    content: [
      '• CV/Resume: Required file upload (PDF, DOC, DOCX formats)',
      '• Certifications: Upload multiple files for various certifications (PDF, JPG, PNG)',
      '• Maximum file size: 5MB per file',
      '• Files are securely stored and only accessible to authorized HR personnel',
      '• Portfolio URL can be used for online portfolios or additional work samples'
    ]
  });
  const [showGuidelinesConfig, setShowGuidelinesConfig] = useState(false);
  const [editingGuidelines, setEditingGuidelines] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    if (candidate) {
      setFormData({
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        email: candidate.email,
        phone: candidate.phone,
        position: candidate.position,
        department: candidate.department,
        status: candidate.status,
        experience: candidate.experience,
        resumeUrl: candidate.resumeUrl || '',
        notes: candidate.notes || '',
        salary: candidate.salary || 0,
        source: candidate.source,
        city: candidate.city || '',
        country: candidate.country || '',
        cvUrl: candidate.cvUrl || '',
        certificationsUrl: candidate.certificationsUrl || '',
        portfolioUrl: candidate.portfolioUrl || ''
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        status: 'applied',
        experience: 0,
        resumeUrl: '',
        notes: '',
        salary: 0,
        source: 'website',
        city: '',
        country: '',
        cvUrl: '',
        certificationsUrl: '',
        portfolioUrl: ''
      });
    }
  }, [candidate, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString().split('T')[0];
    
    if (candidate) {
      onSave({
        ...candidate,
        ...formData,
        lastUpdated: now
      });
    } else {
      onSave({
        ...formData,
        appliedDate: now,
        lastUpdated: now
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experience' || name === 'salary' ? Number(value) : value
    }));
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
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {candidate ? 'Edit Candidate' : 'Add New Candidate'}
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
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position *
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Product">Product</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <option value="applied">Applied</option>
                <option value="screening">Screening</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience (years)
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source
              </label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="website">Website</option>
                <option value="linkedin">LinkedIn</option>
                <option value="referral">Referral</option>
                <option value="job-board">Job Board</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter city"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter country"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CV/Resume Upload *
              </label>
              <input
                type="file"
                name="cvFile"
                accept=".pdf,.doc,.docx"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX (max 5MB)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certifications Upload (Multiple files allowed)
              </label>
              <input
                type="file"
                name="certificationsFiles"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (max 5MB each, multiple files allowed)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio URL (Optional)
              </label>
              <input
                type="url"
                name="portfolioUrl"
                value={formData.portfolioUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/portfolio.pdf"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Salary
              </label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Additional notes about the candidate..."
            />
          </div>

          {/* File Upload Guidelines */}
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
                <span className="text-sm">File Upload Guidelines (Hidden)</span>
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
              {candidate ? 'Update' : 'Create'} Candidate
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
                <h2 className="text-xl font-semibold text-gray-900">Configure File Upload Guidelines</h2>
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
                  <strong>Preview:</strong> Changes will be applied immediately and visible to all users filling out the candidate form.
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

export default CandidateForm;