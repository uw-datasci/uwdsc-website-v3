"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, X, Loader2 } from "lucide-react";
import { Card, CardContent } from "@uwdsc/ui";

interface PassportPhotoUploadProps {
  readonly initials: string;
  readonly photoUrl?: string | null;
  readonly displayName: string;
  readonly onPhotoUpload: (file: File) => Promise<void>;
  readonly onPhotoDelete: () => Promise<void>;
}

const IMAGE_ACCEPT = "image/jpeg,image/jpg,image/png,image/webp";
const IMAGE_MAX_MB = 5;
const IMAGE_MAX_BYTES = IMAGE_MAX_MB * 1024 * 1024;

export function PassportPhotoUpload({
  initials,
  photoUrl,
  displayName,
  onPhotoUpload,
  onPhotoDelete,
}: Readonly<PassportPhotoUploadProps>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(photoUrl ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

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
      setCurrentPhoto(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Call the prop handler for upload
    setIsLoading(true);
    try {
      await onPhotoUpload(file);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed. Try again.";
      setError(message);
      setCurrentPhoto(photoUrl ?? null);
    } finally {
      setIsLoading(false);
    }

    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    setError(null);
    setIsLoading(true);

    try {
      await onPhotoDelete();
      setCurrentPhoto(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Delete failed. Try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowDeleteConfirm(false);
  };

  const handleAvatarClick = () => {
    if (!isLoading && !showDeleteConfirm) {
      fileInputRef.current?.click();
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardContent className="px-6">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="relative flex-shrink-0"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <button
              onClick={handleAvatarClick}
              disabled={isLoading}
              className="relative w-16 h-16 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background"
              aria-label="Upload photo"
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
                <div
                  className={`w-full h-full flex items-center justify-center text-2xl font-bold bg-gradient-to-br from-slate-800 to-slate-900 text-slate-300 transition-opacity duration-200 ${
                    isLoading ? "opacity-40" : "opacity-100"
                  }`}
                >
                  {initials}
                </div>
              )}

              {/* Loading Spinner Overlay */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <Loader2 className="w-4 h-4 text-slate-300 animate-spin" />
                </div>
              )}
            </button>

            {/* Camera Badge */}
            {!isLoading && (
              <button
                onClick={handleAvatarClick}
                disabled={isLoading}
                className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center bg-slate-700 border border-slate-500 hover:border-slate-400 transition-colors"
                aria-label="Change photo"
              >
                <Camera className="w-3 h-3 text-slate-300" />
              </button>
            )}

            {/* Delete Badge */}
            {currentPhoto && !isLoading && (
              <button
                onClick={handleDeleteClick}
                className={`absolute top-0 right-0 w-5 h-5 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-700 border border-red-400/50 transition-all ${
                  isHovering ? "opacity-100" : "opacity-0 md:opacity-0"
                } md:hover:opacity-100`}
                aria-label="Delete photo"
              >
                <X className="w-2.5 h-2.5 text-white" />
              </button>
            )}
          </div>

          {/* Info and Actions */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-foreground truncate">{displayName}</h3>
            <p className="text-xs text-muted-foreground">
              JPG or PNG, up to {IMAGE_MAX_MB}MB
            </p>

            {error && (
              <p className="text-xs text-red-400 mt-2">{error}</p>
            )}

            {showDeleteConfirm && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleCancel}
                  className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 border border-slate-500 rounded transition-colors text-slate-200"
                >
                  Keep
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isLoading}
                  className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 border border-red-500 rounded transition-colors text-white disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

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
      </CardContent>
    </Card>
  );
}
