export default function Loading() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        {/* Header */}
        <div className="mb-8">
          <div className="skeleton h-8 w-52 rounded mb-3" />
          <div className="skeleton h-4 w-72 rounded" />
        </div>

        {/* Terminal Input Skeleton */}
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-elevated)]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: '#555' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#555' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#555' }} />
            </div>
            <div className="skeleton h-3 w-24 rounded ml-2" />
          </div>
          <div className="p-4 space-y-3">
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-4/5 rounded" />
            <div className="skeleton h-3 w-3/5 rounded" />
          </div>
          <div className="skeleton h-6 w-full rounded-none" />
        </div>

        {/* Button Skeleton */}
        <div className="mt-6 flex justify-end">
          <div className="skeleton h-11 w-40 rounded-lg" />
        </div>

        {/* Templates Skeleton */}
        <div className="mt-6">
          <div className="skeleton h-3 w-48 rounded mb-3" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="skeleton h-9 rounded-lg" style={{ width: `${64 + i * 12}px` }} />
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}
