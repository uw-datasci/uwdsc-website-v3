"use client";

import { useState } from "react";
import { Typing } from "@/components/login/Typing";
import { RegisterForm } from "@/components/register/RegisterForm";
import { VerifyEmailView } from "@/components/register/VerifyEmailView";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  return (
    <div className="bg-black w-full min-h-screen flex flex-col items-center justify-center px-12 py-8 overflow-hidden">
      <div className="w-full mb-8">
        <Typing
          text="UW Data Science Club"
          speed={75}
          caretSize="text-[42px] font-semibold"
          className="text-3xl font-bold text-white"
        />
      </div>
      <div className="flex-1 flex items-center justify-center w-full relative">
        <AnimatePresence mode="wait">
          {isRegistered ? (
            <motion.div
              key="verify-email"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full flex flex-col items-center justify-center absolute"
            >
              <VerifyEmailView email={registeredEmail} />
            </motion.div>
          ) : (
            <motion.div
              key="registration-form"
              initial={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full absolute"
            >
              <div className="flex flex-col md:flex-row gap-8 lg:gap-12 w-full h-full max-w-6xl mx-auto">
                <div className="flex flex-col flex-1 gap-8 justify-center">
                  <div className="text-center md:text-start">
                    <h2 className="text-7xl font-bold mb-10">Join Us!</h2>
                    <p className="leading-loose text-xl">
                      Become a part of a growing community of data science
                      enthusiasts and participate in engaging discussions,
                      hands-on projects, and networking opportunities.
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
