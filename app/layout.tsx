import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import SiteShell from '@/components/SiteShell';
import React, { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CineVault | Discover Movies & Series',
  description: 'The ultimate destination for discovering your next favorite movie or web series. High quality, fast, and easy to browse.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-text-primary antialiased`}>
        <Suspense fallback={<div />}> 
          <SiteShell>{children}</SiteShell>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
