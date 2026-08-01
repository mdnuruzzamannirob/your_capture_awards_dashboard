const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`bg-surface-tertiary animate-pulse rounded-md ${className}`} />
);

const FieldSkeleton = () => (
  <div className="grid gap-1.5">
    <SkeletonBlock className="h-3 w-24" />
    <SkeletonBlock className="h-8 w-full" />
  </div>
);

const SectionSkeleton = ({ rows = 2 }: { rows?: number }) => (
  <section className="border-border-subtle bg-surface-secondary overflow-hidden rounded-lg border">
    <div className="border-border-subtle border-b bg-(--bg-inset) px-4.5 py-4">
      <SkeletonBlock className="h-4 w-28" />
    </div>
    <div className="grid items-start gap-3.5 p-4.5 sm:grid-cols-2">
      {Array.from({ length: rows * 2 }).map((_, index) => (
        <FieldSkeleton key={index} />
      ))}
    </div>
  </section>
);

const ContestFormSkeleton = () => (
  <div className="mx-auto w-full max-w-345" aria-label="Loading contest form" aria-busy="true">
    <div className="mb-5 flex items-center justify-between gap-4">
      <div className="grid gap-2">
        <SkeletonBlock className="h-3 w-20" />
        <SkeletonBlock className="h-7 w-52" />
      </div>
      <SkeletonBlock className="h-9 w-24" />
    </div>

    <div className="grid items-start gap-[clamp(20px,2.4vw,36px)] min-[1280px]:grid-cols-[minmax(480px,1.08fr)_minmax(390px,0.92fr)]">
      <div className="grid min-w-0 gap-3">
        <SectionSkeleton rows={2} />
        <SectionSkeleton rows={1} />
        <SectionSkeleton rows={2} />
        <SectionSkeleton rows={1} />
        <div className="flex justify-end gap-2.5 pt-3">
          <SkeletonBlock className="h-9 w-20" />
          <SkeletonBlock className="h-9 w-36" />
        </div>
      </div>
    </div>
  </div>
);

export default ContestFormSkeleton;
