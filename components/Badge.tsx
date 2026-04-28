import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'quality' | 'language' | 'genre';
  className?: string;
}

export default function Badge({ children, variant = 'language', className }: BadgeProps) {
  let variantStyles = 'bg-gray-800 text-gray-300';

  if (variant === 'quality') {
    const quality = children?.toString().toUpperCase();
    if (quality === '2K' || quality === '4K') variantStyles = 'bg-purple-600 text-white';
    else if (quality === '1080P') variantStyles = 'bg-blue-600 text-white';
    else if (quality === '720P') variantStyles = 'bg-green-600 text-white';
    else if (quality === '520P' || quality === '480P') variantStyles = 'bg-yellow-600 text-white';
    else if (quality === 'CAM') variantStyles = 'bg-red-600 text-white';
    else variantStyles = 'bg-zinc-700 text-zinc-300';
  } else if (variant === 'genre') {
    variantStyles = 'bg-zinc-800/50 border border-zinc-700 text-zinc-400';
  }

  return (
    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider', variantStyles, className)}>
      {children}
    </span>
  );
}
