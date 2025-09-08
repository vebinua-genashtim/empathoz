import React from 'react';
import { Mail, Phone, Calendar, DollarSign, Edit, Trash2, ExternalLink, FileText, Award, Briefcase, UserPlus } from 'lucide-react';
import { Candidate } from '../../../services/dataService';

interface CandidateCardProps {
  candidate: Candidate;
  onEdit: (candidate: Candidate) => void;
  onDelete: (id: string) => void;
  onHire?: (candidate: Candidate) => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onEdit, onDelete, onHire }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'screening': return 'bg-yellow-100 text-yellow-800';
      case 'interview': return 'bg-purple-100 text-purple-800';
      case 'offer': return 'bg-green-100 text-green-800';
      case 'hired': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'linkedin': return 'bg-blue-50 text-blue-700';
      case 'referral': return 'bg-green-50 text-green-700';
      case 'website': return 'bg-purple-50 text-purple-700';
      case 'job-board': return 'bg-orange-50 text-orange-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {candidate.firstName.charAt(0)}{candidate.lastName.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {candidate.firstName} {candidate.lastName}
            </h3>
            <p className="text-sm text-gray-600">{candidate.position}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {candidate.status === 'offer' && onHire && (
            <button
              onClick={() => onHire(candidate)}
              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
              title="Hire Candidate"
            >
              <UserPlus className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onEdit(candidate)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(candidate.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          <span>{candidate.email}</span>
        </div>
        {candidate.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{candidate.phone}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Applied: {new Date(candidate.appliedDate).toLocaleDateString()}</span>
        </div>
        {candidate.salary && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span>${candidate.salary.toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
            {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(candidate.source)}`}>
            {candidate.source.charAt(0).toUpperCase() + candidate.source.slice(1)}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {candidate.experience} years exp.
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{candidate.department}</span>
        <div className="flex items-center gap-2">
          {candidate.cvUrl && (
            <a
              href={candidate.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
              title="View CV"
            >
              <FileText className="w-3 h-3" />
              CV
            </a>
          )}
          {candidate.certificationsUrl && (
            <a
              href={candidate.certificationsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700"
              title="View Certifications"
            >
              <Award className="w-3 h-3" />
              Certs
            </a>
          )}
          {candidate.portfolioUrl && (
            <a
              href={candidate.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700"
              title="View Portfolio"
            >
              <Briefcase className="w-3 h-3" />
              Portfolio
            </a>
          )}
          {candidate.resumeUrl && (
            <a
              href={candidate.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-700"
              title="View Resume"
            >
              <ExternalLink className="w-3 h-3" />
              Resume
            </a>
          )}
        </div>
      </div>

      {candidate.notes && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 line-clamp-2">{candidate.notes}</p>
        </div>
      )}
    </div>
  );
};

export default CandidateCard;