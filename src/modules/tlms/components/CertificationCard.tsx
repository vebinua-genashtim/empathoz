import React from 'react';
import { Award, Calendar, AlertTriangle, CheckCircle, Edit, Trash2, ExternalLink, User } from 'lucide-react';
import { Certification } from '../../../types';

interface CertificationCardProps {
  certification: Certification;
  onEdit: (certification: Certification) => void;
  onDelete: (id: string) => void;
}

const CertificationCard: React.FC<CertificationCardProps> = ({ certification, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'expiring-soon': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'Safety':
        return 'from-yellow-500 to-orange-500';
      case 'Technology':
        return 'from-blue-500 to-cyan-500';
      case 'Management':
        return 'from-purple-500 to-pink-500';
      case 'Compliance':
        return 'from-gray-500 to-slate-500';
      case 'Finance':
        return 'from-green-500 to-emerald-500';
      case 'Healthcare':
        return 'from-red-500 to-pink-500';
      default:
        return 'from-indigo-500 to-purple-500';
    }
  };

  const getDaysUntilExpiry = () => {
    const today = new Date();
    const expiry = new Date(certification.expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatExpiryMessage = () => {
    const daysUntilExpiry = getDaysUntilExpiry();
    
    if (daysUntilExpiry < 0) {
      return `Expired ${Math.abs(daysUntilExpiry)} days ago`;
    } else if (daysUntilExpiry === 0) {
      return 'Expires today';
    } else if (daysUntilExpiry <= 30) {
      return `Expires in ${daysUntilExpiry} days`;
    } else {
      return `Expires ${new Date(certification.expiryDate).toLocaleDateString()}`;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getCategoryGradient(certification.category)} flex items-center justify-center`}>
          <Award className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(certification)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(certification.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(certification.status)}`}>
          <div className="flex items-center gap-1">
            {getStatusIcon(certification.status)}
            {certification.status === 'expiring-soon' ? 'Expiring Soon' : 
             certification.status.charAt(0).toUpperCase() + certification.status.slice(1)}
          </div>
        </span>
        {certification.renewalRequired && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            Renewable
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{certification.name}</h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>{certification.employeeName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Award className="w-4 h-4" />
          <span>{certification.issuingBody}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Issued: {new Date(certification.issueDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className={`${
            certification.status === 'expired' ? 'text-red-600 font-medium' :
            certification.status === 'expiring-soon' ? 'text-yellow-600 font-medium' :
            'text-gray-600'
          }`}>
            {formatExpiryMessage()}
          </span>
        </div>
      </div>

      {certification.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{certification.description}</p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{certification.category}</span>
        <div className="flex items-center gap-2">
          {certification.credentialId && (
            <span className="text-xs text-gray-500 font-mono">
              ID: {certification.credentialId}
            </span>
          )}
          {certification.attachmentUrl && (
            <a
              href={certification.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
            >
              <ExternalLink className="w-3 h-3" />
              View
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificationCard;