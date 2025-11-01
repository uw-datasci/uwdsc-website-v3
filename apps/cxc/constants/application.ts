export const STEP_NAMES = ["CxC Application", "Personal Details", "Education"];

export const PERSONAL_FIELDS = ["first_name", "last_name", "email", "dob"];

export const EDUCATION_FIELDS = [
  "program",
  "year_of_study",
  "university_name",
  "university_name_other",
  "program_other",
];

export const BLANK_APPLICATION = {
  first_name: "",
  last_name: "",
  email: "",
  dob: "",
  program: "",
  year_of_study: "",
  university_name: "",
  university_name_other: "",
  program_other: "",
  status: "draft",
};

export const APPLICATION_RELEASE_DATE = new Date(); // Set actual release date here
export const APPLICATION_DEADLINE = new Date(); // Set actual deadline here
