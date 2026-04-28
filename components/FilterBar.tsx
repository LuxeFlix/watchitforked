'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from './Badge';

const GENRES = ['Action', 'Comedy', 'Drama', 'Thriller', 'Horror', 'Romance', 'Sci-Fi', 'Animation'];
const LANGUAGES = ['Hindi', 'English', 'Tamil', 'Telugu', 'Bengali', 'Other'];
const QUALITIES = ['2K', '1080p', '720p', '520p', '480p', 'CAM'];
const SORTS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Trending', value: 'trending' },
  { label: 'Most Watched', value: 'most_watched' },
];

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === 'All') {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilter = (name: string, value: string) => {
    router.push(`/search?${createQueryString(name, value)}`, { scroll: false });
  };

  const clearFilters = () => {
    router.push('/search');
  };

  const activeType = searchParams.get('type') || 'All';
  const activeGenre = searchParams.get('genre') || 'All';
  const activeLanguage = searchParams.get('language') || 'All';
  const activeQuality = searchParams.get('quality') || 'All';
  const activeSort = searchParams.get('sort') || 'newest';

  return (
    <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-md border-b border-border py-4 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-6 min-w-max">
        {/* Type Toggles */}
        <div className="flex bg-card rounded-full p-1 border border-border">
          {['All', 'Movie', 'Series'].map((type) => (
            <button
              key={type}
              onClick={() => handleFilter('type', type)}
              className={cn(
                'px-4 py-1 text-xs font-medium rounded-full transition-all',
                (activeType === type || (type === 'Movie' && activeType === 'movie') || (type === 'Series' && activeType === 'series'))
                  ? 'bg-white text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Genre Select */}
        <select
          value={activeGenre}
          onChange={(e) => handleFilter('genre', e.target.value)}
          className="bg-card border border-border rounded-full px-4 py-1.5 text-xs text-text-secondary focus:outline-none focus:border-white appearance-none cursor-pointer hover:border-gray-500 transition-colors"
        >
          <option value="All">All Genres</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        {/* Language Select */}
        <select
          value={activeLanguage}
          onChange={(e) => handleFilter('language', e.target.value)}
          className="bg-card border border-border rounded-full px-4 py-1.5 text-xs text-text-secondary focus:outline-none focus:border-white appearance-none cursor-pointer hover:border-gray-500 transition-colors"
        >
          <option value="All">All Languages</option>
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        {/* Quality Select */}
        <select
          value={activeQuality}
          onChange={(e) => handleFilter('quality', e.target.value)}
          className="bg-card border border-border rounded-full px-4 py-1.5 text-xs text-text-secondary focus:outline-none focus:border-white appearance-none cursor-pointer hover:border-gray-500 transition-colors"
        >
          <option value="All">All Qualities</option>
          {QUALITIES.map((q) => (
            <option key={q} value={q}>{q}</option>
          ))}
        </select>

        {/* Sort Select */}
        <select
          value={activeSort}
          onChange={(e) => handleFilter('sort', e.target.value)}
          className="bg-card border border-border rounded-full px-4 py-1.5 text-xs text-text-secondary focus:outline-none focus:border-white appearance-none cursor-pointer hover:border-gray-500 transition-colors"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {/* Clear Filters */}
        {searchParams.toString() && (
          <button
            onClick={clearFilters}
            className="flex items-center text-xs text-text-secondary hover:text-primary transition-colors whitespace-nowrap"
          >
            <X className="w-3 h-3 mr-1" />
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
