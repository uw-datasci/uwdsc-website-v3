import Image from "next/image";
import { ExecMember } from "@uwdsc/common/types";

interface TeamCardProps {
  readonly member: ExecMember;
}

export default function TeamCard({ member }: TeamCardProps) {
  return (
    <div className="w-full rounded-2xl border border-gray-500/50 bg-background px-6 pb-8 pt-7 text-center transition-all duration-300 hover:border-muted-foreground/80 sm:w-60 xl:w-70 xl:rounded-3xl">
      <Image
        src={`${member.photo_url}?v=${member.updated_at}`}
        alt={member.name}
        width={160}
        height={160}
        className="mb-6 inline-block aspect-square w-32 rounded-lg object-cover xl:w-40"
      />
      <h4 className="mb-2.5 text-xl font-semibold text-foreground xl:text-2xl">
        {member.name}
      </h4>
      <p className="font-medium text-muted-foreground xl:text-lg">
        {member.position}
      </p>
    </div>
  );
}
