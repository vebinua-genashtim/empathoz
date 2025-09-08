// Mock data and service functions for the HR Management Platform

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  experience: number;
  resumeUrl?: string;
  appliedDate: string;
  lastUpdated: string;
  notes?: string;
  salary?: number;
  source: 'website' | 'linkedin' | 'referral' | 'job-board' | 'other';
  city?: string;
  country?: string;
  cvUrl?: string;
  certificationsUrl?: string;
  portfolioUrl?: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'internship';
  hireDate: string;
  status: 'active' | 'inactive' | 'terminated';
  salary?: number;
  managerId?: string;
  city?: string;
  country?: string;
  cvUrl?: string;
  certificationsUrl?: string;
  portfolioUrl?: string;
  experience?: number;
  notes?: string;
  profilePhotoUrl?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  pronouns?: string;
  streetAddress?: string;
  stateProvince?: string;
  zipPostalCode?: string;
  emergencyContactName?: string;
  emergencyContactRelationship?: 'none' | 'spouse' | 'parent' | 'child' | 'sibling' | 'friend' | 'other';
  emergencyContactPhone?: string;
  workLocationType?: 'on-site' | 'remote' | 'hybrid';
  endDate?: string;
  terminationReason?: string;
  skills?: string[];
  education?: Array<{
    degree: string;
    major: string;
    institution: string;
    graduationYear: number;
  }>;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  enrolledCount: number;
  completionRate: number;
  status: 'active' | 'draft' | 'archived';
  createdDate: string;
  lastUpdated: string;
  learningObjectives: string;
  prerequisites?: string;
  tags?: string;
}

export interface NewHire {
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
  candidateId?: string;
  templateId?: string;
}

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  category: 'documentation' | 'training' | 'equipment' | 'access' | 'meeting';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  dueDate: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  isRequired: boolean;
}

export interface Claim {
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

export interface LeaveRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  leaveType: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity';
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  appliedDate: string;
  approvedBy?: string;
}

export interface LeaveBalance {
  employeeId: string;
  employeeName: string;
  vacation: { used: number; total: number };
  sick: { used: number; total: number };
  personal: { used: number; total: number };
  maternity: { used: number; total: number };
  paternity: { used: number; total: number };
}

export interface LeaveGuidelinesConfig {
  visible: boolean;
  title: string;
  content: string[];
}

export interface ApprovalRule {
  id: string;
  name: string;
  leaveTypes: string[];
  conditions: {
    minDays?: number;
    maxDays?: number;
    departments?: string[];
    positions?: string[];
  };
  approvalChain: ApprovalLevel[];
  isActive: boolean;
}

export interface ApprovalLevel {
  level: number;
  approverType: 'direct-manager' | 'department-head' | 'hr' | 'specific-person';
  approverName?: string;
  isRequired: boolean;
  canSkip: boolean;
}

export interface ApprovalStep {
  id: string;
  leaveRequestId: string;
  level: number;
  approverType: 'direct-manager' | 'department-head' | 'hr' | 'specific-person';
  approverName: string;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  isCurrentStep: boolean;
  canSkip: boolean;
  comments?: string;
  processedAt?: string;
  processedBy?: string;
}

export interface ApprovalWorkflow {
  id: string;
  leaveRequestId: string;
  ruleName: string;
  status: 'pending' | 'approved' | 'rejected';
  currentLevel: number;
  totalLevels: number;
  steps: ApprovalStep[];
  createdAt: string;
  completedAt?: string;
}

export interface ClaimApprovalRule {
  id: string;
  name: string;
  claimTypes: string[];
  conditions: {
    minAmount?: number;
    maxAmount?: number;
    departments?: string[];
    categories?: string[];
    urgencyLevels?: string[];
  };
  approvalChain: ClaimApprovalLevel[];
  isActive: boolean;
}

export interface ClaimApprovalLevel {
  level: number;
  approverType: 'direct-manager' | 'department-head' | 'finance' | 'hr' | 'specific-person';
  approverName?: string;
  isRequired: boolean;
  canSkip: boolean;
}

export interface ClaimApprovalStep {
  id: string;
  claimId: string;
  level: number;
  approverType: 'direct-manager' | 'department-head' | 'finance' | 'hr' | 'specific-person';
  approverName: string;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  isCurrentStep: boolean;
  canSkip: boolean;
  comments?: string;
  processedAt?: string;
  processedBy?: string;
}

export interface ClaimApprovalWorkflow {
  id: string;
  claimId: string;
  ruleName: string;
  status: 'pending' | 'approved' | 'rejected';
  currentLevel: number;
  totalLevels: number;
  steps: ClaimApprovalStep[];
  createdAt: string;
  completedAt?: string;
}

