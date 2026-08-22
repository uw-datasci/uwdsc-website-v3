"use client";

import { useEffect, useRef, useState } from "react";
import type { Control } from "react-hook-form";
import { CircleCheck, CircleHelp, CircleX, Trash2 } from "lucide-react";
import { Button, FormControl, FormField, FormItem, FormMessage, Input, cn } from "@uwdsc/ui";
import { checkResourceLink, type LinkCheckResult } from "@/lib/api/events";
import type { CreateEventFormValues } from "@/lib/schemas/event";

const CHECK_DEBOUNCE_MS = 500;

interface ResourceLinkRowProps {
  readonly control: Control<CreateEventFormValues>;
  readonly index: number;
  readonly onRemove: () => void;
}

/**
 * One "source + link" row inside the workshop resources field array. Owns its own reachability
 * check state -- the check is advisory-only (see linkCheckService) and never touches form state
 * or blocks submission.
 */
export function ResourceLinkRow({ control, index, onRemove }: Readonly<ResourceLinkRowProps>) {
  const [checkResult, setCheckResult] = useState<LinkCheckResult | "checking" | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleUrlBlur = (url: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = url.trim();
    if (!trimmed) {
      setCheckResult(null);
      return;
    }

    const requestId = ++requestIdRef.current;
    debounceRef.current = setTimeout(async () => {
      setCheckResult("checking");
      try {
        const result = await checkResourceLink(trimmed);
        if (requestIdRef.current === requestId) setCheckResult(result);
      } catch {
        // Advisory only -- a failed check request itself just means no hint, not an error.
        if (requestIdRef.current === requestId) setCheckResult(null);
      }
    }, CHECK_DEBOUNCE_MS);
  };

  return (
    <div className="flex flex-col gap-2 rounded-md border p-3">
      <div className="flex items-start gap-2">
        <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
          <FormField
            control={control}
            name={`resources.${index}.source`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Source (e.g. Slides)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`resources.${index}.url`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="https://..."
                    {...field}
                    onBlur={(e) => {
                      field.onBlur();
                      handleUrlBlur(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Remove resource"
          onClick={onRemove}
        >
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </div>
      <LinkCheckHint result={checkResult} />
    </div>
  );
}

function LinkCheckHint({ result }: Readonly<{ result: LinkCheckResult | "checking" | null }>) {
  if (result === null) return null;

  if (result === "checking") {
    return <p className="text-xs text-muted-foreground">Checking link…</p>;
  }

  const iconClass = "size-3.5 shrink-0";
  const styles: Record<LinkCheckResult["status"], string> = {
    ok: "text-emerald-600 dark:text-emerald-400",
    unknown: "text-amber-600 dark:text-amber-400",
    unreachable: "text-destructive",
  };
  const icons: Record<LinkCheckResult["status"], React.ReactNode> = {
    ok: <CircleCheck className={iconClass} />,
    unknown: <CircleHelp className={iconClass} />,
    unreachable: <CircleX className={iconClass} />,
  };

  return (
    <p className={cn("flex items-center gap-1.5 text-xs", styles[result.status])}>
      {icons[result.status]}
      {result.detail}
    </p>
  );
}
