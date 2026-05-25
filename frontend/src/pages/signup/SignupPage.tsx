import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
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
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold">회원가입</h1>
      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <Input label="이메일" type="email" required value={form.email} onChange={update('email')} />
        <Input label="닉네임" required minLength={2} value={form.nickname} onChange={update('nickname')} />
        <Input label="비밀번호 (6자 이상)" type="password" required minLength={6} value={form.password} onChange={update('password')} />
        <Input label="휴대폰" placeholder="010-0000-0000" value={form.phone} onChange={update('phone')} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" fullWidth disabled={loading}>{loading ? '처리 중...' : '가입하기'}</Button>
        <p className="text-center text-sm text-slate-500">
          이미 계정이 있으신가요? <Link to="/login" className="font-medium text-slate-900 hover:underline">로그인</Link>
        </p>
      </form>
    </div>
  )
}

export default SignupPage
