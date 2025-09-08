import React from 'react';
import { DollarSign, Calendar, FileText, Edit, Trash2, ExternalLink, User } from 'lucide-react';

interface Claim {
  id: string;
  employeeName: string;
  employeeId: string;
  claimType: 'travel' | 'medical' | 'equipment' | 'training' | 'meal' | 'other';
  amount: number;
  currency: string;
  description: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  approvedBy?: string;
  receiptUrl?: string;
  category: string;
  urgency: 'low' | 'medium' | 'high';
}

interface ClaimCardProps {
  claim: Claim;
  onEdit: (claim: Claim) => void;
  onDelete: (id: string) => void;
}

const ClaimCard: React.FC<ClaimCardProps> = ({ claim, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getClaimTypeColor = (type: string) => {
    switch (type) {
      case 'travel': return 'bg-blue-50 text-blue-700';
      case 'medical': return 'bg-red-50 text-red-700';
      case 'equipment': return 'bg-purple-50 text-purple-700';
      case 'training': return 'bg-green-50 text-green-700';
      case 'meal': return 'bg-orange-50 text-orange-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatClaimType = (type: string) => {
    const typeMap = {
      travel: 'Travel',
      medical: 'Medical',
      equipment: 'Equipment',
      training: 'Training',
      meal: 'Meal',
      other: 'Other'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {claim.employeeName.split(' ').map(n => n.charAt(0)).join('')}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {claim.employeeName}
            </h3>
            <p className="text-sm text-gray-600">{claim.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(claim)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(claim.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span className="font-semibold text-lg text-gray-900">
            {claim.currency} {claim.amount.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Submitted: {new Date(claim.submissionDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FileText className="w-4 h-4" />
          <span>{claim.description}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
            {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getClaimTypeColor(claim.claimType)}`}>
            {formatClaimType(claim.claimType)}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(claim.urgency)}`}>
            {claim.urgency.charAt(0).toUpperCase() + claim.urgency.slice(1)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">ID: {claim.id}</span>
        <div className="flex items-center gap-2">
          {claim.receiptUrl && (
            <a
              href={claim.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <ExternalLink className="w-3 h-3" />
              Receipt
            </a>
          )}
          {claim.approvedBy && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <User className="w-3 h-3" />
              <span>By: {claim.approvedBy}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimCard;