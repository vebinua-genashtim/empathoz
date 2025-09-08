import React, { useState, useEffect } from 'react';
import { X, Save, User, Settings, Eye, EyeOff, Plus } from 'lucide-react';
import { Employee } from '../../../services/dataService';

interface EmployeeFormProps {
  employee?: Employee;
  onSave: (employee: Omit<Employee, 'id'> | Employee) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  employee,
  onSave,
  onCancel,
  isOpen
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    employmentType: 'full-time' as const,
    hireDate: '',
    status: 'active' as const,
    salary: 0,
    managerId: '',
    city: '', // Existing
    country: '', // Existing
    cvUrl: '',
    certificationsUrl: '',
    portfolioUrl: '',
    experience: 0,
    notes: '',
    profilePhotoUrl: '',
    dateOfBirth: '', // Added
    gender: 'prefer-not-to-say' as const, // Added
    pronouns: '', // Added
    streetAddress: '', // Added
    stateProvince: '', // Added
    zipPostalCode: '', // Added
    emergencyContactName: '', // Added
    emergencyContactRelationship: 'none' as const, // Added
    emergencyContactPhone: '', // Added
    workLocationType: 'on-site' as const, // Added
    endDate: '', // Added
    terminationReason: '', // Added
    skills: [], // Added
    education: [], // Added
  });

  // Guidelines configuration state
  const [guidelinesConfig, setGuidelinesConfig] = useState({
    visible: true,
    title: 'Document Upload Guidelines',
    content: [
      '• Profile Photo: Square images work best (JPG, PNG, GIF formats)',
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
  const departments = [
    'Engineering',
    'Marketing', 
    'Sales',
    'HR',
    'Finance',
    'Design',
    'Product',
    'Operations',
    'Customer Support',
    'Legal'
  ];

  const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'terminated', label: 'Terminated' }
  ];

  const employmentTypes = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' }
  ];

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        department: employee.department,
        position: employee.position,
        employmentType: employee.employmentType || 'full-time',
        hireDate: employee.hireDate,
        status: employee.status,
        salary: employee.salary || 0,
        managerId: employee.managerId || '',
        city: employee.city || '', // Existing
        country: employee.country || '', // Existing
        cvUrl: employee.cvUrl || '',
        certificationsUrl: employee.certificationsUrl || '',
        portfolioUrl: employee.portfolioUrl || '',
        experience: employee.experience || 0,
        notes: employee.notes || '',
        profilePhotoUrl: employee.profilePhotoUrl || '',
        dateOfBirth: employee.dateOfBirth || '', // Added
        gender: employee.gender || 'prefer-not-to-say', // Added
        pronouns: employee.pronouns || '', // Added
        streetAddress: employee.streetAddress || '', // Added
        stateProvince: employee.stateProvince || '', // Added
        zipPostalCode: employee.zipPostalCode || '', // Added
        emergencyContactName: employee.emergencyContactName || '', // Added
        emergencyContactRelationship: employee.emergencyContactRelationship || 'none', // Added
        emergencyContactPhone: employee.emergencyContactPhone || '', // Added
        workLocationType: employee.workLocationType || 'on-site', // Added
        endDate: employee.endDate || '', // Added
        terminationReason: employee.terminationReason || '', // Added
        skills: employee.skills || [], // Added
        education: employee.education || [], // Added
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        position: '',
        employmentType: 'full-time',
        hireDate: '',
        status: 'active',
        salary: 0,
        managerId: '',
        city: '', // Existing
        country: '', // Existing
        cvUrl: '',
        certificationsUrl: '',
        portfolioUrl: '',
        experience: 0,
        notes: '',
        profilePhotoUrl: '',
        dateOfBirth: '', // Added
        gender: 'prefer-not-to-say', // Added
        pronouns: '', // Added
        streetAddress: '', // Added
        stateProvince: '', // Added
        zipPostalCode: '', // Added
        emergencyContactName: '', // Added
        emergencyContactRelationship: 'none', // Added
        emergencyContactPhone: '', // Added
        workLocationType: 'on-site', // Added
        endDate: '', // Added
        terminationReason: '', // Added
        skills: [], // Added
        education: [], // Added
      });
    }
  }, [employee, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (employee) {
      onSave({
        ...employee,
        ...formData,
        salary: formData.salary || undefined, // Keep existing logic
        endDate: formData.endDate || undefined, // Set to undefined if empty
        terminationReason: formData.terminationReason || undefined, // Set to undefined if empty
        managerId: formData.managerId || undefined
      });
    } else {
      onSave({
        ...formData,
        salary: formData.salary || undefined,
        managerId: formData.managerId || undefined
        // No need to set endDate/terminationReason to undefined for new employee as they start empty
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'salary' || name === 'experience' ? Number(value) : value
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEducationChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education?.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addEducationEntry = () => {
    setFormData(prev => ({
      ...prev,
      education: [...(prev.education || []), { degree: '', major: '', institution: '', graduationYear: new Date().getFullYear() }]
    }));
  };

  const removeEducationEntry = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education?.filter((_, i) => i !== index)
    }));
  };

  const genders = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'non-binary', label: 'Non-binary' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  const relationships = [
    { value: 'none', label: 'Select Relationship' },
    { value: 'spouse', label: 'Spouse' },
    { value: 'parent', label: 'Parent' },
    { value: 'child', label: 'Child' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'friend', label: 'Friend' },
    { value: 'other', label: 'Other' }
  ];

  const workLocationTypes = [
    { value: 'on-site', label: 'On-site' },
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  const terminationReasons = [
    { value: '', label: 'Select Reason' },
    { value: 'resignation', label: 'Resignation' },
    { value: 'termination', label: 'Termination' },
    { value: 'retirement', label: 'Retirement' },
    { value: 'layoff', label: 'Layoff' },
    { value: 'contract-end', label: 'Contract End' },
    { value: 'other', label: 'Other' }
  ];

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
              {employee ? 'Edit Employee' : 'Add New Employee'}
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
          {/* Profile Photo */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Profile Photo</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo
              </label>
              <input
                type="file"
                name="profilePhoto"
                accept=".jpg,.jpeg,.png,.gif"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
              <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF (max 2MB, square images work best)</p>
            </div>
          </div>

          {/* Personal Information */}
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
                placeholder="Enter first name"
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
                placeholder="Enter last name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {genders.map(gender => (
                  <option key={gender.value} value={gender.value}>
                    {gender.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pronouns
              </label>
              <input
                type="text"
                name="pronouns"
                value={formData.pronouns}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., he/him, she/her, they/them"
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
                placeholder="employee@empathoz.com"
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
                placeholder="+1 (555) 123-4567"
              />
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
                placeholder="Years of experience"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <input
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="123 Main St"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State/Province
              </label>
              <input
                type="text"
                name="stateProvince"
                value={formData.stateProvince}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="CA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zip/Postal Code
              </label>
              <input
                type="text"
                name="zipPostalCode"
                value={formData.zipPostalCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="90210"
              />
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

          {/* Emergency Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Emergency Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Name *
                </label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Emergency contact's full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship *
                </label>
                <select
                  name="emergencyContactRelationship"
                  value={formData.emergencyContactRelationship}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {relationships.map(rel => (
                    <option key={rel.value} value={rel.value}>
                      {rel.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 (555) 999-8888"
                />
              </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="https://example.com/portfolio"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manager ID (Optional)
              </label>
              <input
                type="text"
                name="managerId"
                value={formData.managerId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter manager's employee ID"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
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
                placeholder="Enter job title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Type *
              </label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {employmentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Location Type
              </label>
              <select
                name="workLocationType"
                value={formData.workLocationType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {workLocationTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hire Date *
              </label>
              <input
                type="date"
                name="hireDate"
                value={formData.hireDate}
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
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            {(formData.status === 'terminated' || formData.status === 'inactive') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
            {formData.status === 'terminated' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Termination Reason
                </label>
                <select
                  name="terminationReason"
                  value={formData.terminationReason}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {terminationReasons.map(reason => (
                    <option key={reason.value} value={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Salary
              </label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                min="0"
                step="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
            <textarea
              name="skills"
              value={formData.skills?.join(', ') || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()) }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., React, Node.js, Project Management"
            />
            <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
          </div>

          {/* Education Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Education</h3>
              <button
                type="button"
                onClick={addEducationEntry}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Education
              </button>
            </div>

            {formData.education?.map((edu, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Education Entry {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeEducationEntry(index)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                    <input type="text" value={edu.degree} onChange={(e) => handleEducationChange(index, 'degree', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., B.S., M.A." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Major</label>
                    <input type="text" value={edu.major} onChange={(e) => handleEducationChange(index, 'major', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., Computer Science" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                    <input type="text" value={edu.institution} onChange={(e) => handleEducationChange(index, 'institution', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., University of California, Berkeley" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
                    <input type="number" value={edu.graduationYear} onChange={(e) => handleEducationChange(index, 'graduationYear', parseInt(e.target.value) || new Date().getFullYear())} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., 2015" />
                  </div>
                </div>
              </div>
            ))}
            {formData.education?.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <p>No education entries added yet.</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Additional notes about the employee..."
            />
          </div>

          {/* Document Upload Guidelines */}
          {guidelinesConfig.visible && (
            <div className="bg-blue-50 p-4 rounded-lg relative">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-blue-900">{guidelinesConfig.title}</h4>
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
              </div>
              <ul className="text-sm text-blue-800 space-y-1">
                {guidelinesConfig.content.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Show Guidelines if hidden */}
          {!guidelinesConfig.visible && (
            <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <EyeOff className="w-4 h-4" />
                <span className="text-sm">Document Upload Guidelines (Hidden)</span>
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
              {employee ? 'Update' : 'Create'} Employee
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
                <h2 className="text-xl font-semibold text-gray-900">Configure Document Upload Guidelines</h2>
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
                  <strong>Preview:</strong> Changes will be applied immediately and visible to all users filling out the employee form.
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

export default EmployeeForm;