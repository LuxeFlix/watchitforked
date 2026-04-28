export default function MovieDetailLoading() {
  return (
    <div className="min-h-screen bg-background pb-20 animate-pulse">
      {/* Backdrop skeleton */}
      <div className="relative w-full h-[40vh] md:h-[50vh] bg-card" />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster skeleton */}
          <div className="flex-none w-60 md:w-72 mx-auto md:mx-0">
            <div className="aspect-[2/3] rounded-xl bg-card border border-border" />
          </div>

          {/* Details skeleton */}
          <div className="flex-1 space-y-6">
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="h-5 w-14 bg-elevated rounded-full" />
                <div className="h-5 w-16 bg-elevated rounded-full" />
                <div className="h-5 w-14 bg-elevated rounded-full" />
              </div>
              <div className="h-10 md:h-14 w-3/4 bg-elevated rounded" />
              <div className="flex gap-4">
                <div className="h-4 w-16 bg-elevated rounded" />
                <div className="h-4 w-20 bg-elevated rounded" />
                <div className="h-4 w-16 bg-elevated rounded" />
                <div className="h-4 w-24 bg-elevated rounded" />
              </div>
            </div>

            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-6 w-20 bg-elevated rounded-full border border-border" />
              ))}
            </div>

            <div className="space-y-2 max-w-2xl">
              <div className="h-3 w-full bg-elevated rounded" />
              <div className="h-3 w-full bg-elevated rounded" />
              <div className="h-3 w-3/4 bg-elevated rounded" />
            </div>

            <div className="h-14 w-44 bg-primary/20 rounded-lg" />
          </div>
        </div>

        {/* Screenshots skeleton */}
        <div className="mt-16">
          <div className="h-5 w-32 bg-elevated rounded mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-video rounded-xl bg-card border border-border" />
            ))}
          </div>
        </div>
      </div>

      {/* Related skeleton */}
      <div className="mt-16 px-6">
        <div className="h-5 w-40 bg-elevated rounded mb-4" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-none w-[160px] sm:w-[180px]">
              <div className="aspect-[2/3] rounded-xl bg-card border border-border" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
