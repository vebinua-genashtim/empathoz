export interface HRModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'active' | 'development' | 'existing';
  route: string;
  category: 'recruitment' | 'learning' | 'engagement' | 'database' | 'communication';
  lastUpdated?: string;
  userRole?: string[];
  isEnabled?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface NavigationItem {
  id: string;
  name: string;
  icon: string;
  route: string;
  hasSubmenu?: boolean;
  submenu?: NavigationItem[];
}

export interface UserRole {
  id: string;
  name: string;
  level: number;
  permissions: string[];
}

export interface FileAccessConfig {
  fileType: 'cv' | 'certifications' | 'portfolio' | 'profilePhoto';
  displayName: string;
  description: string;
  requiredRoleLevel: number;
  isEnabled: boolean;
  allowedRoles: string[];
}

export interface OnboardingTaskTemplate {
  id: string;
  name: string;
  description: string;
  applicablePositions: string[];
  applicableDepartments: string[];
  tasks: OnboardingTaskDefinition[];
  estimatedDuration: string;
  isDefault: boolean;
}

export interface OnboardingTaskDefinition {
  title: string;
  description: string;
  category: 'documentation' | 'training' | 'equipment' | 'access' | 'meeting';
  priority: 'low' | 'medium' | 'high';
  daysFromStart: number;
  assignedTo: string;
  isRequired: boolean;
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