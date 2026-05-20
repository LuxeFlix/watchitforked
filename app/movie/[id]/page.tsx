import Link from 'next/link';
import { getMovieDetails } from '@/lib/api';
import { ChevronLeft, Star, Calendar, Monitor, Users, Info } from 'lucide-react';
import { notFound } from 'next/navigation';
import Badge from '@/components/Badge';
import DownloadSection from '@/components/portal/DownloadSection';
import ViewTracker from '@/components/ViewTracker';
import LoadingImage from '@/components/portal/LoadingImage';

/**
 * Movie Detail Page - Overhauled to match the provided reference UI.
 * Pure Server Component (RSC).
 */
export default async function MoviePage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ quality?: string }>
}) {
  const { id } = await params;
  const { quality: selectedQuality } = await searchParams;
  const movie = await getMovieDetails(id);

  if (!movie) notFound();

  // Get dynamic counts for each quality
  const qualityCounts = movie.downloads.reduce((acc, dl) => {
    acc[dl.quality] = (acc[dl.quality] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const qualities = ['unsorted', '480p', '720p', '1080p', '4K'].filter(q => q === 'unsorted' || (qualityCounts[q] && qualityCounts[q] > 0));
  const activeQuality = selectedQuality || 'unsorted';

  return (
    <div className="min-h-screen bg-portal-bg text-portal-text font-sans">
      {/* 1. Header Area */}
      

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-10">
        {/* 2. Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-portal-muted hover:text-portal-text transition-colors">
           <ChevronLeft className="w-4 h-4" />
           Back
        </Link>

        {/* 3. Banner & Overlay */}
        <div className="space-y-8">
           <div className="relative rounded-2xl overflow-hidden shadow-lg border border-portal-border bg-white group">
              <div className="relative aspect-[7/9] sm:aspect-[21/9] w-full">
                 <LoadingImage 
                    src={movie.bannerImage} 
                    alt={movie.title}
                    fill
                    eager
                    sizes="(max-width: 1024px) 100vw, 896px"
                    wrapperClassName="absolute inset-0"
                    className="object-cover"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              {/* Overlap Thumbnail */}
              <div className="absolute bottom-4 left-4 w-full px-4 flex items-end">
                <div className="relative w-32 sm:w-64 aspect-[2/1] rounded-xl overflow-hidden shadow-2xl border-2 border-white transform translate-y-8">
                            <LoadingImage 
                     src={movie.thumbnail} 
                     alt={movie.title}
                     fill
                        eager
                     sizes="(max-width: 640px) 128px, 256px"
                               wrapperClassName="absolute inset-0"
                     className="object-cover"
                   />
                </div>
              </div>
           </div>

           {/* 4. Movie Info */}
           <div className="pt-8 space-y-6">
              <div className="space-y-2">
                 <h1 className="text-3xl font-black tracking-tight">{movie.title}</h1>
                 <div className="flex items-center gap-4 text-xs font-bold text-portal-muted bg-white/50 w-fit px-4 py-2 rounded-lg border border-portal-border/50">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {movie.year}</span>
                    <span className="flex items-center gap-1.5 capitalize"><Monitor className="w-3.5 h-3.5" /> {movie.type}</span>
                    <span className="flex items-center gap-1.5 text-yellow-500"><Star className="w-3.5 h-3.5 fill-yellow-500" /> {movie.rating}</span>
                    <span className="flex items-center gap-1.5 text-portal-muted"><Users className="w-3.5 h-3.5" /> {movie.views?.toLocaleString()} views</span>
                 </div>
              </div>

              {/* 5. Description */}
              <div className="space-y-4">
                 <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                    Description
                 </h2>
                 <p className="text-portal-muted text-sm leading-relaxed font-medium">
                    {movie.description}
                 </p>
              </div>

              {/* 6. Genres */}
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black tracking-tight">Genres</h2>
                    <div className="p-1.5 bg-white border border-portal-border rounded-lg shadow-sm">
                       <Info className="w-4 h-4 text-portal-muted" />
                    </div>
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {movie.genres.map(g => (
                       <div key={g} className="flex items-center gap-2 bg-white border border-portal-border px-4 py-1.5 rounded-lg text-xs font-bold text-portal-muted shadow-sm hover:border-portal-accent transition-colors">
                          <div className="w-3.5 h-3.5 bg-portal-muted/10 rounded" />
                          {g}
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* 7. Available Downloads */}
           <DownloadSection downloads={movie.downloads} />
        </div>
      </main>

      <ViewTracker movieId={parseInt(id)} />
    </div>
  );
}

function Play(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 4v16l13-8L7 4z" />
    </svg>
  );
}
