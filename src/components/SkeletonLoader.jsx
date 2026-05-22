export default function SkeletonLoader({ count = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-surface border border-border rounded-xl p-4 flex gap-4">
          <div className="skeleton h-4 w-4 rounded shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2.5">
            <div className="skeleton h-4 w-2/5 rounded" />
            <div className="skeleton h-3 w-4/5 rounded" />
            <div className="skeleton h-3 w-3/5 rounded" />
          </div>
          <div className="flex gap-3 shrink-0">
            <div className="skeleton h-6 w-20 rounded" />
            <div className="skeleton h-6 w-20 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
