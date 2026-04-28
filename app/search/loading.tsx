export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-background pb-20 animate-pulse">
      {/* FilterBar skeleton */}
      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-md border-b border-border py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-6">
          <div className="h-8 w-44 bg-card rounded-full border border-border" />
          <div className="h-8 w-28 bg-card rounded-full border border-border" />
          <div className="h-8 w-28 bg-card rounded-full border border-border" />
          <div className="h-8 w-28 bg-card rounded-full border border-border" />
          <div className="h-8 w-28 bg-card rounded-full border border-border" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* Title skeleton */}
        <div className="mb-8 space-y-2">
          <div className="h-7 w-48 bg-elevated rounded" />
          <div className="h-4 w-24 bg-elevated rounded" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-[2/3] rounded-xl bg-card border border-border" />
              <div className="h-3 w-3/4 bg-elevated rounded" />
              <div className="h-2 w-1/2 bg-elevated rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
