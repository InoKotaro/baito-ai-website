'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabaseClient';

export default function Header({ isMenuOpen, setIsMenuOpen }) {
  // ナビゲーション項目を配列で定義し、コードの重複を避ける
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setIsMenuOpen(false); // 認証状態が変わったらメニューを閉じる
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh(); // ページをリフレッシュしてヘッダーを再レンダリング
  };

  const navItems = [
    { href: '/', label: 'ホーム' },
    { href: '/news', label: 'お知らせ' },
  ];
  if (user) {
    navItems.push({ href: '/applications', label: '応募一覧' });
  }

  // リンクのリストを生成するコンポーネント
  const NavLinks = ({ isMobile = false }) => (
    <>
      {navItems.map((item) => (
        <li
          key={item.href}
          className={isMobile ? 'border-b-2 border-orange-400' : ''}
        >
          <Link
            href={item.href}
            className={`block text-gray-600 hover:text-orange-500 ${isMobile ? 'py-6' : ''}`}
            onClick={() => isMobile && setIsMenuOpen(false)} // モバイル時のみクリックでメニューを閉じる
          >
            {item.label}
          </Link>
        </li>
      ))}
      {user ? (
        <li className={isMobile ? 'border-b-2 border-orange-400' : ''}>
          <button
            type="button"
            className={`block w-full text-left text-gray-600 hover:text-orange-500 ${isMobile ? 'py-6' : ''}`}
            onClick={async () => {
              await handleLogout();
              if (isMobile) setIsMenuOpen(false);
            }}
          >
            ログアウト
          </button>
        </li>
      ) : (
        <>
          <li className={isMobile ? 'border-b-2 border-orange-400' : ''}>
            <Link href="/login" className={`block text-gray-600 hover:text-orange-500 ${isMobile ? 'py-6' : ''}`} onClick={() => isMobile && setIsMenuOpen(false)}>ログイン</Link>
          </li>
          <li className={isMobile ? 'border-b-2 border-orange-400' : ''}>
            <Link href="/signup" className={`block text-gray-600 hover:text-orange-500 ${isMobile ? 'py-6' : ''}`} onClick={() => isMobile && setIsMenuOpen(false)}>新規登録</Link>
          </li>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-20 border-b-4 border-orange-400 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/BaitoAI-logo.png"
            alt="Baito AI ロゴ"
            width={150}
            height={40}
            priority
          />
        </Link>

        {/* ＝＝＝＝＝＝＝ハンバーガーメニュー＝＝＝＝＝＝＝ */}
        {/* 開くボタン */}
        {!isMenuOpen && (
          <div className="z-30 md:hidden">
            <button
              onClick={() => setIsMenuOpen(true)}
              type="button"
              className="text-gray-700 hover:text-orange-500 focus:outline-none"
              aria-label="メニューを開閉する"
            >
              <svg
                className="h-9 w-9"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        )}

        <nav className="hidden md:block">
          <ul className="text-md flex items-center gap-6 font-bold">
            {user && (
              <li className="text-blue-700">
                こんにちは {user.user_metadata?.full_name || user.email}さん
              </li>
            )}
            <NavLinks />
          </ul>
        </nav>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity md:hidden"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav
        className={`fixed right-0 top-0 z-40 h-full w-64 transform bg-white p-6 shadow-lg transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="モバイルナビゲーション"
      >
        {/* 閉じるボタン */}
        <button
          onClick={() => setIsMenuOpen(false)}
          type="button"
          className="absolute right-6 top-4 text-gray-700 hover:text-orange-500 focus:outline-none"
          aria-label="メニューを閉じる"
        >
          <svg
            className="h-9 w-9"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <ul className="flex flex-col pt-16 font-bold">
          {user && (
            <li className="border-b-2 border-orange-400 py-6 text-blue-700">
              こんにちは {user.user_metadata?.full_name || user.email}さん
            </li>
          )}
          <NavLinks isMobile />
        </ul>
      </nav>
      {/* ＝＝＝＝＝＝＝ハンバーガーメニュー＝＝＝＝＝＝＝ */}
    </header>
  );
}
