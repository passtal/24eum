import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../api/axios'
import Loading from '../../components/common/Loading'
import Button from '../../components/ui/Button'
import { resolveDesignImage } from '../../utils/designImages'

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

  const designBg = estimate.designModelCode
    ? resolveDesignImage({ modelCode: estimate.designModelCode })
    : undefined

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 space-y-8">
      {/* Summary card */}
      <div className="relative overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200">
        {designBg && (
          <>
            <img
              src={designBg}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover opacity-20"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/70"
            />
          </>
        )}
        <div className="relative p-7">
          <div className="text-sm font-semibold text-brand-600">Matching Result</div>
          <h1 className="mt-2 text-[28px] font-bold tracking-tight text-ink-900 md:text-[32px]">
            매칭 결과
          </h1>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <SummaryItem
              label="디자인"
              value={
                estimate.designModelCode
                  ? `${estimate.designModelCode} · ${estimate.designModelName ?? ''}`
                  : '-'
              }
            />
            <SummaryItem label="예산" value={`${estimate.budget.toLocaleString()}원`} />
            <SummaryItem label="면적" value={`${Number(estimate.area)}평`} />
            <SummaryItem label="상태" value={estimate.status} />
          </div>
          {estimate.address && (
            <div className="mt-4 text-sm text-ink-500">
              <span className="text-ink-400">주소</span> · {estimate.address}
            </div>
          )}
        </div>
      </div>

      {/* Matches */}
      <section>
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-xl font-bold text-ink-900">
            추천 시공업자 <span className="text-brand-600">Top {matches.length}</span>
          </h2>
          <div className="text-sm text-ink-500">디자인 일치 · 경력 · 평점 · 리뷰 수 종합</div>
        </div>

        {matches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-300 bg-white p-10 text-center text-sm text-ink-500">
            조건에 맞는 업자가 아직 없습니다. 업자 등록을 기다려주세요.
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map((m) => (
              <div
                key={m.id}
                className="group flex flex-col gap-4 rounded-2xl bg-white p-5 ring-1 ring-ink-200 transition hover:ring-brand-200 sm:flex-row sm:items-center"
              >
                {/* Rank */}
                <div className="flex shrink-0 items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold ${
                      m.matchRank === 1
                        ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/30'
                        : 'bg-brand-50 text-brand-700'
                    }`}
                  >
                    {m.matchRank}
                  </div>
                </div>

                {/* Body */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to={`/contractors/${m.contractor.id}`}
                      className="text-[17px] font-semibold text-ink-900 transition hover:text-brand-600"
                    >
                      {m.contractor.companyName}
                    </Link>
                    <span className="inline-flex h-6 items-center rounded-full bg-brand-50 px-2.5 text-[11px] font-semibold text-brand-700">
                      매칭 {Number(m.matchScore).toFixed(0)}점
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-600">
                    <span className="inline-flex items-center gap-0.5 text-accent-500">
                      <StarIcon className="h-3.5 w-3.5" />
                      <span className="font-semibold text-ink-700">
                        {m.contractor.averageRating.toFixed(1)}
                      </span>
                      <span className="text-ink-400">({m.contractor.reviewCount})</span>
                    </span>
                    <span className="text-ink-300">·</span>
                    <span>경력 {m.contractor.career}년</span>
                    {m.contractor.serviceArea && (
                      <>
                        <span className="text-ink-300">·</span>
                        <span>{m.contractor.serviceArea}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex shrink-0 gap-2">
                  <Link
                    to={`/contractors/${m.contractor.id}`}
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-ink-900 ring-1 ring-ink-200 transition hover:bg-ink-50"
                  >
                    상세보기
                  </Link>
                  <Button onClick={() => startChat(m.contractor.id)}>1:1 채팅</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium text-ink-500">{label}</div>
      <div className="mt-1 text-[15px] font-semibold text-ink-900">{value}</div>
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

export default EstimateResultPage
