'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import { supabase } from '@/lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError('メールアドレスまたはパスワードが違います。');
      } else if (data.user) {
        // ログイン成功後、少し待ってからリダイレクト
        setTimeout(() => {
          router.push('/');
        }, 100);
      }
    } catch (error) {
      console.error('ログインエラー:', error);
      setError('ログイン中にエラーが発生しました。');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-orange-50 text-gray-700">
      <Header />
      <main className="mx-auto mt-9 w-full max-w-md flex-grow px-4 md:mt-24">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-6 text-center text-2xl font-bold">ログイン</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-600"
              >
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 p-2 focus:border-orange-500 focus:outline-none focus:ring"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-600"
              >
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 p-2 focus:border-orange-500 focus:outline-none focus:ring"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
            >
              ログイン
            </button>
            {error && <p className="mt-4 text-center text-red-500">{error}</p>}
          </form>
          <p className="mt-6 text-center text-sm">
            アカウントをお持ちでないですか？{' '}
            <Link href="/signup" className="text-orange-600 hover:underline">
              新規登録
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
