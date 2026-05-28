import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../api/axios'
import Loading from '../../components/common/Loading'
import Button from '../../components/ui/Button'
import { useApp } from '../../contexts/AppContext'

type Contractor = {
  id: number
  companyName: string
  career: number
  averageRating: number
  reviewCount: number
  serviceArea?: string
  preferredTypes?: string
  introduction?: string
  liked?: boolean
}
type Review = {
  id: number
  rating: number
  content?: string
  userNickname?: string
  createdAt: string
}

function ContractorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { me } = useApp()
  const [c, setC] = useState<Contractor | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])

  const load = () => {
    if (!id) return
    api.get<Contractor>(`/contractors/${id}`).then(({ data }) => setC(data))
    api.get<Review[]>(`/contractors/${id}/reviews`).then(({ data }) => setReviews(data))
  }
  useEffect(load, [id])

  const toggleLike = async () => {
    if (!me || !c) return alert('로그인이 필요합니다.')
    if (c.liked) await api.delete(`/likes/${c.id}`)
    else await api.post(`/likes/${c.id}`)
    load()
  }

  const startChat = async () => {
    if (!me || !c) return alert('로그인이 필요합니다.')
    const { data } = await api.post('/chat/rooms', { contractorId: c.id })
    window.location.href = `/chats/${data.id}`
  }

  if (!c) return <Loading />

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 space-y-8">
      <Link to="/contractors" className="inline-flex text-sm text-ink-500 hover:text-brand-600">
        ← 시공업자 목록
      </Link>

      {/* Header card */}
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200">
        <div className="relative h-32 bg-gradient-to-br from-brand-100 via-brand-50 to-accent-50">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-brand-200/40 blur-3xl"
          />
        </div>
        <div className="-mt-12 px-7 pb-7">
          <div className="flex items-end gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-2xl font-bold text-brand-600 shadow-lg shadow-ink-900/10 ring-1 ring-ink-200">
              {c.companyName.charAt(0)}
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-2xl font-bold tracking-tight text-ink-900">{c.companyName}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-600">
                <span className="inline-flex items-center gap-1 text-accent-500">
                  <StarIcon className="h-4 w-4" />
                  <span className="font-semibold text-ink-700">{c.averageRating.toFixed(1)}</span>
                  <span className="text-ink-400">({c.reviewCount})</span>
                </span>
                <span className="text-ink-300">·</span>
                <span>경력 {c.career}년</span>
                {c.serviceArea && (
                  <>
                    <span className="text-ink-300">·</span>
                    <span>{c.serviceArea}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={toggleLike}
              className={`inline-flex h-11 items-center justify-center gap-1.5 rounded-xl px-5 text-sm font-semibold transition ${
                c.liked
                  ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200 hover:bg-rose-100'
                  : 'bg-white text-ink-700 ring-1 ring-ink-200 hover:bg-ink-50'
              }`}
            >
              <HeartIcon filled={!!c.liked} className="h-4 w-4" />
              {c.liked ? '찜됨' : '찜하기'}
            </button>
            <Button onClick={startChat}>1:1 채팅</Button>
          </div>

          {c.preferredTypes && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {c.preferredTypes.split(',').map((t) => (
                <span
                  key={t}
                  className="inline-flex h-6 items-center rounded-full bg-brand-50 px-2.5 text-[11px] font-medium text-brand-700"
                >
                  #{t.trim()}
                </span>
              ))}
            </div>
          )}

          {c.introduction && (
            <p className="mt-6 whitespace-pre-line border-t border-ink-100 pt-6 text-sm leading-relaxed text-ink-700">
              {c.introduction}
            </p>
          )}
        </div>
      </div>

      {/* Reviews */}
      <section>
        <h2 className="mb-4 flex items-baseline gap-2 text-lg font-bold text-ink-900">
          리뷰 <span className="text-sm font-medium text-ink-500">({reviews.length})</span>
        </h2>

        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-300 bg-white p-10 text-center text-sm text-ink-500">
            아직 작성된 리뷰가 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-2xl bg-white p-5 ring-1 ring-ink-200">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
                    {(r.userNickname ?? '?').charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-ink-900">{r.userNickname ?? '익명'}</div>
                    <div className="mt-0.5 flex items-center gap-1 text-xs">
                      <span className="inline-flex items-center gap-0.5 text-accent-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-3 w-3 ${i < r.rating ? '' : 'text-ink-200'}`}
                          />
                        ))}
                      </span>
                      <span className="text-ink-400">·</span>
                      <span className="text-ink-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                {r.content && (
                  <p className="mt-4 whitespace-pre-line text-[14px] leading-relaxed text-ink-700">
                    {r.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function StarIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M10 2l2.4 5 5.6.8-4 3.9 1 5.6L10 14.8 4.9 17.3l1-5.6-4-3.9L7.6 7 10 2z" />
    </svg>
  )
}
function HeartIcon({ filled, className = '' }: { filled: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill={filled ? 'currentColor' : 'none'} className={className}>
      <path
        d="M10 17.5s-6.5-4.2-6.5-9.2A3.8 3.8 0 0110 5.5a3.8 3.8 0 016.5 2.8c0 5-6.5 9.2-6.5 9.2z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ContractorDetailPage
