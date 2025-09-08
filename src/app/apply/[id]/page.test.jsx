import '@testing-library/jest-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import ApplyPage from './page';

// 外部依存関係をモック
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
  notFound: jest.fn(),
}));

jest.mock('@/app/components/BackButton', () => () => <button>戻る</button>);
jest.mock('@/app/components/Header', () => () => <header>Header</header>);
jest.mock('@/app/components/Footer', () => () => <footer>Footer</footer>);

// Supabaseクライアントをモックし、その構造をファクトリ内で直接定義
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  },
}));

// モックが定義された後に、モック化されたsupabaseオブジェクトをインポート
import { supabase } from '@/lib/supabaseClient';

// モックデータ
const mockJob = {
  id: 1,
  imageurl: '/images/no-image.jpg',
  jobtitle: 'テスト求人',
  companyname: 'テスト株式会社',
  line: {
    railwayCompany: { railwayCompanyName: 'AI電鉄' },
    lineName: '環状線',
  },
  occupation: { occupationName: '接客・サービス' },
  hourlywage: 1200,
  workinghours: '10:00 - 19:00',
};

const mockUser = {
  id: 'user-uuid-123',
  email: 'test@example.com',
};

const mockDbUser = {
  id: 123,
};

describe('APIモックを使用したApplyPageのUI', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    // インポートされた `supabase` モックオブジェクトにアクセスして、クリアし設定する
    supabase.auth.getUser.mockClear();
    supabase.from.mockClear();

    // auth.getUserをモックして有効なユーザーを返すように設定
    supabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    // supabase.from()の連続した呼び出しをモック
    supabase.from.mockImplementation((tableName) => {
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn(),
      };

      if (tableName === 'Job') {
        // useEffectで求人詳細を取得するために使用
        mockChain.single.mockResolvedValue({ data: mockJob, error: null });
      } else if (tableName === 'User') {
        // useEffectとhandleApplyClickで使用
        mockChain.single.mockResolvedValue({ data: mockDbUser, error: null });
      } else if (tableName === 'JobApplication') {
        // 非同期でデータを挿入する処理を想定し、成功時に { error: null } を返すように設定
        mockChain.insert.mockResolvedValue({ error: null });
        // useEffectで応募済みかチェックするためのsingleモック
        // "not found"をシミュレートして応募ページがレンダリングされるようにする
        mockChain.single.mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' },
        });
      }
      return mockChain;
    });
  });

  test('応募ボタンを描画し、クリック時の送信中状態を処理できること', async () => {
    render(<ApplyPage params={{ id: '1' }} />);

    // コンポーネントがデータ読み込みを完了し、求人タイトルを表示するのを待つ
    expect(await screen.findByText('テスト求人')).toBeInTheDocument();

    // 初期状態の応募ボタンを見つける
    const applyButton = screen.getByRole('button', { name: '応募を確定する' });
    expect(applyButton).toBeInTheDocument();
    expect(applyButton).not.toBeDisabled();

    // 応募ボタンをクリックする
    fireEvent.click(applyButton);

    // クリック後、ボタンが「送信中」の状態になる
    await waitFor(() => {
      const submittingButton = screen.getByRole('button', { name: '送信中' });
      expect(submittingButton).toBeInTheDocument();
      expect(submittingButton).toBeDisabled();
    });

    // モックされたAPI呼び出しが完了した後、成功モーダルが表示されるはず
    await waitFor(() => {
      expect(screen.getByText('応募が完了しました')).toBeInTheDocument();
    });

    // 送信中ボタンは表示されなくなるはず
    expect(
      screen.queryByRole('button', { name: '送信中' }),
    ).not.toBeInTheDocument();
  });
});
