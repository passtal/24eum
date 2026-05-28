import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import Loading from '../../components/common/Loading'
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

function DesignListPage() {
  const [items, setItems] = useState<Design[] | null>(null)

  useEffect(() => {
    api
      .get<Design[]>('/designs')
      .then(({ data }) => setItems(data))
      .catch(() => setItems([]))
  }, [])

  if (!items) return <Loading />

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="text-sm font-semibold text-brand-600">Design Models</div>
        <h1 className="mt-2 text-[28px] font-bold tracking-tight text-ink-900 md:text-[34px]">
          전체 디자인 모델
        </h1>
        <p className="mt-3 max-w-xl text-ink-600">
          전문 디자이너가 큐레이션한 모델 중 마음에 드는 분위기를 선택해보세요.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-300 bg-white p-10 text-center text-sm text-ink-500">
          디자인 모델이 아직 등록되지 않았습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((d) => {
            const img = resolveDesignImage(d)
            return (
              <Link
                key={d.id}
                to={`/designs/${d.id}`}
                className="group overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-ink-900/10"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-ink-100 to-ink-200">
                  {img ? (
                    <img
                      src={img}
                      alt={d.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl font-bold text-ink-300">
                      {d.modelCode}
                    </div>
                  )}
                  <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2 py-1 text-[11px] font-bold tracking-wider text-ink-900">
                    {d.modelCode}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                </div>

                <div className="p-5">
                  <h3 className="text-[16px] font-semibold text-ink-900 transition group-hover:text-brand-600">
                    {d.name}
                  </h3>
                  {d.description && (
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-500">
                      {d.description}
                    </p>
                  )}

                  {d.basePrice != null && (
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-xs text-ink-500">기본가</span>
                      <span className="text-[15px] font-bold text-ink-900">
                        {d.basePrice.toLocaleString()}원~
                      </span>
                    </div>
                  )}

                  {d.styleKeywords && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {d.styleKeywords.split(',').map((kw) => (
                        <span
                          key={kw}
                          className="inline-flex h-6 items-center rounded-full bg-brand-50 px-2.5 text-[11px] font-medium text-brand-700"
                        >
                          #{kw.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default DesignListPage
