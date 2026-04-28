import Link from 'next/link';

export default function Footer() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'CineVault';
  
  return (
    <footer className="bg-background border-t border-border py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <Link href="/" className="text-xl font-bold tracking-tighter text-primary">
              {siteName.toUpperCase()}
            </Link>
            <p className="text-sm text-text-secondary">
              Discover and watch your favorite movies and series.
            </p>
          </div>
          
          <div className="flex space-x-8 text-sm text-text-secondary font-medium">
            <Link href="/search" className="hover:text-white transition-colors">Browse All</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">DMCA</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border text-center text-xs text-text-secondary/60">
          &copy; {new Date().getFullYear()} {siteName}. All rights reserved. Built for entertainment.
        </div>
      </div>
    </footer>
  );
}
