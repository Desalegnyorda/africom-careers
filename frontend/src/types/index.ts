// Form data types
export interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  city: string;
  cv_file: File | null;
  vacancy_id: string;
  birthday?: string; // Format: DD-MM-YYYY
}

export interface Position {
  position_id: string;
  priority: number;
}

export interface Education {
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

export interface Experience {
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  responsibilities: string[];
}

export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  years_of_experience: number;
}

export type FormStep = 1 | 2 | 3 | 4 | 5 | 6;

export interface FormErrors {
  [key: string]: string | undefined;
}
