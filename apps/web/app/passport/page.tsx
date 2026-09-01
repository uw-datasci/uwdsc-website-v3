"use client";

import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PassportProfile,
  PassportPhotoUpload,
  PassportQRButton,
  PassportStamps,
  PassportScanHandler,
  type PassportStampData,
} from "@/components/passport";
import { useAuth } from "@/contexts/AuthContext";
import { getMembershipStatus, updateUserProfile } from "@/lib/api/profile";
import { uploadProfilePhoto, deleteProfilePhoto } from "@/lib/api/profile-photo";
import { FACULTY_LABELS, FACULTY_PROFILE_LABEL_TO_VALUE } from "@uwdsc/common/constants";
import type { MembershipStatus } from "@uwdsc/common/types";
import {
  passportProfileEditSchema,
  passportProfileEditDefaultValues,
  type PassportProfileEditValues,
} from "@/lib/schemas/profile";
import { Spinner } from "@uwdsc/ui";

export default function PassportPage() {
  const { user, isLoading: authLoading, mutate } = useAuth();
  const [membershipStatus, setMembershipStatus] = useState<MembershipStatus | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<PassportProfileEditValues>({
    resolver: zodResolver(passportProfileEditSchema),
    defaultValues: passportProfileEditDefaultValues,
    mode: "onTouched",
  });
  const { reset } = form;

  // TODO: replace with actual stamps pulled from db
  const demoStamps: PassportStampData[] = [
    { label: "Hack Night", accent: "from-cyan-300 to-sky-500", mark: "DSC" },
    { label: "Workshop", accent: "from-amber-300 to-orange-500", mark: "101" },
    { label: "Social", accent: "from-fuchsia-300 to-pink-500", mark: "FRI" },
    { label: "Datathon", accent: "from-emerald-300 to-teal-500", mark: "202" },
    { label: "Speaker", accent: "from-violet-300 to-indigo-500", mark: "LIVE" },
    { label: "Bonus", accent: "from-rose-300 to-red-500", mark: "+1" },
  ];

  useEffect(() => {
    getMembershipStatus().then(setMembershipStatus).catch(console.error);
  }, []);

  useEffect(() => {
    if (!user) return;
    reset({
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
      wat_iam: user.wat_iam ?? "",
      faculty: user.faculty ? (FACULTY_LABELS[user.faculty] ?? "") : "",
      term: user.term ?? "",
    });
  }, [user, reset]);

  const onSubmit = async (data: PassportProfileEditValues) => {
    try {
      await updateUserProfile({
        first_name: data.first_name,
        last_name: data.last_name,
        wat_iam: data.wat_iam,
        faculty: FACULTY_PROFILE_LABEL_TO_VALUE[data.faculty] ?? "math",
        term: data.term,
      });
      await mutate();
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    if (user) {
      reset({
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        wat_iam: user.wat_iam ?? "",
        faculty: user.faculty ? (FACULTY_LABELS[user.faculty] ?? "") : "",
        term: user.term ?? "",
      });
    }
    setIsEditing(false);
  };

  const handlePhotoUpload = async (file: File) => {
    try {
      await uploadProfilePhoto(file);
      await mutate();
    } catch (err) {
      throw err instanceof Error ? err : new Error("Upload failed");
    }
  };

  const handlePhotoDelete = async () => {
    try {
      await deleteProfilePhoto();
      await mutate();
    } catch (err) {
      throw err instanceof Error ? err : new Error("Delete failed");
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-black">
        <Spinner className="size-8" />
      </div>
    );
  }

  const initials =
    [user?.first_name?.[0], user?.last_name?.[0]].filter(Boolean).join("").toUpperCase() || "?";
  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "Unknown Member";
  const facultyLabel = user?.faculty == null ? undefined : FACULTY_LABELS[user.faculty];

  return (
    <main className="flex min-h-dvh flex-col items-center bg-[#000000] px-4 pb-14 pt-24 lg:px-8 lg:pt-32">
      <div className="w-full max-w-5xl space-y-4">
        <Suspense fallback={null}>
          <PassportScanHandler />
        </Suspense>
        <section className="grid gap-4 lg:grid-cols-[minmax(320px,390px)_minmax(0,1fr)] lg:gap-6">
          <div className="space-y-4 lg:sticky lg:top-30 lg:self-start lg:w-full lg:max-w-97.5">
            <div className="relative rounded-3xl border border-zinc-800 bg-[#0f0f11] p-4">
              <PassportQRButton
                userId={user?.id ?? ""}
                membershipId={membershipStatus?.membership_id ?? null}
                className="absolute left-3 top-3 z-10"
              />

              <div className="flex h-44 items-center justify-center">
                <PassportPhotoUpload
                  initials={initials}
                  photoKey={user?.profile_photo_key}
                  displayName={displayName}
                  onPhotoUpload={handlePhotoUpload}
                  onPhotoDelete={handlePhotoDelete}
                />
              </div>
            </div>

            <PassportProfile
              isEditing={isEditing}
              onEdit={() => setIsEditing(true)}
              onCancel={handleCancel}
              form={form}
              onSubmit={onSubmit}
              displayName={displayName}
              email={user?.email ?? "-"}
              watIam={user?.wat_iam ?? "-"}
              facultyLabel={facultyLabel ?? "-"}
              term={user?.term ?? "-"}
            />
          </div>

          <div className="min-w-0 lg:h-full">
            <PassportStamps stamps={demoStamps} />
          </div>
        </section>
      </div>
    </main>
  );
}
