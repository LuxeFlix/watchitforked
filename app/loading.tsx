export default function HomeLoading() {
  return (
    <div className="max-w-6xl mx-auto py-8 space-y-12 sm:space-y-16 animate-pulse">
      <div className="mx-4 sm:mx-0 rounded-[2rem] border border-portal-border bg-white/90 shadow-sm overflow-hidden">
        <div className="h-56 sm:h-72 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200" />
      </div>

      <div className="space-y-12 sm:space-y-16">
        {Array.from({ length: 4 }).map((_, rowIndex) => (
          <section key={rowIndex} className="space-y-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-8 w-36 rounded-xl bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200" />
                <div className="h-1 w-12 rounded-full bg-portal-accent/20" />
              </div>
              <div className="h-3 w-16 rounded-full bg-slate-100" />
            </div>
            
            <div className="flex overflow-x-auto pb-6 pt-2 gap-3 sm:gap-5 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="shrink-0 w-[120px] sm:w-[150px] md:w-[180px] overflow-hidden rounded-2xl border border-portal-border bg-white shadow-sm">
                  <div className="relative aspect-[2/3] bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200">
                    <div className="absolute top-2 left-2 h-5 w-12 rounded-lg bg-white/90" />
                  </div>
                  <div className="p-3 sm:p-4 space-y-3">
                    <div className="h-4 w-4/5 rounded bg-slate-200" />
                    <div className="flex items-center justify-between border-t border-portal-border/60 pt-3">
                      <div className="h-3 w-16 rounded bg-slate-200" />
                      <div className="h-3 w-10 rounded bg-slate-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
