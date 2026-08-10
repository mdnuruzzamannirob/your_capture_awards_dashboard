const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`bg-surface-tertiary animate-pulse rounded-md ${className}`} />
);

const RecurringContestDetailsSkeleton = () => (
  <div className="space-y-5" aria-label="Loading recurring contest" aria-busy="true">
    <div className="flex items-center justify-between gap-4">
      <div className="grid gap-2">
        <SkeletonBlock className="h-3 w-24" />
        <SkeletonBlock className="h-7 w-64" />
      </div>
      <SkeletonBlock className="h-9 w-28" />
    </div>
    <SkeletonBlock className="h-9 w-full max-w-md" />
    <div className="border-border-subtle bg-surface-secondary grid gap-5 rounded-lg border p-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="grid gap-1.5">
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="h-4 w-28" />
        </div>
      ))}
    </div>
  </div>
);

export default RecurringContestDetailsSkeleton;
