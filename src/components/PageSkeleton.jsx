import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Video Skeleton */}
      <Skeleton className="w-full h-[400px] rounded-xl" />

      {/* Title */}
      <Skeleton className="h-6 w-2/3" />

      {/* Channel + Buttons */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 w-1/3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>

      {/* Description */}
      <Skeleton className="h-24 w-full" />
    </div>
  );
}
