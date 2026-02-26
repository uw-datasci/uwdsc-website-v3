import { Skeleton } from "@uwdsc/ui";

export function ApplicationsLoading() {
  return (
    <div className="space-y-4 mt-8 w-full">
      <h1 className="text-3xl font-bold">Applications</h1>
      <p className="text-muted-foreground">Loading applications...</p>
      <div className="flex gap-4 h-[calc(100vh-220px)]">
        <Skeleton className="w-full md:w-[350px] h-full rounded-lg" />
        <Skeleton className="hidden md:block flex-1 h-full rounded-lg" />
      </div>
    </div>
  );
}
