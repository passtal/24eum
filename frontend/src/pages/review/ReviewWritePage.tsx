import { FormEvent, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import api from '../../api/axios'
import Button from '../../components/ui/Button'

function ReviewWritePage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const contractorId = Number(params.get('contractorId'))
  const estimateRequestId = Number(params.get('estimateId')) || null

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await api.post('/reviews', {
        contractorId,
        estimateRequestId,
        rating,
        content,
      })
      navigate(`/contractors/${contractorId}`)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? '리뷰 작성에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (!contractorId) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <div className="rounded-2xl bg-white p-8 ring-1 ring-ink-200">
          <p className="text-sm text-ink-600">잘못된 접근입니다. (contractorId 누락)</p>
          <Link
            to="/contractors"
            className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-brand-500 px-5 text-sm font-semibold text-white shadow-sm shadow-brand-500/30 transition hover:bg-brand-600"
          >
            시공업자 목록으로
          </Link>
        </div>
      </div>
    )
  }

  const display = hoverRating || rating

  return (
    <div className="mx-auto max-w-xl px-6 py-10 space-y-8">
      <div>
        <div className="text-sm font-semibold text-brand-600">Review</div>
        <h1 className="mt-2 text-[26px] font-bold tracking-tight text-ink-900 md:text-[30px]">
          리뷰 작성
        </h1>
        <p className="mt-2 text-sm text-ink-600">시공 경험을 공유해주시면 다른 사용자에게 큰 도움이 됩니다.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6 rounded-2xl bg-white p-7 ring-1 ring-ink-200">
        {/* 별점 */}
        <div>
          <div className="text-sm font-semibold text-ink-900">별점</div>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition"
                >
                  <StarIcon
                    className={`h-8 w-8 transition ${
                      n <= display ? 'text-accent-500' : 'text-ink-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-[15px] font-semibold text-ink-700">{display}.0</span>
          </div>
        </div>

        {/* 내용 */}
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-ink-900">내용</span>
          <textarea
            rows={7}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="시공 품질, 응대, 일정 관리 등 인상 깊었던 부분을 적어주세요."
            className="w-full rounded-xl bg-white px-3 py-2.5 text-[14px] leading-relaxed text-ink-900 ring-1 ring-ink-200 transition placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </label>

        {error && (
          <div className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700 ring-1 ring-rose-200">
            {error}
          </div>
        )}

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? '등록 중...' : '리뷰 등록'}
        </Button>
      </form>
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

export default ReviewWritePage
