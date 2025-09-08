import React, { useState } from 'react';
import { Plus, Search, Users, TrendingUp, Clock, CheckCircle, Grid, List, Settings, Briefcase } from 'lucide-react';
import { Candidate, dataService } from '../../services/dataService';
import CandidateForm from './components/CandidateForm';
import CandidateCard from './components/CandidateCard';
import CandidateTable from './components/CandidateTable';
import JobListings from './components/JobListings';
import DepartmentManager from './components/DepartmentManager';
import ATSAdvancedExportPage from './components/ATSAdvancedExportPage';

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  benefits?: string[];
  postedDate: string;
  applicationUrl: string;
  department: string;
  experience: string;
  remote: boolean;
  urgent: boolean;
}

interface ATSFilters {
  status: string;
  position: string;
  department: string;
  source: string;
}

const ApplicantTrackingSystem: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>(dataService.getCandidates());
  const [activeTab, setActiveTab] = useState<'candidates' | 'jobs'>('candidates');
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [filters, setFilters] = useState<ATSFilters>({
    status: 'all',
    position: 'all',
    department: 'all',
    source: 'all'
  });
  const [showForm, setShowForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | undefined>();
  const [showDepartmentManager, setShowDepartmentManager] = useState(false);
  const [jobSearchTerm, setJobSearchTerm] = useState('');
  const [jobLocationFilter, setJobLocationFilter] = useState('all');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [jobDepartmentFilter, setJobDepartmentFilter] = useState('all');
  const [jobViewMode, setJobViewMode] = useState<'cards' | 'list'>('cards');
  const [showAdvancedExport, setShowAdvancedExport] = useState(false);

  // Mock job data - In real implementation, this would be an actual API call
  const mockJobData: JobListing[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'full-time',
      salary: {
        min: 120000,
        max: 160000,
        currency: 'USD'
      },
      description: 'We are looking for a Senior Frontend Developer to join our dynamic team. You will be responsible for building user-facing features using React, TypeScript, and modern web technologies.',
      requirements: [
        '5+ years of React experience',
        'Strong TypeScript skills',
        'Experience with modern build tools',
        'Knowledge of responsive design'
      ],
      benefits: [
        'Health insurance',
        'Remote work options',
        '401k matching',
        'Professional development budget'
      ],
      postedDate: '2025-01-15',
      applicationUrl: 'https://techcorp.com/careers/senior-frontend-developer',
      department: 'Engineering',
      experience: '5+ years',
      remote: true,
      urgent: false
    },
    {
      id: '2',
      title: 'UX/UI Designer',
      company: 'Design Studio Pro',
      location: 'New York, NY',
      type: 'full-time',
      salary: {
        min: 80000,
        max: 110000,
        currency: 'USD'
      },
      description: 'Join our creative team as a UX/UI Designer. You will work on exciting projects for various clients, creating intuitive and beautiful user experiences.',
      requirements: [
        '3+ years of UX/UI design experience',
        'Proficiency in Figma and Adobe Creative Suite',
        'Strong portfolio demonstrating design thinking',
        'Experience with user research and testing'
      ],
      benefits: [
        'Creative workspace',
        'Flexible hours',
        'Health and dental insurance',
        'Annual design conference budget'
      ],
      postedDate: '2025-01-14',
      applicationUrl: 'https://designstudiopro.com/careers/ux-ui-designer',
      department: 'Design',
      experience: '3+ years',
      remote: false,
      urgent: true
    },
    {
      id: '3',
      title: 'Product Manager',
      company: 'InnovateTech',
      location: 'Austin, TX',
      type: 'full-time',
      salary: {
        min: 130000,
        max: 170000,
        currency: 'USD'
      },
      description: 'We are seeking an experienced Product Manager to lead our product development initiatives. You will work closely with engineering, design, and business teams.',
      requirements: [
        '5+ years of product management experience',
        'Experience with agile methodologies',
        'Strong analytical and communication skills',
        'Technical background preferred'
      ],
      benefits: [
        'Equity package',
        'Unlimited PTO',
        'Health insurance',
        'Remote work flexibility'
      ],
      postedDate: '2025-01-13',
      applicationUrl: 'https://innovatetech.com/careers/product-manager',
      department: 'Product',
      experience: '5+ years',
      remote: true,
      urgent: false
    },
    {
      id: '4',
      title: 'Marketing Specialist',
      company: 'GrowthCo',
      location: 'Remote',
      type: 'full-time',
      salary: {
        min: 60000,
        max: 80000,
        currency: 'USD'
      },
      description: 'Join our marketing team to drive growth through digital marketing campaigns, content creation, and data-driven strategies.',
      requirements: [
        '2+ years of digital marketing experience',
        'Experience with Google Analytics and social media platforms',
        'Strong writing and communication skills',
        'Knowledge of SEO and content marketing'
      ],
      benefits: [
        'Fully remote position',
        'Professional development opportunities',
        'Health insurance',
        'Flexible working hours'
      ],
      postedDate: '2025-01-12',
      applicationUrl: 'https://growthco.com/careers/marketing-specialist',
      department: 'Marketing',
      experience: '2+ years',
      remote: true,
      urgent: false
    },
    {
      id: '5',
      title: 'DevOps Engineer',
      company: 'CloudTech Solutions',
      location: 'Seattle, WA',
      type: 'contract',
      salary: {
        min: 90000,
        max: 120000,
        currency: 'USD'
      },
      description: 'We need a skilled DevOps Engineer to help us scale our cloud infrastructure and improve our deployment processes.',
      requirements: [
        '4+ years of DevOps experience',
        'Experience with AWS, Docker, and Kubernetes',
        'Knowledge of CI/CD pipelines',
        'Scripting skills (Python, Bash)'
      ],
      benefits: [
        'Competitive hourly rate',
        'Flexible contract terms',
        'Remote work options',
        'Opportunity for full-time conversion'
      ],
      postedDate: '2025-01-11',
      applicationUrl: 'https://cloudtechsolutions.com/careers/devops-engineer',
      department: 'Engineering',
      experience: '4+ years',
      remote: true,
      urgent: true
    },
    {
      id: '6',
      title: 'Data Scientist',
      company: 'DataInsights Corp',
      location: 'Boston, MA',
      type: 'full-time',
      salary: {
        min: 110000,
        max: 140000,
        currency: 'USD'
      },
      description: 'Join our data science team to build predictive models and extract insights from large datasets to drive business decisions.',
      requirements: [
        'PhD or Masters in Data Science, Statistics, or related field',
        'Experience with Python, R, and SQL',
        'Knowledge of machine learning algorithms',
        'Experience with big data technologies'
      ],
      benefits: [
        'Research and development opportunities',
        'Conference attendance budget',
        'Health and retirement benefits',
        'Collaborative work environment'
      ],
      postedDate: '2025-01-10',
      applicationUrl: 'https://datainsights.com/careers/data-scientist',
      department: 'Data Science',
      experience: '3+ years',
      remote: false,
      urgent: false
    }
  ];

  // Simulate API call for jobs
  React.useEffect(() => {
    const fetchJobs = async () => {
      setJobsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setJobs(mockJobData);
        setJobsError(null);
      } catch (err) {
        setJobsError('Failed to fetch job listings. Please try again later.');
      } finally {
        setJobsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Get unique values for filters
  const uniquePositions = [...new Set(candidates.map(c => c.position))];
  const uniqueDepartments = dataService.getDepartments();
  const uniqueSources = [...new Set(candidates.map(c => c.source))];

  // Filter candidates
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filters.status === 'all' || candidate.status === filters.status;
    const matchesPosition = filters.position === 'all' || candidate.position === filters.position;
    const matchesDepartment = filters.department === 'all' || candidate.department === filters.department;
    const matchesSource = filters.source === 'all' || candidate.source === filters.source;

    return matchesSearch && matchesStatus && matchesPosition && matchesDepartment && matchesSource;
  });

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(jobSearchTerm.toLowerCase());

    const matchesLocation = jobLocationFilter === 'all' || 
      job.location.toLowerCase().includes(jobLocationFilter.toLowerCase()) ||
      (jobLocationFilter === 'remote' && job.remote);

    const matchesType = jobTypeFilter === 'all' || job.type === jobTypeFilter;
    const matchesDepartment = jobDepartmentFilter === 'all' || job.department === jobDepartmentFilter;

    return matchesSearch && matchesLocation && matchesType && matchesDepartment;
  });

  // Statistics
  const stats = dataService.getCandidateStats();
  const jobStats = {
    total: jobs.length,
    remote: jobs.filter(job => job.remote).length,
    urgent: jobs.filter(job => job.urgent).length,
    companies: new Set(jobs.map(job => job.company)).size
  };

  const handleSaveCandidate = (candidateData: Omit<Candidate, 'id'> | Candidate) => {
    if ('id' in candidateData) {
      // Update existing candidate
      dataService.updateCandidate(candidateData.id, candidateData);
    } else {
      // Add new candidate
      dataService.createCandidate(candidateData);
    }
    setCandidates(dataService.getCandidates());
    setShowForm(false);
    setEditingCandidate(undefined);
  };

  const handleEditCandidate = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setShowForm(true);
  };

  const handleDeleteCandidate = (id: string) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      dataService.deleteCandidate(id);
      setCandidates(dataService.getCandidates());
    }
  };

  const handleHireCandidate = (candidate: Candidate) => {
    if (window.confirm(`Are you sure you want to hire ${candidate.firstName} ${candidate.lastName}?`)) {
      // Update candidate status to hired
      dataService.updateCandidate(candidate.id, { ...candidate, status: 'hired' });
      setCandidates(dataService.getCandidates());
      
      // Create onboarding record
      const success = dataService.createOnboardingRecordFromCandidate(candidate);
      if (success) {
        // Add notification
        dataService.addNotification({
          type: 'success',
          title: 'Candidate Hired Successfully',
          message: `${candidate.firstName} ${candidate.lastName} has been hired and moved to onboarding.`,
          timestamp: new Date().toISOString(),
          read: false
        });
      }
    }
  };

  const handleFilterChange = (key: keyof ATSFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleExportCandidates = () => {
    const csvContent = [
      ['First Name', 'Last Name', 'Email', 'Phone', 'Position', 'Department', 'Status', 'Source', 'Experience', 'Applied Date', 'Last Updated', 'Salary', 'Notes'].join(','),
      ...filteredCandidates.map(candidate => [
        `"${candidate.firstName}"`,
        `"${candidate.lastName}"`,
        candidate.email,
        candidate.phone || '',
        `"${candidate.position}"`,
        candidate.department,
        candidate.status,
        candidate.source,
        candidate.experience.toString(),
        candidate.appliedDate,
        candidate.lastUpdated,
        candidate.salary ? candidate.salary.toString() : '',
        candidate.notes ? `"${candidate.notes.replace(/"/g, '""')}"` : ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candidates-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleStatsCardClick = (filterType: 'status' | 'total', filterValue: string) => {
    if (filterType === 'total') {
      // Clear all filters to show all candidates
      setFilters({
        status: 'all',
        position: 'all',
        department: 'all',
        source: 'all'
      });
    } else if (filterType === 'status') {
      setFilters(prev => ({ ...prev, status: filterValue }));
    }
    // Clear search term when applying filter from stats
    setSearchTerm('');
  };

  const handleApply = (job: JobListing) => {
    window.open(job.applicationUrl, '_blank', 'noopener,noreferrer');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-green-100 text-green-800';
      case 'part-time': return 'bg-blue-100 text-blue-800';
      case 'contract': return 'bg-purple-100 text-purple-800';
      case 'internship': return 'bg-orange-100 text-orange-800';
      case 'remote': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatSalary = (salary: JobListing['salary']) => {
    if (!salary) return 'Salary not specified';
    return `${salary.currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  };

  const getDaysAgo = (dateString: string) => {
    const posted = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - posted.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  };

  // Get unique values for job filters
  const uniqueJobLocations = [...new Set(jobs.map(job => job.location))];
  const uniqueJobDepartments = [...new Set(jobs.map(job => job.department))];

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Applicant Tracking System</h1>
            <p className="text-gray-600 mt-1">Manage candidates, job listings, and recruitment pipeline</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder={activeTab === 'candidates' ? 'Search candidates...' : 'Search jobs...'}
                value={activeTab === 'candidates' ? searchTerm : jobSearchTerm}
                onChange={(e) => activeTab === 'candidates' ? setSearchTerm(e.target.value) : setJobSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => activeTab === 'candidates' ? setViewMode('cards') : setJobViewMode('cards')}
                className={`p-2 rounded-md transition-colors ${
                  (activeTab === 'candidates' ? viewMode : jobViewMode) === 'cards' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => activeTab === 'candidates' ? setViewMode('table') : setJobViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  (activeTab === 'candidates' ? viewMode : jobViewMode) === (activeTab === 'candidates' ? 'table' : 'list') ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            {activeTab === 'candidates' && (
              <>
                <button
                  onClick={() => {
                    setEditingCandidate(undefined);
                    setShowForm(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Candidate
                </button>
                
                <button
                  onClick={() => setShowDepartmentManager(true)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Manage Departments
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('candidates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'candidates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Candidates ({filteredCandidates.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'jobs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Job Listings ({filteredJobs.length})
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Stats */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {activeTab === 'candidates' ? (
            <>
          <div 
            onClick={() => handleStatsCardClick('total', 'all')}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 group-hover:text-blue-700">Total Candidates</p>
                <p className="text-2xl font-bold text-gray-900 group-hover:text-blue-800">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Users className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 group-hover:text-blue-600">
              Click to show all candidates
            </div>
          </div>
          <div 
            onClick={() => handleStatsCardClick('status', 'applied')}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-yellow-300 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 group-hover:text-yellow-700">New Applications</p>
                <p className="text-2xl font-bold text-gray-900 group-hover:text-yellow-800">{stats.applied}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                <TrendingUp className="w-6 h-6 text-yellow-600 group-hover:text-yellow-700" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 group-hover:text-yellow-600">
              Click to filter applied candidates
            </div>
          </div>
          <div 
            onClick={() => handleStatsCardClick('status', 'interview')}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-purple-300 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 group-hover:text-purple-700">In Interview</p>
                <p className="text-2xl font-bold text-gray-900 group-hover:text-purple-800">{stats.interview}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Clock className="w-6 h-6 text-purple-600 group-hover:text-purple-700" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 group-hover:text-purple-600">
              Click to filter interview candidates
            </div>
          </div>
          <div 
            onClick={() => handleStatsCardClick('status', 'hired')}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-green-300 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 group-hover:text-green-700">Hired</p>
                <p className="text-2xl font-bold text-gray-900 group-hover:text-green-800">{stats.hired}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <CheckCircle className="w-6 h-6 text-green-600 group-hover:text-green-700" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 group-hover:text-green-600">
              Click to filter hired candidates
            </div>
          </div>
            </>
          ) : (
            <>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{jobStats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Remote Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{jobStats.remote}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Urgent Positions</p>
                  <p className="text-2xl font-bold text-gray-900">{jobStats.urgent}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Companies</p>
                  <p className="text-2xl font-bold text-gray-900">{jobStats.companies}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
            </>
          )}
        </div>

        {/* Search and Filters */}
        {activeTab === 'candidates' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="applied">Applied</option>
                <option value="screening">Screening</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                {uniqueDepartments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <select
                value={filters.source}
                onChange={(e) => handleFilterChange('source', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Sources</option>
                {uniqueSources.map(source => (
                  <option key={source} value={source}>
                    {source.charAt(0).toUpperCase() + source.slice(1)}
                  </option>
                ))}
              </select>
              <button 
                onClick={handleExportCandidates}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                title="Export filtered candidates to CSV"
              >
                <TrendingUp className="w-4 h-4" />
                Export
              </button>
              <button 
                onClick={() => setShowAdvancedExport(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                title="Advanced export with detailed filtering"
              >
                <Settings className="w-4 h-4" />
                Advanced Export
              </button>
            </div>
          </div>
          </div>
        )}

        {/* Job Search and Filters */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search jobs, companies, or keywords..."
                    value={jobSearchTerm}
                    onChange={(e) => setJobSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={jobLocationFilter}
                  onChange={(e) => setJobLocationFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Locations</option>
                  <option value="remote">Remote</option>
                  {uniqueJobLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                <select
                  value={jobTypeFilter}
                  onChange={(e) => setJobTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
                <select
                  value={jobDepartmentFilter}
                  onChange={(e) => setJobDepartmentFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Departments</option>
                  {uniqueJobDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Content based on active tab */}
        {activeTab === 'candidates' ? (
          <>
            {/* Candidates Display */}
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCandidates.map(candidate => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    onEdit={handleEditCandidate}
                    onDelete={handleDeleteCandidate}
                    onHire={handleHireCandidate}
                  />
                ))}
              </div>
            ) : (
              <CandidateTable
                candidates={filteredCandidates}
                onEdit={handleEditCandidate}
                onDelete={handleDeleteCandidate}
                onHire={handleHireCandidate}
              />
            )}

            {filteredCandidates.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Job Listings Display */}
            {jobViewMode === 'cards' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredJobs.map(job => (
                  <div key={job.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                          {job.urgent && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                              Urgent
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{job.company}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {getDaysAgo(job.postedDate)}
                          </div>
                          {job.salary && (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              {formatSalary(job.salary)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(job.type)}`}>
                        {job.type.charAt(0).toUpperCase() + job.type.slice(1).replace('-', ' ')}
                      </span>
                      {job.remote && (
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                          Remote
                        </span>
                      )}
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                        {job.department}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{job.description}</p>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Key Requirements:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {job.requirements.slice(0, 3).map((req, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                            {req}
                          </li>
                        ))}
                        {job.requirements.length > 3 && (
                          <li className="text-xs text-gray-500">+{job.requirements.length - 3} more requirements</li>
                        )}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Experience: {job.experience}</span>
                      <button
                        onClick={() => handleApply(job)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        Apply Now
                        <Users className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {filteredJobs.map(job => (
                    <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                            {job.urgent && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                Urgent
                              </span>
                            )}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(job.type)}`}>
                              {job.type.charAt(0).toUpperCase() + job.type.slice(1).replace('-', ' ')}
                            </span>
                            {job.remote && (
                              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                                Remote
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">{job.company} • {job.department}</p>
                          <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {getDaysAgo(job.postedDate)}
                            </div>
                            {job.salary && (
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                {formatSalary(job.salary)}
                              </div>
                            )}
                            <span>Experience: {job.experience}</span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                        </div>
                        <button
                          onClick={() => handleApply(job)}
                          className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          Apply Now
                          <Users className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Candidate Form Modal */}
      <CandidateForm
        candidate={editingCandidate}
        onSave={handleSaveCandidate}
        onCancel={() => {
          setShowForm(false);
          setEditingCandidate(undefined);
        }}
        isOpen={showForm}
        isAdmin={true}
      />

      {/* Department Manager Modal */}
      <DepartmentManager
        isOpen={showDepartmentManager}
        onClose={() => setShowDepartmentManager(false)}
        onDepartmentsChange={() => {
          // Refresh candidates to reflect any department changes
          setCandidates(dataService.getCandidates());
        }}
      />

      {/* Advanced Export Page */}
      {showAdvancedExport && (
        <div className="fixed inset-0 bg-white z-50">
          <ATSAdvancedExportPage 
            onBack={() => setShowAdvancedExport(false)}
            candidates={candidates}
            departments={uniqueDepartments}
            positions={uniquePositions}
            sources={uniqueSources}
          />
        </div>
      )}
    </div>
  );
};

export default ApplicantTrackingSystem;