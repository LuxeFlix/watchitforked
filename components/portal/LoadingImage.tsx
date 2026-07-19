'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

type LoadingImageProps = ImageProps & {
  wrapperClassName: string;
  skeletonClassName?: string;
  eager?: boolean;
};

export default function LoadingImage({
  wrapperClassName,
  skeletonClassName = 'bg-portal-border/30',
  className,
  src,
  alt,
  eager = false,
  onLoad,
  ...props
}: LoadingImageProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [errorSrc, setErrorSrc] = useState<string | null>(null);
  const isPriority = eager || props.priority === true;
  const status = loadedSrc === src ? 'loaded' : errorSrc === src ? 'error' : 'loading';

  return (
    <div className={wrapperClassName}>
      {status !== 'loaded' && (
        <div
          className={`absolute inset-0 rounded-[inherit] ${status === 'error' ? 'bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200' : `animate-pulse ${skeletonClassName}`}`}
          aria-hidden="true"
        />
      )}
      <Image
        {...props}
        loading={isPriority ? 'eager' : props.loading}
        src={src}
        alt={alt}
        draggable={false}
        onLoad={(event) => {
          setLoadedSrc(String(src));
          setErrorSrc(null);
          onLoad?.(event);
        }}
        onError={(event) => {
          setErrorSrc(String(src));
          props.onError?.(event);
        }}
        className={`${className ?? ''} select-none transition-opacity duration-300 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`.trim()}
      />
      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center rounded-[inherit] bg-gradient-to-br from-slate-200 via-white to-slate-100 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
          Failed to load
        </div>
      )}
    </div>
  );
}
