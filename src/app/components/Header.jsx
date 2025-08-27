'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/lib/supabaseClient';

export default function Header({ isMenuOpen, setIsMenuOpen }) {
  // ナビゲーション項目を配列で定義し、コードの重複を避ける
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // 管理者ページでのみuseAdminAuthを使用
  const isAdminPage = pathname.startsWith('/admin');
  const { admin, logout: adminLogout } = useAdminAuth();

  // デバッグ用：現在の状態をログ出力
  useEffect(() => {
    console.log('Header 状態更新:', {
      user: user?.email,
      isLoading,
      isAdminPage,
      admin: isAdminPage ? admin?.email : 'N/A',
    });
  }, [user, isLoading, isAdminPage, admin]);

  useEffect(() => {
    let mounted = true;

    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (mounted) {
          console.log('初期セッション取得:', session?.user?.email);
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('セッション取得エラー:', error);
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          console.log(
            '認証状態変更:',
            event,
            session?.user?.email,
            'Session:',
            !!session,
          );

          switch (event) {
            case 'SIGNED_IN':
              console.log('ログイン成功:', session?.user?.email);
              setUser(session?.user ?? null);
              setIsLoading(false);
              break;
            case 'SIGNED_OUT':
              console.log('ログアウト発生:', session?.user?.email);
              setUser(null);
              setIsLoading(false);
              break;
            case 'TOKEN_REFRESHED':
              console.log('トークン更新:', session?.user?.email);
              setUser(session?.user ?? null);
              break;
            case 'USER_UPDATED':
              console.log('ユーザー更新:', session?.user?.email);
              setUser(session?.user ?? null);
              break;
            default:
              console.log('その他の認証イベント:', event, session?.user?.email);
              setUser(session?.user ?? null);
          }
        }
      },
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      console.log('ログアウト開始');
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('ログアウトエラー:', error);
        return;
      }

      console.log('ログアウト成功');
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await adminLogout();
    } catch (error) {
      console.error('管理者ログアウトエラー:', error);
    }
  };

  if (isAdminPage) {
    // 管理者ページ用のヘッダー
    return (
      <header className="sticky top-0 z-20 border-b-4 border-orange-400 bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 md:grid md:grid-cols-3 md:px-6">
          <Link href="/admin/job-create" className="flex items-center gap-3">
            <Image
              src="/images/BaitoAI-logo.png"
              alt="Baito AI ロゴ"
              width={150}
              height={40}
              priority
            />
          </Link>
          <div className="hidden text-lg font-bold text-blue-800 md:block md:text-center">
            {admin ? `${admin.name} 様専用ページ` : '企業様専用ページ'}
          </div>
          <nav className="md:justify-self-end">
            <ul className="text-md flex items-center gap-6 font-bold">
              {admin && (
                <>
                  <li>
                    <Link
                      href="/admin/applicants"
                      className="block text-gray-600 hover:text-orange-500"
                    >
                      応募者一覧
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleAdminLogout}
                      className="block text-gray-600 hover:text-orange-500"
                    >
                      ログアウト
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>
    );
  }

  // リンクのリストを生成するコンポーネント
  const NavLinks = ({ user, isMobile = false, onLogout, onLinkClick }) => {
    const navItems = [{ href: '/', label: 'ホーム' }];

    // ローディング中またはユーザーがログインしている場合
    if (!isLoading && user) {
      navItems.push({ href: '/applications', label: '応募一覧' });
      navItems.push({ href: '/mypage', label: 'マイページ' });
    }

    const handleLogoutClick = async () => {
      await onLogout();
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
              onClick={onLinkClick}
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

  return (
    <header className="sticky top-0 z-20 border-b-4 border-orange-400 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-6">
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
            {!isLoading && user && (
              <li className="text-blue-700">
                こんにちは {user.user_metadata?.full_name || user.email}さん
              </li>
            )}
            <NavLinks user={user} onLogout={handleLogout} />
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
          isMenuOpen && !isAdminPage ? 'translate-x-0' : 'translate-x-full'
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
          {!isLoading && user && (
            <li className="border-b-2 border-orange-400 py-6 text-blue-700">
              こんにちは {user.user_metadata?.full_name || user.email}さん
            </li>
          )}
          <NavLinks
            user={user}
            isMobile
            onLogout={handleLogout}
            onLinkClick={() => setIsMenuOpen(false)}
          />
        </ul>
      </nav>
      {/* ＝＝＝＝＝＝＝ハンバーガーメニュー＝＝＝＝＝＝＝ */}
    </header>
  );
}
