"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PassportHeader, MembershipCta, PassportProfile } from "@/components/passport";
import { useAuth } from "@/contexts/AuthContext";
import { getMembershipStatus, updateUserProfile } from "@/lib/api/profile";
import { facultyLabelToValue, facultyValueToLabel } from "@/constants/profile";
import {
  passportProfileEditSchema,
  passportProfileEditDefaultValues,
  type PassportProfileEditValues,
} from "@/lib/schemas/profile";
import type { MembershipStatus } from "@uwdsc/common/types";
import { Spinner } from "@uwdsc/ui";

export default function PassportPage() {
  const { user, isLoading: authLoading, mutate } = useAuth();
  const [membershipStatus, setMembershipStatus] = useState<MembershipStatus | null>(null);
  const [membershipLoading, setMembershipLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<PassportProfileEditValues>({
    resolver: zodResolver(passportProfileEditSchema),
    defaultValues: passportProfileEditDefaultValues,
    mode: "onTouched",
  });
  const { reset } = form;

  useEffect(() => {
    getMembershipStatus()
      .then(setMembershipStatus)
      .catch(console.error)
      .finally(() => setMembershipLoading(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    reset({
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
      wat_iam: user.wat_iam ?? "",
      faculty: user.faculty ? (facultyValueToLabel[user.faculty] ?? "") : "",
      term: user.term ?? "",
    });
  }, [user, reset]);

  const onSubmit = async (data: PassportProfileEditValues) => {
    try {
      await updateUserProfile({
        first_name: data.first_name,
        last_name: data.last_name,
        wat_iam: data.wat_iam,
        faculty: facultyLabelToValue[data.faculty] ?? "math",
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
        faculty: user.faculty ? (facultyValueToLabel[user.faculty] ?? "") : "",
        term: user.term ?? "",
      });
    }
    setIsEditing(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  const initials =
    [user?.first_name?.[0], user?.last_name?.[0]].filter(Boolean).join("").toUpperCase() || "?";
  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "Unknown Member";
  const isMember = membershipStatus?.has_membership && user?.is_math_soc_member;
  const facultyLabel = user?.faculty == null ? undefined : facultyValueToLabel[user.faculty];

  return (
    <main className="flex min-h-dvh flex-col items-center px-4 pb-16 pt-28 lg:pt-32">
      <div className="w-full max-w-2xl space-y-4">
        <PassportHeader
          initials={initials}
          displayName={displayName}
          email={user?.email}
          membershipLoading={membershipLoading}
          isMember={!!isMember}
          execPositionLabel={user?.exec_position_name}
        />

        <PassportProfile
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onCancel={handleCancel}
          form={form}
          onSubmit={onSubmit}
          displayName={displayName}
          email={user?.email ?? "—"}
          watIam={user?.wat_iam ?? "—"}
          facultyLabel={facultyLabel ?? "—"}
          term={user?.term ?? "—"}
        />

        {!membershipLoading && !isMember ? (
          <MembershipCta profileId={user?.id ?? null} />
        ) : null}
      </div>
    </main>
  );
}