export interface Notification {
  id: string;
  type: 'approval-request' | 'approval-approved' | 'approval-rejected' | 'leave-approved' | 'leave-rejected' | 'reminder' | 'deadline' | 'system';
  title: string;
  message: string;
  recipient: string;
  isRead: boolean;
  actionRequired: boolean;
  actionUrl?: string;
  createdAt: string;
  category: 'approval' | 'leave' | 'reminder' | 'system';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface FileAccessConfig {
  fileType: 'cv' | 'certifications' | 'portfolio' | 'profilePhoto';
  displayName: string;
  description: string;
  requiredRoleLevel: number;
  isEnabled: boolean;
  allowedRoles: string[];
}

export interface UserRole {
  id: string;
  name: string;
  level: number;
  permissions: string[];
}

export interface LeaveAccrualConfig {
  vacation: { rate: number; frequency: 'monthly' | 'annually'; carryOverCap: number };
  sick: { rate: number; frequency: 'monthly' | 'annually'; carryOverCap: number };
  personal: { rate: number; frequency: 'monthly' | 'annually'; carryOverCap: number };
  maternity: { rate: number; frequency: 'monthly' | 'annually'; carryOverCap: number };
  paternity: { rate: number; frequency: 'monthly' | 'annually'; carryOverCap: number };
}

export interface AccrualHistoryEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity';
  accrualType: 'monthly' | 'annual';
  daysAccrued: number;
  previousBalance: number;
  newBalance: number;
  accrualDate: string;
}

export interface CarryOverHistoryEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity';
  year: number;
  carriedOverDays: number;
  lostDays: number;
  carryOverDate: string;
}

export interface Certification {
  id: string;
  name: string;
  employeeId: string;
  employeeName: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'expiring-soon';
  issuingBody: string;
  credentialId?: string;
  description?: string;
  attachmentUrl?: string;
  renewalRequired: boolean;
  category: string;
}

// Mock data
let mockCandidates: Candidate[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    position: 'Senior Frontend Developer',
    department: 'Engineering',
    status: 'interview',
    experience: 5,
    resumeUrl: 'https://example.com/resume1.pdf',
    appliedDate: '2025-01-10',
    lastUpdated: '2025-01-15',
    notes: 'Strong React and TypeScript skills. Great portfolio.',
    salary: 95000,
    source: 'linkedin',
    city: 'San Francisco',
    country: 'United States',
    cvUrl: 'https://example.com/documents/sarah-johnson-cv.pdf',
    certificationsUrl: 'https://example.com/documents/sarah-johnson-certifications.pdf',
    portfolioUrl: 'https://sarahjohnson.dev'
  },
  {
    id: '2',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@email.com',
    phone: '+1 (555) 987-6543',
    position: 'UX Designer',
    department: 'Design',
    status: 'screening',
    experience: 3,
    resumeUrl: 'https://example.com/resume2.pdf',
    appliedDate: '2025-01-12',
    lastUpdated: '2025-01-14',
    notes: 'Excellent design portfolio. Previous experience with B2B products.',
    salary: 75000,
    source: 'website',
    city: 'Seattle',
    country: 'United States'
  },
  {
    id: '3',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '+1 (555) 456-7890',
    position: 'Product Manager',
    department: 'Product',
    status: 'offer',
    experience: 7,
    resumeUrl: 'https://example.com/resume3.pdf',
    appliedDate: '2025-01-08',
    lastUpdated: '2025-01-15',
    notes: 'Strong background in fintech. Led multiple successful product launches.',
    salary: 120000,
    source: 'referral',
    city: 'Austin',
    country: 'United States'
  }
];

let mockEmployees: Employee[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@empathoz.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    position: 'Senior Software Engineer',
    hireDate: '2023-03-15',
    status: 'active',
    salary: 95000,
    managerId: '2',
    city: 'San Francisco',
    country: 'United States',
    experience: 8,
    cvUrl: 'https://example.com/documents/john-doe-cv.pdf',
    certificationsUrl: 'https://example.com/documents/john-doe-certifications.pdf',
    portfolioUrl: 'https://johndoe.dev',
    profilePhotoUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    notes: 'Excellent senior developer with strong leadership skills.'
  }
];

let mockCourses: Course[] = [
  {
    id: '1',
    title: 'React Development Fundamentals',
    description: 'Learn the basics of React development including components, state management, and hooks.',
    instructor: 'Sarah Tech',
    category: 'Development',
    level: 'Beginner',
    duration: '8 hours',
    enrolledCount: 24,
    completionRate: 85,
    status: 'active',
    createdDate: '2025-01-01',
    lastUpdated: '2025-01-15',
    learningObjectives: 'Build modern React applications with confidence',
    prerequisites: 'Basic JavaScript knowledge',
    tags: 'react,javascript,frontend'
  }
];

let mockNewHires: NewHire[] = [
  {
    id: 'NH001',
    firstName: 'Emma',
    lastName: 'Johnson',
    email: 'emma.johnson@empathoz.com',
    position: 'Software Engineer',
    department: 'Engineering',
    startDate: '2025-01-15',
    manager: 'Sarah Wilson',
    status: 'first-week',
    completedTasks: 8,
    totalTasks: 12,
    onboardingTasks: []
  }
];

