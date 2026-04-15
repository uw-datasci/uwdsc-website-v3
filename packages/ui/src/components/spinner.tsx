import { Loader2Icon } from "lucide-react";

import { cn } from "@uwdsc/ui/lib/utils";

function Spinner({ className, ...props }: Readonly<React.ComponentProps<"svg">>) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin text-primary", className)}
      {...props}
    />
  );
}

export { Spinner };
