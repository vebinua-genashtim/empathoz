import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Users, Clock } from 'lucide-react';
import { LeaveRequest } from '../../../services/dataService';

interface LeaveCalendarProps {
  leaveRequests: LeaveRequest[];
  onEditRequest: (request: LeaveRequest) => void;
}

const LeaveCalendar: React.FC<LeaveCalendarProps> = ({ leaveRequests, onEditRequest }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isDateInRange = (date: Date, startDate: string, endDate: string) => {
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const start = new Date(startDate);
    const end = new Date(endDate);
    return checkDate >= start && checkDate <= end;
  };

  const getLeaveRequestsForDate = (date: Date) => {
    return leaveRequests.filter(request => 
      isDateInRange(date, request.startDate, request.endDate)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'vacation': return 'bg-blue-500';
      case 'sick': return 'bg-red-500';
      case 'personal': return 'bg-purple-500';
      case 'maternity': return 'bg-pink-500';
      case 'paternity': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="calendar-day-cell empty">
        </div>
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayRequests = getLeaveRequestsForDate(date);
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <div key={day} className={`calendar-day-cell ${isToday ? 'today' : ''}`}>
          <div className="day-header">
            <span className={`day-number ${isToday ? 'today-number' : ''}`}>
              {day}
            </span>
          </div>
          <div className="leave-requests">
            {dayRequests.slice(0, 3).map((request, index) => (
              <div
                key={`${request.id}-${index}`}
                onClick={() => onEditRequest(request)}
                className={`leave-item ${getStatusColor(request.status)} cursor-pointer`}
                title={`${request.employeeName} - ${request.leaveType} (${request.status})`}
              >
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${getLeaveTypeColor(request.leaveType)}`}></div>
                  <span className="text-xs font-medium truncate">
                    {request.employeeName.split(' ')[0]}
                  </span>
                </div>
                <div className="text-xs opacity-75">
                  {request.leaveType.charAt(0).toUpperCase() + request.leaveType.slice(1)}
                </div>
              </div>
            ))}
            {dayRequests.length > 3 && (
              <div className="leave-item bg-gray-100 text-gray-600 border-gray-200">
                <span className="text-xs">+{dayRequests.length - 3} more</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const getMonthStats = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const monthRequests = leaveRequests.filter(request => {
      const startDate = new Date(request.startDate);
      const endDate = new Date(request.endDate);
      return (startDate <= monthEnd && endDate >= monthStart);
    });

    const totalRequests = monthRequests.length;
    const approvedRequests = monthRequests.filter(r => r.status === 'approved').length;
    const pendingRequests = monthRequests.filter(r => r.status === 'pending').length;
    const totalDays = monthRequests
      .filter(r => r.status === 'approved')
      .reduce((sum, r) => sum + r.days, 0);

    return { totalRequests, approvedRequests, pendingRequests, totalDays };
  };

  const monthStats = getMonthStats();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Calendar Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Month Stats */}
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{monthStats.totalRequests} requests</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{monthStats.approvedRequests} approved</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{monthStats.pendingRequests} pending</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{monthStats.totalDays} days off</span>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day Headers */}
        <div className="calendar-header">
          {dayNames.map(day => (
            <div key={day} className="day-header-cell">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="calendar-grid">
          {renderCalendarDays()}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Leave Types</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">Vacation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600">Sick Leave</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-sm text-gray-600">Personal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-pink-500"></div>
              <span className="text-sm text-gray-600">Maternity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <span className="text-sm text-gray-600">Paternity</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 rounded bg-green-100 border border-green-200"></div>
              <span className="text-sm text-gray-600">Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 rounded bg-yellow-100 border border-yellow-200"></div>
              <span className="text-sm text-gray-600">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 rounded bg-red-100 border border-red-200"></div>
              <span className="text-sm text-gray-600">Rejected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveCalendar;