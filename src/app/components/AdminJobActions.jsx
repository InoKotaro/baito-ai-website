'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function AdminJobActions({ jobId, companyName }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { admin } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    // 管理者認証をチェック
    if (admin && admin.name === companyName) {
      setIsAdmin(true);
    }
    setLoading(false);
  }, [admin, companyName]);

  const handleDeleteJob = async () => {
    if (!confirm('この求人を削除しますか？この操作は取り消せません。')) {
      return;
    }

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        alert('求人を削除しました');
        // 求人一覧ページにリダイレクト
        router.push('/admin/jobs');
      } else {
        alert('削除に失敗しました: ' + (data.error || '不明なエラー'));
      }
    } catch (err) {
      alert('削除時エラー: ' + err.message);
    }
  };

  const handleEditJob = () => {
    router.push(`/admin/job-edit/${jobId}`);
  };

  // ローディング中は何も表示しない
  if (loading) {
    return null;
  }

  // 管理者でない場合は何も表示しない
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleEditJob}
        className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
      >
        編集
      </button>
      <button
        onClick={handleDeleteJob}
        className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
      >
        削除
      </button>
    </div>
  );
}
