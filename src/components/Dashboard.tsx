import React from 'react';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { dataService } from '../services/dataService';

const Dashboard: React.FC = () => {
  const candidateStats = dataService.getCandidateStats();
  const employeeStats = dataService.getEmployeeStats();
  const departmentStats = dataService.getDepartmentStats();

  const stats = [
    {
      title: 'Total Employees',
      value: employeeStats.total.toString(),
      change: '+0',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Open Positions',
      value: candidateStats.applied.toString(),
      change: '+' + candidateStats.applied,
      trend: 'up',
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Pending Reviews',
      value: (candidateStats.screening + candidateStats.interview).toString(),
      change: '+' + (candidateStats.screening + candidateStats.interview),
      trend: 'up',
      icon: Clock,
      color: 'orange'
    },
    {
      title: 'Training Complete',
      value: '89%',
      change: '+5%',
      trend: 'up',
      icon: CheckCircle,
      color: 'purple'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'recruitment',
      message: 'New application received for Senior Developer position',
      time: '2 hours ago',
      status: 'new'
    },
    {
      id: 2,
      type: 'onboarding',
      message: 'John Smith completed onboarding process',
      time: '4 hours ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'training',
      message: 'Q1 Safety Training deadline approaching',
      time: '6 hours ago',
      status: 'warning'
    },
    {
      id: 4,
      type: 'survey',
      message: 'Employee Engagement Survey results available',
      time: '1 day ago',
      status: 'info'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      orange: 'bg-orange-500',
      purple: 'bg-purple-500'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-500';
  };

  return (
    <div className="flex-1 bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening in your organization.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${getColorClasses(stat.color)} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50">
                <div className={`w-3 h-3 rounded-full mt-2 ${
                  activity.status === 'new' ? 'bg-blue-500' :
                  activity.status === 'completed' ? 'bg-green-500' :
                  activity.status === 'warning' ? 'bg-orange-500' :
                  'bg-gray-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left">
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-medium text-gray-900">Add Employee</h3>
              <p className="text-sm text-gray-600">Create new employee record</p>
            </button>
            <button className="p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors text-left">
              <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-medium text-gray-900">Post Job</h3>
              <p className="text-sm text-gray-600">Create new job posting</p>
            </button>
            <button className="p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors text-left">
              <Calendar className="w-8 h-8 text-purple-600 mb-2" />
              <h3 className="font-medium text-gray-900">Schedule Training</h3>
              <p className="text-sm text-gray-600">Set up employee training</p>
            </button>
            <button className="p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors text-left">
              <AlertCircle className="w-8 h-8 text-orange-600 mb-2" />
              <h3 className="font-medium text-gray-900">Create Survey</h3>
              <p className="text-sm text-gray-600">Launch engagement survey</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;