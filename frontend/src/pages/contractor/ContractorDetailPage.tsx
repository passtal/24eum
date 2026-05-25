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
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/contractors" className="text-sm text-slate-500 hover:text-slate-900">← 업자 목록</Link>
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{c.companyName}</h1>
            <div className="mt-1 text-sm text-slate-500">
              경력 {c.career}년 · ⭐ {c.averageRating}({c.reviewCount})
              {c.serviceArea && ` · ${c.serviceArea}`}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={toggleLike}
                    className={`rounded-lg border px-3 py-2 text-sm ${c.liked ? 'border-red-300 bg-red-50 text-red-700' : 'border-slate-300 text-slate-700'}`}>
              {c.liked ? '♥ 찜됨' : '♡ 찜하기'}
            </button>
            <Button onClick={startChat}>1:1 채팅</Button>
          </div>
        </div>
        {c.introduction && <p className="mt-4 whitespace-pre-line text-sm text-slate-700">{c.introduction}</p>}
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">리뷰 ({reviews.length})</h2>
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">{r.userNickname}</span>
                <span className="text-slate-500">⭐ {r.rating}</span>
                <span className="ml-auto text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              {r.content && <p className="mt-1 text-sm text-slate-700">{r.content}</p>}
            </div>
          ))}
          {reviews.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
              아직 작성된 리뷰가 없습니다.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default ContractorDetailPage
