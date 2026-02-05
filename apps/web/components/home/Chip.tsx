import { ReactNode } from "react";

interface ChipProps {
  icon: ReactNode;
  href: string;
  children: ReactNode;
}

export default function Chip({ icon, href, children }: Readonly<ChipProps>) {
  return (
    <div className="bg-gradient-purple p-px rounded-full">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 rounded-full bg-black py-3 pl-4 pr-5"
      >
        {icon}
        <p className="font-semibold text-white">{children}</p>
      </a>
    </div>
  );
}
