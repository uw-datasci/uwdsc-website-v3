"use client";

import { useState } from "react";
import { AuthHeader } from "@/components/login/AuthHeader";
import { RegisterForm } from "@/components/register/RegisterForm";
import { VerifyEmailView } from "@/components/register/VerifyEmailView";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  return (
    <div className="bg-black w-full min-h-dvh flex flex-col items-center justify-center px-4 py-6 sm:px-8 sm:py-8 md:px-12 overflow-x-clip">
      <AuthHeader className="mb-6 sm:mb-8" />
      <div className="flex-1 flex items-center justify-center w-full">
        <AnimatePresence mode="wait">
          {isRegistered ? (
            <motion.div
              key="verify-email"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full flex flex-col items-center justify-center"
            >
              <VerifyEmailView email={registeredEmail} />
            </motion.div>
          ) : (
            <motion.div
              key="registration-form"
              initial={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full"
            >
              <div className="flex flex-col md:flex-row gap-8 lg:gap-12 w-full h-full max-w-6xl mx-auto">
                <div className="flex flex-col flex-1 gap-8 justify-center">
                  <div className="text-center md:text-start">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 md:mb-10">
                      Join Us!
                    </h2>
                    <p className="text-base leading-relaxed sm:text-lg md:text-xl md:leading-loose">
                      Become a part of a growing community of data science enthusiasts and
                      participate in engaging discussions, hands-on projects, and networking
                      opportunities.
                    </p>
                  </div>
                </div>
                <div className="hidden md:block w-px self-stretch bg-gray-500/60" />
                <div className="w-full h-full flex-1">
                  <RegisterForm
                    onSuccess={(email) => {
                      setRegisteredEmail(email);
                      setIsRegistered(true);
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
