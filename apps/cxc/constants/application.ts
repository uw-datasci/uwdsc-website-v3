import { type ComboboxOption } from "@uwdsc/ui";

export const MOBILE_STEP_TO_PAGE_MAP = [0, 3, 6, 8, 9, 10];
export const NUMBER_MOBILE_PAGES = 11;

export const STEP_NAMES = [
  "Your Info",
  "Your Experience",
  "Application questions",
  "Teams",
  "MLH",
  "Submit!",
];

export const PORTFOLIO_FIELDS = [
  "prior_hackathon_experience",
  "resume",
  "github",
  "linkedin",
  "other_link",
];

export const EDUCATION_FIELDS = [
  "program",
  "year_of_study",
  "university_name",
  "university_name_other",
  "program_other",
];

export const GRADUATION_YEARS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "5th Year+",
  "Masters",
  "PhD",
];

export const PROGRAM_OPTIONS: ComboboxOption[] = [
  { value: "Computer Science", label: "Computer Science" },
  { value: "Data Science", label: "Data Science" },
  { value: "Mathematics", label: "Mathematics" },
  { value: "Software Engineering", label: "Software Engineering" },
  { value: "Electrical Engineering", label: "Electrical Engineering" },
  { value: "Mechanical Engineering", label: "Mechanical Engineering" },
  { value: "Systems Design Engineering", label: "Systems Design Engineering" },
  { value: "Biomedical Engineering", label: "Biomedical Engineering" },
  { value: "Engineering", label: "Engineering" },
  { value: "Sciences", label: "Sciences" },
  { value: "Arts", label: "Arts" },
  { value: "Business", label: "Business" },
  { value: "Health/Life Sciences", label: "Health/Life Sciences" },
  { value: "Other", label: "Other" },
];

export const UNIVERSITY_OPTIONS: ComboboxOption[] = [
  { value: "University of Waterloo", label: "University of Waterloo" },
  {
    value: "University of Toronto St. George",
    label: "University of Toronto St. George",
  },
  {
    value: "University of Toronto Scarborough",
    label: "University of Toronto Scarborough",
  },
  {
    value: "University of Toronto Mississauga",
    label: "University of Toronto Mississauga",
  },
  { value: "York University", label: "York University" },
  { value: "Western University", label: "Western University" },
  {
    value: "University of British Columbia",
    label: "University of British Columbia",
  },
  {
    value: "Toronto Metropolitan University",
    label: "Toronto Metropolitan University",
  },
  {
    value: "University of Western Ontario",
    label: "University of Western Ontario",
  },
  { value: "McMaster University", label: "McMaster University" },
  { value: "Queen's University", label: "Queen's University" },
  { value: "Carleton University", label: "Carleton University" },
  { value: "McGill University", label: "McGill University" },
  { value: "Other", label: "Other" },
];

export const BLANK_APPLICATION = {
  first_name: "",
  last_name: "",
  email: "",
  prior_hackathon_experience: [],
  resume: null,
  github: "",
  linkedin: "",
  other_link: "",
  program: "",
  year_of_study: "",
  university_name: "",
  university_name_other: "",
  program_other: "",
  status: "draft",
};

export const APPLICATION_RELEASE_DATE = new Date("2026-01-02T08:00:00");
export const APPLICATION_DEADLINE = new Date("2027-12-31T23:59:59");
export const RSVP_DEADLINE = new Date("2026-01-21T23:59:59");

// field names
export const CONTACT_INFO_FIELDS = {
  name: "name",
  email: "email",
  phone: "phone",
  discord: "discord",
} as const;

export const OPTIONAL_ABOUT_YOU_FIELDS = {
  tshirt_size: "tshirt_size",
  dietary_restrictions: "dietary_restrictions",
  dietary_restrictions_other: "dietary_restrictions_other",
  age: "age",
  country_of_residence: "country_of_residence",
  country_of_residence_other: "country_of_residence_other",
  gender: "gender",
  ethnicity: "ethnicity",
  ethnicity_other: "ethnicity_other",
} as const;

export const UNIVERSITY_INFO_FIELDS = {
  university_name: "university_name",
  university_name_other: "university_name_other",
  program: "program",
  program_other: "program_other",
  year_of_study: "year_of_study",
} as const;

export const PRIOR_HACK_EXP_FIELDS = {
  prior_hackathon_experience: "prior_hackathon_experience",
  hackathons_attended: "hackathons_attended",
} as const;

