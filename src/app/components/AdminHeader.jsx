'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function AdminHeader({ isMenuOpen, setIsMenuOpen, onLogoClick }) {
  const { admin, logout: adminLogout } = useAdminAuth();

  const handleAdminLogout = async () => {
    try {
      await adminLogout();
    } catch (error) {
      console.error('管理者ログアウトエラー:', error);
    }
  };

  const AdminNavLinks = ({ admin, isMobile = false, onLogout, onLinkClick }) => {
    const adminNavItems = [
      { href: '/admin/job-create', label: '新規求人作成' },
      { href: '/admin/jobs', label: '掲載求人一覧' },
      { href: '/admin/applicants', label: '応募者一覧' },
    ];

    const handleLogoutClick = async () => {
      await onLogout();
      if (onLinkClick) onLinkClick();
    };

    return (
      <>
        {admin && (
          <>
            {adminNavItems.map((item) => (
              <li key={item.href} className={isMobile ? 'border-b-2 border-orange-400' : ''}>
                <Link
                  href={item.href}
                  className={`block text-gray-600 hover:text-orange-500 ${isMobile ? 'py-6' : ''}`}
                  onClick={onLinkClick}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className={isMobile ? 'border-b-2 border-orange-400' : ''}>
              <button
                type="button"
                className={`block w-full text-left text-gray-600 hover:text-orange-500 ${isMobile ? 'py-6' : ''}`}
                onClick={handleLogoutClick}
              >
                ログアウト
              </button>
            </li>
          </>
        )}
      </>
    );
  };

  return (
    <header className="sticky top-0 z-20 border-b-4 border-orange-400 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-6">
        <Link href="/admin/jobs" className="flex items-center gap-3" onClick={onLogoClick}>
          <Image src="/images/BaitoAI-logo.png" alt="Baito AI ロゴ" width={150} height={40} priority style={{ height: 'auto' }} />
        </Link>

        {!isMenuOpen && admin && (
          <div className="z-30 md:hidden">
            <button
              onClick={() => setIsMenuOpen(true)}
              type="button"
              className="text-gray-700 hover:text-orange-500 focus:outline-none"
              aria-label="メニューを開閉する"
            >
              <svg className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        )}

        <nav className="hidden md:block">
          <ul className="text-md flex items-center gap-6 font-bold">
            {admin && <li className="text-blue-700">{admin.name} 様専用ページ</li>}
            <AdminNavLinks admin={admin} onLogout={handleAdminLogout} onHomeClick={onLogoClick} />
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
          <svg className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <ul className="flex flex-col pt-16 font-bold">
          {admin && <li className="border-b-2 border-orange-400 py-6 text-blue-700">{admin.name} 様専用ページ</li>}
          <AdminNavLinks admin={admin} isMobile onLogout={handleAdminLogout} onLinkClick={() => setIsMenuOpen(false)} onHomeClick={onLogoClick} />
        </ul>
      </nav>
    </header>
  );
}
