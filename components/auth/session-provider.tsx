'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AuthSession } from '@/lib/auth-client'
import { fetchAuthSession } from '@/lib/auth-client'

type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated'

type SessionContextValue = {
  data: AuthSession | null
  status: SessionStatus
  update: () => Promise<AuthSession | null>
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AuthSession | null>(null)
  const [status, setStatus] = useState<SessionStatus>('loading')

  const load = useCallback(async () => {
    try {
      const session = await fetchAuthSession()
      setData(session)
      setStatus(session ? 'authenticated' : 'unauthenticated')
      return session
    } catch {
      setData(null)
      setStatus('unauthenticated')
      return null
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    const onFocus = () => {
      void load()
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [load])

  const value = useMemo<SessionContextValue>(
    () => ({
      data,
      status,
      update: load,
    }),
    [data, status, load],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

/** Drop-in subset of `next-auth/react` `useSession` for this app. */
export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext)
  if (!ctx) {
    throw new Error('useSession must be used within SessionProvider')
  }
  return ctx
}
