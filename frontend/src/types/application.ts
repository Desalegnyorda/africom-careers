export enum ApplicationStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  SHORTLISTED = 'shortlisted',
  REJECTED = 'rejected'
}

export interface Skill {
  skill_id: string;
}

export interface Education {
  institution: string;
  education_level: string; 
  field_of_study: string;
  graduation_year: number; 
}

export interface Experience {
  company_name: string; 
  company_address: string; // Added field
  position: string;
  employment_status: 'full-time' | 'part-time' | 'contract'; 
  date_from: string; 
  date_to: string | null; 
  is_current: boolean;
}

export interface PositionPreference {
  position_id: string;
  priority: 1 | 2 | 3;
}

export interface GeneralAnswer {
  question_id: string; 
  answer_text: string; 
}

export interface ApplicationFormData {
  first_name: string;
  last_name: string;
  gender: 'Male' | 'Female' | ''; 
  email: string;
  phone: string;
  address: string;
  country: string;
  city: string;
  vacancy_id: string; 
  application_status?: ApplicationStatus;
  positions: PositionPreference[];
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  skills_description: string; 
  cv: File | null;
  general_answers: GeneralAnswer[];
}