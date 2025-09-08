import React from 'react';
import { Calendar, Clock, Users, MapPin, Edit, User } from 'lucide-react';

interface TrainingSession {
  id: string;
  title: string;
  description: string;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  maxParticipants: number;
  enrolledCount: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  category: string;
  required: boolean;
}

interface TrainingSessionCardProps {
  session: TrainingSession;
  onEdit: (session: TrainingSession) => void;
}

const TrainingSessionCard: React.FC<TrainingSessionCardProps> = ({ session, onEdit }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'Safety':
        return 'from-yellow-500 to-orange-500';
      case 'Leadership':
        return 'from-purple-500 to-pink-500';
      case 'Compliance':
        return 'from-gray-500 to-slate-500';
      case 'Technical Skills':
      case 'Development':
        return 'from-blue-500 to-cyan-500';
      case 'Project Management':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-indigo-500 to-purple-500';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getCategoryGradient(session.category)} flex items-center justify-center`}>
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(session)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
        </span>
        {session.required && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Required
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{session.title}</h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{session.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>Instructor: {session.instructor}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{new Date(session.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{session.time} ({session.duration})</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{session.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>{session.enrolledCount}/{session.maxParticipants} enrolled</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Enrollment</span>
          <span className="font-medium">{Math.round((session.enrolledCount / session.maxParticipants) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full" 
            style={{ width: `${(session.enrolledCount / session.maxParticipants) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{session.category}</span>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View Details
        </button>
      </div>
    </div>
  );
};

export default TrainingSessionCard;