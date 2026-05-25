import { Link, NavLink } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext'

const navCls = ({ isActive }: { isActive: boolean }) =>
  `relative px-1 py-2 text-[15px] transition-colors ${
    isActive
      ? 'font-semibold text-ink-900 after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-brand-500'
      : 'font-medium text-ink-600 hover:text-ink-900'
  }`

export function Header() {
  const { me, logout } = useApp()

  return (
    <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* 로고 */}
        <Link to="/" className="flex items-center gap-2 group">
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500 text-white text-sm font-bold shadow-sm shadow-brand-500/30 transition-transform group-hover:scale-105"
          >
            24
          </span>
          <span className="text-[17px] font-bold tracking-tight text-ink-900">
            이음
            <span className="ml-1 text-brand-500">·</span>
          </span>
        </Link>

        {/* 데스크탑 네비 */}
        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/designs" className={navCls}>디자인</NavLink>
          <NavLink to="/contractors" className={navCls}>시공업자</NavLink>
          <NavLink to="/estimate" className={navCls}>견적 요청</NavLink>
          <NavLink to="/ai" className={navCls}>AI 검색</NavLink>
          {me && <NavLink to="/chats" className={navCls}>채팅</NavLink>}
          {me && <NavLink to="/mypage" className={navCls}>마이페이지</NavLink>}
          {me?.role === 'ADMIN' && <NavLink to="/admin" className={navCls}>관리자</NavLink>}
        </nav>

        {/* 우측 액션 */}
        <div className="flex items-center gap-3 text-sm">
          {me ? (
            <>
              <span className="hidden text-ink-700 sm:inline">
                <span className="font-semibold text-ink-900">{me.nickname}</span> 님
              </span>
              <button
                onClick={logout}
                className="rounded-lg px-3 py-1.5 text-ink-500 transition hover:bg-ink-100 hover:text-ink-900"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden rounded-lg px-3 py-1.5 font-medium text-ink-700 transition hover:bg-ink-100 hover:text-ink-900 sm:inline-block"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-brand-500 px-4 py-2 font-semibold text-white shadow-sm shadow-brand-500/30 transition hover:bg-brand-600"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
