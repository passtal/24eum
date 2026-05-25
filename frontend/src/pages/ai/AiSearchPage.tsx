import { FormEvent, useState } from 'react'
import api from '../../api/axios'
import Button from '../../components/ui/Button'

type AiResponse = { query: string; response: string; model: string }

function AiSearchPage() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<AiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true); setError(null); setResult(null)
    try {
      const { data } = await api.post<AiResponse>('/ai/search', { query })
      setResult(data)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'AI 응답 생성에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">🤖 AI 인테리어 검색</h1>
        <p className="mt-1 text-sm text-slate-500">디자인 아이디어, 자재 추천, 예상 견적까지 자유롭게 물어보세요.</p>
      </div>
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="예: 25평 아파트 모던 인테리어 예상 견적은?"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400"
        />
        <Button type="submit" disabled={loading}>{loading ? '생성 중...' : '검색'}</Button>
      </form>
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          <p className="mt-1 text-xs text-red-500">
            ※ 백엔드에 OpenAI API 키 설정이 필요합니다 (application-secret.properties).
          </p>
        </div>
      )}
      {result && (
        <article className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-2 text-lg font-semibold">{result.query}</h2>
          <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-slate-700">
            {result.response}
          </pre>
          <p className="mt-4 text-xs text-slate-400">model: {result.model}</p>
        </article>
      )}
    </div>
  )
}

export default AiSearchPage
