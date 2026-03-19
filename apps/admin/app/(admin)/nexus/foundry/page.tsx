import { FoundryHeader, FoundryForm } from "@/components/foundry";

export default function FoundryPage() {
  return (
    <div className="flex flex-col gap-8 max-w-none w-full">
      <FoundryHeader />

      <FoundryForm />
    </div>
  );
}
