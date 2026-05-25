import { useEffect, useState } from 'react'
import api from '../../api/axios'
import Loading from '../../components/common/Loading'
import Button from '../../components/ui/Button'

type Contractor = {
  id: number; companyName: string; career: number; averageRating: number; reviewCount: number; isBanned?: boolean
}
type Resp = { items: Contractor[]; totalCount: number }

function AdminContractorPage() {
  const [data, setData] = useState<Resp | null>(null)
  const load = () => {
    setData(null)
    api.get<Resp>('/admin/contractors', { params: { page: 0, size: 50 } })
      .then(({ data }) => setData(data))
      .catch(() => setData({ items: [], totalCount: 0 }))
  }
  useEffect(load, [])

  const ban = async (id: number) => { await api.put(`/admin/contractors/${id}/ban`); load() }
  const unban = async (id: number) => { await api.put(`/admin/contractors/${id}/unban`); load() }

  if (!data) return <Loading />
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">업자 관리</h1>
      <table className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white text-sm">
        <thead className="bg-slate-50 text-left">
          <tr><th className="px-4 py-3">ID</th><th>업체명</th><th>경력</th><th>평점</th><th>상태</th><th className="pr-4 text-right">관리</th></tr>
        </thead>
        <tbody>
          {data.items.map((c) => (
            <tr key={c.id} className="border-t border-slate-100">
              <td className="px-4 py-3">{c.id}</td>
              <td>{c.companyName}</td>
              <td>{c.career}년</td>
              <td>⭐ {c.averageRating} ({c.reviewCount})</td>
              <td>{c.isBanned ? <span className="text-red-600">차단됨</span> : '정상'}</td>
              <td className="pr-4 text-right">
                {c.isBanned
                  ? <Button variant="secondary" onClick={() => unban(c.id)}>차단 해제</Button>
                  : <Button variant="danger" onClick={() => ban(c.id)}>차단</Button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default AdminContractorPage
