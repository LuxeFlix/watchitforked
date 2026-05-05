export default function SearchLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10 animate-pulse">
      {/* Title skeleton */}
      <div className="space-y-4">
         <div className="h-10 w-64 bg-white rounded-xl border border-portal-border" />
         <div className="flex justify-between">
            <div className="h-4 w-32 bg-white rounded border border-portal-border" />
            <div className="h-4 w-24 bg-white rounded border border-portal-border" />
         </div>
         <div className="h-1 w-20 bg-portal-accent/20 rounded-full" />
      </div>

      {/* Grid skeleton */}
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
