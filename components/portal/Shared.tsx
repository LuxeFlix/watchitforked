import Link from 'next/link';
import Image from 'next/image';
import { Search, ChevronLeft, Users, Play } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-portal-border px-4 py-2 sm:py-3 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
        <div className="flex items-center justify-between w-full sm:w-auto shrink-0">
          <Link href="/" className="flex items-center gap-2">
             <div className="relative w-8 h-8 sm:w-9 sm:h-9">
                <Image 
                  src="/watchit_logo.png" 
                  alt="Logo" 
                  fill 
                  sizes="36px"
                  className="object-contain"
                />
             </div>
          </Link>

          <div className="w-10 h-5 sm:hidden bg-amber-100 rounded-full flex items-center px-1 border border-amber-200">
             <div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm" />
          </div>
        </div>

        <div className="w-full sm:flex-1 max-w-2xl flex items-center gap-2 sm:gap-4">
          <form action="/search" method="GET" className="flex-1 relative">
            <input 
              name="q"
              type="text" 
              placeholder="Search for movies, tv shows..." 
              className="w-full bg-portal-bg border border-portal-border rounded-full py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-portal-accent/50 transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-portal-muted" />
          </form>

          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            {['Movie', 'Series', 'Anime'].map(type => (
              <Link key={type} href={`/search?type=${type.toLowerCase()}`} className="text-portal-muted px-2 py-1.5 text-xs font-bold hover:text-portal-accent transition-all">
                {type}
              </Link>
            ))}
            <div className="w-10 h-5 bg-amber-100 rounded-full flex items-center px-1 border border-amber-200 ml-2">
               <div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm" />
            </div>
          </div>
        </div>

        {/* Mobile Categories Scroll */}
        <div className="flex sm:hidden items-center gap-2 overflow-x-auto no-scrollbar w-full pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <Link href="/search?type=all" className="bg-portal-accent text-white px-4 py-1.5 rounded-full text-[10px] font-bold shadow-sm whitespace-nowrap">
             All
          </Link>
          {['Movie', 'Series', 'Anime', 'Asian Drama'].map(type => (
            <Link key={type} href={`/search?type=${type.toLowerCase()}`} className="bg-white border border-portal-border text-portal-muted px-4 py-1.5 rounded-full text-[10px] font-bold hover:border-portal-accent transition-all whitespace-nowrap">
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
                    sizes="32px"
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
