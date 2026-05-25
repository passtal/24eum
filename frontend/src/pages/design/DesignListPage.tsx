import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import Loading from '../../components/common/Loading'

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
    api.get<Design[]>('/designs').then(({ data }) => setItems(data)).catch(() => setItems([]))
  }, [])

  if (!items) return <Loading />
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">디자인 모델</h1>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((d) => (
          <Link key={d.id} to={`/designs/${d.id}`} className="block rounded-xl border border-slate-200 bg-white p-5 transition hover:shadow-md">
            <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-slate-100 text-3xl font-bold text-slate-400">
              {d.modelCode}
            </div>
            <h3 className="text-lg font-semibold">{d.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">{d.description}</p>
            {d.basePrice != null && (
              <p className="mt-2 text-sm font-medium text-slate-700">기본가 {d.basePrice.toLocaleString()}원~</p>
            )}
            {d.styleKeywords && (
              <div className="mt-2 flex flex-wrap gap-1">
                {d.styleKeywords.split(',').map((kw) => (
                  <span key={kw} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">#{kw.trim()}</span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default DesignListPage
