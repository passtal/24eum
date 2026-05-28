import { FormEvent, useState } from 'react'
import api from '../../api/axios'

type AiResponse = { query: string; response: string; model: string }

const SUGGESTIONS = [
  '25평 아파트 모던 인테리어 예상 견적은?',
  '북유럽 스타일에 어울리는 자재 추천해줘',
  '거실 조명 배치 팁이 궁금해요',
  '리모델링 시 주의사항이 뭐가 있을까?',
]

function AiSearchPage() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<AiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (q: string) => {
    if (!q.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const { data } = await api.post<AiResponse>('/ai/search', { query: q })
      setResult(data)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'AI 응답 생성에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    submit(query)
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-brand-600">
          <SparkIcon className="h-4 w-4" />
          AI Search
        </div>
        <h1 className="mt-2 text-[28px] font-bold tracking-tight text-ink-900 md:text-[34px]">
          AI 인테리어 검색
        </h1>
        <p className="mt-3 text-ink-600">
          디자인 아이디어, 자재 추천, 예상 견적까지 자유롭게 물어보세요.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="relative">
          <SparkIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="궁금한 점을 자연어로 입력하세요"
            className="h-14 w-full rounded-2xl bg-white pl-11 pr-32 text-[15px] text-ink-900 ring-1 ring-ink-200 transition placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-1/2 inline-flex h-10 -translate-y-1/2 items-center justify-center rounded-xl bg-brand-500 px-5 text-sm font-semibold text-white shadow-sm shadow-brand-500/30 transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-ink-300 disabled:shadow-none"
          >
            {loading ? '생성 중...' : '검색'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setQuery(s)
                submit(s)
              }}
              className="inline-flex h-8 items-center rounded-full bg-white px-3 text-xs text-ink-700 ring-1 ring-ink-200 transition hover:bg-brand-50 hover:text-brand-700 hover:ring-brand-200"
            >
              {s}
            </button>
          ))}
        </div>
      </form>

      {error && (
        <div className="rounded-2xl bg-rose-50 p-5 ring-1 ring-rose-200">
          <div className="text-sm font-semibold text-rose-700">{error}</div>
          <p className="mt-1 text-xs text-rose-600">
            ※ 백엔드에 OpenAI API 키 설정이 필요합니다 (application-secret.properties).
          </p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 rounded-2xl bg-white p-10 ring-1 ring-ink-200">
          <span className="h-2 w-2 animate-pulse rounded-full bg-brand-500" />
          <span className="text-sm text-ink-500">AI가 답변을 생성 중입니다...</span>
        </div>
      )}

      {result && (
        <article className="rounded-2xl bg-white p-7 ring-1 ring-ink-200">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <SparkIcon className="h-4 w-4" />
            </div>
            <h2 className="flex-1 text-[16px] font-semibold text-ink-900">{result.query}</h2>
          </div>
          <pre className="mt-5 whitespace-pre-wrap break-words font-sans text-[14px] leading-relaxed text-ink-700">
            {result.response}
          </pre>
          <p className="mt-6 border-t border-ink-100 pt-4 text-xs text-ink-400">
            powered by OpenAI · model: {result.model}
          </p>
        </article>
      )}
    </div>
  )
}

function SparkIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M10 2v3M10 15v3M2 10h3M15 10h3M4.5 4.5l2 2M13.5 13.5l2 2M4.5 15.5l2-2M13.5 6.5l2-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default AiSearchPage
