// Application-specific actions that appear in the "Active App Actions" menu
export interface AppAction {
  id: string;
  name: string;
  icon: string;
  route: string;
  description?: string;
}

export interface AppActionsConfig {
  [moduleId: string]: AppAction[];
}

export const appActions: AppActionsConfig = {
  ats: [
    {
      id: 'ats-add-candidate',
      name: 'Add Candidate',
      icon: 'UserPlus',
      route: 'ats-add-candidate',
      description: 'Add a new candidate to the system'
    },
    {
      id: 'ats-manage-departments',
      name: 'Manage Departments',
      icon: 'Building2',
      route: 'ats-manage-departments',
      description: 'Configure departments and organizational structure'
    },
    {
      id: 'ats-advanced-export',
      name: 'Advanced Export',
      icon: 'Download',
      route: 'ats-advanced-export',
      description: 'Export candidate data with advanced filtering'
    }
  ],
  tlms: [
    {
      id: 'tlms-account-settings',
      name: 'Account Settings',
      icon: 'Settings',
      route: 'tlms-account-settings',
      description: 'Manage user accounts and permissions'
    },
    {
      id: 'tlms-second-manager',
      name: 'Second Manager Settings',
      icon: 'Users',
      route: 'tlms-second-manager',
      description: 'Configure secondary manager assignments'
    },
    {
      id: 'tlms-course-analytics',
      name: 'Course Analytics',
      icon: 'BarChart3',
      route: 'tlms-course-analytics',
      description: 'View training completion and engagement metrics'
    },
    {
      id: 'tlms-learning-request',
      name: 'Learning Request',
      icon: 'Calendar',
      route: 'tlms-learning-request',
      description: 'Submit a learning request'
    }
  ],
  ees: [
    {
      id: 'ees-survey-builder',
      name: 'Survey Builder',
      icon: 'Edit',
      route: 'ees-survey-builder',
      description: 'Create and customize engagement surveys'
    },
    {
      id: 'ees-analytics-dashboard',
      name: 'Analytics Dashboard',
      icon: 'TrendingUp',
      route: 'ees-analytics-dashboard',
      description: 'View engagement trends and insights'
    },
    {
      id: 'ees-email-campaigns',
      name: 'Email Campaigns',
      icon: 'Mail',
      route: 'ees-email-campaigns',
      description: 'Manage survey invitation campaigns'
    }
  ],
  hrdb: [
    {
      id: 'hrdb-add-employee',
      name: 'Add Employee',
      icon: 'UserPlus',
      route: 'hrdb-add-employee',
      description: 'Add a new employee to the database'
    },
    {
      id: 'hrdb-bulk-import',
      name: 'Bulk Import',
      icon: 'Upload',
      route: 'hrdb-bulk-import',
      description: 'Import multiple employee records'
    },
    {
      id: 'hrdb-file-access-control',
      name: 'File Access Control',
      icon: 'Shield',
      route: 'hrdb-file-access-control',
      description: 'Manage document access permissions'
    },
    {
      id: 'hrdb-advanced-export',
      name: 'Advanced Export',
      icon: 'Download',
      route: 'hrdb-advanced-export',
      description: 'Export employee data with advanced filtering'
    }
  ],
  claims: [
    {
      id: 'claims-submit-claim',
      name: 'Submit Claim',
      icon: 'Plus',
      route: 'claims-submit-claim',
      description: 'Submit a new expense claim'
    },
    {
      id: 'claims-approval-dashboard',
      name: 'Approval Dashboard',
      icon: 'CheckCircle',
      route: 'claims-approval-dashboard',
      description: 'Review and approve pending claims'
    },
    {
      id: 'claims-workflow-rules',
      name: 'Workflow Rules',
      icon: 'Settings',
      route: 'claims-workflow-rules',
      description: 'Configure approval workflow rules'
    }
  ],
  leave: [
    {
      id: 'leave-new-request',
      name: 'New Leave Request',
      icon: 'Plus',
      route: 'leave-new-request',
      description: 'Submit a new leave request'
    },
    {
      id: 'leave-approval-dashboard',
      name: 'Approval Dashboard',
      icon: 'CheckCircle',
      route: 'leave-approval-dashboard',
      description: 'Review and approve leave requests'
    },
    {
      id: 'leave-configuration',
      name: 'Leave Configuration',
      icon: 'Settings',
      route: 'leave-configuration',
      description: 'Configure leave policies and balances'
    },
    {
      id: 'leave-calendar-view',
      name: 'Calendar View',
      icon: 'Calendar',
      route: 'leave-calendar-view',
      description: 'View leave requests in calendar format'
    }
  ],
  onboarding: [
    {
      id: 'onboarding-add-hire',
      name: 'Add New Hire',
      icon: 'UserPlus',
      route: 'onboarding-add-hire',
      description: 'Add a new hire to the onboarding process'
    },
    {
      id: 'onboarding-task-templates',
      name: 'Task Templates',
      icon: 'FileText',
      route: 'onboarding-task-templates',
      description: 'Manage onboarding task templates'
    },
    {
      id: 'onboarding-progress-tracking',
      name: 'Progress Tracking',
      icon: 'TrendingUp',
      route: 'onboarding-progress-tracking',
      description: 'Track onboarding progress across all new hires'
    }
  ],
  core: [
    {
      id: 'core-new-announcement',
      name: 'New Announcement',
      icon: 'Plus',
      route: 'core-new-announcement',
      description: 'Create a new company announcement'
    },
    {
      id: 'core-event-management',
      name: 'Event Management',
      icon: 'Calendar',
      route: 'core-event-management',
      description: 'Manage company events and activities'
    },
    {
      id: 'core-notification-center',
      name: 'Notification Center',
      icon: 'Bell',
      route: 'core-notification-center',
      description: 'Manage internal notifications'
    }
  ]
};

// Helper function to get actions for a specific module
export const getActionsForModule = (moduleId: string): AppAction[] => {
  return appActions[moduleId] || [];
};

// Helper function to check if a module has actions
export const hasActions = (moduleId: string): boolean => {
  return appActions[moduleId] && appActions[moduleId].length > 0;
};