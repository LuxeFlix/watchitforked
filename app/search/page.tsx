'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FilterBar from '@/components/FilterBar';
import MovieGrid from '@/components/MovieGrid';
import { Movie } from '@/types';

const PER_PAGE = 30;

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('All Content');
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const totalPages = Math.ceil(total / PER_PAGE);

  const fetchMovies = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const q = searchParams.get('q');
    const genre = searchParams.get('genre');
    const type = searchParams.get('type');
    const language = searchParams.get('language');
    const quality = searchParams.get('quality');
    const sort = searchParams.get('sort') || 'newest';
    const page = searchParams.get('page') || '1';

    let url: string;
    let newTitle = 'All Content';
    let isSearch = false;

    if (q) {
      url = `/api/search?q=${encodeURIComponent(q)}`;
      newTitle = `Search Results for "${q}"`;
      isSearch = true;
    } else {
      const params = new URLSearchParams();
      if (genre && genre !== 'All') params.set('genre', genre);
      if (type && type !== 'All') params.set('type', type);
      if (language && language !== 'All') params.set('language', language);
      if (quality && quality !== 'All') params.set('quality', quality);
      params.set('sort', sort);
      params.set('page', page);
      url = `/api/movies?${params.toString()}`;

      const filters: string[] = [];
      if (genre && genre !== 'All') filters.push(genre);
      if (type && type !== 'All') filters.push(type + 's');
      if (language && language !== 'All') filters.push(language);
      if (filters.length > 0) newTitle = `Showing ${filters.join(' ')}`;
    }

    setLoading(true);
    setTitle(newTitle);

    fetch(url, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (!controller.signal.aborted) {
          if (isSearch) {
            setMovies(data);
            setTotal(data.length);
          } else {
            setMovies(data.movies);
            setTotal(data.total);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setMovies([]);
          setTotal(0);
          setLoading(false);
        }
      });
  }, [searchParams]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchMovies, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [fetchMovies]);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <FilterBar />

      <div className="max-w-7xl mx-auto px-6 pt-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
          <p className="text-sm text-text-secondary">
            {loading ? 'Loading...' : `${total} ${total === 1 ? 'result' : 'results'} found`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-xl bg-card border border-border animate-pulse" />
            ))}
          </div>
        ) : (
          <MovieGrid movies={movies} />
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-card border border-border text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-elevated transition-colors"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
              .map((p, i, arr) => (
                <span key={p} className="flex items-center">
                  {i > 0 && arr[i - 1] !== p - 1 && (
                    <span className="px-1 text-text-secondary">...</span>
                  )}
                  <button
                    onClick={() => goToPage(p)}
                    className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                      p === currentPage
                        ? 'bg-primary text-white'
                        : 'bg-card border border-border text-text-secondary hover:bg-elevated hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                </span>
              ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-card border border-border text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-elevated transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
