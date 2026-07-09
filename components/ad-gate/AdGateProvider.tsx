'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import AdGateModal from './AdGateModal'

const STORAGE_KEY = 'adgate.pendingDestination'
const STARTED_AT_KEY = 'adgate.startedAt'
const AD_LAUNCHED_KEY = 'adgate.adLaunched'
const COUNTDOWN_SECONDS = 5

type AdGateContextValue = {
  smartLinkUrl: string
  pendingDestination: string | null
  countdown: number
  adLaunched: boolean
  isUnlocked: boolean
  isPending: boolean
  gateDestination: (destination: string) => boolean
  continueToDestination: () => void
  clearPendingDestination: () => void
}

const noopContext: AdGateContextValue = {
  smartLinkUrl: '',
  pendingDestination: null,
  countdown: COUNTDOWN_SECONDS,
  adLaunched: false,
  isUnlocked: false,
  isPending: false,
  gateDestination: () => false,
  continueToDestination: () => {},
  clearPendingDestination: () => {},
}

const AdGateContext = createContext<AdGateContextValue>(noopContext)

function readPendingDestination() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function readStartedAt() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const value = window.sessionStorage.getItem(STARTED_AT_KEY)
    if (!value) {
      return null
    }

    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  } catch {
    return null
  }
}

function readAdLaunched() {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    return window.sessionStorage.getItem(AD_LAUNCHED_KEY) === '1'
  } catch {
    return false
  }
}

function writeGateState(destination: string) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, destination)
    window.sessionStorage.setItem(STARTED_AT_KEY, String(Date.now()))
    window.sessionStorage.setItem(AD_LAUNCHED_KEY, '0')
  } catch {
    // Session storage may be unavailable in restrictive browsing modes.
  }
}

function clearPendingDestinationStorage() {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY)
    window.sessionStorage.removeItem(STARTED_AT_KEY)
    window.sessionStorage.removeItem(AD_LAUNCHED_KEY)
  } catch {
    // Session storage may be unavailable in restrictive browsing modes.
  }
}

function markAdLaunched() {
  try {
    window.sessionStorage.setItem(AD_LAUNCHED_KEY, '1')
  } catch {
    // Session storage may be unavailable in restrictive browsing modes.
  }
}

function isGateableExternalHref(href: string) {
  if (!href || typeof window === 'undefined') {
    return false
  }

  if (/^(mailto:|tel:|sms:|javascript:|#)/i.test(href)) {
    return false
  }

  try {
    const resolvedUrl = new URL(href, window.location.href)
    return (
      (resolvedUrl.protocol === 'http:' || resolvedUrl.protocol === 'https:') &&
      resolvedUrl.origin !== window.location.origin
    )
  } catch {
    return false
  }
}

export function isAdGateExternalHref(href: string) {
  return isGateableExternalHref(href)
}

export function resolveAdGateHref(href: string) {
  if (typeof window === 'undefined') {
    return href
  }

  try {
    return new URL(href, window.location.href).toString()
  } catch {
    return href
  }
}

export function AdGateProvider({
  smartLinkUrl,
  children,
}: {
  smartLinkUrl: string
  children: ReactNode
}) {
  const [pendingDestination, setPendingDestination] = useState<string | null>(() => readPendingDestination())
  const [startedAt, setStartedAt] = useState<number | null>(() => readStartedAt())
  const [adLaunched, setAdLaunched] = useState<boolean>(() => readAdLaunched())
  const [now, setNow] = useState(() => Date.now())
  const smartLinkUrlRef = useRef(smartLinkUrl)

  useEffect(() => {
    smartLinkUrlRef.current = smartLinkUrl
  }, [smartLinkUrl])

  useEffect(() => {
    if (!pendingDestination || !startedAt) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [pendingDestination, startedAt])

  const countdown = useMemo(() => {
    if (!startedAt) {
      return COUNTDOWN_SECONDS
    }

    const elapsedSeconds = Math.floor((now - startedAt) / 1000)
    return Math.max(COUNTDOWN_SECONDS - elapsedSeconds, 0)
  }, [now, startedAt])

  const isUnlocked = Boolean(pendingDestination && adLaunched && countdown === 0)

  const clearPendingDestination = useCallback(() => {
    clearPendingDestinationStorage()
    setPendingDestination(null)
    setStartedAt(null)
    setAdLaunched(false)
    setNow(Date.now())
  }, [])

  const continueToDestination = useCallback(() => {
    if (!pendingDestination || countdown > 0) {
      return
    }

    if (!adLaunched) {
      markAdLaunched()
      setAdLaunched(true)

      const adWindow = window.open(smartLinkUrlRef.current, '_blank', 'noopener,noreferrer')
      if (!adWindow) {
        window.location.assign(smartLinkUrlRef.current)
      }

      return
    }

    clearPendingDestination()
    window.location.assign(pendingDestination)
  }, [adLaunched, clearPendingDestination, countdown, pendingDestination])

  const gateDestination = useCallback(
    (destination: string) => {
      if (!destination || !smartLinkUrlRef.current || pendingDestination) {
        return false
      }

      writeGateState(destination)
      setPendingDestination(destination)
      setStartedAt(Date.now())
      setAdLaunched(false)
      setNow(Date.now())
      return true
    },
    [pendingDestination],
  )


  const value = useMemo(
    () => ({
      smartLinkUrl,
      pendingDestination,
      countdown,
      adLaunched,
      isUnlocked,
      isPending: Boolean(pendingDestination),
      gateDestination,
      continueToDestination,
      clearPendingDestination,
    }),
    [adLaunched, clearPendingDestination, continueToDestination, countdown, gateDestination, isUnlocked, pendingDestination, smartLinkUrl],
  )

  return (
    <AdGateContext.Provider value={value}>
      {children}
      <AdGateModal />
    </AdGateContext.Provider>
  )
}

export function useAdGate() {
  return useContext(AdGateContext)
}





