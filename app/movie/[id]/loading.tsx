export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 animate-fade-in">
      <div className="grid gap-8 md:grid-cols-[320px_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-3xl border border-portal-border bg-white shadow-sm">
          <div className="aspect-[2/3] bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200" />
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <div className="h-12 w-3/4 rounded-2xl bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200" />
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-20 rounded-full bg-slate-200" />
            <div className="h-6 w-20 rounded-full bg-slate-200" />
            <div className="h-6 w-20 rounded-full bg-slate-200" />
          </div>
          <div className="mt-4 space-y-3">
            <div className="h-4 w-full rounded-full bg-slate-200" />
            <div className="h-4 w-full rounded-full bg-slate-200" />
            <div className="h-4 w-5/6 rounded-full bg-slate-200" />
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="h-12 rounded-2xl bg-white border border-portal-border" />
            <div className="h-12 rounded-2xl bg-white border border-portal-border" />
            <div className="h-12 rounded-2xl bg-white border border-portal-border" />
            <div className="h-12 rounded-2xl bg-white border border-portal-border" />
          </div>
        </div>
      </div>
    </div>
  );
}
