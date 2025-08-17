'use client';

import Link from 'next/link';
import { useState } from 'react';

import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import { supabase } from '@/lib/supabaseClient';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage(
        '登録ありがとうございます！確認メールを送信しましたので、ご確認ください。',
      );
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-orange-50 text-gray-700">
      <Header />
      <main className="mx-auto mt-24 w-full max-w-md flex-grow px-4">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-6 text-center text-2xl font-bold">新規登録</h1>
          <form onSubmit={handleSignUp}>
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
                minLength="6"
                className="w-full rounded-md border border-gray-300 p-2 focus:border-orange-500 focus:outline-none focus:ring"
              />
              <p className="mt-1 text-xs text-gray-500">
                6文字以上で入力してください。
              </p>
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
            >
              登録する
            </button>
            {error && <p className="mt-4 text-center text-red-500">{error}</p>}
            {message && (
              <p className="mt-4 text-center text-green-500">{message}</p>
            )}
          </form>
          <p className="mt-6 text-center text-sm">
            すでにアカウントをお持ちですか？{' '}
            <Link href="/login" className="text-orange-600 hover:underline">
              ログイン
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
