import { Link } from 'react-router-dom'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-ink-100 bg-ink-50">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {/* 브랜드 */}
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <span aria-hidden className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500 text-sm font-bold text-white">
                24
              </span>
              <span className="text-[17px] font-bold tracking-tight text-ink-900">이음</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-600">
              인테리어 디자인 선택부터 시공업자 매칭, 1:1 상담까지<br />
              한 번에 잇는 매칭 플랫폼.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs text-ink-600 ring-1 ring-ink-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              현재 서비스 운영 중
            </div>
          </div>

          {/* 서비스 */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-400">서비스</div>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/designs" className="text-ink-700 hover:text-brand-600">디자인 모델</Link></li>
              <li><Link to="/contractors" className="text-ink-700 hover:text-brand-600">시공업자</Link></li>
              <li><Link to="/estimate" className="text-ink-700 hover:text-brand-600">견적 요청</Link></li>
              <li><Link to="/ai" className="text-ink-700 hover:text-brand-600">AI 검색</Link></li>
            </ul>
          </div>

          {/* 회사 */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-400">회사</div>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><span className="text-ink-700">팀 aloha</span></li>
              <li><span className="text-ink-700">이용약관</span></li>
              <li><span className="text-ink-700">개인정보처리방침</span></li>
              <li><span className="text-ink-700">고객센터</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-ink-200 pt-6 text-xs text-ink-500 md:flex-row md:items-center">
          <p>© {year} 24이음 (24eum) · aloha team. All rights reserved.</p>
          <p>Made with care for better interior matching.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
