import { NavLink, Outlet, Navigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'

const linkCls = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-3 py-2 text-sm ${
    isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
  }`

export function AdminLayout() {
  const { me, loading } = useApp()
  if (loading) return null
  if (!me || me.role !== 'ADMIN') return <Navigate to="/" replace />
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="w-56 border-r border-slate-200 bg-white p-4">
        <div className="mb-6 text-lg font-bold">24이음 관리자</div>
        <nav className="flex flex-col gap-1">
          <NavLink to="/admin" end className={linkCls}>대시보드</NavLink>
          <NavLink to="/admin/users" className={linkCls}>회원 관리</NavLink>
          <NavLink to="/admin/contractors" className={linkCls}>업자 관리</NavLink>
          <NavLink to="/admin/reviews" className={linkCls}>리뷰 관리</NavLink>
        </nav>
      </aside>
      <main className="flex-1 px-8 py-8"><Outlet /></main>
    </div>
  )
}

export default AdminLayout
