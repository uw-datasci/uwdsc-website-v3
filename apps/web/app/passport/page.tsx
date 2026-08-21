"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { QrCode, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PassportProfile, PassportPhotoUpload, PassportQRCode } from "@/components/passport";
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
  const [showQr, setShowQr] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<PassportProfileEditValues>({
    resolver: zodResolver(passportProfileEditSchema),
    defaultValues: passportProfileEditDefaultValues,
    mode: "onTouched",
  });
  const { reset } = form;

  const demoStamps = [
    { label: "Hack Night", accent: "from-cyan-300 to-sky-500", mark: "DSC" },
    { label: "Workshop", accent: "from-amber-300 to-orange-500", mark: "101" },
    { label: "Social", accent: "from-fuchsia-300 to-pink-500", mark: "FRI" },
    { label: "Datathon", accent: "from-emerald-300 to-teal-500", mark: "202" },
    { label: "Speaker", accent: "from-violet-300 to-indigo-500", mark: "LIVE" },
    { label: "Bonus", accent: "from-rose-300 to-red-500", mark: "+1" },
  ] as const;

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
  const detailBlocks = [
    { label: "Email", value: user?.email ?? "-" },
    { label: "WatIam", value: user?.wat_iam ?? "-" },
    { label: "Faculty", value: facultyLabel ?? "-" },
    { label: "Term", value: user?.term ?? "-" },
  ];

  return (
    <main className="flex min-h-dvh flex-col items-center bg-[#000000] px-4 pb-14 pt-24 lg:px-8 lg:pt-32">
      <section className="grid w-full max-w-5xl gap-4 lg:grid-cols-[minmax(320px,390px)_minmax(0,1fr)] lg:gap-6">
        <div className="space-y-4 lg:sticky lg:top-30 lg:self-start lg:w-full lg:max-w-97.5">
          <div className="relative rounded-3xl border border-zinc-800 bg-[#0f0f11] p-4">
            <button
              type="button"
              onClick={() => setShowQr((prev) => !prev)}
              className="absolute left-3 top-3 z-10 inline-flex size-9 items-center justify-center rounded-full border border-zinc-700 bg-black/70 text-zinc-100 transition hover:bg-zinc-900"
              aria-label={showQr ? "Show profile" : "Show QR code"}
            >
              {showQr ? <UserRound className="size-4" /> : <QrCode className="size-4" />}
            </button>

            <div className="h-44" style={{ perspective: 1200 }}>
              <motion.div
                className="relative h-full w-full"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: showQr ? 180 : 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              >
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <PassportPhotoUpload
                    initials={initials}
                    photoKey={user?.profile_photo_key}
                    displayName={displayName}
                    onPhotoUpload={handlePhotoUpload}
                    onPhotoDelete={handlePhotoDelete}
                  />
                </div>

                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <div className="relative flex size-36 items-center justify-center overflow-hidden rounded-full border-4 border-zinc-600/70 bg-zinc-950 shadow-[0_0_0_6px_rgba(63,63,70,0.35)]">
                    <div className="absolute inset-0 bg-linear-to-br from-sky-950 via-blue-900 to-zinc-900" />
                    <span className="pointer-events-none absolute left-5 top-5 size-3.5 rounded-tl-sm border-l-2 border-t-2 border-white/20" />
                    <span className="pointer-events-none absolute right-5 top-5 size-3.5 rounded-tr-sm border-r-2 border-t-2 border-white/20" />
                    <span className="pointer-events-none absolute bottom-5 left-5 size-3.5 rounded-bl-sm border-b-2 border-l-2 border-white/20" />
                    <span className="pointer-events-none absolute bottom-5 right-5 size-3.5 rounded-br-sm border-b-2 border-r-2 border-white/20" />
                    <div className="relative">
                      <PassportQRCode
                        userId={user?.id ?? ""}
                        membershipId={membershipStatus?.membership_id ?? null}
                        size={96}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
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

        <div className="min-w-0 space-y-4">
          <div className="grid min-w-0 grid-cols-2 gap-2.5 sm:gap-3">
            {detailBlocks.map(({ label, value }, index) => (
              <div
                key={`detail-${index}`}
                className="flex min-h-20 min-w-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-center sm:min-h-24"
              >
                <span className="min-w-0 truncate text-xs font-medium text-zinc-400 sm:text-sm">
                  {label}: {value}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-1">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
                  my stamps
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  Scroll sideways to see more stamps.
                </p>
              </div>
              <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                6 demo stamps
              </span>
            </div>

            <div className="mt-3 w-full max-w-full overflow-x-auto overscroll-x-contain pb-2">
              <div className="flex w-max gap-4 pr-1">
                {demoStamps.map(({ label, accent, mark }, index) => (
                  <div
                    key={`stamp-${label}`}
                    className="group relative min-w-36 shrink-0 snap-start overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-3 shadow-[0_14px_30px_rgba(0,0,0,0.28)]"
                  >
                    <div className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${accent}`} />
                    <div className="flex h-full min-h-32 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                            Stamp {index + 1}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-white">{label}</p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-1 items-center justify-center rounded-2xl border border-white/8 bg-white/5 px-3 py-4">
                        <div
                          className={`flex size-18 items-center justify-center rounded-full bg-linear-to-br ${accent} text-sm font-black tracking-[0.18em] text-white shadow-[0_12px_24px_rgba(0,0,0,0.28)]`}
                        >
                          {mark}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
