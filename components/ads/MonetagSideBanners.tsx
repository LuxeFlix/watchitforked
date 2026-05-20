'use client';

import { useEffect } from 'react';

const MONETAG_ZONE_ID = '11034637';
const MONETAG_SCRIPT_SRC = 'https://nap5k.com/tag.min.js';
const MONETAG_SCRIPT_ID = `monetag-zone-${MONETAG_ZONE_ID}`;

export default function MonetagSideBanners() {
  useEffect(() => {
    if (document.getElementById(MONETAG_SCRIPT_ID)) {
      return;
    }

    const script = document.createElement('script');
    script.id = MONETAG_SCRIPT_ID;
    script.dataset.zone = MONETAG_ZONE_ID;
    script.src = MONETAG_SCRIPT_SRC;

    const target = [document.documentElement, document.body].filter(Boolean).pop();
    target?.appendChild(script);
  }, []);

  return null;
}