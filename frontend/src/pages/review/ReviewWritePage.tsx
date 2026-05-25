import { FormEvent, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../../api/axios'
import Button from '../../components/ui/Button'

function ReviewWritePage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const contractorId = Number(params.get('contractorId'))
  const estimateRequestId = Number(params.get('estimateId')) || null

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
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
    }
  }

  if (!contractorId) {
    return <div className="p-8 text-center text-sm text-slate-500">잘못된 접근입니다. (contractorId 누락)</div>
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">리뷰 작성</h1>
      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">별점</span>
          <div className="flex gap-1 text-2xl">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setRating(n)}
                      className={n <= rating ? 'text-yellow-400' : 'text-slate-300'}>★</button>
            ))}
          </div>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">내용</span>
          <textarea
            rows={6}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" fullWidth>리뷰 등록</Button>
      </form>
    </div>
  )
}

export default ReviewWritePage
