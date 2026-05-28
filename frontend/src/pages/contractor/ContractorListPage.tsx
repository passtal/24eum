import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import Loading from '../../components/common/Loading'

type Contractor = {
  id: number
  companyName: string
  career: number
  averageRating: number
  reviewCount: number
  serviceArea?: string
  preferredTypes?: string
}
type ListResp = { items: Contractor[]; totalCount: number; page: number; size: number }

function ContractorListPage() {
  const [list, setList] = useState<ListResp | null>(null)
  const [keyword, setKeyword] = useState('')

  const load = (kw: string) => {
    setList(null)
    api
      .get<ListResp>('/contractors', { params: { keyword: kw, page: 0, size: 12 } })
      .then(({ data }) => setList(data))
      .catch(() => setList({ items: [], totalCount: 0, page: 0, size: 12 }))
  }
  useEffect(() => {
    load('')
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="text-sm font-semibold text-brand-600">Contractors</div>
        <h1 className="mt-2 text-[28px] font-bold tracking-tight text-ink-900 md:text-[34px]">
          검증된 시공업자
        </h1>
        <p className="mt-3 max-w-xl text-ink-600">
          업체명, 지역, 시공 형태로 검색해보세요. 매칭 알고리즘이 자동 추천도 해드립니다.
        </p>
      </div>

      {/* Search */}
      <form
        className="mb-8 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          load(keyword)
        }}
      >
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            placeholder="업체명, 지역, 시공형태 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="h-12 w-full rounded-xl bg-white pl-11 pr-4 text-[15px] text-ink-900 ring-1 ring-ink-200 transition placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-500 px-6 text-[14px] font-semibold text-white shadow-sm shadow-brand-500/30 transition hover:bg-brand-600"
        >
          검색
        </button>
      </form>

      {/* List */}
      {!list ? (
        <Loading />
      ) : list.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-300 bg-white p-10 text-center text-sm text-ink-500">
          등록된 업자가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.items.map((c) => (
            <Link
              key={c.id}
              to={`/contractors/${c.id}`}
              className="group rounded-2xl bg-white p-6 ring-1 ring-ink-200 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink-900/5 hover:ring-brand-200"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-base font-bold text-brand-600">
                  {c.companyName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-[16px] font-semibold text-ink-900 transition group-hover:text-brand-600">
                    {c.companyName}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-sm text-ink-600">
                    <span className="inline-flex items-center gap-0.5 text-accent-500">
                      <StarIcon className="h-3.5 w-3.5" />
                      <span className="font-semibold text-ink-700">{c.averageRating.toFixed(1)}</span>
                    </span>
                    <span className="text-ink-400">({c.reviewCount})</span>
                    <span className="text-ink-300">·</span>
                    <span>경력 {c.career}년</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-1.5 text-[13px] text-ink-500">
                {c.serviceArea && (
                  <div className="flex items-center gap-1.5">
                    <PinIcon className="h-3.5 w-3.5 text-ink-400" />
                    {c.serviceArea}
                  </div>
                )}
                {c.preferredTypes && (
                  <div className="flex items-center gap-1.5">
                    <TagIcon className="h-3.5 w-3.5 text-ink-400" />
                    {c.preferredTypes}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function SearchIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
      <path d="M14 14l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
function StarIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M10 2l2.4 5 5.6.8-4 3.9 1 5.6L10 14.8 4.9 17.3l1-5.6-4-3.9L7.6 7 10 2z" />
    </svg>
  )
}
function PinIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M10 18s6-5.5 6-10a6 6 0 10-12 0c0 4.5 6 10 6 10z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="10" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}
function TagIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M3 3h6l8 8-6 6-8-8V3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="6.5" cy="6.5" r="1.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export default ContractorListPage
