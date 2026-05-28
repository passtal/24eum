import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import useEmblaCarousel from 'embla-carousel-react'
import * as Accordion from '@radix-ui/react-accordion'
import api from '../../api/axios'
import { resolveDesignImage } from '../../utils/designImages'

type Design = { id: number; modelCode: string; name: string; description?: string; thumbnailImage?: string }

function HomePage() {
  const [designs, setDesigns] = useState<Design[]>([])

  useEffect(() => {
    api.get<Design[]>('/designs').then(({ data }) => setDesigns(data)).catch(() => {})
  }, [])

  return (
    <div>
      <Hero designs={designs} />
      <HowItWorks />
      <DesignsSection designs={designs} />
      <Features />
      <Testimonials />
      <StatsBand />
      <FAQ />
      <FinalCTA />
    </div>
  )
}

/* ═══════════════════════════ Hero ═══════════════════════════ */

function Hero({ designs }: { designs: Design[] }) {
  const heroDesigns = designs.slice(0, 4)

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 to-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-[460px] w-[460px] rounded-full bg-brand-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-32 h-[420px] w-[420px] rounded-full bg-accent-100/60 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-[1.1fr_1fr] md:items-center md:py-28 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink-700 ring-1 ring-ink-200"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-500" />
            </span>
            인테리어 매칭 플랫폼
          </motion.span>

          <h1 className="mt-6 text-[42px] font-bold leading-[1.1] tracking-tight text-ink-900 md:text-[60px]">
            인테리어,<br />
            디자인부터 시공까지<br />
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
              한 번에 잇다.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-600 md:text-lg">
            디자인 모델을 고르고 예산·면적만 입력하면, 24이음이 가장 잘 맞는 시공업자
            Top 5를 자동으로 매칭해드립니다.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/estimate"
              className="group inline-flex h-12 items-center justify-center gap-1 rounded-xl bg-brand-500 px-6 text-[15px] font-semibold text-white shadow-sm shadow-brand-500/30 transition hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/30"
            >
              무료 견적 받기
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/designs"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 text-[15px] font-semibold text-ink-900 ring-1 ring-ink-200 transition hover:bg-ink-50 hover:ring-ink-300"
            >
              디자인 둘러보기
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-500">
            {['중개 수수료 0원', '검증된 시공업자만 매칭', '1:1 실시간 상담'].map((t, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                className="flex items-center gap-2"
              >
                <CheckIcon className="h-4 w-4 text-brand-500" />
                {t}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <HeroCollage designs={heroDesigns} />
      </div>
    </section>
  )
}

function HeroCollage({ designs }: { designs: Design[] }) {
  const labels = ['A', 'B', 'C', 'D']
  const slots = [0, 1, 2, 3].map((i) => designs[i])

  // 4장이 4분면처럼 분산되되 살짝 겹치는 콜라주. hover 시 해당 카드가 z-50으로 떠오름.
  const positions = [
    'left-[2%]  top-[2%]',   // A 좌상단
    'left-[48%] top-0',      // B 우상단
    'left-0     top-[48%]',  // C 좌하단
    'left-[46%] top-[46%]',  // D 우하단
  ]
  const rotates = [-8, 6, 5, -4]
  const zBase = [40, 30, 20, 10]
  const captions = [
    '모던 미니멀',
    '따뜻한 우드',
    '클래식 럭셔리',
    '인더스트리얼',
  ]

  return (
    <div className="relative hidden h-[500px] md:block">
      {slots.map((d, i) => {
        const code = d?.modelCode ?? labels[i]
        const img = resolveDesignImage(d, labels[i])
        const title = d?.name ?? captions[i]
        const desc = d?.description ?? '큐레이션된 디자인 모델'

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20, scale: 0.95, rotate: rotates[i] }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: rotates[i] }}
            whileHover={{ y: -14, scale: 1.06, rotate: 0, zIndex: 50, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute h-[240px] w-[200px] overflow-hidden rounded-2xl bg-white shadow-xl shadow-ink-900/15 ring-1 ring-ink-200 ${positions[i]}`}
            style={{ zIndex: zBase[i] }}
          >
            <div className="relative h-[150px] overflow-hidden bg-gradient-to-br from-brand-100 to-ink-100">
              {img ? (
                <img src={img} alt={title} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className="flex h-full items-center justify-center text-4xl font-black tracking-tighter text-ink-400">
                  {code}
                </div>
              )}
              <span className="absolute left-2 top-2 rounded-md bg-white/95 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-ink-900">
                {code}
              </span>
            </div>
            <div className="p-3">
              <div className="text-[13px] font-semibold text-ink-900">{title}</div>
              <div className="mt-0.5 line-clamp-1 text-[11px] text-ink-500">{desc}</div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════ How it works ═══════════════════════════ */

function HowItWorks() {
  return (
    <section className="border-t border-ink-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <Reveal>
          <div className="max-w-2xl">
            <div className="text-sm font-semibold text-brand-600">How it works</div>
            <h2 className="mt-2 text-[28px] font-bold tracking-tight text-ink-900 md:text-[34px]">
              3단계로 끝나는<br />인테리어 매칭
            </h2>
            <p className="mt-3 text-ink-600">복잡한 발품과 비교 견적은 이제 그만. 24이음이 정리해드립니다.</p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { step: '01', title: '디자인 모델 선택', desc: '모던 · 클래식 · 미니멀 등 라이프스타일에 맞는 디자인 모델을 고르세요.' },
            { step: '02', title: '예산 · 면적 입력', desc: '간단한 정보 입력만으로 견적 요청이 완료됩니다. 회원가입 없이도 시작 가능.' },
            { step: '03', title: '시공업자 Top 5 매칭', desc: '평점 · 시공 이력 · 지역을 종합해 가장 잘 맞는 5곳을 자동 추천.' },
          ].map((s, i) => (
            <Reveal key={s.step} delay={i * 0.08}>
              <div className="group relative h-full rounded-2xl bg-white p-7 ring-1 ring-ink-100 transition hover:-translate-y-0.5 hover:ring-brand-200 hover:shadow-lg hover:shadow-ink-900/5">
                <div className="text-xs font-bold tracking-widest text-brand-500">STEP {s.step}</div>
                <div className="mt-3 text-[19px] font-bold text-ink-900">{s.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{s.desc}</p>
                <div className="mt-6 inline-flex items-center text-sm font-medium text-brand-600 opacity-0 transition group-hover:opacity-100">
                  자세히 보기 <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════ Design models ═══════════════════════════ */

function DesignsSection({ designs }: { designs: Design[] }) {
  return (
    <section className="bg-ink-50/60">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <Reveal>
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
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {designs.slice(0, 4).map((d, i) => {
            const img = resolveDesignImage(d)
            return (
              <Reveal key={d.id} delay={i * 0.06}>
                <Link
                  to={`/designs/${d.id}`}
                  className="group block overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-ink-900/10"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-ink-100 to-ink-200">
                    {img ? (
                      <img
                        src={img}
                        alt={d.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-3xl font-bold text-ink-400">
                        {d.modelCode}
                      </div>
                    )}
                    <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2 py-1 text-[11px] font-bold tracking-wider text-ink-900">
                      {d.modelCode}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                  </div>
                  <div className="p-5">
                    <div className="text-[15px] font-semibold text-ink-900 transition group-hover:text-brand-600">{d.name}</div>
                    <div className="mt-1 line-clamp-2 text-sm text-ink-500">{d.description}</div>
                  </div>
                </Link>
              </Reveal>
            )
          })}
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
  )
}

/* ═══════════════════════════ Features ═══════════════════════════ */

function Features() {
  const features = [
    { icon: <MatchIcon />, title: '똑똑한 자동 매칭', desc: '예산 · 면적 · 선호 디자인을 분석해 가장 잘 맞는 시공업자 Top 5를 추천합니다.' },
    { icon: <ChatIcon />, title: '실시간 1:1 상담', desc: 'WebSocket 기반 채팅으로 시공업자와 즉시 대화. 견적부터 일정 조율까지 한 곳에서.' },
    { icon: <AiIcon />, title: 'AI 검색 도우미', desc: '자연어로 원하는 분위기를 설명하면 OpenAI 기반 검색이 적합한 모델을 찾아드립니다.' },
  ]
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <div className="group">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-500 group-hover:text-white group-hover:scale-110">
                  {f.icon}
                </div>
                <div className="mt-5 text-[18px] font-bold text-ink-900">{f.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════ Testimonials ═══════════════════════════ */

const TESTIMONIALS = [
  {
    name: '김O진',
    meta: '32평 아파트 · 모던',
    rating: 5,
    body: '디자인 모델만 골랐을 뿐인데 예산에 딱 맞는 업체 5곳이 추천되어 비교가 쉬웠어요. 채팅으로 바로 견적 조율한 게 가장 편했습니다.',
  },
  {
    name: '박O민',
    meta: '24평 빌라 · 미니멀',
    rating: 5,
    body: '시공업자 발품을 안 팔아서 좋았어요. AI 검색으로 인테리어 트렌드도 같이 확인할 수 있는 게 의외로 유용했습니다.',
  },
  {
    name: '이O서',
    meta: '40평 단독주택 · 클래식',
    rating: 4,
    body: '추천 업체 평점과 리뷰가 잘 정리돼 있어서 선택이 빨랐습니다. 매칭 후 채팅이 바로 열리는 흐름이 자연스러웠어요.',
  },
  {
    name: '정O호',
    meta: '18평 오피스텔 · 모던',
    rating: 5,
    body: '디자인 A안 골랐는데 비슷한 스타일을 잘 시공한 곳들로 매칭돼서 신뢰가 갔어요. 견적 차이도 한눈에 비교됐습니다.',
  },
  {
    name: '최O연',
    meta: '28평 아파트 · 빈티지',
    rating: 5,
    body: '복잡한 비교 견적을 매번 했었는데, 이번엔 추천 5곳 중에 바로 결정했습니다. 시간 절약이 가장 큰 가치였어요.',
  },
]

function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', skipSnaps: false })
  const [selected, setSelected] = useState(0)
  const [snaps, setSnaps] = useState<number[]>([])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap())
    setSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    onSelect()
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi])

  return (
    <section className="border-t border-ink-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="text-sm font-semibold text-brand-600">Reviews</div>
              <h2 className="mt-2 text-[28px] font-bold tracking-tight text-ink-900 md:text-[34px]">
                먼저 경험한 분들의 이야기
              </h2>
              <p className="mt-3 text-ink-600">
                24이음으로 인테리어를 진행한 분들의 실제 후기입니다.
              </p>
            </div>
            <div className="hidden gap-2 md:flex">
              <CarouselButton onClick={() => emblaApi?.scrollPrev()} aria-label="이전 후기">
                <ChevronLeft />
              </CarouselButton>
              <CarouselButton onClick={() => emblaApi?.scrollNext()} aria-label="다음 후기">
                <ChevronRight />
              </CarouselButton>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="min-w-0 shrink-0 grow-0 basis-[88%] sm:basis-[55%] lg:basis-[33%]">
                <TestimonialCard {...t} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {snaps.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`${i + 1}번째 후기로 이동`}
              className={`h-1.5 rounded-full transition-all ${
                selected === i ? 'w-6 bg-brand-500' : 'w-1.5 bg-ink-300 hover:bg-ink-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ name, meta, rating, body }: typeof TESTIMONIALS[number]) {
  return (
    <div className="flex h-full flex-col rounded-2xl bg-white p-6 ring-1 ring-ink-200 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink-900/5">
      <div className="flex items-center gap-1 text-accent-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} filled={i < rating} className="h-4 w-4" />
        ))}
      </div>
      <p className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-700">"{body}"</p>
      <div className="mt-6 flex items-center gap-3 border-t border-ink-100 pt-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-600">
          {name.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-semibold text-ink-900">{name}</div>
          <div className="text-xs text-ink-500">{meta}</div>
        </div>
      </div>
    </div>
  )
}

function CarouselButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  return (
    <button
      {...props}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink-700 ring-1 ring-ink-200 transition hover:bg-brand-50 hover:text-brand-600 hover:ring-brand-200"
    >
      {children}
    </button>
  )
}

/* ═══════════════════════════ Stats (count-up) ═══════════════════════════ */

function StatsBand() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="bg-ink-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-3">
          <CountStat inView={inView} value={4.9} decimals={1} suffix=" / 5.0" label="이용자 평균 만족도" />
          <CountStat inView={inView} value={120} suffix="+" label="검증된 시공업자" />
          <CountStat inView={inView} value={98} suffix="%" label="매칭 성사율" />
        </div>
      </div>
    </section>
  )
}

function CountStat({
  inView,
  value,
  decimals = 0,
  suffix,
  label,
}: {
  inView: boolean
  value: number
  decimals?: number
  suffix?: string
  label: string
}) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 1400
    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(value * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value])

  return (
    <div>
      <div className="text-[44px] font-bold tracking-tight tabular-nums md:text-[52px]">
        {display.toFixed(decimals)}
        {suffix && <span className="ml-1 text-lg font-medium text-ink-400">{suffix}</span>}
      </div>
      <div className="mt-2 text-sm text-ink-400">{label}</div>
    </div>
  )
}

