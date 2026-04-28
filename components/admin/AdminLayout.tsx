import AdminSidebar from './AdminSidebar'
import AdminMobileNav from './AdminMobileNav'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <AdminMobileNav />
      <AdminSidebar />
      <main className="ml-0 flex-1 overflow-y-auto px-4 pb-6 pt-[72px] md:ml-[220px] md:px-6 md:py-6 md:pt-6">
        {children}
      </main>
    </div>
  )
}
