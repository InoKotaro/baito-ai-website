import { Suspense } from 'react';

import AdminAuthGuard from '@/app/components/AdminAuthGuard';

import AdminJobsPageContent from './AdminJobsPageContent';

function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-orange-50 text-gray-700">
      <main className="mx-auto mb-8 mt-8 w-full max-w-6xl flex-grow px-4">
        <div className="flex items-center justify-center py-12">
          <p className="text-lg text-gray-600">読み込み中</p>
        </div>
      </main>
    </div>
  );
}

export default function AdminJobsPage() {
  return (
    <AdminAuthGuard>
      <Suspense fallback={<Loading />}>
        <AdminJobsPageContent />
      </Suspense>
    </AdminAuthGuard>
  );
}