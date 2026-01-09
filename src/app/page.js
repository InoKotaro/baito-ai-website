import { Suspense } from 'react';

import PageClient from '@/app/components/PageClient';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <Suspense fallback={<div>読み込み中</div>}>
      <PageClient />
    </Suspense>
  );
}