let mockClaims: Claim[] = [
  {
    id: '1',
    employeeName: 'John Doe',
    employeeId: '1',
    claimType: 'travel',
    amount: 450.75,
    currency: 'USD',
    description: 'Business trip to client meeting in New York',
    submissionDate: '2025-01-10',
    status: 'pending',
    category: 'Business Travel',
    urgency: 'medium',
    receiptUrl: 'https://example.com/receipts/travel-receipt-001.pdf'
  }
];

let mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeName: 'John Doe',
    employeeId: '1',
    leaveType: 'vacation',
    startDate: '2025-02-15',
    endDate: '2025-02-19',
    days: 5,
    status: 'pending',
    reason: 'Family vacation to Hawaii',
    appliedDate: '2025-01-15'
  },
  {
    id: '2',
    employeeName: 'Jane Smith',
    employeeId: '2',
    leaveType: 'sick',
    startDate: '2025-01-20',
    endDate: '2025-01-22',
    days: 3,
    status: 'approved',
    reason: 'Medical appointment and recovery',
    appliedDate: '2025-01-18',
    approvedBy: 'HR Manager'
  }
];

let mockLeaveBalances: LeaveBalance[] = [
  {
    employeeId: '1',
    employeeName: 'John Doe',
    vacation: { used: 5, total: 20 },
    sick: { used: 2, total: 10 },
    personal: { used: 1, total: 5 },
    maternity: { used: 0, total: 90 },
    paternity: { used: 0, total: 14 }
  },
  {
    employeeId: '2',
    employeeName: 'Jane Smith',
    vacation: { used: 8, total: 20 },
    sick: { used: 3, total: 10 },
    personal: { used: 2, total: 5 },
    maternity: { used: 0, total: 90 },
    paternity: { used: 0, total: 14 }
  }
];

let mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'approval-request',
    title: 'Leave Request Approval Needed',
    message: 'John Doe has requested 5 days of vacation leave starting February 15th.',
    recipient: 'HR Manager',
    isRead: false,
    actionRequired: true,
    actionUrl: '/leave/approve/1',
    createdAt: '2025-01-15T10:30:00Z',
    category: 'approval',
    priority: 'medium'
  }
];

let mockDepartments: string[] = [
  'Engineering',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Design',
  'Product',
  'Operations',
  'Customer Support'
];

let mockApprovalRules: ApprovalRule[] = [
  {
    id: '1',
    name: 'Standard Vacation Approval',
    leaveTypes: ['vacation'],
    conditions: {
      minDays: 1,
      maxDays: 10
    },
    approvalChain: [
      {
        level: 1,
        approverType: 'direct-manager',
        isRequired: true,
        canSkip: false
      }
    ],
    isActive: true
  }
];

let mockApprovalSteps: ApprovalStep[] = [];
let mockApprovalWorkflows: ApprovalWorkflow[] = [];

let mockClaimApprovalRules: ClaimApprovalRule[] = [
  {
    id: '1',
    name: 'Standard Travel Claims',
    claimTypes: ['travel'],
    conditions: {
      minAmount: 0,
      maxAmount: 1000
    },
    approvalChain: [
      {
        level: 1,
        approverType: 'direct-manager',
        isRequired: true,
        canSkip: false
      },
      {
        level: 2,
        approverType: 'finance',
        approverName: 'Finance Manager',
        isRequired: true,
        canSkip: false
      }
    ],
    isActive: true
  }
];

let mockClaimApprovalSteps: ClaimApprovalStep[] = [];
let mockClaimApprovalWorkflows: ClaimApprovalWorkflow[] = [];

let mockLeaveAccrualConfig: LeaveAccrualConfig = {
  vacation: { rate: 1.67, frequency: 'monthly', carryOverCap: 5 },
  sick: { rate: 0.83, frequency: 'monthly', carryOverCap: 0 },
  personal: { rate: 0.42, frequency: 'monthly', carryOverCap: 2 },
  maternity: { rate: 90, frequency: 'annually', carryOverCap: 0 },
  paternity: { rate: 14, frequency: 'annually', carryOverCap: 0 }
};

let mockAccrualHistory: AccrualHistoryEntry[] = [];
let mockCarryOverHistory: CarryOverHistoryEntry[] = [];

