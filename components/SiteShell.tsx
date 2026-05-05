'use client'

import { usePathname } from 'next/navigation'
import { Header, Footer } from '@/components/portal/Shared'

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-portal-bg selection:bg-portal-accent/20">
      <Header />
      <main className="min-h-[70vh]">{children}</main>
      <Footer />
    </div>
  )
}
