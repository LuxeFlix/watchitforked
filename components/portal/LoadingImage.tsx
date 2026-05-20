'use client';

import Image, { type ImageProps } from 'next/image';
import { useEffect, useState } from 'react';

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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  return (
    <div className={wrapperClassName}>
      {!loaded && <div className={`absolute inset-0 animate-pulse rounded-[inherit] ${skeletonClassName}`} aria-hidden="true" />}
      <Image
        {...props}
        loading={eager ? 'eager' : props.loading}
        src={src}
        alt={alt}
        onLoad={(event) => {
          setLoaded(true);
          onLoad?.(event);
        }}
        className={`${className ?? ''} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`.trim()}
      />
    </div>
  );
}