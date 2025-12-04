import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

const SkeletonBlock = ({ className = 'h-4 w-full' }: { className?: string }) => (
  <div className={cn('animate-pulse rounded-md bg-gray-800', className)} />
);

const GridItemSkeleton = () => (
  <div className="space-y-1">
    <SkeletonBlock className="h-4 w-24 bg-gray-700/50" /> {/* Title */}
    <SkeletonBlock className="h-6 w-32" /> {/* Value */}
  </div>
);

const DetailsTabSkeleton = () => {
  return (
    <div className="space-y-5">
      {/* Header Area Skeleton */}
      <div className="flex items-center justify-between gap-5">
        <h1 className="flex h-9 items-center gap-2 text-lg font-semibold">
          <Info className="size-5 text-gray-700" />
          <SkeletonBlock className="h-6 w-32" />
        </h1>
        <SkeletonBlock className="h-10 w-24" /> {/* Edit Button */}
      </div>

      {/* Content Box Skeleton */}
      <div className="space-y-5 rounded-xl border p-5">
        {/* Creator Section Skeleton */}
        <div className="space-y-1 text-sm">
          <SkeletonBlock className="h-4 w-16 bg-gray-700/50" /> {/* Creator Title */}
          <div className="flex items-center gap-2">
            <SkeletonBlock className="size-10 min-w-10 rounded-full" /> {/* Avatar */}
            <div className="">
              <SkeletonBlock className="h-5 w-32" /> {/* FullName */}
              <SkeletonBlock className="mt-1 h-4 w-40" /> {/* Email */}
            </div>
          </div>
        </div>

        {/* Title & Description Skeleton */}
        <div className="space-y-1 text-sm">
          <SkeletonBlock className="h-4 w-10 bg-gray-700/50" /> {/* Title Label */}
          <SkeletonBlock className="h-7 w-60" /> {/* Title Value */}
        </div>
        <div className="space-y-1 text-sm">
          <SkeletonBlock className="h-4 w-24 bg-gray-700/50" /> {/* Description Label */}
          <SkeletonBlock className="h-5 w-full" />
          <SkeletonBlock className="h-5 w-4/5" />
        </div>

        {/* Grid Data Skeleton */}
        <div className="grid grid-cols-3 gap-5 text-sm">
          <GridItemSkeleton />
          <GridItemSkeleton />
          <GridItemSkeleton />
          <GridItemSkeleton />
          <GridItemSkeleton />
          <GridItemSkeleton />
          <GridItemSkeleton />
          <GridItemSkeleton />
          <GridItemSkeleton />
          <GridItemSkeleton />
          <GridItemSkeleton />
          <GridItemSkeleton />
        </div>
      </div>
    </div>
  );
};

export const ContestDetailsSkeleton = ({ tabs }: { tabs: { key: string; label: string }[] }) => {
  return (
    <section className="animate-pulse">
      {/* Banner Skeleton */}
      <div className="h-96 w-full bg-gray-900"></div>

      {/* Tabs Skeleton */}
      <div className="relative flex overflow-x-auto border-b">
        {tabs.map((tab) => (
          <div key={tab.key} className="relative z-10 px-5 py-3 text-sm whitespace-nowrap">
            {/* Tab Name Placeholder */}
            <SkeletonBlock className="h-4 w-16 bg-gray-700/50" />
          </div>
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="p-5">
        <DetailsTabSkeleton />
      </div>
    </section>
  );
};

export default ContestDetailsSkeleton;
