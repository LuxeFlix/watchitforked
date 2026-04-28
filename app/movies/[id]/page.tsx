import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye, Calendar, Globe, Monitor, Zap } from 'lucide-react';
import Badge from '@/components/Badge';
import SectionRow from '@/components/SectionRow';
import ViewTracker from '@/components/ViewTracker';
import { getMovieById, getRelatedMovies } from '@/lib/queries';

export default async function MovieDetailPage(
  props: PageProps<'/movies/[id]'>
) {
  const { id: rawId } = await props.params;
  const id = parseInt(rawId);

  if (isNaN(id)) notFound();

  const movie = await getMovieById(id);
  if (!movie) notFound();

  const related = await getRelatedMovies(movie.id, movie.genre);

  return (
    <div className="min-h-screen bg-background pb-20">
      <ViewTracker movieId={movie.id} />

      {/* Hero backdrop */}
      <div className="relative w-full h-[40vh] overflow-hidden">
        <img
          src={`${movie.poster_url}?w=1200&q=auto&f=auto`}
          alt=""
          className="w-full h-full object-cover blur-2xl scale-110 opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </div>

      {/* Main content — single column centered (tablet-style) */}
      <div className="max-w-2xl mx-auto px-6 -mt-48 relative z-10">
        {/* Poster */}
        <div className="w-52 mx-auto mb-8">
          <div className="aspect-[2/3] rounded-xl overflow-hidden border border-border shadow-2xl">
            <img
              src={`${movie.poster_url}?w=500&q=auto&f=auto`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Details — centered */}
        <div className="text-center space-y-5 animate-slide-up">
          <div className="flex flex-wrap justify-center items-center gap-2">
            <Badge variant="quality">{movie.quality}</Badge>
            <Badge variant="language">{movie.language}</Badge>
            <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
              {movie.type}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            {movie.title}
          </h1>

          <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-text-secondary">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {movie.year}
            </span>
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              {movie.language}
            </span>
            <span className="flex items-center gap-1">
              <Monitor className="w-3.5 h-3.5" />
              {movie.quality}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {movie.views.toLocaleString()} views
            </span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap justify-center gap-2">
            {movie.genre.map((g) => (
              <Link key={g} href={`/search?genre=${g}`}>
                <Badge variant="genre">{g}</Badge>
              </Link>
            ))}
          </div>

          {/* Description */}
          <p className="text-text-secondary text-sm leading-relaxed">
            {movie.description}
          </p>

          {/* Tags */}
          {movie.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {movie.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="text-[10px] text-text-secondary bg-elevated border border-border rounded-full px-3 py-1 hover:text-white hover:border-text-secondary transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Download Links Section */}
        {(() => {
          const links = [
            { label: '480p', url: movie.download_480p, color: 'text-green-400' },
            { label: '720p', url: movie.download_720p, color: 'text-blue-400' },
            { label: '1080p', url: movie.download_1080p, color: 'text-red-400' },
            { label: '2K', url: movie.download_2k, color: 'text-purple-400' },
          ].filter((l) => l.url);

          if (links.length === 0) return null;

          return (
            <div className="mt-10 space-y-6">
              <div className="border-t border-b border-border py-3">
                <h2 className="text-center text-lg font-bold text-cyan-400 tracking-wide">
                  ——== Download Links ==——
                </h2>
              </div>

              <div className="flex flex-col items-center gap-5">
                {links.map((link) => (
                  <div key={link.label} className="text-center space-y-2">
                    <p className={`${link.color} font-bold text-sm`}>{link.label}</p>
                    <a
                      href={link.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-lg font-bold text-sm transition-all duration-300 ease-out hover:scale-105 active:scale-95 shadow-lg"
                    >
                      <Zap className="w-4 h-4" />
                      CLICK HERE TO DOWNLOAD
                      <Zap className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>

              <div className="border-t border-border" />
            </div>
          );
        })()}

        {/* Sample Images Gallery */}
        {movie.sample_images.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-6 text-center">
              Screenshots
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {movie.sample_images.map((img, i) => (
                <div
                  key={i}
                  className="aspect-video rounded-xl overflow-hidden border border-border bg-card group"
                >
                  <img
                    src={`${img}?w=600&q=auto&f=auto`}
                    alt={`${movie.title} screenshot ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Related Movies */}
      {related.length > 0 && (
        <div className="mt-16">
          <SectionRow
            title="Related Movies"
            movies={related}
            seeAllLink={`/search?genre=${movie.genre[0]}`}
          />
        </div>
      )}
    </div>
  );
}
