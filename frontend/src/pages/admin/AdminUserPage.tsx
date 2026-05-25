import { useEffect, useState } from 'react'
import api from '../../api/axios'
import Loading from '../../components/common/Loading'
import Button from '../../components/ui/Button'

type User = { id: number; email: string; nickname: string; role: string; isBanned?: boolean }
type Resp = { items: User[]; totalCount: number }

function AdminUserPage() {
  const [data, setData] = useState<Resp | null>(null)
  const load = () => {
    setData(null)
    api.get<Resp>('/admin/users', { params: { page: 0, size: 50 } })
      .then(({ data }) => setData(data))
      .catch(() => setData({ items: [], totalCount: 0 }))
  }
  useEffect(load, [])

  const ban = async (id: number) => {
    const reason = prompt('차단 사유') ?? ''
    await api.put(`/admin/users/${id}/ban`, { reason }); load()
  }
  const unban = async (id: number) => { await api.put(`/admin/users/${id}/unban`); load() }

  if (!data) return <Loading />
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">회원 관리</h1>
      <table className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white text-sm">
        <thead className="bg-slate-50 text-left">
          <tr>
            <th className="px-4 py-3">ID</th><th>이메일</th><th>닉네임</th><th>권한</th><th>상태</th><th className="text-right pr-4">관리</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((u) => (
            <tr key={u.id} className="border-t border-slate-100">
              <td className="px-4 py-3">{u.id}</td>
              <td>{u.email}</td>
              <td>{u.nickname}</td>
              <td>{u.role}</td>
              <td>{u.isBanned ? <span className="text-red-600">차단됨</span> : '정상'}</td>
              <td className="text-right pr-4">
                {u.isBanned
                  ? <Button variant="secondary" onClick={() => unban(u.id)}>차단 해제</Button>
                  : <Button variant="danger" onClick={() => ban(u.id)}>차단</Button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default AdminUserPage
