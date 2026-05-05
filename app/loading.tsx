export default function HomeLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12 animate-pulse">
      {/* Hero skeleton */}
      <div className="relative rounded-[2.5rem] bg-white border border-portal-border h-64 sm:h-80 w-full" />

      {/* Grid Header */}
      <div className="flex items-center justify-between">
         <div className="space-y-2">
            <div className="h-8 w-48 bg-white rounded-lg border border-portal-border" />
            <div className="h-1 w-12 bg-portal-accent/20 rounded-full" />
         </div>
         <div className="h-8 w-24 bg-white rounded-xl border border-portal-border" />
      </div>

      {/* Movie Grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bg-white border border-portal-border rounded-2xl overflow-hidden aspect-[2/3.5] space-y-4">
             <div className="aspect-[2/3] w-full bg-slate-100" />
             <div className="px-4 space-y-2">
                <div className="h-4 w-3/4 bg-slate-100 rounded" />
                <div className="h-3 w-1/2 bg-slate-100 rounded" />
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
