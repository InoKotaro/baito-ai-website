'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import { supabase } from '@/lib/supabaseClient';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage('');
    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      // Also create a record in our public User table
      // Let the DB auto-generate the integer ID
      const { error: insertError } = await supabase.from('User').insert([
        {
          name: name,
          email: email,
          password: '', // Never store plaintext passwords
        },
      ]);

      if (insertError) {
        setError(insertError.message);
      } else {
        setMessage('登録が完了しました。\nトップページへ自動で移ります。');
        setName('');
        setEmail('');
        setPassword('');
        setTimeout(() => {
          router.push('/');
        }, 3000); // 3秒後にトップページへリダイレクト
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-orange-50 text-gray-700">
      <Header />
      <main className="mx-auto mt-9 w-full max-w-md flex-grow px-4 md:mt-24">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-6 text-center text-2xl font-bold">新規登録</h1>
          <form onSubmit={handleSignUp}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-600"
              >
                お名前
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="倍戸 一郎"
                className="w-full rounded-md border border-gray-300 p-2 focus:border-orange-500 focus:outline-none focus:ring"
              />
            </div>
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
                placeholder="example@email.com"
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
              disabled={isLoading}
              className="w-full rounded-md bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-orange-300"
            >
              {isLoading ? '登録中' : '登録する'}
            </button>
            {error && <p className="mt-4 text-center text-red-500">{error}</p>}
            {message && (
              <p className="mt-4 whitespace-pre-line text-center text-green-700">
                {message}
              </p>
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
