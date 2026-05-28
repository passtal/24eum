import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import api from '../../api/axios'

function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', nickname: '', phone: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }))

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await api.post('/auth/signup', form)
      alert('가입이 완료되었습니다. 로그인해주세요.')
      navigate('/login')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? '회원가입에 실패했습니다.')
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
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-ink-900">계정 만들기</h1>
        <p className="mt-2 text-sm text-ink-500">1분이면 가입 완료. 견적 요청과 매칭까지 바로 이용하세요.</p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl bg-white p-7 ring-1 ring-ink-200">
        <AuthField label="이메일">
          <AuthInput type="email" required value={form.email} onChange={update('email')} placeholder="you@example.com" />
        </AuthField>
        <AuthField label="닉네임">
          <AuthInput required minLength={2} value={form.nickname} onChange={update('nickname')} placeholder="홍길동" />
        </AuthField>
        <AuthField label="비밀번호" hint="6자 이상">
          <AuthInput type="password" required minLength={6} value={form.password} onChange={update('password')} placeholder="••••••••" />
        </AuthField>
        <AuthField label="휴대폰" hint="선택">
          <AuthInput value={form.phone} onChange={update('phone')} placeholder="010-0000-0000" />
        </AuthField>

        {error && (
          <div className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700 ring-1 ring-rose-200">
            {error}
          </div>
        )}

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? '처리 중...' : '가입하기'}
        </Button>

        <p className="pt-2 text-center text-sm text-ink-500">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            로그인
          </Link>
        </p>
      </form>
    </div>
  )
}

function AuthField({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-ink-900">{label}</span>
        {hint && <span className="text-xs text-ink-500">{hint}</span>}
      </div>
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

export default SignupPage
