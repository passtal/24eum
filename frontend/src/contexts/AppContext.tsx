// 전역 상태 관리 Context
import { ReactNode } from 'react'

export function AppProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export default AppProvider
