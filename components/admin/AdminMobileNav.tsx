'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Upload, ExternalLink, LogOut, Menu, X } from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', label: 'All Movies', icon: LayoutDashboard },
  { href: '/admin/upload', label: 'Add New', icon: Upload },
  { href: '/', label: 'View Site', icon: ExternalLink },
]

export default function AdminMobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    setOpen(false)
    router.push('/admin')
  }

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-[#0a0a0a]/95 backdrop-blur md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-black shadow-[0_0_20px_rgba(229,9,20,0.25)]">
              W
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-text-primary">WatchIt Admin</p>
              <p className="text-[11px] text-text-secondary">Dashboard</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="admin-icon-btn h-10 w-10 p-0"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {open ? (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed left-0 right-0 top-[57px] z-50 mx-3 rounded-2xl border border-border bg-[#111] shadow-[0_24px_80px_rgba(0,0,0,0.4)] md:hidden">
            <nav className="flex flex-col gap-1 p-3">
              {navItems.map((item) => {
                const isActive =
                  item.href === '/'
                    ? false
                    : pathname === item.href || pathname.startsWith(item.href + '/')

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.href === '/' ? '_blank' : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${
                      isActive
                        ? 'bg-primary/10 font-medium text-primary'
                        : 'text-text-secondary hover:bg-[#1a1a1a] hover:text-text-primary'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                )
              })}

              <button
                type="button"
                onClick={handleLogout}
                className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-text-secondary transition-colors hover:bg-[#1a1a1a] hover:text-red-400"
              >
                <LogOut size={18} />
                Logout
              </button>
            </nav>
          </div>
        </>
      ) : null}
    </>
  )
}