"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/api";
import CxCButton from "../CxCButton";
import { ArrowRightIcon } from "@uwdsc/ui/index";
import { motion } from "framer-motion";
import DSCLogo from "../DSCLogo";

interface NavbarProps {
  readonly showAuthButtons?: boolean;
}

export default function Navbar({ showAuthButtons = true }: NavbarProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, mutate } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      await mutate(); // Refresh auth state
      router.push("/");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <div className="w-full px-8 py-6 flex items-center justify-between bg-background">
      {/* Left section - Logo and description */}
      <div className="flex items-start md:gap-8 lg:gap-24 xl:gap-36">
        {/* Logo */}
        <DSCLogo size={16} href="/" />

        {/* Description */}
        <div className="hidden md:block text-white max-w-sm lg:max-w-lg">
          <p className="text-xs lg:text-sm leading-relaxed">
            Canada&apos;s largest student run data hackathon.
            <br />
            We are a beginner-friendly datathon that bring together students and
            companies to build projects that solve real-world problems.
          </p>
        </div>
      </div>
      {showAuthButtons && (
        <>
          {!isLoading && (
            <div className="flex flex-row gap-4">
              {!isAuthenticated && (
                <>
                  <CxCButton
                    onClick={() => router.push("/login")}
                    className="group text-base lg:text-lg inline-flex items-center lg:px-6"
                  >
                    <span>Login</span>
                    <motion.div
                      className="group-hover:translate-x-1.5 duration-200"
                      transition={{
                        ease: "easeInOut",
                      }}
                    >
                      <ArrowRightIcon weight="bold" />
                    </motion.div>
                  </CxCButton>
                  <CxCButton
                    onClick={() => router.push("/register")}
                    className="group text-base lg:text-lg inline-flex items-center lg:px-6"
                  >
                    <span>Register</span>
                    <motion.div
                      className="group-hover:translate-x-1.5 duration-200"
                      transition={{
                        ease: "easeInOut",
                      }}
                    >
                      <ArrowRightIcon weight="bold" />
                    </motion.div>
                  </CxCButton>
                </>
              )}
              {isAuthenticated && (
                <CxCButton
                  onClick={handleSignOut}
                  className="group text-base lg:text-lg inline-flex items-center lg:px-6"
                >
                  <span>Signout</span>
                  <motion.div
                    className="group-hover:translate-x-1.5 duration-200"
                    transition={{
                      ease: "easeInOut",
                    }}
                  >
                    <ArrowRightIcon weight="bold" />
                  </motion.div>
                </CxCButton>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
