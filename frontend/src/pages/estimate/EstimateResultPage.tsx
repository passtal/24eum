import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../api/axios'
import Loading from '../../components/common/Loading'
import Button from '../../components/ui/Button'

type Estimate = {
  id: number
  budget: number
  area: number
  address?: string
  status: string
  designModelCode?: string
  designModelName?: string
}
type Match = {
  id: number
  matchScore: number
  matchRank: number
  contractor: {
    id: number
    companyName: string
    career: number
    averageRating: number
    reviewCount: number
    serviceArea?: string
    profileImage?: string
  }
}

function EstimateResultPage() {
  const { id } = useParams<{ id: string }>()
  const [estimate, setEstimate] = useState<Estimate | null>(null)
  const [matches, setMatches] = useState<Match[] | null>(null)

  useEffect(() => {
    if (!id) return
    api.get<Estimate>(`/estimates/${id}`).then(({ data }) => setEstimate(data))
    api.get<Match[]>(`/estimates/${id}/matches`).then(({ data }) => setMatches(data))
  }, [id])

  if (!estimate || !matches) return <Loading />

  const startChat = async (contractorId: number) => {
    const { data } = await api.post('/chat/rooms', {
      contractorId,
      estimateRequestId: estimate.id,
    })
    window.location.href = `/chats/${data.id}`
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="mb-2 text-2xl font-bold">매칭 결과</h1>
        <div className="text-sm text-slate-600">
          {estimate.designModelCode}형 / 예산 {estimate.budget.toLocaleString()}원 / 면적 {Number(estimate.area)}평
        </div>
      </div>

      <h2 className="text-xl font-semibold">추천 시공업자 Top {matches.length}</h2>
      {matches.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          조건에 맞는 업자가 아직 없습니다. 업자 등록을 기다려주세요.
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((m) => (
            <div key={m.id} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">
                {m.matchRank}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Link to={`/contractors/${m.contractor.id}`} className="text-lg font-semibold hover:underline">
                    {m.contractor.companyName}
                  </Link>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                    매칭 {Number(m.matchScore).toFixed(0)}점
                  </span>
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  경력 {m.contractor.career}년 · ⭐ {m.contractor.averageRating}({m.contractor.reviewCount})
                  {m.contractor.serviceArea && ` · ${m.contractor.serviceArea}`}
                </div>
              </div>
              <Button variant="secondary" onClick={() => startChat(m.contractor.id)}>1:1 채팅</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EstimateResultPage
