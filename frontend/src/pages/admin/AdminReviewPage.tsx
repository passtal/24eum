import { useEffect, useState } from 'react'
import api from '../../api/axios'
import Loading from '../../components/common/Loading'

type Review = {
  id: number
  rating: number
  content?: string
  isHidden?: boolean
  userNickname?: string
  contractorName?: string
  createdAt: string
}
type Resp = { items: Review[]; totalCount: number }

function AdminReviewPage() {
  const [data, setData] = useState<Resp | null>(null)

  const load = () => {
    setData(null)
    api
      .get<Resp>('/admin/reviews', { params: { page: 0, size: 50 } })
      .then(({ data }) => setData(data))
      .catch(() => setData({ items: [], totalCount: 0 }))
  }
  useEffect(load, [])

  const hide = async (id: number) => {
    await api.put(`/admin/reviews/${id}/hide`)
    load()
  }
  const show = async (id: number) => {
    await api.put(`/admin/reviews/${id}/show`)
    load()
  }

  if (!data) return <Loading />

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-sm font-semibold text-brand-600">Admin</div>
          <h1 className="mt-2 text-[26px] font-bold tracking-tight text-ink-900">리뷰 관리</h1>
        </div>
        <div className="text-sm text-ink-500">총 {data.totalCount.toLocaleString()}건</div>
      </div>

      {data.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-300 bg-white p-10 text-center text-sm text-ink-500">
          등록된 리뷰가 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {data.items.map((r) => (
            <div
              key={r.id}
              className={`rounded-2xl bg-white p-5 ring-1 transition ${
                r.isHidden ? 'ring-rose-200 bg-rose-50/30' : 'ring-ink-200'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
                    {(r.userNickname ?? '?').charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <span className="font-semibold text-ink-900">{r.userNickname ?? '익명'}</span>
                      <span className="text-ink-300">→</span>
                      <span className="font-semibold text-ink-900">{r.contractorName ?? '-'}</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-0.5 text-accent-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className={`h-3 w-3 ${i < r.rating ? '' : 'text-ink-200'}`}
                          >
                            <path d="M10 2l2.4 5 5.6.8-4 3.9 1 5.6L10 14.8 4.9 17.3l1-5.6-4-3.9L7.6 7 10 2z" />
                          </svg>
                        ))}
                      </span>
                      <span className="text-ink-400">·</span>
                      <span className="text-ink-400">{new Date(r.createdAt).toLocaleString()}</span>
                      {r.isHidden && (
                        <span className="ml-1 inline-flex h-5 items-center rounded-full bg-rose-100 px-2 text-[10px] font-semibold text-rose-700">
                          숨김 처리됨
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {r.isHidden ? (
                  <button
                    onClick={() => show(r.id)}
                    className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg bg-white px-3 text-xs font-semibold text-ink-700 ring-1 ring-ink-200 transition hover:bg-ink-50"
                  >
                    숨김 해제
                  </button>
                ) : (
                  <button
                    onClick={() => hide(r.id)}
                    className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 px-3 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 transition hover:bg-rose-100"
                  >
                    숨김 처리
                  </button>
                )}
              </div>

              {r.content && (
                <p className="mt-4 whitespace-pre-line border-t border-ink-100 pt-4 text-[14px] leading-relaxed text-ink-700">
                  {r.content}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminReviewPage
