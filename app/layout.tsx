import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';
import type { ReactNode } from 'react';
import './globals.css';
import SiteShell from '@/components/SiteShell';
import { AdGateProvider } from '@/components/ad-gate/AdGateProvider';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });
const adGateUrl =
  process.env.NEXT_PUBLIC_ADSTERRA_SMARTLINK ||
  process.env.VITE_ADSTERRA_SMARTLINK ||
  process.env.ADSTERRA_SMARTLINK ||
  '';

export const metadata: Metadata = {
  title: 'Stream Movies & TV Shows',
  description: 'Your ultimate destination for movies and TV shows. Stream thousands of titles directly through Telegram with no subscriptions required.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-portal-bg text-portal-text antialiased`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-20SD6VSG3S"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-20SD6VSG3S');`}
        </Script>
        <AdGateProvider smartLinkUrl={adGateUrl}>
          <Suspense fallback={<div />}>
            <SiteShell>{children}</SiteShell>
          </Suspense>
        </AdGateProvider>
        <Analytics />
      </body>
    </html>
  );
}