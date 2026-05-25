import { useEffect, useState } from 'react'
import api from '../../api/axios'
import Loading from '../../components/common/Loading'
import Button from '../../components/ui/Button'

type Review = {
  id: number; rating: number; content?: string; isHidden?: boolean;
  userNickname?: string; contractorName?: string; createdAt: string
}
type Resp = { items: Review[]; totalCount: number }

function AdminReviewPage() {
  const [data, setData] = useState<Resp | null>(null)
  const load = () => {
    setData(null)
    api.get<Resp>('/admin/reviews', { params: { page: 0, size: 50 } })
      .then(({ data }) => setData(data))
      .catch(() => setData({ items: [], totalCount: 0 }))
  }
  useEffect(load, [])

  const hide = async (id: number) => { await api.put(`/admin/reviews/${id}/hide`); load() }
  const show = async (id: number) => { await api.put(`/admin/reviews/${id}/show`); load() }

  if (!data) return <Loading />
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">리뷰 관리</h1>
      <div className="space-y-3">
        {data.items.map((r) => (
          <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="font-medium">{r.userNickname}</span>
                <span className="mx-1 text-slate-400">→</span>
                <span className="font-medium">{r.contractorName}</span>
                <span className="ml-2 text-slate-500">⭐ {r.rating}</span>
                {r.isHidden && <span className="ml-2 rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">숨김</span>}
              </div>
              <div className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleString()}</div>
            </div>
            {r.content && <p className="mt-2 text-sm text-slate-700">{r.content}</p>}
            <div className="mt-2 text-right">
              {r.isHidden
                ? <Button variant="secondary" onClick={() => show(r.id)}>숨김 해제</Button>
                : <Button variant="danger" onClick={() => hide(r.id)}>숨김 처리</Button>}
            </div>
          </div>
        ))}
        {data.items.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            등록된 리뷰가 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}
export default AdminReviewPage
