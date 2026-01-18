"use client";

/**
 * CXC Hacker Application Page
 *
 * This page handles the complete application flow including:
 * - Form initialization with pre-filled data
 * - Blank application creation for new users
 * - Step-by-step form submission
 * - Responsive layout for desktop and mobile views
 */

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import {
  AppFormValues,
  applicationSchema,
  applicationDefaultValues,
} from "@/lib/schemas/application";
import {
  updateApplication,
  getApplication,
  createApplication,
} from "@/lib/api/application";
import {
  transformFormDataForDatabase,
  transformDatabaseDataToForm,
  cleanFormData,
} from "@/lib/utils/formDataTransformer";
import DesktopApplication from "@/components/application/DesktopApplication";
import MobileApplication from "@/components/application/MobileApplication";
import { Submitted } from "@/components/application/sections";
import { ApplicationClosed } from "@/components/application/ApplicationClosed";
import {
  APPLICATION_DEADLINE,
  APPLICATION_RELEASE_DATE,
  MOBILE_STEP_TO_PAGE_MAP,
  NUMBER_MOBILE_PAGES,
  STEP_NAMES,
} from "@/constants/application";

// ============================================================================
// Constants
// ============================================================================

const FINAL_STEP_COUNT = STEP_NAMES.length;

const STORAGE_KEY_DESKTOP_STEP = "desktop_step";
const STORAGE_KEY_MOBILE_PAGE = "mobile_page";

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Converts desktop step to mobile page number
 * Desktop steps aggregate multiple mobile pages
 */
const stepToPage = (step: number): number => {
  return MOBILE_STEP_TO_PAGE_MAP[step] || 0;
};

/**
 * Converts mobile page number to desktop step
 */
const pageToStep = (page: number): number => {
  if (page < 3) return 0; // pages 0, 1, 2 = Contact Info, About You, Optional
  if (page < 6) return 1; // pages 3, 4, 5 = Education, Hack Exp, Links
  if (page < 8) return 2; // pages 6, 7 = Question 1, Question 2
  if (page < 9) return 3; // page 8 = Teams
  if (page < 10) return 4; // page 9 = MLH
  return 5; // page 10 = Review
};