let mockCertifications: Certification[] = [
  {
    id: '1',
    name: 'First Aid Certification',
    employeeId: '1',
    employeeName: 'John Doe',
    issueDate: '2024-06-15',
    expiryDate: '2026-06-15',
    status: 'active',
    issuingBody: 'American Red Cross',
    credentialId: 'ARC-FA-2024-001',
    description: 'Basic first aid and CPR certification',
    renewalRequired: true,
    category: 'Safety'
  },
  {
    id: '2',
    name: 'Fire Safety Training',
    employeeId: '2',
    employeeName: 'Jane Smith',
    issueDate: '2024-03-10',
    expiryDate: '2025-03-10',
    status: 'expiring-soon',
    issuingBody: 'National Fire Protection Association',
    credentialId: 'NFPA-FS-2024-002',
    description: 'Fire safety and emergency evacuation procedures',
    renewalRequired: true,
    category: 'Safety'
  },
  {
    id: '3',
    name: 'Data Protection Officer',
    employeeId: '3',
    employeeName: 'Mike Johnson',
    issueDate: '2023-09-20',
    expiryDate: '2024-09-20',
    status: 'expired',
    issuingBody: 'International Association of Privacy Professionals',
    credentialId: 'IAPP-DPO-2023-003',
    description: 'GDPR and data protection compliance certification',
    renewalRequired: true,
    category: 'Compliance'
  },
  {
    id: '4',
    name: 'AWS Solutions Architect',
    employeeId: '1',
    employeeName: 'John Doe',
    issueDate: '2024-08-15',
    expiryDate: '2027-08-15',
    status: 'active',
    issuingBody: 'Amazon Web Services',
    credentialId: 'AWS-SAA-2024-004',
    description: 'AWS cloud architecture and solutions design',
    renewalRequired: false,
    category: 'Technology'
  },
  {
    id: '5',
    name: 'Project Management Professional',
    employeeId: '4',
    employeeName: 'Sarah Wilson',
    issueDate: '2023-11-20',
    expiryDate: '2026-11-20',
    status: 'active',
    issuingBody: 'Project Management Institute',
    credentialId: 'PMI-PMP-2023-005',
    description: 'Professional project management certification',
    renewalRequired: true,
    category: 'Management'
  }
];

let mockLeaveGuidelinesConfig: LeaveGuidelinesConfig = {
  visible: true,
  title: 'Leave Request Guidelines',
  content: [
    '• Submit leave requests at least 2 weeks in advance',
    '• Provide detailed reason for leave request',
    '• Ensure adequate coverage for your responsibilities',
    '• Check your leave balance before submitting',
    '• Emergency leave can be submitted with shorter notice'
  ]
};

// Helper functions
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

const getLeaveRequests = (): LeaveRequest[] => {
  return [...mockLeaveRequests];
};

const getLeaveBalances = (): LeaveBalance[] => {
  return [...mockLeaveBalances];
};

const getLeaveGuidelinesConfig = (): LeaveGuidelinesConfig => {
  return { ...mockLeaveGuidelinesConfig };
};

const updateLeaveGuidelinesConfig = (config: LeaveGuidelinesConfig): void => {
  mockLeaveGuidelinesConfig = { ...config };
};

const createLeaveRequest = (requestData: Omit<LeaveRequest, 'id' | 'appliedDate' | 'approvedBy'>): string => {
  const newRequest: LeaveRequest = {
    ...requestData,
    id: generateId(),
    appliedDate: new Date().toISOString().split('T')[0]
  };
  mockLeaveRequests.push(newRequest);
  return newRequest.id;
};

const updateLeaveRequest = (id: string, requestData: Partial<LeaveRequest>): boolean => {
  const index = mockLeaveRequests.findIndex(r => r.id === id);
  if (index !== -1) {
    mockLeaveRequests[index] = { ...mockLeaveRequests[index], ...requestData };
    return true;
  }
  return false;
};

const deleteLeaveRequest = (id: string): boolean => {
  const index = mockLeaveRequests.findIndex(r => r.id === id);
  if (index !== -1) {
    mockLeaveRequests.splice(index, 1);
    return true;
  }
  return false;
};

const getLeaveAccrualConfig = (): LeaveAccrualConfig => {
  return { ...mockLeaveAccrualConfig };
};

const updateLeaveAccrualConfig = (config: LeaveAccrualConfig): void => {
  mockLeaveAccrualConfig = { ...config };
};

const getAccrualHistory = (): AccrualHistoryEntry[] => {
  return [...mockAccrualHistory];
};

const getCarryOverHistory = (): CarryOverHistoryEntry[] => {
  return [...mockCarryOverHistory];
};

const runMonthlyAccrual = (): AccrualHistoryEntry[] => {
  const entries: AccrualHistoryEntry[] = [];
  const today = new Date().toISOString().split('T')[0];
  
  mockLeaveBalances.forEach(balance => {
    Object.entries(mockLeaveAccrualConfig).forEach(([leaveType, config]) => {
      if (config.frequency === 'monthly') {
        const entry: AccrualHistoryEntry = {
          id: generateId(),
          employeeId: balance.employeeId,
          employeeName: balance.employeeName,
          leaveType: leaveType as any,
          accrualType: 'monthly',
          daysAccrued: config.rate,
          previousBalance: balance[leaveType as keyof typeof balance].total,
          newBalance: balance[leaveType as keyof typeof balance].total + config.rate,
          accrualDate: today
        };
        
        entries.push(entry);
        mockAccrualHistory.push(entry);
        
        // Update balance
        (balance[leaveType as keyof typeof balance] as any).total += config.rate;
      }
    });
  });
  
  return entries;
};

