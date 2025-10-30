export interface PersonalInfo {
  id?: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  summary?: string;
}

export interface WorkExperience {
  id?: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  order: number;
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  order: number;
}

// Using const object instead of enum (works better with Vite)
export const SkillCategory = {
  TECHNICAL: 'Technical',
  SOFT_SKILLS: 'Soft Skills',
  LANGUAGES: 'Languages',
  TOOLS: 'Tools',
  OTHER: 'Other',
} as const;

export type SkillCategory = typeof SkillCategory[keyof typeof SkillCategory];

export interface Skill {
  id?: string;
  name: string;
  category: SkillCategory;
  order: number;
}

export interface Resume {
  id?: string;
  title: string;
  personalInfo?: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AIEnhanceResponse {
  summary?: string;
  enhanced?: string;
  skills?: string[];
  suggestions?: string[];
  missingKeywords?: string[];
  matchScore?: number;
}
