"use client";

import { LoadingScreen } from "@/components/LoadingScreen";
import { useAuth } from "@/contexts/AuthContext";
import { getApplication } from "@/lib/api/application";
import { updateUserRSVPRole } from "@/lib/api/user";
import { AppFormValues } from "@/lib/schemas/application";
import { transformDatabaseDataToForm } from "@/lib/utils/formDataTransformer";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button, ConfettiIcon } from "@uwdsc/ui";
import CxCButton from "@/components/CxCButton";
import { Clock, Info } from "lucide-react";
import { CountdownClock } from "@/components/CountdownClock";
import { RSVP_DEADLINE } from "@/constants/application";

export default function ResultsPage() {
  const { user } = useAuth();
  const [application, setApplication] = useState<AppFormValues | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [isUnaccepting, setIsUnaccepting] = useState(false);
  const [isUndeclining, setIsUndeclining] = useState(false);
  const [userRole, setUserRole] = useState<string | undefined>(undefined);
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);

  useEffect(() => {
    // Check if deadline has passed
    const checkDeadline = () => {
      setIsDeadlinePassed(new Date() > new Date(RSVP_DEADLINE));
    };
    checkDeadline();
    const interval = setInterval(checkDeadline, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadApplication() {
      if (!user?.id) return;
      try {
        const data = await getApplication(user.id);
        if (!data) return;

        const formData = transformDatabaseDataToForm(data) as AppFormValues;
        setApplication(formData);
        setUserRole(user.role);
      } catch (error) {
        console.error("Error loading application:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadApplication();
  }, [user?.id, user?.role]);

  const handleRSVP = async (
    action: "accept" | "unaccept" | "decline" | "undecline",
  ) => {
    if (!user?.id) return;

    // Set the appropriate loading state
    switch (action) {
      case "accept":
        setIsAccepting(true);
        break;
      case "unaccept":
        setIsUnaccepting(true);
        break;
      case "decline":
        setIsDeclining(true);
        break;
      case "undecline":
        setIsUndeclining(true);
        break;
    }

    try {
      // Map action to role
      let newRole: "hacker" | "default" | "declined";

      switch (action) {
        case "accept":
          newRole = "hacker";
          break;
        case "unaccept":
          newRole = "default";
          break;
        case "decline":
          newRole = "declined";
          break;
        case "undecline":
          newRole = "default";
          break;
      }

      const response = await updateUserRSVPRole(newRole);
      if (!response.success) {
        throw new Error(response.message || "Failed to update RSVP");
      }
      // Update local role state
      setUserRole(newRole);
    } catch (error) {
      console.error("Error updating RSVP:", error);
    } finally {
      // Reset the appropriate loading state
      switch (action) {
        case "accept":
          setIsAccepting(false);
          break;
        case "unaccept":
          setIsUnaccepting(false);
          break;
        case "decline":
          setIsDeclining(false);
          break;
        case "undecline":
          setIsUndeclining(false);
          break;
      }
    }
  };

  if (isLoading) {
    return <LoadingScreen message="LOADING RESULTS..." />;
  }

  if (application?.status === "draft") {
    return null;
  }

  // Waitlisted Page UI
  if (application?.status === "submitted") {
    return (
      <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl w-full"
        >
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <Clock className="w-16 h-16 text-amber-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-amber-400 uppercase tracking-wider">
                You&apos;re Waitlisted
              </h1>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-white/90">
                  Thank you for your interest in CXC 2026! While we
                  couldn&apos;t offer you a spot right now, you&apos;ve been
                  placed on our waitlist. This means you&apos;re still in
                  consideration, and we&apos;ll reach out if a spot becomes
                  available.
                </p>
              </div>

              <div className="bg-amber-400/8 border border-amber-400/30 p-5">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-amber-400 uppercase tracking-wide text-sm">
                      What Happens Next?
                    </h3>
                    <ul className="space-y-1.5 text-sm text-white/80">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 mt-0.5">•</span>
                        <span>
                          We&apos;ll notify you by email if a spot opens up
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 mt-0.5">•</span>
                        <span>
                          Keep an eye on your inbox over the next few weeks
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 mt-0.5">•</span>
                        <span>
                          No further action is required from you at this time
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <p className="text-sm text-white/60">
                  We appreciate your patience and hope to see you at CXC soon!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Offered/Accepted Page UI with RSVP Button
  return (
    <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full"
      >
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <ConfettiIcon className="w-16 h-16 text-green-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-green-400 uppercase tracking-wider">
              Congratulations!
            </h1>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-white/90">
                You&apos;ve been accepted into CXC 2026! We&apos;re excited to
                welcome you to our largest event ever with over{" "}
                <span className="font-semibold text-green-400">
                  $5,000+ in prizes
                </span>{" "}
                and various educational and networking opportunities.
              </p>
            </div>

            {/* Flex row for Important Details and RSVP Instructions */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Important Details */}
              <div className="bg-blue-400/8 border border-blue-400/30 p-5">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-blue-400 uppercase tracking-wide text-sm">
                      Important Details
                    </h3>
                    <ul className="space-y-1.5 text-sm text-white/80">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span>
                          <span className="font-semibold">IN PERSON</span> at
                          STC building, Feb 6th (5pm) - Feb 8th (3pm)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span>
                          Organize your own transportation (no bursaries)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span>Confirm your own sleeping arrangements</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* RSVP Instructions */}
              <div className="bg-orange-600/8 border border-orange-600/30 p-5">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-orange-500 uppercase tracking-wide text-sm">
                      RSVP Instructions
                    </h3>
                    <ul className="space-y-1.5 text-sm text-white/80">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">•</span>
                        <span>
                          If you <span className="font-semibold">CAN</span>{" "}
                          come, select RSVP below
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">•</span>
                        <span>
                          If you <span className="font-semibold">CANNOT</span>{" "}
                          come, cancel RSVP for waitlisted individuals
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Conditional rendering based on role */}
            {userRole === "hacker" ? (
              // User has RSVP'd - show confirmation message
              <div className="bg-green-500/8 border border-green-500/30 p-6">
                <div className="text-center space-y-4">
                  <h3 className="font-semibold text-green-300 uppercase tracking-wide text-lg">
                    You&apos;re All Set!
                  </h3>
                  <p className="text-sm text-white/90">
                    You&apos;ve successfully RSVP&apos;d for CXC 2026.
                    We&apos;ll send you more details closer to the event date.
                  </p>
                  {!isDeadlinePassed && (
                    <Button
                      className="px-6 py-2 text-xs font-semibold uppercase tracking-wider border border-red-400/50 bg-background text-red-400/70 hover:text-red-400 hover:bg-red-400/8 transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
                      onClick={() => handleRSVP("unaccept")}
                      disabled={isUnaccepting}
                    >
                      {isUnaccepting ? "Processing..." : "Cancel RSVP"}
                    </Button>
                  )}
                </div>
              </div>
            ) : userRole === "declined" ? (
              // User has declined - show declined message
              <div className="bg-red-500/8 border border-red-500/30 p-6">
                <div className="text-center space-y-4">
                  <h3 className="font-semibold text-red-400 uppercase tracking-wide text-lg">
                    Offer Declined
                  </h3>
                  <p className="text-sm text-white/90">
                    You&apos;ve declined the offer. If you change your mind, you
                    can undo this decision.
                  </p>
                  {!isDeadlinePassed && (
                    <Button
                      className="px-6 py-2 text-xs font-semibold uppercase tracking-wider border border-blue-400/50 bg-background text-blue-400/70 hover:text-blue-400 hover:bg-blue-400/8 transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
                      onClick={() => handleRSVP("undecline")}
                      disabled={isUndeclining}
                    >
                      {isUndeclining ? "Processing..." : "Undo Decline"}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* Countdown Section or Expired Message */}
                <div className="bg-amber-500/8 border border-amber-500/30 p-5">
                  <div className="flex flex-col items-center gap-1">
                    {isDeadlinePassed ? (
                      <div className="text-center space-y-2">
                        <div className="flex items-center justify-center gap-1.5">
                          <Clock className="w-4 h-4 text-amber-400" />
                          <h3 className="font-semibold text-amber-400 uppercase tracking-wide text-sm">
                            RSVP Period Ended
                          </h3>
                        </div>
                        <p className="text-sm text-white/70">
                          Sorry, the RSVP deadline has passed.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <h3 className="font-semibold text-amber-400 uppercase tracking-wide text-sm">
                            RSVP Within 48 Hours
                          </h3>
                        </div>
                        <div className="sm:scale-[0.75]">
                          <CountdownClock targetDate={RSVP_DEADLINE} />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons - only show if deadline hasn't passed */}
                {!isDeadlinePassed && (
                  <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
                    <Button
                      className="px-8 py-3 text-sm font-semibold uppercase tracking-wider border-2 border-red-400/50 bg-transparent text-red-400 hover:bg-red-400/8 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-none !h-auto"
                      onClick={() => handleRSVP("decline")}
                      disabled={isDeclining}
                    >
                      {isDeclining ? "Processing..." : "Decline Offer"}
                    </Button>

                    <CxCButton
                      className="px-8 py-3 text-sm font-semibold uppercase tracking-wider hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleRSVP("accept")}
                      disabled={isAccepting}
                    >
                      {isAccepting ? "Processing..." : "Accept & RSVP"}
                    </CxCButton>
                  </div>
                )}
              </>
            )}

            <div className="text-center pt-2">
              <p className="text-sm text-white/60">
                We can&apos;t wait to see you at CXC 2026!
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
