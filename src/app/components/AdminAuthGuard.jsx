'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function AdminAuthGuard({ children }) {
  const { admin, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    // 認証状態の確認が完了し、管理者でなければログインページにリダイレクト
    if (!loading && !admin) {
      router.push('/admin');
    }
  }, [admin, loading, router]);

  // ローディング中、またはリダイレクト中はローディング画面を表示
  if (loading || !admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50">
        <p className="text-lg text-gray-600">読み込み中</p>
      </div>
    );
  }

  // 管理者であれば子コンポーネントを表示
  return <>{children}</>;
}
