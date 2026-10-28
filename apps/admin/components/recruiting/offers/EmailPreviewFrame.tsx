import { Spinner } from "@uwdsc/ui";

/** The rendered email, sandboxed so its HTML can't touch the page. */
export function EmailPreviewFrame({
  html,
  subject,
  loading,
  error,
}: {
  readonly html: string | null;
  readonly subject: string | null;
  readonly loading: boolean;
  readonly error: string | null;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[13px] font-semibold">Email preview</h3>
        {subject && (
          <span className="truncate text-xs text-muted-foreground">Subject: {subject}</span>
        )}
      </div>
      <div className="relative h-64 overflow-hidden sm:h-80 rounded-lg border bg-muted/40">
        {html && (
          <iframe
            title="Email preview"
            sandbox=""
            srcDoc={html}
            className="size-full bg-white"
          />
        )}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <Spinner className="size-6" />
          </div>
        )}
        {error && !loading && (
          <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
