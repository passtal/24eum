import { FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
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
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold">로그인</h1>
      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <Input label="이메일" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="비밀번호" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" fullWidth disabled={loading}>{loading ? '로그인 중...' : '로그인'}</Button>
        <a
          href="/oauth2/authorization/kakao"
          className="block w-full rounded-lg bg-[#FEE500] py-2 text-center text-sm font-medium text-slate-900 hover:opacity-90"
        >
          카카오로 로그인
        </a>
        <p className="text-center text-sm text-slate-500">
          계정이 없으신가요? <Link to="/signup" className="font-medium text-slate-900 hover:underline">회원가입</Link>
        </p>
      </form>
    </div>
  )
}

export default LoginPage
