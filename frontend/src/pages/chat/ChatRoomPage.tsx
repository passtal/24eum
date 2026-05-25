import { FormEvent, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Client, IMessage } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import api from '../../api/axios'
import Button from '../../components/ui/Button'
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
        client.subscribe(`/topic/chat.${roomId}`, (frame: IMessage) => {
          const msg = JSON.parse(frame.body) as ChatMessage
          setMessages((prev) => [...prev, msg])
        })
      },
    })
    client.activate()
    clientRef.current = client
    return () => { client.deactivate() }
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
    <div className="mx-auto flex h-[70vh] max-w-2xl flex-col rounded-xl border border-slate-200 bg-white">
      <div className="border-b px-4 py-3 font-semibold">채팅방 #{roomId}</div>
      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
        {messages.map((m, i) => {
          const mine = m.senderId === me?.id
          return (
            <div key={m.id ?? i} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${
                mine ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'
              }`}>
                {m.content}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="flex gap-2 border-t p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="메시지 입력"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400"
        />
        <Button type="submit">전송</Button>
      </form>
    </div>
  )
}

export default ChatRoomPage
