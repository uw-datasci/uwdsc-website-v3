-- CreateEnum
CREATE TYPE "public"."role_enum" AS ENUM ('hacker', 'volunteer', 'admin', 'default', 'declined');

-- CreateEnum
CREATE TYPE "public"."application_status_enum" AS ENUM ('draft', 'submitted', 'accepted', 'rejected', 'waitlisted');

-- CreateEnum
CREATE TYPE "public"."size_options" AS ENUM ('S', 'M', 'L', 'XL');

-- CreateEnum
CREATE TYPE "public"."gender_options" AS ENUM ('Male', 'Female', 'Non-Binary', 'Other', 'Prefer not to say');

-- CreateEnum
CREATE TYPE "public"."year_options" AS ENUM ('1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year+', 'Masters', 'PhD');

-- CreateEnum
CREATE TYPE "public"."hackathons_options" AS ENUM ('0', '1', '2', '3', '4+');

-- CreateTable
CREATE TABLE "public"."applications" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "profile_id" UUID NOT NULL,
  "phone_number" CHARACTER VARYING(12) NULL,
  "discord" CHARACTER VARYING(32) NULL,
  "t_shirt" "public"."size_options" NULL,
  "dietary_restrictions" TEXT NULL,
  "gender" "public"."gender_options" NULL,
  "ethnicity" TEXT NULL,
  "uni_name" TEXT NULL,
  "uni_program" TEXT NULL,
  "year_of_study" "public"."year_options" NULL,
  "prior_hack_exp" TEXT NULL,
  "num_hackathons" "public"."hackathons_options" NULL,
  "github_url" TEXT NULL,
  "linkedin_url" TEXT NULL,
  "website_url" TEXT NULL,
  "other_url" TEXT NULL,
  "cxc_q1" TEXT NULL,
  "cxc_q2" TEXT NULL,
  "team_members" TEXT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "status" "public"."application_status_enum" NOT NULL DEFAULT 'draft'::"public"."application_status_enum",
  "submitted_at" TIMESTAMP WITH TIME ZONE NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "age" INTEGER NULL,
  "country_of_residence" TEXT NULL,
  "mlh_agreed_code_of_conduct" BOOLEAN NULL DEFAULT false,
  "mlh_authorize_info_sharing" BOOLEAN NULL DEFAULT false,
  "mlh_email_opt_in" BOOLEAN NULL DEFAULT false,
  CONSTRAINT "applications_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "discord_length_check" CHECK (
    (
      ("discord" IS NULL)
      OR (
        (LENGTH(("discord")::TEXT) >= 2)
        AND (LENGTH(("discord")::TEXT) <= 32)
      )
    )
  )
);

-- CreateTable
CREATE TABLE "public"."event_attendance" (
    "id" BIGSERIAL NOT NULL,
    "event_id" BIGINT NOT NULL,
    "profile_id" UUID NOT NULL,
    "checked_in" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."events" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "registration_required" BOOLEAN NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "start_time" TIMESTAMP(3) NOT NULL,
    "buffered_start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "buffered_end_time" TIMESTAMP(3) NOT NULL,
    "payment_required" BOOLEAN NOT NULL DEFAULT true,
    "image_id" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."profiles" (
  "id" UUID NOT NULL REFERENCES "auth"."users"("id") ON DELETE RESTRICT,
  "role" "public"."role_enum" NULL DEFAULT 'default'::"public"."role_enum",
  "nfc_id" BIGINT NULL,
  "created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reviews" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "application_id" UUID NOT NULL,
  "reviewer_id" UUID NOT NULL,
  "resume_score" INTEGER NOT NULL,
  "links_score" INTEGER NOT NULL,
  "q1_score" INTEGER NOT NULL,
  "q2_score" INTEGER NOT NULL,
  "reviewed_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT "reviews_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "reviews_application_id_reviewer_id_key" UNIQUE ("application_id", "reviewer_id"),
  CONSTRAINT "reviews_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "public"."applications" ("id") ON DELETE CASCADE,
  CONSTRAINT "reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE,
  CONSTRAINT "reviews_resume_score_check" CHECK (
    (
      ("resume_score" >= 0)
      AND ("resume_score" <= 3)
    )
  ),
  CONSTRAINT "reviews_links_score_check" CHECK (
    (
      ("links_score" >= 0)
      AND ("links_score" <= 2)
    )
  ),
  CONSTRAINT "reviews_q1_score_check" CHECK (
    (
      ("q1_score" >= 0)
      AND ("q1_score" <= 7)
    )
  ),
  CONSTRAINT "reviews_q2_score_check" CHECK (
    (
      ("q2_score" >= 0)
      AND ("q2_score" <= 3)
    )
  )
);

-- CreateTable
CREATE TABLE "public"."teams" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "team_name" TEXT NOT NULL,
    "team_member_1" TEXT NULL,
    "team_member_2" TEXT NULL,
    "team_member_3" TEXT NULL,
    "team_member_4" TEXT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "applications_profile_id_key" ON "public"."applications"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_attendance_event_id_profile_id_key" ON "public"."event_attendance"("event_id", "profile_id");

-- AddForeignKey
ALTER TABLE "public"."applications" ADD CONSTRAINT "applications_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."event_attendance" ADD CONSTRAINT "event_attendance_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."event_attendance" ADD CONSTRAINT "event_attendance_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Policies
create policy "Admins can insert reviews"
on "public"."reviews"
as PERMISSIVE
to public
with check (
  ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::role_enum)))) AND (auth.uid() = reviewer_id))
);


create policy "Admins can update their own reviews"
on "public"."reviews"
as PERMISSIVE
to public
using (
  ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::role_enum)))) AND (auth.uid() = reviewer_id))
);

create policy "Admins can view all reviews"
on "public"."reviews"
as PERMISSIVE
to public
using (
  (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::role_enum))))
);

create policy "Reviewers can view their own reviews"
on "public"."reviews"
as PERMISSIVE
to public
using (
  (auth.uid() = reviewer_id)
);
