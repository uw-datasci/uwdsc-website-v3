interface AppSectionProps {
  label?: string;
  description?: string;
}

export default function AppSection({
  label,
  description,
  children,
}: React.PropsWithChildren<AppSectionProps>) {
  return (
    <div className="flex flex-col gap-4 cxc-app-font">
      {label && <p>{label}</p>}
      {children}
      {description && <p className="font-light text-sm">{description}</p>}
    </div>
  );
}
