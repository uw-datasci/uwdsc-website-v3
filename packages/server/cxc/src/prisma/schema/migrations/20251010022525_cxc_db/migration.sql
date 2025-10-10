-- CreateEnum
CREATE TYPE "public"."role_enum" AS ENUM ('hacker', 'sponsor', 'mentor', 'volunteer', 'admin', 'default');

-- CreateEnum
CREATE TYPE "public"."application_status_enum" AS ENUM ('draft', 'submitted', 'offered', 'accepted', 'rejected', 'waitlisted');

-- CreateEnum
CREATE TYPE "public"."team_role_enum" AS ENUM ('leader', 'member');

-- CreateEnum
CREATE TYPE "public"."sponsor_tier_enum" AS ENUM ('bronze', 'silver', 'gold', 'platinum');

-- CreateTable
CREATE TABLE "public"."application_answers" (
    "id" BIGSERIAL NOT NULL,
    "application_id" BIGINT NOT NULL,
    "question_id" BIGINT NOT NULL,
    "answer" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."applications" (
    "id" BIGSERIAL NOT NULL,
    "profile_id" UUID NOT NULL,
    "resume_id" BIGINT,
    "status" "public"."application_status_enum" NOT NULL DEFAULT 'draft',
    "role" "public"."role_enum" NOT NULL,
    "term" TEXT NOT NULL,
    "comments" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submitted_at" TIMESTAMP(3),

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
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
    "id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "role" "public"."role_enum" NOT NULL DEFAULT 'default',
    "nfc_id" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."questions" (
    "id" BIGSERIAL NOT NULL,
    "question_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "order_num" INTEGER NOT NULL,
    "max_length" INTEGER NOT NULL,
    "placeholder" TEXT,
    "help_text" TEXT,
    "role" "public"."role_enum" NOT NULL,
    "term" TEXT NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."resumes" (
    "id" BIGSERIAL NOT NULL,
    "profile_id" UUID NOT NULL,
    "file_path" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sponsors" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logo_url" TEXT NOT NULL,
    "website_url" TEXT NOT NULL,
    "tier" "public"."sponsor_tier_enum" NOT NULL DEFAULT 'bronze',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sponsors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."team_members" (
    "id" BIGSERIAL NOT NULL,
    "team_id" BIGINT NOT NULL,
    "profile_id" UUID NOT NULL,
    "role" "public"."team_role_enum" NOT NULL DEFAULT 'member',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."teams" (
    "id" BIGSERIAL NOT NULL,
    "team_name" TEXT NOT NULL,
    "team_size" INTEGER NOT NULL DEFAULT 1,
    "is_recruiting" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "application_answers_application_id_question_id_key" ON "public"."application_answers"("application_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "applications_profile_id_role_term_key" ON "public"."applications"("profile_id", "role", "term");

-- CreateIndex
CREATE UNIQUE INDEX "event_attendance_event_id_profile_id_key" ON "public"."event_attendance"("event_id", "profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "questions_term_question_id_key" ON "public"."questions"("term", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "resumes_file_path_key" ON "public"."resumes"("file_path");

-- CreateIndex
CREATE UNIQUE INDEX "sponsors_name_key" ON "public"."sponsors"("name");

-- CreateIndex
CREATE UNIQUE INDEX "team_members_team_id_profile_id_key" ON "public"."team_members"("team_id", "profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "teams_team_name_key" ON "public"."teams"("team_name");

-- AddForeignKey
ALTER TABLE "public"."application_answers" ADD CONSTRAINT "application_answers_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."application_answers" ADD CONSTRAINT "application_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."applications" ADD CONSTRAINT "applications_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."applications" ADD CONSTRAINT "applications_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."event_attendance" ADD CONSTRAINT "event_attendance_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."event_attendance" ADD CONSTRAINT "event_attendance_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."resumes" ADD CONSTRAINT "resumes_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."team_members" ADD CONSTRAINT "team_members_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."team_members" ADD CONSTRAINT "team_members_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
