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
    api
      .get<Summary>('/mypage')
      .then(({ data }) => setSummary(data))
      .catch(() => {})
  }, [])

  if (!summary) return <Loading />

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 space-y-8">
      <div>
        <div className="text-sm font-semibold text-brand-600">My Page</div>
        <h1 className="mt-2 text-[28px] font-bold tracking-tight text-ink-900 md:text-[34px]">
          마이페이지
        </h1>
      </div>

      {/* Profile card */}
      <section className="overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200">
        <div className="relative h-24 bg-gradient-to-br from-brand-100 via-brand-50 to-accent-50">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-brand-200/40 blur-3xl"
          />
        </div>
        <div className="-mt-10 px-7 pb-7">
          <div className="flex items-end gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-xl font-bold text-brand-600 shadow-lg shadow-ink-900/10 ring-1 ring-ink-200">
              {summary.user.nickname.charAt(0)}
            </div>
            <div className="flex-1 pb-1">
              <div className="text-xl font-bold tracking-tight text-ink-900">
                {summary.user.nickname}
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-sm text-ink-500">
                {summary.user.email}
                <span className="inline-flex h-5 items-center rounded-full bg-brand-50 px-2 text-[10px] font-semibold uppercase tracking-wider text-brand-700">
                  {me?.role ?? summary.user.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="견적 요청" value={summary.estimates} to="/mypage/estimates" icon={<DocIcon />} />
        <StatCard label="작성 리뷰" value={summary.reviews} to="/mypage/reviews" icon={<PenIcon />} />
        <StatCard label="찜한 업자" value={summary.likes} to="/favorites" icon={<HeartIcon />} />
      </section>
    </div>
  )
}

function StatCard({
  label,
  value,
  to,
  icon,
}: {
  label: string
  value: number
  to: string
  icon: React.ReactNode
}) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between rounded-2xl bg-white p-5 ring-1 ring-ink-200 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink-900/5 hover:ring-brand-200"
    >
      <div>
        <div className="text-sm text-ink-500">{label}</div>
        <div className="mt-1 text-3xl font-bold tracking-tight text-ink-900">{value}</div>
      </div>
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-500 group-hover:text-white">
        {icon}
      </div>
    </Link>
  )
}

function DocIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M7 3h7l5 5v13H7V3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}
function PenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M14 4l6 6-10 10H4v-6L14 4z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}
function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M12 20s-7-5-7-11a4.5 4.5 0 017-3.5A4.5 4.5 0 0119 9c0 6-7 11-7 11z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default MyPage
