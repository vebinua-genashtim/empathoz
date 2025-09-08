import React from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Building2, 
  Briefcase, 
  FileText, 
  Award, 
  ExternalLink,
  Edit,
  Clock,
  Users,
  ArrowLeft
} from 'lucide-react';
import { Employee } from '../../../services/dataService';

interface EmployeeProfileProps {
  employee: Employee;
  onBack: () => void;
  onEdit: (employee: Employee) => void;
}

export default function EmployeeProfile({ employee, onBack, onEdit }: EmployeeProfileProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'terminated': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'Engineering': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Marketing': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Sales': return 'bg-green-50 text-green-700 border-green-200';
      case 'HR': return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'Finance': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Design': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getYearsOfService = () => {
    const hireDate = new Date(employee.hireDate);
    const today = new Date();
    const years = today.getFullYear() - hireDate.getFullYear();
    const months = today.getMonth() - hireDate.getMonth();
    
    if (years === 0) {
      return months <= 0 ? 'New hire' : `${months} month${months !== 1 ? 's' : ''}`;
    }
    return `${years} year${years !== 1 ? 's' : ''}`;
  };

  const formatSalary = (salary?: number) => {
    if (!salary) return 'Not specified';
    return `$${salary.toLocaleString()} annually`;
  };

  const canViewFile = (fileType: string) => {
    return true;
  };

  // Hide body overflow when component mounts, restore when unmounts
  React.useEffect(() => {
    document.body.style.overflowY = 'hidden';
    
    return () => {
      document.body.style.overflowY = 'auto';
    };
  }, []);

  return (
    <div className="flex-1 bg-gray-50 max-h-screen overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-4">
              {employee.profilePhotoUrl ? (
                <img
                  src={employee.profilePhotoUrl}
                  alt={`${employee.firstName} ${employee.lastName}`}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {employee.firstName} {employee.lastName}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(employee.status)}`}>
                    {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDepartmentColor(employee.department)}`}>
                    {employee.department}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onEdit(employee)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <a href={`mailto:${employee.email}`} className="text-blue-600 hover:text-blue-700">
                      {employee.email}
                    </a>
                  </div>
                </div>
                {employee.phone && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Phone</p>
                      <a href={`tel:${employee.phone}`} className="text-blue-600 hover:text-blue-700">
                        {employee.phone}
                      </a>
                    </div>
                  </div>
                )}
                {(employee.city || employee.country) && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Location</p>
                      <p className="text-gray-900">
                        {employee.city && employee.country 
                          ? `${employee.city}, ${employee.country}`
                          : employee.city || employee.country
                        }
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Employee ID</p>
                    <p className="text-gray-900 font-mono">{employee.id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Employment Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Building2 className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Department</p>
                    <p className="text-gray-900">{employee.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Briefcase className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Position</p>
                    <p className="text-gray-900">{employee.position}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Hire Date</p>
                    <p className="text-gray-900">{new Date(employee.hireDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Years of Service</p>
                    <p className="text-gray-900">{getYearsOfService()}</p>
                  </div>
                </div>
                {employee.salary && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Annual Salary</p>
                      <p className="text-gray-900">{formatSalary(employee.salary)}</p>
                    </div>
                  </div>
                )}
                {employee.experience && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Award className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Experience</p>
                      <p className="text-gray-900">{employee.experience} years</p>
                    </div>
                  </div>
                )}
                {employee.managerId && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Users className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Manager ID</p>
                      <p className="text-gray-900 font-mono">{employee.managerId}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notes Section */}
            {employee.notes && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Notes
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{employee.notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Documents & Files */}
          <div className="space-y-6">
            {/* Documents */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Documents & Files
              </h2>
              <div className="space-y-4">
                {/* CV/Resume */}
                <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">CV/Resume</h3>
                        <p className="text-sm text-gray-600">Primary resume document</p>
                      </div>
                    </div>
                    {employee.cvUrl ? (
                      <a
                        href={employee.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </a>
                    ) : (
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                        Not uploaded
                      </span>
                    )}
                  </div>
                </div>

                {/* Certifications */}
                <div className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Award className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Certifications</h3>
                        <p className="text-sm text-gray-600">Professional certifications</p>
                      </div>
                    </div>
                    {employee.certificationsUrl ? (
                      <a
                        href={employee.certificationsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </a>
                    ) : (
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                        Not uploaded
                      </span>
                    )}
                  </div>
                </div>

                {/* Portfolio */}
                <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Portfolio</h3>
                        <p className="text-sm text-gray-600">Work samples and projects</p>
                      </div>
                    </div>
                    {employee.portfolioUrl ? (
                      <a
                        href={employee.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </a>
                    ) : (
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                        Not provided
                      </span>
                    )}
                  </div>
                </div>

                {/* Legacy Resume URL (if different from CV) */}
                {employee.resumeUrl && employee.resumeUrl !== employee.cvUrl && (
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Resume (Legacy)</h3>
                          <p className="text-sm text-gray-600">Additional resume document</p>
                        </div>
                      </div>
                      <a
                        href={employee.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* File Upload Guidelines */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Document Guidelines</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• CV/Resume: PDF, DOC, DOCX formats (max 5MB)</li>
                  <li>• Certifications: PDF, JPG, PNG formats (max 5MB each)</li>
                  <li>• Portfolio: Online link to work samples</li>
                  <li>• All documents are securely stored and access-controlled</li>
                </ul>
              </div>
            </div>

            {/* Quick Stats & Actions */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Years of Service</span>
                    </div>
                    <span className="text-lg font-bold text-blue-900">{getYearsOfService()}</span>
                  </div>
                  
                  {employee.experience && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-900">Total Experience</span>
                      </div>
                      <span className="text-lg font-bold text-green-900">{employee.experience} years</span>
                    </div>
                  )}

                  {employee.salary && (
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium text-purple-900">Annual Salary</span>
                      </div>
                      <span className="text-lg font-bold text-purple-900">${employee.salary.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Status</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                      {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Manager Information */}
              {employee.managerId && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Reporting Structure
                  </h2>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Reports to</p>
                        <p className="text-gray-900 font-mono">Manager ID: {employee.managerId}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Document Summary */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Document Summary</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">CV/Resume:</span>
                    <span className={`text-sm font-medium ${employee.cvUrl ? 'text-green-600' : 'text-red-600'}`}>
                      {!canViewFile('cv') ? '🔒 Access Restricted' : employee.cvUrl ? '✓ Uploaded' : '✗ Missing'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Certifications:</span>
                    <span className={`text-sm font-medium ${employee.certificationsUrl ? 'text-green-600' : 'text-gray-500'}`}>
                      {!canViewFile('certifications') ? '🔒 Access Restricted' : employee.certificationsUrl ? '✓ Available' : '- Not provided'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Portfolio:</span>
                    <span className={`text-sm font-medium ${employee.portfolioUrl ? 'text-green-600' : 'text-gray-500'}`}>
                      {!canViewFile('portfolio') ? '🔒 Access Restricted' : employee.portfolioUrl ? '✓ Available' : '- Not provided'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => onEdit(employee)}
                    className="w-full p-3 text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Edit className="w-5 h-5 text-blue-600" />
                      <div>
                        <h3 className="font-medium text-gray-900">Edit Profile</h3>
                        <p className="text-sm text-gray-600">Update employee information</p>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      const subject = encodeURIComponent(`Employee Profile: ${employee.firstName} ${employee.lastName}`);
                      const body = encodeURIComponent(`Employee Information:
Name: ${employee.firstName} ${employee.lastName}
Position: ${employee.position}
Department: ${employee.department}
Email: ${employee.email}
Hire Date: ${new Date(employee.hireDate).toLocaleDateString()}

Best regards,
HR Team`);
                      window.open(`mailto:?subject=${subject}&body=${body}`);
                    }}
                    className="w-full p-3 text-left rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-green-600" />
                      <div>
                        <h3 className="font-medium text-gray-900">Share Profile</h3>
                        <p className="text-sm text-gray-600">Email employee details</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      const profileData = {
                        name: `${employee.firstName} ${employee.lastName}`,
                        position: employee.position,
                        department: employee.department,
                        email: employee.email,
                        hireDate: employee.hireDate,
                        status: employee.status,
                        salary: employee.salary,
                        experience: employee.experience,
                        managerId: employee.managerId
                      };
                      
                      const csvContent = [
                        ['Field', 'Value'].join(','),
                        ...Object.entries(profileData).map(([key, value]) => [
                          key.charAt(0).toUpperCase() + key.slice(1),
                          value ? value.toString() : ''
                        ].join(','))
                      ].join('\n');

                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `employee-${employee.firstName}-${employee.lastName}-profile.csv`;
                      a.click();
                      window.URL.revokeObjectURL(url);
                    }}
                    className="w-full p-3 text-left rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-purple-600" />
                      <div>
                        <h3 className="font-medium text-gray-900">Export Profile</h3>
                        <p className="text-sm text-gray-600">Download as CSV</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}