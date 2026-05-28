import { useEffect, useState } from 'react'
import api from '../../api/axios'
import Loading from '../../components/common/Loading'

type Contractor = {
  id: number
  companyName: string
  career: number
  averageRating: number
  reviewCount: number
  isBanned?: boolean
}
type Resp = { items: Contractor[]; totalCount: number }

function AdminContractorPage() {
  const [data, setData] = useState<Resp | null>(null)

  const load = () => {
    setData(null)
    api
      .get<Resp>('/admin/contractors', { params: { page: 0, size: 50 } })
      .then(({ data }) => setData(data))
      .catch(() => setData({ items: [], totalCount: 0 }))
  }
  useEffect(load, [])

  const ban = async (id: number) => {
    await api.put(`/admin/contractors/${id}/ban`)
    load()
  }
  const unban = async (id: number) => {
    await api.put(`/admin/contractors/${id}/unban`)
    load()
  }

  if (!data) return <Loading />

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-sm font-semibold text-brand-600">Admin</div>
          <h1 className="mt-2 text-[26px] font-bold tracking-tight text-ink-900">업자 관리</h1>
        </div>
        <div className="text-sm text-ink-500">총 {data.totalCount.toLocaleString()}곳</div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-left text-xs uppercase tracking-wider text-ink-500">
            <tr>
              <th className="px-5 py-3.5">ID</th>
              <th className="py-3.5">업체명</th>
              <th className="py-3.5">경력</th>
              <th className="py-3.5">평점</th>
              <th className="py-3.5">상태</th>
              <th className="py-3.5 pr-5 text-right">관리</th>
            </tr>
          </thead>
          <tbody>
            {data.items.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-sm text-ink-500">
                  등록된 시공업자가 없습니다.
                </td>
              </tr>
            )}
            {data.items.map((c) => (
              <tr key={c.id} className="border-t border-ink-100 hover:bg-ink-50/40">
                <td className="px-5 py-4 text-xs text-ink-500">#{c.id}</td>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-xs font-bold text-brand-600">
                      {c.companyName.charAt(0)}
                    </div>
                    <div className="font-semibold text-ink-900">{c.companyName}</div>
                  </div>
                </td>
                <td className="py-4 text-ink-700">{c.career}년</td>
                <td className="py-4">
                  <span className="inline-flex items-center gap-1 text-accent-500">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                      <path d="M10 2l2.4 5 5.6.8-4 3.9 1 5.6L10 14.8 4.9 17.3l1-5.6-4-3.9L7.6 7 10 2z" />
                    </svg>
                    <span className="font-semibold text-ink-700">{c.averageRating.toFixed(1)}</span>
                    <span className="text-ink-400">({c.reviewCount})</span>
                  </span>
                </td>
                <td className="py-4">
                  {c.isBanned ? (
                    <span className="inline-flex h-6 items-center rounded-full bg-rose-50 px-2.5 text-[11px] font-semibold text-rose-700">
                      차단됨
                    </span>
                  ) : (
                    <span className="inline-flex h-6 items-center rounded-full bg-emerald-50 px-2.5 text-[11px] font-semibold text-emerald-700">
                      정상
                    </span>
                  )}
                </td>
                <td className="py-4 pr-5 text-right">
                  {c.isBanned ? (
                    <button
                      onClick={() => unban(c.id)}
                      className="inline-flex h-9 items-center justify-center rounded-lg bg-white px-3 text-xs font-semibold text-ink-700 ring-1 ring-ink-200 transition hover:bg-ink-50"
                    >
                      차단 해제
                    </button>
                  ) : (
                    <button
                      onClick={() => ban(c.id)}
                      className="inline-flex h-9 items-center justify-center rounded-lg bg-rose-50 px-3 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 transition hover:bg-rose-100"
                    >
                      차단
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminContractorPage
