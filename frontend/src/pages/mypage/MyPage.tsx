import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import Loading from '../../components/common/Loading'
import { useApp } from '../../contexts/AppContext'

type Summary = {
  user: { id: number; email: string; nickname: string; role: string }
  estimates: number
  reviews: number
  likes: number
}

function MyPage() {
  const { me } = useApp()
  const [summary, setSummary] = useState<Summary | null>(null)
  useEffect(() => {
    api.get<Summary>('/mypage').then(({ data }) => setSummary(data)).catch(() => {})
  }, [])

  if (!summary) return <Loading />
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">마이페이지</h1>
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="text-sm text-slate-500">{summary.user.email}</div>
        <div className="text-xl font-semibold">{summary.user.nickname}</div>
        <div className="mt-1 text-xs text-slate-400">{me?.role}</div>
      </section>
      <section className="grid grid-cols-3 gap-3">
        <StatCard label="견적요청" value={summary.estimates} to="/mypage/estimates" />
        <StatCard label="작성리뷰" value={summary.reviews} to="/mypage/reviews" />
        <StatCard label="찜한업자" value={summary.likes} to="/favorites" />
      </section>
    </div>
  )
}

function StatCard({ label, value, to }: { label: string; value: number; to: string }) {
  return (
    <Link to={to} className="rounded-xl border border-slate-200 bg-white p-5 text-center hover:shadow-md">
      <div className="text-3xl font-bold">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{label}</div>
    </Link>
  )
}

export default MyPage
