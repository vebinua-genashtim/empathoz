import React from 'react';
import { Edit, Trash2, ExternalLink, DollarSign, Calendar, User } from 'lucide-react';

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

interface ClaimTableProps {
  claims: Claim[];
  onEdit: (claim: Claim) => void;
  onDelete: (id: string) => void;
}

const ClaimTable: React.FC<ClaimTableProps> = ({ claims, onEdit, onDelete }) => {
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Claim Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Urgency
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {claims.map((claim) => (
              <tr key={claim.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {claim.employeeName.split(' ').map(n => n.charAt(0)).join('')}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {claim.employeeName}
                      </div>
                      <div className="text-sm text-gray-500">ID: {claim.employeeId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getClaimTypeColor(claim.claimType)}`}>
                    {formatClaimType(claim.claimType)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    {claim.currency} {claim.amount.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(claim.status)}`}>
                    {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(claim.urgency)}`}>
                    {claim.urgency.charAt(0).toUpperCase() + claim.urgency.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-sm text-gray-900">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {new Date(claim.submissionDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{claim.category}</div>
                  <div className="text-sm text-gray-500 truncate max-w-32" title={claim.description}>
                    {claim.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {claim.receiptUrl && (
                      <a
                        href={claim.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => onEdit(claim)}
                      className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(claim.id)}
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
      {claims.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No claims found</p>
        </div>
      )}
    </div>
  );
};

export default ClaimTable;