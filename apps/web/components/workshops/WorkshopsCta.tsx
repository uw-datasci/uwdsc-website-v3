import Link from "next/link";
import { Button } from "@uwdsc/ui";

/** Closing call-to-action, mirroring ProjectsCta.tsx's structure and button treatments. */
export function WorkshopsCta() {
  return (
    <div className="mt-20 flex flex-col items-center gap-4 text-center">
      <p className="text-grey2">Got a topic you want us to cover?</p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button
          asChild
          size="lg"
          className="bg-gradient-purple rounded-full px-6 py-6 text-sm font-bold text-white transition-transform hover:scale-105"
        >
          <Link href="/calendar">See the full calendar →</Link>
        </Button>
        <div className="rounded-full bg-linear-to-tr from-pink-500 to-indigo-700 p-px">
          <Button asChild variant="ghost" size="lg" className="bg-background px-6 py-6 text-sm">
            <Link href="/#contact">Suggest a workshop →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
