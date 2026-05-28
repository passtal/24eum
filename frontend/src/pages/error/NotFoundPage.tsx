import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="relative mx-auto max-w-md px-6 py-24 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 h-64 w-64 rounded-full bg-brand-100/60 blur-3xl"
      />
      <div className="relative">
        <div className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-[88px] font-black leading-none tracking-tighter text-transparent">
          404
        </div>
        <h1 className="mt-4 text-xl font-bold text-ink-900">페이지를 찾을 수 없습니다</h1>
        <p className="mt-2 text-sm text-ink-600">
          입력하신 주소를 확인해주세요. 페이지가 이동되었거나 삭제되었을 수 있습니다.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-500 px-5 text-sm font-semibold text-white shadow-sm shadow-brand-500/30 transition hover:bg-brand-600"
          >
            메인으로
          </Link>
          <Link
            to="/designs"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-ink-900 ring-1 ring-ink-200 transition hover:bg-ink-50"
          >
            디자인 모델 둘러보기
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
