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
}

export interface ATSFilters {
  status: string;
  position: string;
  department: string;
  source: string;
}