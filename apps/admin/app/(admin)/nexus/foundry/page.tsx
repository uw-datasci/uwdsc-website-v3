import { FoundryHeader, FoundryForm } from "@/components/foundry";

export default function FoundryPage() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl w-full">
      <FoundryHeader />

      <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
        <FoundryForm />
      </div>
    </div>
  );
}
