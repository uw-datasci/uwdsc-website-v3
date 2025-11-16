import Image from "next/image";

interface DSCLogoProps {
  size?: number;
  className?: string;
  onClick?: () => void;
}
export default function DSCLogo({
  size = 24,
  className,
  onClick,
}: DSCLogoProps) {
  return (
    <div
      className={`relative w-${size} h-${size} ${className} ${onClick ? "hover:cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <Image
        src="/logos/dsc.svg"
        alt="uwdsc logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
