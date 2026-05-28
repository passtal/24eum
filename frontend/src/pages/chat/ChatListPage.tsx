import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import Loading from '../../components/common/Loading'

type Room = {
  id: number
  contractorName?: string
  userNickname?: string
  lastMessage?: string
  lastMessageAt?: string
}

function ChatListPage() {
  const [rooms, setRooms] = useState<Room[] | null>(null)
  useEffect(() => {
    api
      .get<Room[]>('/chat/rooms')
      .then(({ data }) => setRooms(data))
      .catch(() => setRooms([]))
  }, [])

  if (!rooms) return <Loading />

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-8">
        <div className="text-sm font-semibold text-brand-600">Chats</div>
        <h1 className="mt-2 text-[28px] font-bold tracking-tight text-ink-900 md:text-[34px]">
          내 채팅
        </h1>
      </div>

      {rooms.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-300 bg-white p-10 text-center text-sm text-ink-500">
          아직 채팅방이 없습니다.
          <div className="mt-4">
            <Link
              to="/contractors"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-brand-500 px-5 text-sm font-semibold text-white shadow-sm shadow-brand-500/30 transition hover:bg-brand-600"
            >
              시공업자 둘러보기
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200">
          {rooms.map((r, i) => {
            const name = r.contractorName ?? '시공업자'
            return (
              <Link
                key={r.id}
                to={`/chats/${r.id}`}
                className={`group flex items-center gap-3 px-5 py-4 transition hover:bg-ink-50 ${
                  i !== 0 ? 'border-t border-ink-100' : ''
                }`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-600">
                  {name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-[15px] font-semibold text-ink-900 transition group-hover:text-brand-600">
                      {name}
                    </div>
                    {r.lastMessageAt && (
                      <div className="shrink-0 text-xs text-ink-400">
                        {formatTime(r.lastMessageAt)}
                      </div>
                    )}
                  </div>
                  <div className="mt-0.5 line-clamp-1 text-sm text-ink-500">
                    {r.lastMessage ?? '대화를 시작해보세요.'}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  if (sameDay) return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })
}

export default ChatListPage
