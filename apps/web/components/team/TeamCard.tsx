"use client";

import Image from "next/image";
import { Card, CardDescription, CardHeader, CardTitle } from "@uwdsc/ui";
import { Member } from "@/types/team";

interface TeamCardProps {
  readonly member: Member;
}

export default function TeamCard({ member }: TeamCardProps) {
  return (
    <Card
      className="group relative w-full max-w-xs overflow-hidden border-0 bg-gradient-to-br from-gray-900
      to-black p-0 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
    >
      {/* Member Image */}
      <div className="relative h-80 w-full overflow-hidden">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      {/* Member Info */}
      <CardHeader className="relative z-10 -mt-16 bg-gradient-to-t from-black to-transparent px-6 pb-4 pt-16">
        <CardTitle className="text-xl font-bold text-white">
          {member.name}
        </CardTitle>
        <CardDescription className="text-sm font-medium text-gray-300">
          {member.position}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
