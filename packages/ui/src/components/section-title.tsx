type SectionTitleProps = {
  mb: string;
  children: string;
  className?: string;
};

export function SectionTitle({
  mb,
  children,
  className,
}: Readonly<SectionTitleProps>) {
  return (
    <h2
      className={`text-center font-family-clash font-medium tracking-[10px] md:text-lg xl:text-xl ${mb} ${className || ""}`}
    >
      <span className="gradient-text -mr-2 bg-linear-to-b from-white to-[#ffffff20]">
        {children.toUpperCase()}
      </span>
    </h2>
  );
}
