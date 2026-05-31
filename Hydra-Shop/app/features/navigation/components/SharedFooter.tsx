'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { getActiveTcgs } from '@/features/tcg/api/getActiveTcgs';
import type { TcgApiResponse } from '@/features/tcg/types';

const Footer = dynamic(() => import('./Footer').then((mod) => mod.Footer), {
  ssr: true,
});

export function SharedFooter() {
  const pathname = usePathname();
  const [tcgCategories, setTcgCategories] = useState<TcgApiResponse[]>([]);

  useEffect(() => {
    getActiveTcgs().then((tcgs) => setTcgCategories(tcgs));
  }, []);

  // Don't show footer on login and signup pages
  const hideFooter = pathname === '/login' || pathname === '/signup';

  if (hideFooter) {
    return null;
  }

  return <Footer tcgCategories={tcgCategories} />;
}