/* ═══════════════════════════ FAQ ═══════════════════════════ */

const FAQ_ITEMS = [
  {
    q: '견적 요청은 정말 무료인가요?',
    a: '네. 견적 요청·매칭·1:1 채팅까지 모든 과정이 무료이며, 24이음은 중개 수수료를 받지 않습니다. 시공 계약은 사용자와 시공업자가 직접 진행합니다.',
  },
  {
    q: '시공업자는 어떻게 검증되나요?',
    a: '사업자 등록증, 경력, 시공 포트폴리오, 자격증을 기반으로 1차 등록 심사를 진행하며, 누적 리뷰 평점과 신고 이력을 통해 지속적으로 품질을 관리합니다.',
  },
  {
    q: '시공 지역에 제한이 있나요?',
    a: '현재 수도권(서울·경기·인천) 중심으로 활성화되어 있으며, 광역시 단위로 점진적으로 확장 중입니다. 매칭 결과는 사용자 주소 기준으로 자동 필터링됩니다.',
  },
  {
    q: 'AI 검색은 어떻게 동작하나요?',
    a: 'OpenAI 모델 기반으로 인테리어 도메인에 한정된 시스템 프롬프트를 적용해, "북유럽 + 화이트 톤" 같은 자연어 질의에 적합한 디자인 모델과 자재를 추천합니다.',
  },
  {
    q: '회원가입 없이도 견적을 받을 수 있나요?',
    a: '디자인 둘러보기와 시공업자 목록은 비로그인 상태로 이용 가능합니다. 다만 견적 요청서 제출과 채팅은 매칭 결과 추적을 위해 로그인이 필요합니다.',
  },
  {
    q: '매칭 결과가 마음에 들지 않으면?',
    a: '매칭 결과는 언제든 재요청 가능하며, 추천 5곳 외의 시공업자도 검색·찜으로 직접 비교 가능합니다. 매칭 알고리즘은 디자인 일치 · 경력 · 평점 · 리뷰 수를 종합합니다.',
  },
]

