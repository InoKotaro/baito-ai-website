'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export default function PublicHeader({ onLogoClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { user, dbUser, loading: isLoading } = useAuth(); // Use context

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('ログアウトエラー:', error);
        return;
      }
      router.push('/login');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  const NavLinks = ({ isMobile = false, onLinkClick, onHomeClick }) => {
    const navItems = [{ href: '/', label: 'ホーム' }];
    if (!isLoading && user) {
      navItems.push({ href: '/applications', label: '応募一覧' });
      navItems.push({ href: '/mypage', label: 'マイページ' });
    }

    const handleLogoutClick = async () => {
      await handleLogout();
      if (onLinkClick) onLinkClick();
    };

    const handleHomeClick = () => {
      if (onHomeClick) onHomeClick();
      if (onLinkClick) onLinkClick();
    };

    return (
      <>
        {navItems.map((item) => (
          <li
            key={item.href}
            className={isMobile ? 'border-b-2 border-orange-400' : ''}
          >
            <Link
              href={item.href}
              className={`block text-gray-600 hover:text-orange-500 ${isMobile ? 'py-6' : ''}`}
              onClick={item.href === '/' ? handleHomeClick : onLinkClick}
            >
              {item.label}
            </Link>
          </li>
        ))}
        {!isLoading && user ? (
          <li className={isMobile ? 'border-b-2 border-orange-400' : ''}>
            <button
              type="button"
              className={`block w-full text-left text-gray-600 hover:text-orange-500 ${isMobile ? 'py-6' : ''}`}
              onClick={handleLogoutClick}
            >
              ログアウト
            </button>
          </li>
        ) : !isLoading ? (
          <>
            <li className={isMobile ? 'border-b-2 border-orange-400' : ''}>
              <Link
                href="/login"
                className={`block text-gray-600 hover:text-orange-500 ${isMobile ? 'py-6' : ''}`}
                onClick={onLinkClick}
              >
                ログイン
              </Link>
            </li>
            <li className={isMobile ? 'border-b-2 border-orange-400' : ''}>
              <Link
                href="/signup"
                className={`block text-gray-600 hover:text-orange-500 ${isMobile ? 'py-6' : ''}`}
                onClick={onLinkClick}
              >
                新規登録
              </Link>
            </li>
          </>
        ) : null}
      </>
    );
  };

  const displayName = dbUser?.name || user?.email;

  return (
    <header className="sticky top-0 z-20 border-b-4 border-orange-400 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={onLogoClick}
        >
          <Image
            src="/images/BaitoAI-logo.png"
            alt="Baito AI ロゴ"
            width={150}
            height={40}
            priority
          />
        </Link>

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
            {!isLoading && user && (
              <li className="text-blue-700">こんにちは {displayName}さん</li>
            )}
            <NavLinks onHomeClick={onLogoClick} />
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
          {!isLoading && user && (
            <li className="border-b-2 border-orange-400 py-6 text-blue-700">
              こんにちは {displayName}さん
            </li>
          )}
          <NavLinks
            isMobile
            onLinkClick={() => setIsMenuOpen(false)}
            onHomeClick={onLogoClick}
          />
        </ul>
      </nav>
    </header>
  );
}
