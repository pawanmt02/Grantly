export type EducationLevel = 'High School' | 'Undergraduate' | 'Graduate' | 'PhD';

export type Category = 
  | 'All'
  | 'STEM' 
  | 'Need-based' 
  | 'Merit' 
  | 'Underrepresented' 
  | 'Arts & Humanities' 
  | 'International' 
  | 'Leadership';

export type ApplicationStatus = 
  | 'considering' 
  | 'preparing' 
  | 'submitted' 
  | 'interview' 
  | 'awarded' 
  | 'rejected';

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  providerLogoBg: string;
  amount: number;
  formattedAmount: string;
  isRenewable: boolean;
  deadline: string; // YYYY-MM-DD
  category: Category;
  educationLevel: EducationLevel[];
  minGpa: number;
  eligibleMajors: string[];
  citizenship: string[];
  firstGenBonus: boolean;
  financialNeedBonus: boolean;
  description: string;
  requirements: {
    minGpa: number;
    essaysCount: number;
    recommendationsCount: number;
    requiresTranscript: boolean;
    requiresFafsaOrNeed: boolean;
    requiresPortfolio: boolean;
    interviewsCount: number;
  };
  essayPrompts: string[];
  acceptanceRate: string;
  effortEstimate: 'Low (1-2 hrs)' | 'Medium (3-5 hrs)' | 'High (6+ hrs)';
  websiteUrl: string;
  featured: boolean;
  tags: string[];
  location: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  educationLevel: EducationLevel;
  major: string;
  gpa: number;
  citizenship: string;
  firstGen: boolean;
  financialNeed: 'High' | 'Medium' | 'Low';
  targetFunding: number;
  country: string;
  graduationYear: number;
}

export interface MatchResult {
  score: number; // 0 - 100
  verdict: 'Exceptional Match' | 'Strong Match' | 'Good Match' | 'Reach / Partial';
  badgeColor: string;
  breakdown: {
    factor: string;
    matched: boolean;
    points: number;
    maxPoints: number;
    description: string;
  }[];
}

export interface TrackedApplication {
  id: string;
  scholarshipId: string;
  status: ApplicationStatus;
  notes: string;
  dateAdded: string;
  dateSubmitted?: string;
  awardedAmount?: number;
  checklist: {
    id: string;
    label: string;
    completed: boolean;
  }[];
}

export interface VaultDocument {
  id: string;
  title: string;
  type: 'transcript' | 'essay' | 'resume' | 'lor' | 'financial' | 'portfolio';
  fileName: string;
  lastUpdated: string;
  fileSize: string;
  wordCount?: number;
  status: 'ready' | 'draft' | 'needs_update';
  contentSnippet?: string;
}
