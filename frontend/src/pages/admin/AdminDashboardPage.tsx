import { useEffect, useState } from 'react'
import api from '../../api/axios'
import Loading from '../../components/common/Loading'

type Dashboard = { totalUsers: number; totalContractors: number; totalReviews: number }

function AdminDashboardPage() {
  const [d, setD] = useState<Dashboard | null>(null)
  useEffect(() => {
    api.get<Dashboard>('/admin/dashboard').then(({ data }) => setD(data)).catch(() => {})
  }, [])
  if (!d) return <Loading />
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">대시보드</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="전체 회원" value={d.totalUsers} />
        <Stat label="시공업자" value={d.totalContractors} />
        <Stat label="리뷰" value={d.totalReviews} />
      </div>
    </div>
  )
}
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="text-3xl font-bold">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{label}</div>
    </div>
  )
}
export default AdminDashboardPage
