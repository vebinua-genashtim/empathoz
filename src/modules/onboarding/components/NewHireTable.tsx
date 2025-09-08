import React from 'react';
import { Edit, Trash2, Calendar, User, CheckCircle, Clock, ExternalLink, Users } from 'lucide-react';

interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  category: 'documentation' | 'training' | 'equipment' | 'access' | 'meeting';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  dueDate: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
}

interface NewHire {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  startDate: string;
  manager: string;
  status: 'pre-boarding' | 'first-day' | 'first-week' | 'first-month' | 'completed';
  completedTasks: number;
  totalTasks: number;
  onboardingTasks: OnboardingTask[];
}

interface NewHireTableProps {
  newHires: NewHire[];
  onEdit: (newHire: NewHire) => void;
  onDelete: (id: string) => void;
  onCreateEmployeeProfile?: (newHire: NewHire) => void;
  onEnrollInTraining?: (newHire: NewHire) => void;
  onManageTasks?: (newHire: NewHire) => void;
}

const NewHireTable: React.FC<NewHireTableProps> = ({ 
  newHires, 
  onEdit, 
  onDelete, 
  onCreateEmployeeProfile, 
  onEnrollInTraining,
  onManageTasks 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pre-boarding': return 'bg-blue-100 text-blue-800';
      case 'first-day': return 'bg-green-100 text-green-800';
      case 'first-week': return 'bg-yellow-100 text-yellow-800';
      case 'first-month': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                New Hire
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Manager
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {newHires.map((hire) => (
              <tr key={hire.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {hire.firstName.charAt(0)}{hire.lastName.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {hire.firstName} {hire.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{hire.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{hire.position}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getDepartmentColor(hire.department)}`}>
                    {hire.department}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-sm text-gray-900">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {new Date(hire.startDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(hire.status)}`}>
                    {hire.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600">{hire.completedTasks}/{hire.totalTasks}</span>
                        <span className="font-medium">{Math.round((hire.completedTasks / hire.totalTasks) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${(hire.completedTasks / hire.totalTasks) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-sm text-gray-900">
                    <User className="w-4 h-4 text-gray-400" />
                    {hire.manager}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {onManageTasks && (
                      <button
                        onClick={() => onManageTasks(hire)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        title="Manage Onboarding Tasks"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {hire.status === 'completed' && onCreateEmployeeProfile && (
                      <button
                        onClick={() => onCreateEmployeeProfile(hire)}
                        className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                        title="Create Employee Profile in HRDB"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                    {onEnrollInTraining && (
                      <button
                        onClick={() => onEnrollInTraining(hire)}
                        className="text-purple-600 hover:text-purple-900 p-1 hover:bg-purple-50 rounded"
                        title="Enroll in Mandatory Training"
                      >
                        <Users className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(hire)}
                      className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(hire.id)}
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
      {newHires.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No new hires found</p>
        </div>
      )}
    </div>
  );
};

export default NewHireTable;