const runAnnualAccrual = (): AccrualHistoryEntry[] => {
  const entries: AccrualHistoryEntry[] = [];
  const today = new Date().toISOString().split('T')[0];
  
  mockLeaveBalances.forEach(balance => {
    Object.entries(mockLeaveAccrualConfig).forEach(([leaveType, config]) => {
      if (config.frequency === 'annually') {
        const entry: AccrualHistoryEntry = {
          id: generateId(),
          employeeId: balance.employeeId,
          employeeName: balance.employeeName,
          leaveType: leaveType as any,
          accrualType: 'annual',
          daysAccrued: config.rate,
          previousBalance: balance[leaveType as keyof typeof balance].total,
          newBalance: balance[leaveType as keyof typeof balance].total + config.rate,
          accrualDate: today
        };
        
        entries.push(entry);
        mockAccrualHistory.push(entry);
        
        // Update balance
        (balance[leaveType as keyof typeof balance] as any).total += config.rate;
      }
    });
  });
  
  return entries;
};

const runYearEndCarryOver = (): CarryOverHistoryEntry[] => {
  const entries: CarryOverHistoryEntry[] = [];
  const today = new Date().toISOString().split('T')[0];
  const currentYear = new Date().getFullYear();
  
  mockLeaveBalances.forEach(balance => {
    Object.entries(mockLeaveAccrualConfig).forEach(([leaveType, config]) => {
      const currentBalance = balance[leaveType as keyof typeof balance];
      const remainingDays = currentBalance.total - currentBalance.used;
      const carriedOverDays = Math.min(remainingDays, config.carryOverCap);
      const lostDays = remainingDays - carriedOverDays;
      
      const entry: CarryOverHistoryEntry = {
        id: generateId(),
        employeeId: balance.employeeId,
        employeeName: balance.employeeName,
        leaveType: leaveType as any,
        year: currentYear,
        carriedOverDays,
        lostDays,
        carryOverDate: today
      };
      
      entries.push(entry);
      mockCarryOverHistory.push(entry);
      
      // Reset balance for new year
      (currentBalance as any).total = carriedOverDays;
      (currentBalance as any).used = 0;
    });
  });
  
  return entries;
};

const updateLeaveBalance = (employeeId: string, leaveType: keyof Omit<LeaveBalance, 'employeeId' | 'employeeName'>, usedDays: number, totalDays: number): boolean => {
  const balance = mockLeaveBalances.find(b => b.employeeId === employeeId);
  if (balance) {
    balance[leaveType].used = usedDays;
    balance[leaveType].total = totalDays;
    return true;
  }
  return false;
};

const calculateCertificationStatus = (expiryDate: string): 'active' | 'expired' | 'expiring-soon' => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= 30) return 'expiring-soon';
  return 'active';
};

const getCertifications = (): Certification[] => {
  // Update status based on current date
  return mockCertifications.map(cert => ({
    ...cert,
    status: calculateCertificationStatus(cert.expiryDate)
  }));
};

const createCertification = (certificationData: Omit<Certification, 'id' | 'status'>): string => {
  const newCertification: Certification = {
    ...certificationData,
    id: generateId(),
    status: calculateCertificationStatus(certificationData.expiryDate)
  };
  mockCertifications.push(newCertification);
  return newCertification.id;
};

const updateCertification = (id: string, certificationData: Partial<Certification>): boolean => {
  const index = mockCertifications.findIndex(c => c.id === id);
  if (index !== -1) {
    const updatedCert = { ...mockCertifications[index], ...certificationData };
    if (certificationData.expiryDate) {
      updatedCert.status = calculateCertificationStatus(certificationData.expiryDate);
    }
    mockCertifications[index] = updatedCert;
    return true;
  }
  return false;
};

const deleteCertification = (id: string): boolean => {
  const index = mockCertifications.findIndex(c => c.id === id);
  if (index !== -1) {
    mockCertifications.splice(index, 1);
    return true;
  }
  return false;
};

const getCertificationStats = () => {
  const certifications = getCertifications();
  const total = certifications.length;
  const active = certifications.filter(c => c.status === 'active').length;
  const expiringSoon = certifications.filter(c => c.status === 'expiring-soon').length;
  const expired = certifications.filter(c => c.status === 'expired').length;
  const renewalRequired = certifications.filter(c => c.renewalRequired && c.status !== 'active').length;
  
  return { total, active, expiringSoon, expired, renewalRequired };
};

const getApprovalRules = (): ApprovalRule[] => {
  return [...mockApprovalRules];
};

const createApprovalRule = (ruleData: Omit<ApprovalRule, 'id'>): string => {
  const newRule: ApprovalRule = {
    ...ruleData,
    id: generateId()
  };
  mockApprovalRules.push(newRule);
  return newRule.id;
};

const updateApprovalRule = (id: string, ruleData: Partial<ApprovalRule>): boolean => {
  const index = mockApprovalRules.findIndex(r => r.id === id);
  if (index !== -1) {
    mockApprovalRules[index] = { ...mockApprovalRules[index], ...ruleData };
    return true;
  }
  return false;
};

const deleteApprovalRule = (id: string): boolean => {
  const index = mockApprovalRules.findIndex(r => r.id === id);
  if (index !== -1) {
    mockApprovalRules.splice(index, 1);
    return true;
  }
  return false;
};

