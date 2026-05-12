import { ResetPasswordForm } from "@/components/reset-password/ResetPasswordForm";
import { Typing } from "@/components/login/Typing";
import Image from "next/image";

export default function ResetPasswordPage() {
  return (
    <div className="bg-black w-full min-h-screen flex flex-col items-center justify-center px-12 py-8">
      <div className="w-full mb-8">
        <Typing
          text="UW Data Science Club"
          speed={75}
          caretSize="text-[42px] font-semibold"
          className="text-3xl font-bold text-white"
        />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 w-full h-full max-w-6xl mx-auto">
          <div className="flex flex-col flex-1 gap-8 justify-center">
            <div className="hidden md:block relative w-40 h-40">
              <Image
                src="/logos/dsc.svg"
                alt="uwdsc logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h2 className="text-7xl font-bold text-center md:text-start my-10">
                Set a new password
              </h2>
              <div className="flex flex-col gap-8 leading-loose text-xl text-center md:text-start">
                <p>
                  Choose a new password for your account. It needs to be at
                  least 8 characters long.
                </p>
              </div>
            </div>
          </div>
          <div className="hidden md:block w-px self-stretch bg-gray-500/60" />
          <div className="w-full h-full flex-1 my-auto">
            <ResetPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
