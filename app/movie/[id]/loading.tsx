export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 animate-fade-in">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Poster Skeleton */}
        <div className="w-full shrink-0 md:w-80">
          <div className="aspect-[2/3] w-full rounded-2xl bg-card animate-pulse border border-border" />
        </div>

        {/* Info Skeleton */}
        <div className="flex flex-1 flex-col gap-4">
          <div className="h-10 w-3/4 rounded-lg bg-card animate-pulse border border-border" />
          <div className="flex gap-2">
            <div className="h-6 w-20 rounded-full bg-card animate-pulse border border-border" />
            <div className="h-6 w-20 rounded-full bg-card animate-pulse border border-border" />
            <div className="h-6 w-20 rounded-full bg-card animate-pulse border border-border" />
          </div>
          <div className="space-y-2 mt-4">
            <div className="h-4 w-full rounded bg-card animate-pulse" />
            <div className="h-4 w-full rounded bg-card animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-card animate-pulse" />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8 md:grid-cols-4">
            <div className="h-12 rounded-xl bg-card animate-pulse border border-border" />
            <div className="h-12 rounded-xl bg-card animate-pulse border border-border" />
            <div className="h-12 rounded-xl bg-card animate-pulse border border-border" />
            <div className="h-12 rounded-xl bg-card animate-pulse border border-border" />
          </div>
        </div>
      </div>
    </div>
  );
}
