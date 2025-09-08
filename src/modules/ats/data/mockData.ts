import { Candidate } from '../types';

export const mockCandidates: Candidate[] = [
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
    source: 'linkedin'
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
    source: 'website'
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
    source: 'referral'
  }
];