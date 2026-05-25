import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <div className="text-6xl font-extrabold text-slate-900">404</div>
      <p className="mt-3 text-slate-600">요청하신 페이지를 찾을 수 없습니다.</p>
      <Link to="/" className="mt-6 inline-block rounded-lg bg-slate-900 px-5 py-2 text-sm text-white hover:bg-slate-800">
        메인으로
      </Link>
    </div>
  )
}

export default NotFoundPage
