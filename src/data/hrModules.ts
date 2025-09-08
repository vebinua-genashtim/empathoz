import { HRModule } from '../types';

export const hrModules: HRModule[] = [
  {
    id: 'ats',
    name: 'Applicant Tracking System',
    description: 'Manage recruitment pipeline, job postings, and candidate applications',
    icon: 'Users',
    status: 'development',
    route: '/apps/recruitment',
    category: 'recruitment',
    lastUpdated: '2025-01-15',
    userRole: ['HR', 'Recruiter', 'Manager'],
    isEnabled: true
  },
  {
    id: 'onboarding',
    name: 'Employee Onboarding',
    description: 'Streamline new hire processes, documentation, and orientation',
    icon: 'UserPlus',
    status: 'development',
    route: '/apps/database/onboarding',
    category: 'database',
    lastUpdated: '2025-01-11',
    userRole: ['HR', 'Manager'],
    isEnabled: true
  },
  {
    id: 'hrdb',
    name: 'HR Database',
    description: 'Centralized employee records, payroll, and HR data management',
    icon: 'Database',
    status: 'development',
    route: '/apps/database',
    category: 'database',
    lastUpdated: '2025-01-13',
    userRole: ['HR', 'Admin'],
    isEnabled: true
  },
  {
    id: 'tlms',
    name: 'Training & Learning Management System',
    description: 'Unified platform for courses, training sessions, and skill development',
    icon: 'BookOpen',
    status: 'development',
    route: '/apps/tlms',
    category: 'learning',
    lastUpdated: '2025-01-14',
    userRole: ['HR', 'Manager', 'Employee', 'Trainer'],
    isEnabled: true
  },
  {
    id: 'ees',
    name: 'Employee Engagement Survey',
    description: 'Conduct surveys, analyze engagement metrics, and generate insights',
    icon: 'BarChart3',
    status: 'existing',
    route: '/apps/engagement',
    category: 'engagement',
    lastUpdated: '2025-01-10',
    userRole: ['HR', 'Manager'],
    isEnabled: true
  },
  {
    id: 'claims',
    name: 'Claims Management',
    description: 'Process employee claims, reimbursements, and expense management',
    icon: 'FileText',
    status: 'development',
    route: '/apps/database/claims',
    category: 'database',
    lastUpdated: '2025-01-12',
    userRole: ['HR', 'Finance', 'Employee'],
    isEnabled: true
  },
  {
    id: 'core',
    name: 'Internal Communications',
    description: 'Company news, updates, announcements, and internal SharePoint',
    icon: 'MessageSquare',
    status: 'active',
    route: '/apps/communications',
    category: 'communication',
    lastUpdated: '2025-01-15',
    userRole: ['All'],
    isEnabled: true
  },
  {
    id: 'leave',
    name: 'Leave Management',
    description: 'Manage employee leave requests, approvals, and leave balances',
    icon: 'Calendar',
    status: 'development',
    route: '/apps/leave',
    category: 'database',
    lastUpdated: '2025-01-15',
    userRole: ['HR', 'Manager', 'Employee'],
    isEnabled: true
  },
];