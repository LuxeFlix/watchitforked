'use client'

import { useMemo, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { ArrowRight, TimerReset } from 'lucide-react'
import { useAdGate } from './AdGateProvider'

const subscribe = () => () => {}

export default function AdGateModal() {
  const { isPending, pendingDestination, countdown, continueToDestination, smartLinkUrl } = useAdGate()
  const isMounted = useSyncExternalStore(subscribe, () => true, () => false)

  const canContinue = countdown === 0
  const hostname = useMemo(() => {
    if (!pendingDestination) {
      return ''
    }

    try {
      return new URL(pendingDestination).hostname.replace(/^www\./, '')
    } catch {
      return pendingDestination
    }
  }, [pendingDestination])

  if (!isMounted || !isPending || !smartLinkUrl) {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" />

      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 text-white shadow-[0_30px_90px_rgba(15,23,42,0.5)] animate-slide-up">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400" />

        <div className="space-y-6 p-6 sm:p-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">
              <TimerReset className="h-3.5 w-3.5" />
              Sponsored redirect
            </div>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Continue to your destination</h2>
            <p className="text-sm leading-relaxed text-slate-300">
              Click Continue to open the SmartLink in a new tab. When you come back, the popup will stay open and you can continue to {hostname || 'your requested link'} once the timer reaches zero.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Pending destination</p>
              <p className="mt-1 truncate text-sm font-semibold text-white/90">
              {pendingDestination
                ? pendingDestination.slice(0, 5) +
                  "*".repeat(Math.max(0, pendingDestination.length - 5))
                : ""}
            </p>
            </div>
            <div className="inline-flex items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
              {countdown > 0 ? `${countdown}s` : 'Ready'}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={continueToDestination}
              disabled={!canContinue}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-black uppercase tracking-[0.18em] text-slate-950 transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/50"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
