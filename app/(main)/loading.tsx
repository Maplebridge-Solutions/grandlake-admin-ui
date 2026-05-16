export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-surface-subtle rounded-xl" />
          <div className="h-4 w-64 bg-surface-subtle rounded-xl" />
        </div>
        <div className="h-10 w-32 bg-surface-subtle rounded-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 space-y-4 border border-surface-subtle">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-subtle" />
              <div className="h-4 w-24 bg-surface-subtle rounded" />
            </div>
            <div className="h-7 w-32 bg-surface-subtle rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-3xl border border-surface-subtle p-8 space-y-4">
        <div className="h-6 w-48 bg-surface-subtle rounded" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 w-full bg-surface-subtle rounded-xl" />
        ))}
      </div>
    </div>
  );
}
