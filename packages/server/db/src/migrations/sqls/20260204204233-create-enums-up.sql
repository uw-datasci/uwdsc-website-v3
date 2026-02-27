-- Create user_role_enum
CREATE TYPE user_role_enum AS ENUM ('member', 'admin', 'exec');

-- Create faculty_enum
CREATE TYPE faculty_enum AS ENUM (
  'math',
  'engineering',
  'science',
  'arts',
  'health',
  'environment',
  'other'
);

-- Create payment_method_enum
CREATE TYPE payment_method_enum AS ENUM ('cash', 'online', 'math_soc');

-- Create application_status_enum
CREATE TYPE application_status_enum AS ENUM (
  'draft',
  'submitted',
  'under_review',
  'accepted',
  'rejected',
  'waitlisted'
);

-- Create application_review_status_enum
CREATE TYPE application_review_status_enum AS ENUM (
  'In Review',
  'Interviewing', 
  'Wanted', 
  'Not Wanted', 
  'Offer Sent', 
  'Accepted Offer', 
  'Declined Offer', 
  'Rejection Sent'
);

-- Create application_input_enum
CREATE TYPE application_input_enum AS ENUM ('text', 'textarea');
