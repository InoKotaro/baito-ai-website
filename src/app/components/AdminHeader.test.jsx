import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import React from 'react';

import { useAdminAuth } from '@/hooks/useAdminAuth';

import AdminHeader from './AdminHeader';

// 外部フックとNext.jsの機能をモック化
jest.mock('@/hooks/useAdminAuth');

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

jest.mock('next/image', () => {
  return ({ src, alt }) => {
    return <img src={src} alt={alt} />;
  };
});

describe('AdminHeader', () => {
  const mockAdmin = { name: 'デモ株式会社' };
  const mockLogout = jest.fn();

  beforeEach(() => {
    // useAdminAuthフックが返す値を設定
    useAdminAuth.mockReturnValue({
      admin: mockAdmin,
      logout: mockLogout,
    });
    // 各テストの前にモックをリセット
    mockLogout.mockClear();
  });

  test('管理者ログイン時にヘッダーが正しく表示される', () => {
    render(<AdminHeader isMenuOpen={false} setIsMenuOpen={() => {}} />);

    // ロゴの表示確認
    expect(screen.getByAltText('Baito AI ロゴ')).toBeInTheDocument();

    // 管理者名の表示確認（PC用とモバイル用の2つ）
    const adminNameDisplays = screen.getAllByText('デモ株式会社 様専用ページ');
    expect(adminNameDisplays.length).toBe(2);
    expect(adminNameDisplays[0]).toBeInTheDocument();

    // ナビゲーションリンクの表示確認（PC用とモバイル用の2セット）
    // getAllByTextを使用して、重複する要素をテスト
    expect(screen.getAllByText('新規求人作成')[0]).toBeInTheDocument();
    expect(screen.getAllByText('掲載求人一覧')[0]).toBeInTheDocument();
    expect(screen.getAllByText('応募者一覧')[0]).toBeInTheDocument();
    expect(screen.getAllByText('ログアウト')[0]).toBeInTheDocument();
  });
});
