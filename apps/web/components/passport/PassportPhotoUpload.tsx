"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Camera, X, Loader2 } from "lucide-react";
import { useProfilePhotoUrl } from "@/hooks/useProfilePhotoUrl";

interface PassportPhotoUploadProps {
  readonly initials: string;
  readonly photoKey?: string | null;
  readonly displayName: string;
  readonly onPhotoUpload: (file: File) => Promise<void>;
  readonly onPhotoDelete: () => Promise<void>;
}

const IMAGE_ACCEPT = "image/jpeg,image/jpg,image/png,image/webp";
const IMAGE_MAX_MB = 5;
const IMAGE_MAX_BYTES = IMAGE_MAX_MB * 1024 * 1024;

export function PassportPhotoUpload({
  initials,
  photoKey,
  displayName,
  onPhotoUpload,
  onPhotoDelete,
}: Readonly<PassportPhotoUploadProps>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resolvedPhotoUrl = useProfilePhotoUrl(photoKey);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const currentPhoto = previewPhoto ?? resolvedPhotoUrl;

  useEffect(() => {
    setPreviewPhoto(null);
  }, [photoKey]);

  const handlePhotoSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file type
    if (!IMAGE_ACCEPT.includes(file.type)) {
      setError("Please upload a JPG, PNG, or WEBP image");
      return;
    }

    // Validate file size
    if (file.size > IMAGE_MAX_BYTES) {
      setError(`File is too large. Max ${IMAGE_MAX_MB}MB allowed`);
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewPhoto(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Call the prop handler for upload
    setIsLoading(true);
    try {
      await onPhotoUpload(file);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed. Try again.";
      setError(message);
      setPreviewPhoto(null);
    } finally {
      setIsLoading(false);
    }

    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    setError(null);
    setIsLoading(true);

    try {
      await onPhotoDelete();
      setPreviewPhoto(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Delete failed. Try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarClick = () => {
    if (!isLoading && !showDeleteConfirm) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="relative">
        <button
          type="button"
          onClick={handleAvatarClick}
          disabled={isLoading}
          aria-label="Upload photo"
          className="relative flex size-36 items-center justify-center overflow-hidden rounded-full border-4 border-zinc-600/70 bg-zinc-950 shadow-[0_0_0_6px_rgba(63,63,70,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          {currentPhoto ? (
            <Image
              src={currentPhoto}
              alt={displayName}
              fill
              className={`object-cover transition-opacity duration-200 ${
                isLoading ? "opacity-40" : "opacity-100"
              }`}
            />
          ) : (
            <span
              className={`flex size-full items-center justify-center rounded-full bg-linear-to-br from-sky-950 via-blue-900 to-zinc-900 text-4xl font-semibold text-white transition-opacity duration-200 ${
                isLoading ? "opacity-40" : "opacity-100"
              }`}
            >
              {initials}
            </span>
          )}

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Loader2 className="size-5 animate-spin text-zinc-200" />
            </div>
          )}
        </button>

        {!isLoading && (
          <button
            type="button"
            onClick={handleAvatarClick}
            className="absolute bottom-0.5 right-0.5 inline-flex size-8 items-center justify-center rounded-full border border-zinc-700 bg-black/80 text-zinc-100 transition hover:bg-zinc-900"
            aria-label="Change photo"
          >
            <Camera className="size-3.5" />
          </button>
        )}

        {currentPhoto && !isLoading && (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="absolute right-0 top-0 inline-flex size-6 items-center justify-center rounded-full border border-red-400/50 bg-red-600 text-white transition hover:bg-red-700"
            aria-label="Delete photo"
          >
            <X className="size-3" />
          </button>
        )}
      </div>

      {error && <p className="text-center text-xs text-red-400">{error}</p>}

      {showDeleteConfirm && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(false)}
            className="rounded-md border border-zinc-600 bg-zinc-800 px-3 py-1 text-xs text-zinc-200 transition hover:bg-zinc-700"
          >
            Keep
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={isLoading}
            className="rounded-md border border-red-500 bg-red-600 px-3 py-1 text-xs text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        onChange={handlePhotoSelect}
        disabled={isLoading}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
}
