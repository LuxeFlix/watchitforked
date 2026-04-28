'use client';

import { useEffect } from 'react';

export default function ViewTracker({ movieId }: { movieId: number }) {
  useEffect(() => {
    fetch(`/api/movies/${movieId}/views`, { method: 'POST' }).catch(() => {});
  }, [movieId]);

  return null;
}
