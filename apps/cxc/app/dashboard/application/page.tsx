"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getApplication } from "@/lib/api/application";
import { ApplicationSummary } from "@/components/dashboard";
import { Teams } from "@/components/application/sections/Teams";
import CxCButton from "@/components/CxCButton";
import { Card, CardContent, FileTextIcon } from "@uwdsc/ui";
import { transformDatabaseDataToForm } from "@/lib/utils/formDataTransformer";
import { AppFormValues } from "@/lib/schemas/application";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema } from "@/lib/schemas/application";
import { APPLICATION_DEADLINE } from "@/constants/application";

export default function ApplicationPage() {
  const { user } = useAuth();
  const isAdminOrSuperadmin = user?.role === "admin" || user?.role === "superadmin";
  const [application, setApplication] = useState<AppFormValues | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPastDeadline, setIsPastDeadline] = useState(false);

  // Continuously check if past deadline
  // Admins and superadmins can always edit
  useEffect(() => {
    const checkDeadline = () => {
      const pastDeadline = new Date() > APPLICATION_DEADLINE;
      // Admins and superadmins can always edit, so they're never past deadline for editing purposes
      setIsPastDeadline(pastDeadline && !isAdminOrSuperadmin);
    };

    // Check immediately
    checkDeadline();

    // Check every second
    const interval = setInterval(checkDeadline, 1000);

    return () => clearInterval(interval);
  }, [isAdminOrSuperadmin]);

  // Initialize form for Teams component
  const form = useForm<AppFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {},
  });

  useEffect(() => {
    async function loadApplication() {
      if (!user?.id) return;

      try {
        const data = await getApplication(user.id);
        if (!data) return;

        const formData = transformDatabaseDataToForm(data) as AppFormValues;
        setApplication(formData);
        // Update form with application data
        form.reset(formData);
      } catch (error) {
        console.error("Error loading application:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadApplication();
  }, [user?.id, form]);

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-8 w-64 bg-white/10 animate-pulse" />
          <div className="h-48 bg-white/5 border border-white/10 animate-pulse" />
          <div className="h-48 bg-white/5 border border-white/10 animate-pulse" />
          <div className="h-48 bg-white/5 border border-white/10 animate-pulse" />
        </div>
      </div>
    );
  }
  // No application state
  if (!application) {
    return (
      <div className="p-6 lg:p-8 min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-black border border-white/20 rounded-none !gap-0">
              <CardContent className="py-12 flex flex-col items-center text-center">
                <FileTextIcon className="w-12 h-12 text-white/20 mb-6" />
                <h2 className="text-xl font-semibold text-white mb-2 uppercase tracking-wider">
                  No Application Found
                </h2>
                {isPastDeadline ? (
                  <div className="border border-red-400/40 bg-red-400/10 p-4 max-w-md">
                    <p className="text-red-400 font-medium mb-1 font-mono">
                      Application deadline passed.
                    </p>
                    <p className="text-red-400/70 text-sm">
                      The application deadline has passed. We are no longer
                      accepting new applications.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-white/60 mb-6 max-w-md">
                      You haven&apos;t started your application yet. Apply now to
                      join CxC and be part of an amazing hackathon experience!
                    </p>
                    <Link href="/apply">
                      <CxCButton>Start Application →</CxCButton>
                    </Link>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Draft application state
  if (application.status === "draft") {
    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="border-b border-white/10 pb-6"
          >
            <h1 className="text-2xl lg:text-3xl font-bold text-white uppercase tracking-wider">
              Your Application
            </h1>
            <p className="text-white/60 mt-1">
              Your application is saved as a draft.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {isPastDeadline ? (
              <div className="border border-red-400/40 bg-red-400/10 p-4">
                <p className="text-red-400 font-medium mb-1 font-mono">
                  Application deadline passed.
                </p>
                <p className="text-red-400/70 text-sm">
                  The application deadline has passed. We are no longer accepting
                  applications or allowing edits to draft applications.
                </p>
              </div>
            ) : (
              <div className="border border-yellow-400/40 p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-yellow-400 font-medium mb-1 font-mono">
                      APPLICATION IN PROGRESS
                    </h3>
                    <p className="text-yellow-400/70 text-sm">
                      Your application hasn&apos;t been submitted yet. Continue
                      where you left off to complete it.
                    </p>
                  </div>
                  <Link href="/apply">
                    <CxCButton className="whitespace-nowrap">
                      Continue Application →
                    </CxCButton>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>

          {/* Show partial application data */}
          <ApplicationSummary application={application} />

          {/* Teams Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Teams form={form} useCard={true} disabled={true} />
          </motion.div>
        </div>
      </div>
    );
  }

  // Submitted/reviewed application
  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="border-b border-white/10 pb-6"
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-white uppercase tracking-wider">
            Your Application
          </h1>
          <p className="text-white/60 mt-1">
            Review your submitted application details below.
          </p>
        </motion.div>

        {/* Submission info banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="border border-blue-400 p-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-400" />
              <div>
                <p className="text-blue-400 font-medium font-mono">
                  APPLICATION SUBMITTED
                </p>
                {application.submitted_at && (
                  <p className="text-blue-400/70 text-sm font-mono">
                    Submitted:{" "}
                    {new Date(application.submitted_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Full application summary */}
        <ApplicationSummary application={application} />

        {/* Teams Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Teams form={form} useCard={true} disabled={true} />
        </motion.div>
      </div>
    </div>
  );
}
