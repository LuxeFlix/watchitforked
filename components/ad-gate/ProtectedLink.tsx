'use client'

import { type AnchorHTMLAttributes, type MouseEvent, type ReactNode, useCallback } from 'react'
import { resolveAdGateHref, useAdGate } from './AdGateProvider'

type ProtectedLinkProps = {
  href: string
  children: ReactNode
  forceGate?: boolean
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children' | 'onClick'>

export default function ProtectedLink({ href, children, className, target, rel, forceGate = false, ...rest }: ProtectedLinkProps) {
  const { gateDestination, smartLinkUrl, isUnlocked, clearPendingDestination } = useAdGate()
  const shouldGate = forceGate

  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (!smartLinkUrl || !shouldGate || isUnlocked) {
        return
      }

      event.preventDefault()
      gateDestination(resolveAdGateHref(href))
    },
    [gateDestination, href, isUnlocked, shouldGate, smartLinkUrl],
  )

  if (!shouldGate || isUnlocked) {
    return (
      <a
        href={href}
        className={className}
        target={target}
        rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
        onClick={isUnlocked ? () => clearPendingDestination() : undefined}
        {...rest}
      >
        {children}
      </a>
    )
  }

  return (
    <a
      href={href}
      className={className}
      target={target}
      rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
      data-ad-gate-managed="true"
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  )
}
