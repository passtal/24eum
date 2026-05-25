import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import Loading from '../../components/common/Loading'
import Input from '../../components/ui/Input'

type Contractor = {
  id: number
  companyName: string
  career: number
  averageRating: number
  reviewCount: number
  serviceArea?: string
  preferredTypes?: string
}
type ListResp = { items: Contractor[]; totalCount: number; page: number; size: number }

function ContractorListPage() {
  const [list, setList] = useState<ListResp | null>(null)
  const [keyword, setKeyword] = useState('')

  const load = (kw: string) => {
    setList(null)
    api.get<ListResp>('/contractors', { params: { keyword: kw, page: 0, size: 12 } })
      .then(({ data }) => setList(data))
      .catch(() => setList({ items: [], totalCount: 0, page: 0, size: 12 }))
  }
  useEffect(() => { load('') }, [])

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">시공업자 둘러보기</h1>
      <form className="mb-6 flex gap-2" onSubmit={(e) => { e.preventDefault(); load(keyword) }}>
        <Input className="flex-1" placeholder="업체명, 지역, 시공형태 검색"
               value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <button type="submit" className="rounded-lg bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800">검색</button>
      </form>
      {!list ? <Loading /> : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.items.map((c) => (
            <Link key={c.id} to={`/contractors/${c.id}`} className="block rounded-xl border border-slate-200 bg-white p-5 transition hover:shadow-md">
              <div className="font-semibold">{c.companyName}</div>
              <div className="mt-1 text-sm text-slate-500">경력 {c.career}년 · ⭐ {c.averageRating}({c.reviewCount})</div>
              {c.serviceArea && <div className="mt-1 text-xs text-slate-400">지역: {c.serviceArea}</div>}
              {c.preferredTypes && <div className="mt-1 text-xs text-slate-400">시공형태: {c.preferredTypes}</div>}
            </Link>
          ))}
          {list.items.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
              등록된 업자가 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ContractorListPage
