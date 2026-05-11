import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import RichAds from '@/components/RichAds';
import './globals.css';
import SiteShell from '@/components/SiteShell';
import React, { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: ' | Stream Movies & TV Shows',
  description: 'Your ultimate destination for movies and TV shows. Stream thousands of titles directly through Telegram with no subscriptions required.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-20SD6VSG3S" />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-20SD6VSG3S');`,
        }}
      />
      <RichAds />
      <body className={`${inter.className} bg-portal-bg text-portal-text antialiased`}>
        <Suspense fallback={<div />}> 
          <SiteShell>{children}</SiteShell>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
