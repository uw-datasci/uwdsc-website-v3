"use client";

import { useCallback, useState } from "react";
import { FileUp, CheckCircle2 } from "lucide-react";

const ACCEPTED_TYPES = "image/png,image/jpeg,image/webp,application/pdf";
const MAX_SIZE_MB = 10;
const ALLOWED_MIME = new Set(["image/png", "image/jpeg", "image/webp", "application/pdf"]);

interface ProofUploadProps {
  readonly file: File | null;
  readonly onFileChange: (file: File | null) => void;
  /** Submit-time error from the parent (e.g. nothing selected, upload failed). */
  readonly error?: string | null;
  readonly disabled?: boolean;
}

/**
 * Picks a proof file and hands it to the parent. It does **not** upload —
 * the parent uploads on submit, so abandoning the form never writes to storage.
 */
export function ProofUpload({
  file,
  onFileChange,
  error = null,
  disabled = false,
}: ProofUploadProps) {
  const [localError, setLocalError] = useState<string | null>(null);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selected = event.target.files?.[0] ?? null;
      // Allow re-picking the same file after a validation failure.
      event.target.value = "";

      if (!selected) return;

      if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
        setLocalError(`File must be under ${MAX_SIZE_MB} MB`);
        onFileChange(null);
        return;
      }

      if (!ALLOWED_MIME.has(selected.type)) {
        setLocalError("Allowed formats: PNG, JPG, WEBP, PDF");
        onFileChange(null);
        return;
      }

      setLocalError(null);
      onFileChange(selected);
    },
    [onFileChange]
  );

  const shownError = localError ?? error;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">
        Proof of payment <span className="text-red-500">*</span>
      </p>

      <label
        className={`flex h-40 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/40 transition-colors ${
          shownError ? "border-destructive/60" : "border-border"
        } ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-muted/80"}`}
      >
        <input
          type="file"
          className="hidden"
          accept={ACCEPTED_TYPES}
          disabled={disabled}
          onChange={handleFileChange}
        />
        {file ? (
          <CheckCircle2 className="size-8 text-emerald-500" />
        ) : (
          <FileUp className="size-8 text-muted-foreground" />
        )}
        <span className="mt-2 max-w-[85%] truncate text-sm text-muted-foreground">
          {file ? file.name : "Choose a file to upload when you submit"}
        </span>
        <span className="mt-1 text-xs text-muted-foreground">
          PNG, JPG, WEBP or PDF (max {MAX_SIZE_MB} MB)
        </span>
      </label>

      {shownError ? <p className="text-sm text-destructive">{shownError}</p> : null}
    </div>
  );
}
