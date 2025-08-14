'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Header({ isMenuOpen, setIsMenuOpen }) {
  // ナビゲーション項目を配列で定義し、コードの重複を避ける
  const navItems = [
    { href: '/', label: 'ホーム' },
    { href: '/news', label: 'お知らせ' },
    { href: '/applications', label: '応募一覧' },
  ];

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
      <li className={isMobile ? 'border-b-2 border-orange-400' : ''}>
        <button
          type="button"
          className={`block w-full text-left text-gray-600 hover:text-orange-500 ${isMobile ? 'py-6' : ''}`}
          onClick={() => isMobile && setIsMenuOpen(false)}
        >
          ログアウト
        </button>
      </li>
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
        <ul className="flex flex-col pt-32 font-bold">
          <NavLinks isMobile />
        </ul>
      </nav>
      {/* ＝＝＝＝＝＝＝ハンバーガーメニュー＝＝＝＝＝＝＝ */}
    </header>
  );
}
