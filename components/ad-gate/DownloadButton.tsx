'use client'

import { Download } from 'lucide-react'
import { type ReactNode } from 'react'
import clsx from 'clsx'
import ProtectedLink from './ProtectedLink'

type DownloadButtonProps = {
  url: string
  children: ReactNode
  className?: string
}

export default function DownloadButton({ url, children, className }: DownloadButtonProps) {
  return (
    <ProtectedLink
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      forceGate
      className={clsx(
        'inline-flex w-full items-center justify-center gap-2 rounded-xl bg-portal-text px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-portal-accent sm:w-auto sm:justify-start',
        className,
      )}
    >
      <Download className="h-4 w-4" />
      {children}
    </ProtectedLink>
  )
}
