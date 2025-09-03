'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaTrashCan } from 'react-icons/fa6';

import AdminAuthGuard from '@/app/components/AdminAuthGuard';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { admin } = useAdminAuth();
  const router = useRouter();

  // 求人一覧を取得
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/jobs');
      const data = await response.json();

      if (data.success) {
        // 管理者の企業の求人のみフィルタリング
        const adminJobs = data.jobs.filter(
          (job) => job.company === admin?.name,
        );
        setJobs(adminJobs);
      } else {
        setError('求人一覧の取得に失敗しました');
      }
    } catch (err) {
      setError('エラーが発生しました: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin) {
      fetchJobs();
    }
  }, [admin]);

  // 求人削除
  const handleDeleteJob = async (jobId) => {
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
        // 一覧を再取得
        fetchJobs();
      } else {
        alert('削除に失敗しました: ' + (data.error || '不明なエラー'));
      }
    } catch (err) {
      alert('削除時エラー: ' + err.message);
    }
  };

  // 求人編集ページへ遷移
  const handleEditJob = (jobId) => {
    router.push(`/admin/job-edit/${jobId}`);
  };

  if (loading) {
    return (
      <AdminAuthGuard>
        <div className="flex min-h-screen flex-col bg-orange-50 text-gray-700">
          {admin && <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />}
          <main className="mx-auto mb-8 mt-8 w-full max-w-6xl flex-grow px-4">
            <div className="flex items-center justify-center py-12">
              <p className="text-lg text-gray-600">読み込み中</p>
            </div>
          </main>
          <Footer />
        </div>
      </AdminAuthGuard>
    );
  }

  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen flex-col bg-orange-50 text-gray-700">
        {admin && <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />}
        <main className="mx-auto mb-8 mt-8 w-full max-w-6xl flex-grow px-4">
          <div className="rounded-lg bg-white p-8 shadow-md">
            <div className="mb-6 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              <h1 className="text-3xl font-bold text-blue-800">掲載求人一覧</h1>
              <button
                onClick={() => router.push('/admin/job-create')}
                className="rounded-lg bg-orange-500 px-6 py-2 font-bold text-white transition-colors hover:bg-orange-600"
              >
                新規求人作成
              </button>
            </div>

            {error && (
              <div className="mb-6 rounded-md bg-red-50 p-4">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {jobs.length === 0 ? (
              <div className="py-12 text-center">
                <p className="mb-4 text-lg text-gray-600">
                  まだ求人が登録されていません
                </p>
                <button
                  onClick={() => router.push('/admin/job-create')}
                  className="rounded-lg bg-orange-500 px-6 py-2 font-bold text-white transition-colors hover:bg-orange-600"
                >
                  最初の求人を作成する
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="mb-4">
                      {job.image_url && (
                        <img
                          src={job.image_url}
                          alt={job.title}
                          className="mb-3 h-32 w-full rounded-md object-cover"
                        />
                      )}
                      <h3 className="mb-2 text-lg font-bold text-gray-900">
                        {job.title}
                      </h3>
                      <p className="mb-2 text-sm text-gray-600">
                        {job.company}
                      </p>
                      <p className="line-clamp-3 text-sm text-gray-700">
                        {job.description}
                      </p>
                    </div>

                    <div className="mb-4 text-sm text-gray-600">
                      <p>時給: ¥{job.wage?.toLocaleString()}</p>
                      <p>勤務時間: {job.workinghours}</p>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-sm font-medium text-white transition-colors hover:bg-red-600"
                      >
                        <FaTrashCan />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </AdminAuthGuard>
  );
}
