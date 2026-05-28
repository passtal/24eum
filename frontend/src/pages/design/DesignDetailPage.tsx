import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../api/axios'
import Loading from '../../components/common/Loading'
import Button from '../../components/ui/Button'
import { resolveDesignImage } from '../../utils/designImages'

type Design = {
  id: number
  modelCode: string
  name: string
  description?: string
  thumbnailImage?: string
  basePrice?: number
  styleKeywords?: string
}

type Status = 'loading' | 'success' | 'error'

function DesignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [d, setD] = useState<Design | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [errorMsg, setErrorMsg] = useState<string>('')

  useEffect(() => {
    if (!id) return
    setStatus('loading')
    api
      .get<Design>(`/designs/${id}`)
      .then(({ data }) => {
        setD(data)
        setStatus('success')
      })
      .catch((e) => {
        setStatus('error')
        const code = e?.response?.status
        const serverMsg = e?.response?.data?.message
        setErrorMsg(
          serverMsg
            ? `${code ?? ''} ${serverMsg}`.trim()
            : '디자인 정보를 불러오지 못했습니다.',
        )
      })
  }, [id])

  if (status === 'loading') return <Loading />

  if (status === 'error' || !d) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20">
        <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-ink-200">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
              <path
                d="M12 8v5m0 3.5h.01M4.5 19.5h15a1.5 1.5 0 001.3-2.25l-7.5-13a1.5 1.5 0 00-2.6 0l-7.5 13A1.5 1.5 0 004.5 19.5z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="mt-5 text-xl font-bold text-ink-900">디자인을 불러올 수 없습니다</h1>
          <p className="mt-2 text-sm text-ink-600">{errorMsg}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/designs"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-500 px-5 text-sm font-semibold text-white shadow-sm shadow-brand-500/30 transition hover:bg-brand-600"
            >
              디자인 목록으로
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-ink-900 ring-1 ring-ink-200 transition hover:bg-ink-50"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    )
  }

  const heroImage = resolveDesignImage(d)

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-6 py-10">
      <div>
        <Link to="/designs" className="text-sm text-ink-500 hover:text-brand-600">
          ← 디자인 목록
        </Link>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ink-100 to-ink-200 ring-1 ring-ink-200">
        <div className="aspect-[16/9]">
          {heroImage ? (
            <img src={heroImage} alt={d.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-7xl font-black text-ink-300">
              {d.modelCode}
            </div>
          )}
        </div>
        <span className="absolute left-4 top-4 rounded-md bg-white/95 px-2.5 py-1 text-xs font-bold tracking-wider text-ink-900">
          {d.modelCode}
        </span>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink-900">{d.name}</h1>
        {d.description && (
          <p className="mt-4 text-[15px] leading-relaxed text-ink-600">{d.description}</p>
        )}
      </div>

      {d.styleKeywords && (
        <div className="flex flex-wrap gap-2">
          {d.styleKeywords.split(',').map((k) => (
            <span
              key={k}
              className="inline-flex h-7 items-center rounded-full bg-brand-50 px-3 text-xs font-medium text-brand-700"
            >
              #{k.trim()}
            </span>
          ))}
        </div>
      )}

      {d.basePrice != null && (
        <div className="rounded-2xl bg-white p-5 ring-1 ring-ink-200">
          <span className="text-sm text-ink-500">기본 시작가</span>
          <div className="mt-1 text-2xl font-bold text-ink-900">
            {d.basePrice.toLocaleString()}원~
          </div>
        </div>
      )}

      <Link to={`/estimate?designId=${d.id}`} className="block">
        <Button fullWidth>이 디자인으로 견적 요청하기</Button>
      </Link>
    </div>
  )
}

export default DesignDetailPage
