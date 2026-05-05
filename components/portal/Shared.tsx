import Link from 'next/link';
import Image from 'next/image';
import { Search, ChevronLeft, Users, Play } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-portal-border px-4 py-4 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
             <div className="relative w-10 h-10">
                <Image 
                  src="/watchit_logo.png" 
                  alt="Logo" 
                  fill 
                  className="object-contain"
                />
             </div>
             
          </Link>

          <div className="w-12 h-6 bg-amber-100 rounded-full flex items-center px-1 border border-amber-200">
             <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
          </div>
        </div>

        <div className="flex gap-2">
          <form action="/search" method="GET" className="flex-1 relative">
            <input 
              name="q"
              type="text" 
              placeholder="Search for movies, tv shows" 
              className="w-full bg-portal-bg border border-portal-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-portal-accent/50 transition-all"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-portal-muted" />
          </form>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <Link href="/search?type=all" className="bg-portal-accent text-white px-5 py-2 rounded-full text-xs font-bold shadow-sm">
             <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                All
             </div>
          </Link>
          {['Movie', 'TV Show', 'Anime', 'Asian Drama'].map(type => (
            <Link key={type} href={`/search?type=${type.toLowerCase()}`} className="bg-white border border-portal-border text-portal-muted px-5 py-2 rounded-full text-xs font-bold hover:border-portal-accent transition-all">
              {type}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'T4TSA';
  
  return (
    <footer className="bg-white border-t border-portal-border py-16 px-4 mt-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
            <Link href="/" className="flex items-center gap-2">
               <div className="relative w-8 h-8">
                  <Image 
                    src="/watchit_logo.png" 
                    alt="Logo" 
                    fill 
                    className="object-contain"
                  />
               </div>
               <span className="text-lg font-black tracking-tighter">
                  {siteName.toUpperCase()}<span className="text-portal-accent">.CC</span>
               </span>
            </Link>
            <p className="text-sm text-portal-muted max-w-xs font-medium">
              Your ultimate destination for movies and TV shows. Stream thousands of titles directly with no subscriptions.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-xs font-bold uppercase tracking-wider">
            <Link href="/search" className="text-portal-text hover:text-portal-accent transition-colors">Browse</Link>
            <Link href="#" className="text-portal-text hover:text-portal-accent transition-colors">Movies</Link>
            <Link href="#" className="text-portal-text hover:text-portal-accent transition-colors">Series</Link>
            <Link href="#" className="text-portal-text hover:text-portal-accent transition-colors">DMCA</Link>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-portal-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-portal-muted uppercase tracking-widest">
          <div>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-portal-accent transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-portal-accent transition-colors">Terms</Link>
            <Link href="#" className="hover:text-portal-accent transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
