import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-black text-primary mb-4">404</h1>
      <p className="text-xl font-bold text-white mb-2">Page not found</p>
      <p className="text-sm text-text-secondary mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="bg-primary hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold transition-all duration-300 ease-out hover:scale-105 active:scale-95"
      >
        Back to Home
      </Link>
    </div>
  );
}
