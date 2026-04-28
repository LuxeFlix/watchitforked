'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(currentQ);

  if (query !== currentQ && currentQ !== '') {
    setQuery(currentQ);
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold tracking-tighter text-accent">
                CINE<span className="text-white">VAULT</span>
              </span>
            </Link>
          </div>

          <div className="flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search movies & series..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-card border border-border rounded-full py-1.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent transition-colors"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            </form>
          </div>

          <div className="hidden sm:flex items-center space-x-6 text-sm font-medium text-text-secondary">
            <Link href="/search?type=movie" className="hover:text-white transition-colors">Movies</Link>
            <Link href="/search?type=series" className="hover:text-white transition-colors">Web Series</Link>
            <Link href="/search?sort=trending" className="hover:text-white transition-colors">Trending</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
