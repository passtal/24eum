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
    api.get<Room[]>('/chat/rooms').then(({ data }) => setRooms(data)).catch(() => setRooms([]))
  }, [])

  if (!rooms) return <Loading />
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">내 채팅</h1>
      <div className="divide-y rounded-xl border border-slate-200 bg-white">
        {rooms.map((r) => (
          <Link key={r.id} to={`/chats/${r.id}`} className="block px-4 py-3 hover:bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="font-medium">{r.contractorName ?? '시공업자'}</div>
              {r.lastMessageAt && (
                <div className="text-xs text-slate-400">{new Date(r.lastMessageAt).toLocaleString()}</div>
              )}
            </div>
            <div className="mt-1 line-clamp-1 text-sm text-slate-500">{r.lastMessage ?? '대화를 시작해보세요.'}</div>
          </Link>
        ))}
        {rooms.length === 0 && (
          <div className="p-8 text-center text-sm text-slate-500">아직 채팅방이 없습니다.</div>
        )}
      </div>
    </div>
  )
}

export default ChatListPage
