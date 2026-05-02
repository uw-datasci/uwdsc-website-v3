"use client";

import { Card, Skeleton } from "@uwdsc/ui";

function ListItemSkeleton() {
  return (
    <div className="rounded-lg border border-transparent p-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      <Skeleton className="h-3 w-48" />
      <div className="flex gap-1">
        <Skeleton className="h-4 w-14 rounded-full" />
        <Skeleton className="h-4 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function OnboardingLoading() {
  return (
    <div className="mt-8 flex flex-col h-[calc(100vh-130px)]">
      {/* Header skeleton */}
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-9 w-52" />
            <Skeleton className="h-4 w-40" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-8 w-28" />
          </div>
        </div>
        {/* Filter row skeleton */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-48" />
        </div>
      </div>

      {/* Master-detail skeleton */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left panel */}
        <Card className="w-full md:w-[350px] md:min-w-[350px] shrink-0 overflow-hidden p-2 space-y-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <ListItemSkeleton key={i} />
          ))}
        </Card>

        {/* Right panel – desktop only */}
        <Card className="hidden md:block flex-1 overflow-hidden p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <div className="flex gap-1.5">
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>

          <Skeleton className="h-px w-full" />

          {/* Contact section */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-16" />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-36" />
                </div>
              ))}
            </div>
          </div>

          <Skeleton className="h-px w-full" />

          {/* Term details section */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
