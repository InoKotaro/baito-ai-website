'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';

export default function CompanyLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // ここでバックエンドAPIへのログイン処理を呼び出します。
    // 今回はダミーとしてコンソールに情報を出力します。
    console.log('ログイン情報:', { email, password });
    // ログイン成功後、求人作成ページにリダイレクトします。
    router.push('/admin/job-create');
  };

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
                className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
                className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="パスワード"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full rounded-lg bg-orange-500 px-8 py-3 font-bold text-white transition-colors hover:bg-orange-600"
              >
                ログイン
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
