import { useEffect, useState } from 'react'
import api from '../../api/axios'
import Loading from '../../components/common/Loading'

type User = { id: number; email: string; nickname: string; role: string; isBanned?: boolean }
type Resp = { items: User[]; totalCount: number }

function AdminUserPage() {
  const [data, setData] = useState<Resp | null>(null)

  const load = () => {
    setData(null)
    api
      .get<Resp>('/admin/users', { params: { page: 0, size: 50 } })
      .then(({ data }) => setData(data))
      .catch(() => setData({ items: [], totalCount: 0 }))
  }
  useEffect(load, [])

  const ban = async (id: number) => {
    const reason = prompt('차단 사유') ?? ''
    await api.put(`/admin/users/${id}/ban`, { reason })
    load()
  }
  const unban = async (id: number) => {
    await api.put(`/admin/users/${id}/unban`)
    load()
  }

  if (!data) return <Loading />

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-sm font-semibold text-brand-600">Admin</div>
          <h1 className="mt-2 text-[26px] font-bold tracking-tight text-ink-900">회원 관리</h1>
        </div>
        <div className="text-sm text-ink-500">총 {data.totalCount.toLocaleString()}명</div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-left text-xs uppercase tracking-wider text-ink-500">
            <tr>
              <th className="px-5 py-3.5">ID</th>
              <th className="py-3.5">사용자</th>
              <th className="py-3.5">권한</th>
              <th className="py-3.5">상태</th>
              <th className="py-3.5 pr-5 text-right">관리</th>
            </tr>
          </thead>
          <tbody>
            {data.items.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-sm text-ink-500">
                  등록된 회원이 없습니다.
                </td>
              </tr>
            )}
            {data.items.map((u) => (
              <tr key={u.id} className="border-t border-ink-100 hover:bg-ink-50/40">
                <td className="px-5 py-4 text-xs text-ink-500">#{u.id}</td>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
                      {u.nickname.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-ink-900">{u.nickname}</div>
                      <div className="text-xs text-ink-500">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <RoleBadge role={u.role} />
                </td>
                <td className="py-4">
                  {u.isBanned ? (
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
                  {u.isBanned ? (
                    <button
                      onClick={() => unban(u.id)}
                      className="inline-flex h-9 items-center justify-center rounded-lg bg-white px-3 text-xs font-semibold text-ink-700 ring-1 ring-ink-200 transition hover:bg-ink-50"
                    >
                      차단 해제
                    </button>
                  ) : (
                    <button
                      onClick={() => ban(u.id)}
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

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, string> = {
    ADMIN: 'bg-brand-50 text-brand-700',
    OWNER: 'bg-accent-50 text-accent-700',
    USER: 'bg-ink-100 text-ink-700',
  }
  const cls = map[role] ?? 'bg-ink-100 text-ink-700'
  return (
    <span className={`inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-semibold uppercase tracking-wider ${cls}`}>
      {role}
    </span>
  )
}

export default AdminUserPage