export const LINKS_FIELDS = {
  github: "github",
  linkedin: "linkedin",
  website_url: "website_url",
  other_link: "other_link",
  resume: "resume",
} as const;

export const APP_Q_FIELDS = {
  cxc_q1: "cxc_q1",
  cxc_q2: "cxc_q2",
} as const;

export const MLH_FIELDS = {
  mlh_agreed_code_of_conduct: "mlh_agreed_code_of_conduct",
  mlh_authorize_info_sharing: "mlh_authorize_info_sharing",
  mlh_email_opt_in: "mlh_email_opt_in",
} as const;

// personal
export const TSHIRT_OPTIONS = ["S", "M", "L", "XL"];

export const DIETARY_OPTIONS = [
  "None",
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Halal",
  "Kosher",
  "Other",
];

export const GENDERS = [
  "Male",
  "Female",
  "Non-Binary",
  "Other",
  "Prefer not to say",
];

export const ETHNICITIES = [
  "Asian Indian",
  "Black or African",
  "Chinese",
  "Filipino",
  "Guamanian or Chamorro",
  "Hispanic / Latino / Spanish Origin",
  "Japanese",
  "Korean",
  "Middle Eastern",
  "Native American or Alaskan Native",
  "Native Hawaiian",
  "Samoan",
  "Vietnamese",
  "White",
  "Other Asian (Thai, Cambodian, etc)",
  "Other Pacific Islander",
  "Other (Please Specify)",
  "Prefer Not to Answer",
];

export const ETHNICITY_OTHER_LABEL = "Other (Please Specify)";

