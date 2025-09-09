import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import React from 'react';

import { useAuth } from '@/context/AuthContext';

import PublicHeader from './PublicHeader';

// next/link, next/image, next/navigation をモック化
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

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// useAuthフックをモック化
jest.mock('@/context/AuthContext');

describe('PublicHeader', () => {
  // テストケース1: 未ログイン時の表示
  test('renders correctly when user is not logged in', () => {
    useAuth.mockReturnValue({ user: null, loading: false });
    render(<PublicHeader />);

    // ロゴが表示されていることを確認
    expect(screen.getByAltText('Baito AI ロゴ')).toBeInTheDocument();

    // 未ログイン時に表示されるべきリンク（getAllBy使用で重複を許容）
    expect(screen.getAllByText('ホーム')[0]).toBeInTheDocument();
    expect(screen.getAllByText('ログイン')[0]).toBeInTheDocument();
    expect(screen.getAllByText('新規登録')[0]).toBeInTheDocument();

    // ログイン時に表示されるべきリンクが表示されていないことを確認
    expect(screen.queryByText('マイページ')).not.toBeInTheDocument();
    expect(screen.queryByText('応募一覧')).not.toBeInTheDocument();
  });

  // テストケース2: ログイン時の表示
  test('renders correctly when user is logged in', () => {
    const mockUser = {
      user_metadata: {
        username: 'テストユーザー',
      },
    };
    useAuth.mockReturnValue({ user: mockUser, dbUser: { username: 'テストユーザー' }, loading: false });
    render(<PublicHeader />);

    // ロゴが表示されていることを確認
    expect(screen.getByAltText('Baito AI ロゴ')).toBeInTheDocument();

    // ログイン時に表示されるべきリンク（重複を許容）
    expect(screen.getAllByText('ホーム')[0]).toBeInTheDocument();
    expect(screen.getAllByText(/こんにちは\s+さん/)[0]).toBeInTheDocument(); // ユーザー名表示
    expect(screen.getAllByText('応募一覧')[0]).toBeInTheDocument();
    expect(screen.getAllByText('マイページ')[0]).toBeInTheDocument();
    expect(screen.getAllByText('ログアウト')[0]).toBeInTheDocument();

    // 未ログイン時に表示されるべきリンクが表示されていないことを確認
    expect(screen.queryByText('ログイン')).not.toBeInTheDocument();
    expect(screen.queryByText('新規登録')).not.toBeInTheDocument();
  });

  // テストケース3: ローディング中の表示
  test('renders loading state correctly', () => {
    useAuth.mockReturnValue({ user: null, loading: true });
    render(<PublicHeader />);

    // ロゴが表示されていることを確認
    expect(screen.getByAltText('Baito AI ロゴ')).toBeInTheDocument();

    // ローディング中はログイン/ログアウト関連のリンクが表示されないことを確認
    expect(screen.queryByText('ログイン')).not.toBeInTheDocument();
    expect(screen.queryByText('新規登録')).not.toBeInTheDocument();
    expect(screen.queryByText('マイページ')).not.toBeInTheDocument();
  });
});
