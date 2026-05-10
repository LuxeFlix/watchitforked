export default function HomeLoading() {
  return (
    <div className="max-w-6xl mx-auto py-8 space-y-12 sm:space-y-16 animate-pulse">
      {/* Hero skeleton */}
      <div className="relative mx-4 sm:mx-0 rounded-[2.5rem] bg-white border border-portal-border h-64 sm:h-80" />

      {/* Carousels skeleton */}
      <div className="space-y-12 sm:space-y-16">
        {Array.from({ length: 4 }).map((_, rowIndex) => (
          <div key={rowIndex} className="space-y-4">
            <div className="flex items-center justify-between px-4 sm:px-0">
              <div className="space-y-2">
                <div className="h-6 sm:h-8 w-32 bg-white rounded-lg border border-portal-border" />
                <div className="h-1 w-12 bg-portal-accent/20 rounded-full" />
              </div>
            </div>
            
            <div className="flex overflow-hidden pb-6 pt-2 px-4 sm:px-0 gap-3 sm:gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="shrink-0 w-[120px] sm:w-[150px] md:w-[180px] bg-white border border-portal-border rounded-2xl overflow-hidden aspect-[2/3.5] space-y-4">
                  <div className="aspect-[2/3] w-full bg-slate-100" />
                  <div className="px-4 space-y-2">
                    <div className="h-4 w-3/4 bg-slate-100 rounded" />
                    <div className="h-3 w-1/2 bg-slate-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