export default function ApplyPage() {
  // ========================================================================
  // State Management
  // ========================================================================

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const isAdminOrSuperadmin = user?.role === "admin" || user?.role === "superadmin";
  const [isApplicationOpen, setIsApplicationOpen] = useState<boolean>(() => {
    const now = new Date();
    const isWithinDeadline = now >= APPLICATION_RELEASE_DATE && now <= APPLICATION_DEADLINE;
    // Admins and superadmins can always access
    return isWithinDeadline || isAdminOrSuperadmin;
  });
  const [currentDesktopStep, setCurrentDesktopStep] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_DESKTOP_STEP);
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });
  const [currentMobilePage, setCurrentMobilePage] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_MOBILE_PAGE);
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });
  const [applicationStatus, setApplicationStatus] = useState<string | null>(
    null,
  );
  const hasInitialized = useRef<boolean>(false);

  // ========================================================================
  // Form Setup
  // ========================================================================

  const form = useForm<AppFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: applicationDefaultValues,
    mode: "onTouched",
  });

  // ========================================================================
  // Effects
  // ========================================================================

  /**
   * Continuously check if applications are open
   * Checks every second to dynamically update when the date window changes
   * Admins and superadmins can always access
   */
  useEffect(() => {
    const checkApplicationStatus = () => {
      const now = new Date();
      const isWithinDeadline =
        now >= APPLICATION_RELEASE_DATE && now <= APPLICATION_DEADLINE;
      // Admins and superadmins can always access
      const isOpen = isWithinDeadline || isAdminOrSuperadmin;
      setIsApplicationOpen(isOpen);
    };

    const timer = setInterval(checkApplicationStatus, 1000);

    return () => clearInterval(timer);
  }, [isAdminOrSuperadmin]);

  /**
   * Initialize application on component mount
   * - Fetch existing application if user has one
   * - Create blank application if user is new
   * - Pre-fill form with fetched data
   * - If application is already submitted, show Submitted component immediately
   * - Responds dynamically to isApplicationOpen changes
   */
  useEffect(() => {
    const initializeApplication = async () => {
      if (!user?.id || hasInitialized.current) return;

      // Don't initialize application if outside the date range (unless admin/superadmin)
      if (!isApplicationOpen) {
        setApplicationStatus("closed");
        setIsLoading(false);
        return;
      }

      hasInitialized.current = true;

      setIsLoading(true);
      try {
        const existingApplication = await getApplication(user.id);

        // Check if application is already submitted - if so, show Submitted page immediately
        if (existingApplication && existingApplication.status === "submitted") {
          setApplicationStatus("submitted");
          setIsLoading(false);
          return; // Don't allow editing a submitted application
        }

        if (existingApplication) {
          // Pre-fill form with existing application data
          const formData = transformDatabaseDataToForm(existingApplication);

          // Preserve user email and name from auth
          const fullName =
            user.first_name && user.last_name
              ? [user.first_name, user.last_name].join(" ")
              : "";

          form.reset({
            ...formData,
            email: user.email || "",
            name: fullName,
          });

          // Restore localStorage values after form.reset() for fields that might be undefined in DB
          // This ensures localStorage takes precedence for fields like hackathons_attended
          setTimeout(() => {
            const hackathonsKey = "cxc_form_hackathons_attended";
            const savedHackathons = localStorage.getItem(hackathonsKey);
            if (savedHackathons) {
              const currentHackathons = form.getValues("hackathons_attended");
              console.log("[apply/page] Restoring hackathons_attended:", {
                saved: savedHackathons,
                current: currentHackathons,
              });
              if (
                currentHackathons === undefined ||
                currentHackathons === null
              ) {
                form.setValue(
                  "hackathons_attended",
                  savedHackathons as AppFormValues["hackathons_attended"],
                  {
                    shouldDirty: false,
                    shouldValidate: false,
                  },
                );
                console.log(
                  "[apply/page] Set hackathons_attended to:",
                  form.getValues("hackathons_attended"),
                );
              }
            }
          }, 700);
        } else {
          // Create blank application entry for new user
          const resp = await createApplication(user.id);

          console.log(resp.success);
          console.log(resp.error);

          // Set user email and name for new applications
          const fullName =
            user.first_name && user.last_name
              ? [user.first_name, user.last_name].join(" ")
              : "";

          form.reset({
            ...applicationDefaultValues,
            email: user.email || "",
            name: fullName,
          });

          // Restore localStorage values after form.reset() for new applications
          setTimeout(() => {
            const hackathonsKey = "cxc_form_hackathons_attended";
            const savedHackathons = localStorage.getItem(hackathonsKey);
            if (savedHackathons) {
              const currentHackathons = form.getValues("hackathons_attended");
              console.log(
                "[apply/page] Restoring hackathons_attended (new app):",
                {
                  saved: savedHackathons,
                  current: currentHackathons,
                },
              );
              if (
                currentHackathons === undefined ||
                currentHackathons === null
              ) {
                form.setValue(
                  "hackathons_attended",
                  savedHackathons as AppFormValues["hackathons_attended"],
                  {
                    shouldDirty: false,
                    shouldValidate: false,
                  },
                );
                console.log(
                  "[apply/page] Set hackathons_attended to:",
                  form.getValues("hackathons_attended"),
                );
              }
            }
          }, 700);
        }
        // Set application status
        setApplicationStatus(
          (existingApplication?.status as string) || "draft",
        );
      } catch (error) {
        console.error("Error initializing application:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApplication();
  }, [user, form, isApplicationOpen]);

  // Save step/page to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        STORAGE_KEY_DESKTOP_STEP,
        currentDesktopStep.toString(),
      );
    }
  }, [currentDesktopStep]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        STORAGE_KEY_MOBILE_PAGE,
        currentMobilePage.toString(),
      );
    }
  }, [currentMobilePage]);

  // ========================================================================
  // Event Handlers
  // ========================================================================

  /**
   * Handles form submission on "Continue" or "Submit" button click
   * Transforms form data and sends to backend API
   */
  const handleSaveAndContinue = async (
    onSuccess: () => void,
    isSubmit: boolean = false,
  ) => {
    if (!user?.id) {
      console.error("Profile ID not found");
      return;
    }

    setIsLoading(true);
    try {
      const formData = form.getValues();

      // Update status to submitted if this is the final submit
      if (isSubmit) {
        formData.status = "submitted";
        formData.submitted_at = new Date();
      }

      const transformedData = transformFormDataForDatabase(formData, user.id);

      // If resume file is selected, upload it (resume is stored by user ID in storage)
      if (formData.resume && formData.resume instanceof File) {
        try {
          const { uploadResume } = await import("@/lib/api/resume");
          await uploadResume(formData.resume);
        } catch (error) {
          console.error("Failed to upload resume:", error);
          // Continue even if upload fails
        }
      }

      const cleanedData = cleanFormData(transformedData);
      const response = await updateApplication(cleanedData);

      // In handleSaveAndContinue, update the submit section:
      if (response.success) {
        if (isSubmit) {
          setApplicationStatus("submitted");
          // Clear all localStorage autosave when application is submitted
          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (
              key &&
              (key.startsWith("cxc_form_") ||
                key === "q1_save" ||
                key === "q2_save" ||
                key === "resume_filename")
            ) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach((key) => localStorage.removeItem(key));
          localStorage.removeItem(STORAGE_KEY_DESKTOP_STEP);
          localStorage.removeItem(STORAGE_KEY_MOBILE_PAGE);
        } else {
          onSuccess();
        }
      } else {
        console.error("Failed to update application:", response.error);
      }
    } catch (error) {
      console.error("Error during application update:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Syncs desktop step changes to mobile view
   */
  const handleDesktopStepChange = (newStep: number) => {
    setCurrentDesktopStep(newStep);
    const newPage = stepToPage(newStep);
    setCurrentMobilePage(newPage);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_DESKTOP_STEP, newStep.toString());
      localStorage.setItem(STORAGE_KEY_MOBILE_PAGE, newPage.toString());
    }
  };

  /**
   * Syncs mobile page changes to desktop view
   */
  const handleMobilePageChange = (newPage: number) => {
    setCurrentMobilePage(newPage);
    const newStep = pageToStep(newPage);
    setCurrentDesktopStep(newStep);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_MOBILE_PAGE, newPage.toString());
      localStorage.setItem(STORAGE_KEY_DESKTOP_STEP, newStep.toString());
    }
  };

  // ========================================================================
  // Render
  // ========================================================================

  // Only show ApplicationClosed to non-admin users
  if (!isApplicationOpen && !isAdminOrSuperadmin) {
    return <ApplicationClosed />;
  }

  if (!applicationStatus) {
    return null;
  }

  const isSubmitted =
    applicationStatus === "submitted" ||
    currentDesktopStep === FINAL_STEP_COUNT ||
    currentMobilePage === NUMBER_MOBILE_PAGES;

  if (isSubmitted) {
    return <Submitted />;
  }

  return (
    <>
      <DesktopApplication
        form={form}
        isLoading={isLoading}
        onSaveAndContinue={handleSaveAndContinue}
        currentStep={currentDesktopStep}
        onStepChange={handleDesktopStepChange}
      />
      <MobileApplication
        form={form}
        isLoading={isLoading}
        onSaveAndContinue={handleSaveAndContinue}
        currentPage={currentMobilePage}
        onPageChange={handleMobilePageChange}
      />
    </>
  );
}
