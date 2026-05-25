import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../../api/axios'

type Design = { id: number; modelCode: string; name: string; description?: string; thumbnailImage?: string }

function HomePage() {
  const [designs, setDesigns] = useState<Design[]>([])

  useEffect(() => {
    api.get<Design[]>('/designs').then(({ data }) => setDesigns(data)).catch(() => {})
  }, [])

  return (
    <div>
      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 to-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-[460px] w-[460px] rounded-full bg-brand-200/40 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-32 h-[420px] w-[420px] rounded-full bg-accent-100/60 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink-700 ring-1 ring-ink-200">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              인테리어 매칭 플랫폼 · aloha team
            </span>

            <h1 className="mt-6 text-[40px] font-bold leading-[1.15] tracking-tight text-ink-900 md:text-[56px]">
              인테리어, 디자인부터 시공까지<br />
              <span className="text-brand-500">한 번에 잇다.</span>
            </h1>

            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-600 md:text-lg">
              디자인 모델을 고르고 예산·면적만 입력하면, 24이음이 가장 잘 맞는 시공업자
              Top 5를 자동으로 매칭해드립니다.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/estimate"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-500 px-6 text-[15px] font-semibold text-white shadow-sm shadow-brand-500/30 transition hover:bg-brand-600"
              >
                무료 견적 받기
              </Link>
              <Link
                to="/designs"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 text-[15px] font-semibold text-ink-900 ring-1 ring-ink-200 transition hover:bg-ink-50 hover:ring-ink-300"
              >
                디자인 둘러보기
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-500">
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-brand-500" />
                중개 수수료 0원
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-brand-500" />
                검증된 시공업자만 매칭
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-brand-500" />
                1:1 실시간 상담
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 3-step ───────── */}
      <section className="border-t border-ink-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <div className="text-sm font-semibold text-brand-600">How it works</div>
            <h2 className="mt-2 text-[28px] font-bold tracking-tight text-ink-900 md:text-[34px]">
              3단계로 끝나는<br />인테리어 매칭
            </h2>
            <p className="mt-3 text-ink-600">복잡한 발품과 비교 견적은 이제 그만. 24이음이 정리해드립니다.</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <StepCard
              step="01"
              title="디자인 모델 선택"
              desc="모던 · 클래식 · 미니멀 등 라이프스타일에 맞는 디자인 모델을 고르세요."
            />
            <StepCard
              step="02"
              title="예산 · 면적 입력"
              desc="간단한 정보 입력만으로 견적 요청이 완료됩니다. 회원가입 없이도 시작 가능."
            />
            <StepCard
              step="03"
              title="시공업자 Top 5 매칭"
              desc="평점 · 시공 이력 · 지역을 종합해 가장 잘 맞는 5곳을 자동 추천."
            />
          </div>
        </div>
      </section>

      {/* ───────── Design models ───────── */}
      <section className="bg-ink-50/60">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-sm font-semibold text-brand-600">Design Models</div>
              <h2 className="mt-2 text-[28px] font-bold tracking-tight text-ink-900 md:text-[34px]">
                먼저 디자인을 골라보세요
              </h2>
              <p className="mt-3 max-w-xl text-ink-600">
                전문 디자이너가 큐레이션한 모델 중 마음에 드는 분위기를 선택해보세요.
              </p>
            </div>
            <Link
              to="/designs"
              className="hidden shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-brand-600 hover:bg-white md:inline-block"
            >
              전체 보기 →
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {designs.slice(0, 4).map((d) => (
              <Link
                key={d.id}
                to={`/designs/${d.id}`}
                className="group overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink-900/5"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-ink-100 to-ink-200">
                  {d.thumbnailImage ? (
                    <img
                      src={d.thumbnailImage}
                      alt={d.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-3xl font-bold text-ink-400">
                      {d.modelCode}
                    </div>
                  )}
                  <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2 py-1 text-[11px] font-bold tracking-wider text-ink-900">
                    {d.modelCode}
                  </span>
                </div>
                <div className="p-5">
                  <div className="text-[15px] font-semibold text-ink-900 group-hover:text-brand-600">{d.name}</div>
                  <div className="mt-1 line-clamp-2 text-sm text-ink-500">{d.description}</div>
                </div>
              </Link>
            ))}
            {designs.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-ink-300 bg-white p-10 text-center text-sm text-ink-500">
                디자인 모델이 아직 등록되지 않았습니다.
              </div>
            )}
          </div>

          <div className="mt-8 md:hidden">
            <Link
              to="/designs"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-ink-900 ring-1 ring-ink-200"
            >
              전체 디자인 보기
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── Features ───────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-10 md:grid-cols-3">
            <FeatureBlock
              icon={<MatchIcon />}
              title="똑똑한 자동 매칭"
              desc="예산 · 면적 · 선호 디자인을 분석해 가장 잘 맞는 시공업자 Top 5를 추천합니다."
            />
            <FeatureBlock
              icon={<ChatIcon />}
              title="실시간 1:1 상담"
              desc="WebSocket 기반 채팅으로 시공업자와 즉시 대화. 견적부터 일정 조율까지 한 곳에서."
            />
            <FeatureBlock
              icon={<AiIcon />}
              title="AI 검색 도우미"
              desc="자연어로 원하는 분위기를 설명하면 OpenAI 기반 검색이 적합한 모델을 찾아드립니다."
            />
          </div>
        </div>
      </section>

      {/* ───────── Stats ───────── */}
      <section className="bg-ink-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-10 md:grid-cols-3">
            <Stat value="4.9" suffix="/ 5.0" label="이용자 평균 만족도" />
            <Stat value="120+" label="검증된 시공업자" />
            <Stat value="98%" label="매칭 성사율" />
          </div>
        </div>
      </section>

      {/* ───────── CTA band ───────── */}
      <section className="bg-brand-50">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <h2 className="text-[28px] font-bold tracking-tight text-ink-900 md:text-[34px]">
            지금 바로 무료로 시작해보세요
          </h2>
          <p className="mt-3 text-ink-600">회원가입 1분, 견적 요청은 단 3분이면 충분합니다.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/estimate"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-500 px-6 text-[15px] font-semibold text-white shadow-sm shadow-brand-500/30 transition hover:bg-brand-600"
            >
              무료 견적 받기
            </Link>
            <Link
              to="/signup"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 text-[15px] font-semibold text-ink-900 ring-1 ring-ink-200 transition hover:bg-ink-50"
            >
              회원가입
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ───────── helpers ───────── */

function StepCard({ step, title, desc }: { step: string; title: string; desc: string }) {
  return (
    <div className="relative rounded-2xl bg-white p-7 ring-1 ring-ink-100 transition hover:ring-brand-200">
      <div className="text-xs font-bold tracking-widest text-brand-500">STEP {step}</div>
      <div className="mt-3 text-[19px] font-bold text-ink-900">{title}</div>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">{desc}</p>
    </div>
  )
}

function FeatureBlock({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div>
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        {icon}
      </div>
      <div className="mt-5 text-[18px] font-bold text-ink-900">{title}</div>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">{desc}</p>
    </div>
  )
}

function Stat({ value, suffix, label }: { value: string; suffix?: string; label: string }) {
  return (
    <div>
      <div className="text-[40px] font-bold tracking-tight text-white md:text-[48px]">
        {value}
        {suffix && <span className="ml-1 text-lg font-medium text-ink-400">{suffix}</span>}
      </div>
      <div className="mt-2 text-sm text-ink-400">{label}</div>
    </div>
  )
}

/* ───────── icons ───────── */

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M4 10.5l3.5 3.5L16 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MatchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h10M4 12h6M4 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="18" cy="7" r="2.2" stroke="currentColor" strokeWidth="2" />
      <circle cx="14" cy="17" r="2.2" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H10l-4 4v-4H6a2 2 0 01-2-2V6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function AiIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l2.2 4.6L19 9.5l-3.5 3.4.8 4.9L12 15.5 7.7 17.8l.8-4.9L5 9.5l4.8-1.9L12 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

export default HomePage
