import { useEffect, useState } from 'react'
import api from '../../api/axios'
import Loading from '../../components/common/Loading'

type Dashboard = { totalUsers: number; totalContractors: number; totalReviews: number }

function AdminDashboardPage() {
  const [d, setD] = useState<Dashboard | null>(null)
  useEffect(() => {
    api
      .get<Dashboard>('/admin/dashboard')
      .then(({ data }) => setD(data))
      .catch(() => {})
  }, [])

  if (!d) return <Loading />

  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm font-semibold text-brand-600">Admin</div>
        <h1 className="mt-2 text-[26px] font-bold tracking-tight text-ink-900">대시보드</h1>
        <p className="mt-2 text-sm text-ink-600">
          24이음의 현재 운영 지표 요약입니다.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="전체 회원" value={d.totalUsers} accent="brand" icon={<UsersIcon />} />
        <StatCard label="시공업자" value={d.totalContractors} accent="accent" icon={<BuildingIcon />} />
        <StatCard label="리뷰" value={d.totalReviews} accent="emerald" icon={<StarIcon />} />
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  accent,
  icon,
}: {
  label: string
  value: number
  accent: 'brand' | 'accent' | 'emerald'
  icon: React.ReactNode
}) {
  const palette = {
    brand: 'bg-brand-50 text-brand-600',
    accent: 'bg-accent-50 text-accent-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  }[accent]
  return (
    <div className="rounded-2xl bg-white p-6 ring-1 ring-ink-200">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-ink-500">{label}</div>
          <div className="mt-2 text-[34px] font-bold tracking-tight tabular-nums text-ink-900">
            {value.toLocaleString()}
          </div>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${palette}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M2.5 20c.5-3.5 3.5-5.5 6.5-5.5s5.5 1.5 6.5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M14 20c.4-2.5 2-4 3.5-4 1.6 0 3 1 3.7 3.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}
function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M4 20h16M6 20V6a2 2 0 012-2h8a2 2 0 012 2v14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9 8h2M9 12h2M13 8h2M13 12h2M9 16h6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}
function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2.5l2.9 6 6.6 1-4.7 4.6 1.1 6.6L12 17.6 6.1 20.7l1.1-6.6L2.5 9.5l6.6-1L12 2.5z" />
    </svg>
  )
}

export default AdminDashboardPage