function FAQ() {
  return (
    <section className="bg-ink-50/60">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <Reveal>
          <div className="text-center">
            <div className="text-sm font-semibold text-brand-600">FAQ</div>
            <h2 className="mt-2 text-[28px] font-bold tracking-tight text-ink-900 md:text-[34px]">
              자주 묻는 질문
            </h2>
            <p className="mt-3 text-ink-600">궁금증이 있다면 아래를 먼저 확인해보세요.</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Accordion.Root type="single" collapsible className="mt-10 space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <Accordion.Item
                key={i}
                value={`item-${i}`}
                className="overflow-hidden rounded-xl bg-white ring-1 ring-ink-200 transition data-[state=open]:ring-brand-200 data-[state=open]:shadow-sm"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold text-ink-900 transition hover:text-brand-600">
                    {item.q}
                    <ChevronDown className="h-4 w-4 shrink-0 text-ink-500 transition group-data-[state=open]:rotate-180 group-data-[state=open]:text-brand-600" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <div className="px-5 pb-5 text-sm leading-relaxed text-ink-600">{item.a}</div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Reveal>
      </div>
    </section>
  )
}

/* ═══════════════════════════ Final CTA ═══════════════════════════ */

function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-brand-50">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-full w-[800px] rounded-full bg-brand-200/30 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-6 py-20 text-center">
        <Reveal>
          <h2 className="text-[28px] font-bold tracking-tight text-ink-900 md:text-[36px]">
            지금 바로 무료로 시작해보세요
          </h2>
          <p className="mt-3 text-ink-600">회원가입 1분, 견적 요청은 단 3분이면 충분합니다.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/estimate"
              className="group inline-flex h-12 items-center justify-center gap-1 rounded-xl bg-brand-500 px-6 text-[15px] font-semibold text-white shadow-sm shadow-brand-500/30 transition hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/30"
            >
              무료 견적 받기
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/signup"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 text-[15px] font-semibold text-ink-900 ring-1 ring-ink-200 transition hover:bg-ink-50"
            >
              회원가입
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ═══════════════════════════ Reveal helper ═══════════════════════════ */

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ═══════════════════════════ Icons ═══════════════════════════ */

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M4 10.5l3.5 3.5L16 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowRight({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M4 10h12m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronLeft({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={`h-4 w-4 ${className}`}>
      <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRight({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={`h-4 w-4 ${className}`}>
      <path d="M8 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronDown({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M4 8l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StarIcon({ filled, className = '' }: { filled: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill={filled ? 'currentColor' : 'none'} className={className}>
      <path
        d="M10 2l2.4 5 5.6.8-4 3.9 1 5.6L10 14.8 4.9 17.3l1-5.6-4-3.9L7.6 7 10 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
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
