interface HomeSectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function SectionWrapper({
  children,
  className,
  id,
}: HomeSectionWrapperProps) {
  return (
    <section
      id={id}
      className={`mx-container mb-section ${className}`}
    >
      {children}
    </section>
  );
}