const findApplicableApprovalRule = (leaveRequest: Partial<LeaveRequest>): ApprovalRule | null => {
  return mockApprovalRules.find(rule => {
    if (!rule.isActive) return false;
    if (!rule.leaveTypes.includes(leaveRequest.leaveType || '')) return false;
    
    if (rule.conditions.minDays && (leaveRequest.days || 0) < rule.conditions.minDays) return false;
    if (rule.conditions.maxDays && (leaveRequest.days || 0) > rule.conditions.maxDays) return false;
    
    return true;
  }) || null;
};

const getApprovalSteps = (): ApprovalStep[] => {
  return [...mockApprovalSteps];
};

const getApprovalWorkflows = (): ApprovalWorkflow[] => {
  return [...mockApprovalWorkflows];
};

const getPendingApprovalsByApprover = (approverName: string): ApprovalStep[] => {
  return mockApprovalSteps.filter(step => 
    step.approverName === approverName && 
    step.status === 'pending' && 
    step.isCurrentStep
  );
};

const processApprovalStep = (stepId: string, action: 'approve' | 'reject' | 'skip', comments: string, approverName: string): boolean => {
  const step = mockApprovalSteps.find(s => s.id === stepId);
  if (!step) return false;
  
  step.status = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'skipped';
  step.isCurrentStep = false;
  step.comments = comments;
  step.processedAt = new Date().toISOString();
  step.processedBy = approverName;
  
  return true;
};

const getClaimApprovalRules = (): ClaimApprovalRule[] => {
  return [...mockClaimApprovalRules];
};

const createClaimApprovalRule = (ruleData: Omit<ClaimApprovalRule, 'id'>): string => {
  const newRule: ClaimApprovalRule = {
    ...ruleData,
    id: generateId()
  };
  mockClaimApprovalRules.push(newRule);
  return newRule.id;
};

const updateClaimApprovalRule = (id: string, ruleData: Partial<ClaimApprovalRule>): boolean => {
  const index = mockClaimApprovalRules.findIndex(r => r.id === id);
  if (index !== -1) {
    mockClaimApprovalRules[index] = { ...mockClaimApprovalRules[index], ...ruleData };
    return true;
  }
  return false;
};

const deleteClaimApprovalRule = (id: string): boolean => {
  const index = mockClaimApprovalRules.findIndex(r => r.id === id);
  if (index !== -1) {
    mockClaimApprovalRules.splice(index, 1);
    return true;
  }
  return false;
};

const findApplicableClaimApprovalRule = (claim: Partial<Claim>): ClaimApprovalRule | null => {
  return mockClaimApprovalRules.find(rule => {
    if (!rule.isActive) return false;
    if (!rule.claimTypes.includes(claim.claimType || '')) return false;
    
    if (rule.conditions.minAmount && (claim.amount || 0) < rule.conditions.minAmount) return false;
    if (rule.conditions.maxAmount && (claim.amount || 0) > rule.conditions.maxAmount) return false;
    
    return true;
  }) || null;
};

const getClaimApprovalSteps = (): ClaimApprovalStep[] => {
  return [...mockClaimApprovalSteps];
};

const getClaimApprovalWorkflows = (): ClaimApprovalWorkflow[] => {
  return [...mockClaimApprovalWorkflows];
};

const getPendingClaimApprovalsByApprover = (approverName: string): ClaimApprovalStep[] => {
  return mockClaimApprovalSteps.filter(step => 
    step.approverName === approverName && 
    step.status === 'pending' && 
    step.isCurrentStep
  );
};

const processClaimApprovalStep = (stepId: string, action: 'approve' | 'reject' | 'skip', comments: string, approverName: string): boolean => {
  const step = mockClaimApprovalSteps.find(s => s.id === stepId);
  if (!step) return false;
  
  step.status = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'skipped';
  step.isCurrentStep = false;
  step.comments = comments;
  step.processedAt = new Date().toISOString();
  step.processedBy = approverName;
  
  return true;
};

