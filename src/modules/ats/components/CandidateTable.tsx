import React from 'react';
import { Edit, Trash2, ExternalLink, Mail, Phone, FileText, Award, Briefcase, UserPlus } from 'lucide-react';
import { Candidate } from '../../../services/dataService';

interface CandidateTableProps {
  candidates: Candidate[];
  onEdit: (candidate: Candidate) => void;
  onDelete: (id: string) => void;
  onHire?: (candidate: Candidate) => void;
}

const CandidateTable: React.FC<CandidateTableProps> = ({ candidates, onEdit, onDelete, onHire }) => {
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Candidate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Experience
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applied Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salary
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {candidate.firstName.charAt(0)}{candidate.lastName.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {candidate.firstName} {candidate.lastName}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {candidate.email}
                        </div>
                        {candidate.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {candidate.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{candidate.position}</div>
                  <div className="text-sm text-gray-500">{candidate.department}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(candidate.status)}`}>
                    {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSourceColor(candidate.source)}`}>
                    {candidate.source.charAt(0).toUpperCase() + candidate.source.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {candidate.experience} years
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(candidate.appliedDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {candidate.salary ? `$${candidate.salary.toLocaleString()}` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {candidate.status === 'offer' && onHire && (
                      <button
                        onClick={() => onHire(candidate)}
                        className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                        title="Hire Candidate"
                      >
                        <UserPlus className="w-4 h-4" />
                      </button>
                    )}
                    {candidate.cvUrl && (
                      <a
                        href={candidate.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        title="View CV"
                      >
                        <FileText className="w-4 h-4" />
                      </a>
                    )}
                    {candidate.certificationsUrl && (
                      <a
                        href={candidate.certificationsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                        title="View Certifications"
                      >
                        <Award className="w-4 h-4" />
                      </a>
                    )}
                    {candidate.portfolioUrl && (
                      <a
                        href={candidate.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-900 p-1 hover:bg-purple-50 rounded"
                        title="View Portfolio"
                      >
                        <Briefcase className="w-4 h-4" />
                      </a>
                    )}
                    {candidate.resumeUrl && (
                      <a
                        href={candidate.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded"
                        title="View Resume"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => onEdit(candidate)}
                      className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(candidate.id)}
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
      {candidates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No candidates found</p>
        </div>
      )}
    </div>
  );
};

export default CandidateTable;