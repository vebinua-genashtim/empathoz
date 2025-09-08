import React from 'react';
import { Mail, Phone, Calendar, DollarSign, Edit, Trash2, User, FileText, Award, Briefcase, ExternalLink } from 'lucide-react';
import { Employee } from '../../../services/dataService';

interface EmployeeCardProps {
  employee: Employee;
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onView, onEdit, onDelete }) => {
  // Placeholder function for file access control
  const canViewFile = (fileType: string) => {
    return true; // For now, allow access to all files
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'Engineering': return 'bg-blue-50 text-blue-700';
      case 'Marketing': return 'bg-purple-50 text-purple-700';
      case 'Sales': return 'bg-green-50 text-green-700';
      case 'HR': return 'bg-pink-50 text-pink-700';
      case 'Finance': return 'bg-yellow-50 text-yellow-700';
      case 'Design': return 'bg-indigo-50 text-indigo-700';
      default: return 'bg-gray-50 text-gray-700';
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {employee.profilePhotoUrl ? (
            <img
              src={employee.profilePhotoUrl}
              alt={`${employee.firstName} ${employee.lastName}`}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {employee.firstName} {employee.lastName}
            </h3>
            <p className="text-sm text-gray-600">{employee.position}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(employee)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(employee.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          <span>{employee.email}</span>
        </div>
        {employee.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{employee.phone}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Hired: {new Date(employee.hireDate).toLocaleDateString()}</span>
        </div>
        {employee.salary && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span>${employee.salary.toLocaleString()}/year</span>
          </div>
        )}
        {employee.experience && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>{employee.experience} years experience</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
            {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDepartmentColor(employee.department)}`}>
            {employee.department}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {getYearsOfService()}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">ID: {employee.id}</span>
          {employee.managerId && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <User className="w-3 h-3" />
              <span>Mgr: {employee.managerId}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {canViewFile('cv') && employee.cvUrl && (
            <a
              href={employee.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
              title="View CV"
            >
              <FileText className="w-3 h-3" />
              CV
            </a>
          )}
          {canViewFile('certifications') && employee.certificationsUrl && (
            <a
              href={employee.certificationsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700"
              title="View Certifications"
            >
              <Award className="w-3 h-3" />
              Certs
            </a>
          )}
          {canViewFile('portfolio') && employee.portfolioUrl && (
            <a
              href={employee.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700"
              title="View Portfolio"
            >
              <Briefcase className="w-3 h-3" />
              Portfolio
            </a>
          )}
        </div>
      </div>

      {employee.notes && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 line-clamp-2">{employee.notes}</p>
        </div>
      )}

      {(employee.city || employee.country) && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>📍</span>
            <span>
              {employee.city && employee.country 
                ? `${employee.city}, ${employee.country}`
                : employee.city || employee.country
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeCard;