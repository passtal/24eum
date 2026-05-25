export function Loading({ label = '불러오는 중...' }: { label?: string }) {
  return (
    <div className="flex h-40 items-center justify-center text-sm text-slate-500">
      <span className="mr-2 inline-block h-3 w-3 animate-pulse rounded-full bg-slate-400" />
      {label}
    </div>
  )
}

export default Loading
