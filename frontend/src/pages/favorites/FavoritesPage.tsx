import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import Loading from '../../components/common/Loading'

type Contractor = {
  id: number
  companyName: string
  career: number
  averageRating: number
  reviewCount: number
  serviceArea?: string
}

function FavoritesPage() {
  const [list, setList] = useState<Contractor[] | null>(null)
  useEffect(() => {
    api.get<Contractor[]>('/likes').then(({ data }) => setList(data)).catch(() => setList([]))
  }, [])
  if (!list) return <Loading />
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">찜한 시공업자</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <Link key={c.id} to={`/contractors/${c.id}`} className="block rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md">
            <div className="font-semibold">{c.companyName}</div>
            <div className="mt-1 text-sm text-slate-500">경력 {c.career}년 · ⭐ {c.averageRating}({c.reviewCount})</div>
            {c.serviceArea && <div className="mt-1 text-xs text-slate-400">{c.serviceArea}</div>}
          </Link>
        ))}
        {list.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            아직 찜한 업자가 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}

export default FavoritesPage
