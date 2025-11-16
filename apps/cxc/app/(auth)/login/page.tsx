"use client";

import DSCLogo from "@/components/DSCLogo";
import { LoginForm } from "@/components/login/LoginForm";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  return (
    <div className="bg-black w-full min-h-screen flex flex-col items-center justify-center px-12 py-8">
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 w-full h-full max-w-6xl mx-auto">
          <div className="flex flex-col flex-1 gap-8 justify-center">
            <DSCLogo
              size={40}
              className="hidden md:block"
              onClick={() => router.push("/")}
            />
            <div className="">
              <h2 className="text-7xl font-bold text-center md:text-start my-10">
                Sign in
              </h2>
              <div className="flex flex-col gap-8 leading-loose text-xl text-center md:text-start">
                <p>
                  Already a member? Sign in here to access your profile and
                  membership.
                </p>
              </div>
            </div>
          </div>
          <div className="hidden md:block w-px self-stretch bg-gray-500/60" />
          <div className="w-full h-full flex-1 my-auto">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
