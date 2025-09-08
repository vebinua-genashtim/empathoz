import React from 'react';
import { BookOpen, Users, Clock, Edit, Trash2, Award } from 'lucide-react';
import { Course } from '../../../types';

interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'Development':
        return 'from-blue-500 to-cyan-500';
      case 'Leadership':
        return 'from-purple-500 to-pink-500';
      case 'Data Science':
        return 'from-green-500 to-emerald-500';
      case 'Marketing':
        return 'from-orange-500 to-red-500';
      case 'Security':
        return 'from-red-500 to-pink-500';
      case 'Design':
        return 'from-indigo-500 to-purple-500';
      case 'Safety':
        return 'from-yellow-500 to-orange-500';
      case 'Compliance':
        return 'from-gray-500 to-slate-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getCategoryGradient(course.category)} flex items-center justify-center`}>
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(course)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(course.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
          {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
          {course.level}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>Instructor: {course.instructor}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{course.enrolledCount} enrolled</span>
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4" />
            <span>{course.completionRate}% completion</span>
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-blue-600 h-2 rounded-full" 
          style={{ width: `${course.completionRate}%` }}
        ></div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{course.category}</span>
        <span className="text-xs text-gray-500">
          Updated: {new Date(course.lastUpdated).toLocaleDateString()}
        </span>
      </div>

      {course.tags && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-1">
            {course.tags.split(',').slice(0, 3).map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {tag.trim()}
              </span>
            ))}
            {course.tags.split(',').length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{course.tags.split(',').length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCard;