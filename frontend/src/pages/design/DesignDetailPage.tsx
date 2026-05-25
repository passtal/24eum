import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../api/axios'
import Loading from '../../components/common/Loading'
import Button from '../../components/ui/Button'

type Design = {
  id: number
  modelCode: string
  name: string
  description?: string
  thumbnailImage?: string
  basePrice?: number
  styleKeywords?: string
}

function DesignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [d, setD] = useState<Design | null>(null)

  useEffect(() => {
    if (!id) return
    api.get<Design>(`/designs/${id}`).then(({ data }) => setD(data)).catch(() => setD(null))
  }, [id])

  if (!d) return <Loading />
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link to="/designs" className="text-sm text-slate-500 hover:text-slate-900">← 디자인 목록</Link>
      </div>
      <div className="flex h-72 items-center justify-center rounded-2xl bg-slate-100 text-6xl font-bold text-slate-400">
        {d.modelCode}
      </div>
      <h1 className="text-3xl font-bold">{d.name}</h1>
      <p className="text-slate-600 leading-relaxed">{d.description}</p>
      {d.basePrice != null && (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <span className="text-sm text-slate-500">기본 시작가</span>
          <div className="text-2xl font-bold">{d.basePrice.toLocaleString()}원~</div>
        </div>
      )}
      <Link to={`/estimate?designId=${d.id}`}>
        <Button fullWidth>이 디자인으로 견적 요청하기</Button>
      </Link>
    </div>
  )
}

export default DesignDetailPage
