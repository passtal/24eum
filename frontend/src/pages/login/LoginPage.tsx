import { FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import { useApp } from '../../contexts/AppContext'

function LoginPage() {
  const { login } = useApp()
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: string } }
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate(location.state?.from ?? '/', { replace: true })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-14">
      <div className="text-center">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500 text-sm font-bold text-white">
            24
          </span>
          <span className="text-[18px] font-bold tracking-tight text-ink-900">이음</span>
        </Link>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-ink-900">다시 오신 것을 환영합니다</h1>
        <p className="mt-2 text-sm text-ink-500">로그인하고 견적 매칭과 1:1 채팅을 이용해보세요.</p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl bg-white p-7 ring-1 ring-ink-200">
        <AuthField label="이메일">
          <AuthInput type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </AuthField>
        <AuthField label="비밀번호">
          <AuthInput type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </AuthField>

        {error && (
          <div className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700 ring-1 ring-rose-200">
            {error}
          </div>
        )}

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </Button>

        <div className="relative my-2 text-center">
          <div className="absolute inset-x-0 top-1/2 h-px bg-ink-200" />
          <span className="relative bg-white px-3 text-xs text-ink-400">또는</span>
        </div>

        <a
          href="/oauth2/authorization/kakao"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] text-[14px] font-semibold text-ink-900 transition hover:brightness-95"
        >
          <KakaoIcon className="h-4 w-4" />
          카카오로 시작하기
        </a>

        <p className="pt-2 text-center text-sm text-ink-500">
          계정이 없으신가요?{' '}
          <Link to="/signup" className="font-semibold text-brand-600 hover:text-brand-700">
            회원가입
          </Link>
        </p>
      </form>
    </div>
  )
}

function AuthField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-ink-900">{label}</span>
      {children}
    </label>
  )
}
function AuthInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-11 w-full rounded-xl bg-white px-3 text-[14px] text-ink-900 ring-1 ring-ink-200 transition placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
    />
  )
}
function KakaoIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M10 3c-4.4 0-8 2.9-8 6.4 0 2.3 1.5 4.3 3.8 5.4l-.9 3.3c-.1.3.3.5.5.3L9 16.3c.3 0 .7.1 1 .1 4.4 0 8-2.9 8-6.4S14.4 3 10 3z" />
    </svg>
  )
}

export default LoginPage
