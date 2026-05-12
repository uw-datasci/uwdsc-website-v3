import Image from "next/image";
import { EXEC_TEAM_PHOTO_PLACEHOLDER, type ExecMember } from "@uwdsc/common/types";
import { Card, CardHeader, CardTitle, CardDescription } from "@uwdsc/ui";
import teamPhotoPlaceholder from "@/public/placeholder/team.png";

interface TeamCardProps {
  readonly member: ExecMember;
}

export default function TeamCard({ member }: TeamCardProps) {
  const imageSrc =
    member.photo_url === EXEC_TEAM_PHOTO_PLACEHOLDER ? teamPhotoPlaceholder : member.photo_url;

  return (
    <Card className="relative w-full max-w-xs overflow-hidden border-0 bg-linear-to-br from-gray-900 to-black p-0 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
      {/* Member Image */}
      <div className="relative h-80 w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={member.name}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
      </div>

      {/* Member Info */}
      <CardHeader className="relative z-10 -mt-16 bg-linear-to-t from-black to-transparent px-6 pb-4 pt-16">
        <CardTitle className="text-xl font-bold text-white">{member.name}</CardTitle>
        <CardDescription className="text-sm font-medium text-gray-300">
          {member.position}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
