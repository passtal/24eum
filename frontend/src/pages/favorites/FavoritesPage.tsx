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
}

function FavoritesPage() {
  const [list, setList] = useState<Contractor[] | null>(null)
  useEffect(() => {
    api
      .get<Contractor[]>('/likes')
      .then(({ data }) => setList(data))
      .catch(() => setList([]))
  }, [])

  if (!list) return <Loading />

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <div className="text-sm font-semibold text-brand-600">Favorites</div>
        <h1 className="mt-2 text-[28px] font-bold tracking-tight text-ink-900 md:text-[34px]">
          찜한 시공업자
        </h1>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-300 bg-white p-10 text-center text-sm text-ink-500">
          아직 찜한 업자가 없습니다.
          <div className="mt-4">
            <Link
              to="/contractors"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-brand-500 px-5 text-sm font-semibold text-white shadow-sm shadow-brand-500/30 transition hover:bg-brand-600"
            >
              시공업자 둘러보기
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
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
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                        <path d="M10 2l2.4 5 5.6.8-4 3.9 1 5.6L10 14.8 4.9 17.3l1-5.6-4-3.9L7.6 7 10 2z" />
                      </svg>
                      <span className="font-semibold text-ink-700">{c.averageRating.toFixed(1)}</span>
                    </span>
                    <span className="text-ink-400">({c.reviewCount})</span>
                    <span className="text-ink-300">·</span>
                    <span>경력 {c.career}년</span>
                  </div>
                </div>
              </div>
              {c.serviceArea && (
                <div className="mt-4 text-[13px] text-ink-500">{c.serviceArea}</div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default FavoritesPage
