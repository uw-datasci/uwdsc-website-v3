import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Typing } from "./Typing";

interface AuthHeaderProps {
  readonly showHomeLink?: boolean;
  readonly className?: string;
}

export function AuthHeader({ showHomeLink = true, className = "" }: AuthHeaderProps) {
  return (
    <div className={`flex w-full items-center justify-between gap-4 ${className}`}>
      <Typing
        text="UW Data Science Club"
        speed={75}
        caretSize="text-2xl font-semibold sm:text-3xl md:text-[42px]"
        className="text-xl font-bold text-white sm:text-2xl md:text-3xl"
      />
      {showHomeLink && (
        <Link
          href="/"
          className="flex shrink-0 items-center gap-1.5 rounded-md text-sm font-medium text-gray-400 transition-colors hover:text-white sm:text-base"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span className="sm:hidden">Home</span>
          <span className="hidden sm:inline">Back to home</span>
        </Link>
      )}
    </div>
  );
}
