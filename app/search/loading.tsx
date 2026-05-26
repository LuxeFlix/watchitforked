export default function SearchLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-pulse">
      <div className="space-y-4">
         <div className="h-10 w-64 rounded-2xl bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200" />
         <div className="flex justify-between gap-4">
            <div className="h-4 w-32 rounded-full bg-slate-200" />
            <div className="h-4 w-24 rounded-full bg-slate-200" />
         </div>
         <div className="h-1 w-20 rounded-full bg-portal-accent/20" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-portal-border bg-white shadow-sm">
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
    </div>
  );
}
