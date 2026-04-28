export default function HomeLoading() {
  return (
    <div className="pb-20 animate-pulse">
      {/* Hero skeleton */}
      <div className="relative w-full h-[60vh] md:h-[80vh] bg-card" />

      {/* Section rows */}
      {[1, 2, 3].map((i) => (
        <section key={i} className="py-10 px-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-5 w-48 bg-elevated rounded" />
            <div className="h-4 w-16 bg-elevated rounded" />
          </div>
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 8 }).map((_, j) => (
              <div
                key={j}
                className="flex-none w-[160px] sm:w-[180px] space-y-2"
              >
                <div className="aspect-[2/3] rounded-xl bg-card border border-border" />
                <div className="h-3 w-3/4 bg-elevated rounded" />
                <div className="h-2 w-1/2 bg-elevated rounded" />
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Browse All skeleton */}
      <div className="pt-12 px-6">
        <div className="h-6 w-40 bg-elevated rounded mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
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
