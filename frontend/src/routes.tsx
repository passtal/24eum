import { Navigate, Route, Routes, useSearchParams, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'

import HomePage from './pages/Home/HomePage'
import LoginPage from './pages/login/LoginPage'
import SignupPage from './pages/signup/SignupPage'
import DesignListPage from './pages/design/DesignListPage'
import DesignDetailPage from './pages/design/DesignDetailPage'
import EstimateFormPage from './pages/estimate/EstimateFormPage'
import EstimateResultPage from './pages/estimate/EstimateResultPage'
import ContractorListPage from './pages/contractor/ContractorListPage'
import ContractorDetailPage from './pages/contractor/ContractorDetailPage'
import ChatListPage from './pages/chat/ChatListPage'
import ChatRoomPage from './pages/chat/ChatRoomPage'
import AiSearchPage from './pages/ai/AiSearchPage'
import MyPage from './pages/mypage/MyPage'
import FavoritesPage from './pages/favorites/FavoritesPage'
import ReviewWritePage from './pages/review/ReviewWritePage'
import NotFoundPage from './pages/error/NotFoundPage'

import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminUserPage from './pages/admin/AdminUserPage'
import AdminContractorPage from './pages/admin/AdminContractorPage'
import AdminReviewPage from './pages/admin/AdminReviewPage'

import { useApp } from './contexts/AppContext'

function RequireAuth({ children }: { children: JSX.Element }) {
  const { me, loading } = useApp()
  const location = useLocation()
  if (loading) return null
  if (!me) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  return children
}

function OAuthCallback() {
  const [params] = useSearchParams()
  const { loginWithTokens } = useApp()
  useEffect(() => {
    const access = params.get('access')
    const refresh = params.get('refresh')
    if (access && refresh) loginWithTokens(access, refresh).then(() => {
      window.location.replace('/')
    })
  }, [params, loginWithTokens])
  return <div className="p-12 text-center text-sm text-slate-500">로그인 처리 중...</div>
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/oauth/callback" element={<OAuthCallback />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/designs" element={<DesignListPage />} />
        <Route path="/designs/:id" element={<DesignDetailPage />} />

        <Route path="/contractors" element={<ContractorListPage />} />
        <Route path="/contractors/:id" element={<ContractorDetailPage />} />

        <Route path="/estimate" element={<RequireAuth><EstimateFormPage /></RequireAuth>} />
        <Route path="/estimate/:id" element={<RequireAuth><EstimateResultPage /></RequireAuth>} />

        <Route path="/ai" element={<AiSearchPage />} />

        <Route path="/chats" element={<RequireAuth><ChatListPage /></RequireAuth>} />
        <Route path="/chats/:id" element={<RequireAuth><ChatRoomPage /></RequireAuth>} />

        <Route path="/mypage" element={<RequireAuth><MyPage /></RequireAuth>} />
        <Route path="/favorites" element={<RequireAuth><FavoritesPage /></RequireAuth>} />
        <Route path="/reviews/new" element={<RequireAuth><ReviewWritePage /></RequireAuth>} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUserPage />} />
        <Route path="contractors" element={<AdminContractorPage />} />
        <Route path="reviews" element={<AdminReviewPage />} />
      </Route>
    </Routes>
  )
}
