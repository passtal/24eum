import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../../api/axios'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

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
    api.get<Design[]>('/designs').then(({ data }) => setDesigns(data)).catch(() => {})
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

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">견적 요청</h1>
      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">디자인 모델</span>
          <select
            required
            value={form.designModelId}
            onChange={(e) => setForm((p) => ({ ...p, designModelId: e.target.value }))}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400"
          >
            <option value="">선택하세요</option>
            {designs.map((d) => (
              <option key={d.id} value={d.id}>{d.modelCode} - {d.name}</option>
            ))}
          </select>
        </label>
        <Input label="예산 (원)" type="number" required value={form.budget}
               onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))} />
        <Input label="면적 (평수)" type="number" step="0.1" required value={form.area}
               onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))} />
        <Input label="시공 주소" value={form.address}
               onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">상세 요청사항</span>
          <textarea
            rows={5}
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? '매칭 중...' : '견적 요청 및 업자 매칭'}
        </Button>
      </form>
    </div>
  )
}

export default EstimateFormPage
