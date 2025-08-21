'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function CompanyLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { admin, loading, login } = useAdminAuth();

  // 既にログインしている場合は求人作成ページにリダイレクト
  useEffect(() => {
    if (!loading && admin) {
      router.push('/admin/job-create');
    }
  }, [admin, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      router.push('/admin/job-create');
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  // ローディング中または既にログイン済みの場合は何も表示しない
  if (loading || admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50">
        <p className="text-lg text-gray-600">読み込み中</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-orange-50 text-gray-700">
      <Header />
      <main className="mx-auto mb-8 mt-24 w-full max-w-md flex-grow px-4">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-6 text-center text-3xl font-bold text-blue-800">
            企業様ログイン
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                メールアドレス
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 sm:text-sm"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                パスワード
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 sm:text-sm"
                placeholder="パスワード"
              />
            </div>
            {error && (
              <div className="rounded-md bg-red-50 p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-orange-500 px-8 py-3 font-bold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isLoading ? 'ログイン中' : 'ログイン'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
