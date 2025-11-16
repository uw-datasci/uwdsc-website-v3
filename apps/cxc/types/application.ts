export interface ApplicationFormValues {
  first_name: string;
  last_name: string;
  email: string;
  dob: string;
}

export type QuestionType = "text" | "textarea";

export interface Question {
  id: string;
  question: string;
  required: boolean;
  order: number;
  maxLength: number;
  placeholder?: string;
  helpText?: string;
}

export interface AppInfo {
  appReleaseDate: Date;
  appDeadline: Date;
  questions: Question[];
}
