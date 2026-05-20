'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ViewTracker({ movieId }: { movieId: number }) {
  const router = useRouter();

  useEffect(() => {
    const cookieName = `viewed_${movieId}`;
    const viewed = document.cookie.split('; ').find(row => row.startsWith(`${cookieName}=`));
    
    if (!viewed) {
      fetch(`/api/movies/${movieId}/views`, { method: 'POST' })
        .then(response => {
          if (response.ok) {
            router.refresh();
          }
        })
        .catch(() => {});
      
      // Set cookie to expire at end of day
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      document.cookie = `${cookieName}=1; path=/; expires=${tomorrow.toUTCString()}`;
    }
  }, [movieId, router]);

  return null;
}
