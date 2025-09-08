import React, { useState, useEffect } from 'react';
import { X, Save, Award, Calendar, AlertTriangle, Upload } from 'lucide-react';
import { Certification } from '../../../types';

interface CertificationFormProps {
  certification?: Certification;
  onSave: (certification: Omit<Certification, 'id' | 'status'> | Certification) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const CertificationForm: React.FC<CertificationFormProps> = ({
  certification,
  onSave,
  onCancel,
  isOpen
}) => {
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    employeeName: '',
    issueDate: '',
    expiryDate: '',
    issuingBody: '',
    credentialId: '',
    description: '',
    attachmentUrl: '',
    renewalRequired: true,
    category: 'Safety'
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

  const categories = [
    'Safety',
    'Technology',
    'Management',
    'Compliance',
    'Finance',
    'Healthcare',
    'Legal',
    'Quality',
    'Security',
    'Professional Development'
  ];

  const commonIssuingBodies = [
    'American Red Cross',
    'National Fire Protection Association',
    'International Association of Privacy Professionals',
    'Amazon Web Services',
    'Microsoft',
    'Google',
    'Project Management Institute',
    'Certified Public Accountants',
    'International Organization for Standardization',
    'Occupational Safety and Health Administration',
    'CompTIA',
    'Cisco Systems',
    'Oracle Corporation',
    'Salesforce',
    'Adobe',
    'Other'
  ];

  const commonCertifications = [
    'First Aid Certification',
    'CPR Certification',
    'Fire Safety Training',
    'Data Protection Officer',
    'AWS Solutions Architect',
    'AWS Developer Associate',
    'Microsoft Azure Fundamentals',
    'Google Cloud Professional',
    'Project Management Professional (PMP)',
    'Certified Scrum Master',
    'CompTIA Security+',
    'Cisco Certified Network Associate',
    'Certified Public Accountant',
    'ISO 9001 Lead Auditor',
    'OSHA 30-Hour Construction',
    'Other'
  ];

  useEffect(() => {
    if (certification) {
      setFormData({
        name: certification.name,
        employeeId: certification.employeeId,
        employeeName: certification.employeeName,
        issueDate: certification.issueDate,
        expiryDate: certification.expiryDate,
        issuingBody: certification.issuingBody,
        credentialId: certification.credentialId || '',
        description: certification.description || '',
        attachmentUrl: certification.attachmentUrl || '',
        renewalRequired: certification.renewalRequired,
        category: certification.category
      });
    } else {
      // Reset form with default values
      const today = new Date().toISOString().split('T')[0];
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      const nextYearStr = nextYear.toISOString().split('T')[0];
      
      setFormData({
        name: '',
        employeeId: '',
        employeeName: '',
        issueDate: today,
        expiryDate: nextYearStr,
        issuingBody: '',
        credentialId: '',
        description: '',
        attachmentUrl: '',
        renewalRequired: true,
        category: 'Safety'
      });
    }
  }, [certification, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (certification) {
      onSave({
        ...certification,
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
      setFormData(prev => {
        const updated = { ...prev, [name]: value };
        
        // Auto-fill employee name when employee ID is selected
        if (name === 'employeeId') {
          const selectedEmployee = employees.find(emp => emp.id === value);
          if (selectedEmployee) {
            updated.employeeName = selectedEmployee.name;
          }
        }
        
        return updated;
      });
    }
  };

  const calculateDaysUntilExpiry = () => {
    if (!formData.expiryDate) return null;
    
    const today = new Date();
    const expiry = new Date(formData.expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryWarning = () => {
    const daysUntilExpiry = calculateDaysUntilExpiry();
    
    if (daysUntilExpiry === null) return null;
    
    if (daysUntilExpiry < 0) {
      return { type: 'error', message: `This certification expired ${Math.abs(daysUntilExpiry)} days ago` };
    } else if (daysUntilExpiry === 0) {
      return { type: 'warning', message: 'This certification expires today' };
    } else if (daysUntilExpiry <= 30) {
      return { type: 'warning', message: `This certification expires in ${daysUntilExpiry} days` };
    }
    
    return null;
  };

  const expiryWarning = getExpiryWarning();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {certification ? 'Edit Certification' : 'Add New Certification'}
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
                  Certification Name *
                </label>
                <select
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Certification</option>
                  {commonCertifications.map(cert => (
                    <option key={cert} value={cert}>{cert}</option>
                  ))}
                </select>
                {formData.name === 'Other' && (
                  <input
                    type="text"
                    placeholder="Enter custom certification name"
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                  />
                )}
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
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of the certification..."
              />
            </div>
          </div>

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

          {/* Certification Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Certification Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issuing Body *
                </label>
                <select
                  name="issuingBody"
                  value={formData.issuingBody}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Issuing Body</option>
                  {commonIssuingBodies.map(body => (
                    <option key={body} value={body}>{body}</option>
                  ))}
                </select>
                {formData.issuingBody === 'Other' && (
                  <input
                    type="text"
                    placeholder="Enter custom issuing body"
                    onChange={(e) => setFormData(prev => ({ ...prev, issuingBody: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credential ID
                </label>
                <input
                  type="text"
                  name="credentialId"
                  value={formData.credentialId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter credential/certificate ID"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Issue Date *
                </label>
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Expiry Date *
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Expiry Warning */}
            {expiryWarning && (
              <div className={`p-3 rounded-lg border ${
                expiryWarning.type === 'error' 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-4 h-4 ${
                    expiryWarning.type === 'error' ? 'text-red-600' : 'text-yellow-600'
                  }`} />
                  <span className={`text-sm font-medium ${
                    expiryWarning.type === 'error' ? 'text-red-800' : 'text-yellow-800'
                  }`}>
                    {expiryWarning.message}
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificate Attachment
              </label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
                <p className="text-xs text-gray-500">
                  Upload certificate document (PDF, JPG, PNG - max 5MB)
                </p>
                <div className="text-xs text-gray-500">
                  Or provide URL:
                </div>
                <input
                  type="url"
                  name="attachmentUrl"
                  value={formData.attachmentUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/certificate.pdf"
                />
              </div>
            </div>

            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="renewalRequired"
                  checked={formData.renewalRequired}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Renewal Required
                </span>
              </label>
            </div>
          </div>

          {/* Certification Guidelines */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-orange-900 mb-2">Certification Guidelines</h4>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>• Ensure all certification information is accurate and up-to-date</li>
              <li>• Upload or link to the official certificate document when available</li>
              <li>• Set appropriate expiry dates to enable renewal reminders</li>
              <li>• Mark certifications as renewable if they require periodic renewal</li>
              <li>• Use consistent naming conventions for similar certifications</li>
            </ul>
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
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {certification ? 'Update' : 'Add'} Certification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificationForm;