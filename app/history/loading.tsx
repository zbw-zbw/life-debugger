export default function Loading() {
  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto animate-fade-in-up">
        {/* Header */}
        <div className="mb-8">
          <div className="skeleton h-7 w-36 rounded mb-2" />
          <div className="skeleton h-4 w-64 rounded" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-4 text-center">
              <div className="skeleton h-8 w-12 rounded mx-auto mb-2" />
              <div className="skeleton h-3 w-16 rounded mx-auto" />
            </div>
          ))}
        </div>

        {/* Chart Skeleton */}
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5 mb-8">
          <div className="skeleton h-4 w-32 rounded mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="skeleton h-40 rounded-lg" />
            <div className="skeleton h-40 rounded-lg" />
            <div className="skeleton h-40 rounded-lg" />
          </div>
        </div>

        {/* Filter Skeleton */}
        <div className="flex gap-2 mb-6">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="skeleton h-10 w-16 rounded-lg" />
          ))}
        </div>

        {/* Bug List Skeleton */}
        <div className="space-y-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="skeleton h-3 w-16 rounded" />
                <div className="skeleton h-5 w-8 rounded-full" />
              </div>
              <div className="skeleton h-4 w-2/3 rounded mb-2" />
              <div className="flex gap-2 mb-4">
                <div className="skeleton h-3 w-20 rounded" />
                <div className="skeleton h-3 w-24 rounded" />
              </div>
              <div className="skeleton h-3 w-full rounded mb-2" />
              <div className="skeleton h-3 w-3/4 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
