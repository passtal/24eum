import { FormEvent, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Client, IMessage } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import api from '../../api/axios'
import { useApp } from '../../contexts/AppContext'

type ChatMessage = {
  id?: number
  chatRoomId: number
  senderId: number
  messageType?: string
  content?: string
  createdAt?: string
}

function ChatRoomPage() {
  const { id } = useParams<{ id: string }>()
  const { me } = useApp()
  const roomId = Number(id)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState('')
  const [connected, setConnected] = useState(false)
  const clientRef = useRef<Client | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!roomId) return
    api.get<ChatMessage[]>(`/chat/rooms/${roomId}/messages`).then(({ data }) => setMessages(data))
    api.post(`/chat/rooms/${roomId}/read`).catch(() => {})

    const client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      reconnectDelay: 3000,
      onConnect: () => {
        setConnected(true)
        client.subscribe(`/topic/chat.${roomId}`, (frame: IMessage) => {
          const msg = JSON.parse(frame.body) as ChatMessage
          setMessages((prev) => [...prev, msg])
        })
      },
      onDisconnect: () => setConnected(false),
      onWebSocketClose: () => setConnected(false),
    })
    client.activate()
    clientRef.current = client
    return () => {
      client.deactivate()
    }
  }, [roomId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim() || !me) return
    clientRef.current?.publish({
      destination: `/app/chat.${roomId}`,
      body: JSON.stringify({
        chatRoomId: roomId,
        senderId: me.id,
        messageType: 'TEXT',
        content: text,
      }),
    })
    setText('')
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-6">
      <div className="mb-4 flex items-center justify-between">
        <Link to="/chats" className="text-sm text-ink-500 hover:text-brand-600">
          ← 채팅 목록
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-ink-500">
          <span
            className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-ink-300'}`}
          />
          {connected ? '실시간 연결됨' : '연결 중...'}
        </div>
      </div>

      <div className="flex h-[70vh] flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200">
        <div className="border-b border-ink-100 px-5 py-4">
          <div className="text-[15px] font-semibold text-ink-900">채팅방 #{roomId}</div>
          <div className="mt-0.5 text-xs text-ink-500">
            상대방과 견적, 일정, 시공 세부사항을 자유롭게 조율하세요.
          </div>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto bg-ink-50/40 px-5 py-4">
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center text-sm text-ink-400">
              아직 메시지가 없습니다. 첫 메시지를 남겨보세요.
            </div>
          )}
          {messages.map((m, i) => {
            const mine = m.senderId === me?.id
            return (
              <div key={m.id ?? i} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-[14px] leading-relaxed shadow-sm ${
                    mine
                      ? 'bg-brand-500 text-white shadow-brand-500/20'
                      : 'bg-white text-ink-900 ring-1 ring-ink-200'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={send} className="flex gap-2 border-t border-ink-100 bg-white p-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="메시지 입력"
            className="h-11 flex-1 rounded-xl bg-ink-50 px-4 text-[14px] text-ink-900 ring-1 ring-transparent transition placeholder:text-ink-400 focus:bg-white focus:outline-none focus:ring-brand-500"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-500 px-5 text-sm font-semibold text-white shadow-sm shadow-brand-500/30 transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-ink-300 disabled:shadow-none"
          >
            전송
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatRoomPage
