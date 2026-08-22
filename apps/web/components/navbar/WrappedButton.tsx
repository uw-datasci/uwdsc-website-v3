"use client";

import { NavigationMenuItem } from "@uwdsc/ui";

interface WrappedButtonProps {
  readonly onClick: () => void;
}

function WrappedIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-6 w-6"
      aria-hidden="true"
    >
      <rect x="3.5" y="7.5" width="11" height="13" rx="2" transform="rotate(-10 9 14)" />
      <rect x="9.5" y="2.5" width="11" height="13" rx="2" transform="rotate(8 15 9)" />
    </svg>
  );
}

export function WrappedButton({ onClick }: WrappedButtonProps) {
  return (
    <NavigationMenuItem className="relative flex items-center">
      <button
        type="button"
        onClick={onClick}
        aria-label="DSC Wrapped"
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-transparent p-0 leading-none transition-colors hover:text-nav-hover-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <WrappedIcon />
      </button>
    </NavigationMenuItem>
  );
}
