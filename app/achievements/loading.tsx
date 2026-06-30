export default function Loading() {
  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-6xl mx-auto animate-fade-in-up">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="skeleton w-1 h-7 rounded-full" />
            <div className="skeleton h-7 w-40 rounded" />
          </div>
          <div className="skeleton h-4 w-64 rounded" />
        </div>

        {/* Progress Bar Skeleton */}
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="skeleton h-4 w-32 rounded" />
            <div className="skeleton h-4 w-16 rounded" />
          </div>
          <div className="skeleton h-2 w-full rounded-full" />
        </div>

        {/* Filters Skeleton */}
        <div className="flex gap-2 mb-6">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton h-10 w-20 rounded-lg" />
          ))}
        </div>

        {/* Achievements Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="skeleton h-10 w-10 rounded-lg" />
                <div className="skeleton h-5 w-12 rounded" />
              </div>
              <div className="skeleton h-4 w-3/4 rounded mb-2" />
              <div className="skeleton h-3 w-full rounded mb-3" />
              <div className="skeleton h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