// Main dataService object
export const dataService = {
  // Candidates
  getCandidates: () => [...mockCandidates],
  createCandidate: (candidateData: Omit<Candidate, 'id'>) => {
    const newCandidate: Candidate = {
      ...candidateData,
      id: generateId(),
      appliedDate: candidateData.appliedDate || new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    mockCandidates.push(newCandidate);
    return newCandidate.id;
  },
  updateCandidate: (id: string, candidateData: Partial<Candidate>) => {
    const index = mockCandidates.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCandidates[index] = { 
        ...mockCandidates[index], 
        ...candidateData,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      return true;
    }
    return false;
  },
  deleteCandidate: (id: string) => {
    const index = mockCandidates.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCandidates.splice(index, 1);
      return true;
    }
    return false;
  },
  getCandidateStats: () => {
    const total = mockCandidates.length;
    const applied = mockCandidates.filter(c => c.status === 'applied').length;
    const screening = mockCandidates.filter(c => c.status === 'screening').length;
    const interview = mockCandidates.filter(c => c.status === 'interview').length;
    const hired = mockCandidates.filter(c => c.status === 'hired').length;
    return { total, applied, screening, interview, hired };
  },

  // Employees
  getEmployees: () => [...mockEmployees],
  createEmployee: (employeeData: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: generateId()
    };
    mockEmployees.push(newEmployee);
    return newEmployee.id;
  },
  updateEmployee: (id: string, employeeData: Partial<Employee>) => {
    const index = mockEmployees.findIndex(e => e.id === id);
    if (index !== -1) {
      mockEmployees[index] = { ...mockEmployees[index], ...employeeData };
      return true;
    }
    return false;
  },
  deleteEmployee: (id: string) => {
    const index = mockEmployees.findIndex(e => e.id === id);
    if (index !== -1) {
      mockEmployees.splice(index, 1);
      return true;
    }
    return false;
  },
  getEmployeeStats: () => {
    const total = mockEmployees.length;
    const active = mockEmployees.filter(e => e.status === 'active').length;
    const inactive = mockEmployees.filter(e => e.status === 'inactive').length;
    return { total, active, inactive };
  },

  // Courses
  getCourses: () => [...mockCourses],
  createCourse: (courseData: Omit<Course, 'id' | 'enrolledCount' | 'completionRate' | 'createdDate' | 'lastUpdated'>) => {
    const newCourse: Course = {
      ...courseData,
      id: generateId(),
      enrolledCount: 0,
      completionRate: 0,
      createdDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    mockCourses.push(newCourse);
    return newCourse.id;
  },
  updateCourse: (id: string, courseData: Partial<Course>) => {
    const index = mockCourses.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCourses[index] = { 
        ...mockCourses[index], 
        ...courseData,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      return true;
    }
    return false;
  },
  deleteCourse: (id: string) => {
    const index = mockCourses.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCourses.splice(index, 1);
      return true;
    }
    return false;
  },
  getCourseStats: () => {
    const total = mockCourses.length;
    const active = mockCourses.filter(c => c.status === 'active').length;
    const totalEnrollments = mockCourses.reduce((sum, c) => sum + c.enrolledCount, 0);
    const avgCompletion = mockCourses.length > 0 
      ? Math.round(mockCourses.reduce((sum, c) => sum + c.completionRate, 0) / mockCourses.length)
      : 0;
    return { total, active, totalEnrollments, avgCompletion };
  },

  // New Hires
  getNewHires: () => [...mockNewHires],
  createNewHire: (newHireData: Omit<NewHire, 'id' | 'completedTasks' | 'totalTasks' | 'onboardingTasks'>) => {
    const newHire: NewHire = {
      ...newHireData,
      id: generateId(),
      completedTasks: 0,
      totalTasks: 12,
      onboardingTasks: []
    };
    mockNewHires.push(newHire);
    return newHire.id;
  },
  updateNewHire: (id: string, newHireData: Partial<NewHire>) => {
    const index = mockNewHires.findIndex(h => h.id === id);
    if (index !== -1) {
      mockNewHires[index] = { ...mockNewHires[index], ...newHireData };
      return true;
    }
    return false;
  },
  deleteNewHire: (id: string) => {
    const index = mockNewHires.findIndex(h => h.id === id);
    if (index !== -1) {
      mockNewHires.splice(index, 1);
      return true;
    }
    return false;
  },
  updateNewHireTasks: (id: string, tasks: OnboardingTask[]) => {
    const index = mockNewHires.findIndex(h => h.id === id);
    if (index !== -1) {
      mockNewHires[index].onboardingTasks = tasks;
      mockNewHires[index].totalTasks = tasks.length;
      mockNewHires[index].completedTasks = tasks.filter(t => t.status === 'completed').length;
      return true;
    }
    return false;
  },

  // Claims
  getClaims: () => [...mockClaims],
  createClaim: (claimData: Omit<Claim, 'id' | 'submissionDate' | 'approvedBy'>) => {
    const newClaim: Claim = {
      ...claimData,
      id: generateId(),
      submissionDate: new Date().toISOString().split('T')[0]
    };
    mockClaims.push(newClaim);
    return newClaim.id;
  },
  updateClaim: (id: string, claimData: Partial<Claim>) => {
    const index = mockClaims.findIndex(c => c.id === id);
    if (index !== -1) {
      mockClaims[index] = { ...mockClaims[index], ...claimData };
      return true;
    }
    return false;
  },
  deleteClaim: (id: string) => {
    const index = mockClaims.findIndex(c => c.id === id);
    if (index !== -1) {
      mockClaims.splice(index, 1);
      return true;
    }
    return false;
  },

  // Leave Management
  getLeaveRequests,
  getLeaveBalances,
  getLeaveGuidelinesConfig,
  updateLeaveGuidelinesConfig,
  createLeaveRequest,
  updateLeaveRequest,
  deleteLeaveRequest,
  getLeaveAccrualConfig,
  updateLeaveAccrualConfig,
  getAccrualHistory,
  getCarryOverHistory,
  runMonthlyAccrual,
  runAnnualAccrual,
  runYearEndCarryOver,
  updateLeaveBalance,

  // Approval Rules
  getApprovalRules,
  createApprovalRule,
  updateApprovalRule,
  deleteApprovalRule,
  findApplicableApprovalRule,
  getApprovalSteps,
  getApprovalWorkflows,
  getPendingApprovalsByApprover,
  processApprovalStep,

  // Claim Approval Rules
  getClaimApprovalRules,
  createClaimApprovalRule,
  updateClaimApprovalRule,
  deleteClaimApprovalRule,
  findApplicableClaimApprovalRule,
  getClaimApprovalSteps,
  getClaimApprovalWorkflows,
  getPendingClaimApprovalsByApprover,
  processClaimApprovalStep,

  // Departments
  getDepartments: () => [...mockDepartments],
  addDepartment: (name: string) => {
    if (!mockDepartments.includes(name)) {
      mockDepartments.push(name);
      return true;
    }
    return false;
  },
  updateDepartment: (oldName: string, newName: string) => {
    const index = mockDepartments.findIndex(d => d === oldName);
    if (index !== -1) {
      mockDepartments[index] = newName;
      return true;
    }
    return false;
  },
  deleteDepartment: (name: string) => {
    const index = mockDepartments.findIndex(d => d === name);
    if (index !== -1) {
      mockDepartments.splice(index, 1);
      return true;
    }
    return false;
  },
  getDepartmentStats: () => {
    const stats = mockDepartments.map(dept => ({
      department: dept,
      employeeCount: mockEmployees.filter(e => e.department === dept).length,
      candidateCount: mockCandidates.filter(c => c.department === dept).length
    }));
    return stats;
  },

  // Notifications
  getNotifications: (recipient: string) => {
    return mockNotifications.filter(n => n.recipient === recipient || n.recipient === 'All');
  },
  addNotification: (notificationData: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      isRead: false
    };
    mockNotifications.push(newNotification);
    return newNotification.id;
  },
  markNotificationAsRead: (id: string) => {
    const notification = mockNotifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
      return true;
    }
    return false;
  },
  markNotificationAsUnread: (id: string) => {
    const notification = mockNotifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = false;
      return true;
    }
    return false;
  },
  markAllNotificationsAsRead: (recipient: string) => {
    mockNotifications
      .filter(n => n.recipient === recipient || n.recipient === 'All')
      .forEach(n => n.isRead = true);
    return true;
  },
  deleteNotification: (id: string) => {
    const index = mockNotifications.findIndex(n => n.id === id);
    if (index !== -1) {
      mockNotifications.splice(index, 1);
      return true;
    }
    return false;
  },
  getUnreadNotificationCount: (recipient: string) => {
    return mockNotifications.filter(n => 
      (n.recipient === recipient || n.recipient === 'All') && !n.isRead
    ).length;
  },

  // Integration Flow Demo Data
  getIntegrationFlowCandidate: () => {
    return mockCandidates.find(c => c.status === 'offer') || null;
  },
  getIntegrationFlowNewHire: () => {
    return mockNewHires.find(h => h.candidateId) || null;
  },
  getIntegrationFlowEmployee: () => {
    return mockEmployees.find(e => e.id === 'integration-employee') || null;
  },
  createOnboardingRecordFromCandidate: (candidate: Candidate) => {
    const newHire: NewHire = {
      id: generateId(),
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      position: candidate.position,
      department: candidate.department,
      startDate: new Date().toISOString().split('T')[0],
      manager: 'Sarah Wilson',
      status: 'pre-boarding',
      completedTasks: 0,
      totalTasks: 12,
      onboardingTasks: [],
      candidateId: candidate.id
    };
    mockNewHires.push(newHire);
    return true;
  },
  completeOnboardingTasks: (newHireId: string) => {
    const newHire = mockNewHires.find(h => h.id === newHireId);
    if (newHire) {
      newHire.completedTasks = newHire.totalTasks;
      newHire.status = 'completed';
      return true;
    }
    return false;
  },
  createEmployeeFromNewHire: (newHire: NewHire) => {
    const newEmployee: Employee = {
      id: 'integration-employee',
      firstName: newHire.firstName,
      lastName: newHire.lastName,
      email: newHire.email,
      phone: '+1 (555) 123-4567',
      department: newHire.department,
      position: newHire.position,
      hireDate: newHire.startDate,
      status: 'active',
      salary: 85000,
      managerId: '2'
    };
    
    const existingIndex = mockEmployees.findIndex(e => e.id === 'integration-employee');
    if (existingIndex !== -1) {
      mockEmployees[existingIndex] = newEmployee;
    } else {
      mockEmployees.push(newEmployee);
    }
    return true;
  },
  enrollEmployeeInMandatoryTraining: (employeeId: string, department: string) => {
    // Mock enrollment logic
    return true;
  },
  resetMockData: () => {
    // Reset integration flow data
    mockCandidates = mockCandidates.map(c => 
      c.id === '3' ? { ...c, status: 'offer' } : c
    );
    mockNewHires = mockNewHires.filter(h => !h.candidateId);
    mockEmployees = mockEmployees.filter(e => e.id !== 'integration-employee');
  },

  // Utility functions
  checkForReminders: () => {
    // Mock reminder generation
    return [];
  },
  checkForUpcomingDeadlines: () => {
    // Mock deadline checking
    return [];
  },

  // Certifications
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
  getCertificationStats
};