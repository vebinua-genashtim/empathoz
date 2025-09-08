import React, { useState } from 'react';
import { BookOpen, Users, Calendar, Award, Plus, Clock, CheckCircle, Search, Grid, List, Filter } from 'lucide-react';
import { Course, Certification } from '../../types';
import { dataService } from '../../services/dataService';
import CourseForm from './components/CourseForm';
import CourseCard from './components/CourseCard';
import CourseTable from './components/CourseTable';
import TrainingSessionForm from './components/TrainingSessionForm';
import TrainingSessionCard from './components/TrainingSessionCard';
import CertificationForm from './components/CertificationForm';
import CertificationCard from './components/CertificationCard';
import CertificationTable from './components/CertificationTable';

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

interface Certification {
  id: string;
  name: string;
  employeeName: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'expiring-soon';
}

const TrainingLearningManagementSystem: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(dataService.getCourses());
  const [certifications, setCertifications] = useState<Certification[]>(dataService.getCertifications());
  const [trainingSessions] = useState<TrainingSession[]>([
    {
      id: '1',
      title: 'Workplace Safety Training',
      description: 'Comprehensive safety training covering emergency procedures and workplace hazards.',
      instructor: 'John Safety',
      date: '2025-02-15',
      time: '09:00',
      duration: '4 hours',
      location: 'Conference Room A',
      maxParticipants: 25,
      enrolledCount: 18,
      status: 'scheduled',
      category: 'Safety',
      required: true
    },
    {
      id: '2',
      title: 'Leadership Development Workshop',
      description: 'Advanced leadership skills for managers and team leads.',
      instructor: 'Sarah Leader',
      date: '2025-02-20',
      time: '14:00',
      duration: '6 hours',
      location: 'Training Center',
      maxParticipants: 15,
      enrolledCount: 12,
      status: 'scheduled',
      category: 'Leadership',
      required: false
    },
    {
      id: '3',
      title: 'Data Privacy & GDPR Compliance',
      description: 'Understanding data protection regulations and compliance requirements.',
      instructor: 'Mike Compliance',
      date: '2025-01-25',
      time: '10:00',
      duration: '3 hours',
      location: 'Virtual',
      maxParticipants: 50,
      enrolledCount: 45,
      status: 'completed',
      category: 'Compliance',
      required: true
    }
  ]);

  const [activeTab, setActiveTab] = useState<'courses' | 'sessions' | 'certifications'>('courses');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [showCertificationForm, setShowCertificationForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | undefined>();
  const [editingSession, setEditingSession] = useState<TrainingSession | undefined>();
  const [editingCertification, setEditingCertification] = useState<Certification | undefined>();

  // Get unique categories from both courses and training sessions
  const courseCategories = [...new Set(courses.map(c => c.category))];
  const sessionCategories = [...new Set(trainingSessions.map(s => s.category))];
  const certificationCategories = [...new Set(certifications.map(c => c.category))];
  const allCategories = [...new Set([...courseCategories, ...sessionCategories, ...certificationCategories])];

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || course.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Filter training sessions
  const filteredSessions = trainingSessions.filter(session => {
    const matchesSearch = 
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.instructor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || session.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || session.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Filter certifications
  const filteredCertifications = certifications.filter(certification => {
    const matchesSearch = 
      certification.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certification.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certification.issuingBody.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || certification.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || certification.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Combined statistics
  const getStats = () => {
    const courseStats = dataService.getCourseStats();
    const certificationStats = dataService.getCertificationStats();
    const scheduledSessions = trainingSessions.filter(s => s.status === 'scheduled').length;
    const completedSessions = trainingSessions.filter(s => s.status === 'completed').length;
    const totalSessionEnrollments = trainingSessions.reduce((sum, session) => sum + session.enrolledCount, 0);
    
    return {
      totalCourses: courseStats.total,
      totalSessions: trainingSessions.length,
      scheduledSessions,
      completedSessions,
      totalEnrollments: courseStats.totalEnrollments + totalSessionEnrollments,
      activeCertifications: certificationStats.active,
      expiringSoonCertifications: certificationStats.expiringSoon,
      avgCompletion: courseStats.avgCompletion
    };
  };

  const stats = getStats();

  const handleSaveCourse = (courseData: Omit<Course, 'id' | 'enrolledCount' | 'completionRate' | 'createdDate' | 'lastUpdated'> | Course) => {
    if ('id' in courseData) {
      dataService.updateCourse(courseData.id, courseData);
    } else {
      dataService.createCourse(courseData);
    }
    setCourses(dataService.getCourses());
    setShowCourseForm(false);
    setEditingCourse(undefined);
  };

  const handleSaveSession = (sessionData: Omit<TrainingSession, 'id' | 'enrolledCount'> | TrainingSession) => {
    // In a real app, this would save to the backend
    console.log('Saving training session:', sessionData);
    setShowSessionForm(false);
    setEditingSession(undefined);
  };

  const handleSaveCertification = (certificationData: Omit<Certification, 'id' | 'status'> | Certification) => {
    if ('id' in certificationData) {
      dataService.updateCertification(certificationData.id, certificationData);
    } else {
      dataService.createCertification(certificationData);
    }
    setCertifications(dataService.getCertifications());
    setShowCertificationForm(false);
    setEditingCertification(undefined);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setShowCourseForm(true);
  };

  const handleEditSession = (session: TrainingSession) => {
    setEditingSession(session);
    setShowSessionForm(true);
  };

  const handleEditCertification = (certification: Certification) => {
    setEditingCertification(certification);
    setShowCertificationForm(true);
  };

  const handleDeleteCourse = (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      dataService.deleteCourse(id);
      setCourses(dataService.getCourses());
    }
  };

  const handleDeleteCertification = (id: string) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      dataService.deleteCertification(id);
      setCertifications(dataService.getCertifications());
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'scheduled': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      case 'archived':
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'expiring-soon': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Training & Learning Management System</h1>
            <p className="text-gray-600 mt-1">Manage courses, training sessions, and certifications in one place</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search courses and sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'cards' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            {/* Add buttons */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setEditingCourse(undefined);
                  setShowCourseForm(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Course
              </button>
              <button 
                onClick={() => {
                  setEditingSession(undefined);
                  setShowSessionForm(true);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Schedule Training
              </button>
              <button 
                onClick={() => {
                  setEditingCertification(undefined);
                  setShowCertificationForm(true);
                }}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Certification
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Training Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Enrollments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEnrollments}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {activeTab === 'certifications' ? 'Expiring Soon' : 'Active Certifications'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeTab === 'certifications' ? stats.expiringSoonCertifications : stats.activeCertifications}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('courses')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'courses'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Courses ({filteredCourses.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('sessions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'sessions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Training Sessions ({filteredSessions.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('certifications')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'certifications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Certifications ({certifications.length})
                </div>
              </button>
            </nav>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              {activeTab !== 'certifications' && (
                <div className="flex gap-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {allCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    {activeTab === 'courses' ? (
                      <>
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </>
                    ) : (
                      <>
                        <option value="scheduled">Scheduled</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </>
                    )}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'courses' && (
              <>
                {viewMode === 'cards' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCourses.map(course => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        onEdit={handleEditCourse}
                        onDelete={handleDeleteCourse}
                      />
                    ))}
                  </div>
                ) : (
                  <CourseTable
                    courses={filteredCourses}
                    onEdit={handleEditCourse}
                    onDelete={handleDeleteCourse}
                  />
                )}
                {filteredCourses.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                    <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                  </div>
                )}
              </>
            )}

            {activeTab === 'sessions' && (
              <>
                {viewMode === 'cards' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredSessions.map(session => (
                      <TrainingSessionCard
                        key={session.id}
                        session={session}
                        onEdit={handleEditSession}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredSessions.map(session => (
                      <div key={session.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{session.title}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                                {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                              </span>
                              {session.required && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Required
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{session.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                              <div>
                                <p><span className="font-medium">Instructor:</span> {session.instructor}</p>
                                <p><span className="font-medium">Date:</span> {new Date(session.date).toLocaleDateString()}</p>
                                <p><span className="font-medium">Time:</span> {session.time}</p>
                              </div>
                              <div>
                                <p><span className="font-medium">Duration:</span> {session.duration}</p>
                                <p><span className="font-medium">Location:</span> {session.location}</p>
                                <p><span className="font-medium">Enrolled:</span> {session.enrolledCount}/{session.maxParticipants}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {filteredSessions.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No training sessions found</h3>
                    <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                  </div>
                )}
              </>
            )}

            {activeTab === 'certifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certifications.map(cert => (
                  <div key={cert.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cert.status)}`}>
                        {cert.status === 'expiring-soon' ? 'Expiring Soon' : cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{cert.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{cert.employeeName}</p>
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center justify-between">
                        <span>Issued:</span>
                        <span>{new Date(cert.issueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Expires:</span>
                        <span>{new Date(cert.expiryDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Form Modal */}
      <CourseForm
        course={editingCourse}
        onSave={handleSaveCourse}
        onCancel={() => {
          setShowCourseForm(false);
          setEditingCourse(undefined);
        }}
        isOpen={showCourseForm}
      />

      {/* Training Session Form Modal */}
      <TrainingSessionForm
        trainingSession={editingSession}
        onSave={handleSaveSession}
        onCancel={() => {
          setShowSessionForm(false);
          setEditingSession(undefined);
        }}
        isOpen={showSessionForm}
      />

      {/* Certification Form Modal */}
      <CertificationForm
        certification={editingCertification}
        onSave={handleSaveCertification}
        onCancel={() => {
          setShowCertificationForm(false);
          setEditingCertification(undefined);
        }}
        isOpen={showCertificationForm}
      />
    </div>
  );
};

export default TrainingLearningManagementSystem;