export const COUNTRY_OPTIONS: ComboboxOption[] = [
  { value: "Canada", label: "Canada" },
  { value: "Afghanistan", label: "Afghanistan" },
  { value: "Åland Islands", label: "Åland Islands" },
  { value: "Albania", label: "Albania" },
  { value: "Algeria", label: "Algeria" },
  { value: "American Samoa", label: "American Samoa" },
  { value: "Andorra", label: "Andorra" },
  { value: "Angola", label: "Angola" },
  { value: "Anguilla", label: "Anguilla" },
  { value: "Antarctica", label: "Antarctica" },
  { value: "Antigua and Barbuda", label: "Antigua and Barbuda" },
  { value: "Argentina", label: "Argentina" },
  { value: "Armenia", label: "Armenia" },
  { value: "Aruba", label: "Aruba" },
  { value: "Australia", label: "Australia" },
  { value: "Austria", label: "Austria" },
  { value: "Azerbaijan", label: "Azerbaijan" },

  { value: "Bahamas", label: "Bahamas" },
  { value: "Bahrain", label: "Bahrain" },
  { value: "Bangladesh", label: "Bangladesh" },
  { value: "Barbados", label: "Barbados" },
  { value: "Belarus", label: "Belarus" },
  { value: "Belgium", label: "Belgium" },
  { value: "Belize", label: "Belize" },
  { value: "Benin", label: "Benin" },
  { value: "Bermuda", label: "Bermuda" },
  { value: "Bhutan", label: "Bhutan" },
  {
    value: "Bolivia (Plurinational State of)",
    label: "Bolivia (Plurinational State of)",
  },
  {
    value: "Bonaire, Sint Eustatius and Saba",
    label: "Bonaire, Sint Eustatius and Saba",
  },
  { value: "Bosnia and Herzegovina", label: "Bosnia and Herzegovina" },
  { value: "Botswana", label: "Botswana" },
  { value: "Bouvet Island", label: "Bouvet Island" },
  { value: "Brazil", label: "Brazil" },
  {
    value: "British Indian Ocean Territory",
    label: "British Indian Ocean Territory",
  },
  { value: "Brunei Darussalam", label: "Brunei Darussalam" },
  { value: "Bulgaria", label: "Bulgaria" },
  { value: "Burkina Faso", label: "Burkina Faso" },
  { value: "Burundi", label: "Burundi" },

  { value: "Cabo Verde", label: "Cabo Verde" },
  { value: "Cambodia", label: "Cambodia" },
  { value: "Cameroon", label: "Cameroon" },
  { value: "Cayman Islands", label: "Cayman Islands" },
  { value: "Central African Republic", label: "Central African Republic" },
  { value: "Chad", label: "Chad" },
  { value: "Chile", label: "Chile" },
  { value: "China", label: "China" },
  { value: "Christmas Island", label: "Christmas Island" },
  { value: "Cocos (Keeling) Islands", label: "Cocos (Keeling) Islands" },
  { value: "Colombia", label: "Colombia" },
  { value: "Comoros", label: "Comoros" },
  { value: "Congo", label: "Congo" },
  {
    value: "Congo, Democratic Republic of the",
    label: "Congo, Democratic Republic of the",
  },
  { value: "Cook Islands", label: "Cook Islands" },
  { value: "Costa Rica", label: "Costa Rica" },
  { value: "Côte d'Ivoire", label: "Côte d'Ivoire" },
  { value: "Croatia", label: "Croatia" },
  { value: "Cuba", label: "Cuba" },
  { value: "Curaçao", label: "Curaçao" },
  { value: "Cyprus", label: "Cyprus" },
  { value: "Czechia", label: "Czechia" },

  { value: "Denmark", label: "Denmark" },
  { value: "Djibouti", label: "Djibouti" },
  { value: "Dominica", label: "Dominica" },
  { value: "Dominican Republic", label: "Dominican Republic" },

  { value: "Ecuador", label: "Ecuador" },
  { value: "Egypt", label: "Egypt" },
  { value: "El Salvador", label: "El Salvador" },
  { value: "Equatorial Guinea", label: "Equatorial Guinea" },
  { value: "Eritrea", label: "Eritrea" },
  { value: "Estonia", label: "Estonia" },
  { value: "Eswatini", label: "Eswatini" },
  { value: "Ethiopia", label: "Ethiopia" },

  {
    value: "Falkland Islands (Malvinas)",
    label: "Falkland Islands (Malvinas)",
  },
  { value: "Faroe Islands", label: "Faroe Islands" },
  { value: "Fiji", label: "Fiji" },
  { value: "Finland", label: "Finland" },
  { value: "France", label: "France" },
  { value: "French Guiana", label: "French Guiana" },
  { value: "French Polynesia", label: "French Polynesia" },
  {
    value: "French Southern Territories",
    label: "French Southern Territories",
  },

  { value: "Gabon", label: "Gabon" },
  { value: "Gambia", label: "Gambia" },
  { value: "Georgia", label: "Georgia" },
  { value: "Germany", label: "Germany" },
  { value: "Ghana", label: "Ghana" },
  { value: "Gibraltar", label: "Gibraltar" },
  { value: "Greece", label: "Greece" },
  { value: "Greenland", label: "Greenland" },
  { value: "Grenada", label: "Grenada" },
  { value: "Guadeloupe", label: "Guadeloupe" },
  { value: "Guam", label: "Guam" },
  { value: "Guatemala", label: "Guatemala" },
  { value: "Guernsey", label: "Guernsey" },
  { value: "Guinea", label: "Guinea" },
  { value: "Guinea-Bissau", label: "Guinea-Bissau" },
  { value: "Guyana", label: "Guyana" },

  { value: "Haiti", label: "Haiti" },
  {
    value: "Heard Island and McDonald Islands",
    label: "Heard Island and McDonald Islands",
  },
  { value: "Holy See", label: "Holy See" },
  { value: "Honduras", label: "Honduras" },
  { value: "Hong Kong", label: "Hong Kong" },
  { value: "Hungary", label: "Hungary" },

  { value: "Iceland", label: "Iceland" },
  { value: "India", label: "India" },
  { value: "Indonesia", label: "Indonesia" },
  { value: "Iran, Islamic Republic of", label: "Iran, Islamic Republic of" },
  { value: "Iraq", label: "Iraq" },
  { value: "Ireland", label: "Ireland" },
  { value: "Isle of Man", label: "Isle of Man" },
  { value: "Israel", label: "Israel" },
  { value: "Italy", label: "Italy" },

  { value: "Jamaica", label: "Jamaica" },
  { value: "Japan", label: "Japan" },
  { value: "Jersey", label: "Jersey" },
  { value: "Jordan", label: "Jordan" },

  { value: "Kazakhstan", label: "Kazakhstan" },
  { value: "Kenya", label: "Kenya" },
  { value: "Kiribati", label: "Kiribati" },
  {
    value: "Korea, Democratic People's Republic of",
    label: "Korea, Democratic People's Republic of",
  },
  { value: "Korea, Republic of", label: "Korea, Republic of" },
  { value: "Kuwait", label: "Kuwait" },
  { value: "Kyrgyzstan", label: "Kyrgyzstan" },

  {
    value: "Lao People's Democratic Republic",
    label: "Lao People's Democratic Republic",
  },
  { value: "Latvia", label: "Latvia" },
  { value: "Lebanon", label: "Lebanon" },
  { value: "Lesotho", label: "Lesotho" },
  { value: "Liberia", label: "Liberia" },
  { value: "Libya", label: "Libya" },
  { value: "Liechtenstein", label: "Liechtenstein" },
  { value: "Lithuania", label: "Lithuania" },
  { value: "Luxembourg", label: "Luxembourg" },

  { value: "Macao", label: "Macao" },
  { value: "Madagascar", label: "Madagascar" },
  { value: "Malawi", label: "Malawi" },
  { value: "Malaysia", label: "Malaysia" },
  { value: "Maldives", label: "Maldives" },
  { value: "Mali", label: "Mali" },
  { value: "Malta", label: "Malta" },
  { value: "Marshall Islands", label: "Marshall Islands" },
  { value: "Martinique", label: "Martinique" },
  { value: "Mauritania", label: "Mauritania" },
  { value: "Mauritius", label: "Mauritius" },
  { value: "Mayotte", label: "Mayotte" },
  { value: "Mexico", label: "Mexico" },
  {
    value: "Micronesia, Federated States of",
    label: "Micronesia, Federated States of",
  },
  { value: "Moldova, Republic of", label: "Moldova, Republic of" },
  { value: "Monaco", label: "Monaco" },
  { value: "Mongolia", label: "Mongolia" },
  { value: "Montenegro", label: "Montenegro" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Morocco", label: "Morocco" },
  { value: "Mozambique", label: "Mozambique" },
  { value: "Myanmar", label: "Myanmar" },

  { value: "Namibia", label: "Namibia" },
  { value: "Nauru", label: "Nauru" },
  { value: "Nepal", label: "Nepal" },
  { value: "Netherlands", label: "Netherlands" },
  { value: "New Caledonia", label: "New Caledonia" },
  { value: "New Zealand", label: "New Zealand" },
  { value: "Nicaragua", label: "Nicaragua" },
  { value: "Niger", label: "Niger" },
  { value: "Nigeria", label: "Nigeria" },
  { value: "Niue", label: "Niue" },
  { value: "Norfolk Island", label: "Norfolk Island" },
  { value: "North Macedonia", label: "North Macedonia" },
  { value: "Northern Mariana Islands", label: "Northern Mariana Islands" },
  { value: "Norway", label: "Norway" },

  { value: "Oman", label: "Oman" },

  { value: "Pakistan", label: "Pakistan" },
  { value: "Palau", label: "Palau" },
  { value: "Palestine, State of", label: "Palestine, State of" },
  { value: "Panama", label: "Panama" },
  { value: "Papua New Guinea", label: "Papua New Guinea" },
  { value: "Paraguay", label: "Paraguay" },
  { value: "Peru", label: "Peru" },
  { value: "Philippines", label: "Philippines" },
  { value: "Pitcairn", label: "Pitcairn" },
  { value: "Poland", label: "Poland" },
  { value: "Portugal", label: "Portugal" },
  { value: "Puerto Rico", label: "Puerto Rico" },
  { value: "Qatar", label: "Qatar" },

  { value: "Réunion", label: "Réunion" },
  { value: "Romania", label: "Romania" },
  { value: "Russian Federation", label: "Russian Federation" },
  { value: "Rwanda", label: "Rwanda" },

  { value: "Saint Barthélemy", label: "Saint Barthélemy" },
  {
    value: "Saint Helena, Ascension and Tristan da Cunha",
    label: "Saint Helena, Ascension and Tristan da Cunha",
  },
  { value: "Saint Kitts and Nevis", label: "Saint Kitts and Nevis" },
  { value: "Saint Lucia", label: "Saint Lucia" },
  { value: "Saint Martin (French part)", label: "Saint Martin (French part)" },
  { value: "Saint Pierre and Miquelon", label: "Saint Pierre and Miquelon" },
  {
    value: "Saint Vincent and the Grenadines",
    label: "Saint Vincent and the Grenadines",
  },
  { value: "Samoa", label: "Samoa" },
  { value: "San Marino", label: "San Marino" },
  { value: "Sao Tome and Principe", label: "Sao Tome and Principe" },
  { value: "Saudi Arabia", label: "Saudi Arabia" },
  { value: "Senegal", label: "Senegal" },
  { value: "Serbia", label: "Serbia" },
  { value: "Seychelles", label: "Seychelles" },
  { value: "Sierra Leone", label: "Sierra Leone" },
  { value: "Singapore", label: "Singapore" },
  { value: "Sint Maarten (Dutch part)", label: "Sint Maarten (Dutch part)" },
  { value: "Slovakia", label: "Slovakia" },
  { value: "Slovenia", label: "Slovenia" },
  { value: "Solomon Islands", label: "Solomon Islands" },
  { value: "Somalia", label: "Somalia" },
  { value: "South Africa", label: "South Africa" },
  {
    value: "South Georgia and the South Sandwich Islands",
    label: "South Georgia and the South Sandwich Islands",
  },
  { value: "South Sudan", label: "South Sudan" },
  { value: "Spain", label: "Spain" },
  { value: "Sri Lanka", label: "Sri Lanka" },
  { value: "Sudan", label: "Sudan" },
  { value: "Suriname", label: "Suriname" },
  { value: "Svalbard and Jan Mayen", label: "Svalbard and Jan Mayen" },
  { value: "Sweden", label: "Sweden" },
  { value: "Switzerland", label: "Switzerland" },
  { value: "Syrian Arab Republic", label: "Syrian Arab Republic" },

  { value: "Taiwan, Province of China", label: "Taiwan, Province of China" },
  { value: "Tajikistan", label: "Tajikistan" },
  {
    value: "Tanzania, United Republic of",
    label: "Tanzania, United Republic of",
  },
  { value: "Thailand", label: "Thailand" },
  { value: "Timor-Leste", label: "Timor-Leste" },
  { value: "Togo", label: "Togo" },
  { value: "Tokelau", label: "Tokelau" },
  { value: "Tonga", label: "Tonga" },
  { value: "Trinidad and Tobago", label: "Trinidad and Tobago" },
  { value: "Tunisia", label: "Tunisia" },
  { value: "Türkiye", label: "Türkiye" },
  { value: "Turkmenistan", label: "Turkmenistan" },
  { value: "Turks and Caicos Islands", label: "Turks and Caicos Islands" },
  { value: "Tuvalu", label: "Tuvalu" },

  { value: "Uganda", label: "Uganda" },
  { value: "Ukraine", label: "Ukraine" },
  { value: "United Arab Emirates", label: "United Arab Emirates" },
  {
    value: "United Kingdom of Great Britain and Northern Ireland",
    label: "United Kingdom of Great Britain and Northern Ireland",
  },
  { value: "United States of America", label: "United States of America" },
  {
    value: "United States Minor Outlying Islands",
    label: "United States Minor Outlying Islands",
  },
  { value: "Uruguay", label: "Uruguay" },
  { value: "Uzbekistan", label: "Uzbekistan" },

  { value: "Vanuatu", label: "Vanuatu" },
  {
    value: "Venezuela, Bolivarian Republic of",
    label: "Venezuela, Bolivarian Republic of",
  },
  { value: "Viet Nam", label: "Viet Nam" },
  { value: "Virgin Islands (British)", label: "Virgin Islands (British)" },
  { value: "Virgin Islands (U.S.)", label: "Virgin Islands (U.S.)" },

  { value: "Wallis and Futuna", label: "Wallis and Futuna" },
  { value: "Western Sahara", label: "Western Sahara" },

  { value: "Yemen", label: "Yemen" },
  { value: "Zambia", label: "Zambia" },
  { value: "Zimbabwe", label: "Zimbabwe" },
  { value: "Other", label: "Other" },
];

// experience
export const HACKER_EXPERIENCE_OPTIONS = [
  "None",
  "Hacker",
  "Judge",
  "Mentor",
  "Organizer",
];

export const NUMBER_HACKATHONS = ["0", "1", "2", "3", "4+"];

// cxc app questions
export const questions = [
  {
    name: "cxc_q1" as const,
    question: "What do you hope to gain from your time at CxC...?",
    placeholder: "Long Answer (500 char limit)",
  },
  {
    name: "cxc_q2" as const,
    question: "Q2 Here",
    placeholder: "Long Answer (200 char limit)",
  },
];
