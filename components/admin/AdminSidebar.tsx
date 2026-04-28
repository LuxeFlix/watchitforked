'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Upload, ExternalLink, LogOut } from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', label: 'All Movies', icon: LayoutDashboard },
  { href: '/admin/upload', label: 'Add New', icon: Upload },
  { href: '/', label: 'View Site', icon: ExternalLink },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  return (
    <aside className="hidden md:flex fixed left-0 top-0 z-40 flex h-screen w-[220px] flex-col border-r border-border bg-[#0a0a0a]">
      <div className="flex items-center gap-2 border-b border-border px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-black">
          W
        </div>
        <span className="text-sm font-semibold tracking-tight">WatchIt Admin</span>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
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
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-200 ${
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
      </nav>

      <div className="px-3 pb-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-colors duration-200 hover:bg-[#1a1a1a] hover:text-red-400"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  )
}
