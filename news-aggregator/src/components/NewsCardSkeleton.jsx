function NewsCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="animate-pulse overflow-hidden rounded-2xl border border-white/[0.08] bg-[#10131b]"
    >
      <div className="h-52 bg-white/[0.06]" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-1/3 rounded bg-white/[0.06]" />
        <div className="h-5 w-full rounded bg-white/[0.06]" />
        <div className="h-5 w-4/5 rounded bg-white/[0.06]" />
        <div className="h-3 w-full rounded bg-white/[0.06]" />
        <div className="h-3 w-2/3 rounded bg-white/[0.06]" />
      </div>
    </div>
  )
}

export default NewsCardSkeleton
