import '@testing-library/jest-dom';

import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import { supabase } from '@/lib/supabaseClient';

import ApplyButton from './ApplyButton';

// next/navigation のモック
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// supabaseClient のモック
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
          eq: jest.fn(() => ({
            // for the second .eq call
            single: jest.fn(),
          })),
        })),
      })),
    })),
  },
}));

const mockUser = { id: 'user-id-123', email: 'test@example.com' };
const mockDbUser = { id: 'db-user-id-456' };
const mockJobId = 'job-id-789';

describe('ApplyButton Authentication States', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('未ログインユーザーの場合、「ログインして応募」リンクを表示する', async () => {
    // モックのセットアップ：未ログイン状態を再現
    supabase.auth.getUser.mockResolvedValue({ data: { user: null } });

    render(<ApplyButton jobId={mockJobId} />);

    // ローディング完了後、「ログインして応募」リンクが表示されることを確認
    await waitFor(() => {
      const loginLink = screen.getByRole('link', { name: 'ログインして応募' });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/login');
    });
  });

  test('ログイン済みユーザー（未応募）の場合、「応募する」ボタンを表示する', async () => {
    // モックのセットアップ：ログイン済みで未応募の状態を再現
    supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });
    supabase.from.mockImplementation((tableName) => {
      if (tableName === 'User') {
        return {
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: mockDbUser }),
            }),
          }),
        };
      }
      if (tableName === 'JobApplication') {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                single: () => Promise.resolve({ error: { code: 'PGRST116' } }), // Not found
              }),
            }),
          }),
        };
      }
      return {
        select: () => ({ eq: () => ({ single: () => Promise.resolve({}) }) }),
      };
    });

    render(<ApplyButton jobId={mockJobId} />);

    // ローディング完了後、「応募する」ボタンが表示されることを確認
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: '応募する' }),
      ).toBeInTheDocument();
    });
  });

  test('応募済みユーザーの場合、「応募済み」ボタンを表示する', async () => {
    // モックのセットアップ：ログイン済みで応募済みの状態を再現
    supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });
    supabase.from.mockImplementation((tableName) => {
      if (tableName === 'User') {
        return {
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: mockDbUser }),
            }),
          }),
        };
      }
      if (tableName === 'JobApplication') {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                single: () => Promise.resolve({ data: { id: 'app-id' } }), // Found, meaning applied
              }),
            }),
          }),
        };
      }
      return {
        select: () => ({ eq: () => ({ single: () => Promise.resolve({}) }) }),
      };
    });

    render(<ApplyButton jobId={mockJobId} />);

    // ローディング完了後、「応募済み」ボタンが表示されることを確認
    await waitFor(() => {
      const appliedButton = screen.getByRole('button', { name: '応募済み' });
      expect(appliedButton).toBeInTheDocument();
      expect(appliedButton).toBeDisabled();
    });
  });
});
