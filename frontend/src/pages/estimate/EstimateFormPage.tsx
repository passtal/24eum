import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../../api/axios'
import Button from '../../components/ui/Button'

type Design = { id: number; modelCode: string; name: string }

function EstimateFormPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [designs, setDesigns] = useState<Design[]>([])
  const [form, setForm] = useState({
    designModelId: params.get('designId') ?? '',
    budget: '',
    area: '',
    address: '',
    description: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api
      .get<Design[]>('/designs')
      .then(({ data }) => setDesigns(data))
      .catch(() => {})
  }, [])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { data } = await api.post('/estimates', {
        designModelId: form.designModelId ? Number(form.designModelId) : null,
        budget: Number(form.budget),
        area: Number(form.area),
        address: form.address,
        description: form.description,
      })
      navigate(`/estimate/${data.id}`, { replace: true })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? '견적 요청에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const update = <K extends keyof typeof form>(key: K, value: string) =>
    setForm((p) => ({ ...p, [key]: value }))

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-8">
        <div className="text-sm font-semibold text-brand-600">Estimate</div>
        <h1 className="mt-2 text-[28px] font-bold tracking-tight text-ink-900 md:text-[34px]">
          견적 요청
        </h1>
        <p className="mt-3 text-ink-600">
          몇 가지 정보만 입력하시면, 가장 잘 맞는 시공업자 Top 5를 자동으로 매칭해드립니다.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6 rounded-2xl bg-white p-7 ring-1 ring-ink-200">
        {/* Design model */}
        <Field label="디자인 모델" required>
          <select
            required
            value={form.designModelId}
            onChange={(e) => update('designModelId', e.target.value)}
            className="h-11 w-full rounded-xl bg-white px-3 text-[14px] text-ink-900 ring-1 ring-ink-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">선택하세요</option>
            {designs.map((d) => (
              <option key={d.id} value={d.id}>
                {d.modelCode} · {d.name}
              </option>
            ))}
          </select>
        </Field>

        {/* Budget + Area */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="예산" suffix="원" required>
            <FormInput
              type="number"
              required
              value={form.budget}
              onChange={(e) => update('budget', e.target.value)}
              placeholder="10000000"
            />
          </Field>
          <Field label="면적" suffix="평" required>
            <FormInput
              type="number"
              step="0.1"
              required
              value={form.area}
              onChange={(e) => update('area', e.target.value)}
              placeholder="24"
            />
          </Field>
        </div>

        <Field label="시공 주소">
          <FormInput
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
            placeholder="서울특별시 강남구 ..."
          />
        </Field>

        <Field label="상세 요청사항">
          <textarea
            rows={5}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="원하는 분위기, 특별히 신경 써주셨으면 하는 부분 등을 자유롭게 적어주세요."
            className="w-full rounded-xl bg-white px-3 py-2.5 text-[14px] leading-relaxed text-ink-900 ring-1 ring-ink-200 transition placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </Field>

        {error && (
          <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
            {error}
          </div>
        )}

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? '매칭 중...' : '견적 요청 및 업자 매칭'}
        </Button>

        <p className="text-center text-xs text-ink-500">
          제출 시 24이음의 매칭 알고리즘이 디자인 일치 · 경력 · 평점 · 리뷰 수를 종합하여
          상위 5명의 시공업자를 자동 추천합니다.
        </p>
      </form>
    </div>
  )
}

function Field({
  label,
  required,
  suffix,
  children,
}: {
  label: string
  required?: boolean
  suffix?: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-ink-900">
          {label}
          {required && <span className="ml-1 text-brand-500">*</span>}
        </span>
        {suffix && <span className="text-xs text-ink-500">단위: {suffix}</span>}
      </div>
      {children}
    </label>
  )
}

function FormInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props
  return (
    <input
      {...rest}
      className={`h-11 w-full rounded-xl bg-white px-3 text-[14px] text-ink-900 ring-1 ring-ink-200 transition placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-500 ${className}`}
    />
  )
}

export default EstimateFormPage
