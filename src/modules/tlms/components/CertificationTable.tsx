import React from 'react';
import { Edit, Trash2, Calendar, AlertTriangle, CheckCircle, ExternalLink, User, Award } from 'lucide-react';
import { Certification } from '../../../types';

interface CertificationTableProps {
  certifications: Certification[];
  onEdit: (certification: Certification) => void;
  onDelete: (id: string) => void;
}

const CertificationTable: React.FC<CertificationTableProps> = ({ certifications, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expiring-soon': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'expiring-soon': return <AlertTriangle className="w-4 h-4" />;
      case 'expired': return <AlertTriangle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatExpiryMessage = (expiryDate: string) => {
    const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
    
    if (daysUntilExpiry < 0) {
      return `Expired ${Math.abs(daysUntilExpiry)} days ago`;
    } else if (daysUntilExpiry === 0) {
      return 'Expires today';
    } else if (daysUntilExpiry <= 30) {
      return `Expires in ${daysUntilExpiry} days`;
    } else {
      return new Date(expiryDate).toLocaleDateString();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Certification
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Issuing Body
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Issue Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expiry Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {certifications.map((certification) => (
              <tr key={certification.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">
                        {certification.name}
                      </div>
                      {certification.credentialId && (
                        <div className="text-xs text-gray-500 font-mono">
                          ID: {certification.credentialId}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <div className="text-sm text-gray-900">{certification.employeeName}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{certification.issuingBody}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{certification.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-sm text-gray-900">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {new Date(certification.issueDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div className={`${
                      certification.status === 'expired' ? 'text-red-600 font-medium' :
                      certification.status === 'expiring-soon' ? 'text-yellow-600 font-medium' :
                      'text-gray-600'
                    }`}>
                      {formatExpiryMessage(certification.expiryDate)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(certification.status)}`}>
                      {getStatusIcon(certification.status)}
                      {certification.status === 'expiring-soon' ? 'Expiring Soon' : 
                       certification.status.charAt(0).toUpperCase() + certification.status.slice(1)}
                    </span>
                    {certification.renewalRequired && certification.status !== 'active' && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        Renewal Required
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {certification.attachmentUrl && (
                      <a
                        href={certification.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        title="View Certificate"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => onEdit(certification)}
                      className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(certification.id)}
                      className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {certifications.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No certifications found</p>
        </div>
      )}
    </div>
  );
};

export default CertificationTable;