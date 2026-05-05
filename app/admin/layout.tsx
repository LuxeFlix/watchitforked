import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin | WatchIt',
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="admin-page">{children}</div>
}
