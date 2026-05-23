export function SectionSkeleton({ minHeight = 320 }: { minHeight?: number }) {
  return (
    <section
      aria-hidden
      className="border-t border-slate-200 bg-white px-4 py-20 sm:px-6 sm:py-28 lg:px-8 dark:border-slate-800 dark:bg-slate-950"
      style={{ minHeight }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="animate-shimmer h-8 w-full max-w-sm rounded-full" />
        <div className="animate-shimmer mt-4 h-4 w-full max-w-xl rounded-full" />
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="animate-shimmer h-40 rounded-2xl border border-slate-200 dark:border-slate-800"
            />
          ))}
        </div>
      </div>
    </section>
  );
}